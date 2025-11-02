function fermer() {
        document.getElementById("popUp").style.display = "none";
    }

    // Gestion du thème
    const toggleButton = document.getElementById('themeToggle');
    const icon = document.getElementById('iconTheme');
    const container = document.querySelector('.container');
    let darkMode = localStorage.getItem('theme') !== 'light';

    if (!darkMode) document.body.classList.add('light-mode');

    function majTheme() {
        if (document.body.classList.contains('light-mode')) {
            container.style.setProperty('--color', '#E1E1E1');
            container.style.backgroundColor = '#F3F3F3';
        } else {
            container.style.setProperty('--color', '#1e1e1e');
            container.style.backgroundColor = '#0c0c0c';
        }
    }
    majTheme();

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        majTheme();
    });

    // Menu hamburger
    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });