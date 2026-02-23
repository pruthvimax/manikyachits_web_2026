document.addEventListener("DOMContentLoaded", function () {

  // ================= FAQ TOGGLE (your original code) =================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-icon");

    if (!question) return;

    question.addEventListener("click", function () {
      // Close all other FAQ items
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove("active");
          const otherIcon = other.querySelector(".faq-icon");
          if (otherIcon) {
            otherIcon.textContent = "+";
          }
        }
      });

      // Toggle current FAQ
      item.classList.toggle("active");

      // Update + / − icon
      if (icon) {
        if (item.classList.contains("active")) {
          icon.textContent = "−";
        } else {
          icon.textContent = "+";
        }
      }
    });
  });

  // ================= HAMBURGER MENU & DROPDOWNS (corrected) =================
  const hamburger = document.getElementById('hamburger');
  const menu = document.querySelector('.menu');
  const navItems = document.querySelectorAll('.nav-item');
  const allLinks = document.querySelectorAll('.menu a');
  const BREAKPOINT = 992; // must match your CSS media query

  // Toggle mobile menu
  if (hamburger && menu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = hamburger.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isActive);
    });
  }

  // Mobile dropdown toggles (only when screen width ≤ BREAKPOINT)
  navItems.forEach(item => {
    const link = item.querySelector('a');
    const dropdown = item.querySelector('.dropdown');

    if (link && dropdown) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= BREAKPOINT) {
          e.preventDefault();          // don't navigate
          e.stopPropagation();

          // Close other open dropdowns
          navItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
            }
          });

          // Toggle current dropdown
          item.classList.toggle('active');
        }
      });
    }
  });

  // Close menu when a link is clicked (except dropdown toggles)
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= BREAKPOINT) {
        // If the clicked link does NOT have a dropdown sibling, close the menu
        if (!link.nextElementSibling || !link.nextElementSibling.classList.contains('dropdown')) {
          menu.classList.remove('active');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // Close menu when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= BREAKPOINT && menu && menu.classList.contains('active')) {
      if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navItems.forEach(item => item.classList.remove('active'));
      }
    }
  });

  // Reset menu when window resizes above breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > BREAKPOINT) {
      if (menu) menu.classList.remove('active');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
      navItems.forEach(item => item.classList.remove('active'));
    }
  });

});