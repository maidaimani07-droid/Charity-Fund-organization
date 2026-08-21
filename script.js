// ============================================
// CHARITY-FUND MALAWI - MAIN JAVASCRIPT
// ============================================

(function() {
    'use strict';

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    let darkMode = false;

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            darkMode = !darkMode;
            this.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // ===== MOBILE HAMBURGER =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.counter');

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    }

    // ===== INTERSECTION OBSERVER FOR COUNTERS =====
    const heroSection = document.querySelector('.hero, .page-header');
    let countersAnimated = false;

    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated && counters.length > 0) {
                    animateCounters();
                    countersAnimated = true;
                }
            });
        }, { threshold: 0.3 });

        observer.observe(heroSection);
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[placeholder="Your Name"]').value;
            const email = this.querySelector('input[placeholder="Your Email"]').value;
            const message = this.querySelector('textarea').value;

            if (!name || !email || !message) {
                alert('⚠️ Please fill in all required fields.');
                return;
            }

            if (!isValidEmail(email)) {
                alert('⚠️ Please enter a valid email address.');
                return;
            }

            alert('✅ Thank you for reaching out! We\'ll get back to you within 24 hours.');
            this.reset();
        });
    }

    // ===== NEWSLETTER SUBSCRIPTION =====
    const newsletterForms = document.querySelectorAll('.footer-newsletter form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            if (input && input.value) {
                alert('✅ Thank you for subscribing to our newsletter!');
                input.value = '';
            }
        });
    });

    // ===== VALIDATION HELPER =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });

    // ===== DONATION FUNCTIONALITY =====
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customInput = document.getElementById('customAmount');
    const donateBtn = document.getElementById('donateNowBtn');
    const donateMessage = document.getElementById('donateMessage');
    const donationDisplay = document.getElementById('donationDisplay');
    const totalDisplay = document.getElementById('totalDisplay');
    const frequencySelect = document.getElementById('donationFrequency');

    if (amountBtns.length > 0) {
        let selectedAmount = 2500;
        let donationFrequency = 'one-time';

        function formatMWK(amount) {
            return 'MWK ' + Number(amount).toLocaleString();
        }

        amountBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const amount = parseInt(this.getAttribute('data-amount'));
                if (!isNaN(amount) && amount > 0) {
                    selectedAmount = amount;
                    amountBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    if (customInput) customInput.value = '';
                    updateTotal();
                    if (donateMessage) donateMessage.classList.remove('show');
                }
            });
        });

        if (customInput) {
            customInput.addEventListener('input', function() {
                const val = parseFloat(this.value);
                if (!isNaN(val) && val > 0) {
                    selectedAmount = val;
                    amountBtns.forEach(b => b.classList.remove('active'));
                    updateTotal();
                    if (donateMessage) donateMessage.classList.remove('show');
                }
            });
        }

        if (frequencySelect) {
            frequencySelect.addEventListener('change', function() {
                donationFrequency = this.value;
                updateTotal();
            });
        }

        function updateTotal() {
            let amount = selectedAmount;
            if (donationFrequency === 'monthly') {
                totalDisplay.textContent = formatMWK(amount * 12) + ' / year';
            } else if (donationFrequency === 'yearly') {
                totalDisplay.textContent = formatMWK(amount * 2) + ' / 2 years';
            } else {
                totalDisplay.textContent = formatMWK(amount);
            }
        }

        if (donateBtn) {
            donateBtn.addEventListener('click', function() {
                let amount = selectedAmount;

                if (customInput) {
                    const customVal = parseFloat(customInput.value);
                    if (!isNaN(customVal) && customVal > 0) {
                        amount = customVal;
                    }
                }

                if (isNaN(amount) || amount <= 0) {
                    amount = 2500;
                    selectedAmount = 2500;
                    amountBtns.forEach(b => b.classList.remove('active'));
                    document.querySelector('.amount-btn[data-amount="2500"]').classList.add('active');
                }

                // Show success message directly
                if (donateMessage && donationDisplay) {
                    donationDisplay.textContent = formatMWK(amount);
                    
                    const messageP = donateMessage.querySelector('p');
                    if (messageP) {
                        messageP.innerHTML = `
                            ✅ Thank you! Your donation of <strong>${formatMWK(amount)}</strong> is making a real difference in Malawi.<br />
                            <span style="font-size: 0.9rem; display: block; margin-top: 8px;">
                                <i class="fas fa-check-circle" style="color: #1a7a3a;"></i> 
                                Payment initiated successfully.
                            </span>
                            <br />
                            <a href="https://wa.me/265997008860?text=Hello%20Charity-Fund%20Malawi%2C%20I%20just%20made%20a%20donation%20of%20MWK%20${Number(amount).toLocaleString()}%20and%20need%20assistance." 
                               target="_blank" style="background: #25D366; color: white; padding: 8px 20px; border-radius: 50px; text-decoration: none; display: inline-block; margin-top: 8px;">
                                <i class="fab fa-whatsapp"></i> Need Help? Chat with CEO
                            </a>
                        `;
                    }
                    donateMessage.classList.add('show');
                }

                // Update goal progress
                const goalFill = document.querySelector('.goal-fill');
                if (goalFill) {
                    const currentWidth = parseFloat(goalFill.style.width);
                    const newWidth = Math.min(currentWidth + 2, 100);
                    goalFill.style.width = newWidth + '%';
                    
                    const currentAmount = 2500000 + (newWidth - 83) * 83333;
                    const goalLabel = document.querySelector('.goal-label span:last-child');
                    if (goalLabel) {
                        goalLabel.textContent = formatMWK(Math.round(currentAmount)) + ' / ' + formatMWK(3000000);
                    }
                }

                if (donateMessage) {
                    setTimeout(() => {
                        donateMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);

                    setTimeout(() => {
                        donateMessage.classList.remove('show');
                    }, 15000);
                }
            });
        }

        if (customInput) {
            customInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && donateBtn) {
                    e.preventDefault();
                    donateBtn.click();
                }
            });
        }

        updateTotal();
    }

    console.log('🌱 Charity-Fund Malawi website loaded successfully!');
})();