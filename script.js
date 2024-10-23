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

let quotesData = [];
let currentPage = 1;
const quotesPerPage = 15; // Adjust this to change the number of quotes per page

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

      // Populate the select dropdown with unique tags
      Array.from(tags)
        .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)) // Capitalize the first letter
        .sort() // Sort tags alphabetically
        .forEach((val) => {
          const option = document.createElement('option');
          option.value = val.toLowerCase(); // Set value to lowercase to maintain consistency
          option.textContent = val;
          select.appendChild(option);
        });

      // Onchange event to filter quotes
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

      // Store the shuffled quotes in the global variable
      quotesData = shuffledQuotes;
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

  const totalQuotes = shuffledQuotes.length;
  const totalPages = Math.ceil(totalQuotes / quotesPerPage);

  // Calculate the quotes to display for the current page
  const startIndex = (currentPage - 1) * quotesPerPage;
  const endIndex = Math.min(startIndex + quotesPerPage, totalQuotes);
  const currentQuotes = shuffledQuotes.slice(startIndex, endIndex);

  let likedQuotes = JSON.parse(localStorage.getItem("likedQuotes")) || [];

  // Iterate over the shuffled quotes
  currentQuotes.forEach((quoteData) => {
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
    const copyIcon = document.createElement("i");
    copyIcon.className = "icon fas fa-copy"; // FontAwesome copy icon

    const shareIcon = document.createElement("i");
    shareIcon.className = "icon fas fa-share"; // FontAwesome share icon

    const voiceIcon = document.createElement("i");
    voiceIcon.className = "icon fas fa-volume-up"; // FontAwesome voice icon

    const likeIcon = document.createElement("i");
    likeIcon.className = "icon fas fa-heart";

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
      iconsContainer.classList.toggle("icons-container");
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
            iconsContainer.classList.toggle("icons-container");
          }, 10000);
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
            text: `${quoteText.textContent} ${quoteAuthor.textContent}\n\nRead more at: ${window.location.href}`,
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
      iconsContainer.classList.toggle("icons-container");
    });

    // Save as image functionality
    saveImageIcon.addEventListener("click", function () {
      html2canvas(quoteBlock).then(function (canvas) {
        const link = document.createElement("a");
        link.download = "quote.png";
        link.href = canvas.toDataURL();
        link.click();
        iconsContainer.classList.toggle("icons-container");
      });
    });
  });

  // if (totalPages > 1) {
    createPagination(totalPages);
  // } else {
  //   // Optionally clear the pagination if there's only one page
  //   document.getElementById("pagination").innerHTML = "";
  // }
  
};

const createPagination = (totalPages) => {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Clear existing pagination

  // Create pagination buttons
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = "pagination-button";

    // Add active class to the current page button
    if (i === currentPage) {
      button.classList.add("active");
    }

    // Add click event to each button
    button.addEventListener("click", () => {
      currentPage = i; // Update current page
      renderQuotes(quotesData); // Render quotes for the current page
    });

    paginationContainer.appendChild(button);
  }

  // Add Previous button functionality
  const prevButton = document.getElementById("prev-button");
  prevButton.style.display = currentPage === 1 ? "none" : "inline-block";
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderQuotes(quotesData);
    }
  };

  // Add Next button functionality
  const nextButton = document.getElementById("next-button");
  nextButton.style.display = currentPage === totalPages ? "none" : "inline-block";
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderQuotes(quotesData);
    }
  };
};

