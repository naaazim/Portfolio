// Fonction pour fermer le pop-up de confirmation
function fermer(){
    var div = document.getElementById("popUp");
    div.style.display = "none";
}

// Gestion du changement de thème (dark / light)
const toggleButton = document.getElementById('themeToggle');
const icon = document.getElementById('iconTheme');

let darkMode = true; // par défaut on commence en dark mode avec la lune

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    darkMode = !darkMode;

    // Changer le background
    document.body.style.backgroundColor = darkMode ? "#000" : "#fff";

    // Changer l'icône
    icon.innerHTML = darkMode
        ? `<path stroke-linecap="round" stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 
            0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25 
            C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />` // lune
        : `<path stroke-linecap="round" stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591
            M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3
            m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 
            3.75 3.75 0 0 1 7.5 0Z" />`; // soleil
});


// Gestion du menu hamburger fluide
const hamburger = document.querySelector('.hamburger');

// Quand on clique, on toggle la classe .open (gérée dans le CSS)
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
});
hamburger.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
});
