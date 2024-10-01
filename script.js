let allQuotes = [];
let currentIndex = 0;
const quotesPerLoad = 10;
let isLoading = false;

document.addEventListener("DOMContentLoaded", function () {
  // Fetch the data from data.json
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      allQuotes = data.quotes.sort(() => Math.random() - 0.5);
      loadMoreQuotes();
      
      // Add scroll event listener
      window.addEventListener('scroll', handleScroll);
    })
    .catch(error => {
      console.error('Error fetching the JSON data:', error);
    });
});

function loadMoreQuotes() {
  if (isLoading || currentIndex >= allQuotes.length) return;

  isLoading = true;
  const quotesContainer = document.getElementById('quotes-container');
  const fragment = document.createDocumentFragment();

  const endIndex = Math.min(currentIndex + quotesPerLoad, allQuotes.length);
  
  for (let i = currentIndex; i < endIndex; i++) {
    const quoteBlock = createQuoteBlock(allQuotes[i]);
    fragment.appendChild(quoteBlock);

    quoteBlock.addEventListener('click', function (event) {
      if (!event.target.classList.contains('star')) {
        navigator.clipboard.writeText(allQuotes[i].quote)
          .then(() => console.log("Quote copied to clipboard!"))
          .catch(err => console.log('Error copying text: ', err));
      }
    });
  }

  quotesContainer.appendChild(fragment);
  currentIndex = endIndex;
  isLoading = false;

  // Check if we need to load more quotes immediately
  if (currentIndex < allQuotes.length && !isScrolledToBottom()) {
    loadMoreQuotes();
  }

  // Add or update "Load More" button
  updateLoadMoreButton();
}

function handleScroll() {
  if (isScrolledToBottom()) {
    loadMoreQuotes();
  }
}

function isScrolledToBottom() {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
}

function createQuoteBlock(quote) {
  const quoteBlock = document.createElement('div');
  quoteBlock.classList.add('quote-block');

  const quoteText = document.createElement('p');
  quoteText.classList.add('quote-text');
  quoteText.textContent = quote.quote;

  const quoteAuthor = document.createElement('p');
  quoteAuthor.classList.add('quote-author');
  quoteAuthor.textContent = `- ${quote.author}`;

  const quoteSource = document.createElement('p');
  quoteSource.classList.add('quote-source');
  quoteSource.textContent = quote.source;

  const ratingContainer = document.createElement('div');
  ratingContainer.classList.add('quote-rating');

  // Generate a unique ID for the quote
  const quoteId = generateQuoteId(quote);

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.innerHTML = '&#9733;'; // Unicode star character
    star.dataset.value = i;
    star.dataset.quoteId = quoteId;
    ratingContainer.appendChild(star);
  }

  quoteBlock.appendChild(quoteText);
  quoteBlock.appendChild(quoteAuthor);
  quoteBlock.appendChild(quoteSource);
  quoteBlock.appendChild(ratingContainer);

  ratingContainer.addEventListener('click', handleRating);

  // Load and display saved rating
  const savedRating = localStorage.getItem(quoteId);
  if (savedRating) {
    updateStarRating(ratingContainer, savedRating);
  }

  return quoteBlock;
}

function handleRating(event) {
  if (!event.target.classList.contains('star')) return;

  const stars = event.target.parentElement.children;
  const selectedValue = event.target.dataset.value;
  const quoteId = event.target.dataset.quoteId;

  updateStarRating(event.target.parentElement, selectedValue);

  // Save rating to localStorage
  localStorage.setItem(quoteId, selectedValue);

  console.log(`Quote rated: ${selectedValue} stars`);
}

function updateStarRating(ratingContainer, rating) {
  const stars = ratingContainer.children;
  for (let i = 0; i < stars.length; i++) {
    if (i < rating) {
      stars[i].classList.add('active');
    } else {
      stars[i].classList.remove('active');
    }
  }
}

function generateQuoteId(quote) {
  // Create a unique ID based on the quote content
  return btoa(quote.quote.substring(0, 50)).replace(/[^a-zA-Z0-9]/g, '');
}

function updateLoadMoreButton() {
  let loadMoreButton = document.getElementById('load-more-button');
  
  if (!loadMoreButton) {
    loadMoreButton = document.createElement('button');
    loadMoreButton.id = 'load-more-button';
    loadMoreButton.textContent = 'Load More';
    loadMoreButton.style.display = 'block';
    loadMoreButton.style.margin = '20px auto';
    loadMoreButton.style.padding = '10px 20px';
    loadMoreButton.style.fontSize = '16px';
    loadMoreButton.style.cursor = 'pointer';
    document.body.appendChild(loadMoreButton);

    loadMoreButton.addEventListener('click', loadMoreQuotes);
  }

  // Hide the button if all quotes are loaded
  if (currentIndex >= allQuotes.length) {
    loadMoreButton.style.display = 'none';
  } else {
    loadMoreButton.style.display = 'block';
  }
}
