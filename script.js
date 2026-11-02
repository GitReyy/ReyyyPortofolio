document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. DARK / LIGHT THEME TOGGLE (Sesuai Tema Default Pengguna + Manual)
    // =========================================================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const rootElement = document.documentElement;
    const systemDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

    function updateThemeUI(theme) {
        rootElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            // Jika tema dark, tampilkan ikon matahari (untuk beralih ke light)
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Set ikon awal sesuai atribut yang sudah dipasang di <head>
    const currentTheme = rootElement.getAttribute('data-theme') || (systemDarkMedia.matches ? 'dark' : 'light');
    updateThemeUI(currentTheme);

    // Event klik tombol tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const activeTheme = rootElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        });
    }

    // Ikuti perubahan tema OS pengguna secara real-time jika belum ada override manual
    systemDarkMedia.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newSystemTheme = e.matches ? 'dark' : 'light';
            updateThemeUI(newSystemTheme);
        }
    });

    // =========================================================================
    // 2. TOGGLE HAMBURGER MENU (Mobile)
    // =========================================================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-cta a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Tutup menu saat link diklik di tampilan mobile
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Tutup menu jika pengguna mengklik di luar area menu
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // =========================================================================
    // 3. SISTEM TAB INDEPENDEN PER SECTION
    // =========================================================================
    const sectionsWithTabs = document.querySelectorAll('.section');

    sectionsWithTabs.forEach(section => {
        const tabButtons = section.querySelectorAll('.tab-button');
        const tabContents = section.querySelectorAll('.tab-content');

        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetId = button.getAttribute('data-tab');

                    // Nonaktifkan tab di dalam section ini saja
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));

                    // Aktifkan tab yang dipilih
                    button.classList.add('active');
                    const targetContent = section.querySelector(`#${targetId}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        }
    });

    // =========================================================================
    // 4. HIGHLIGHT MENU AKTIF SAAT SCROLL (Intersection Observer)
    // =========================================================================
    const sections = document.querySelectorAll('main .section');
    const menuLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                menuLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // =========================================================================
    // 5. ACTIVITY CARD OVERLAY INTERACTION (Mobile View)
    // =========================================================================
    const activityCards = document.querySelectorAll('.activity-card');
    activityCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                const isCurrentlyActive = card.classList.contains('active');
                activityCards.forEach(c => c.classList.remove('active'));
                if (!isCurrentlyActive) {
                    card.classList.add('active');
                }
            }
        });
    });

    // Sembunyikan overlay ketika menyentuh di luar area kartu aktivitas
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.activity-card')) {
            activityCards.forEach(card => card.classList.remove('active'));
        }
    });
});