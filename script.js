document.addEventListener("DOMContentLoaded", function () {
  fetchQuotes();

  // 'Back to top' button functionality
  const backToTopButton = document.getElementById("back-to-top");
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Show the 'back to top' button when the user scrolls down
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });
});

const fetchQuotes = () => {
  fetch("data.json")
    .then((response) => {
      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const tags = new Set();
      // Shuffle the quotes
      const shuffledQuotes = data.sort(() => Math.random() - 0.5);

      // Collect unique tags
      shuffledQuotes.forEach((quote) => {
        if (quote.tags) {
          quote.tags.forEach((tag) => tags.add(tag.toLowerCase())); // Normalize tags to lowercase
        }
      });

      const select = document.getElementById("tags");

      // Add the "All" option first
      const allOption = document.createElement('option');
      allOption.value = "all";
      allOption.textContent = "All";
      select.appendChild(allOption);

      // Populate the select dropdown with unique tags, capitalizing the first letter and sorting them
      Array.from(tags)
        .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)) // Capitalize the first letter
        .sort() // Sort tags alphabetically
        .forEach((val) => {
          const option = document.createElement('option');
          option.value = val.toLowerCase(); // Set value to lowercase to maintain consistency
          option.textContent = val;
          select.appendChild(option);
        });

      select.onchange = (e) => {
        const tag = e.target.value;
        
        // If "All" is selected, render all quotes
        if (tag === "all") {
          renderQuotes(shuffledQuotes);
        } else {
          // Filter the quotes by the selected tag
          const newQuotes = shuffledQuotes.filter((quote) => 
            quote.tags && quote.tags.includes(tag.toLowerCase()) // Ensure tags exist
          );
          renderQuotes(newQuotes);
        }
      };

      // Initially render all shuffled quotes
      renderQuotes(shuffledQuotes);
    })
    .catch((error) => {
      console.error("Error fetching the JSON data:", error);
    });
};

const renderQuotes = (shuffledQuotes) => {
  const quotesContainer = document.getElementById("quotes-container");
  quotesContainer.innerHTML = ""; // Clear previous quotes

  let likedQuotes = JSON.parse(localStorage.getItem("likedQuotes")) || [];

  // Iterate over the shuffled quotes
  shuffledQuotes.forEach((quoteData) => {
    // Create a div for each quote block
    const quoteBlock = document.createElement("div");
    quoteBlock.className = "quote-block";

    // Add the quote text
    const quoteText = document.createElement("p");
    quoteText.className = "quote-text";
    quoteText.textContent = quoteData.quote || quoteData.text; // Handle both "quote" and "text" keys

    // Add the author
    const quoteAuthor = document.createElement("p");
    quoteAuthor.className = "quote-author";
    quoteAuthor.textContent = `— ${quoteData.author}`;

    // Add the source
    const quoteSource = document.createElement("p");
    quoteSource.className = "quote-source";
    quoteSource.textContent = `Source: ${quoteData.source}`;

    // Create a container for icons
    const iconsContainer = document.createElement("div");
    iconsContainer.className = "icons-container";

    // Create a container for icon buttons
    const iconsWrapper = document.createElement("div");
    iconsWrapper.className = "icons-wrapper";

    // Create a container for quote title and ellipse icon
    const cardTop = document.createElement("div");
    cardTop.className = "card-top";

    // Create a container for source and like icon
    const cardBottom = document.createElement("div");
    cardBottom.className = "card-bottom";

    // Add copy, share, voice, like, and save image icons
    const icons = {
      copy: document.createElement("i"),
      share: document.createElement("i"),
      voice: document.createElement("i"),
      like: document.createElement("i"),
      saveImage: document.createElement("i"),
      ellipsis: document.createElement("i")
    };

    icons.copy.className = "icon fas fa-copy"; // FontAwesome copy icon
    icons.share.className = "icon fas fa-share"; // FontAwesome share icon
    icons.voice.className = "icon fas fa-volume-up"; // FontAwesome voice icon
    icons.like.className = "icon fas fa-heart";
    icons.saveImage.className = "icon fas fa-image";
    icons.saveImage.title = "Save as Image";
    icons.ellipsis.className = "toggle-icon fa-solid fa-ellipsis-vertical";

    if (likedQuotes.includes(quoteText.textContent)) {
      icons.like.classList.add("liked");
    }

    // Append icons to the container
    Object.values(icons).forEach(icon => iconsContainer.appendChild(icon));
    iconsWrapper.appendChild(icons.copy);
    iconsWrapper.appendChild(icons.share);
    iconsWrapper.appendChild(icons.voice);
    iconsWrapper.appendChild(icons.saveImage);
    iconsContainer.appendChild(iconsWrapper);

    // Append like icon and source text to card bottom
    cardBottom.appendChild(quoteSource);
    cardBottom.appendChild(icons.like);

    cardTop.appendChild(quoteText);
    cardTop.appendChild(icons.ellipsis);

    // Append elements to the quote block
    quoteBlock.appendChild(cardTop);
    quoteBlock.appendChild(iconsContainer);
    quoteBlock.appendChild(quoteAuthor);
    quoteBlock.appendChild(cardBottom);

    // Append the quote block to the container
    quotesContainer.appendChild(quoteBlock);

    // Toggle functionality
    icons.ellipsis.addEventListener("click", () => {
      iconsContainer.classList.toggle("show"); // Toggle visibility of icons
    });

    // Copy functionality
    icons.copy.addEventListener("click", function () {
      navigator.clipboard
        .writeText(`${quoteText.textContent} ${quoteAuthor.textContent}`)
        .then(() => {
          // Change the copy icon to a checkmark
          icons.copy.className = "icon fas fa-check";

          // Optional: Revert the icon back to copy after a delay (e.g., 10 seconds)
          setTimeout(() => {
            icons.copy.className = "icon fas fa-copy";
            iconsContainer.classList.toggle("show");
          }, 10000);
        })
        .catch((err) => {
          iconsContainer.classList.toggle("show");
          console.error("Error copying text: ", err);
        });
    });

    // Share functionality
    icons.share.addEventListener("click", function () {
      if (navigator.share) {
        navigator
          .share({
            title: "Quote",
            text: `${quoteText.textContent} — ${quoteAuthor.textContent}\n\nRead more at: ${window.location.href}`,
          })
          .then(() => {
            iconsContainer.classList.toggle("show");
            console.log("Quote shared!");
          })
          .catch((error) => {
            iconsContainer.classList.toggle("show");
            console.error("Error sharing:", error);
          });
      } else {
        alert("Sharing is not supported in this browser.");
      }
    });

    // Voice functionality
    icons.voice.addEventListener("click", function () {
      const utterance = new SpeechSynthesisUtterance(
        `${quoteText.textContent} by ${quoteAuthor.textContent}`
      );
      speechSynthesis.speak(utterance);
      iconsContainer.classList.toggle("show");
    });

    // Like functionality
    icons.like.addEventListener("click", function () {
      if (icons.like.classList.contains("liked")) {
        icons.like.classList.remove("liked");
        likedQuotes = likedQuotes.filter(quote => quote !== quoteText.textContent);
      } else {
        icons.like.classList.add("liked");
        likedQuotes.push(quoteText.textContent);
      }
      localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
    });

    // Save image functionality
    icons.saveImage.addEventListener("click", function () {
      saveQuoteAsImage(quoteBlock);
    });
  });
};

// Function to save the quote as an image
const saveQuoteAsImage = (quoteElement) => {
  const quoteText = quoteElement.querySelector('.quote-text').textContent;
  const authorText = quoteElement.querySelector('.quote-author').textContent;
  const sourceText = quoteElement.querySelector('.quote-source').textContent;

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = "#fff"; // Background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "#000"; // Text color
  ctx.fillText(quoteText, 20, 60);
  ctx.fillText(authorText, 20, 100);
  ctx.fillText(sourceText, 20, 140);
  
  // Convert canvas to image
  canvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quote.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, 'image/png');
};

