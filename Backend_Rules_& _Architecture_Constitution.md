# Kaalmo Backend Rules & Architecture Constitution

> **STATUS: MANDATORY**
>
> This document defines the backend engineering rules and architecture boundaries for the Kaalmo platform.
>
> Any AI coding agent, developer, or engineer working on the backend MUST follow these rules.
>
> The backend MUST remain consistent with the Kaalmo Product & Technical Specification.
>
> Do not invent architecture, features, financial behavior, permissions, or infrastructure outside the approved specification without explicit approval.

---

# 1. PRODUCT BACKEND IDENTITY

Kaalmo is a:

**Somalia-first trusted fundraising platform.**

The backend exists to support:

- Fundraising campaigns
- Donations
- Payments
- Beneficiaries
- Verification
- Withdrawals
- Trust & Safety
- Fraud detection
- Moderation
- Notifications
- Admin operations
- Auditability

The backend is NOT:

- A generic CRUD API
- A social network backend
- A generic SaaS backend
- A banking core
- A payment provider itself
- A mobile-app backend
- A microservices architecture by default

---

# 2. WEB-ONLY PLATFORM

Kaalmo is currently:

**WEB ONLY.**

The backend serves the responsive React web application.

Do NOT introduce backend architecture specifically for:

- Flutter
- Dart
- iOS
- Android
- Native mobile applications
- FCM push notifications for MVP

The API should still be cleanly designed because future clients may consume it, but do not build mobile-specific infrastructure now.

---

# 3. APPROVED TECHNOLOGY STACK

## Runtime

Node.js

## Framework

Express.js

## Database

MongoDB

## ODM

Mongoose

## API

REST

## API version

`/api/v1`

## Authentication

JWT:

- Short-lived access token
- Long-lived refresh token
- Refresh token rotation

## Password hashing

bcrypt or Argon2

Passwords must NEVER be stored in plaintext.

## Validation

Schema-based validation.

Recommended:

- Zod
- Joi

Choose one and use it consistently.

## File storage

S3-compatible object storage.

Examples:

- Cloudflare R2
- AWS S3

Do not store uploaded documents directly in MongoDB unless explicitly required.

## Email

Transactional email provider.

Examples:

- Resend
- SendGrid

## SMS / OTP

A Somalia-reachable SMS provider.

Provider availability MUST be verified before implementation.

---

# 4. ARCHITECTURE PRINCIPLE

Use a modular layered architecture.

Recommended:

```text
HTTP Request
    ↓
Route
    ↓
Middleware
    ↓
Controller
    ↓
Service
    ↓
Repository / Model
    ↓
MongoDB
```

For external integrations:

```text
Service
    ↓
Provider Interface
    ↓
Provider Adapter
    ↓
External Provider
```

Business logic MUST NOT live directly inside routes.

Business logic MUST NOT be duplicated across controllers.

Payment provider logic MUST NOT leak into donation logic.

---

# 5. RECOMMENDED BACKEND STRUCTURE

Use a domain-oriented structure.

Example:

```text
server/
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── env.js
│   │   ├── database.js
│   │   └── storage.js
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── campaigns/
│   │   ├── donations/
│   │   ├── payments/
│   │   ├── withdrawals/
│   │   ├── beneficiaries/
│   │   ├── verification/
│   │   ├── fraud/
│   │   ├── reports/
│   │   ├── notifications/
│   │   ├── admin/
│   │   └── support/
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   ├── rateLimit.js
│   │   ├── errorHandler.js
│   │   └── requestId.js
│   │
│   ├── integrations/
│   │   ├── payments/
│   │   │   ├── PaymentService.js
│   │   │   ├── providers/
│   │   │   ├── interfaces/
│   │   │   └── webhooks/
│   │   ├── email/
│   │   └── sms/
│   │
│   ├── shared/
│   │   ├── errors/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── logger/
│   │   └── security/
│   │
│   └── docs/
│       └── openapi/
│
├── tests/
├── .env.example
├── package.json
└── README.md
```

The exact folder naming may evolve, but the architectural boundaries MUST remain.

---

# 6. MODULAR ARCHITECTURE RULE

Each major domain should own its:

- Routes
- Controllers
- Services
- Validation schemas
- Models
- Business rules
- Tests

Example:

```text
campaigns/
├── campaign.routes.js
├── campaign.controller.js
├── campaign.service.js
├── campaign.model.js
├── campaign.validation.js
└── campaign.test.js
```

Do not create one giant:

```text
controllers.js
services.js
utils.js
```

containing unrelated business domains.

---

# 7. CONTROLLER RULE

Controllers are thin.

Controllers should:

1. Receive request
2. Read authenticated user
3. Validate input through middleware
4. Call service
5. Return response

Controllers MUST NOT contain:

- Payment business logic
- Fraud scoring logic
- Complex campaign lifecycle rules
- Withdrawal approval rules
- Ledger calculations
- Direct provider integration
- Large MongoDB workflows

Bad:

```text
Controller
→ Validate
→ Calculate fees
→ Call payment provider
→ Update donation
→ Update campaign
→ Send email
→ Create audit log
```

Good:

```text
Controller
→ DonationService.createDonation()
→ Response
```

The service orchestrates the business process.

---

# 8. SERVICE RULE

Services contain business logic.

Examples:

```text
AuthService
CampaignService
DonationService
PaymentService
WithdrawalService
VerificationService
FraudService
NotificationService
```

Services may call:

- repositories/models
- other domain services
- provider abstractions

Services MUST enforce business rules.

---

# 9. DATABASE RULE

MongoDB + Mongoose is the approved database layer.

Use schemas with:

- validation
- indexes
- timestamps
- references where appropriate

Do not use raw MongoDB queries when a safe Mongoose operation is sufficient.

Prevent:

- injection
- unvalidated filters
- arbitrary field updates

---

# 10. CORE DATA ENTITIES

The backend must support these core entities:

```text
User
Campaign
CampaignMember
Beneficiary
Donation
Payment
PaymentTransaction
PaymentWebhook
Withdrawal
Verification
Report
Notification
AuditLog
FraudCase
SupportTicket
```

Do not merge unrelated financial entities into one generic collection.

---

# 11. USER MODEL

User conceptually contains:

```text
_id
fullName
email
phone
passwordHash
roles
language
emailVerified
phoneVerified
identityVerified
status
createdAt
updatedAt
```

Roles include:

```text
donor
organizer
beneficiary
admin
moderator
support
```

Co-organizer access should be represented through campaign membership/permissions rather than incorrectly turning every co-organizer into a global role.

Unique indexes:

- email
- phone

Roles should be indexed.

---

# 12. ROLE-BASED ACCESS CONTROL

Use:

**RBAC + ownership/permission checks.**

RBAC handles coarse permissions:

```text
isAdmin
isModerator
isOrganizer
```

Ownership/permission checks handle resource-level access.

Example:

A user being an organizer does NOT automatically mean they can edit every campaign.

They can edit:

- their own campaign
- or a campaign where they are an accepted co-organizer

They cannot edit another organizer's campaign.

---

# 13. PERMISSION RULE

Always check:

```text
Authentication
+
Role
+
Resource ownership / permission
```

Never rely only on frontend authorization.

Frontend permission checks are UX.

Backend permission checks are security.

---

# 14. ROLE RESTRICTIONS

## Donor

Can:

- Browse
- Donate
- Comment
- Follow
- Bookmark
- View own donations
- View own receipts

Cannot:

- Edit campaigns
- Access other donors' private information

## Organizer

Can:

- Create campaign
- Edit campaign
- Publish after approval
- Pause
- Close
- Invite co-organizers
- Post updates
- View donations
- View analytics
- Thank donors
- Request withdrawal
- Manage profile

Cannot:

- Self-verify
- Withdraw before beneficiary/payment verification

## Beneficiary

Can:

- Accept invitation
- Submit verification
- Connect payout account
- View campaign progress
- View withdrawal status

Cannot:

- Edit campaign unless also authorized as organizer

## Co-organizer

Can:

- Edit campaign content
- Post updates
- View donations
- View analytics

Cannot:

- Request withdrawal
- Delete campaign

## Admin

Full platform operational access.

## Moderator / Trust & Safety

Can:

- Review campaigns
- Approve
- Reject
- Freeze
- Handle reports
- Manage fraud queue

Cannot:

- Configure platform-wide financial settings

## Support Agent

Can:

- View support tickets
- View limited user information
- View limited campaign information

Cannot:

- Approve financial actions
- Configure fees
- Manage sensitive financial settings

---

# 15. API RULE

Base API:

```text
/api/v1
```

All new endpoints must follow this versioned API.

Do not create random endpoint prefixes.

---

# 16. APPROVED API CONTRACT

Core endpoints include:

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/verify-otp

GET    /api/v1/users/me
PATCH  /api/v1/users/me

GET    /api/v1/campaigns
POST   /api/v1/campaigns
GET    /api/v1/campaigns/:id
PATCH  /api/v1/campaigns/:id
POST   /api/v1/campaigns/:id/submit
POST   /api/v1/campaigns/:id/publish

POST   /api/v1/campaigns/:id/donate

GET    /api/v1/campaigns/:id/updates
POST   /api/v1/campaigns/:id/updates

GET    /api/v1/campaigns/:id/comments
POST   /api/v1/campaigns/:id/comments

POST   /api/v1/payments/webhook/:provider

POST   /api/v1/withdrawals
PATCH  /api/v1/withdrawals/:id/review

POST   /api/v1/reports

PATCH  /api/v1/admin/campaigns/:id/review

GET    /api/v1/admin/fraud-cases

GET    /api/v1/notifications
```

Do not arbitrarily redesign the API contract without a reason.

---

# 17. HTTP METHOD RULE

Use HTTP semantics correctly.

GET:

Read.

POST:

Create/action.

PATCH:

Partial update/state transition where appropriate.

DELETE:

Only where deletion is actually allowed.

Do not use:

```text
POST /getCampaign
POST /updateCampaign
```

when standard REST semantics are appropriate.

---

# 18. API RESPONSE RULE

Use consistent response structures.

Success responses should be predictable.

Errors MUST follow:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fields": {}
  }
}
```

Never return random error formats from different modules.

---

# 19. ERROR CODE RULE

Use stable machine-readable error codes.

Examples:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
PAYMENT_FAILED
PAYMENT_PENDING
PAYMENT_TIMEOUT
VERIFICATION_REQUIRED
WITHDRAWAL_FROZEN
CAMPAIGN_SUSPENDED
RATE_LIMITED
INVALID_WEBHOOK
```

Do not make frontend clients depend on raw human messages.

---

# 20. AUTHENTICATION ARCHITECTURE

Use:

```text
Access Token
+
Refresh Token
```

Access token:

- Short-lived
- Approximately 15 minutes

Refresh token:

- Long-lived
- Rotated on use
- Stored in secure httpOnly cookie for web
- Invalidated when necessary

Never store refresh tokens insecurely in normal client-accessible storage.

---

# 21. PASSWORD SECURITY

Passwords:

- Must be hashed
- Never reversible
- Never logged
- Never returned in API responses

Use:

```text
bcrypt
```

or:

```text
Argon2
```

Do not implement custom cryptography.

---

# 22. EMAIL VERIFICATION

Email verification should use:

- signed token
- time-limited expiration
- single-use semantics

After successful verification:

```text
emailVerified = true
```

Do not trust a client-provided verification flag.

---

# 23. PHONE OTP

OTP must be:

- Expiring
- Rate limited
- Attempt limited
- Server validated

Never return the correct OTP in the API response.

Do not log OTP values.

---

# 24. PASSWORD RESET

Password reset token must be:

- Signed
- Short-lived
- Single-use

After successful password reset:

**Invalidate active sessions where appropriate.**

---

# 25. SESSION MANAGEMENT

Support:

- active session awareness
- refresh token invalidation
- remote logout
- session invalidation after password change

Do not leave compromised sessions active indefinitely.

---

# 26. SECURITY MIDDLEWARE

Security must exist at backend level.

Minimum requirements:

- HTTPS
- HSTS
- Secure headers
- CORS allowlist
- Rate limiting
- Input validation
- Authentication
- Authorization
- CSRF protection where cookie-based sessions require it
- XSS protection through proper output handling
- Secure cookies

---

# 27. CORS RULE

CORS must use an explicit allowlist.

Do NOT use:

```text
Access-Control-Allow-Origin: *
```

for authenticated production APIs.

Allow only approved web origins.

---

# 28. INPUT VALIDATION

Every write endpoint must validate input BEFORE database writes.

Validate:

- body
- params
- query where necessary
- uploaded file metadata

Use schema validation consistently.

Never trust frontend validation.

---

# 29. MASS ASSIGNMENT PROTECTION

Do not blindly pass request bodies into Mongoose:

Bad:

```js
Model.findByIdAndUpdate(id, req.body)
```

Instead explicitly select allowed fields.

Especially for:

- roles
- verification flags
- status
- financial fields
- ownership fields
- permissions

Users must never be able to submit:

```text
role=admin
identityVerified=true
status=active
raisedAmount=100000
```

and have the backend accept it.

---

# 30. CAMPAIGN STATE MACHINE

Campaigns must have controlled lifecycle states.

Conceptually:

```text
DRAFT
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ↓
APPROVED
  ↓
PUBLISHED
  ↓
PAUSED / CLOSED
```

Additional safety states may include:

```text
SUSPENDED
FROZEN
REJECTED
```

Do not allow arbitrary status changes.

Every transition must follow business rules.

---

# 31. CAMPAIGN OWNERSHIP

Campaign ownership must be server-enforced.

Organizer ID must come from authenticated identity.

Never accept:

```text
organizerId
```

from the client as the source of truth.

The backend determines ownership.

---

# 32. CAMPAIGN PUBLISHING

Organizer submits campaign.

Admin/moderator reviews.

Only approved campaigns can become published.

Do not allow organizers to bypass review by sending:

```text
status: published
```

---

# 33. BENEFICIARY RULE

Beneficiary verification is central to Kaalmo trust.

Verification pipeline:

```text
Email Verified
↓
Phone Verified
↓
Identity Verified
↓
Beneficiary Verified
↓
Payment Verified
↓
Organization Verified
```

Not every campaign requires every tier.

The backend must determine which verification is required.

---

# 34. VERIFICATION DATA

Sensitive identity documents must:

- Be stored securely
- Be access controlled
- Never be publicly exposed
- Use signed URLs where necessary
- Follow minimal retention principles

Do not store sensitive documents in the public web root.

---

# 35. FILE UPLOAD SECURITY

Uploaded files require:

- Type allowlist
- Size limit
- File validation
- Malware/virus scanning where feasible
- Secure object storage
- Access control

Never trust:

```text
Content-Type
```

alone.

Do not execute uploaded files.

Do not expose private documents through public URLs.

---

# 36. PAYMENT ARCHITECTURE

Payment integration MUST use an abstraction layer.

Core interface:

```text
PaymentService
```

Provider adapters:

```text
MobileMoneyProvider
BankProvider
CardProvider
ManualProvider
```

The donation system must NOT directly call:

```text
EVC API
Zaad API
eDahab API
Card API
```

Instead:

```text
DonationService
      ↓
PaymentService
      ↓
Provider Adapter
      ↓
External Provider
```

---

# 37. PAYMENT PROVIDER RULE

No specific provider is assumed to be permanently available.

Provider availability, fees, KYC requirements, and APIs must be verified from current provider documentation before implementation.

Never hard-code provider assumptions into the core donation logic.

---

# 38. PAYMENT INTERFACE

Providers should implement a common contract conceptually equivalent to:

```text
createPaymentIntent()
confirmPayment()
handleWebhook()
refund()
```

The exact method signatures may evolve.

The architectural rule does not.

Adding a new provider should require:

**new adapter + configuration**

not rewriting campaign/donation business logic.

---

# 39. DONATION FLOW

Canonical flow:

```text
Create Donation Intent
        ↓
Create Payment Intent
        ↓
Provider Payment
        ↓
Provider Webhook
        ↓
Verify Webhook
        ↓
Deduplicate Event
        ↓
PaymentTransaction confirmed
        ↓
Donation confirmed
        ↓
Campaign balance updated
        ↓
Receipt generated
        ↓
Notification dispatched
```

Do not mark a donation confirmed merely because the frontend says payment succeeded.

The provider-confirmed webhook is authoritative.

---

# 40. WEBHOOK SECURITY

Every payment webhook must:

- Verify provider signature
- Validate payload
- Validate provider transaction identity
- Prevent replay
- Be idempotent
- Record webhook event for audit

Never trust an unsigned webhook.

Never process the same financial event twice.

---

# 41. WEBHOOK IDEMPOTENCY

Webhook delivery can happen multiple times.

Deduplicate using:

- provider transaction ID
- provider event ID where available
- idempotency keys

Repeated webhook:

**must NOT create another donation or increment campaign balance again.**

---

# 42. FINANCIAL LEDGER RULE

This is NON-NEGOTIABLE.

`PaymentTransaction` records are:

**APPEND-ONLY / IMMUTABLE.**

Never:

- edit historical financial transactions
- delete historical transactions
- overwrite transaction amounts
- silently "fix" financial history

Corrections must be represented by:

```text
reversal
adjustment
refund
chargeback
```

records referencing the original transaction.

---

# 43. MONEY CALCULATION RULE

Never use floating-point arithmetic carelessly for financial calculations.

Use a consistent monetary representation.

Prefer integer minor units where appropriate.

Example:

```text
$10.50
→ 1050 cents
```

The exact currency representation must be consistent across:

- Donation
- Payment
- Fee
- Refund
- Withdrawal
- Ledger

---

# 44. CAMPAIGN BALANCE INTEGRITY

`raisedAmount` must reconcile with confirmed financial records.

Never allow arbitrary frontend updates.

The system must ensure:

```text
Campaign raisedAmount
≈
Confirmed Donation / Ledger records
```

There must be no unexplained drift.

---

# 45. DONATION STATUS

Donation states should represent real financial state.

Example:

```text
pending
confirmed
failed
refunded
reversed
```

Do not mark pending donations as raised funds.

Only confirmed donations should contribute to confirmed campaign totals.

---

# 46. REFUNDS

Refunds must create traceable financial records.

Do not simply change:

```text
status = refunded
```

and destroy the original financial history.

Reference the original transaction.

Refund logic must respect the specification:

- Organizer/admin initiated
- Pre-withdrawal where applicable
- Provider constraints

---

# 47. CHARGEBACKS

Card chargebacks must be treated as separate financial events.

Do not erase the original donation.

Create an auditable reversal/chargeback relationship.

---

# 48. FEES

If platform fees are used:

- Calculate server-side
- Make them configurable
- Never trust client-calculated fees
- Show the applicable fee clearly
- Record the fee in financial records

Current specification recommendation:

**Low transparent transaction fee, approximately 3–5%, plus optional donor tip.**

This is a product recommendation, not a hard-coded legal requirement.

Do not hard-code 4% unless explicitly configured.

---

# 49. WITHDRAWAL ARCHITECTURE

Canonical flow:

```text
Campaign raises funds
        ↓
Beneficiary verified
        ↓
Payout account verified
        ↓
Withdrawal request
        ↓
Risk review
        ↓
Admin review where required
        ↓
PaymentService
        ↓
Payout provider
        ↓
Webhook confirmation
        ↓
Withdrawal COMPLETED
        ↓
Ledger updated
```

---

# 50. WITHDRAWAL HARD PREREQUISITE

No withdrawal may be successfully requested/processed unless:

```text
Beneficiary identity verified
AND
Payout account verified
```

This is a hard business rule.

---

# 51. WITHDRAWAL STATES

Support:

```text
pending
under_review
approved
processing
completed
failed
frozen
```

Do not allow arbitrary state transitions.

---

# 52. WITHDRAWAL REVIEW RULES

Manual review may be triggered by:

- First withdrawal on a new campaign
- Amount above threshold
- Risk score above configured level
- Beneficiary/payout name mismatch

Thresholds must be configurable.

Do not hard-code operational limits into frontend code.

---

# 53. WITHDRAWAL AUDIT

Every withdrawal state transition must record:

- Actor
- Actor type
- Timestamp
- Previous state
- New state
- Reason

Audit records must be immutable.

---

# 54. FRAUD ENGINE

Fraud prevention is a backend responsibility.

Signals include:

- New account age
- Suspicious campaign content patterns
- Donation velocity
- Multiple accounts from same device/IP
- Device fingerprinting
- IP reputation
- Sudden fundraising spikes
- Beneficiary identity mismatch
- Repeated failed payment attempts

---

# 55. RISK SCORE

Use:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Conceptual behavior:

### LOW

Allow normal flow.

### MEDIUM

Flag for moderator review.

Campaign may remain live.

### HIGH

Freeze campaign or withdrawal pending manual review.

### CRITICAL

Reject/take down campaign, flag account, notify admin.

Risk decisions must remain explainable.

Do not automatically accuse users of fraud based on one weak signal.

---

# 56. FRAUD CHECK TIMING

Fraud scoring should run:

- At campaign submission
- At donations above configured threshold
- At withdrawal request

Not only during registration.

---

# 57. REPORTING

Authenticated users can report:

- Campaign
- User

Reports must create traceable records.

Do not immediately delete reported content merely because a report exists.

Route reports through moderation/risk workflow.

---

# 58. MODERATION

Moderators/admins can perform:

- Approve
- Reject
- Suspend
- Freeze
- Restore

Reject/suspend actions require a reason.

Reasons should be structured where possible.

---

# 59. ADMIN ACTIONS

Sensitive admin actions must:

1. Verify permission
2. Validate input
3. Perform action
4. Record audit log

Examples:

- Ban user
- Suspend campaign
- Freeze withdrawal
- Approve withdrawal
- Reject campaign
- Manually verify identity
- Refund payment
- Change financial configuration

---

# 60. AUDIT LOGGING

Audit logging is mandatory for:

- Admin actions
- Financial actions
- Verification actions
- Moderation actions
- Withdrawal state changes
- Payment events
- Security-sensitive actions

Audit logs must include:

```text
actor
action
resource
resourceId
timestamp
reason where applicable
metadata
request/correlation ID where useful
```

Never allow normal users to edit audit logs.

---

# 61. AUDIT LOG IMMUTABILITY

Audit logs must be treated as append-only.

Never:

- update historical audit entries
- delete audit entries as a normal operation
- overwrite actor information

Corrections should be represented by new events.

---

# 62. NOTIFICATION ARCHITECTURE

MVP notification channels:

- In-app
- Email

Critical events may use SMS:

- Payment confirmation
- Withdrawal completed
- Security alerts

Push notifications are NOT part of the MVP.

Do not introduce FCM infrastructure for the MVP.

---

# 63. NOTIFICATION EVENTS

Support events including:

```text
campaign approved
campaign rejected
new donation
goal reached
new update
withdrawal approved
withdrawal completed
payment failed
account security alert
new comment
```

---

# 64. EMAIL RULE

Email sending should not contain core financial business logic.

Example:

Bad:

```text
DonationService
→ directly implement SMTP logic
```

Better:

```text
DonationService
→ NotificationService
→ EmailProvider
```

This keeps integrations replaceable.

---

# 65. SMS RULE

SMS provider must be abstracted.

Do not scatter provider-specific SMS API calls across controllers.

Use:

```text
SmsService
→ SmsProvider
```

---

# 66. LOW-BANDWIDTH BACKEND SUPPORT

The product is designed for constrained connectivity.

Backend should support:

- Efficient payloads
- Pagination
- Avoiding unnecessary response fields
- Compression where appropriate
- Stable retry-safe operations
- Idempotent payment flows

Do not return huge datasets by default.

---

# 67. PAGINATION RULE

List endpoints should use pagination.

Examples:

```text
campaigns
donations
notifications
users
payments
withdrawals
reports
audit logs
```

Never return thousands of records by default.

---

# 68. SEARCH RULE

Campaign search should support the specification's needs.

Searchable content includes:

- Campaign title
- Campaign story

Use appropriate MongoDB indexes.

Do not scan the entire database for every search.

---

# 69. DATABASE INDEX RULE

Create indexes for high-value query paths.

Examples from the specification:

```text
Users:
email
phone
roles

Campaigns:
organizerId
status
category
title/story text search

Donations:
campaignId
donorId
```

Add additional indexes only when justified by query patterns.

Do not create indexes blindly.

---

# 70. DATABASE RELATIONSHIP RULE

Core relationships include:

```text
User
 ↓
Campaign

Campaign
 ↓
Beneficiary

Campaign
 ↓
CampaignMembers

Campaign
 ↓
Donations

Donation
 ↓
PaymentTransaction

Payment
 ↓
PaymentTransactions

PaymentWebhook
 ↓
PaymentTransaction

Beneficiary
 ↓
PayoutAccount

Campaign
 ↓
Withdrawal
```

Preserve traceability.

---

# 71. PAYMENT DATA SEPARATION

Keep these concepts separate:

### Payment

High-level payment intent.

### PaymentTransaction

Immutable provider/ledger event.

### PaymentWebhook

Raw webhook payload and verification result.

Do not collapse them into one generic `transactions` collection.

---

# 72. WEBHOOK RETENTION

Payment webhook records should retain:

- Raw payload where appropriate
- Provider
- Signature verification result
- Processing result
- Event identifiers
- Timestamp

This supports audit and dispute investigation.

---

# 73. DATA PRIVACY

Sensitive data includes:

- Identity documents
- Payout account information
- Verification information

Requirements:

- Encryption at rest where applicable
- Access control
- Minimal retention
- Masked UI representation
- Secure storage

Do not log sensitive information.

---

# 74. SECRET MANAGEMENT

Secrets must NEVER be committed to source control.

Examples:

```text
JWT_SECRET
DATABASE_URL
PAYMENT_PROVIDER_SECRET
WEBHOOK_SECRET
EMAIL_API_KEY
SMS_API_KEY
STORAGE_SECRET
```

Use:

```text
.env
```

locally.

Use secure secret management in production.

Provide:

```text
.env.example
```

with placeholders only.

---

# 75. LOGGING RULE

Use structured logs.

Logs should help diagnose:

- request
- error
- payment event
- webhook
- security event
- system event

Never log:

- passwords
- OTPs
- access tokens
- refresh tokens
- payment secrets
- full identity documents
- sensitive payout credentials

---

# 76. REQUEST CORRELATION

Use a request/correlation ID where useful.

This helps trace:

```text
Request
→ Service
→ Payment Provider
→ Webhook
→ Ledger
```

especially when debugging financial events.

---

# 77. RATE LIMITING

Rate limiting is mandatory for sensitive endpoints.

Especially:

- Login
- Registration
- OTP
- Password reset
- Donation creation
- Payment operations
- Webhooks where applicable
- Reports

Use both:

- IP-based
- Account/user-based

where appropriate.

---

# 78. BRUTE-FORCE PROTECTION

Authentication must use:

- Progressive throttling/lockout
- Rate limits
- CAPTCHA after repeated failures where appropriate

Do not allow unlimited password attempts.

---

# 79. ACCOUNT TAKEOVER PROTECTION

Security-sensitive behavior should support:

- New-device login notification
- Session revocation
- Password-change invalidation
- Refresh token rotation

---

# 80. TRANSACTION RULE

Whenever multiple financial records must change together, carefully use MongoDB transactions where supported/appropriate.

Example:

```text
Payment confirmed
→ PaymentTransaction
→ Donation
→ Campaign balance
→ Receipt
```

The implementation must prevent partial financial state.

Do not assume:

```text
A succeeded
therefore B succeeded
```

without handling failure/retry semantics.

---

# 81. IDEMPOTENCY RULE

Any operation that can create money movement must be retry-safe.

Examples:

- Donation creation
- Payment confirmation
- Webhook processing
- Refund
- Withdrawal processing

Retrying the same event must NOT duplicate money.

---

# 82. FINANCIAL SOURCE OF TRUTH

Do not trust:

- Frontend amount
- Frontend campaign balance
- Client-provided payment status
- Client-provided verification state

The backend/database/provider confirmation is authoritative.

---

# 83. CAMPAIGN RAISED AMOUNT

Never allow:

```text
PATCH /campaign
{
  "raisedAmount": 100000
}
```

from normal campaign owners.

`raisedAmount` is a derived financial value controlled by the backend.

---

# 84. DONATION AMOUNT VALIDATION

Validate:

- positive amount
- supported currency
- campaign status
- campaign eligibility
- donation limits
- risk rules
- payment method

Never accept arbitrary currency values.

MVP:

**USD primary**

with optional SOS equivalent display.

---

# 85. CURRENCY RULE

The specification defines:

- USD as primary campaign currency
- SOS equivalent display where appropriate

Do NOT implement broad multi-currency support in MVP.

The specification explicitly excludes multi-currency beyond USD/SOS display from MVP.

---

# 86. MVP BOUNDARY

MVP MUST prioritize:

```text
Authentication
↓
Verification
↓
Campaign lifecycle
↓
Payment
↓
Donation
↓
Receipt
↓
Withdrawal
↓
Admin review
↓
Updates/comments
↓
Notifications
```

---

# 87. MVP EXCLUSIONS

Do NOT implement as MVP:

- Redis
- BullMQ
- Background job infrastructure unless specifically required
- Push notifications
- Advanced analytics
- Multi-region deployment
- GraphQL
- Recurring donations
- Arabic/RTL
- Public third-party API
- In-app donor/organizer messaging
- Advanced ML fraud scoring

The original specification explicitly places these outside MVP scope.

---

# 88. FUTURE SCALE RULE

Do not prematurely implement future infrastructure.

Future possibilities include:

```text
Redis
BullMQ
CDN
Monitoring
Centralized logging
Analytics pipeline
```

Add them when real operational requirements justify them.

Do not turn an MVP into a distributed system without need.

---

# 89. API DOCUMENTATION

Maintain an OpenAPI contract.

The original development plan explicitly requires finalizing:

**DB schema + API contract → OpenAPI specification.**

Every production endpoint should be documented.

---

# 90. TESTING RULE

Backend testing is mandatory.

At minimum:

### Unit tests

For:

- services
- validators
- business rules
- utility logic

### Integration tests

For:

- API
- database
- authentication
- authorization
- campaign lifecycle

### Payment tests

For:

- payment intent
- webhook
- signature verification
- duplicate webhook
- payment failure
- payment timeout
- refund
- reconciliation

### Security tests

For:

- unauthorized access
- role escalation
- ownership bypass
- rate limits
- invalid tokens
- injection attempts

---

# 91. AUTH TESTING

Test:

```text
Register
Login
Refresh
Logout/session invalidation
OTP
Email verification
Password reset
Expired token
Invalid token
Role permissions
```

---

# 92. CAMPAIGN TESTING

Test:

```text
Create draft
Edit
Submit
Review
Approve
Publish
Pause
Close
Reject
Suspend
Freeze
Restore
```

Also test invalid transitions.

---

# 93. PAYMENT TESTING

Test the complete flow:

```text
Intent
→ Provider
→ Webhook
→ Signature
→ Idempotency
→ Confirmation
→ Donation
→ Campaign balance
→ Receipt
```

Test duplicate webhook processing.

Test provider failure.

Test timeout.

Test retry.

---

# 94. WITHDRAWAL TESTING

Test:

```text
Beneficiary verified
Payout verified
Request
Risk review
Admin approval
Processing
Provider webhook
Completed
Failed
Frozen
```

Also test:

**unverified beneficiary attempting withdrawal.**

This MUST fail.

---

# 95. SECURITY TEST

Before real-money beta:

Verify:

- HTTPS
- Password hashing
- Rate limiting
- Webhook signature verification
- Input validation
- Authorization
- Audit logging
- Sensitive data access control
- File upload security

The specification requires these controls before beta.

---

# 96. DEPLOYMENT ARCHITECTURE

MVP target:

```text
Internet
   ↓
Reverse Proxy / HTTPS
   ↓
Node.js + Express
   ↓
MongoDB
   ↓
External Services
 ├── Payment Provider
 ├── Email
 ├── SMS
 └── Object Storage
```

Containerized deployment is preferred.

Do not introduce Kubernetes/microservices unless explicitly required.

---

# 97. ENVIRONMENT SEPARATION

Support:

```text
development
test
staging
production
```

Never use production secrets locally.

Never point automated tests at production financial data.

---

# 98. DATABASE ENVIRONMENT RULE

Development/test/staging/production databases must be separated.

Never run destructive tests against production.

---

# 99. BACKUP AND RECOVERY

Production database must have an appropriate backup strategy.

Financial data must be recoverable.

Do not treat MongoDB as disposable storage.

---

# 100. API SECURITY BOUNDARY

The backend is the final authority.

The frontend can request:

```text
"Please publish this campaign."
```

The backend decides:

```text
Is the user authorized?
Is the campaign approved?
Are verification requirements satisfied?
Is the state transition valid?
```

Never trust the client.

---

# 101. NO BUSINESS LOGIC IN FRONTEND

Frontend may display:

- Status
- Progress
- Validation feedback

But backend owns:

- Financial calculation
- Permissions
- Verification state
- Campaign state
- Fraud decisions
- Withdrawal eligibility
- Payment confirmation

---

# 102. NO BUSINESS LOGIC IN ROUTES

Routes should define:

```text
HTTP method
URL
middleware
controller
```

Not business processes.

---

# 103. NO DIRECT PROVIDER CALLS FROM CONTROLLERS

Never:

```text
controller
→ EVC API
```

or:

```text
controller
→ Card API
```

Always:

```text
controller
→ service
→ payment abstraction
→ provider adapter
```

---

# 104. NO DIRECT DATABASE ACCESS FROM ROUTES

Never:

```text
route
→ Model.find()
```

Prefer:

```text
route
→ controller
→ service
→ repository/model
```

This keeps business logic testable.

---

# 105. DOMAIN BOUNDARY RULE

Domains should communicate through clear service contracts.

Examples:

```text
DonationService
→ PaymentService

WithdrawalService
→ PaymentService

CampaignService
→ VerificationService

CampaignService
→ FraudService
```

Do not create circular dependencies.

---

# 106. FINANCIAL DOMAIN IS SPECIAL

Financial code requires stronger controls than normal CRUD.

For:

- Donations
- Payments
- Refunds
- Withdrawals
- Fees
- Ledger entries

require:

- Idempotency
- Auditability
- Validation
- Authorization
- Atomicity where needed
- Immutable records
- Reconciliation

---

# 107. RECONCILIATION RULE

The system must support detecting:

```text
Campaign balance
vs
Confirmed donations
vs
Payment ledger
```

Any mismatch must be detectable.

Do not silently repair financial drift.

Investigate and record adjustments.

---

# 108. ADMIN FINANCIAL ACCESS

Financial information must be permission-controlled.

Do not expose:

- Full payout account details
- Sensitive identity information
- Private donor data

to every admin/support role.

Use least privilege.

---

# 109. PRIVACY RULE

Only collect data needed for:

- Identity
- Verification
- Payments
- Compliance
- Product operation

Do not collect sensitive data "just in case."

---

# 110. DATA DELETION RULE

Financial records and audit records must follow retention requirements.

Do not casually delete financial history.

Privacy deletion requests must be designed around legal/financial retention requirements.

The specification explicitly calls for data export/erasure support while also recognizing statutory financial record retention requirements.

---

# 111. OBSERVABILITY

At MVP:

Use structured application logging and useful operational diagnostics.

Later, when justified:

- Sentry
- Prometheus/Grafana
- Centralized logs
- Analytics pipeline

Do not over-engineer observability before it is needed.

---

# 112. PERFORMANCE RULE

Optimize real bottlenecks.

Prioritize:

- Database indexes
- Pagination
- Efficient queries
- Small API payloads
- Caching where justified
- Efficient media delivery

Do not add Redis merely because "production apps use Redis."

---

# 113. CODE QUALITY RULE

Code should be:

- readable
- modular
- testable
- explicit
- predictable

Avoid:

- giant functions
- giant controllers
- hidden side effects
- magic values
- duplicated business logic
- unnecessary abstractions

---

# 114. NAMING RULE

Use clear domain names.

Good:

```text
PaymentTransaction
WithdrawalService
VerificationStatus
CampaignReview
BeneficiaryVerification
```

Avoid:

```text
DataManager
Helper2
ThingService
UtilsManager
ProcessHandler
```

---

# 115. CONSTANTS RULE

Use centralized constants/enums for:

- roles
- campaign statuses
- payment statuses
- withdrawal statuses
- risk levels
- verification statuses
- notification event types

Do not scatter strings across the codebase.

---

# 116. CONFIGURATION RULE

Environment/configuration should control:

- database
- JWT settings
- storage
- payment providers
- email
- SMS
- fees
- limits
- rate limits
- allowed origins

Do not hard-code operational configuration.

---

# 117. PAYMENT PROVIDER CONFIGURATION

Provider configuration should support:

```text
enabled
credentials
environment
timeouts
limits
supported currencies
```

Provider-specific configuration must remain inside the provider boundary.

---

# 118. PROVIDER FAILURE RULE

The system must handle:

- timeout
- unavailable provider
- invalid response
- duplicate webhook
- failed payment
- unknown transaction
- signature failure

Never assume provider availability.

---

# 119. NO FAKE PAYMENT SUCCESS

During development, mock providers may be used.

But production logic must distinguish:

```text
mock
test
real
```

Never allow development mock success behavior into production.

---

# 120. REAL-MONEY SAFETY

Before enabling real money:

- Payment provider verified
- Webhooks verified
- Idempotency tested
- Reconciliation tested
- Withdrawal tested
- Security tested
- Audit logs tested
- Admin review tested

The original specification requires a full payment/webhook/security test pass before real-money beta.

---

# 121. NO PROVIDER LOCK-IN

Core business logic must not depend on one provider.

If Provider A disappears:

```text
DonationService
CampaignService
WithdrawalService
```

should remain largely unchanged.

Only provider adapter/configuration should change.

---

# 122. API VERSIONING

Current:

```text
/api/v1
```

Do not make breaking changes silently.

If a breaking API change becomes necessary:

```text
v2
```

must be considered.

---

# 123. BACKWARD COMPATIBILITY

Do not change API response structures casually.

Frontend depends on stable contracts.

If changing:

- field names
- status values
- error codes
- endpoint behavior

update the API contract and tests.

---

# 124. DOCUMENTATION RULE

Document important business rules in code where they are not obvious.

Especially:

- financial state transitions
- verification requirements
- withdrawal rules
- fraud rules
- webhook idempotency
- permission logic

Do not rely entirely on comments.

Prefer clear code.

---

# 125. AI AGENT OPERATING RULE

When an AI agent is working on Kaalmo backend:

### Before coding

1. Read `spec.md`.
2. Read `BACKEND_RULES.md`.
3. Identify the affected domain.
4. Check existing architecture.
5. Check existing models/services.
6. Reuse existing patterns.

### During coding

1. Do not invent features.
2. Do not bypass architecture layers.
3. Do not duplicate business logic.
4. Do not change unrelated files.
5. Do not modify financial logic casually.
6. Do not change API contracts without approval.

### After coding

1. Run tests.
2. Check authorization.
3. Check validation.
4. Check error handling.
5. Check audit requirements.
6. Check idempotency if financial.
7. Check edge cases.
8. Review architecture boundaries.

---

# 126. AI MUST ASK BEFORE

The AI agent must request approval before introducing:

- New database technology
- Redis
- Queue system
- Microservices
- GraphQL
- New payment provider architecture
- New financial model
- New user role
- New permission model
- New major domain
- New external service
- Breaking API change
- Major schema migration
- New compliance-sensitive workflow

---

# 127. AI MUST NOT

The AI must NEVER:

- Invent payment behavior
- Fake payment confirmation
- Allow frontend-controlled balances
- Allow users to modify verification flags
- Allow unauthorized campaign editing
- Allow unverified withdrawals
- Bypass webhook verification
- Process duplicate webhooks twice
- Modify immutable ledger history
- Delete audit history
- Expose private documents
- Expose secrets
- Commit credentials
- Add mobile-app infrastructure
- Introduce unnecessary architecture

---

# 128. CHANGE SCOPE RULE

If the task says:

**"Fix campaign update endpoint."**

Do NOT:

- redesign campaign architecture
- rewrite authentication
- refactor payment system
- rename all models
- change API version
- add Redis

unless required by the task.

Make the smallest correct change.

---

# 129. MIGRATION RULE

Database schema changes must be intentional.

Before changing a production-sensitive field:

1. Identify existing data.
2. Identify affected services.
3. Identify indexes.
4. Plan migration.
5. Test migration.
6. Verify rollback/recovery strategy where applicable.

Never casually rename financial fields.

---

# 130. TEST-FIRST FOR HIGH-RISK LOGIC

For financial/security logic:

Prefer:

```text
Business rule
↓
Test
↓
Implementation
↓
Integration test
```

Especially:

- payment confirmation
- webhook deduplication
- withdrawal eligibility
- permissions
- fraud actions
- financial calculations

---

# 131. DEFINITION OF DONE

A backend feature is NOT complete when:

```text
"the endpoint works"
```

It is complete when:

- Authentication works
- Authorization works
- Validation works
- Business rules work
- Errors are handled
- Audit requirements are met
- Tests pass
- Edge cases are considered
- API documentation is updated
- Security implications are reviewed

---

# 132. MVP BETA DEFINITION

Kaalmo backend is beta-ready when:

### Authentication

Users can:

- Register
- Verify
- Login
- Refresh sessions
- Reset password

### Campaign

Organizer can:

- Create
- Submit
- Receive review
- Publish after approval

### Donation

Donor can:

- Donate
- Complete payment
- Receive confirmed receipt

### Financial integrity

Campaign balances reconcile with confirmed payment records.

### Beneficiary

Beneficiary can:

- Verify
- Connect payout account

### Withdrawal

Withdrawal can:

- Be requested
- Reviewed
- Approved/rejected
- Paid successfully

### Admin

Admin can:

- Moderate
- View financials
- Manage reported campaigns
- Review withdrawals
- Review verification

### Security

Core controls exist:

- HTTPS
- Password hashing
- Rate limiting
- Webhook verification
- Input validation
- RBAC
- Audit logging

These requirements follow the specification's beta-ready definition.

---

# 133. FINAL ARCHITECTURE

The intended architecture is:

```text
                    KAALMO WEB
                        │
                        ▼
                React Web Client
                        │
                        ▼
                 REST API /api/v1
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        Authentication       Authorization
              │                   │
              └─────────┬─────────┘
                        ▼
                 Domain Services
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
    Campaigns       Donations       Withdrawals
        │               │                │
        ▼               ▼                ▼
 Verification       PaymentService    PaymentService
 Fraud/Risk             │                │
        │               ▼                ▼
        │        Provider Adapters   Provider Adapters
        │               │                │
        │        ┌──────┼──────┐         │
        │        ▼      ▼      ▼         │
        │     Mobile  Bank   Card        │
        │      Money                    │
        │                                │
        └──────────────┬─────────────────┘
                       ▼
                    MongoDB
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Ledger     Audit     Verification
                       │
                       ▼
              External Services
             ┌────────┼────────┐
             ▼        ▼        ▼
           Email      SMS    Object Storage
```

---

# 134. ARCHITECTURAL INVARIANTS

The following rules are NON-NEGOTIABLE:

### 1.

Frontend never controls financial truth.

### 2.

Payment providers never directly control campaign logic.

### 3.

Webhook confirmation is verified before financial state changes.

### 4.

Financial transactions are immutable.

### 5.

Withdrawal requires beneficiary + payout verification.

### 6.

Every protected endpoint checks authorization.

### 7.

Every write endpoint validates input.

### 8.

Sensitive admin/financial actions are audited.

### 9.

Payment operations are idempotent.

### 10.

The backend is the final security boundary.

### 11.

No mobile-app-specific backend is required for the current web-only scope.

### 12.

Do not add infrastructure simply because it is fashionable.

---

# 135. FINAL AI CHECK

Before submitting backend code, ask:

### Architecture

- Did I follow the module boundaries?
- Did I put business logic in services?
- Did I avoid giant controllers?
- Did I avoid direct provider calls?

### Security

- Is authentication enforced?
- Is authorization enforced?
- Is ownership checked?
- Is input validated?
- Are secrets protected?

### Financial

- Is the operation idempotent?
- Is the ledger immutable?
- Is reconciliation possible?
- Is frontend data ignored as financial truth?
- Are webhook signatures verified?

### Data

- Are sensitive fields protected?
- Are indexes appropriate?
- Is pagination used?
- Are documents stored securely?

### Scope

- Is this feature in the specification?
- Did I introduce anything unnecessary?
- Did I change unrelated architecture?

### Testing

- Did I test the happy path?
- Did I test failure?
- Did I test unauthorized access?
- Did I test duplicate/retry behavior?
- Did I test edge cases?

If any answer is NO:

**DO NOT MARK THE TASK COMPLETE.**

---

# FINAL PRINCIPLE

Kaalmo backend must be:

**Secure → Auditable → Predictable → Modular → Testable → Financially safe → Simple enough to maintain**

Do not build the most complicated architecture.

Build the smallest architecture that can safely support Kaalmo's trust, verification, fundraising, payment, withdrawal, and moderation requirements.

**Spec defines WHAT the product does.**

**This document defines HOW the backend must safely implement it.**

When in doubt:

**Do not invent.**

**Read the specification.**

**Preserve the architecture.**

**Protect the money.**

**Protect the user.**

**Keep the system understandable.**

# END OF BACKEND RULES