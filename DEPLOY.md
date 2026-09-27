# Deploying

The site deploys to **GitHub Pages** automatically: every push to `main` runs
[.github/workflows/deploy.yml](.github/workflows/deploy.yml), which builds the site
(`npm run build`) and publishes `dist/` to Pages. No server to maintain, free hosting,
HTTPS included.

## One-time setup

In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

That's the only switch. After the next push, the site is live at:

    https://noamko.github.io/elishas-concept/

(The site uses relative URLs throughout, so it works both under that sub-path and
on a custom domain at the root.)

## Custom domain (when the domain is ready)

1. In **Settings → Pages → Custom domain**, enter the domain (e.g. `elishasconcept.co.il`)
   and save. Keep **Enforce HTTPS** checked once it becomes available.
2. At the DNS provider:
   - apex domain (`elishasconcept.co.il`): **A records** to GitHub Pages IPs
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www`: a **CNAME record** to `noamko.github.io`

GitHub issues and renews the certificate automatically.

## Local development

```bash
npm run dev      # dev server
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```
