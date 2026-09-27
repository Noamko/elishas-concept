// ---------- שיעורי הקורס ----------
// כשהווידאו מוכן: הדביקו בכל שיעור קישור הטמעה (embed) של Vimeo או YouTube
// בשדה videoUrl, למשל: 'https://player.vimeo.com/video/123456789'
// או: 'https://www.youtube.com/embed/XXXXXXXX'
// שיעור בלי videoUrl יציג מסך "זמין לרוכשי הקורס".
const LESSONS = [
  { title: 'מבוא: מהו אלישע׳ס קונספט', videoUrl: '' },
  { title: 'עקרונות היסוד של השיטה', videoUrl: '' },
  { title: 'אבחון והערכה — חלק א׳', videoUrl: '' },
  { title: 'אבחון והערכה — חלק ב׳', videoUrl: '' },
  { title: 'טכניקות טיפול בסיסיות', videoUrl: '' },
  { title: 'טכניקות טיפול מתקדמות', videoUrl: '' },
  { title: 'עמוד השדרה והאגן', videoUrl: '' },
  { title: 'הגפה העליונה והתחתונה', videoUrl: '' },
  { title: 'בניית תוכנית טיפול', videoUrl: '' },
  { title: 'מקרים קליניים וסיכום', videoUrl: '' },
]

const listEl = document.getElementById('lesson-list')
const frameEl = document.getElementById('player-frame')
const nowTitleEl = document.getElementById('now-title')
const nowNumEl = document.getElementById('now-num')

let activeIndex = 0

function renderList() {
  listEl.innerHTML = ''
  LESSONS.forEach((lesson, i) => {
    const li = document.createElement('li')
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'lesson-item' + (i === activeIndex ? ' active' : '')
    btn.setAttribute('aria-current', i === activeIndex ? 'true' : 'false')
    btn.innerHTML = `
      <span class="lesson-num">${i + 1}</span>
      <span class="lesson-title">${lesson.title}</span>
      <span class="lesson-dur">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
        </svg>
        וידאו
      </span>`
    btn.addEventListener('click', () => selectLesson(i))
    li.appendChild(btn)
    listEl.appendChild(li)
  })
}

function renderPlayer() {
  const lesson = LESSONS[activeIndex]
  nowTitleEl.textContent = lesson.title
  nowNumEl.textContent = `שיעור ${activeIndex + 1} מתוך ${LESSONS.length}`

  if (lesson.videoUrl) {
    frameEl.innerHTML = `<iframe src="${lesson.videoUrl}" title="${lesson.title}"
      allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
  } else {
    frameEl.innerHTML = `
      <div class="player-placeholder">
        <span class="lock-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
          </svg>
        </span>
        <strong>השיעור המלא זמין לרוכשי הקורס</strong>
        <span>לאחר הרכישה תקבלו גישה מיידית לכל 10 השיעורים</span>
      </div>`
  }
}

function selectLesson(i) {
  activeIndex = i
  renderList()
  renderPlayer()
}

if (listEl && frameEl) {
  renderList()
  renderPlayer()
}
