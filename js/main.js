// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeFAQ();
   // initializeContactForm();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 15, 35, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'rgba(15, 15, 35, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // Active navigation link highlighting
    updateActiveNavigation();
    window.addEventListener('scroll', updateActiveNavigation);
}

// Update active navigation based on current page
function updateActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath.includes('index.html')) ||
            (currentPath.includes('index.html') && linkPath === '/')) {
            link.classList.add('active');
        }
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .service-card, .value-card, .stat-item, .step, .faq-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        if (otherAnswer) otherAnswer.style.display = 'none';
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current FAQ item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.display = 'none';
                    if (icon) icon.style.transform = 'rotate(0deg)';
                } else {
                    item.classList.add('active');
                    answer.style.display = 'block';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            });
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    const formInputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        company: document.getElementById('company'),
        website: document.getElementById('website'),
        service: document.getElementById('service'),
        budget: document.getElementById('budget'),
        message: document.getElementById('message'),
        newsletter: document.getElementById('newsletter')
    };
    
    const errorElements = {
        name: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        phone: document.getElementById('phoneError'),
        website: document.getElementById('websiteError'),
        message: document.getElementById('messageError')
    };
    
    const formMessage = document.getElementById('formMessage');
    
    // Real-time validation
    Object.keys(formInputs).forEach(key => {
        const input = formInputs[key];
        if (input && input.type !== 'checkbox') {
            input.addEventListener('blur', function() {
                validateField(key, input.value);
            });
            
            input.addEventListener('input', function() {
                clearError(key);
            });
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: formInputs.name?.value?.trim(),
            email: formInputs.email?.value?.trim(),
            phone: formInputs.phone?.value?.trim(),
            company: formInputs.company?.value?.trim(),
            website: formInputs.website?.value?.trim(),
            service: formInputs.service?.value,
            budget: formInputs.budget?.value,
            message: formInputs.message?.value?.trim(),
            newsletter: formInputs.newsletter?.checked
        };
        
if (validateForm(formData)) {
    submitForm(formData);
}
    });
 
    // Validation functions
    function validateField(fieldName, value) {
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'name':
                if (!value || value.length < 2) {
                    errorMessage = 'Please enter a valid name (at least 2 characters)';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'phone':
                if (value) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                        errorMessage = 'Please enter a valid phone number';
                        isValid = false;
                    }
                }
                break;
                
            case 'website':
                if (value) {
                    try {
                        new URL(value);
                    } catch {
                        errorMessage = 'Please enter a valid website URL (e.g., https://example.com)';
                        isValid = false;
                    }
                }
                break;
                
            case 'message':
                if (!value || value.length < 10) {
                    errorMessage = 'Please enter a message (at least 10 characters)';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid && errorElements[fieldName]) {
            showError(fieldName, errorMessage);
        } else {
            clearError(fieldName);
        }
        
        return isValid;
    }
    
    function validateForm(data) {
        let isFormValid = true;
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'message'];
        requiredFields.forEach(field => {
            if (!validateField(field, data[field])) {
                isFormValid = false;
            }
        });
        
        // Validate optional fields if they have values
        if (data.phone && !validateField('phone', data.phone)) {
            isFormValid = false;
        }
        
        if (data.website && !validateField('website', data.website)) {
            isFormValid = false;
        }
        
        return isFormValid;
    }
    
    function showError(fieldName, message) {
        const errorElement = errorElements[fieldName];
        const inputElement = formInputs[fieldName];
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.style.borderColor = '#f87171';
            inputElement.style.boxShadow = '0 0 0 3px rgba(248, 113, 113, 0.1)';
        }
    }
    
    function clearError(fieldName) {
        const errorElement = errorElements[fieldName];
        const inputElement = formInputs[fieldName];
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        if (inputElement) {
            inputElement.style.borderColor = '#2a2a3e';
            inputElement.style.boxShadow = 'none';
        }
    }
    
    function submitForm(data) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonIcon = submitButton.querySelector('i');
        
        if (buttonText) buttonText.textContent = 'Sending...';
        if (buttonIcon) {
            buttonIcon.className = 'fas fa-spinner fa-spin';
        }
        submitButton.disabled = true;
        
        // Simulate form submission (in a real app, you'd send to your backend)
        setTimeout(() => {
            showFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            if (buttonText) buttonText.textContent = 'Send Message';
            if (buttonIcon) {
                buttonIcon.className = 'fas fa-paper-plane';
            }
            submitButton.disabled = false;
            
            // Clear any existing errors
            Object.keys(errorElements).forEach(key => {
                clearError(key);
            });
            
        }, 2000);
    }
    
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Auto-hide success messages
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
}

// Animation initialization
function initializeAnimations() {
    // Add staggered animation delays to grid items
    const animatedGrids = document.querySelectorAll('.features-grid, .services-grid, .values-grid');
    
    animatedGrids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    });
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat h3, .stat-item h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation function
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d]/g, '');
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const steps = 60;
    const stepValue = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += stepValue;
        if (current >= number) {
            element.textContent = number + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, duration / steps);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
window.addEventListener('scroll', debounce(function() {
    // Any scroll-based functions can be debounced here
}, 10));

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Resume animations or refresh data if needed
    } else {
        // Pause heavy operations when tab is not visible
    }
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    // In production, you might want to send this to an error tracking service
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // You can register a service worker here for offline functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export functions for potential use in other scripts
window.SEOPro = {
    initializeNavigation,
    initializeScrollEffects,
    initializeFAQ,
    initializeContactForm,
    initializeAnimations
};
