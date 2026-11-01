# Security (front end)

No app is "100% secure", but these rules close the holes that real front ends ship with. Treat every item as required unless it clearly does not apply, and say so when you skip one.

## 1. Secrets
- Anything in the browser bundle is public. That includes every `VITE_*`, `NEXT_PUBLIC_*` and `REACT_APP_*` variable.
- Never put API keys with write or billing access, database URLs, JWT secrets, SMTP passwords or service-account files in front-end code. Call your own server (or a serverless function) and keep the secret there.
- Publishable keys that are designed to be public (Stripe publishable key, Firebase web config, Maps keys) are fine, but restrict them by domain in the provider's dashboard.
- Add `.env*` to `.gitignore` (keep a committed `.env.example` with empty values). Never print secrets in logs, errors or chat replies.

## 2. Cross-site scripting (XSS)
- React escapes text by default. Do not undo it: avoid `dangerouslySetInnerHTML`. If you must render HTML (CMS content, markdown), sanitise it first with DOMPurify.
- Never build `href`/`src` from user input without checking the protocol. Allow only `https:`, `http:`, `mailto:`, `tel:` and relative paths; block `javascript:` and `data:`.
- Never `eval`, `new Function` or `setTimeout("string")`.

```js
export function safeUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? u.href : "#";
  } catch {
    return "#";
  }
}
```

## 3. Links and embeds
- `target="_blank"` always with `rel="noopener noreferrer"`.
- Third-party iframes: `sandbox` with the fewest permissions, `loading="lazy"`, `referrerpolicy="strict-origin-when-cross-origin"`.
- Load third-party scripts only from trusted CDNs, pinned to an exact version, with Subresource Integrity (`integrity` + `crossorigin`) when the CDN supports it.

## 4. Auth on the client
- Keep session tokens in `httpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) cookies set by the server. Do not store JWTs or refresh tokens in `localStorage` or `sessionStorage` (any XSS can read them).
- Hiding a button is not access control. The server must check permission on every request.
- Log out clears the server session; on 401 responses redirect to sign in.

## 5. Forms
- Validate on the client for UX (required, format, length) and again on the server for safety. Share the schema (for example Zod) when you can.
- Limit lengths (`maxLength`), use correct `type`/`autocomplete`, never echo raw errors from the server that reveal internals.
- Bot protection on public forms (sign up, contact): a honeypot field plus server-side rate limiting, or a CAPTCHA provider.
- File inputs: restrict `accept`, check size before upload, and let the server re-check type and size.

## 6. Security headers (set by the host)
Example for Vercel (`vercel.json`); adapt the CSP to the domains you actually use, then test that nothing breaks.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self' https://api.yourdomain.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```
Netlify uses `_headers`; Nginx uses `add_header`. WebGL components need `script-src 'self'` only; Google Fonts needs the two font domains above.

## 7. Dependencies and build
- Install packages only from npm with exact names (watch for typosquats). Prefer well-maintained packages.
- Run `npm audit` and fix high and critical issues; turn on Dependabot or Renovate.
- Commit the lockfile. Do not ship source maps with secrets in them; production builds should not expose `.env` or internal URLs.

## 8. Privacy
- Ask before using camera, microphone, location or notifications, and only when the user acts.
- Cookie and analytics consent where the law requires it (EU, UK, India DPDP). Load analytics after consent.
- Do not log personal data to the console or third-party error trackers; scrub emails and tokens.

## 9. Before you ship
- [ ] No secrets in the bundle (search the build output for `sk_`, `secret`, `password`, `mongodb+srv`, `BEGIN PRIVATE KEY`).
- [ ] No `dangerouslySetInnerHTML` with unsanitised input; all user URLs pass `safeUrl`.
- [ ] Every `target="_blank"` has `rel="noopener noreferrer"`.
- [ ] Tokens live in httpOnly cookies, not web storage.
- [ ] Security headers set and checked (for example with securityheaders.com).
- [ ] `npm audit` clean of high and critical issues.
