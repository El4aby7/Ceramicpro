document.addEventListener('DOMContentLoaded', () => {
    // Theme toggler
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const themeIcon = document.getElementById('theme-icon'); // from index
    const html = document.documentElement;

    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');

    function updateThemeIcons(isDark) {
        if (isDark) {
            if(themeIconLight) themeIconLight.classList.remove('hidden');
            if(themeIconDark) themeIconDark.classList.add('hidden');
            if(themeIcon) themeIcon.innerText = 'light_mode';
            if(mobileThemeIcon) mobileThemeIcon.innerText = 'light_mode';
        } else {
            if(themeIconLight) themeIconLight.classList.add('hidden');
            if(themeIconDark) themeIconDark.classList.remove('hidden');
            if(themeIcon) themeIcon.innerText = 'dark_mode';
            if(mobileThemeIcon) mobileThemeIcon.innerText = 'dark_mode';
        }
    }

    if (themeToggleBtn || mobileThemeToggleBtn) {
        // Check local storage or system preference
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        updateThemeIcons(isDark);

        const toggleTheme = () => {
            html.classList.toggle('dark');
            const newIsDark = html.classList.contains('dark');
            localStorage.theme = newIsDark ? 'dark' : 'light';
            updateThemeIcons(newIsDark);
        };

        if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
        if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuBtn && mobileMenu && mobileMenuOverlay && mobileMenuClose) {
        function openMobileMenu() {
            mobileMenuOverlay.classList.remove('hidden');
            // small delay to allow display:block to apply before changing opacity
            setTimeout(() => {
                mobileMenuOverlay.classList.remove('opacity-0');
            }, 10);
            mobileMenu.classList.remove('translate-x-full');
        }

        function closeMobileMenu() {
            mobileMenuOverlay.classList.add('opacity-0');
            mobileMenu.classList.add('translate-x-full');
            // wait for transition to finish
            setTimeout(() => {
                mobileMenuOverlay.classList.add('hidden');
            }, 300);
        }

        mobileMenuBtn.addEventListener('click', openMobileMenu);
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);

        // Close menu when a link inside it is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
});