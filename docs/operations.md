# Operations and recovery

## Scope and architecture

CodeConvert is a public Next.js tool directory hosted on Netlify. Tool input and file processing happen in the visitor's browser. The application has no user accounts, database, payment processing, transactional email, or external AI service integration. Database restore procedures, tenant isolation, payment reconciliation, model quotas, and job queues do not apply to the current application.

Source, tool content, dependency versions, Node version, and build settings are in Git. Netlify owns CDN delivery, the Next.js adapter, atomic deploy publication, and certificate automation. DNS for `codeconvert.net` is managed separately from application code. Do not assume that a successful build verifies registrar access, billing, or certificate renewal.

## Release checks

1. Use a short-lived branch and a reviewed pull request. Do not include real customer code or credentials in fixtures, screenshots, logs, or issues.
2. Run `npm ci` with Node.js 24.11 or later in the 24.x release line, then `npm run build:verified`.
3. Exercise affected tools in a browser, including invalid input, keyboard navigation, clear while running, and downloading the output. The automated production smoke check verifies HTTP and SEO behavior, not every browser interaction.
4. Review a Netlify Deploy Preview when available. Verify the deployed commit and the `build:verified` logs before accepting a release. The Netlify build command runs the gates before publishing; GitHub Actions is an additional review signal.
5. After publishing, check the production URL and run the live check below. Record the commit, deploy ID, result, and any incident in the team's release record.

```powershell
$env:SEO_BASE_URL = "https://codeconvert.net"
npm run seo:live-check
```

The expected production behavior includes a valid HTTPS certificate, `www` redirecting to the primary domain, legacy tool URLs returning permanent redirects, unknown slugs returning 404, and sitemap entries matching canonical URLs. Test one actual tool operation after every change to processors or dependencies.

## Rollback and outage response

1. In the [Netlify project](https://app.netlify.com/projects/codeconvenet/), identify the current commit and the last successful deploy that was tested.
2. In Deploys, use **Lock to stop auto publishing** while investigating so another push does not replace the chosen version.
3. Open the previous successful production deploy and select **Publish Deploy**. This republishes the stored deploy without rebuilding it. Do not roll back to a release with a known exploitable security defect.
4. Verify HTTPS, the homepage, a representative tool, and the live SEO check. If no stored deploy is usable, check out a known good commit in a separate checkout, run the verified build, and publish through the normal Git integration.
5. Revert or repair the bad commit through review. Unlock auto publishing after the correction is ready, and verify the next published commit. Record the trigger, impact, timeline, and follow-up regression test.

This is a recovery procedure, not evidence of a completed production rollback drill. The site has no server-side user documents to restore. Input held only in an open browser tab is not backed up; downloads are the user's copy.

For TLS or domain failures, compare the registrar's authoritative DNS records with Netlify's Domain management instructions, check certificate status and expiry, and allow old record TTLs to expire. Test both the primary domain and `www`. Do not delete DNS records unrelated to this website (for example MX and verification TXT records).

## Dependency and build security

- `package-lock.json` and `npm ci` make dependency selection repeatable. Direct parser/minifier dependencies are exact versions and are loaded by the relevant tools, not executed as user-provided code.
- `npm run security:check` fails on high/critical advisories in production or build dependencies. It leaves moderate findings visible. An unavailable advisory service fails the release gate; retry after confirming the registry is reachable rather than skipping the gate.
- GitHub Actions checks advisories weekly, and Dependabot proposes monthly npm and GitHub Actions updates. Review security updates promptly; do not wait for a monthly batch when an applicable advisory is urgent.
- Workflow actions are pinned to verified commit SHAs. Workflow token permissions are read-only and checkout does not persist credentials. CI does not need a Netlify token because deployment uses the existing Git integration.
- Review new dependencies for purpose, publisher/repository identity, browser bundle cost, install scripts, and advisories. Re-run the verified build and affected browser flows after changes.

### Reviewed advisory range discrepancy (2026-10-26)

After updating Next.js to 16.4.3 and compatible transitive dependencies, `npm audit --omit=dev` reported no vulnerabilities. Full `npm audit` still reported three moderate entries through Tailwind 3 and `postcss-nested` to `postcss-selector-parser` 6.1.5. The npm advisory range was `<7.1.6`, while the [maintainer's advisory](https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf) explicitly lists **6.1.5** and **7.1.6** as patched and states that ordinary build-time use on trusted sources is not affected. This parser is used by the site's build tooling, not a request endpoint accepting visitors' CSS.

The lockfile contains the patched 6.1.5 release. No blanket audit suppression or forced Tailwind 4 migration was added. Recheck this discrepancy on dependency updates; this dated observation is not a guarantee that future audit findings are harmless.

Rechecked on 2026-10-28: both `npm audit --omit=dev --json` and `npm audit --json` reported **0 vulnerabilities**, including moderate findings. The range discrepancy above is retained as historical review context, not a current unresolved advisory.

## Account controls requiring verification

These settings are outside the repository and were not established by the code changes:

| Control | Verification needed |
| --- | --- |
| GitHub protected `main` and required human review | Require the `quality` job, review who can bypass rules, and confirm Actions is enabled. |
| Hosting, GitHub, registrar ownership and recovery | Confirm the intended owner, a second recovery contact, MFA, stored recovery codes, and least-privilege collaborator access. |
| Spending and usage notifications | In Netlify's account billing/usage settings, choose limits and notification recipients appropriate to the plan; confirm an alert reaches the operator. No monetary cap is configured in this repo. |
| Availability and certificate monitoring | Configure an external HTTPS check for the homepage and a representative tool, including certificate expiry. Confirm failure notifications reach a person. No continuous uptime monitor is deployed by this repo. |
| Deploy failure notifications | Confirm the destination in Netlify and the GitHub Actions notification settings. |
| Log retention and analytics | Confirm provider retention and authorized access. Do not log tool input. Analytics requires visitor opt-in and should not be used as a substitute for availability monitoring. Review GA Enhanced Measurement search, form, and browser-history events separately: the repository sanitizes its manual page views, but cannot confirm remote automatic-event settings. |
| Incident ownership and disclosure | Assign a reachable operator and a private vulnerability-reporting route. Verify the process before publishing a contact or response-time promise. |

If a production-access laptop or token is lost, revoke the affected GitHub/Netlify/registrar sessions and tokens from a trusted device, review recent deploys and DNS/account changes, rotate any exposed secret, and record what was checked. Do not paste credentials into issue reports or chat. Keep recovery access independent of the lost device.

## References

- [Netlify deploys, rollbacks, and locks](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/)
- [Netlify external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [Google Analytics enhanced measurement settings](https://support.google.com/analytics/answer/9216061)
