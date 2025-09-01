// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initContactForm();
    initScrollAnimations();
    initButtonHandlers();
});

// Navigation functionality
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            const isOpen = mobileNav.classList.contains('active');
            
            // Animate hamburger menu
            const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
            if (isOpen) {
                hamburgers[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                hamburgers[1].style.opacity = '0';
                hamburgers[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                hamburgers[0].style.transform = 'none';
                hamburgers[1].style.opacity = '1';
                hamburgers[2].style.transform = 'none';
            }
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
                hamburgers[0].style.transform = 'none';
                hamburgers[1].style.opacity = '1';
                hamburgers[2].style.transform = 'none';
            }
        });
    });

    // Active section tracking
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        const navbarHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section links
                const activeLinks = document.querySelectorAll(`[href="#${sectionId}"]`);
                activeLinks.forEach(link => link.classList.add('active'));
            }
        });
    }

    // Navbar background on scroll
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.9)';
        }
    }

    // Add scroll listeners
    window.addEventListener('scroll', function() {
        updateActiveSection();
        updateNavbarBackground();
    });

    // Initial calls
    updateActiveSection();
    updateNavbarBackground();
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const sendAnotherBtn = document.getElementById('sendAnotherBtn');

    if (!contactForm) return;

    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            message: 'Name must be at least 2 characters'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            minLength: 5,
            message: 'Subject must be at least 5 characters'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Message must be at least 10 characters'
        }
    };

    // Validate single field
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (!rules) return true;

        // Required check
        if (rules.required && (!value || value.trim() === '')) {
            showFieldError(errorElement, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }

        // Pattern check (for email)
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(errorElement, rules.message);
            return false;
        }

        // Min length check
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(errorElement, rules.message);
            return false;
        }

        // Clear error if validation passes
        clearFieldError(errorElement);
        return true;
    }

    // Show field error
    function showFieldError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Clear field error
    function clearFieldError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value);
            });
            
            field.addEventListener('input', function() {
                // Clear error on input if field was previously invalid
                const errorElement = document.getElementById(`${fieldName}Error`);
                if (errorElement && errorElement.textContent) {
                    clearFieldError(errorElement);
                }
            });
        }
    });

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate all fields
        let isValid = true;
        Object.keys(validationRules).forEach(fieldName => {
            if (!validateField(fieldName, data[fieldName])) {
                isValid = false;
            }
        });

        if (!isValid) {
            showToast('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('.form-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoading = submitBtn.querySelector('.submit-loading');
        
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';

        try {
            // Send to backend API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show success message
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                showToast(result.message || 'Message sent successfully!', 'success');
            } else {
                // Handle API errors
                if (result.errors && Array.isArray(result.errors)) {
                    // Handle validation errors from backend
                    result.errors.forEach(error => {
                        const fieldName = error.path[0];
                        const errorElement = document.getElementById(`${fieldName}Error`);
                        showFieldError(errorElement, error.message);
                    });
                } else {
                    showToast(result.message || 'Failed to send message. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Reset loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
        }
    });

    // Send another message button
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', function() {
            successMessage.style.display = 'none';
            contactForm.style.display = 'block';
            contactForm.reset();
            
            // Clear any existing errors
            Object.keys(validationRules).forEach(fieldName => {
                const errorElement = document.getElementById(`${fieldName}Error`);
                clearFieldError(errorElement);
            });
        });
    }
}

// Button handlers
function initButtonHandlers() {
    // View Work button
    const viewWorkBtn = document.getElementById('viewWorkBtn');
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', function() {
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = projectsSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Download Resume button
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function() {
            showToast('Resume download feature coming soon!', 'info');
        });
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.hero-content, .about-content, .skill-card, .project-card');
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const title = type === 'success' ? 'Success!' : 
                  type === 'error' ? 'Error!' : 'Info';
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${message}</div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);

    // Click to dismiss
    toast.addEventListener('click', function() {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    });
}

// Typing animation for hero section
function initTypingAnimation() {
    const typingCursor = document.querySelector('.typing-cursor');
    if (typingCursor) {
        // Ensure the cursor blinks continuously
        setInterval(() => {
            typingCursor.style.opacity = typingCursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
}

// Initialize typing animation
initTypingAnimation();

// Smooth scroll for anchor links
document.addEventListener('click', function(e) {
    // Handle any anchor links that might be added dynamically
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Add loading state management
function setFormLoading(isLoading) {
    const submitBtn = document.querySelector('.form-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    
    if (isLoading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline';
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
    }
}

// Utility function to get CSRF token if needed
function getCSRFToken() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    return csrfToken ? csrfToken.getAttribute('content') : null;
}

// Add some interactive hover effects
document.addEventListener('mouseover', function(e) {
    // Enhanced hover effects for skill cards
    if (e.target.closest('.skill-card')) {
        const card = e.target.closest('.skill-card');
        card.style.transform = 'translateY(-4px) scale(1.02)';
    }
    
    // Enhanced hover effects for project cards
    if (e.target.closest('.project-card')) {
        const card = e.target.closest('.project-card');
        card.style.transform = 'translateY(-2px)';
    }
});

document.addEventListener('mouseout', function(e) {
    // Reset hover effects
    if (e.target.closest('.skill-card')) {
        const card = e.target.closest('.skill-card');
        card.style.transform = '';
    }
    
    if (e.target.closest('.project-card')) {
        const card = e.target.closest('.project-card');
        card.style.transform = '';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const mobileNav = document.getElementById('mobileNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
            hamburgers[0].style.transform = 'none';
            hamburgers[1].style.opacity = '1';
            hamburgers[2].style.transform = 'none';
        }
    }
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=600',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=600',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400',
        'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload on page load
preloadImages();