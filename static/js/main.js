// Main JavaScript functionality for Kalinga Konsult website

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initSmoothScrolling();
    initFormValidation();
    initProjectFiltering();
    initPartnersMarquee();
    initLazyLoading();
    initAnimations();
    initNavbarShrink();
    
    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Enhanced form validation
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                form.classList.add('was-validated');
                
                // Show loading state on submit button
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && form.checkValidity()) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
                    submitBtn.disabled = true;
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearError);
            });
        });
        
        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return;
                }
            }
            
            // Phone validation
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                    return;
                }
            }
            
            // Required field validation
            if (field.hasAttribute('required') && !value) {
                showFieldError(field, 'This field is required');
                return;
            }
            
            clearFieldError(field);
        }
        
        function clearError(e) {
            clearFieldError(e.target);
        }
        
        function showFieldError(field, message) {
            field.classList.add('is-invalid');
            let feedback = field.nextElementSibling;
            if (!feedback || !feedback.classList.contains('invalid-feedback')) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                field.parentNode.insertBefore(feedback, field.nextSibling);
            }
            feedback.textContent = message;
        }
        
        function clearFieldError(field) {
            field.classList.remove('is-invalid');
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.remove();
            }
        }
    }
    
    // Project filtering functionality
    function initProjectFiltering() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        const projectItems = document.querySelectorAll('.project-item');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects with animation
                projectItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        item.classList.add('fade-in');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in');
                    }
                });
            });
        });
    }
    
    // Partners marquee functionality
    function initPartnersMarquee() {
        const marquee = document.querySelector('.partners-marquee');
        if (!marquee) return;
        
        // Pause animation on hover
        marquee.addEventListener('mouseenter', function() {
            const track = this.querySelector('.partners-track');
            track.style.animationPlayState = 'paused';
        });
        
        marquee.addEventListener('mouseleave', function() {
            const track = this.querySelector('.partners-track');
            track.style.animationPlayState = 'running';
        });
    }
    
    // Lazy loading for images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Scroll animations
    function initAnimations() {
        if ('IntersectionObserver' in window) {
            const animateObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, {
                threshold: 0.1
            });
            
            const animateElements = document.querySelectorAll('.card, .service-card, .project-card');
            animateElements.forEach(el => animateObserver.observe(el));
        }
    }
    
    // Contact form AJAX submission (optional enhancement)
    function initAjaxForms() {
        const quotationForm = document.querySelector('form[method="POST"]');
        if (!quotationForm) return;
        
        quotationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
            submitBtn.disabled = true;
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Success! We will contact you within 24 hours.', 'success');
                    this.reset();
                } else {
                    showNotification('Error submitting form. Please try again.', 'error');
                }
            })
            .catch(error => {
                showNotification('Error submitting form. Please try again.', 'error');
            })
            .finally(() => {
                // Restore button state
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Quotation Request';
                submitBtn.disabled = false;
            });
        });
    }
    
    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Phone number formatting
    function initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                // Add country code if not present
                if (value.length === 10 && !value.startsWith('91')) {
                    value = '91' + value;
                }
                
                // Format as +91 XXXXX XXXXX
                if (value.length >= 12) {
                    value = value.substring(0, 12);
                    e.target.value = `+${value.substring(0, 2)} ${value.substring(2, 7)} ${value.substring(7)}`;
                } else if (value.length >= 7) {
                    e.target.value = `+${value.substring(0, 2)} ${value.substring(2, 7)} ${value.substring(7)}`;
                } else if (value.length >= 2) {
                    e.target.value = `+${value.substring(0, 2)} ${value.substring(2)}`;
                } else {
                    e.target.value = value ? `+${value}` : '';
                }
            });
        });
    }
    
    // Initialize phone formatting
    initPhoneFormatting();
    
    // Back to top button
    function initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'btn btn-primary position-fixed rounded-circle';
        backToTopBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 999; width: 50px; height: 50px; display: none;';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        
        document.body.appendChild(backToTopBtn);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Initialize back to top
    initBackToTop();
    
    // Video optimization and error handling
    function initVideoOptimization() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Handle video loading errors
            video.addEventListener('error', function() {
                console.log('Video loading error, showing fallback');
                const fallback = this.nextElementSibling;
                if (fallback && fallback.classList.contains('d-flex')) {
                    this.style.display = 'none';
                    fallback.style.display = 'flex';
                }
            });
            
            // Handle loading states
            video.addEventListener('loadstart', function() {
                console.log('Video loading started');
            });
            
            video.addEventListener('canplay', function() {
                console.log('Video can start playing');
            });
            
            // Lazy loading for better performance
            if ('IntersectionObserver' in window) {
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const video = entry.target;
                            if (video.getAttribute('preload') === 'none') {
                                video.setAttribute('preload', 'metadata');
                                console.log('Video preload set to metadata');
                            }
                            videoObserver.unobserve(video);
                        }
                    });
                });
                videoObserver.observe(video);
            }
        });
    }
    
    // Play video function for overlay button
    window.playVideo = function(button) {
        const video = button.closest('.position-relative').querySelector('video');
        if (video) {
            video.play().then(() => {
                button.parentElement.style.display = 'none';
            }).catch(err => {
                console.log('Error playing video:', err);
            });
        }
    };

    // Initialize video optimization
    initVideoOptimization();
    
    // Console welcome message
    console.log('%c🏗️ Kalinga Konsult & Engineers', 'color: #0066cc; font-size: 16px; font-weight: bold;');
    console.log('%cProfessional Construction & Engineering Services', 'color: #666; font-size: 12px;');
    console.log('%cWebsite: https://kalingakonsult.in', 'color: #666; font-size: 12px;');
});

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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Video player functionality
function initVideoPlayer() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const playOverlay = container.querySelector('.video-play-overlay');
        
        if (video && playOverlay) {
            // Hide overlay when video starts playing
            video.addEventListener('play', () => {
                playOverlay.style.display = 'none';
            });
            
            // Show overlay when video pauses or ends
            video.addEventListener('pause', () => {
                playOverlay.style.display = 'block';
            });
            
            video.addEventListener('ended', () => {
                playOverlay.style.display = 'block';
            });
        }
    });
}

// Global function for play button
function playVideo(button) {
    const container = button.closest('.video-container');
    const video = container.querySelector('video');
    
    if (video) {
        video.play();
        button.parentElement.style.display = 'none';
    }
}

// Navbar shrink on scroll
function initNavbarShrink() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 16)); // 60fps throttling
    }
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce, throttle };
}
