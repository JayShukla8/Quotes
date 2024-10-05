document.addEventListener("DOMContentLoaded", function () {
  let bubblesEnabled = false;

  const bubbleToggleButton = document.getElementById("bubble-toggle-button");
  bubbleToggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="lightblue" opacity="10"/>
                    <circle cx="8" cy="8" r="4" fill="white" opacity="10"/>
                </svg>`;

  function createBubble() {
      if (!bubblesEnabled) return;

      const bubble = document.createElement('div');
      bubble.className = 'bubble';

      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.top = `${window.scrollY + Math.random() * window.innerHeight}px`;

      const size = Math.random() * 40 + 10;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      document.body.appendChild(bubble);

      setTimeout(() => {
          bubble.remove();
      }, 4000);
  }

  let bubbleInterval = setInterval(createBubble, 300);

  window.addEventListener('scroll', () => {
      if (bubblesEnabled) {
          createBubble();
      }
  });

  bubbleToggleButton.addEventListener("click", function () {
      bubblesEnabled = !bubblesEnabled;

      if (bubblesEnabled) {
          bubbleInterval = setInterval(createBubble, 300);
          this.innerHTML = '<span style="font-size: 23px;border: none; margin: 0; padding: 0px">🚫</span>';
      } else {
          clearInterval(bubbleInterval);
          this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="lightblue" opacity="10"/>
                    <circle cx="8" cy="8" r="4" fill="white" opacity="10"/>
                </svg>`;
      }
  });
});
