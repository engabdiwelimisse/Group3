# Kaalmo — Horumarka Mashruuca (Progress Tracker)

> La cusboonaysiiyay: 2026-08-28 (dhinac lixaad)
> Tani waa faylka lagu raad-raaco waxa la dhisay, waxa socda, iyo waxa weli ku dhiman marka loo eego `kaalmo-web-only-spec.md` iyo `Design_Rules.md`.

---

## 1. Guud ahaan xaaladda hadda

| Qayb | Xaalad |
|---|---|
| **Backend (server/)** | 🟢 MVP-core + trust/moderation + social features (Follow/Save/Reports/Team/Notifications) waa dhammaystiran — weli lama xirin lacag-bixin dhab ah |
| **Frontend (client/)** | 🟢 Bogagga oo dhan ee la qorsheeyay waa la dhisay oo dhab ah ula xiran yihiin backend-ka; **i18n dhab ah waa la dib-dhigay** (user codsaday) |
| **Admin Dashboard** | 🟢 Overview, Campaigns, Verification Queue, Users, **Reports**, Audit Logs — dhab ah; Fraud/Support kaliya ayaa weli preview sample data ah |
| **Payment Providers** | 🔴 **Ha la taaban** (user si cad u sheegay) — manual/admin-recorded kaliya ayaa jira |
| **Deployment** | 🔴 Wali lama bilaabin |

## 0. Cusboonaysiinta ugu dambeysay (2026-08-28, dhinac lixaad)

**Codsi:** "frontend howlha dhiman dhameystir, logada ii badal isticmal logo.png, backend wixii la qaban karo ka qabo, payments gadaal u dhig, ha implement gareynin." (i18n-ka waxaa dib loo dhigay codsi kale oo dambe.)

### Logo
- ✅ `logo.png` (aad soo dirtay) waxaa lagu daray `client/public/logo.png`, `Logo.jsx` component cusub oo Navbar iyo Footer isku mid ah isticmaalaan
- Fiiro: adigu qudhaadu dib ayaad u beddeshay `Logo.jsx` (icon-ka size + magaca "Kaalmo" oo laga saaray) — waan sii wadnay isaga oo la taaban maayo

### Backend — feature cusub (payments lama taaban)
- ✅ **Reports** — `Report` model, `POST /reports` (user), `GET/PATCH /admin/reports` (admin review: reviewed/dismissed)
- ✅ **Follow/Save (bookmark) campaigns** — `Follow`/`Bookmark` models, toggle endpoints (`POST/DELETE /campaigns/:id/follow`, `/save`), `GET /campaigns/:id/interactions`, `GET /users/me/{followed,saved}-campaigns`
- ✅ **Co-organizer Team system** — `CampaignMember` model, invite-by-email (`POST /campaigns/:id/members`), list/remove, invitee-side accept flow (`GET/POST /campaign-invites/...`), email invite (Resend) + in-app notification. Co-organizers oo `accepted` ah hadda waxay heli karaan **edit + post-update** permissions campaign-ka (`canEditCampaign`/`isCampaignContributor` la cusboonaysiiyay)
- ✅ **In-app Notifications** — `Notification` model, `GET /notifications/mine`, mark-read/mark-all-read; waxaa la dhajiyay: campaign approve/reject/publish/suspend/restore, payment confirmed, beneficiary verified/rejected, withdrawal reviewed, account status change, team invite, campaign update posted (dhammaan followers-ka)

### Bug-yo la xaliyay (muhiim ah)
- ✅ **CampaignDetail crash on 401**: haddii `/interactions` (donor-specific) uu 401 noqdo, `Promise.all` ayaa xanibi jiray dhammaan xogta campaign-ka, isaga oo tusaya "Campaign not found" xitaa marka campaign-ku jiro dhab ahaantii. Hadda `interactions` si madax-banaan ayuu u dalbanayaa (fail-silent), campaign-ka core-kiisu marnaba kuma xirna
- ✅ **Ma jirin access-token auto-refresh**: access token-ku wuxuu dhacaa 15 daqiiqo — ka dib, API calls oo dhan 401 bay noqon jireen iyada oo aan lagu tijaabin refresh token-ka. Waxaan ku darray axios response interceptor (`client.js`) oo isku dayo `/auth/refresh` hal mar, dib u celiya codsiga; haddii refresh-kuna fashilmo, session-ka si sax ah ayaa loo tirtiraa (`kaalmo:session-expired` event → `AuthContext` state cusboonaysiin)

### Frontend — bogag cusub oo la dhisay
- ✅ Donor: **Saved campaigns**, **Followed campaigns**, **Notifications** (bell + list, mark-read), **Settings** (fullName edit)
- ✅ Organizer: **Team** (invite/list/remove co-organizers), **Invites** (qof kasta oo casuumaad helay wuu aqbali karaa)
- ✅ Admin: **Reports** (list open reports, mark reviewed/dismissed)
- ✅ Beneficiary Verification page: **ID document upload** hadda dhab ah (`ImageUpload` la xiray)
- ✅ Campaign Detail page: **Follow**, **Save**, **Report** (modal+form), **Share** (copy link) — dhammaan dhab ah
- ✅ Navbar: **notification bell** oo leh unread-count badge
- ✅ Organizer/Donor nav-yada waxaa loo beddelay shared `nav.js` files si loo yareeyo duplication-ka

### La dib-dhigay (user codsaday)
- ⏸️ **Somali/English i18n dhab ah** — waxaa la dib-dhigay codsi kale ("i18n dib u dhig, waxa kale qabo"). Navbar-ka waxaa lagu celiyay static text-kii hore (ma jiro `LanguageContext`)

---

## 2. Waxa la Dhammeeyay ✅ (cusub — 2026-08-28, dhinac shanaad)

### Organizer onboarding — email confirmation dhab ah (labo-tallaabo)
- ✅ **La beddelay batoon-kii "Continue as organizer" (hal click)** oo isla markiiba role-ka bixin jiray, waxaana lagu beddelay **labo-tallaabo oo email-ku xaqiijiyo**:
  1. `/organizer/onboard` — form (full name + "what are you raising money for") → `POST /users/me/request-organizer-access` — waxay **kaliya diraa email confirmation ah**, role-ka **ma bixiso**
  2. Email-ka gudihiisa link → `/organizer/confirm?token=...` → `GET /users/organizer-access/confirm/:token` — **kaliya halkan** ayaa role-ka `organizer` loo daraa user-ka
- ✅ Idempotent (sida email verification-ka), token 24h expiry, guard `ALREADY_ORGANIZER` haddii horeba organizer yahay, guard `EMAIL_NOT_VERIFIED` haddii account-ka aan la xaqiijin
- ✅ La tijaabiyay end-to-end (curl): request → role weli `['donor']` → confirm → role hadda `['donor','organizer']` → re-confirm idempotent → re-request `409 ALREADY_ORGANIZER`

## 2c. Waxa la Dhammeeyay ✅ (cusub — 2026-08-28, dhinac afraad)

### Organizer onboarding — xaqiijin cad ka hor role-ka (la beddelay 2c, eeg 2 kore)
- ✅ **La beddelay auto-onboard-kii hore** — hore, riixida "Start a fundraiser" si toos ah (iyada oo aan la sugin xaqiijin) ayay user-ka uga dhigi jirtay organizer isla markiiba (`useEffect` auto-run). Hadda `/organizer/onboard` waxay tusaysaa bog xaqiijin ah oo leh batoon "Continue as organizer" — role-ka **kuma dhaco** ilaa user-ku uu si cad u riixo. Haddii user-ku laabto isaga oo aan riixin, roles-kiisu wuu sii ahaan doonaa `['donor']`. La tijaabiyay browser dhab ah.

## 2b. Waxa la Dhammeeyay ✅ (cusub — 2026-08-28, dhinac saddexaad)

### Shuruudda organizer noqoshada
- ✅ **Email verification hadda waa shuruud** ka hor inta user-ku `become-organizer` sameyn karo — `POST /users/me/become-organizer` wuxuu soo celiyaa `403 EMAIL_NOT_VERIFIED` haddii aan la xaqiijin. Frontend-ku horeba wuu maareeyaa arrintan (login gate-ka `ProtectedRoute`), backend check-gan waa defense-in-depth. Go'aan la go'aamiyay: shuruud fudud (email kaliya) si loo yareeyo fake accounts, iyada oo aan lagu darin culeys dheeraad ah user-ka.

## 2b. Waxa la Dhammeeyay ✅ (cusub — 2026-08-28, dhinac labaad)

### Email verification — mid dhab ah + login gate
- ✅ **Resend integration dhab ah** — email-yadu si dhab ah ayay ugu socdaan users-ka (domain `kalmo.ideashubsomalia.com` la xaqiijiyay)
- ✅ **Login gate**: user aan email-kiisa xaqiijin **ma heli karo app-ka** — `ProtectedRoute` wuxuu ku celiyaa `/check-email` ilaa ay xaqiijiyaan (Login.jsx sidoo kale toos ayuu ugu diraa halkaas)
- ✅ **Navbar minimal mode**: bogagga `/verify-email` iyo `/check-email`, profile icon iyo "Log out" **lama muujiyo** (log out button oo qoraal ah ayaa ku jira bogga qudhiisa si aanu user-ku u xirnaan)
- ✅ **Bug la xaliyay — idempotent verify**: link-yada email-ka waxaa "isticmaali" kara Gmail/security scanners iyaga oo aan user-ku weli riixin (prefetch) — `verifyEmail()` hadda waa idempotent, click-ka labaad ee token la isticmaalay horeba wuxuu soo celiyaa guul, ma ahan "invalid/expired"
- ✅ **Bug la xaliyay — EMAIL_FROM qaldnaa**: `.env` domain-ka aan la xaqiijin (`onboarding@resend.dev`) ayaa diidi jiray dirista third-party emails — hadda `EMAIL_FROM` wuxuu isticmaalayaa domain-ka la xaqiijiyay
- ✅ **Bug la xaliyay — resend "sent:true" been ah**: hore ayuu u sheegi jiray guul xitaa marka Resend uu fashilmo (403) — hadda waxaa la soo celiyaa error run ah (`EMAIL_SEND_FAILED`)
- ✅ **Bug la xaliyay — stale frontend state**: marka user-ku email-ka xaqiijiyo, `AuthContext` (localStorage) hore uma cusboonaysiin jirin `emailVerified`, sidaas darteed user-ku sii xiran lahaa `/check-email` xitaa ka dib verification-ka dhabta ah — hadda `refreshUser()` ayaa loo yeeray si toos ah kadib guusha verify-ka
- ✅ **Bug la xaliyay — CORS**: `.env` `CLIENT_ORIGIN` ayaa mar-mar laga saarayay dev port-yada (5180/5185) marka la beddelo settings kale — waa fiiro celin mustaqbalka ah in la hubiyo mar kasta

## 2b. Waxa la Dhammeeyay ✅ (2026-08-28, dhinac koowaad)

### Dhibaatooyin la xaliyay
- ✅ **Admin ma arki jirin campaign-yada `submitted`** — status-kan waxaa lagu daray filter-ka admin + action buttons (approve/start_review/reject); backend-ku hadda wuxuu ogolaadaa `approve` toos ah `submitted → approved`
- ✅ **Donation-yadu waxay u furnaayeen campaign kasta** (xitaa draft/suspended) — hadda waxaa la hubiyaa in campaign-ku status public/donatable ku yahay ka hor inta donation la abuurin
- ✅ **Verification badges ma ahayn kuwo dhab ah** — marka admin-ku beneficiary-ga xaqiijiyo, campaign-yada isaga la xiriira si otomaatig ah waxay helayaan badge-ka `beneficiary_verified` (iyo laga saarid haddii la diido)
- ✅ **Email verification link jabay** — `CLIENT_ORIGIN` (comma-separated liis) ayaa si qaldan loo isticmaali jiray link-ka email-ka; hadda waxaa la isticmaalaa origin-ka koowaad kaliya

### Feature cusub
- ✅ **Audit Logs — dhab ah**: `AuditLog` model (immutable), la qoro marka la sameeyo: campaign review, payment confirm, beneficiary review, user status change, withdrawal review — `GET /admin/audit-logs`, frontend-ku xog dhab ah ayuu tusayaa (ma aha sample)
- ✅ **Image upload — dhab ah**: `POST /api/v1/uploads/image` (multer, local disk storage `server/uploads/`, JPEG/PNG/WebP, 5MB max), la xiray `ImageUpload` component + Campaign Creation "Basics" step (cover photo)
- ✅ **Organizer onboarding — la fududeeyay**: "Start a fundraiser" hadda si otomaatig ah ayuu user-ka uga dhigayaa organizer (ma jiro click dheeraad ah oo xaqiijin ah), toos ayuuna ugu gudbiyaa campaign creation-ka. `StartFundraiserLink` component wuxuu go'aamiyaa meesha loo diri lahaa iyadoo ku xiran xaalada user-ka (logged-out/donor/organizer)
- ✅ **Email verification frontend**: `/verify-email` (link-ka email-ka wuu shaqeeyaa), `/check-email` (confirmation page + resend), `POST /auth/resend-verification-email`

### Frontend (client/) — React + Vite + Tailwind
- ✅ Design system dhab ah oo ku salaysan `Design_Rules.md`
- ✅ Component library: Button, Input, VerificationBadge, ProgressBar, StatusPill, CampaignCard, Navbar (role-aware), Footer, DashboardLayout, WizardSteps, EmptyState, SampleDataNotice, **ImageUpload**, **StartFundraiserLink**
- ✅ Public: Home (GoFundMe-style layout, Kaalmo colors, real stats), Explore, Campaign Detail, How It Works, Safety, Contact, Help Center, Terms, Privacy
- ✅ Auth: Login, Register, **Verify Email, Check Email** — wired
- ✅ Donor: Dashboard, Donate, Donation Confirmed
- ✅ Organizer: Onboard (auto), Dashboard, campaign wizard (Basics w/ **image upload** → Story → Review & Submit), Analytics, Withdrawals
- ✅ Beneficiary: Verification
- ✅ Admin: Overview, Campaigns (approve/reject/publish/suspend/restore incl. `submitted`), Verification Queue, Users, **Audit Logs (dhab ah)**
- 🟡 Admin: Fraud & Risk, Support Tickets — weli sample data (backend subsystems lama dhisin)

### Backend — Models — 12/12
- ✅ `User`, `Campaign`, `Beneficiary`, `Donation`, `Payment`, `PaymentTransaction`, `Withdrawal`, `PayoutAccount`, `Update`, `Comment`, `Verification`, **`AuditLog`**

---

## 3. Waxa Ku Dhiman (Weli Lama Bilaabin) 🔴

### Backend
- [ ] Fraud detection / risk scoring (Section 21) — frontend sample data
- [ ] Support ticket system (Section 24) — frontend sample data
- [ ] **Real payment provider (mobile money — EVC Plus/eDahab/Zaad) — user si cad u sheegay in la dib-dhigo, ha la taaban**
- [ ] Webhook handling + idempotency (ku xiran payment provider-ka kore)
- [ ] Like (donation "support" reaction) — Follow/Bookmark waa la dhammeeyay, Like weli lama dhisin
- [ ] Notification email channel — hadda in-app kaliya; email-events (via Resend) weli lama xirin dhammaan dhacdooyinka
- [ ] Local disk storage (`server/uploads/`) waa MVP fallback — u baahan S3/Cloudflare R2 marka la geeyo production (fayl-yadu kuma hadhi doonaan disk-ka haddii server-ku dib loo geeyo)

### Frontend
- [ ] Somali/English isku-dhafka runtime-ka (i18n dhab ah) — **la dib-dhigay codsi kale**

### Deployment — 0% la bilaabay
- [ ] Dockerize server + client
- [ ] CI/CD
- [ ] Production hosting + secrets management + object storage (S3/R2)

---

## 4. Talaabada Xigta ee La Soo Jeediyay

1. **Somali/English i18n dhab ah** — marka la ogolaado in la bilaabo
2. **Real payment provider** — marka provider (EVC Plus/eDahab/Zaad) la xaqiijiyo oo la ogolaado in la bilaabo
3. Email notification channel (ma ahan in-app kaliya)
4. Fraud/Support backend subsystems (hadda frontend-ku sample data ayuu tusayaa)

Fadlan ii sheeg xagee la bilaabo.

---

## 5. Sida Faylkan loo Isticmaalo

Fayl kastaa oo la sameeyo ama feature la dhammeeyo, waa in faylkan **la cusboonaysiiyo**.
