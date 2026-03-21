document.addEventListener("DOMContentLoaded", function () {

  // Set current year in footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ================= FAQ TOGGLE =================
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
    const link = item.querySelector('a:first-child');
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
        }
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    
    if (window.innerWidth <= BREAKPOINT && menuToggle && menuToggle.checked) {
      if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
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

  // ================= TERMS AND PRIVACY POPUP =================
  const overlay = document.getElementById("popupOverlay");
  const title = document.getElementById("popupTitle");
  const content = document.getElementById("popupContent");
  const closeBtn = document.getElementById("closePopup");
  const openTerms = document.getElementById("openTerms");
  const openPrivacy = document.getElementById("openPrivacy");

  if (openTerms) {
    openTerms.addEventListener("click", function (e) {
      e.preventDefault();
      if (title) title.innerText = "Terms & Conditions";
      if (content) {
        content.innerHTML = `
          <h4>1. Introduction</h4>
          <p>Welcome to Manikya Chits Private Limited. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <h4>2. Chit Fund Services</h4>
          <p>Manikya Chits provides chit fund services regulated under the Chit Funds Act, 1982. All chit groups are registered and comply with legal requirements.</p>
          
          <h4>3. Membership Eligibility</h4>
          <p>To become a member, you must be between 21 and 55 years of age, provide valid identification and address proof, and agree to the terms of the chit agreement.</p>
          
          <h4>4. Payment Obligations</h4>
          <p>Members are required to pay their monthly installments on time. Late payments may result in penalties as per the chit agreement.</p>
          
          <h4>5. Auction Process</h4>
          <p>Auctions are conducted monthly. Members may participate in person, online, or via proxy bidding. Winners receive prize money after deduction of commission and bid discount.</p>
          
          <h4>6. Termination and Withdrawal</h4>
          <p>Membership termination is subject to the terms of the chit agreement. Penalties may apply for early withdrawal or discontinuation.</p>
          
          <h4>7. Privacy Policy</h4>
          <p>Your personal information is protected and used only for service delivery. We do not share your data with third parties without consent.</p>
          
          <h4>8. Liability</h4>
          <p>Manikya Chits is not liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
          
          <hr>
          <p><strong>For any questions regarding these terms, please contact us at manikyachitsprivatelimited@gmail.com</strong></p>
        `;
      }
      if (overlay) overlay.style.display = "flex";
    });
  }

  if (openPrivacy) {
    openPrivacy.addEventListener("click", function (e) {
      e.preventDefault();
      if (title) title.innerText = "Privacy Policy";
      if (content) {
        content.innerHTML = `
          <h4>Information We Collect</h4>
          <p>We collect personal information including name, contact details, address, government IDs, and financial information necessary for chit fund services.</p>
          
          <h4>How We Use Your Information</h4>
          <p>Your information is used to process chit applications, manage accounts, conduct auctions, disburse prize money, and communicate important updates.</p>
          
          <h4>Data Protection</h4>
          <p>We implement security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          
          <h4>Data Sharing</h4>
          <p>We do not sell or rent your personal information. Data may be shared with regulatory authorities as required by law.</p>
          
          <h4>Your Rights</h4>
          <p>You have the right to access, correct, or request deletion of your personal information. Contact us for any privacy-related concerns.</p>
          
          <h4>Updates to Privacy Policy</h4>
          <p>This privacy policy may be updated periodically. Please review it regularly for any changes.</p>
          
          <hr>
          <p><strong>Contact us at manikyachitsprivatelimited@gmail.com for privacy-related inquiries.</strong></p>
        `;
      }
      if (overlay) overlay.style.display = "flex";
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (overlay) overlay.style.display = "none";
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.style.display = "none";
      }
    });
  }
});