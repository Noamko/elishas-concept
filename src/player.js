// נגן הקורס: פקדים של Media Chrome מעל רכיב הווידאו של Mux (איכות שמותאמת למהירות החיבור).
// הספריות נטענות רק כשמוצג שיעור עם סרטון; האלמנטים מתעוררים לבד כשהטעינה מסתיימת.
let libraries
function loadLibraries() {
  libraries ??= Promise.all([import('media-chrome'), import('media-chrome/menu'), import('@mux/mux-video')])
  return libraries
}

// max-resolution: דקות הצפייה החינמיות של Mux מכסות עד 1080p
const CONTROLS = `
  <mux-video slot="media" stream-type="on-demand" max-resolution="1080p" preload="metadata" crossorigin playsinline disable-cookies></mux-video>
  <media-poster-image slot="poster"></media-poster-image>
  <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>
  <media-play-button class="large-play" notooltip></media-play-button>
  <media-settings-menu hidden anchor="auto">
    <media-settings-menu-item>מהירות
      <media-playback-rate-menu slot="submenu" hidden rates="0.75 1 1.25 1.5 1.75 2"><div slot="title">מהירות</div></media-playback-rate-menu>
    </media-settings-menu-item>
    <media-settings-menu-item>איכות
      <media-rendition-menu slot="submenu" hidden><div slot="title">איכות</div></media-rendition-menu>
    </media-settings-menu-item>
  </media-settings-menu>
  <media-control-bar class="progress-row">
    <media-time-range></media-time-range>
  </media-control-bar>
  <media-control-bar class="buttons-row">
    <media-play-button notooltip></media-play-button>
    <media-seek-backward-button seekoffset="10" notooltip></media-seek-backward-button>
    <media-seek-forward-button seekoffset="10" notooltip></media-seek-forward-button>
    <span class="spacer"></span>
    <media-time-display showduration></media-time-display>
    <media-mute-button notooltip></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-settings-menu-button notooltip></media-settings-menu-button>
    <media-pip-button notooltip></media-pip-button>
    <media-fullscreen-button notooltip></media-fullscreen-button>
  </media-control-bar>`

// ---------- המשך צפייה מהמקום שבו הצופה עצר ----------
const positionKey = (playbackId) => `lesson-position:${playbackId}`

function savedPosition(playbackId) {
  try {
    const seconds = Number(localStorage.getItem(positionKey(playbackId)))
    return seconds > 5 ? seconds : 0
  } catch {
    return 0
  }
}

function rememberPosition(video, playbackId) {
  const key = positionKey(playbackId)
  let lastSaved = 0
  const save = () => {
    try {
      const nearEnd = video.duration - video.currentTime < 10
      if (nearEnd) localStorage.removeItem(key)
      else localStorage.setItem(key, String(Math.floor(video.currentTime)))
    } catch {}
  }
  video.addEventListener('timeupdate', () => {
    if (Math.abs(video.currentTime - lastSaved) >= 5) {
      lastSaved = video.currentTime
      save()
    }
  })
  video.addEventListener('pause', save)
}

export function mountMuxPlayer(container, { playbackId, title, autoplay }) {
  const player = document.createElement('media-controller')
  player.className = 'course-player'
  // ציר הזמן והפקדים נשארים משמאל לימין גם בדף בעברית
  player.dir = 'ltr'
  player.innerHTML = CONTROLS

  const video = player.querySelector('mux-video')
  video.setAttribute('playback-id', playbackId)
  video.setAttribute('metadata-video-title', title)
  const resumeAt = savedPosition(playbackId)
  if (resumeAt) video.setAttribute('start-time', resumeAt)

  // תמונות התצוגה המקדימה שמופיעות כשמרחפים מעל ציר הזמן
  const thumbnails = document.createElement('track')
  thumbnails.kind = 'metadata'
  thumbnails.label = 'thumbnails'
  thumbnails.default = true
  thumbnails.src = `https://image.mux.com/${playbackId}/storyboard.vtt`
  video.append(thumbnails)

  player.querySelector('media-poster-image').setAttribute('src', `https://image.mux.com/${playbackId}/thumbnail.webp?width=1280`)

  rememberPosition(video, playbackId)
  container.replaceChildren(player)

  loadLibraries().then(() => {
    if (autoplay && player.isConnected) video.play().catch(() => {})
  })
}
