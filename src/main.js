// ---------- פרטי יצירת קשר ----------
// TODO: החליפו במספר ובכתובת האמיתיים לפני העלאת האתר לאוויר
export const CONTACT = {
  whatsapp: '972500000000',
  email: 'info@example.com',
}

// ---------- תפריט נייד ----------
const navToggle = document.querySelector('.nav-toggle')
const nav = document.querySelector('.site-nav')

navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open')
  navToggle.setAttribute('aria-expanded', String(open))
})

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open')
    navToggle?.setAttribute('aria-expanded', 'false')
  })
})

// ---------- דיאלוג רכישה ----------
// הסליקה עדיין לא מחוברת — הדיאלוג מפנה לוואטסאפ/אימייל.
// כשיהיה ספק סליקה (Grow / משולם / Stripe וכו'), החליפו את הלוגיקה כאן בקישור תשלום.
const PRODUCTS = {
  'book-concept': 'הספר ״אלישע׳ס קונספט״',
  'book-tmj': 'הספר על הטיפול הפיזיותרפי ב־TMD',
  course: 'הקורס הדיגיטלי — אלישע׳ס קונספט',
}

const dialog = document.getElementById('buy-dialog')

if (dialog) {
  const productEl = dialog.querySelector('.buy-product')
  const waLink = dialog.querySelector('[data-buy-whatsapp]')
  const mailLink = dialog.querySelector('[data-buy-email]')

  document.querySelectorAll('[data-buy]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const name = PRODUCTS[btn.dataset.buy] ?? 'מוצר'
      productEl.textContent = name

      const msg = encodeURIComponent(`שלום, אשמח לרכוש את ${name}`)
      waLink.href = `https://wa.me/${CONTACT.whatsapp}?text=${msg}`
      mailLink.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('רכישה: ' + name)}`

      dialog.showModal()
    })
  })

  dialog.querySelector('.buy-close')?.addEventListener('click', () => dialog.close())

  // סגירה בלחיצה על הרקע
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close()
  })
}

// ---------- הופעה בגלילה ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const revealEls = document.querySelectorAll('.reveal')

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'))
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  revealEls.forEach((el) => io.observe(el))
}

// ---------- שנה נוכחית בפוטר ----------
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear()
})
