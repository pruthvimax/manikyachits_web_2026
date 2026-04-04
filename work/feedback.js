document.addEventListener('DOMContentLoaded', function () {

const API_BASE_URL = "https://manikyachitsweb2026-production.up.railway.app/api/forms";

const form = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const noFeedbackMsg = document.getElementById('noFeedbackMessage');
const submitBtn = document.getElementById('submitBtn');

const ratingStars = document.querySelectorAll('#ratingStars i');
const ratingInput = document.getElementById('rating');

let currentRating = 0;


// ⭐ STAR RATING
ratingStars.forEach(star => {
    star.addEventListener('click', () => {

        const rating = parseInt(star.getAttribute('data-rating'));
        currentRating = rating;
        ratingInput.value = rating;

        ratingStars.forEach((s, index) => {
            if (index < rating) {
                s.className = 'fas fa-star active';
            } else {
                s.className = 'far fa-star';
            }
        });

        document.getElementById('ratingError').textContent = '';
    });
});


// ================= LOAD FEEDBACK =================

async function loadFeedback(filter = "all") {

    try {

        let url = API_URL;

        if (filter === "5") url += "?rating=5";
        if (filter === "4") url += "?rating=4";
        if (filter === "popular") url += "?sort=popular";

        const response = await fetch(url);
        const result = await response.json();

        const feedbacks = result.data || [];

        if (feedbacks.length === 0) {
            feedbackList.innerHTML = "";
            noFeedbackMsg.style.display = "block";
            return;
        }

        noFeedbackMsg.style.display = "none";
        feedbackList.innerHTML = "";

        feedbacks.forEach(fb => {

            let stars = "";

            for (let i = 1; i <= 5; i++) {
                stars += i <= fb.rating
                    ? '<i class="fas fa-star"></i>'
                    : '<i class="far fa-star"></i>';
            }

            const date = new Date(fb.createdAt).toLocaleDateString();

            const item = document.createElement("div");
            item.className = "feedback-item";

            item.innerHTML = `
                <div class="feedback-header">
                    <div class="feedback-user">
                        <div class="user-avatar">${fb.name.charAt(0)}</div>
                        <div class="user-info">
                            <h4>${fb.name}</h4>
                            <p>${fb.email}</p>
                        </div>
                    </div>

                    <div class="feedback-rating">
                        ${stars}
                    </div>
                </div>

                <div class="feedback-content">
                    ${fb.message}
                </div>

                <div class="feedback-footer">
                    <span class="feedback-category">${fb.category}</span>
                    <span class="feedback-date">${date}</span>

                    <button class="helpful-btn" data-id="${fb._id}">
                        👍 Helpful (${fb.helpfulCount || 0})
                    </button>
                </div>
            `;

            feedbackList.appendChild(item);
        });


        // Helpful button
        document.querySelectorAll(".helpful-btn").forEach(btn => {

            btn.addEventListener("click", async function () {

                const id = this.getAttribute("data-id");

                await fetch(`${API_URL}/${id}/helpful`, {
                    method: "PATCH"
                });

                loadFeedback();
            });

        });

    } catch (err) {
        console.error("Load feedback error:", err);
    }

}


// ================= FORM SUBMIT =================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    document.querySelectorAll(".error-message").forEach(e => e.textContent = "");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const category = document.getElementById("category").value;
    const rating = currentRating;
    const message = document.getElementById("message").value.trim();

    let valid = true;

    if (!name) {
        document.getElementById("nameError").textContent = "Name required";
        valid = false;
    }

    if (!email) {
        document.getElementById("emailError").textContent = "Email required";
        valid = false;
    }

    if (!category) {
        document.getElementById("categoryError").textContent = "Select category";
        valid = false;
    }

    if (rating === 0) {
        document.getElementById("ratingError").textContent = "Select rating";
        valid = false;
    }

    if (!message) {
        document.getElementById("messageError").textContent = "Enter message";
        valid = false;
    }

    if (!valid) return;


    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                category,
                rating,
                message
            })

        });

        const data = await response.json();

        if (!data.success) {
            alert("Error submitting feedback");
            return;
        }

        alert("✅ Feedback submitted successfully!");

        form.reset();
        ratingStars.forEach(s => s.className = "far fa-star");
        currentRating = 0;

        loadFeedback();

    } catch (error) {

        console.error("Submit error:", error);
        alert("Server error");

    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = "Submit Feedback";

});


// ================= FILTER BUTTONS =================

document.querySelectorAll(".filter-btn").forEach(btn => {

    btn.addEventListener("click", function () {

        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));

        this.classList.add("active");

        loadFeedback(this.getAttribute("data-filter"));

    });

});


// INITIAL LOAD
loadFeedback();

});