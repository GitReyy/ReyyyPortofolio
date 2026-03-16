document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. Mobile Menu Toggle =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Tutup menu saat link diklik (di versi mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // ===== 2. Active Navigation Link on Scroll =====
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('.section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Deteksi section lebih awal (offset 200px)
            if (window.pageYOffset >= sectionTop - 200) {
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

    // ===== 3. Tab Functionality =====
    // Fungsi universal untuk menangani tab di section manapun
    function setupTabs(sectionId) {
        const section = document.querySelector(sectionId);
        if (!section) return;

        const tabButtons = section.querySelectorAll('.tab-button');
        const tabContents = section.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Hapus class active dari semua button & content di dalam section ini
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Tambahkan class active ke button yg diklik & content targetnya
                button.classList.add('active');
                const targetId = button.getAttribute('data-tab');
                const targetContent = section.querySelector('#' + targetId);
                
                if (targetContent) {
                    targetContent.classList.add('active');
                    
                    // Trigger ulang animasi progress bar jika membuka tab skills
                    if (sectionId === '#skills') {
                        triggerProgressAnimation(targetContent);
                    }
                }
            });
        });
    }

    setupTabs('#education');
    setupTabs('#skills');


    // ===== 4. Progress Bar Animation Setup =====
    // Simpan lebar awal progress bar dari inline HTML ke dataset, lalu set jadi 0
    document.querySelectorAll('.progress').forEach(bar => {
        bar.dataset.width = bar.style.width || '0%';
        bar.style.width = '0%';
    });

    // Fungsi untuk menjalankan animasi progress bar
    function triggerProgressAnimation(container) {
        container.querySelectorAll('.progress').forEach(bar => {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = bar.dataset.width;
            }, 100);
        });
    }


    // ===== 5. Intersection Observer untuk Animasi Scroll =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Munculkan elemen (Fade In Up)
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                
                // Jika elemen tersebut adalah skill-category, jalankan animasi bar
                if (entry.target.classList.contains('skill-category')) {
                    triggerProgressAnimation(entry.target);
                }
            }
        });
    }, observerOptions);

    // Pantau elemen-elemen ini saat di-scroll
    document.querySelectorAll('.timeline-item, .skill-category, .certificate-item').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });


    // ===== 6. Activity Gallery Desktop Hover Effect =====
    const activityGallery = document.querySelector('.activity-gallery');
    const activityCards = document.querySelectorAll('.activity-card');

    if (activityGallery) {
        let isGalleryHovered = false;

        activityGallery.addEventListener('mouseenter', () => {
            // Matikan efek JS ini jika di HP (Karna HP pakai layout tumpang-tindih CSS)
            if (window.innerWidth <= 480) return; 

            isGalleryHovered = true;
            activityCards.forEach((card, index) => {
                // Index 0 dan 1 miring ke kiri, index 2 dan 3 miring ke kanan
                if (index === 0 || index === 1) {
                    card.style.transform = 'translateY(-10px) rotateZ(-5deg) scale(0.98)';
                } else {
                    card.style.transform = 'translateY(-10px) rotateZ(5deg) scale(0.98)';
                }
            });
        });

        activityGallery.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 480) return;
            
            isGalleryHovered = false;
            activityCards.forEach(card => {
                card.style.transform = '';
            });
        });

        // Efek angkat foto saat dihover spesifik satu foto (Desktop Only)
        activityCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (window.innerWidth > 480) {
                    card.style.transform = 'translateY(-15px) scale(1.05)';
                    card.style.zIndex = '10';
                    card.style.boxShadow = '0 20px 50px rgba(26, 115, 232, 0.3)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (window.innerWidth > 480) {
                    card.style.zIndex = '1';
                    card.style.boxShadow = '';
                    // Kembalikan ke rotasi galeri jika galeri masih di-hover
                    if (isGalleryHovered) {
                        const index = Array.from(activityCards).indexOf(card);
                        if (index === 0 || index === 1) {
                            card.style.transform = 'translateY(-10px) rotateZ(-5deg) scale(0.98)';
                        } else {
                            card.style.transform = 'translateY(-10px) rotateZ(5deg) scale(0.98)';
                        }
                    } else {
                        card.style.transform = '';
                    }
                }
            });
        });
    }

    // ===== 7. Smooth Scroll untuk Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                // Sesuaikan posisi scroll agar tidak tertutup header container (offset 80px)
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== 8. Scroll to Top Button =====
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
        background: linear-gradient(135deg, #1A73E8, #0088FF);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(26, 115, 232, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
    `;

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Console Message =====
    console.log('%c👋 Selamat datang di Portofolio Rayhan Hibatullah!', 'font-size: 18px; color: #1A73E8; font-weight: bold;');
    console.log('%cMenganalisis sistem, menulis kode, dan menghadirkan solusi digital. 🚀', 'font-size: 14px; color: #5F6368;');

});