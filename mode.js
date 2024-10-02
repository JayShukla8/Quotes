// Select the mode button and icon elements
const modeButton = document.getElementById('mode-button');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// Get the current mode from local storage
const currentMode = localStorage.getItem('mode');

// Apply the saved mode on page load
if (currentMode) {
    document.body.classList.toggle('dark', currentMode === 'dark');
    sunIcon.style.display = currentMode === 'dark' ? 'inline' : 'none';
    moonIcon.style.display = currentMode === 'dark' ? 'none' : 'inline';
}

// Add event listener to the mode button
modeButton.addEventListener('click', () => {
    // Toggle the dark class on the body
    document.body.classList.toggle('dark');
    
    // Check current mode and update icons and local storage accordingly
    if (document.body.classList.contains('dark')) {
        sunIcon.style.display = 'inline';
        moonIcon.style.display = 'none';
        localStorage.setItem('mode', 'dark');
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline';
        localStorage.setItem('mode', 'light');
    }
});
