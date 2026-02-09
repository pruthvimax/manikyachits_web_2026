// Feedback Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample feedback data
    const sampleFeedback = [
        {
            id: 1,
            name: "Ravikumar Hegde",
            initials: "RH",
            email: "rhegde@example.com",
            rating: 5,
            category: "service",
            categoryName: "Customer Service",
            message: "Excellent service! The team was very helpful in explaining the chit fund process. The mobile app is user-friendly and makes tracking payments very convenient.",
            date: "2024-02-10",
            helpful: 24
        },
        {
            id: 2,
            name: "Bhavani Prasad",
            initials: "BP",
            email: "bprasad@example.com",
            rating: 4,
            category: "app",
            categoryName: "Mobile App Experience",
            message: "The app works well overall, but could use some improvements in notification settings. I sometimes miss auction alerts.",
            date: "2024-02-08",
            helpful: 18
        },
        {
            id: 3,
            name: "Manjula Shetty",
            initials: "MS",
            email: "mshetty@example.com",
            rating: 5,
            category: "chit",
            categoryName: "Chit Plan Experience",
            message: "I've been with Manikya Chits for 2 years now. Transparent auctions, timely payments, and excellent customer support. Highly recommended!",
            date: "2024-02-05",
            helpful: 32
        },
        {
            id: 4,
            name: "Suresh Kumar",
            initials: "SK",
            email: "skumar@example.com",
            rating: 5,
            category: "payment",
            categoryName: "Payment Process",
            message: "Multiple payment options including UPI makes it very convenient. The digital receipts are automatically saved in the app. Very efficient!",
            date: "2024-02-03",
            helpful: 15
        },
        {
            id: 5,
            name: "Anitha Reddy",
            initials: "AR",
            email: "areddy@example.com",
            rating: 4,
            category: "general",
            categoryName: "General Feedback",
            message: "Good experience overall. Would appreciate more educational content about chit funds for new subscribers.",
            date: "2024-02-01",
            helpful: 12
        }
    ];
    
    let feedbackData = JSON.parse(localStorage.getItem('manikyaFeedback')) || sampleFeedback;
    
    // Rating Stars functionality
    const ratingStars = document.querySelectorAll('#ratingStars i');
    const ratingInput = document.getElementById('rating');
    
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            // Update star display
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.className = 'fas fa-star active';
                } else {
                    s.className = 'far fa-star';
                }
            });
            
            // Clear error
            document.getElementById('ratingError').textContent = '';
        });
    });
    
    // Display feedback function
    function displayFeedback(filter = 'all') {
        const feedbackList = document.getElementById('feedbackList');
        const noFeedbackMsg = document.getElementById('noFeedbackMessage');
        
        let filteredFeedback = [...feedbackData];
        
        // Apply filters
        if (filter === '5') {
            filteredFeedback = feedbackData.filter(fb => fb.rating === 5);
        } else if (filter === '4') {
            filteredFeedback = feedbackData.filter(fb => fb.rating >= 4);
        } else if (filter === 'recent') {
            filteredFeedback = [...feedbackData].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (filter === 'popular') {
            filteredFeedback = [...feedbackData].sort((a, b) => b.helpful - a.helpful);
        }
        
        if (filteredFeedback.length === 0) {
            feedbackList.innerHTML = '';
            noFeedbackMsg.style.display = 'block';
            return;
        }
        
        noFeedbackMsg.style.display = 'none';
        feedbackList.innerHTML = '';
        
        filteredFeedback.forEach(fb => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            
            // Generate star rating HTML
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= fb.rating) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }
            
            // Format date
            const date = new Date(fb.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <div class="feedback-user">
                        <div class="user-avatar">${fb.initials}</div>
                        <div class="user-info">
                            <h4>${fb.name}</h4>
                            <p>${formattedDate}</p>
                        </div>
                    </div>
                    <div class="feedback-rating">${starsHtml}</div>
                </div>
                <div class="feedback-content">${fb.message}</div>
                <div class="feedback-category">
                    <i class="fas fa-tag"></i> ${fb.categoryName}
                </div>
            `;
            
            feedbackList.appendChild(feedbackItem);
        });
    }
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Apply filter
            displayFeedback(btn.getAttribute('data-filter'));
        });
    });
    
    // Form submission
    document.getElementById('feedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        let isValid = true;
        const submitBtn = document.getElementById('submitBtn');
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const category = document.getElementById('category').value;
        const rating = parseInt(document.getElementById('rating').value);
        const message = document.getElementById('message').value.trim();
        
        // Validation
        if (!name || name.length < 2) {
            document.getElementById('nameError').textContent = 'Please enter a valid name (minimum 2 characters)';
            isValid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        if (!category) {
            document.getElementById('categoryError').textContent = 'Please select a category';
            isValid = false;
        }
        
        if (!rating || rating < 1 || rating > 5) {
            document.getElementById('ratingError').textContent = 'Please select a rating';
            isValid = false;
        }
        
        if (!message || message.length < 10) {
            document.getElementById('messageError').textContent = 'Please enter your feedback (minimum 10 characters)';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Simulate API call delay
        setTimeout(() => {
            // Create new feedback object
            const newFeedback = {
                id: feedbackData.length + 1,
                name: name,
                initials: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                email: email,
                rating: rating,
                category: category,
                categoryName: document.getElementById('category').options[document.getElementById('category').selectedIndex].text,
                message: message,
                date: new Date().toISOString().split('T')[0],
                helpful: 0
            };
            
            // Add to feedback data
            feedbackData.unshift(newFeedback);
            
            // Save to localStorage
            localStorage.setItem('manikyaFeedback', JSON.stringify(feedbackData));
            
            // Show success message
            document.getElementById('feedbackForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            
            // Reset form
            document.getElementById('feedbackForm').reset();
            ratingStars.forEach(star => star.className = 'far fa-star');
            ratingInput.value = '0';
            
            // Enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
            
            // Refresh feedback list
            displayFeedback();
            
        }, 1500);
    });
    
    // Send another message button
    document.getElementById('sendAnother').addEventListener('click', function() {
        document.getElementById('feedbackForm').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    });
    
    // Initialize page
    displayFeedback();
});