# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately to the project maintainers. Do not open a public issue with exploit details. Include reproduction steps and the affected route or component.

## Controls in place

### Authentication and sessions

- Real accounts use Supabase Auth (`@supabase/ssr`) with HttpOnly cookies managed by the server.
- Demo access uses an HMAC-SHA256 signed, expiring (24h), HttpOnly cookie. The legacy, forgeable `demo_mode=true` cookie is rejected and cleared on every response.
- Logout clears Supabase session cookies server-side and removes local workspace data.
- Password reset uses single-use, time-limited Supabase recovery links. The reset form is protected by the proxy and requires a valid recovery session.
- Account-recovery responses are uniform, so registered emails are not disclosed.

### Request protection

- `proxy.ts` enforces same-origin checks on state-changing requests (`Origin` + `Sec-Fetch-Site`).
- Unauthenticated access to protected pages redirects to `/login?redirect=…`; direct API calls return `401`.
- Every AI and upload route requires a session and applies IP + user rate limits.
- JSON bodies are size-limited and schema-validated with Zod (`.strict()`).
- Error responses are generic; details stay in server logs behind a request reference.

### AI safety

- User-controlled content is wrapped in `<untrusted_*>` tags with a prompt-injection preamble.
- Model output is parsed as JSON and validated against a response schema before use.
- AI-generated HTML is sanitized on the server (`sanitize-html`) and again in the browser before rendering.
- Chat markdown is rendered through an escape-first renderer, never raw HTML injection.

### Uploads

- PDF: `%PDF-` magic-byte check, embedded JavaScript / `/Encrypt` / `/OpenAction` rejected, 10 MB cap.
- DOCX: ZIP signature plus `word/document.xml` presence check, 10 MB cap.
- Filenames are sanitized; parser errors are never reflected to the client.

### Browser hardening

- Content-Security-Policy, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP, and HSTS (production) are applied centrally.
- `X-Powered-By` is disabled.
- `noindex` is set on API and authenticated responses.

### Logging and observability

- Structured JSON events are written to stdout and, when `ELASTIC_LOGS_URL` / `ELASTIC_LOGS_API_KEY` are set, shipped to Elasticsearch after the response completes.
- Events include route, status, duration, request ID, and a pseudonymous user ID. Request bodies, emails, message contents, and IP addresses are never logged.
- Every API request is logged once on completion; failures carry a request reference that matches the client-facing error.

### Supply chain

- CI generates a CycloneDX SBOM on every push and uploads it to OWASP Dependency-Track when the DT secrets are configured.
- Dependabot opens weekly grouped PRs for npm packages and GitHub Actions.

### Data limits

- Labor-law PDF download is capped at 12 MB and 20s timeout.
- Structured labor-law JSON is capped at 2 MB, extracted text at 400k chars.
- Regenerating labor-law data requires the `x-admin-secret` header matched against `ADMIN_SECRET`.

## Operational notes

- Rate limiting uses Upstash Redis (REST) when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, giving global limits across serverless instances. Without them, it falls back to an in-memory, per-instance limiter.
- The CSP allows inline scripts because Next.js bootstraps hydration inline; if you move to nonces, update `lib/security/http.ts`.
- Demo mode is intended for evaluation. Disable it in production by unsetting all signing secrets or by removing the call site if it is not needed.
- Rotate `AUTH_SECRET`, `ADMIN_SECRET`, `GEMINI_API_KEY`, and the Supabase service-role key if exposure is suspected. Rotating `AUTH_SECRET` invalidates existing demo sessions.
