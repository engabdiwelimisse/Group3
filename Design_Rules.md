# Kaalmo Design Rules

> **STATUS: MANDATORY**
>
> This file is the design constitution for the Kaalmo web application.
>
> Any AI agent, designer, or developer working on Kaalmo MUST follow these rules.
>
> These rules exist to prevent design drift, unnecessary UI invention, generic AI-generated interfaces, inconsistent components, and features outside the approved product scope.

---

# 1. CORE RULE

Kaalmo is a:

**Somalia-first fundraising WEB APPLICATION.**

Kaalmo is NOT:

- A native mobile application
- A Flutter application
- A generic SaaS dashboard
- A generic charity template
- A GoFundMe clone
- A fintech banking application
- An AI product
- A social media platform

The design must always communicate:

**Human → Trust → Community → Transparency → Simplicity**

---

# 2. WEB ONLY

This project is WEB ONLY.

Never introduce:

- Flutter
- Dart
- iOS UI
- Android UI
- Native mobile navigation
- Bottom navigation designed for native apps
- App-store screens
- Native mobile components

The application must be:

**Responsive Web**

Responsive targets:

- Mobile browser
- Tablet
- Laptop
- Desktop
- Large desktop

Mobile browser support does NOT mean creating a mobile app.

---

# 3. DESIGN SCOPE RULE

The AI MUST NOT invent new product areas without explicit approval.

Only design functionality supported by the product specification.

Approved major areas:

### Public

- Homepage
- Explore
- Search
- Categories
- Campaign Details
- How It Works
- Safety & Trust
- About
- FAQ
- Help Center
- Contact
- Terms
- Privacy

### Authentication

- Register
- Login
- Forgot Password
- Reset Password
- Email Verification
- Phone Verification

### Organizer

- Dashboard
- Campaigns
- Campaign Creation
- Campaign Editing
- Campaign Preview
- Donations
- Updates
- Analytics
- Beneficiary
- Team
- Withdrawals
- Settings

### Donor

- Dashboard
- Donations
- Saved Campaigns
- Followed Campaigns
- Notifications
- Profile
- Settings

### Beneficiary

- Dashboard
- Verification
- Payout Account
- Withdrawal Status

### Admin / Moderator

- Dashboard
- Users
- Campaigns
- Campaign Review
- Verification
- Donations
- Payments
- Withdrawals
- Fraud & Risk
- Reports
- Moderation
- Support
- Audit Logs
- Categories
- Settings
- Analytics

If a requested design does not fit one of these areas:

**DO NOT INVENT IT.**

Ask for approval before adding a new product area.

---

# 4. NO DESIGN DRIFT

Do not gradually change Kaalmo's visual identity.

Once these are established, preserve them:

- Typography
- Colors
- Spacing
- Radius
- Buttons
- Inputs
- Navigation
- Cards
- Tables
- Status indicators
- Verification badges
- Modals
- Alerts
- Toasts

A new screen must reuse existing patterns whenever possible.

Do not create a new component simply because another visual style looks interesting.

---

# 5. HUMAN-CENTERED RULE

Every design decision must answer:

1. Why does this exist?
2. What user problem does it solve?
3. Why is it positioned here?
4. Why is it visually emphasized?
5. Can a first-time user understand it?
6. What happens if the user makes a mistake?
7. What happens when there is no data?
8. What happens when the network fails?

If the answer is unclear:

**SIMPLIFY.**

Do not add UI for decoration.

---

# 6. ANTI-GENERIC-AI RULE

The interface must NOT look like a generic AI-generated template.

Never automatically use:

- Purple gradients
- Blue/purple AI gradients
- Glassmorphism
- Huge floating blobs
- Excessive rounded cards
- Excessive shadows
- Excessive pills
- Generic dashboards
- Random floating icons
- Decorative statistics
- Repetitive card grids
- Giant hero sections
- Fake analytics
- "Welcome back 👋"
- Random illustrations
- Excessive whitespace
- Every section inside a card

The human-centered design constitution specifically requires avoiding these generic patterns and prioritizing intentional design.

---

# 7. NO DRIBBBLE DESIGN

Do not optimize the interface for:

**"Looks impressive in a screenshot."**

Optimize for:

**"Works naturally for a real person."**

Avoid:

- unnecessary animations
- oversized typography
- extreme layouts
- decorative interactions
- unusual navigation
- visual complexity
- fake sophistication

Usability always wins.

---

# 8. COLOR RULE

Use the approved Kaalmo color direction.

### Primary

`#0B7189`

### Primary Dark

`#07566A`

### Accent

`#D8A63C`

### Background

`#F8FAF9`

### Surface

`#FFFFFF`

### Text Primary

`#172121`

### Text Secondary

`#5E6B6B`

### Border

`#DCE4E3`

### Success

`#2E7D5B`

### Warning

`#B7791F`

### Error

`#C94A4A`

### Information

`#3478A6`

Do not introduce random brand colors.

Do not create new gradients.

Do not use color merely for decoration.

Color must communicate:

- Brand
- Hierarchy
- Status
- Trust
- Feedback
- Importance

---

# 9. TYPOGRAPHY RULE

Primary font:

**Inter**

Typography must prioritize:

- readability
- Somali text
- English text
- long campaign stories
- financial numbers
- accessibility

Do not introduce multiple fonts unless explicitly approved.

Do not use decorative fonts.

Do not use oversized typography without a clear purpose.

---

# 10. SPACING RULE

Use an 8px-based spacing system.

Approved values:

`4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96`

Do not randomly introduce spacing values.

Consistency is more important than visual novelty.

---

# 11. BORDER RADIUS RULE

Use moderate radius.

Preferred:

- Small controls: 6–8px
- Inputs/buttons: 8–10px
- Cards: 12px
- Large surfaces: maximum 16px when justified

Do not make everything a pill.

Do not use huge rounded containers.

---

# 12. SHADOW RULE

Shadows must be subtle.

Prefer:

- borders
- surface contrast
- spacing
- hierarchy

over heavy shadows.

Never use large floating shadows simply to make an element look "premium."

---

# 13. CARD RULE

Cards are NOT the default container for everything.

Use a card only when it helps:

- group related information
- compare information
- represent an independent object
- provide an actionable unit

Do NOT put:

- every section
- every statistic
- every paragraph
- every setting

inside cards.

---

# 14. BUTTON RULE

Every screen should have a clear action hierarchy.

Types:

### Primary

Main task.

### Secondary

Supporting task.

### Tertiary

Low-emphasis action.

### Destructive

Dangerous action.

Do not make every button primary.

Never use vague labels when a specific action is possible.

Prefer:

- Create campaign
- Donate $50
- Save changes
- Request withdrawal
- Submit for review
- Approve campaign
- Reject campaign

Avoid:

- Submit
- Continue
- Click here
- Done

when a more meaningful label exists.

---

# 15. DESTRUCTIVE ACTION RULE

For:

- Delete
- Suspend
- Freeze
- Reject
- Cancel payment
- Disable account
- Remove user

use confirmation.

Explain the consequence.

Require an explicit action.

Do not visually make destructive actions identical to normal actions.

---

# 16. FINANCIAL UX RULE

Money is a high-trust area.

Whenever money is involved, prioritize:

**Clarity > Decoration**

Always make clear:

- Amount
- Currency
- Payment method
- Status
- Fees where applicable
- Total
- Transaction reference
- Date
- Recipient/campaign
- Withdrawal state

Never hide important financial information.

Never make users guess whether payment succeeded.

---

# 17. PAYMENT STATE RULE

Always design:

- Pending
- Confirmed
- Failed
- Timeout
- Refunded
- Reversed

The user must understand what happened and what they should do next.

Never expose raw technical errors.

Do not show:

`500 Internal Server Error`

to normal users.

---

# 18. TRUST RULE

Trust is one of Kaalmo's most important product principles.

Trust information must be visible.

Relevant trust signals:

- Identity Verified
- Beneficiary Verified
- Payment Verified
- Organization Verified

Do not hide verification information deep inside the interface.

However:

**Verification must never be presented as a guarantee that everything about a campaign is true.**

Use honest language.

---

# 19. CAMPAIGN RULE

A campaign is a human story, not a financial stock.

Campaign UI should prioritize:

1. Who is asking?
2. Who benefits?
3. Why is the money needed?
4. How much is needed?
5. How much has been raised?
6. Is the organizer verified?
7. When was the campaign last updated?

Avoid turning campaign cards into financial dashboards.

---

# 20. CAMPAIGN IMAGE RULE

Use imagery with dignity.

Prefer:

- authentic people
- Somali communities
- families
- students
- community projects
- schools
- wells
- clinics
- respectful medical imagery

Avoid:

- exploitative poverty imagery
- exaggerated suffering
- random stock photos
- obviously AI-generated people
- culturally inappropriate imagery

---

# 21. CAMPAIGN CARD RULE

Campaign card should normally contain:

- Image
- Category
- Title
- Short description
- Organizer
- Verification
- Raised amount
- Goal
- Progress
- Donor count
- Time remaining where relevant

Do not add unnecessary data.

The card must remain easy to scan.

---

# 22. CAMPAIGN DETAIL RULE

Campaign details page is primarily a:

**Trust + Understanding + Donation**

experience.

Do not overload it with unrelated features.

Important information must be visible before secondary information.

Donation panel must remain clear.

Share and report actions should exist but should not compete with Donate.

---

# 23. ORGANIZER DASHBOARD RULE

Organizer dashboard should focus on:

**What do I need to do next?**

Prioritize:

- Campaign status
- Amount raised
- Donors
- Important actions
- Recent donations
- Recent updates
- Withdrawal status

Do not create a wall of colorful KPI cards.

---

# 24. ADMIN DASHBOARD RULE

Admin dashboard is an operational tool.

Prioritize:

- Queues
- Tables
- Status
- Verification
- Payments
- Withdrawals
- Risk
- Reports
- Audit information

Admin UI must prioritize speed and clarity.

Do not make the admin dashboard look like a marketing website.

---

# 25. FORM RULE

Forms must be task-oriented.

Rules:

- Ask only necessary information
- Group related fields
- Use clear labels
- Provide useful examples
- Validate appropriately
- Show errors next to fields
- Preserve entered information after recoverable errors
- Avoid unnecessary dropdowns
- Avoid unnecessarily long forms

Long processes should use logical steps.

---

# 26. CAMPAIGN CREATION RULE

Campaign creation should follow:

**Basics → Story → Media → Beneficiary → Verification → Review → Submit**

Always show progress.

Allow draft saving.

Do not make the organizer feel like they are filling out a government form.

---

# 27. EMPTY STATE RULE

Never use:

**"No data found."**

Use contextual language.

Example:

**No donations yet**

"Your first donation will appear here when someone supports this campaign."

Then provide a relevant action if appropriate.

---

# 28. LOADING RULE

Every asynchronous experience needs feedback.

Use:

- Skeleton
- Spinner
- Progress
- Disabled button
- Upload progress

Choose the simplest appropriate loading pattern.

Do not use skeletons everywhere.

---

# 29. ERROR RULE

Every important flow must consider:

- Network failure
- Server failure
- Validation failure
- Permission failure
- Expired session
- Timeout
- Payment failure
- Upload failure
- Verification failure

Error message structure:

**What happened**

+

**What the user can do next**

Do not blame the user.

Do not expose technical implementation details.

---

# 30. SUCCESS RULE

Success must be clear but calm.

Examples:

**Donation confirmed**

**Campaign submitted for review**

**Campaign approved**

**Withdrawal request received**

Do not over-animate success.

---

# 31. RESPONSIVE WEB RULE

Never simply scale desktop down.

Responsive design must adapt the experience.

### Mobile browser

Prioritize:

- Campaign
- Trust
- Donate
- Story
- Updates

Collapse secondary information.

### Tablet

Use balanced layouts.

### Laptop

Use full application layouts.

### Desktop

Use:

- tables
- side panels
- analytics
- multi-column layouts

### Large desktop

Use maximum content widths.

Do not stretch content across the entire screen.

The responsive constitution explicitly requires adapting hierarchy and behavior rather than merely shrinking dimensions.

---

# 32. NAVIGATION RULE

Navigation must reflect the user's mental model.

Do not add navigation items simply because a dashboard template has them.

Public navigation should remain focused.

Authenticated navigation should depend on the user's role.

Do not show Organizer navigation to a normal donor unless relevant.

Do not expose Admin functions to normal users.

---

# 33. ROLE PERMISSION RULE

UI must respect role permissions.

### Donor

Can:

- Browse
- Donate
- Save
- Follow
- Comment where allowed
- View receipts

### Organizer

Can:

- Create campaigns
- Manage campaigns
- View donations
- Post updates
- Manage team
- Request withdrawals

### Beneficiary

Can:

- Verify identity
- View campaign
- View payout information
- View withdrawal status

### Co-organizer

Can assist with campaign management.

Cannot perform organizer-only financial actions.

### Admin

Can manage platform operations.

### Moderator

Focuses on trust, verification, reports, moderation, and risk review.

### Support

Handles user support.

Never design controls outside the user's permission scope.

---

# 34. SOMALI / ENGLISH RULE

Supported languages:

**Somali | English**

Both languages must be treated as first-class languages.

Do not create layouts that only work for English.

Allow longer Somali strings.

Do not hard-code text assumptions based on English length.

Use natural human language.

Avoid robotic translation.

---

# 35. CONTENT RULE

UI copy must sound human.

Avoid:

- corporate jargon
- AI-style marketing language
- repetitive phrases
- exaggerated promises
- fake urgency

Use:

- short explanations
- direct language
- contextual feedback
- respectful wording

---

# 36. URGENCY RULE

Kaalmo may contain urgent campaigns.

Urgency must be informative, not manipulative.

Allowed:

**Medical emergency**

**Campaign ends in 3 days**

Not allowed:

**DONATE NOW OR IT'S TOO LATE!!!**

Do not use aggressive countdowns or emotional manipulation.

---

# 37. SHARING RULE

Sharing is important because community distribution matters.

Supported patterns may include:

- WhatsApp
- Facebook
- Copy link

Sharing must not dominate the campaign page.

The campaign itself remains the focus.

---

# 38. NOTIFICATION RULE

Only meaningful notifications should be shown.

Examples:

- Campaign approved
- Donation received
- Payment failed
- Withdrawal completed
- Campaign update
- Verification result
- Security alert

Do not create notification noise.

---

# 39. ACCESSIBILITY RULE

Accessibility is mandatory.

Consider:

- Contrast
- Keyboard navigation
- Focus states
- Semantic hierarchy
- Screen readers
- Readable font sizes
- Accessible controls
- Error messaging
- Reduced motion

Never communicate important information using color alone.

For example:

Do NOT rely only on green for "Payment successful."

Use:

**✓ Payment successful**

---

# 40. ICON RULE

Use one consistent icon family.

Do not mix:

- random outline icons
- random filled icons
- 3D icons
- unrelated icon libraries

Icons must communicate meaning.

---

# 41. ANIMATION RULE

Animation must have a purpose.

Allowed:

- page transition
- loading feedback
- confirmation
- subtle hover states
- status transition

Avoid:

- bouncing
- floating decorative elements
- long transitions
- excessive parallax
- animation everywhere

Animation should never slow down important tasks.

---

# 42. DARK MODE RULE

Do not create dark mode unless it is explicitly part of the approved scope.

If dark mode is later approved:

It must receive its own deliberate color system.

Do NOT simply invert the light theme.

---

# 43. DATA RULE

Use realistic data.

Do not use:

- John Doe
- Lorem ipsum
- random meaningless numbers

Use realistic:

- Somali names
- Somali regions
- campaign stories
- donation amounts
- dates
- statuses
- payment states

The UI must remain usable with:

- long names
- long stories
- large numbers
- missing images
- missing information
- large datasets
- multiple languages

---

# 44. TABLE RULE

Admin tables should prioritize:

- scanability
- sorting
- filtering
- status
- search
- pagination

Do not turn every table row into a collection of badges.

Use compact, readable information.

---

# 45. SECURITY UX RULE

Sensitive information must be handled carefully.

Never expose:

- full identity documents
- full payout account details
- sensitive personal information

Use masked information where appropriate.

Sensitive actions require confirmation.

---

# 46. NO DARK PATTERNS

Never:

- hide important fees
- preselect unwanted donations/tips
- make cancellation difficult
- disguise destructive actions
- manipulate users into donating
- create fake scarcity
- use deceptive wording

Kaalmo must be trustworthy.

---

# 47. NO UNAPPROVED FEATURES

Do not add:

- cryptocurrency
- subscriptions
- lending
- marketplace
- messaging platform
- live chat between donors and beneficiaries
- native mobile app
- AI assistant
- social feed
- unnecessary gamification
- NFT features
- unrelated fintech features

unless explicitly added to the approved product specification.

---

# 48. NO UNAPPROVED VISUAL TRENDS

Do not introduce visual trends simply because they are popular.

Do not add:

- glassmorphism
- neumorphism
- bento grids everywhere
- 3D blobs
- excessive gradients
- floating UI
- oversized illustrations
- animated backgrounds

unless there is a clear product reason and explicit approval.

---

# 49. COMPONENT REUSE RULE

Before creating a new component:

1. Search existing components.
2. Check whether an existing component can be reused.
3. Extend an existing component if appropriate.
4. Only create a new component when the pattern is genuinely different.

Avoid component duplication.

---

# 50. DESIGN TOKEN RULE

Do not hard-code random visual values.

Centralize:

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Breakpoints
- Component heights
- Motion

The design system must remain consistent.

---

# 51. SCREEN DESIGN PROCESS

For every new screen, follow this sequence:

### Step 1

Identify the user.

### Step 2

Identify the user's primary task.

### Step 3

Identify the most important information.

### Step 4

Identify the primary action.

### Step 5

Identify possible mistakes.

### Step 6

Design empty/loading/error/success states.

### Step 7

Design responsive behavior.

### Step 8

Reuse existing components.

### Step 9

Apply design tokens.

### Step 10

Perform anti-AI review.

Do not jump directly from requirement → UI decoration.

---

# 52. AI AGENT BEHAVIOR RULE

When working on Kaalmo, the AI agent must behave conservatively.

If the requirement is unclear:

**Do not invent a new feature.**

If two design options are possible:

**Prefer the simpler one.**

If an existing component can solve the problem:

**Reuse it.**

If a new visual pattern is proposed:

**Ask whether it is necessary.**

If a feature is outside the specification:

**Do not implement it without approval.**

---

# 53. CHANGE CONTROL RULE

When modifying an existing screen:

Do not redesign the entire page.

Change only what is required.

Preserve:

- Existing layout
- Navigation
- Typography
- Colors
- Components
- User flow

unless the task explicitly requests a redesign.

---

# 54. DESIGN REVIEW RULE

Before finalizing any screen, perform this checklist:

### UX

- Is the purpose obvious?
- Is the primary action obvious?
- Can a first-time user understand it?
- Is anything unnecessary?

### UI

- Is spacing consistent?
- Is typography consistent?
- Is hierarchy clear?
- Are components consistent?

### Human

- Does it feel like a real product?
- Does it feel intentional?
- Does it have Kaalmo personality?
- Does anything look AI-generated?

### Trust

- Is important information visible?
- Are financial states clear?
- Are verification signals understandable?

### Accessibility

- Is contrast sufficient?
- Can keyboard users operate it?
- Are states understandable without color?

### Responsive

- Mobile browser works
- Tablet works
- Laptop works
- Desktop works
- Large desktop works

### Edge cases

- Empty
- Loading
- Error
- Success
- Long content
- Missing data
- Slow network

---

# 55. FINAL ANTI-AI TEST

Before approving any screen ask:

> If I remove the Kaalmo logo, would this screen look like a generic AI-generated template?

If YES:

**REDESIGN.**

If NO:

Continue.

---

# 56. FINAL PRIORITY ORDER

When design decisions conflict, follow this order:

1. User safety
2. Trust
3. Usability
4. Clarity
5. Accessibility
6. Financial transparency
7. Consistency
8. Responsive behavior
9. Brand identity
10. Aesthetics

Never sacrifice trust or usability for visual beauty.

---

# 57. ABSOLUTE RULE

The AI must NEVER optimize Kaalmo for:

**"Wow, this looks cool."**

The AI must optimize Kaalmo for:

**"I immediately understand what this is, I trust what I'm seeing, and I know what to do next."**

---

# 58. FINAL PRODUCT PRINCIPLE

Kaalmo is about people helping people.

Every interface decision must respect:

**Human dignity.**

**Trust.**

**Transparency.**

**Clarity.**

**Community.**

**Simplicity.**

The best Kaalmo design is not the one with the most effects.

It is the one where a real person can:

**Find → Understand → Trust → Donate → Follow → See the outcome**

without confusion.

---

# END OF DESIGN RULES

These rules are mandatory unless the product owner explicitly approves a change.