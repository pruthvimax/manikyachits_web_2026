document.addEventListener("DOMContentLoaded", () => {

  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".plan-card");
  const viewAllBtn = document.getElementById("viewAllBtn");

  if (!filters.length || !cards.length) return;

  /* ================= FILTER FUNCTION ================= */
  function applyFilter(type) {
    cards.forEach(card => {
      const term = card.dataset.term;

      if (type === "all") {
        card.classList.remove("hide");
      } 
      else if (term === type) {
        card.classList.remove("hide");
      } 
      else {
        card.classList.add("hide");
      }
    });
  }

  /* ================= FILTER BUTTONS ================= */
  filters.forEach(btn => {
    btn.addEventListener("click", () => {

      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.dataset.filter;
      applyFilter(type);
    });
  });

  /* ================= VIEW ALL ================= */
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", e => {
      e.preventDefault();

      // Show all chit plans
      applyFilter("all");

      // Activate "All" filter
      filters.forEach(b => b.classList.remove("active"));
      const allBtn = document.querySelector('.filter[data-filter="all"]');
      if (allBtn) allBtn.classList.add("active");

      // 🔴 HIDE VIEW ALL BUTTON AFTER CLICK
      viewAllBtn.style.display = "none";

      // Optional smooth scroll
      document
        .querySelector(".chit-plans-section")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  }

});

/* ================= MODAL (GLOBAL FIX) ================= */
window.openModal = function () {
  const modal = document.getElementById("assistModal");

  if (!modal) {
    console.error("assistModal NOT found in DOM");
    return;
  }

  modal.classList.add("active");
  console.log("Modal opened");
};

window.closeModal = function () {
  const modal = document.getElementById("assistModal");
  if (!modal) return;

  modal.classList.remove("active");
  console.log("Modal closed");
};

/* Close when clicking background */
document.addEventListener("click", function (e) {
  const modal = document.getElementById("assistModal");
  if (e.target === modal) {
    window.closeModal();
  }
});

/* ================= MODAL VALIDATION ================= */

window.validateModal = function () {
  const mobile = document.getElementById("mobile");
  const name = document.getElementById("name");
  const email = document.getElementById("email");

  let valid = true;

  [mobile, name, email].forEach(input => {
    const error = input.nextElementSibling;

    if (!input.value.trim()) {
      input.classList.add("error-input");
      error.style.display = "block";
      valid = false;
    } else {
      input.classList.remove("error-input");
      error.style.display = "none";
    }
  });

  if (valid) {
    closeModal(); // success case
  }
};

/* Remove error while typing */
document.addEventListener("input", function (e) {
  if (e.target.closest(".assist-form input")) {
    e.target.classList.remove("error-input");
    e.target.nextElementSibling.style.display = "none";
  }
});

/* ================= MODAL VALIDATION (PHONE + EMAIL) ================= */

window.validateModal = function () {
  const mobile = document.getElementById("mobile");
  const name = document.getElementById("name");
  const email = document.getElementById("email");

  let valid = true;

  // Mobile number: exactly 10 digits
  const mobileRegex = /^[6-9]\d{9}$/;

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ===== MOBILE =====
  if (!mobile.value.trim()) {
    showError(mobile, "Mobile number is required");
    valid = false;
  } else if (!mobileRegex.test(mobile.value.trim())) {
    showError(mobile, "Enter valid 10 digit mobile number");
    valid = false;
  } else {
    hideError(mobile);
  }

  // ===== NAME =====
  if (!name.value.trim()) {
    showError(name, "Name is required");
    valid = false;
  } else {
    hideError(name);
  }

  // ===== EMAIL =====
  if (!email.value.trim()) {
    showError(email, "Email is required");
    valid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    showError(email, "Enter valid email address");
    valid = false;
  } else {
    hideError(email);
  }

  // SUCCESS
  if (valid) {
    closeModal();
    alert("Details submitted successfully!");
  }
};

// ===== Helper Functions =====
function showError(input, message) {
  input.classList.add("error-input");
  input.nextElementSibling.innerText = message;
  input.nextElementSibling.style.display = "block";
}

function hideError(input) {
  input.classList.remove("error-input");
  input.nextElementSibling.style.display = "none";
}

/* Remove error while typing */
document.addEventListener("input", function (e) {
  if (e.target.closest(".assist-form input")) {
    hideError(e.target);
  }
});
