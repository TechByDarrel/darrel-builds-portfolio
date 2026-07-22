const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navAnchors.forEach((link) => {
  link.addEventListener('click', () => {
    navAnchors.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');

    if (window.innerWidth <= 768) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId !== '#') {
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

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

const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 600);
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const contactForm = document.getElementById('contactForm');
const waNumber = '2348060802595';

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
