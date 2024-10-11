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
    .then((response) => response.json())
    .then((data) => {
      // Get the container to display the quotes

      const tags = new Set();

      // Shuffle the quotes array
      const shuffledQuotes = data.sort((a) => {
        tags.add(...a.tags);
        return Math.random() - 0.5
      });


      const select = document.getElementById("tags");

      Array.from(tags).forEach((val) => {
        const option = document.createElement('option');
        option.value = val;
        option.textContent = val;
        select.appendChild(option)
      })

      select.onchange = (e) => {
        const tag =  e.target.value;
        const newquotes = shuffledQuotes.filter((quote) => {
          return quote.tags.some((v) => v === tag)
        })
        renderQuotes(newquotes)
      }

      renderQuotes(shuffledQuotes)

    })
    .catch((error) => {
      console.error("Error fetching the JSON data:", error);
    });
}

const renderQuotes = (shuffledQuotes) => {
  const quotesContainer = document.getElementById("quotes-container");
  quotesContainer.innerHTML = ""

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
    // iconsContainer.style.position = "relative";
    iconsContainer.className = "icons-container";

    const iconsWrapper = document.createElement("div");
    iconsWrapper.className = "icons-wrapper";

    // Create a container for quote title and ellipse icon
    const cardTop = document.createElement("div");
    cardTop.className = "card-top";

    // Create a container for source and like icon
    const cardBottom = document.createElement("div");
    cardBottom.className = "card-bottom";

    // Add copy icon
    const copyIcon = document.createElement("i");
    copyIcon.className = "icon fas fa-copy"; // FontAwesome copy icon

    // Add share icon
    const shareIcon = document.createElement("i");
    shareIcon.className = "icon fas fa-share"; // FontAwesome share icon

    // Add voice icon
    const voiceIcon = document.createElement("i");
    voiceIcon.className = "icon fas fa-volume-up"; // FontAwesome voice icon

    const likeIcon = document.createElement("i");
    likeIcon.className = "icon fas fa-heart";

    // Add ellipse icon
    const ellipsisIcon = document.createElement("i");
    ellipsisIcon.className = "toggle-icon fa-solid fa-ellipsis-vertical";

    const saveImageIcon = document.createElement("i");
    saveImageIcon.className = "icon fas fa-image";
    saveImageIcon.title = "Save as Image";


    if (likedQuotes.includes(quoteText.textContent)) {
      likeIcon.classList.add("liked");
    }

    // Append icons to the container
    iconsContainer.appendChild(copyIcon);
    iconsContainer.appendChild(shareIcon);
    iconsContainer.appendChild(voiceIcon);
    iconsContainer.appendChild(likeIcon);
    iconsContainer.appendChild(saveImageIcon);
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

    // quoteBlock.appendChild(quoteSource);

    // Append the quote block to the container
    quotesContainer.appendChild(quoteBlock);

    // toggle functionality
    ellipsisIcon.addEventListener("click", () => {
      iconsContainer.classList.toggle("icons-container");
    });

    // Copy functionality
    copyIcon.addEventListener("click", function () {
      navigator.clipboard
        .writeText(quoteText.textContent + " " + quoteAuthor.textContent)
        .then(() => {
          // Change the copy icon to a checkmark
          copyIcon.className = "icon fas fa-check";

          // Optional: Revert the icon back to copy after a delay (e.g., 10 seconds)
          setTimeout(() => {
            copyIcon.className = "icon fas fa-copy";
            iconsContainer.classList.toggle("icons-container");
          }, 10000);
          s
        })
        .catch((err) => {
          iconsContainer.classList.toggle("icons-container");
          console.log("Error copying text: ", err);
        });
    });

    // Share functionality
    shareIcon.addEventListener("click", function () {
      if (navigator.share) {
        navigator
          .share({
            title: "Quote", // Title for the shared content
            text: `${quoteText.textContent} ${quoteAuthor.textContent}\n\nRead more at: ${window.location.href}`, // Combine the quote, author, and URL into one text field
          })
          .then(() => {
            iconsContainer.classList.toggle("icons-container");
            console.log("Quote shared!");
          })
          .catch((error) => {
            iconsContainer.classList.toggle("icons-container");
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
      iconsContainer.classList.toggle("icons-container");
    });

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

    saveImageIcon.addEventListener("click", function () {
      saveQuoteAsImage(quoteBlock);
    });
  });
}