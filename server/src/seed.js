import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import mongoose from 'mongoose';

import User from './models/User.js';
import Beneficiary from './models/Beneficiary.js';
import Campaign from './models/Campaign.js';
import PayoutAccount from './models/PayoutAccount.js';

const PASSWORD = 'Password123!';

async function upsertUser({ fullName, email, phone, roles, verified = false }) {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  return User.findOneAndUpdate(
    { email },
    {
      fullName,
      email,
      phone,
      passwordHash,
      roles,
      emailVerified: verified,
      phoneVerified: verified,
      identityVerified: verified,
      status: 'active',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await connectDB();

  console.log('Clearing existing seed-relevant collections...');
  await Promise.all([
    User.deleteMany({ email: { $regex: /@kaalmo\.test$/ } }),
    Campaign.deleteMany({}),
    Beneficiary.deleteMany({}),
    PayoutAccount.deleteMany({}),
  ]);

  console.log('Creating users...');
  const admin = await upsertUser({
    fullName: 'Kaalmo Admin',
    email: 'admin@kaalmo.test',
    phone: '+252610000001',
    roles: ['admin'],
    verified: true,
  });

  const organizer1 = await upsertUser({
    fullName: 'Hodan Ali',
    email: 'hodan.organizer@kaalmo.test',
    phone: '+252610000002',
    roles: ['organizer'],
    verified: true,
  });

  const organizer2 = await upsertUser({
    fullName: 'Yusuf Warsame',
    email: 'yusuf.organizer@kaalmo.test',
    phone: '+252610000003',
    roles: ['organizer'],
    verified: true,
  });

  const donor1 = await upsertUser({
    fullName: 'Amina Cabdi',
    email: 'amina.donor@kaalmo.test',
    phone: '+252610000004',
    roles: ['donor'],
    verified: true,
  });

  const donor2 = await upsertUser({
    fullName: 'Cabdi Rashiid',
    email: 'abdi.donor@kaalmo.test',
    phone: '+252610000005',
    roles: ['donor'],
    verified: false,
  });

  const moderator = await upsertUser({
    fullName: 'Sagal Moderator',
    email: 'sagal.moderator@kaalmo.test',
    phone: '+252610000006',
    roles: ['moderator'],
    verified: true,
  });

  console.log('Creating payout accounts + beneficiaries...');
  const payoutAccount1 = await PayoutAccount.create({
    ownerId: organizer1._id,
    type: 'mobile_money',
    accountNumberMasked: '***1234',
    providerName: 'EVC Plus',
    verified: true,
  });

  const payoutAccount2 = await PayoutAccount.create({
    ownerId: organizer2._id,
    type: 'bank',
    accountNumberMasked: '***5678',
    providerName: 'Salaam Bank',
    verified: false,
  });

  const beneficiary1 = await Beneficiary.create({
    userId: organizer1._id,
    fullName: 'Amina Cabdi (Bukaan)',
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    verifiedBy: admin._id,
    payoutAccountId: payoutAccount1._id,
  });

  const beneficiary2 = await Beneficiary.create({
    userId: organizer2._id,
    fullName: 'Dugsiga Hodan',
    verificationStatus: 'pending',
    payoutAccountId: payoutAccount2._id,
  });

  console.log('Creating campaigns...');
  await Campaign.create([
    {
      organizerId: organizer1._id,
      beneficiaryId: beneficiary1._id,
      title: { so: 'Caawimo Caafimaad — Qaniinyo Kansar', en: 'Medical Help — Cancer Treatment' },
      story: {
        so: 'Amina waxay u baahan tahay $8,000 si loo daaweeyo kansarka. Fadlan naga caawi.',
        en: 'Amina needs $8,000 for cancer treatment. Please help us.',
      },
      category: 'Medical',
      subcategory: 'Treatment',
      tags: ['cancer', 'urgent'],
      goalAmount: 8000,
      raisedAmount: 3200,
      currency: 'USD',
      status: 'active',
      verificationBadges: ['identity_verified', 'beneficiary_verified'],
      region: 'Mogadishu',
    },
    {
      organizerId: organizer1._id,
      beneficiaryId: beneficiary1._id,
      title: { so: 'Gubasho Guri — Caawimo Degdeg ah', en: 'House Fire — Emergency Relief' },
      story: {
        so: 'Qoyska waxaa ku dhacay dab guri, waxay u baahan yihiin caawimo degdeg ah.',
        en: 'A family lost their home to fire and needs urgent shelter funds.',
      },
      category: 'Emergency',
      goalAmount: 3000,
      raisedAmount: 3000,
      currency: 'USD',
      status: 'goal_reached',
      verificationBadges: ['identity_verified'],
      region: 'Mogadishu',
    },
    {
      organizerId: organizer2._id,
      beneficiaryId: beneficiary2._id,
      title: { so: 'Dugsiga Hodan — Xarun Kombiyuutar', en: "Hodan School — Computer Lab" },
      story: {
        so: 'Dugsigu wuxuu u baahan yahay xarun kombiyuutar ah oo ay wax ku bartaan ardayda.',
        en: 'The school needs a computer lab for its students.',
      },
      category: 'School',
      goalAmount: 5000,
      raisedAmount: 0,
      currency: 'USD',
      status: 'under_review',
      region: 'Hargeisa',
    },
    {
      organizerId: organizer2._id,
      title: { so: 'Ceelka Beesha — Biyo Nadiif ah', en: 'Community Well — Clean Water' },
      story: {
        so: 'Beeshu waxay ururinaysaa lacag si loo qodo ceel biyo ah.',
        en: 'The village community is raising money to dig a well.',
      },
      category: 'Community',
      goalAmount: 6000,
      raisedAmount: 0,
      currency: 'USD',
      status: 'draft',
      region: 'Puntland',
    },
    {
      organizerId: organizer1._id,
      title: { so: 'Deeqda Waxbarasho — Jaamacad', en: 'Education Grant — University' },
      story: {
        so: 'Arday ayaa u baahan lacag dugsiyeed si uu u sii wato jaamacadda.',
        en: 'A student needs tuition funds to continue university.',
      },
      category: 'Education',
      goalAmount: 2500,
      raisedAmount: 900,
      currency: 'USD',
      status: 'completed',
      region: 'Mogadishu',
      endDate: new Date('2026-01-01'),
    },
  ]);

  console.log('\nSeed complete.\n');
  console.log('Login credentials (all users share the same password):');
  console.log(`  Password: ${PASSWORD}\n`);
  console.log('  Admin:      admin@kaalmo.test');
  console.log('  Organizer:  hodan.organizer@kaalmo.test');
  console.log('  Organizer:  yusuf.organizer@kaalmo.test');
  console.log('  Donor:      amina.donor@kaalmo.test');
  console.log('  Donor:      abdi.donor@kaalmo.test');
  console.log('  Moderator:  sagal.moderator@kaalmo.test');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
