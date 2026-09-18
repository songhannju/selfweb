const navLinks = document.querySelectorAll('.nav-link');
const revealItems = document.querySelectorAll('.reveal');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const progressBar = document.querySelector('.page-progress');

const updateProgressBar = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};

const setActiveLink = () => {
  const sections = [...document.querySelectorAll('main section[id]')];
  const offset = 120;

  for (const section of sections) {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (window.scrollY + offset >= top && window.scrollY + offset < top + height) {
      navLinks.forEach((link) => {
        const linkTarget = link.getAttribute('href');
        if (linkTarget === `#${section.id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener('scroll', () => {
  updateProgressBar();
  setActiveLink();
});

window.addEventListener('load', () => {
  updateProgressBar();
  setActiveLink();
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.4 }
);

timelineItems.forEach((item) => timelineObserver.observe(item));

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Message Sent';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      contactForm.reset();
    }, 1800);
  });
}
