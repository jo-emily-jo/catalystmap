# Deployment runbook

## Vercel project setup

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the GitHub repo `github.com/jo-emily-jo/catalystmap`.
3. Framework preset: Next.js (auto-detected).
4. Root directory: `.` (default).
5. Build command: `next build` (default).
6. Output directory: `.next` (default).
7. Click Deploy.

## Environment variables (Vercel dashboard → Settings → Environment Variables)

Add these for the **Production** environment:

| Variable                        | Value                                      | Notes       |
| ------------------------------- | ------------------------------------------ | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://idozzwzlfawghtwcresu.supabase.co` | Public      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from Supabase dashboard)                  | Public      |
| `SUPABASE_SERVICE_ROLE_KEY`     | (from Supabase dashboard)                  | Server-only |
| `ADMIN_PASSWORD`                | (generate a strong password)               | Server-only |
| `ANTHROPIC_API_KEY`             | (from Anthropic console)                   | Server-only |

After adding, trigger a redeploy: Deployments → latest → Redeploy.

## Custom domain: getcatalystmap.com

### Vercel side

1. Go to Settings → Domains.
2. Add `getcatalystmap.com`.
3. Vercel will show the required DNS records.

### Cloudflare side

1. Go to the Cloudflare dashboard for `getcatalystmap.com`.
2. DNS → Add record:
   - Type: `CNAME`
   - Name: `@`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **DNS only** (gray cloud — not proxied). Vercel manages its own SSL.
3. If Cloudflare requires an A record instead of CNAME at root:
   - Type: `A`
   - Name: `@`
   - Target: `76.76.21.21` (Vercel's IP)
4. For `www` redirect (optional):
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Add `www.getcatalystmap.com` in Vercel Domains as well.

### SSL verification

1. Back in Vercel → Domains, wait for the SSL certificate to provision (usually < 5 minutes).
2. Status should show a green checkmark.
3. Visit `https://getcatalystmap.com` — should load the home page.

## Smoke test checklist

After deployment, verify:

- [ ] `https://getcatalystmap.com` loads with 8 theme cards
- [ ] `/catalyst/anthropic` loads with relationship table + score popovers
- [ ] `/themes/ai` shows Anthropic as a catalyst card
- [ ] `/themes/semiconductors` shows the intentional empty state
- [ ] `/about` loads with methodology + scoring overview
- [ ] `/admin/login` renders the login form
- [ ] Admin login works with the production password
- [ ] `/admin` dashboard shows correct counts
- [ ] `/admin/research` makes a real Claude API call (use one of the 5/hour rate limit)
- [ ] Score popover opens on click and dismisses on Escape / click-outside
- [ ] Mobile (375px): relationship table shows card layout
- [ ] `https://getcatalystmap.com/sitemap.xml` returns valid XML
- [ ] `https://getcatalystmap.com/robots.txt` returns expected rules
- [ ] No console errors in browser dev tools
- [ ] Page title shows "CatalystMap" (no "get" prefix)
