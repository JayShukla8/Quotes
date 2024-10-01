
document.addEventListener("DOMContentLoaded", function () {
    // Function to create a bubble element
    function createBubble() {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Set random horizontal position across the full width of the page
      bubble.style.left = `${Math.random() * 100}vw`;
  
      // Set initial position randomly across the full height of the viewport, including scrolling
      bubble.style.top = `${window.scrollY + Math.random() * window.innerHeight}px`;
  
      // Randomly set the size of the bubble
      const size = Math.random() * 40 + 10; // Between 5px and 15px
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
  
      // Append bubble to the body
      document.body.appendChild(bubble);
  
      // Animate the bubble upwards and remove it after a while
      setTimeout(() => {
        bubble.remove();
      }, 4000); // Remove bubble after 5 seconds
    }
  
    // Generate bubbles every 500 milliseconds
    setInterval(createBubble, 300);
  
    // Ensure bubbles are created even when scrolling
    window.addEventListener('scroll', () => {
      createBubble();
    });
  });
  