// ============================================
// COMPLETE FUNCTIONALITY FOR CHARITY-FUND
// ============================================

(function() {
    'use strict';

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    let darkMode = false;

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        darkMode = !darkMode;
        this.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // ===== MOBILE HAMBURGER =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });

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
    const heroSection = document.querySelector('.hero');
    let countersAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
            }
        });
    }, { threshold: 0.3 });

    observer.observe(heroSection);

    // ===== DONATION FUNCTIONALITY =====
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customInput = document.getElementById('customAmount');
    const donateBtn = document.getElementById('donateNowBtn');
    const donateMessage = document.getElementById('donateMessage');
    const donationDisplay = document.getElementById('donationDisplay');
    const totalDisplay = document.getElementById('totalDisplay');
    const frequencySelect = document.getElementById('donationFrequency');
    const currencyBtns = document.querySelectorAll('.currency-btn');

    let selectedAmount = 25;
    let selectedCurrency = 'USD';
    let donationFrequency = 'one-time';

    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£'
    };

    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = parseInt(this.getAttribute('data-amount'));
            if (!isNaN(amount) && amount > 0) {
                selectedAmount = amount;
                amountBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                customInput.value = '';
                updateTotal();
                donateMessage.classList.remove('show');
            }
        });
    });

    customInput.addEventListener('input', function() {
        const val = parseFloat(this.value);
        if (!isNaN(val) && val > 0) {
            selectedAmount = val;
            amountBtns.forEach(b => b.classList.remove('active'));
            updateTotal();
            donateMessage.classList.remove('show');
        }
    });

    currencyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            selectedCurrency = this.getAttribute('data-currency');
            currencyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateTotal();
            const symbol = currencySymbols[selectedCurrency];
            amountBtns.forEach(b => {
                const amount = b.getAttribute('data-amount');
                b.textContent = `${symbol}${amount}`;
            });
        });
    });

    frequencySelect.addEventListener('change', function() {
        donationFrequency = this.value;
        updateTotal();
    });

    function updateTotal() {
        let amount = selectedAmount;
        if (donationFrequency === 'monthly') {
            totalDisplay.textContent = `${currencySymbols[selectedCurrency]}${(amount * 12).toFixed(2)} / year`;
        } else if (donationFrequency === 'yearly') {
            totalDisplay.textContent = `${currencySymbols[selectedCurrency]}${(amount * 2).toFixed(2)} / 2 years`;
        } else {
            totalDisplay.textContent = `${currencySymbols[selectedCurrency]}${amount.toFixed(2)}`;
        }
    }

    donateBtn.addEventListener('click', function() {
        let amount = selectedAmount;

        const customVal = parseFloat(customInput.value);
        if (!isNaN(customVal) && customVal > 0) {
            amount = customVal;
        }

        if (isNaN(amount) || amount <= 0) {
            amount = 25;
            selectedAmount = 25;
            amountBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('.amount-btn[data-amount="25"]').classList.add('active');
        }

        const symbol = currencySymbols[selectedCurrency];
        let frequencyText = '';
        if (donationFrequency === 'monthly') frequencyText = ' monthly';
        else if (donationFrequency === 'yearly') frequencyText = ' yearly';

        donationDisplay.textContent = `${symbol}${amount.toFixed(2)}${frequencyText}`;
        donateMessage.classList.add('show');

        const goalFill = document.querySelector('.goal-fill');
        const currentWidth = parseFloat(goalFill.style.width);
        const newWidth = Math.min(currentWidth + 5, 100);
        goalFill.style.width = newWidth + '%';
        document.querySelector('.goal-label span:last-child').textContent = 
            `$${(12500 + (newWidth - 83) * 83.33).toFixed(0)} / $15,000`;

        setTimeout(() => {
            donateMessage.classList.remove('show');
        }, 5000);
    });

    customInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            donateBtn.click();
        }
    });

    // ===== TESTIMONIAL SLIDER =====
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoSlide();
        });
    });

    const slider = document.querySelector('.testimonial-slider');
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();

    // ===== NEWSLETTER SUBSCRIPTION =====
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMessage = document.getElementById('newsletterMessage');

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = newsletterEmail.value.trim();

        if (!email || !isValidEmail(email)) {
            newsletterMessage.textContent = '⚠️ Please enter a valid email address.';
            newsletterMessage.style.color = '#ef4444';
            return;
        }

        newsletterMessage.textContent = '✅ Thank you for subscribing! Check your inbox.';
        newsletterMessage.style.color = '#4ade80';
        newsletterEmail.value = '';

        setTimeout(() => {
            newsletterMessage.textContent = '';
        }, 4000);
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');

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

    // ===== VALIDATION HELPER =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
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
                navLinks.classList.remove('active');
            }
        });
    });

    // ===== PARALLAX EFFECT =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        }
    });

    // ===== INITIALIZE =====
    console.log('🌱 Charity-Fund website loaded successfully!');
    updateTotal();

})();