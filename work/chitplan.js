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

      // Optional smooth scroll
      document
        .querySelector(".chit-plans-section")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  }

});

/* ================= MODAL FUNCTIONS ================= */

// Helper Functions
function showError(input, message) {
  input.classList.add("error-input");
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error")) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function hideError(input) {
  input.classList.remove("error-input");
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error")) {
    errorElement.style.display = "none";
  }
}

// Open modal
window.openModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById("assistModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    const firstInput = modal.querySelector("input");
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }
};

// Close modal
window.closeModal = function() {
  const modal = document.getElementById("assistModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    const inputs = modal.querySelectorAll("input");
    inputs.forEach(input => {
      input.value = "";
      input.classList.remove("error-input");
    });
    modal.querySelectorAll(".error").forEach(el => el.style.display = "none");
  }
};

// Close when clicking background
document.addEventListener("click", function(e) {
  const modal = document.getElementById("assistModal");
  if (e.target === modal) {
    window.closeModal();
  }
});

// Close with Escape key
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    const modal = document.getElementById("assistModal");
    if (modal && modal.classList.contains("active")) {
      window.closeModal();
    }
  }
});

// Validate modal form
window.validateModal = function() {
  const mobile = document.getElementById("mobile");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  let valid = true;

  // Mobile number regex: exactly 10 digits starting with 6-9
  const mobileRegex = /^[6-9]\d{9}$/;
  // Email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ===== MOBILE VALIDATION =====
  if (!mobile.value.trim()) {
    showError(mobile, "Mobile number is required");
    valid = false;
  } else if (!mobileRegex.test(mobile.value.trim())) {
    showError(mobile, "Enter valid 10 digit mobile number");
    valid = false;
  } else {
    hideError(mobile);
  }

  // ===== NAME VALIDATION =====
  if (!name.value.trim()) {
    showError(name, "Name is required");
    valid = false;
  } else {
    hideError(name);
  }

  // ===== EMAIL VALIDATION =====
  if (!email.value.trim()) {
    showError(email, "Email is required");
    valid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    showError(email, "Enter valid email address");
    valid = false;
  } else {
    hideError(email);
  }

  if (valid) {

  const data = {
    mobile: mobile.value.trim(),
    name: name.value.trim(),
    email: email.value.trim()
  };

// ✅ ADD THIS LINE (new Render URL):
fetch("https://manikyachits-backend.onrender.com/api/forms/chit-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {

    if (result.success) {
      alert(result.message || "Thank you! Our advisor will contact you shortly.");
      window.closeModal();
    } else {
      alert("Submission failed. Please try again.");
    }

  })
  .catch(err => {
    console.error("Chit plan error:", err);
    alert("Server error. Please try again later.");
  });

}
};

// Remove error while typing
document.addEventListener("input", function(e) {
  if (e.target.closest(".assist-form input")) {
    hideError(e.target);
  }
});