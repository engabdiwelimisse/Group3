# Kaalmo — Client

React + Vite + Tailwind frontend for the Kaalmo fundraising platform. Design system follows
`../Design_Rules.md` exactly (colors, spacing, radius, typography) — see that file before adding or
changing any screen.

## Setup

```bash
cd client
npm install
cp .env.example .env   # points to the local backend by default
npm run dev
```

The backend (`../server`) must be running for any page that fetches live data (Explore, Campaign
Detail, dashboards, admin). Static pages (How It Works, Safety, Help Center) work without it.

## Structure

- `src/components/` — shared design-system components (Button, Input, CampaignCard, StatusPill,
  VerificationBadge, ProgressBar, Navbar, Footer, DashboardLayout, etc.). Reuse these before adding
  a new one — see Design_Rules.md Rule 49.
- `src/pages/public/` — Home, Explore, Campaign Detail, How It Works, Safety, Contact, Help Center,
  Terms, Privacy.
- `src/pages/auth/` — Login, Register.
- `src/pages/donor/` — Dashboard, Donate, Donation Confirmed.
- `src/pages/organizer/` — Dashboard, campaign creation wizard (Basics → Story → Review & Submit),
  Analytics, Withdrawals, Onboard (self-service organizer upgrade).
- `src/pages/beneficiary/` — Verification.
- `src/pages/admin/` — Overview, Campaigns (with approve/reject/publish/suspend actions),
  Verification Queue, Users, Fraud & Risk, Support Tickets, Audit Logs.

## What's live vs. sample data

Most pages call the real backend API (`src/api/client.js`). A few admin pages —
**Fraud & Risk**, **Support Tickets**, **Audit Logs** — show clearly-labeled sample data because
those backend subsystems don't exist yet (see `../PROGRESS.md`). They are visually complete and
consistent with the design system, but their action buttons are disabled rather than pretending to
work.

## Design tokens

All colors, spacing, and radius values are centralized in `tailwind.config.js` using the exact
values from `Design_Rules.md` — never hardcode a hex color or arbitrary spacing value in a page;
use the token classes (`bg-primary`, `text-text-secondary`, `p-lg`, `rounded-lg`, etc.).
