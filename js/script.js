document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = sections[0].id;

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.id;
    }
  });

  navItems.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${current}`
    );
  });
});

const roles = [
  'Data Scientist',
  'AI / ML Engineer',
  'Power BI Developer'
];

const typedEl = document.getElementById('typed');

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const currentRole = roles[roleIndex];

  if (!deleting) {
    charIndex++;

    typedEl.textContent = currentRole.slice(0, charIndex);

    if (charIndex === currentRole.length) {
      deleting = true;

      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;

    typedEl.textContent = currentRole.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 40 : 90);
}

typeLoop();

const carousel = document.getElementById('worksCarousel');
const prevBtn = document.getElementById('worksPrev');
const nextBtn = document.getElementById('worksNext');
const dotsWrap = document.getElementById('worksDots');
const cards = carousel.querySelectorAll('.work-card');

let dots = [];

function getStep() {
  const gap = parseFloat(getComputedStyle(carousel).columnGap) || 24;
  return cards[0].offsetWidth + gap;
}

function visibleCount() {
  return Math.max(1, Math.round(carousel.clientWidth / getStep()));
}

function updateDots() {
  const index = Math.min(
    dots.length - 1,
    Math.round(carousel.scrollLeft / getStep())
  );

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function buildDots() {
  dotsWrap.innerHTML = '';

  const pages = Math.max(1, cards.length - visibleCount() + 1);

  for (let i = 0; i < pages; i++) {
    dotsWrap.appendChild(document.createElement('span'));
  }

  dots = Array.from(dotsWrap.querySelectorAll('span'));
  updateDots();
}

buildDots();

window.addEventListener('resize', buildDots);

carousel.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateDots);
});

function scrollByCard(direction) {
  carousel.scrollBy({
    left: direction * getStep(),
    behavior: 'smooth'
  });
}

prevBtn.addEventListener('click', () => {
  scrollByCard(-1);
});

nextBtn.addEventListener('click', () => {
  scrollByCard(1);
});

document.querySelectorAll('.acc-item').forEach(item => {

  const head = item.querySelector('.acc-head');

  head.addEventListener('click', () => {

    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.acc-item').forEach(i => {
      i.classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
    }
  });

});

const CONTACT_EMAIL = 'mennakherashi@gmail.com';

const contactForm = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const sendLabel = document.getElementById('sendLabel');
const formStatus = document.getElementById('formStatus');

function setStatus(message, type = '') {
  formStatus.textContent = message;

  formStatus.className = 'form-status';

  if (type) {
    formStatus.classList.add(type);
  }
}

contactForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const formData = new FormData(contactForm);

  const name = (formData.get('name') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const message = (formData.get('message') || '').toString().trim();
  const honey = (formData.get('_honey') || '').toString().trim();

  if (!name || !email || !message) {

    setStatus(
      'Please fill in your name, email and message.',
      'err'
    );

    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {

    setStatus(
      'Please enter a valid email address.',
      'err'
    );

    return;
  }

  if (honey) {

    contactForm.reset();

    setStatus(
      'Thank you! Your message has been sent.',
      'ok'
    );

    return;
  }

  sendBtn.disabled = true;
  sendLabel.textContent = 'Sending...';

  setStatus('', '');

  try {

    const response = await fetch(
      `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },

        body: JSON.stringify({

          name: name,

          email: email,

          message: message,

          _subject: `New portfolio message from ${name}`,

          _template: 'table',

          _captcha: 'false'

        })
      }
    );

    const result = await response.json().catch(() => null);

    if (
      response.ok &&
      result &&
      result.success !== false
    ) {

      contactForm.reset();

      setStatus(
        'Thank you! Your message has been sent successfully. I will get back to you soon.',
        'ok'
      );

    } else {

      throw new Error(
        result?.message || 'Unable to send the message.'
      );

    }

  } catch (error) {

    console.error('Contact form error:', error);

    setStatus(
      'Sorry, your message could not be sent. Please try again or email me directly.',
      'err'
    );

  } finally {

    sendBtn.disabled = false;

    sendLabel.textContent = 'Send Message';

  }

});

const revealEls = document.querySelectorAll(
  '.reveal, .reveal-stagger'
);

const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add('in-view');

        revealObserver.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealEls.forEach(el => {
  revealObserver.observe(el);
});

const statNums = document.querySelectorAll('.stat-num');

const statObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) {
        return;
      }

      const el = entry.target;

      const target = parseInt(
        el.dataset.count,
        10
      );

      const suffix = el.dataset.suffix || '';

      const duration = 1400;

      const start = performance.now();

      function tick(now) {

        const progress = Math.min(
          (now - start) / duration,
          1
        );

        const eased =
          1 - Math.pow(1 - progress, 3);

        el.textContent =
          Math.round(eased * target) + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }

      }

      requestAnimationFrame(tick);

      statObserver.unobserve(el);

    });

  },
  {
    threshold: 0.4
  }
);

statNums.forEach(el => {
  statObserver.observe(el);
});

const toTop = document.getElementById('toTop');

toTop.addEventListener('click', () => {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

});
