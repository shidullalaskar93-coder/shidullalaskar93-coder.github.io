document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar
    const navbar = document.querySelector('.navbar') || document.querySelector('nav');
    const mobileMenuToggle = document.querySelector('.menu-toggle') || document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Active nav link tracking via IntersectionObserver
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let currentId = entry.target.id;
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${currentId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.2, rootMargin: "-100px 0px -100px 0px" });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 2. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 3. Scroll-Triggered Animations (IntersectionObserver)
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
                entry.target.classList.add('animated', 'is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    animateOnScrollElements.forEach(el => animateObserver.observe(el));

    // Handle elements already in viewport on load
    setTimeout(() => {
        animateOnScrollElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight && !el.classList.contains('animated')) {
                el.classList.add('animated');
                animateObserver.unobserve(el);
            }
        });
    }, 100);

    // 4. Typing Effect for Landing Designations
    const designationsElement = document.querySelector('.landing-designations');
    if (designationsElement) {
        const textToType = "Digital Marketing & Web Development Consultant | MBA Candidate — Marketing & International Business | Founder, MetricFlow Consulting";
        designationsElement.innerHTML = '';
        let charIndex = 0;
        const typingSpeed = 40;

        function typeWriter() {
            if (charIndex < textToType.length) {
                designationsElement.innerHTML = textToType.substring(0, charIndex + 1) + '<span class="cursor"></span>';
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            } else {
                designationsElement.innerHTML = textToType + '<span class="cursor blinking"></span>';
            }
        }
        setTimeout(typeWriter, 500); 
    }

    // 5. & 13. Stat Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (isNaN(target)) return;
            const duration = 2000;
            const startTimestamp = performance.now();
            
            function step(timestamp) {
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeOutProgress * target);
                
                stat.innerText = currentCount + (currentCount >= target ? '+' : '');
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        });
    }

    const achievementsSection = document.getElementById('achievements');
    if (achievementsSection) {
        const statObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateCounters();
            }
        }, { threshold: 0.2 });
        statObserver.observe(achievementsSection);
    } else {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    if (!stat.classList.contains('counted')) {
                        stat.classList.add('counted');
                        const target = parseInt(stat.getAttribute('data-target'));
                        if (isNaN(target)) return;
                        const duration = 2000;
                        const startTimestamp = performance.now();
                        function step(timestamp) {
                            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                            const currentCount = Math.floor(easeOutProgress * target);
                            stat.innerText = currentCount + (currentCount >= target ? '+' : '');
                            if (progress < 1) {
                                requestAnimationFrame(step);
                            }
                        }
                        requestAnimationFrame(step);
                    }
                }
            });
        }, { threshold: 0.1 });
        statNumbers.forEach(stat => statObserver.observe(stat));
    }

    // 6. Skill Bar Animation
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    let skillsAnimated = false;

    function animateSkills() {
        skillBars.forEach(bar => {
            const percent = parseInt(bar.getAttribute('data-percent'));
            if (isNaN(percent)) return;
            
            bar.style.transition = 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            bar.style.width = percent + '%';
            
            const percentText = bar.parentElement.previousElementSibling?.querySelector('.skill-percent');
            if (percentText) {
                const duration = 1200;
                const startTimestamp = performance.now();
                function step(timestamp) {
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                    const currentCount = Math.floor(easeOutProgress * percent);
                    percentText.innerText = currentCount + '%';
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    }
                }
                requestAnimationFrame(step);
            }
        });
    }

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !skillsAnimated) {
                skillsAnimated = true;
                animateSkills();
            }
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    } else {
         const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    if (!bar.classList.contains('animated')) {
                         bar.classList.add('animated');
                         const percent = parseInt(bar.getAttribute('data-percent'));
                         if(!isNaN(percent)) {
                             bar.style.transition = 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
                             bar.style.width = percent + '%';
                         }
                    }
                }
            });
         });
         skillBars.forEach(bar => skillsObserver.observe(bar));
    }


    // 7. Certification Card Interactions
    const certCards = document.querySelectorAll('.cert-card');
    
    certCards.forEach(card => {
        let isHovering = false;
        
        card.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        card.addEventListener('mouseleave', () => {
            isHovering = false;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            card.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transition = 'none';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });

        card.addEventListener('click', () => {
            const pdfLink = card.getAttribute('data-pdf') || card.querySelector('a')?.getAttribute('href');
            if (pdfLink) {
                window.open(pdfLink, '_blank');
            }
        });
    });

    // 8. Contact Form
    const contactForm = document.querySelector('#contact form, .contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (!isValid) return;

            const name = contactForm.querySelector('[name="name"]')?.value || 'Guest';
            const email = contactForm.querySelector('[name="email"]')?.value || '';
            const message = contactForm.querySelector('[name="message"]')?.value || '';
            
            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            
            window.open(`mailto:shidulla.laskar@example.com?subject=${subject}&body=${body}`);

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Message Sent! ✓';
                submitBtn.style.backgroundColor = 'var(--blue-light)';
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    contactForm.reset();
                }, 3000);
            }
        });

        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            if(!input.getAttribute('placeholder')) {
                input.setAttribute('placeholder', ' ');
            }
        });
    }

    // 9. Parallax-lite Effect
    const parallaxShapes = document.querySelectorAll('.parallax-shape');
    if (parallaxShapes.length > 0) {
        let ticking = false;
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    
                    parallaxShapes.forEach(shape => {
                        const speed = parseFloat(shape.getAttribute('data-speed')) || 0.05;
                        const x = (centerX - mouseX) * speed;
                        const y = (centerY - mouseY) * speed;
                        shape.style.transform = `translate(${x}px, ${y}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 10. Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--blue-accent, #3b82f6), var(--red-accent, #f87171));
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 11. Timeline Animation (Experience)
    const timelineSection = document.getElementById('experience');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineSection && timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animated');
                        const dot = item.querySelector('.timeline-dot');
                        if (dot) dot.classList.add('scaled');
                    }, index * 200);
                });
                timelineObserver.unobserve(timelineSection);
            }
        }, { threshold: 0.1 });
        timelineObserver.observe(timelineSection);
    }

    // 12. Section Reveal
    const revealSections = document.querySelectorAll('section');
    const sectionRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const title = section.querySelector('.section-title');
                const subtitle = section.querySelector('.section-subtitle');
                const contentElements = section.querySelectorAll('.section-content > *, .grid-item');
                
                if (title) title.classList.add('revealed');
                if (subtitle) {
                    setTimeout(() => subtitle.classList.add('revealed'), 200);
                }
                
                contentElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, 400 + (index * 150));
                });
                
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.1 });

    revealSections.forEach(section => sectionRevealObserver.observe(section));

    // 14. Image lazy loading enhancement
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });

    // 15. Keyboard navigation support
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            }
        }
    });
});
