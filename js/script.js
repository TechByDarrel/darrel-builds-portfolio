const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionIds = ['home-section', 'about', 'projects', 'skills', 'certifications', 'contact'];
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollBehavior = () => prefersReducedMotion.matches ? 'auto' : 'smooth';
const mobileMenuBreakpoint = 992;
const waNumber = '2349017049686';
const supportsIntersectionObserver = 'IntersectionObserver' in window;
const scrollProgress = document.createElement('div');

scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.prepend(scrollProgress);

const setMenuOpen = (isOpen) => {
  navLinks?.classList.toggle('open', isOpen);
  navToggle?.setAttribute('aria-expanded', String(isOpen));
  navToggle?.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
};

const updateScrollState = () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
  document.querySelector('.back-to-top')?.classList.toggle('visible', window.scrollY > 600);

  if (!supportsIntersectionObserver) {
    const activeSection = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.28);
    const currentLink = activeSection && document.querySelector(`.nav-links a[href="#${activeSection.id}"]`);
    if (currentLink) {
      navAnchors.forEach((link) => link.classList.remove('active'));
      currentLink.classList.add('active');
    }
  }

  if (!prefersReducedMotion.matches) {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  }
};

let scrollFrame = 0;
const requestScrollUpdate = () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    updateScrollState();
  });
};

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
updateScrollState();

navToggle?.addEventListener('click', () => {
  setMenuOpen(!navLinks?.classList.contains('open'));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
    setMenuOpen(false);
    navToggle?.focus();
  }
});

document.addEventListener('click', (event) => {
  if (navLinks?.classList.contains('open') && !header?.contains(event.target)) {
    setMenuOpen(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > mobileMenuBreakpoint) setMenuOpen(false);
});

navAnchors.forEach((link) => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      navAnchors.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    }
    if (window.innerWidth <= mobileMenuBreakpoint) setMenuOpen(false);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId !== '#') {
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      }
    }
  });
});

const backToTop = document.querySelector('.back-to-top');
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
});

if (supportsIntersectionObserver) {
  document.querySelectorAll('.project-image:not(.project-image--app) img').forEach((image) => {
    const width = Number(image.getAttribute('width'));
    const height = Number(image.getAttribute('height'));
    if (width > 0 && height > 0) {
      image.parentElement.style.aspectRatio = `${width} / ${height + 32}`;
    }
  });

  document.querySelectorAll('[data-stagger]').forEach((container) => {
    [...container.children].forEach((child, index) => {
      child.style.setProperty('--i', `${index * 90}ms`);
    });
  });

  const navLinkFor = (sectionId) => document.querySelector(`.nav-links a[href="#${sectionId}"]`);
  const scrollSpyObserver = new IntersectionObserver(() => {
    const bandTop = window.innerHeight * 0.18;
    const bandBottom = window.innerHeight * 0.38;
    const visibleSections = sections.map((section) => {
      const rect = section.getBoundingClientRect();
      const overlap = Math.max(0, Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop));
      return { section, overlap };
    }).filter(({ overlap }) => overlap > 0);
    if (!visibleSections.length) return;

    visibleSections.sort((first, second) => second.overlap - first.overlap);
    const currentLink = navLinkFor(visibleSections[0].section.id);
    if (currentLink) {
      navAnchors.forEach((link) => link.classList.remove('active'));
      currentLink.classList.add('active');
    }
  }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.15, 0.35, 0.6] });

  sections.forEach((section) => scrollSpyObserver.observe(section));

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const projectType = document.getElementById('projectType').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !projectType || !message) {
    alert('Please fill in all fields before sending your message.');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const whatsappMessage = [
    'Hello Darrel,',
    '',
    `My Name: ${name}`,
    `Email: ${email}`,
    `Project Type: ${projectType}`,
    `Message: ${message}`,
    '',
    "I'm interested in working with you."
  ].join('\n');

  const encodedMessage = encodeURIComponent(whatsappMessage);
  window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
});
