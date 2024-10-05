document.addEventListener("DOMContentLoaded", function () {
  
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      // Get the container to display the quotes
      const quotesContainer = document.getElementById("quotes-container");

      // Shuffle the quotes array
      const shuffledQuotes = data.quotes.sort(() => Math.random() - 0.5);

      
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

        
        if (likedQuotes.includes(quoteText.textContent)) {
          likeIcon.classList.add("liked"); 
        }

        // Append icons to the container
        iconsContainer.appendChild(copyIcon);
        iconsContainer.appendChild(shareIcon);
        iconsContainer.appendChild(voiceIcon);
        iconsContainer.appendChild(likeIcon); 

        // Append elements to the quote block
        quoteBlock.appendChild(quoteText);
        quoteBlock.appendChild(quoteAuthor);
        quoteBlock.appendChild(quoteSource);
        quoteBlock.appendChild(iconsContainer);

        // Append the quote block to the container
        quotesContainer.appendChild(quoteBlock);

        // Copy functionality
        copyIcon.addEventListener("click", function () {
          navigator.clipboard
            .writeText(quoteText.textContent + " " + quoteAuthor.textContent)
            .then(() => {
              // Change the copy icon to a checkmark
              copyIcon.className = "icon fas fa-check";

              // Optional: Revert the icon back to copy after a delay (e.g., 2 seconds)
              setTimeout(() => {
                copyIcon.className = "icon fas fa-copy";
              }, 2000);
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
                text: `${quoteText.textContent} ${quoteAuthor.textContent}\n\nRead more at: ${window.location.href}`, // Combine the quote, author, and URL into one text field
              })
              .then(() => console.log("Quote shared!"))
              .catch((error) => console.log("Error sharing:", error));
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

        
        likeIcon.addEventListener("click", function () {
          if (likeIcon.classList.contains("liked")) {
            likeIcon.classList.remove("liked");
            likedQuotes = likedQuotes.filter((quote) => quote !== quoteText.textContent);
          } else {
            likeIcon.classList.add("liked");
            likedQuotes.push(quoteText.textContent);
          }
          localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching the JSON data:", error);
    });

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
