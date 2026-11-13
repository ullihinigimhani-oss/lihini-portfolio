# Phase 5 — Portfolio QA and production readiness

Date: 14 November 2026 (Asia/Colombo). Branch: `develop`.

## Assessment

**Local release candidate passes the implemented build, API, database, asset, and browser interaction checks. Production deployment is conditional on the platform configuration and external-content items below.** No commit, push, merge, deployment, real email, or environment-file change was performed.

## Passed checks

| Area | Evidence and result |
| --- | --- |
| Frontend build | `npm run build` passed after the final source changes. No Vite build warnings or errors. JS about 269.37 kB / 82.25 kB gzip; CSS about 33.69 kB / 8.01 kB gzip. |
| Security audits | Frontend full `npm audit`, backend full `npm audit`, and backend production audit: zero reported vulnerabilities in the installed lockfile-resolved trees. |
| Backend regression tests | `npm test`: 8/8 passed. Syntax checks passed for server, database and tests. |
| API validation | Invalid names, email shapes, subject header injection, null bytes and malformed JSON rejected. Oversized JSON returns 413. Successful requests use parameterized SQL. |
| Spam / rate limiting | Honeypot returns without saving; five requests per 15-minute window enforced and further requests return 429. Invalid submissions and honeypot requests count toward the limit. |
| Storage / SMTP isolation | Neon TLS connectivity, schema, database health and inserted-row checks passed through `npm run check:db`. It ran with SMTP disabled and rolled back its test row. SMTP acceptance and failure tested using mocks; real Nodemailer composition tested in memory. |
| Browser contact submission | Actual React form → dedicated local Express QA API → real Neon transaction succeeded and displayed the saved-message confirmation. SMTP configuration was explicitly excluded from the QA app. Closing the QA API aborted the transaction; a parameterized query for only the exact QA identity confirmed zero remaining test rows. |
| Browser contact failure | Empty form and malformed email blocked by native validation. With the QA API deliberately stopped, the UI showed failure, retained the draft and re-enabled retry. |
| Public reads | GET `/api/contact`, `/api/contact_messages`, `/api/messages`, `/api/contact/123` all returned 404; no stored messages were returned. Health endpoints return status only. |
| CORS | Unapproved origin rejected. The browser test used an explicitly allowed local QA origin. |
| Project filtering | Browser: All 5, Featured 3, Mobile 2, Web 3, Enterprise 1. Internship cards stay separate. |
| Details dialogs | All four verified project dialogs opened and rendered their matching title. Enter opened a dialog; Tab remained within it; Escape closed it and restored the View Details trigger. No internal horizontal overflow in the tested desktop dialogs. |
| Mobile navigation | Expanded and collapsed correctly; Escape closed the menu and restored its trigger. |
| Theme persistence | Dark → light → reload retained light; dark → reload retained dark. Both rendered with their intended independent card palettes. |
| Certificates | Show More displayed 11 PDF links; Show Less restored 6. Grouping by issuer remained intact. |
| Documents and local images | Reusable HTTP preview check verified 22 assets: all 11 certificate PDFs, CV, internship service letter, portrait, favicon and 7 covers. All returned 200 and matched the original bytes. PDFs returned `application/pdf` and had valid PDF signatures. CV anchor retains `download`; service letter retains `_blank` plus `noopener noreferrer`. |
| Responsive layout | Dark-mode DOM layout inspected at 320, 390, 768, 1024, 1366 and 1920px. Light mode inspected at 320, 390, 768 and 1366px. No horizontal document overflow found. Mobile menu used below the desktop breakpoint; desktop navigation remained in one row. Screenshots visually inspected for desktop dark hero/projects and mobile light contact form. |
| Accessibility | One h1, no duplicate IDs, no missing image alt attributes, no broken local section anchors, all visible contact controls labeled. Skip link moved focus to main content. Keyboard button focus had a visible solid outline. |
| Contrast | Sampled rendered heading, skill-group label, badge, project description/link, timeline text, certificate title/date, form label/input/button and filter states all exceeded 4.5:1 in both themes. Dark primary button minimum was 4.59:1. Separate input placeholder/border checks passed. This is a targeted review, not an exhaustive WCAG conformance audit. |
| SEO basics | Correct document title, description, language, viewport and local SVG favicon. Browser theme-color now matches the current dark palette. |
| Credential hygiene | Real `.env` files ignored and untracked. Credential-safe scan of tracked files and final frontend build found no exact configured DATABASE_URL or SMTP password values. No secret values were printed by the scan. |
| Asset preservation | No original photograph, CV, certificate or service-letter PDF modified or deleted. |

## Confirmed failures / external issues

1. **Textile-Saree repository: GitHub 404.** The owner-supplied link remains explicitly marked unavailable and has no fabricated stack/details. Restore visibility or provide the correct URL before treating it as a verified source project.
2. **Supplied Library Manager demo: Vercel 404 NOT_FOUND**, confirmed in a browser. The portfolio already omits the live-demo action. Restore that separate deployment and verify it before adding a demo action back.

The other four project repositories and all 22 source-reference URLs were accessible through GitHub during this phase.

## Remaining warnings and verification limits

- Real SMTP delivery was deliberately not attempted. SMTP variables are present locally, but that alone does not verify credentials, network access or inbox receipt. The app accurately confirms database storage, not final inbox delivery.
- Reduced-motion handling was reviewed in CSS and the reusable Reveal component. Initial reduced preference skips reveal effects, changing preference cancels them, and CSS disables continuous/hover motion. Focus now also disconnects pending reveal observers. OS/browser reduced-motion emulation was not exercised by the available browser controls.
- Animation performance review found opacity/transform entrances, one slow portrait float, one-shot viewport observers, no header animation and no heavy parallax. No Lighthouse, FPS trace, CPU-throttled run or field Core Web Vitals measurement was performed.
- No automated full accessibility engine or screen-reader session was run. Chrome-family embedded-browser checks do not replace Safari, Firefox or physical-device testing.
- Google-hosted fonts are an external request; fallback fonts are present. Offline/custom network behavior was not exhaustively tested.
- `npm audit` covers reported dependency advisories, not proof that application or infrastructure vulnerabilities cannot exist.
- API rate limiting uses an in-memory store. Limits reset when the process restarts and are not coordinated across multiple backend instances.
- A hardcoded external API key previously found in the separate Library Manager repository still needs owner-led rotation/restriction and environment configuration. That separate repository was not modified.
- Canonical URL and Open Graph/social metadata are not yet configured because the production domain has not been supplied.
- Git may print LF/CRLF normalization notices on Windows. These are line-ending notices, not frontend build failures.

## Small fixes completed

- Matched frontend name minimum length to backend validation and added standard name/email autocomplete and field names.
- Updated initial and toggled dark browser theme-color to `#0B0D14`.
- Prevented pending reveal effects from hiding keyboard-focused content.
- Replaced the unverified `5+ academic projects` statistic with the actual five portfolio projects, and called the eleven learning documents learning certificates.
- Added no-store, nosniff and no-referrer API headers.
- Required TLS for optional SMTP and validated explicit proxy-hop settings as non-negative integers.
- Added regression tests for invalid payloads, oversized bodies, public-read denial, response headers, SMTP TLS/order and proxy configuration.
- Added `frontend/scripts/check-production.mjs` for reproducible asset and metadata checks.
- Updated obsolete README repository instructions and documented production settings and QA commands.

## Exact pre-production settings and gates

### Vercel

Use root directory `frontend`, framework Vite, Node 22.x (supported patched runtime), install command `npm ci`, build command `npm run build`, output `dist`. Set the **build-time** `VITE_API_URL` to the actual HTTPS Render origin. Do not put DATABASE_URL or SMTP settings in frontend variables. Without VITE_API_URL, the preserved production behavior is mailto fallback and no Neon form storage.

### Render

Use root directory `backend`, build command `npm ci`, start command `npm start`, a supported patched Node 22.x runtime and `NODE_ENV=production`. The server listens on `0.0.0.0` and uses the service-provided PORT. Use `/api/health/db` for readiness. Set DATABASE_URL only in the backend service settings and FRONTEND_URL to the exact Vercel origin without a trailing slash. Verify the account has permissions to initialize the contact table.

Set `TRUST_PROXY_HOPS` only after checking the real proxy topology. Validate that independent clients receive independent rate limits and that spoofed forwarding headers do not bypass them. Local tests validate the option and limiter behavior, but cannot establish the actual Render hop count. The [express-rate-limit proxy guide](https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues) explains why this matters.

Dashboard-based deployment is supported without a checked-in `vercel.json` or `render.yaml`. There are currently no such manifests. Actual cloud settings, production domain, SMTP egress, database service permissions and production health were **not verified** and no deployment was performed. See [Vite deployment guidance](https://vite.dev/guide/static-deploy.html) and [Render's Node/Express guide](https://render.com/docs/deploy-node-express-app).

Before sharing the production URL: fix or continue clearly labeling the unavailable external project links; set API/CORS/proxy settings; add verified canonical/social metadata; perform an approved production smoke test. Test SMTP only with separate explicit authorization. Keep auto-deploy triggers disabled until publication is approved.

## Re-run commands

From `frontend`: `npm run build`, then `node scripts/check-production.mjs`, then `npm audit`.

From `backend`: `npm test`, `npm run check:db`, `npm audit`, `node --check server.js`, `node --check database.js`.

The temporary browser QA servers used ports 5180 and 5181. The QA API was closed and its record cleanup confirmed. Existing user servers were not stopped.
