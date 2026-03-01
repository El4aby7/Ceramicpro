document.addEventListener('DOMContentLoaded', () => {
    // Theme toggler
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const themeIcon = document.getElementById('theme-icon'); // from index
    const html = document.documentElement;

    if (themeToggleBtn) {
        // Check local storage or system preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
            if(themeIconLight) themeIconLight.classList.remove('hidden');
            if(themeIconDark) themeIconDark.classList.add('hidden');
            if(themeIcon) themeIcon.innerText = 'light_mode';
        } else {
            html.classList.remove('dark');
            if(themeIconLight) themeIconLight.classList.add('hidden');
            if(themeIconDark) themeIconDark.classList.remove('hidden');
            if(themeIcon) themeIcon.innerText = 'dark_mode';
        }

        themeToggleBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            if (html.classList.contains('dark')) {
                localStorage.theme = 'dark';
                if(themeIconLight) themeIconLight.classList.remove('hidden');
                if(themeIconDark) themeIconDark.classList.add('hidden');
                if(themeIcon) themeIcon.innerText = 'light_mode';
            } else {
                localStorage.theme = 'light';
                if(themeIconLight) themeIconLight.classList.add('hidden');
                if(themeIconDark) themeIconDark.classList.remove('hidden');
                if(themeIcon) themeIcon.innerText = 'dark_mode';
            }
        });
    }
});