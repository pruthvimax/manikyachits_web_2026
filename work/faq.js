document.addEventListener("DOMContentLoaded", () => {

  const faqItems = document.querySelectorAll(".faq-item");
  const searchInput = document.getElementById("faqSearch");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const icon = item.querySelector(".icon");

    question.addEventListener("click", () => {
      faqItems.forEach(i => {
        if (i !== item) {
          i.classList.remove("active");
          const otherIcon = i.querySelector(".icon");
          if (otherIcon) otherIcon.textContent = "+";
        }
      });

      item.classList.toggle("active");
      if (icon) {
        icon.textContent = item.classList.contains("active") ? "−" : "+";
      }
    });
  });

  /* SEARCH */
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const value = searchInput.value.toLowerCase();
      faqItems.forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(value)
          ? "block"
          : "none";
      });
    });
  }

});
