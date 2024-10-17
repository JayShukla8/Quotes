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
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const tags = new Set();
      const shuffledQuotes = data.sort(() => Math.random() - 0.5);

      // Extract unique tags from quotes
      shuffledQuotes.forEach(quote => {
        quote.tags.forEach(tag => tags.add(tag));
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
            quote.tags.includes(tag.toLowerCase()) // Match case-insensitively
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
  quotesContainer.innerHTML = ""; // Clear existing quotes

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
    iconsContainer.style.width = "100%";
    iconsContainer.className = "icons-container";

    // Create a container for icon wrappers
    const iconsWrapper = document.createElement("div");
    iconsWrapper.className = "icons-wrapper";

    // Create a container for quote title and ellipsis icon
    const cardTop = document.createElement("div");
    cardTop.className = "card-top";

    // Create a container for source and like icon
    const cardBottom = document.createElement("div");
    cardBottom.className = "card-bottom";

    // Add icons
    const copyIcon = createIcon("fas fa-copy", "Copy");
    const shareIcon = createIcon("fas fa-share", "Share");
    const voiceIcon = createIcon("fas fa-volume-up", "Voice");
    const likeIcon = createIcon("fas fa-heart", "Like");
    const ellipsisIcon = createIcon("fa-solid fa-ellipsis-vertical", "Toggle Icons");
    const saveImageIcon = createIcon("fas fa-image", "Save as Image");

    if (likedQuotes.includes(quoteText.textContent)) {
      likeIcon.classList.add("liked");
    }

    // Append icons to the container
    iconsContainer.appendChild(iconsWrapper);
    iconsWrapper.appendChild(copyIcon);
    iconsWrapper.appendChild(shareIcon);
    iconsWrapper.appendChild(voiceIcon);
    iconsWrapper.appendChild(saveImageIcon);
    iconsContainer.appendChild(iconsWrapper);

    // Append like icon and source text to card bottom
    cardBottom.appendChild(quoteSource);
    cardBottom.appendChild(likeIcon);

    cardTop.appendChild(quoteText);
    cardTop.appendChild(ellipsisIcon);

    // Append elements to the quote block
    quoteBlock.appendChild(cardTop);
    quoteBlock.appendChild(iconsContainer);
    quoteBlock.appendChild(quoteAuthor);
    quoteBlock.appendChild(cardBottom);

    // Append the quote block to the container
    quotesContainer.appendChild(quoteBlock);

    // Toggle functionality
    ellipsisIcon.addEventListener("click", () => {
      iconsContainer.classList.toggle("icons-visible"); // Change class for better control
    });

    // Copy functionality
    copyIcon.addEventListener("click", function () {
      navigator.clipboard
        .writeText(`${quoteText.textContent} ${quoteAuthor.textContent}`)
        .then(() => {
          // Change the copy icon to a checkmark
          copyIcon.className = "icon fas fa-check";

          // Revert the icon back to copy after a delay (e.g., 10 seconds)
          setTimeout(() => {
            copyIcon.className = "icon fas fa-copy";
            iconsContainer.classList.remove("icons-visible"); // Hide icons again
          }, 10000);
        })
        .catch((err) => {
          console.log("Error copying text: ", err);
        });
    });

    // Share functionality
    shareIcon.addEventListener("click", function () {
      if (navigator.share) {
        navigator
          .share({
            title: "Quote", // Title for the shared content
            text: `${quoteText.textContent} ${quoteAuthor.textContent}\n\nRead more at: ${window.location.href}`,
          })
          .then(() => {
            console.log("Quote shared!");
          })
          .catch((error) => {
            console.log("Error sharing:", error);
          });
      } else {
        alert("Sharing is not supported in this browser.");
      }
    });

    // Voice functionality
    voiceIcon.addEventListener("click", function () {
      const utterance = new SpeechSynthesisUtterance(
        `${quoteText.textContent} by ${quoteAuthor.textContent}`
      );
      speechSynthesis.speak(utterance);
    });

    // Like functionality
    likeIcon.addEventListener("click", function () {
      if (likeIcon.classList.contains("liked")) {
        likeIcon.classList.remove("liked");
        likedQuotes = likedQuotes.filter(
          (quote) => quote !== quoteText.textContent
        );
      } else {
        likeIcon.classList.add("liked");
        likedQuotes.push(quoteText.textContent);
      }
      localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
    });

    // Save as image functionality
    saveImageIcon.addEventListener("click", function () {
      saveQuoteAsImage(quoteBlock);
    });
  });
};

const createIcon = (iconClass, title) => {
  const icon = document.createElement("i");
  icon.className = `icon ${iconClass}`;
  icon.title = title;
  return icon;
};

const saveQuoteAsImage = (quoteBlock) => {
  html2canvas(quoteBlock).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'quote.png';
    link.click();
  });
};

