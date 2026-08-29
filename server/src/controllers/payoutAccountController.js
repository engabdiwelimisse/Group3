import PayoutAccount from '../models/PayoutAccount.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function maskAccountNumber(raw) {
  const digits = raw.replace(/\D/g, '');
  return `***${digits.slice(-4)}`;
}

export const listMyPayoutAccounts = asyncHandler(async (req, res) => {
  const accounts = await PayoutAccount.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
  res.json(accounts);
});

export const createPayoutAccount = asyncHandler(async (req, res) => {
  const { type, accountNumber, providerName } = req.body;
  const account = await PayoutAccount.create({
    ownerId: req.user.id,
    type,
    accountNumberMasked: maskAccountNumber(accountNumber),
    providerName,
    verified: false,
  });
  res.status(201).json(account);
});
