document.addEventListener("DOMContentLoaded", function () {

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

});