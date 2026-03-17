document.addEventListener("DOMContentLoaded", function () {

  // ================= FAQ TOGGLE ONLY =================
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

  // ================= MOBILE DROPDOWN TOGGLE =================
  const navItems = document.querySelectorAll('.nav-item');
  const menuToggle = document.getElementById('menu-toggle');
  const BREAKPOINT = 992;
  
  // Mobile dropdown toggles
  navItems.forEach(item => {
    const link = item.querySelector('a');
    const dropdown = item.querySelector('.dropdown');

    if (link && dropdown) {
      link.addEventListener('click', (e) => {
        // Only handle on mobile and only for dropdown toggle
        if (window.innerWidth <= BREAKPOINT) {
          // Check if this is the main parent link (has dropdown)
          if (link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown')) {
            e.preventDefault(); // Stop navigation ONLY for parent dropdown links
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
          // For regular dropdown items (like "About Us" inside dropdown), let navigation happen
        }
      });
    }
  });

  // Close menu when clicking a link (for non-dropdown items)
  const menuLinks = document.querySelectorAll('.menu a');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= BREAKPOINT && menuToggle) {
        // Check if this is NOT a dropdown parent
        if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('dropdown')) {
          // Close the menu
          menuToggle.checked = false;
          
          // Also close any open dropdowns
          navItems.forEach(item => {
            item.classList.remove('active');
          });
          
          // Let the browser navigate normally
          return true;
        }
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    
    if (window.innerWidth <= BREAKPOINT && menuToggle && menuToggle.checked) {
      if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menuToggle.checked = false;
        navItems.forEach(item => {
          item.classList.remove('active');
        });
      }
    }
  });

  // Reset on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > BREAKPOINT && menuToggle) {
      menuToggle.checked = false;
      navItems.forEach(item => {
        item.classList.remove('active');
      });
    }
  });

});