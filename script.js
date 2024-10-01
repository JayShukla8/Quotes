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

  const quoteId = generateQuoteId(quote);

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.innerHTML = '&#9733;';
    star.dataset.value = i;
    star.dataset.quoteId = quoteId;
    ratingContainer.appendChild(star);
  }

  // Replace the share icon creation in the createQuoteBlock function with this:
  const shareIcon = document.createElement('span');
  shareIcon.classList.add('share-icon');
  shareIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  `;
  shareIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent quote copy
    shareQuote(quote);
  });

  quoteBlock.appendChild(quoteText);
  quoteBlock.appendChild(quoteAuthor);
  quoteBlock.appendChild(quoteSource);
  quoteBlock.appendChild(ratingContainer);
  quoteBlock.appendChild(shareIcon);

  ratingContainer.addEventListener('click', handleRating);

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

function shareQuote(quote) {
  const shareText = `"${quote.quote}" - ${quote.author}\nSource: ${quote.source}`;
  const shareUrl = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: 'Share this quote',
      text: shareText,
      url: shareUrl,
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
  } else {
    // Fallback for browsers that don't support Web Share API
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    const shareOptions = [
      { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
      { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}` },
      { name: 'LinkedIn', url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=Quote&summary=${encodedText}` },
      { name: 'Email', url: `mailto:?subject=Check out this quote&body=${encodedText}%0A%0A${encodedUrl}` }
    ];

    const shareMenu = document.createElement('div');
    shareMenu.style.position = 'fixed';
    shareMenu.style.top = '50%';
    shareMenu.style.left = '50%';
    shareMenu.style.transform = 'translate(-50%, -50%)';
    shareMenu.style.background = '#fff';
    shareMenu.style.padding = '20px';
    shareMenu.style.borderRadius = '10px';
    shareMenu.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

    shareOptions.forEach(option => {
      const button = document.createElement('button');
      button.textContent = `Share on ${option.name}`;
      button.style.display = 'block';
      button.style.width = '100%';
      button.style.padding = '10px';
      button.style.margin = '5px 0';
      button.style.cursor = 'pointer';
      button.onclick = () => {
        window.open(option.url, '_blank');
        document.body.removeChild(shareMenu);
      };
      shareMenu.appendChild(button);
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.display = 'block';
    closeButton.style.width = '100%';
    closeButton.style.padding = '10px';
    closeButton.style.margin = '5px 0';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(shareMenu);
    shareMenu.appendChild(closeButton);

    document.body.appendChild(shareMenu);
  }
}
