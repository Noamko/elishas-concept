import { videoSource } from './video.js'
import { mountMuxPlayer } from './player.js'

// ---------- שיעורי הקורס ----------
// להוספת סרטון: הדביקו בשדה video את קישור ה-Direct Play שלו מ-Bunny Stream
// (player.mediadelivery.net/play/...). עובדים גם קישור מ-Mux (player.mux.com/...) או קישור ישיר לקובץ MP4.
// ההוראות המלאות ב-DEPLOY.md.
// שיעור בלי קישור מוצג כ"בקרוב".
// שמות השיעורים מופיעים גם ברשימה בדף הבית (index.html), ומספר השיעורים מופיע בטקסטים של כל הדפים — עדכנו גם שם.
const LESSONS = [
  { title: 'הקדמה', video: 'https://player.mediadelivery.net/play/770214/5b5bcad8-3926-4664-9853-6f6cc910069c' },
  { title: 'צוואר', video: 'https://player.mediadelivery.net/play/770214/c31d3af8-c0e9-400d-b62f-82dc5557c21a' },
  { title: 'גב — חלק א׳', video: 'https://player.mediadelivery.net/play/770214/4e6f00b6-d424-41d7-9c3a-eb1d1a282788' },
  { title: 'גב — חלק ב׳', video: 'https://player.mediadelivery.net/play/770214/66a0bbe1-c1db-481c-a590-71676125951b' },
  { title: 'ירך', video: 'https://player.mediadelivery.net/play/770214/760b5085-da8d-472a-825a-899f58d291ec' },
  { title: 'ברך', video: 'https://player.mediadelivery.net/play/770214/351d7eb2-cc7e-457d-8b57-c02064dd34d1' },
  { title: 'קרסול וכף רגל', video: 'https://player.mediadelivery.net/play/770214/f0a21864-fe1f-4fae-a82d-b383e55be968' },
  { title: 'כתף — חלק א׳', video: 'https://player.mediadelivery.net/play/770214/6edf5aa1-d621-4371-91e7-7e2892aa27bb' },
  { title: 'כתף — חלק ב׳', video: 'https://player.mediadelivery.net/play/770214/fc070c4f-588d-45c8-99b2-dc3b4211253f' },
  { title: 'כתף — חלק ג׳', video: 'https://player.mediadelivery.net/play/770214/6f7885d3-6cdc-4121-9708-0b53eddb9801' },
  { title: 'מפרק שורש כף היד', video: 'https://player.mediadelivery.net/play/770214/6ec35f6e-ff22-4ccc-9f49-f46d1fc7447e' },
]

const CLOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`
const ALERT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5v.01"/></svg>`

const listEl = document.getElementById('lesson-list')
const playerEl = document.querySelector('.player-card')
const frameEl = document.getElementById('player-frame')
const nowTitleEl = document.getElementById('now-title')
const nowNumEl = document.getElementById('now-num')
const nextEl = document.getElementById('next-lesson')

// השיעור הפעיל נקבע לפי הכתובת (course.html#lesson-3), כך שאפשר לשתף קישור לשיעור מסוים
function lessonFromHash() {
  const n = Number(location.hash.match(/^#lesson-(\d+)$/)?.[1])
  return n >= 1 && n <= LESSONS.length ? n - 1 : 0
}

function renderList(active) {
  listEl.replaceChildren(
    ...LESSONS.map((lesson, i) => {
      const link = document.createElement('a')
      link.className = 'lesson-item' + (i === active ? ' active' : '')
      link.href = `#lesson-${i + 1}`
      if (i === active) link.setAttribute('aria-current', 'true')

      const num = document.createElement('span')
      num.className = 'lesson-num'
      num.textContent = i + 1

      const title = document.createElement('span')
      title.className = 'lesson-title'
      title.textContent = lesson.title

      link.append(num, title)

      if (!videoSource(lesson.video)) {
        const status = document.createElement('span')
        status.className = 'lesson-status'
        status.innerHTML = `${CLOCK_ICON} בקרוב`
        link.append(status)
      }

      const li = document.createElement('li')
      li.append(link)
      return li
    })
  )
}

function showPlaceholder(icon, heading, text) {
  frameEl.innerHTML = `
    <div class="player-placeholder">
      <span class="player-badge">${icon}</span>
      <strong>${heading}</strong>
      <span>${text}</span>
    </div>`
}

function renderPlayer(active, autoplay) {
  const lesson = LESSONS[active]
  const media = videoSource(lesson.video)

  nowTitleEl.textContent = lesson.title
  nowNumEl.textContent = `שיעור ${active + 1} מתוך ${LESSONS.length}`

  if (lesson.video && !media) {
    console.warn(`שיעור ${active + 1}: הקישור לא נתמך (צריך קישור מ-Mux, קישור Direct Play מ-Bunny או קישור ישיר לקובץ MP4) —`, lesson.video)
  }

  if (!media) {
    showPlaceholder(CLOCK_ICON, 'השיעור יעלה בקרוב', 'אנחנו מעלים את שיעורי הקורס — השיעור יופיע כאן ממש בקרוב')
  } else if (media.mux) {
    mountMuxPlayer(frameEl, { playbackId: media.mux, title: lesson.title, autoplay })
  } else if (media.embed) {
    // ברירת המחדל של Bunny היא ניגון אוטומטי — מפעילים אותו רק כשהצופה בחר שיעור.
    // rememberPosition: הצופה ממשיך מהמקום שבו עצר בביקור הקודם (הטעינה מראש מציגה שם את התמונה)
    const params = new URLSearchParams({ autoplay, rememberPosition: true })
    const iframe = document.createElement('iframe')
    iframe.src = `${media.embed}?${params}`
    iframe.title = lesson.title
    iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture'
    iframe.allowFullscreen = true
    iframe.referrerPolicy = 'strict-origin-when-cross-origin'
    frameEl.replaceChildren(iframe)
  } else {
    const video = document.createElement('video')
    video.controls = true
    video.playsInline = true
    video.preload = 'metadata'
    video.setAttribute('controlslist', 'nodownload')
    video.setAttribute('aria-label', lesson.title)
    if (media.poster) video.poster = media.poster

    for (const { src, type } of media.sources) {
      const source = document.createElement('source')
      source.src = src
      source.type = type
      video.append(source)
    }

    // הדפדפן מנסה את הקבצים לפי הסדר; שגיאה בקובץ האחרון פירושה שאף אחד לא נטען
    video.lastElementChild.addEventListener('error', () => {
      console.warn(`שיעור ${active + 1}: קובץ הווידאו לא נטען —`, media.sources.map((s) => s.src))
      showPlaceholder(ALERT_ICON, 'לא הצלחנו לטעון את השיעור', 'נסו לרענן את הדף בעוד רגע')
    })

    frameEl.replaceChildren(video)
    if (autoplay) video.play().catch(() => {})
  }

  const isLast = active === LESSONS.length - 1
  const label = isLast ? 'להעמקה: הספרים' : 'לשיעור הבא'
  nextEl.href = isLast ? './#books' : `#lesson-${active + 2}`
  nextEl.setAttribute('aria-label', label)
  nextEl.querySelector('.label-full').textContent = label
  // תווית קצרה לטלפונים, כדי שהכפתור והכותרת ייכנסו בשורה אחת
  nextEl.querySelector('.label-short').textContent = isLast ? 'לספרים' : 'הבא'
}

// בנייד הנגן נמצא מעל רשימת השיעורים — אחרי בחירת שיעור גוללים אליו
function revealPlayer() {
  const headerHeight = document.querySelector('.site-header')?.offsetHeight ?? 0
  const top = playerEl.getBoundingClientRect().top
  if (top < headerHeight || top > window.innerHeight) {
    playerEl.scrollIntoView({ block: 'start' })
  }
}

function show({ autoplay }) {
  const active = lessonFromHash()
  renderList(active)
  renderPlayer(active, autoplay)
}

if (listEl && frameEl) {
  show({ autoplay: false })
  if (location.hash) revealPlayer()

  window.addEventListener('hashchange', () => {
    show({ autoplay: true })
    revealPlayer()
  })
}
