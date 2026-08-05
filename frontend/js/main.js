/* ==================================================
   VentureIQ — main.js
   Handles all landing page interactions:
   - navbar scroll shadow
   - mobile menu open/close
   - smooth scroll for in-page links
   - scroll-reveal animation for sections
   - dynamic footer year
   - animated score ring / metric bars on the preview card
================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -------------------- Navbar scroll shadow -------------------- */
  // Adds a subtle shadow to the navbar once the page has been scrolled,
  // so it feels "lifted" above the content instead of flat.
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 8) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);

  /* -------------------- Mobile menu toggle -------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close the mobile menu automatically when a link inside it is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -------------------- Smooth scroll for in-page anchors -------------------- */
  // Only intercepts links that point to an on-page section (start with "#").
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return; // ignore bare "#" links

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* -------------------- Scroll-reveal animation -------------------- */
  // Any element with [data-reveal] fades/slides in once it enters the viewport.
  const revealItems = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // animate once only
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });

  /* -------------------- Animate the sample score ring + metric bars -------------------- */
  // The preview card uses sample/mock data only (per project spec).
  // We animate it in once it scrolls into view, so it feels alive rather than static.
  const previewCard = document.querySelector('.preview__card');

  if (previewCard) {
    const scoreObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // Animate the circular score ring from empty to its target value.
        const ringFill = previewCard.querySelector('.score-ring__fill');
        const circumference = 2 * Math.PI * 60; // r = 60, matches the SVG circle
        const targetScore = 82; // sample viability score out of 100

        ringFill.style.strokeDasharray = circumference;
        ringFill.style.strokeDashoffset = circumference; // start empty

        // Trigger the transition on the next frame so the browser registers
        // the starting state before animating to the target.
        requestAnimationFrame(function () {
          const offset = circumference - (targetScore / 100) * circumference;
          ringFill.style.strokeDashoffset = offset;
        });

        // Metric bars: animate width from 0 to their sample target value.
        previewCard.querySelectorAll('.metric__bar span').forEach(function (bar) {
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(function () {
            bar.style.transition = 'width 1s ease';
            bar.style.width = targetWidth;
          });
        });

        scoreObserver.unobserve(previewCard); // animate once only
      });
    }, { threshold: 0.3 });

    scoreObserver.observe(previewCard);
  }

  /* -------------------- Footer year -------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
