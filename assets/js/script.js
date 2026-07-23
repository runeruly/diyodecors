document.addEventListener('DOMContentLoaded', () => {
    console.log('DiyoDecors script.js loaded - v1.1.4');
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

    // Enhanced Hero Image Slider with Manual Dots & Prev/Next Arrows
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    const heroDots = document.querySelectorAll('.hero-dot');
    
    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        let heroInterval;

        const setHeroSlide = (index) => {
            heroSlides.forEach(s => s.classList.remove('active'));
            heroDots.forEach(d => d.classList.remove('active'));

            currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

            heroSlides[currentHeroSlide].classList.add('active');
            if (heroDots[currentHeroSlide]) {
                heroDots[currentHeroSlide].classList.add('active');
            }
        };

        const startHeroTimer = () => {
            heroInterval = setInterval(() => {
                setHeroSlide(currentHeroSlide + 1);
            }, 5000);
        };

        const resetHeroTimer = () => {
            clearInterval(heroInterval);
            startHeroTimer();
        };

        if (heroPrev) {
            heroPrev.addEventListener('click', () => {
                setHeroSlide(currentHeroSlide - 1);
                resetHeroTimer();
            });
        }
        if (heroNext) {
            heroNext.addEventListener('click', () => {
                setHeroSlide(currentHeroSlide + 1);
                resetHeroTimer();
            });
        }

        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                setHeroSlide(index);
                resetHeroTimer();
            });
        });

        startHeroTimer();
    }

    // Testimonials Sliding Carousel
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialPrev = document.querySelector('.prev-testimonial');
    const testimonialNext = document.querySelector('.next-testimonial');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    
    if (testimonialCards.length > 0) {
        let currentTestimonial = 0;
        let testimonialInterval;

        const setTestimonial = (index) => {
            testimonialCards.forEach(c => c.classList.remove('active'));
            testimonialDots.forEach(d => d.classList.remove('active'));

            currentTestimonial = (index + testimonialCards.length) % testimonialCards.length;

            testimonialCards[currentTestimonial].classList.add('active');
            if (testimonialDots[currentTestimonial]) {
                testimonialDots[currentTestimonial].classList.add('active');
            }
        };

        const startTestimonialTimer = () => {
            testimonialInterval = setInterval(() => {
                setTestimonial(currentTestimonial + 1);
            }, 6000);
        };

        const resetTestimonialTimer = () => {
            clearInterval(testimonialInterval);
            startTestimonialTimer();
        };

        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', () => {
                setTestimonial(currentTestimonial - 1);
                resetTestimonialTimer();
            });
        }

        if (testimonialNext) {
            testimonialNext.addEventListener('click', () => {
                setTestimonial(currentTestimonial + 1);
                resetTestimonialTimer();
            });
        }

        testimonialDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                setTestimonial(idx);
                resetTestimonialTimer();
            });
        });

        startTestimonialTimer();
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

    // Setup Scroll Reveal Animations
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                } else {
                    if (entry.boundingClientRect.top > 0) {
                        entry.target.classList.remove('revealed');
                    }
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        // 1. Observe Section Headers (fade-up reveal)
        document.querySelectorAll('.section-header').forEach(header => {
            header.classList.add('reveal-up');
            revealObserver.observe(header);
        });

        // 2. Observe Grid Cards with staggered transition-delays
        const staggeredContainers = document.querySelectorAll('.services-grid, .founders-grid, .portfolio-grid');
        staggeredContainers.forEach(container => {
            const items = container.children;
            Array.from(items).forEach((item, index) => {
                item.classList.add('reveal-up');
                item.style.transitionDelay = `${index * 0.06}s`;
                revealObserver.observe(item);
            });
        });

        // 3. Observe Left/Right side columns
        document.querySelectorAll('.about-logo, .contact-info').forEach(el => {
            el.classList.add('reveal-left');
            revealObserver.observe(el);
        });

        document.querySelectorAll('.about-text, .contact-form').forEach(el => {
            el.classList.add('reveal-right');
            revealObserver.observe(el);
        });

        // 4. Observe CTA & Testimonials sections (scale reveal)
        document.querySelectorAll('.cta h2, .cta p, .cta .btn, .testimonials-carousel-wrapper').forEach((el, index) => {
            el.classList.add('reveal-scale');
            el.style.transitionDelay = `${index * 0.08}s`;
            revealObserver.observe(el);
        });
    }

    // Filterable Portfolio Grid & Category Tabs
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const lightbox = document.getElementById('portfolioLightbox');
    
    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                portfolioCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // Modal Lightbox Controller
    if (lightbox && portfolioCards.length > 0) {
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTag = document.getElementById('lightboxTag');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxLocation = document.getElementById('lightboxLocation');
        const lightboxDesc = document.getElementById('lightboxDesc');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');

        let currentLightboxIndex = 0;
        let visibleCards = [];

        const updateVisibleCards = () => {
            visibleCards = Array.from(portfolioCards).filter(card => card.style.display !== 'none');
        };

        const openLightbox = (cardIndex) => {
            updateVisibleCards();
            if (visibleCards.length === 0) return;

            currentLightboxIndex = cardIndex;
            const targetCard = visibleCards[currentLightboxIndex] || visibleCards[0];

            if (lightboxImage) lightboxImage.src = targetCard.getAttribute('data-image') || '';
            if (lightboxTag) lightboxTag.textContent = targetCard.querySelector('.portfolio-tag')?.textContent || 'Event';
            if (lightboxTitle) lightboxTitle.textContent = targetCard.getAttribute('data-title') || '';
            if (lightboxLocation) lightboxLocation.innerHTML = `<i class="fas fa-map-marker-alt text-gold"></i> ${targetCard.getAttribute('data-location') || ''}`;
            if (lightboxDesc) lightboxDesc.textContent = targetCard.getAttribute('data-desc') || '';

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        portfolioCards.forEach((card) => {
            card.addEventListener('click', () => {
                updateVisibleCards();
                const indexInVisible = visibleCards.indexOf(card);
                openLightbox(indexInVisible >= 0 ? indexInVisible : 0);
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                updateVisibleCards();
                const prevIndex = (currentLightboxIndex - 1 + visibleCards.length) % visibleCards.length;
                openLightbox(prevIndex);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                updateVisibleCards();
                const nextIndex = (currentLightboxIndex + 1) % visibleCards.length;
                openLightbox(nextIndex);
            });
        }

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
                if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
            }
        });
    }

    // Custom Event Type Toggle & URL Query Param Auto-select (Contact Form)
    const eventSelect = document.getElementById('event');
    const customEventGroup = document.getElementById('custom-event-group');
    const customEventInput = document.getElementById('custom_event');

    if (eventSelect && customEventGroup && customEventInput) {
        eventSelect.addEventListener('change', () => {
            if (eventSelect.value === 'other') {
                customEventGroup.style.display = 'block';
                customEventInput.required = true;
                customEventInput.focus();
            } else {
                customEventGroup.style.display = 'none';
                customEventInput.required = false;
                customEventInput.value = '';
            }
        });

        // Contact Form URL Query Parameter Pre-selection (e.g. contact.html?service=gunyo-cholo)
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        if (serviceParam) {
            const serviceMapping = {
                'weddings': 'wedding',
                'wedding': 'wedding',
                'birthdays': 'birthday',
                'birthday': 'birthday',
                'babyshower': 'babyshower',
                'gender-reveal': 'gender_reveal',
                'graduations': 'other',
                'pasni': 'pasni',
                'bartabanda': 'bartabanda',
                'gunyo-cholo': 'gunyo_cholo',
                'gunyo_cholo': 'gunyo_cholo',
                'diwali': 'diwali',
                'pujas': 'pujas',
                'anniversaries': 'anniversaries',
                'dance': 'dance_choreography'
            };

            const targetValue = serviceMapping[serviceParam.toLowerCase()];
            if (targetValue) {
                eventSelect.value = targetValue;
                eventSelect.dispatchEvent(new Event('change'));
            }
        }
    }
});

function createDiyoParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('diyo-particle');
    
    const size = Math.random() * 15 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 5 + 3;
    const delay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = '-20px';
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
}
