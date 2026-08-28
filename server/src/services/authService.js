import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Verification from '../models/Verification.js';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendOrganizerConfirmationEmail } from './emailService.js';

const EMAIL_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h — used for organizer-request link tokens
const EMAIL_OTP_TTL_MS = 15 * 60 * 1000; // 15 minutes — email verification code

function generateOtp() {
  return crypto.randomInt(0, 1000000).toString().padStart(6, '0');
}

function issueTokens(user) {
  const payload = { sub: user._id.toString(), roles: user.roles };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

function toPublicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    roles: user.roles,
    language: user.language,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    identityVerified: user.identityVerified,
    status: user.status,
  };
}

export async function register({ fullName, email, phone, password, language }) {
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    throw new ApiError(409, 'ALREADY_EXISTS', 'An account with this email or phone already exists');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ fullName, email, phone, passwordHash, language });

  const code = generateOtp();
  await Verification.create({
    userId: user._id,
    type: 'email',
    status: 'pending',
    token: code,
    expiresAt: new Date(Date.now() + EMAIL_OTP_TTL_MS),
  });
  const emailResult = await sendVerificationEmail(user, code);
  if (!emailResult.delivered && !emailResult.dev) {
    // Don't block account creation on email delivery — but make the failure
    // visible instead of silently pretending the email went out.
    console.warn(`[authService] Verification email failed to send for ${user.email}:`, emailResult.error);
  }

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'ACCOUNT_DISABLED', 'This account is suspended or banned');
  }

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function refresh({ refreshToken }) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'INVALID_TOKEN', 'Refresh token is invalid or expired');
  }

  const user = await User.findById(payload.sub);
  if (!user || user.status !== 'active') {
    throw new ApiError(401, 'INVALID_TOKEN', 'Refresh token is invalid or expired');
  }

  return issueTokens(user);
}

export async function verifyEmailOtp(userId, code) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');

  if (user.emailVerified) {
    return { verified: true };
  }

  const record = await Verification.findOne({ userId: user._id, type: 'email', status: 'pending' }).sort({
    createdAt: -1,
  });

  if (!record || record.expiresAt < new Date()) {
    throw new ApiError(400, 'INVALID_CODE', 'This code has expired. Please request a new one.');
  }

  if (record.token !== code) {
    throw new ApiError(400, 'INVALID_CODE', 'That code is incorrect. Please check your email and try again.');
  }

  record.status = 'approved';
  await record.save();
  user.emailVerified = true;
  await user.save();

  return { verified: true };
}

export async function resendVerificationEmail(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');
  if (user.emailVerified) {
    throw new ApiError(409, 'ALREADY_VERIFIED', 'This email address is already verified');
  }

  await Verification.deleteMany({ userId: user._id, type: 'email', status: 'pending' });

  const code = generateOtp();
  await Verification.create({
    userId: user._id,
    type: 'email',
    status: 'pending',
    token: code,
    expiresAt: new Date(Date.now() + EMAIL_OTP_TTL_MS),
  });
  const result = await sendVerificationEmail(user, code);

  if (!result.delivered) {
    throw new ApiError(
      502,
      'EMAIL_SEND_FAILED',
      'The verification email could not be sent. Please try again shortly or contact support.'
    );
  }

  return { sent: true };
}

// Becoming an organizer requires its own dedicated email confirmation — a
// separate, deliberate step from general account email verification — so
// nobody ends up with organizer access just by loading a page (spec intent:
// "isn't easily becoming an organizer"). Requesting access never grants the
// role by itself; only clicking the emailed link does.
export async function requestOrganizerAccess(userId, { fullName, purpose } = {}) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');

  if (!user.emailVerified) {
    throw new ApiError(403, 'EMAIL_NOT_VERIFIED', 'Please verify your email address first');
  }
  if (user.roles.includes('organizer')) {
    throw new ApiError(409, 'ALREADY_ORGANIZER', 'This account already has organizer access');
  }

  if (fullName && fullName.trim() && fullName.trim() !== user.fullName) {
    user.fullName = fullName.trim();
    await user.save();
  }

  await Verification.deleteMany({ userId: user._id, type: 'organizer_request', status: 'pending' });

  const token = crypto.randomBytes(32).toString('hex');
  await Verification.create({
    userId: user._id,
    type: 'organizer_request',
    status: 'pending',
    token,
    expiresAt: new Date(Date.now() + EMAIL_TOKEN_TTL_MS),
  });

  const result = await sendOrganizerConfirmationEmail(user, token, purpose?.trim());
  if (!result.delivered) {
    throw new ApiError(
      502,
      'EMAIL_SEND_FAILED',
      'The confirmation email could not be sent. Please try again shortly.'
    );
  }

  return { sent: true };
}

export async function confirmOrganizerAccess(token) {
  const record = await Verification.findOne({ token, type: 'organizer_request' });
  if (!record) {
    throw new ApiError(400, 'INVALID_TOKEN', 'This confirmation link is invalid or expired');
  }

  // Idempotent for the same reason as email verification — link scanners can
  // consume a one-time token before the person actually clicks it.
  if (record.status === 'approved') {
    return { confirmed: true };
  }

  if (record.expiresAt < new Date()) {
    throw new ApiError(400, 'INVALID_TOKEN', 'This confirmation link is invalid or expired');
  }

  record.status = 'approved';
  await record.save();

  const user = await User.findById(record.userId);
  if (user && !user.roles.includes('organizer')) {
    user.roles.push('organizer');
    await user.save();
  }

  return { confirmed: true };
}

// Phone/SMS OTP is stubbed until an SMS gateway with confirmed Somali carrier
// reachability is chosen (spec Section 6). Structure is in place; no real
// codes are sent or checked yet.
export async function verifyOtp() {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Phone OTP verification is not yet available. SMS gateway integration is pending.');
}

export { toPublicUser, issueTokens };
