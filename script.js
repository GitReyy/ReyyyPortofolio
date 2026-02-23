// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===== Active Navigation Link on Scroll =====
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== Tab Functionality =====
// Handle tabs per section (Education/Experience section)
const educationSection = document.querySelector('#education');
if (educationSection) {
    const educationTabButtons = educationSection.querySelectorAll('.tab-button');
    const educationTabContents = educationSection.querySelectorAll('.tab-content');
    
    educationTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove active only from education tabs
            educationTabButtons.forEach(btn => btn.classList.remove('active'));
            educationTabContents.forEach(content => content.classList.remove('active'));
            
            // Add active to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const tabContent = educationSection.querySelector('#' + tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// Handle tabs per section (Skills section)
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsTabButtons = skillsSection.querySelectorAll('.tab-button');
    const skillsTabContents = skillsSection.querySelectorAll('.tab-content');
    
    skillsTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove active only from skills tabs
            skillsTabButtons.forEach(btn => btn.classList.remove('active'));
            skillsTabContents.forEach(content => content.classList.remove('active'));
            
            // Add active to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const tabContent = skillsSection.querySelector('#' + tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// ===== Contact Form Handler =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate form
        if (!name || !email || !subject || !message) {
            showNotification('Mohon isi semua field', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Email tidak valid', 'error');
            return;
        }

        // Format message for WhatsApp
        const whatsappMessage = `Halo Rayhan!\n\nNama: ${name}\nEmail: ${email}\nSubjek: ${subject}\n\nPesan:\n${message}`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // WhatsApp number (Indonesia: 62 + number without leading 0)
        const whatsappNumber = '6281230650332';
        
        // WhatsApp URL
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Show success message
        showNotification('Membuka WhatsApp...', 'success');
        
        // Redirect to WhatsApp
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            
            // Log for reference
            console.log({
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date()
            });
            
            // Reset form
            contactForm.reset();
        }, 500);
    });
}

// ===== Activity Gallery Tilt Effect =====
const activityGallery = document.querySelector('.activity-gallery');
const activityCards = document.querySelectorAll('.activity-card');

if (activityGallery) {
    let isGalleryHovered = false;
    let selectedCard = null;

    activityGallery.addEventListener('mouseenter', () => {
        isGalleryHovered = true;
        activityCards.forEach((card, index) => {
            // Skip tilt if a card is selected
            if (selectedCard) return;
            
            // Images 1 and 2 (index 0, 1) tilt left
            if (index === 0 || index === 1) {
                card.style.transform = 'translateY(-10px) rotateZ(-8deg) scale(0.98)';
            }
            // Images 3 and 4 (index 2, 3) tilt right
            else {
                card.style.transform = 'translateY(-10px) rotateZ(8deg) scale(0.98)';
            }
        });
    });

    activityGallery.addEventListener('mouseleave', () => {
        isGalleryHovered = false;
        // Only reset if no card is selected
        if (!selectedCard) {
            activityCards.forEach(card => {
                card.style.transform = '';
            });
        }
    });

    // Click to select/deselect card
    activityCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (selectedCard === card) {
                // Deselect if clicking same card
                selectedCard = null;
                card.classList.remove('selected');
                activityCards.forEach(c => c.classList.remove('blurred'));
                
                // Reset transforms
                activityCards.forEach(c => c.style.transform = '');
            } else {
                // Select new card
                if (selectedCard) {
                    selectedCard.classList.remove('selected');
                }
                selectedCard = card;
                card.classList.add('selected');
                
                // Blur all other cards
                activityCards.forEach(c => {
                    if (c !== card) {
                        c.classList.add('blurred');
                    }
                });
                
                // Clear transforms
                activityCards.forEach(c => c.style.transform = '');
            }
        });

        // Individual card hover effect (lift up when hovering over specific card)
        card.addEventListener('mouseenter', () => {
            if (!selectedCard) {
                card.style.transform = 'translateY(-15px) scale(1.02)';
                card.style.boxShadow = '0 20px 50px rgba(26, 115, 232, 0.3)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!selectedCard) {
                card.style.boxShadow = '';
                
                // Reset to gallery tilt if gallery is being hovered
                if (isGalleryHovered) {
                    if (index === 0 || index === 1) {
                        card.style.transform = 'translateY(-10px) rotateZ(-8deg) scale(0.98)';
                    } else {
                        card.style.transform = 'translateY(-10px) rotateZ(8deg) scale(0.98)';
                    }
                } else {
                    card.style.transform = '';
                }
            }
        });
    });

    // Close selection when clicking outside gallery
    document.addEventListener('click', (e) => {
        if (!activityGallery.contains(e.target) && selectedCard) {
            selectedCard.classList.remove('selected');
            activityCards.forEach(c => c.classList.remove('blurred'));
            selectedCard = null;
        }
    });
}

// ===== Notification Function =====
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        background-color: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.5s ease;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;

    // Add to body
    document.body.appendChild(notification);

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===== Animations on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease forwards';
            // Animate progress bars when skills section is viewed
            if (entry.target.classList.contains('progress')) {
                const width = entry.target.parentElement.parentElement.querySelector('.level');
                if (width) {
                    const targetWidth = entry.target.parentElement.parentElement.querySelector('.level').textContent;
                    entry.target.style.width = targetWidth;
                }
            }
        }
    });
}, observerOptions);

// Observe all stat cards and timeline items
document.querySelectorAll('.stat-card, .timeline-content, .skill-category, .info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});

// ===== Add slideIn and slideOut animations =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== Dark Mode Toggle (Optional) =====
// You can uncomment this section to add dark mode functionality
/*
const darkModeToggle = document.createElement('button');
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
darkModeToggle.className = 'dark-mode-toggle';
darkModeToggle.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
`;

document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});
*/

// ===== Scroll to Top Button =====
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #219EBC, #8ECAE6);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(33, 158, 188, 0.3);
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
`;

document.body.appendChild(scrollToTopBtn);

// Show scroll to top button when scrolling down
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll to top button
scrollToTopBtn.addEventListener('mouseover', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseout', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.animation = 'slideDown 0.6s ease';
    }
});

// ===== Intersection Observer for Scroll Animations =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger animation for skill categories when they come into view
            if (entry.target.classList.contains('skill-category')) {
                entry.target.classList.add('animate');
            }
            // Trigger animation for skill items and progress bars
            if (entry.target.classList.contains('skill-item')) {
                entry.target.classList.add('animate');
                
                // Animate progress bar to its target width
                const progressBar = entry.target.querySelector('.progress');
                if (progressBar && !progressBar.classList.contains('animated')) {
                    const targetWidth = entry.target.querySelector('.skill-header .level')?.textContent || '0%';
                    // Use setTimeout to ensure the animation triggers after initial render
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                        progressBar.classList.add('animated');
                    }, 10);
                }
            }
        }
    });
}, observerOptions);

// Observe all skill categories and items
document.querySelectorAll('.skill-category').forEach((element, index) => {
    element.style.setProperty('--delay', `${index * 0.15}s`);
    skillObserver.observe(element);
});

document.querySelectorAll('.skill-item').forEach((element, index) => {
    element.style.setProperty('--delay', `${(index % 6) * 0.1}s`);
    // Remove initial inline width to prepare for animation
    const progressBar = element.querySelector('.progress');
    if (progressBar && progressBar.style.width) {
        progressBar.dataset.targetWidth = progressBar.style.width;
        progressBar.style.width = '0';
    }
    skillObserver.observe(element);
});

// ===== Re-trigger animations on tab switch for skills section =====
if (skillsSection) {
    const hardSkillsTab = skillsSection.querySelector('#hard-skills');
    const softSkillsTab = skillsSection.querySelector('#soft-skills');
    
    [hardSkillsTab, softSkillsTab].forEach(tabContent => {
        if (!tabContent) return;
        
        const observer = new MutationObserver(() => {
            if (tabContent.classList.contains('active')) {
                // Reset and re-trigger animations for visible items
                setTimeout(() => {
                    tabContent.querySelectorAll('.skill-item').forEach((item) => {
                        item.classList.remove('animate');
                        const progressBar = item.querySelector('.progress');
                        if (progressBar) {
                            progressBar.classList.remove('animated');
                            progressBar.style.width = '0%';
                        }
                        
                        // Trigger reflow and re-add class
                        void item.offsetWidth;
                        item.classList.add('animate');
                        
                        if (progressBar) {
                            const targetWidth = item.querySelector('.skill-header .level')?.textContent || '0%';
                            setTimeout(() => {
                                progressBar.style.width = targetWidth;
                                progressBar.classList.add('animated');
                            }, 10);
                        }
                    });
                    
                    tabContent.querySelectorAll('.skill-category').forEach((category) => {
                        category.classList.remove('animate');
                        void category.offsetWidth;
                        category.classList.add('animate');
                    });
                }, 50);
            }
        });
        
        observer.observe(tabContent, { attributes: true, attributeFilter: ['class'] });
    });
}

// Add slideDown animation
const loadStyle = document.createElement('style');
loadStyle.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(loadStyle);

// ===== Console Message =====
console.log('%c👋 Selamat datang di Portofolio Rayhan!', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cTerbuka untuk peluang baru dan kolaborasi! 🚀', 'font-size: 16px; color: #764ba2;');
