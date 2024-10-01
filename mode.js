const modeButton = document.getElementById('mode-button');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

const currentMode = localStorage.getItem('mode');

if (currentMode) {
  document.body.classList.toggle('dark', currentMode === 'dark');
  sunIcon.style.display = currentMode === 'dark' ? 'inline' : 'none';
  moonIcon.style.display = currentMode === 'dark' ? 'none' : 'inline';
}

modeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  
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
