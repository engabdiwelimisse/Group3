import Beneficiary from '../models/Beneficiary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const getMyBeneficiaryProfile = asyncHandler(async (req, res) => {
  const beneficiary = await Beneficiary.findOne({ userId: req.user.id });
  if (!beneficiary) throw new ApiError(404, 'NOT_FOUND', 'No beneficiary profile found for this account');
  res.json(beneficiary);
});

// Self-service submission: a beneficiary provides their identity info once.
// This only creates a 'pending' record — an admin/moderator must still
// verify it before any withdrawal can be requested (spec Section 15).
export const submitMyBeneficiaryProfile = asyncHandler(async (req, res) => {
  const { fullName, idDocumentUrl } = req.body;

  let beneficiary = await Beneficiary.findOne({ userId: req.user.id });
  if (beneficiary && beneficiary.verificationStatus === 'verified') {
    throw new ApiError(409, 'ALREADY_VERIFIED', 'This beneficiary profile is already verified');
  }

  if (beneficiary) {
    beneficiary.fullName = fullName;
    beneficiary.idDocumentUrl = idDocumentUrl;
    beneficiary.verificationStatus = 'pending';
    await beneficiary.save();
  } else {
    beneficiary = await Beneficiary.create({
      userId: req.user.id,
      fullName,
      idDocumentUrl,
      verificationStatus: 'pending',
    });
  }

  res.status(201).json(beneficiary);
});
