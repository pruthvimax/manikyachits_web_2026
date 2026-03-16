document.addEventListener("DOMContentLoaded", () => {
    console.log("Manikya Chits Website Loaded");

    // ================= HAMBURGER MENU =================
    const hamburger = document.getElementById('hamburger');
    const menu = document.querySelector('.menu');
    const navItems = document.querySelectorAll('.nav-item');
    const allLinks = document.querySelectorAll('.menu a');
    const BREAKPOINT = 992; // must match CSS media query

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
  // Mobile dropdown toggles (only when screen width ≤ BREAKPOINT)
navItems.forEach(item => {
    const link = item.querySelector('a');
    const dropdown = item.querySelector('.dropdown');

    if (link && dropdown) {
        link.addEventListener('click', (e) => {
            // Only prevent default on mobile
            if (window.innerWidth <= BREAKPOINT) {
                e.preventDefault();          // don't navigate on mobile
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
            // On desktop, let the normal navigation happen
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

    // ================= STICKY NAVBAR =================
    const header = document.querySelector(".site-header");
    const navbar = document.querySelector(".navbar");

    if (header && navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 30) {
                header.classList.add("scrolled");
                navbar.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
            } else {
                header.classList.remove("scrolled");
                navbar.style.boxShadow = "";
            }
        });
    }

    // ================= SMOOTH SCROLL =================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href === "#" || href.startsWith("http") || href.startsWith("javascript")) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Close mobile menu if open
                if (window.innerWidth <= BREAKPOINT && menu && menu.classList.contains("active")) {
                    menu.classList.remove("active");
                    hamburger.classList.remove("active");
                    document.body.style.overflow = "";
                }

                // Smooth scroll to target
                const headerHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: "smooth" });
            }
        });
    });

    // ================= SCROLL ANIMATIONS =================
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".plan-card, .stat, .feature-card, .why-item").forEach(el => {
        observer.observe(el);
    });

    // ================= ACTIVE NAV LINK =================
    function setActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll(".menu a");

        navLinks.forEach(link => {
            const linkPath = link.getAttribute("href");
            if (linkPath === currentPath ||
                (currentPath.includes(linkPath) && linkPath !== "index.html")) {
                link.classList.add("active");
                const parentItem = link.closest(".nav-item");
                if (parentItem) {
                    parentItem.querySelector("> a").classList.add("active");
                }
            } else {
                link.classList.remove("active");
            }
        });
    }
    setActiveNav();

    // ================= STATS COUNTER ANIMATION =================
    function animateStats() {
        const stats = document.querySelectorAll(".stat h3");
        stats.forEach(stat => {
            const targetValue = parseInt(stat.textContent);
            let currentValue = 0;
            const increment = targetValue / 50;
            const stepTime = 2000 / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentValue) + "+";
            }, stepTime);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector(".stats-bar");
    if (statsSection) statsObserver.observe(statsSection);

    // ================= IMAGE LAZY LOADING =================
    if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                    img.classList.add("loaded");
                    observer.unobserve(img);
                }
            });
        });
        document.querySelectorAll("img[data-src]").forEach(img => imageObserver.observe(img));
    }

    // ================= BACK TO TOP BUTTON =================
    const backToTop = document.createElement("button");
    backToTop.innerHTML = "↑";
    backToTop.className = "back-to-top";
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #0b5c3b;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        align-items: center;
        justify-content: center;
    `;

    backToTop.addEventListener("mouseenter", () => {
        backToTop.style.transform = "translateY(-5px)";
        backToTop.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
    });

    backToTop.addEventListener("mouseleave", () => {
        backToTop.style.transform = "translateY(0)";
        backToTop.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTop.style.display = "flex";
        } else {
            backToTop.style.display = "none";
        }
    });

    // ================= TOUCH SWIPE SUPPORT =================
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; });
    document.addEventListener("touchend", e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) {
            if (menu && menu.classList.contains("active") && window.innerWidth <= BREAKPOINT) {
                menu.classList.remove("active");
                hamburger?.classList.remove("active");
                document.body.style.overflow = "";
            }
        }
    });

    // ================= COPYRIGHT YEAR =================
    const copyrightElement = document.querySelector(".footer-bottom");
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace("2025", currentYear);
    }
});

// ================= GLOBAL MODAL FUNCTIONS (unchanged) =================
window.openModal = function(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const modal = document.getElementById("assistModal");
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    const firstInput = modal.querySelector("input");
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
};

window.closeModal = function() {
    const modal = document.getElementById("assistModal");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
    const form = modal.querySelector(".assist-form");
    if (form) form.reset();
    modal.querySelectorAll(".error-input").forEach(el => el.classList.remove("error-input"));
    modal.querySelectorAll(".error").forEach(el => el.style.display = "none");
};

// Close modal when clicking background
document.addEventListener("click", function(e) {
    const modal = document.getElementById("assistModal");
    if (e.target === modal) window.closeModal();
});

// Close modal with Escape key
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        const modal = document.getElementById("assistModal");
        if (modal && modal.classList.contains("active")) window.closeModal();
    }
});

// Form validation (unchanged)
window.validateModal = async function() {
    const mobile = document.getElementById("mobile");
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    let valid = true;

    const showError = (input, msg) => {
        input.classList.add("error-input");
        const err = input.nextElementSibling;
        if (err && err.classList.contains("error")) {
            err.textContent = msg;
            err.style.display = "block";
        }
    };
    const hideError = (input) => {
        input.classList.remove("error-input");
        const err = input.nextElementSibling;
        if (err && err.classList.contains("error")) err.style.display = "none";
    };

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile.value.trim()) {
        showError(mobile, "Mobile number is required");
        valid = false;
    } else if (!mobileRegex.test(mobile.value.trim())) {
        showError(mobile, "Please enter a valid 10-digit Indian mobile number");
        valid = false;
    } else {
        hideError(mobile);
    }

    // Name validation
    if (!name.value.trim()) {
        showError(name, "Name is required");
        valid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, "Name must be at least 2 characters");
        valid = false;
    } else {
        hideError(name);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, "Email is required");
        valid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError(email, "Please enter a valid email address");
        valid = false;
    } else {
        hideError(email);
    }

    if (valid) {
        const submitBtn = document.querySelector(".assist-btn");
        const originalText = submitBtn.textContent;
        try {
            submitBtn.textContent = "Submitting...";
            submitBtn.disabled = true;

            const formData = {
                mobile: mobile.value.trim(),
                name: name.value.trim(),
                email: email.value.trim()
            };

            const response = await fetch('http://localhost:5000/api/forms/chit-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('Thank you! Our advisor will contact you shortly.');
                window.closeModal();
                mobile.value = ''; name.value = ''; email.value = '';
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.log('Note: Your data may still be saved.');
            
            window.closeModal();
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
};

// Remove error while typing
document.addEventListener("input", function(e) {
    if (e.target.closest(".assist-form input")) {
        const err = e.target.nextElementSibling;
        if (err && err.classList.contains("error")) err.style.display = "none";
        e.target.classList.remove("error-input");
    }
});

// Form submit handler
const assistForm = document.querySelector(".assist-form");
if (assistForm) {
    assistForm.addEventListener("submit", function(e) {
        e.preventDefault();
        window.validateModal();
    });
}

// Force fix for navigation links
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Allow normal navigation if not on mobile or if it's not a dropdown toggle
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript')) {
            // Let the browser navigate normally
            return true;
        }
    });
});