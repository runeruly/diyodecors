// Promote non-blocking stylesheets immediately on script execution (CSP-compliant)
document.querySelectorAll('link[data-async-css]').forEach((link) => {
    link.media = 'all';
});

document.addEventListener('DOMContentLoaded', () => {
    // Clean URL Bar: Strip .html extension if visited via a direct .html URL
    if (window.location.pathname.endsWith('.html') && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        const cleanPath = window.location.pathname
            .replace(/\/index\.html$/, '/')
            .replace(/\.html$/, '');
        window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
    }
    const isFinePointerDevice = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotionEarly = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize Lenis Smooth Scroll on desktop fine-pointer devices only
    let lenis;
    if (typeof Lenis !== 'undefined' && isFinePointerDevice && !prefersReducedMotionEarly) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            syncTouch: false
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
            const isActive = nav.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (isActive) {
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
            mobileBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Generate Floating Diyos Particles (scaled for device capability)
    const floatingContainer = document.querySelector('.floating-diyos');
    if (floatingContainer && !prefersReducedMotionEarly) {
        const particleCount = isFinePointerDevice ? 12 : 6;
        for (let i = 0; i < particleCount; i++) {
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
                    mobileBtn.setAttribute('aria-expanded', 'false');
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

    // Enhanced Hero Image Slider with Manual Dots, Prev/Next Arrows, Live Counter & Touch Swipe
    const heroSection = document.querySelector('.hero');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    const heroDots = document.querySelectorAll('.hero-dot');
    const heroCounter = document.querySelector('.hero-slide-counter');
    
    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        let heroInterval;
        const totalSlidesStr = String(heroSlides.length).padStart(2, '0');

        const ensureHeroSlideBg = (slide) => {
            if (slide && slide.dataset.bg) {
                slide.style.backgroundImage = `url('${slide.dataset.bg}')`;
                delete slide.dataset.bg;
            }
        };

        const setHeroSlide = (index) => {
            heroSlides.forEach(s => s.classList.remove('active'));
            heroDots.forEach(d => d.classList.remove('active'));

            currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

            ensureHeroSlideBg(heroSlides[currentHeroSlide]);
            ensureHeroSlideBg(heroSlides[(currentHeroSlide + 1) % heroSlides.length]);

            heroSlides[currentHeroSlide].classList.add('active');
            if (heroDots[currentHeroSlide]) {
                heroDots[currentHeroSlide].classList.add('active');
            }
            if (heroCounter) {
                const currentStr = String(currentHeroSlide + 1).padStart(2, '0');
                heroCounter.textContent = `${currentStr} / ${totalSlidesStr}`;
            }
        };

        // Pre-warm remaining hero slides after initial page load completes
        window.addEventListener('load', () => {
            setTimeout(() => {
                heroSlides.forEach(ensureHeroSlideBg);
            }, 1800);
        }, { once: true });

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

        // Mobile Touch Swipe Support for Hero Slider
        if (heroSection) {
            let touchStartX = 0;
            let touchStartY = 0;
            heroSection.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            heroSection.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 1) {
                    const deltaX = e.changedTouches[0].clientX - touchStartX;
                    const deltaY = e.changedTouches[0].clientY - touchStartY;
                    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                        if (deltaX < 0) {
                            setHeroSlide(currentHeroSlide + 1);
                        } else {
                            setHeroSlide(currentHeroSlide - 1);
                        }
                        resetHeroTimer();
                    }
                }
            }, { passive: true });
        }

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
        const staggeredContainers = document.querySelectorAll('.services-grid, .founders-grid, .portfolio-grid, .how-steps, .prestige-pillars, .featured-portfolio-grid, .included-grid');
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

        // 5. Observe Showcase & Gallery Photos (Curtain Clip-Path Reveal)
        document.querySelectorAll('.service-detail-image, .service-gallery-item, .featured-work-card:not(.hotspot-card)').forEach((el, index) => {
            el.classList.add('curtain-reveal');
            el.style.transitionDelay = `${(index % 2) * 0.12}s`;
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
        const lightboxBookBtn = document.getElementById('lightboxBookBtn');

        let currentLightboxIndex = 0;
        let visibleCards = [];

        const serviceParamMap = {
            'traditional': 'pasni',
            'graduations': 'graduations',
            'weddings': 'weddings',
            'birthdays': 'birthdays'
        };

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

            const category = targetCard.getAttribute('data-category') || '';
            const serviceParam = serviceParamMap[category];
            if (lightboxBookBtn) {
                lightboxBookBtn.href = serviceParam ? `contact?service=${serviceParam}` : 'contact';
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lightboxClose) lightboxClose.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            if (document.activeElement && lightbox.contains(document.activeElement)) {
                const lastCard = visibleCards[currentLightboxIndex];
                if (lastCard) lastCard.focus();
            }
        };

        portfolioCards.forEach((card) => {
            card.addEventListener('click', () => {
                updateVisibleCards();
                const indexInVisible = visibleCards.indexOf(card);
                openLightbox(indexInVisible >= 0 ? indexInVisible : 0);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
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

    // Custom Event Type Toggle, Dynamic Vision Placeholder & URL Query Param Auto-select
    const eventSelect = document.getElementById('event');
    const customEventGroup = document.getElementById('custom-event-group');
    const customEventInput = document.getElementById('custom_event');
    const messageInput = document.getElementById('message');

    const visionPlaceholders = {
        'wedding': 'E.g., Mandap preferences, stage backdrop style, color theme (gold, crimson, pastel), bridal entry walkway, floral choices...',
        'birthday': 'E.g., Birthday theme (balloon arch, floral backdrop, character theme), cake table setup, photo booth backdrop...',
        'babyshower': 'E.g., Theme (Oh Baby, teddy bear, cloud/floral), gender hints, dessert table setup, photo backdrop...',
        'gender_reveal': 'E.g., Reveal surprise mechanism, balloon box/arch, pink & blue color scheme, dessert table setup...',
        'graduation': 'E.g., School/university colors, photo backdrop with year, marquee numbers, balloon garland style...',
        'pasni': 'E.g., Rice feeding ceremonial stage setup, traditional red/gold color accents, cushion seating, thali backdrop...',
        'bartabanda': 'E.g., Sacred thread ceremony stage setup, mandap/puja backdrop, traditional brass diyos, family seating layout...',
        'gunyo_cholo': 'E.g., Coming of age celebration stage, red & gold traditional fabric drapery, photo booth, floral backdrop...',
        'diwali': 'E.g., Traditional marigold garlands, brass diyo arrangements, rangoli decor setup, festive lighting...',
        'pujas': 'E.g., Puja altar/stage setup, specific floral garlands, traditional copper/brass diyos, sacred cloth drapery...',
        'anniversaries': 'E.g., Milestone theme (Silver, Gold, Diamond), romantic candlelit decor, photo memory wall...',
        'dance_choreography': 'E.g., Dance style (Bollywood, Nepali traditional, Sangeet group dance), number of songs, rehearsal timeline...',
        'other': 'Tell us more about your design vision, preferred colors, traditional requirements, or any questions you have for us...'
    };

    function updateVisionPlaceholder() {
        if (!messageInput) return;
        const selectedEvent = eventSelect.value;
        if (selectedEvent && visionPlaceholders[selectedEvent]) {
            messageInput.placeholder = visionPlaceholders[selectedEvent];
        } else {
            messageInput.placeholder = 'Tell us more about your design vision, preferred colors, traditional requirements (Mandap, Pasni, etc.), or questions...';
        }
    }

    if (eventSelect) {
        eventSelect.addEventListener('change', () => {
            if (customEventGroup && customEventInput) {
                if (eventSelect.value === 'other') {
                    customEventGroup.style.display = 'block';
                    customEventInput.required = true;
                    customEventInput.focus();
                } else {
                    customEventGroup.style.display = 'none';
                    customEventInput.required = false;
                    customEventInput.value = '';
                }
            }
            updateVisionPlaceholder();
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
                'graduations': 'graduation',
                'graduation': 'graduation',
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

    // ==========================================================================
    // Services Category Filters & Carousel Controller (Arrows & Dots for Mobile/Tablet)
    // ==========================================================================
    const servicesGrid = document.querySelector('.services-grid');
    const servicesPrevBtn = document.querySelector('.services-prev');
    const servicesNextBtn = document.querySelector('.services-next');
    const servicesDotsContainer = document.querySelector('.services-dots');
    const serviceFilterBtns = document.querySelectorAll('.service-filter-btn');

    if (servicesGrid) {
        const allServiceCards = Array.from(servicesGrid.querySelectorAll('.service-card'));
        const getVisibleServiceCards = () => allServiceCards.filter(card => !card.classList.contains('is-filtered-out'));

        // Generate pagination dots for visible cards
        const renderServiceDots = () => {
            if (!servicesDotsContainer) return;
            const visibleCards = getVisibleServiceCards();
            servicesDotsContainer.innerHTML = '';
            visibleCards.forEach((card, idx) => {
                const dot = document.createElement('span');
                dot.classList.add('services-dot');
                if (idx === 0) dot.classList.add('active');
                dot.setAttribute('data-index', idx);
                dot.setAttribute('aria-label', `Go to service ${idx + 1}`);
                servicesDotsContainer.appendChild(dot);

                dot.addEventListener('click', () => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                });
            });
        };

        renderServiceDots();

        // Category Filter Pill Clicks
        if (serviceFilterBtns.length > 0) {
            serviceFilterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    serviceFilterBtns.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');

                    const selectedCategory = btn.getAttribute('data-service-filter');

                    allServiceCards.forEach(card => {
                        const cardCat = card.getAttribute('data-service-category');
                        if (selectedCategory === 'all' || cardCat === selectedCategory) {
                            card.classList.remove('is-filtered-out');
                            card.classList.add('revealed');
                        } else {
                            card.classList.add('is-filtered-out');
                        }
                    });

                    servicesGrid.scrollTo({ left: 0, behavior: 'smooth' });
                    renderServiceDots();
                });
            });
        }

        // Arrow navigation
        const getScrollStep = () => {
            const visibleCards = getVisibleServiceCards();
            if (visibleCards.length > 0) {
                const style = window.getComputedStyle(visibleCards[0]);
                const margin = parseFloat(style.marginRight) || 16;
                return visibleCards[0].offsetWidth + margin;
            }
            return 300;
        };

        if (servicesPrevBtn) {
            servicesPrevBtn.addEventListener('click', () => {
                servicesGrid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
            });
        }

        if (servicesNextBtn) {
            servicesNextBtn.addEventListener('click', () => {
                servicesGrid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
            });
        }

        // Active dot sync on scroll
        let isTicking = false;
        servicesGrid.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const visibleCards = getVisibleServiceCards();
                    if (servicesDotsContainer && visibleCards.length > 0) {
                        const dots = servicesDotsContainer.querySelectorAll('.services-dot');
                        const gridRect = servicesGrid.getBoundingClientRect();
                        const gridCenter = gridRect.left + gridRect.width / 2;

                        let closestIndex = 0;
                        let minDistance = Infinity;

                        visibleCards.forEach((card, idx) => {
                            const cardRect = card.getBoundingClientRect();
                            const cardCenter = cardRect.left + cardRect.width / 2;
                            const distance = Math.abs(cardCenter - gridCenter);

                            if (distance < minDistance) {
                                minDistance = distance;
                                closestIndex = idx;
                            }
                        });

                        dots.forEach((dot, idx) => {
                            dot.classList.toggle('active', idx === closestIndex);
                        });
                    }
                    isTicking = false;
                });
                isTicking = true;
            }
        }, { passive: true });
    }

    // ==========================================================================
    // Interactive Stage Hotspot Showcase Controller
    // ==========================================================================
    const hotspotPins = document.querySelectorAll('.hotspot-pin');
    const hotspotPills = document.querySelectorAll('.hotspot-pill-btn');
    const hotspotPanels = document.querySelectorAll('.hotspot-detail-item');

    if (hotspotPins.length > 0 && hotspotPanels.length > 0) {
        const activateHotspot = (indexStr) => {
            hotspotPins.forEach((pin) => {
                pin.classList.toggle('active', pin.getAttribute('data-hotspot-index') === indexStr);
            });
            hotspotPills.forEach((pill) => {
                const isMatch = pill.getAttribute('data-hotspot-index') === indexStr;
                pill.classList.toggle('active', isMatch);
                pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
            });
            hotspotPanels.forEach((panel) => {
                panel.classList.toggle('active', panel.getAttribute('data-hotspot-panel') === indexStr);
            });
        };

        hotspotPins.forEach((pin) => {
            pin.addEventListener('click', (e) => {
                e.stopPropagation();
                activateHotspot(pin.getAttribute('data-hotspot-index'));
            });
        });

        hotspotPills.forEach((pill) => {
            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                activateHotspot(pill.getAttribute('data-hotspot-index'));
            });
        });
    }

    // ==========================================================================
    // Candlelit Card Spotlight, 3D Card Tilt & Magnetic Buttons (Desktop)
    // ==========================================================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    const spotlightCards = document.querySelectorAll('.spotlight-card');
    if (spotlightCards.length > 0 && isFinePointer) {
        spotlightCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }, { passive: true });
        });
    }

    // 3D Perspective Tilt on Service & Portfolio Cards
    if (isFinePointer && !prefersReducedMotion) {
        const tiltCards = document.querySelectorAll('.service-card, .portfolio-card');
        tiltCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4.5;
                const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 4.5;
                card.style.transform = `perspective(900px) translateY(-8px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Subtle Magnetic Pull on Hero & Primary CTA Buttons
        const magneticBtns = document.querySelectorAll('.hero-btns .btn, .cta .btn, .nav-cta');
        magneticBtns.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const deltaX = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
                const deltaY = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
                btn.style.transform = `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0)`;
            }, { passive: true });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ==========================================================================
    // Top Golden Scroll Progress Thread, Parallax & Marquee Velocity Boost
    // ==========================================================================
    const progressBar = document.querySelector('.scroll-progress-bar');
    const parallaxContainers = document.querySelectorAll('.curtain-reveal');
    const marqueeTracks = document.querySelectorAll('.marquee-track');
    let lastScrollY = window.scrollY;
    let marqueeResetTimer;
    let cachedMaxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    let cachedViewportHeight = window.innerHeight;

    const updateScrollMetrics = () => {
        cachedViewportHeight = window.innerHeight;
        cachedMaxScroll = Math.max(document.documentElement.scrollHeight - cachedViewportHeight, 0);
    };
    window.addEventListener('resize', updateScrollMetrics, { passive: true });
    window.addEventListener('load', updateScrollMetrics, { once: true });

    // Cache Web Animations for marquee tracks once instead of querying on every scroll tick
    let cachedMarqueeAnims = [];
    if (marqueeTracks.length > 0 && typeof Element.prototype.getAnimations === 'function') {
        marqueeTracks.forEach((track) => {
            cachedMarqueeAnims.push(...track.getAnimations());
        });
    }

    let scrollFramePending = false;
    let pendingScrollY = window.scrollY;

    const applyVisualScroll = (scrollY) => {
        // 1. Update Top Gold Scroll Progress Bar
        if (progressBar) {
            const ratio = cachedMaxScroll > 0 ? Math.min(Math.max(scrollY / cachedMaxScroll, 0), 1) : 0;
            progressBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
        }

        if (prefersReducedMotion) return;

        // 2. Subtle Vertical Parallax on Curtain-Reveal Images (desktop only)
        if (isFinePointer && parallaxContainers.length > 0) {
            const viewportHalf = cachedViewportHeight / 2;
            parallaxContainers.forEach((container) => {
                const rect = container.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < cachedViewportHeight) {
                    const centerOffset = (rect.top + rect.height / 2 - viewportHalf) / viewportHalf;
                    const shiftY = (centerOffset * -12).toFixed(1);
                    container.style.setProperty('--parallax-y', `${shiftY}px`);
                }
            });
        }

        // 3. Marquee Scroll-Velocity Boost
        if (cachedMarqueeAnims.length > 0) {
            const delta = Math.abs(scrollY - lastScrollY);
            lastScrollY = scrollY;
            const boost = Math.min(1 + delta * 0.08, 3.2);
            for (let i = 0; i < cachedMarqueeAnims.length; i++) {
                cachedMarqueeAnims[i].playbackRate = boost;
            }
            clearTimeout(marqueeResetTimer);
            marqueeResetTimer = setTimeout(() => {
                for (let i = 0; i < cachedMarqueeAnims.length; i++) {
                    cachedMarqueeAnims[i].playbackRate = 1;
                }
            }, 150);
        }
    };

    const handleVisualScroll = (scrollY) => {
        pendingScrollY = scrollY;
        if (!scrollFramePending) {
            scrollFramePending = true;
            window.requestAnimationFrame(() => {
                applyVisualScroll(pendingScrollY);
                scrollFramePending = false;
            });
        }
    };

    if (lenis) {
        lenis.on('scroll', (e) => {
            handleVisualScroll(e.scroll);
        });
    } else {
        window.addEventListener('scroll', () => {
            handleVisualScroll(window.scrollY);
        }, { passive: true });
    }
    applyVisualScroll(window.scrollY);
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
