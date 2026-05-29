document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis Smooth Scroll
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            syncTouch: false // Keeps native momentum on mobile devices
        });

        // Expose to window scope
        window.lenis = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Header Scroll Effect
    const header = document.querySelector('header');
    
    if (header) {
        if (lenis) {
            lenis.on('scroll', (e) => {
                if (e.scroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        } else {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { passive: true });
        }
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    
    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && mobileBtn && !e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
            nav.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Generate Floating Diyos Particles
    const floatingContainer = document.querySelector('.floating-diyos');
    if (floatingContainer) {
        for (let i = 0; i < 20; i++) {
            createDiyoParticle(floatingContainer);
        }
    }

    // Smooth Scroll for Anchor Links with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (mobileBtn) {
                    const icon = mobileBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                if (lenis) {
                    lenis.scrollTo(targetElement, {
                        offset: -headerHeight,
                        duration: 1.2
                    });
                } else {
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerHeight;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Smooth Scroll to Hash on page load if hash exists
    if (window.location.hash) {
        const hashTarget = document.querySelector(window.location.hash);
        if (hashTarget) {
            setTimeout(() => {
                const headerHeight = header ? header.offsetHeight : 0;
                if (lenis) {
                    lenis.scrollTo(hashTarget, {
                        offset: -headerHeight,
                        duration: 1.5,
                        immediate: false
                    });
                } else {
                    const elementPosition = hashTarget.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerHeight;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        }
    }

    // Constrain Event Date Picker to Future Dates
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Contact Form Submission (Web3Forms)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn ? btn.textContent : 'Send Inquiry';
            
            if (btn) {
                btn.innerHTML = '<span class="spinner"></span> Sending...';
                btn.disabled = true;
            }
            
            const formData = new FormData(contactForm);
 
            const resetButton = () => {
                setTimeout(() => {
                    if (btn) {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.background = '';
                    }
                }, 4000);
            };
 
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    if (btn) {
                        btn.textContent = 'Message Sent!';
                        btn.style.background = '#28a745';
                    }
                    contactForm.reset();
                    
                    // Transition form to success message
                    setTimeout(() => {
                        contactForm.style.transition = 'opacity 0.4s ease';
                        contactForm.style.opacity = '0';
                        
                        setTimeout(() => {
                            contactForm.style.display = 'none';
                            const successMsg = document.getElementById('formSuccess');
                            if (successMsg) {
                                successMsg.style.display = 'block';
                                successMsg.style.opacity = '0';
                                successMsg.style.transition = 'opacity 0.4s ease';
                                // Trigger reflow
                                successMsg.offsetHeight;
                                successMsg.style.opacity = '1';
                            }
                        }, 400);
                    }, 800);
                } else {
                    if (btn) {
                        btn.textContent = 'Error sending message.';
                        btn.style.background = '#dc3545';
                    }
                    resetButton();
                }
            } catch (error) {
                if (btn) {
                    btn.textContent = 'Network Error.';
                    btn.style.background = '#dc3545';
                }
                resetButton();
            }
        });
    }

    // Hero Image Slider
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change image every 5 seconds
    }

    // ScrollSpy: Update active link based on scroll position (optimized with cached offsets)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');

    if (sections.length > 0 && navLinks.length > 0) {
        let sectionPositions = [];

        const cacheSectionPositions = () => {
            const headerHeight = header ? header.offsetHeight : 0;
            sectionPositions = Array.from(sections).map(section => {
                return {
                    id: section.getAttribute('id'),
                    top: section.offsetTop - headerHeight - 20
                };
            });
        };

        // Cache positions initially and on resize to avoid scroll layout thrashing
        cacheSectionPositions();
        window.addEventListener('resize', cacheSectionPositions, { passive: true });

        const updateActiveLink = (scrollY) => {
            let current = '';
            for (let i = 0; i < sectionPositions.length; i++) {
                if (scrollY >= sectionPositions[i].top) {
                    current = sectionPositions[i].id;
                }
            }

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${current}` || href.endsWith(`#${current}`)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        // Bind scroll updates to Lenis or fallback to passive window scroll
        if (lenis) {
            lenis.on('scroll', (e) => {
                updateActiveLink(e.scroll);
            });
        } else {
            window.addEventListener('scroll', () => {
                updateActiveLink(window.scrollY);
            }, { passive: true });
        }
    }
});

function createDiyoParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('diyo-particle');
    
    // Randomize position, size, and animation duration/delay
    const size = Math.random() * 15 + 5; // 5px to 20px
    const left = Math.random() * 100; // 0% to 100%
    const duration = Math.random() * 5 + 3; // 3s to 8s
    const delay = Math.random() * 5; // 0s to 5s
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = '-20px';
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
}
