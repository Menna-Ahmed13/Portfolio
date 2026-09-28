// Footer year
document.getElementById('year').textContent = new Date().getFullYear();


// ===============================
// Mobile nav toggle
// ===============================
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


// ===============================
// Active nav link on scroll
// ===============================
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


// ===============================
// Typing effect in hero
// ===============================
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


// ===============================
// Works carousel
// ===============================
const carousel = document.getElementById('worksCarousel');
const prevBtn = document.getElementById('worksPrev');
const nextBtn = document.getElementById('worksNext');
const dotsWrap = document.getElementById('worksDots');
const cards = carousel.querySelectorAll('.work-card');

cards.forEach((_, index) => {
  const dot = document.createElement('span');

  if (index === 0) {
    dot.classList.add('active');
  }

  dotsWrap.appendChild(dot);
});

const dots = dotsWrap.querySelectorAll('span');

function updateDots() {
  const scrollLeft = carousel.scrollLeft;
  const cardWidth = cards[0].offsetWidth + 24;

  const index = Math.round(scrollLeft / cardWidth);

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

carousel.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateDots);
});

function scrollByCard(direction) {
  const cardWidth = cards[0].offsetWidth + 24;

  carousel.scrollBy({
    left: direction * cardWidth,
    behavior: 'smooth'
  });
}

prevBtn.addEventListener('click', () => {
  scrollByCard(-1);
});

nextBtn.addEventListener('click', () => {
  scrollByCard(1);
});


// ===============================
// Services accordion
// ===============================
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


// ===============================
// Contact Form
// ===============================

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


  // -------------------------------
  // Validation
  // -------------------------------

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


  // -------------------------------
  // Honeypot spam protection
  // -------------------------------

  if (honey) {

    contactForm.reset();

    setStatus(
      'Thank you! Your message has been sent.',
      'ok'
    );

    return;
  }


  // -------------------------------
  // Loading state
  // -------------------------------

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


    // Try to read FormSubmit response
    const result = await response.json().catch(() => null);


    // -------------------------------
    // Success
    // -------------------------------

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


// ===============================
// Scroll reveal animations
// ===============================
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


// ===============================
// Animated stat counters
// ===============================
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


// ===============================
// Back to top
// ===============================
const toTop = document.getElementById('toTop');

toTop.addEventListener('click', () => {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

});