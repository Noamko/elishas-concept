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

## Course videos

The lessons are listed in [src/course.js](src/course.js), in course order. Each lesson's `video`
field holds a link to its video; a lesson without one shows as "בקרוב" (coming soon).
A lesson's title also appears in the home page's course list (`index.html`), and the number of
lessons in the texts of every page — update those too when lessons are added or renamed.

### Bunny Stream (where the course videos live)

1. Upload the lesson to the Bunny Stream library and wait until it finishes encoding.
2. Copy its **Direct Play** link (`https://player.mediadelivery.net/play/…`) into the lesson's
   `video` field.

Bunny's player is themed with [bunny/player-head.html](bunny/player-head.html), pasted into the
library's Player → Custom HTML head.

### Other links the site can play

The site picks the player from the link, so a lesson can also use:

- a [Mux](https://mux.com) link (`https://player.mux.com/…`, the iframe `src` from Mux's embed
  code). It plays in the site's own player (Media Chrome controls, styled in `src/style.css` under
  "נגן הקורס"), which caps quality at 1080p, remembers where each viewer stopped, and shows
  timeline previews. Mux's free plan holds up to 10 videos — one fewer than the course's 11 lessons.
- any direct `https://…mp4` link, which plays in the browser's built-in player.

## Local development

```bash
npm run dev            # dev server with instant reload while editing
npm run preview:pages  # build + serve exactly as GitHub Pages will, then open
                       # http://localhost:4173/elishas-concept/
```

`preview:pages` also prints a **Network** address (e.g. `http://10.0.0.x:4173/elishas-concept/`)
that works from a phone on the same Wi-Fi — handy for testing on a real iPhone.
It serves a fixed build, so re-run it after making changes.
