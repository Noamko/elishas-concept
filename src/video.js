// Mux: https://player.mux.com/<playback-id> (מקוד ההטמעה) או https://stream.mux.com/<playback-id>.m3u8
const MUX = /^https:\/\/(?:player|stream)\.mux\.com\/([A-Za-z0-9]+)(?:\.m3u8)?\/?$/
// Bunny Stream (Direct Play / Embed): https://player.mediadelivery.net/play/<ספרייה>/<מזהה-סרטון>
const BUNNY_PLAYER = /^https:\/\/(?:player|iframe)\.mediadelivery\.net\/(?:play|embed)\/(\d+)\/([\w-]+)$/
const BUNNY_EMBED = 'https://player.mediadelivery.net/embed'
const TYPES = { mp4: 'video/mp4', webm: 'video/webm' }

// מקבל קישור לסרטון ומחזיר אחד מאלה, או null אם הקישור לא נתמך:
//   { mux }              — סרטון ב-Mux: מוצג בנגן של האתר (src/player.js)
//   { embed }            — סרטון ב-Bunny Stream: מוצג בנגן של Bunny (העיצוב שלו ב-bunny/player-head.html)
//   { sources, poster }  — קובץ וידאו ישיר: מוצג בנגן המובנה של הדפדפן
export function videoSource(input) {
  let url
  try {
    url = new URL((input ?? '').trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  const address = url.origin + url.pathname

  const mux = address.match(MUX)
  if (mux) return { mux: mux[1] }

  const bunny = address.match(BUNNY_PLAYER)
  if (bunny) return { embed: `${BUNNY_EMBED}/${bunny[1]}/${bunny[2]}` }

  const ext = url.pathname.match(/\.(mp4|webm)$/i)?.[1].toLowerCase()
  return ext ? { sources: [{ src: url.href, type: TYPES[ext] }], poster: null } : null
}
