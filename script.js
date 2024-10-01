document.addEventListener("DOMContentLoaded", function () {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const quotesContainer = document.getElementById('quotes-container');
      const shuffledQuotes = data.quotes.sort(() => Math.random() - 0.5);

      shuffledQuotes.forEach(quoteData => {
        const quoteBlock = document.createElement('div');
        quoteBlock.className = 'quote-block';

        const quoteText = document.createElement('p');
        quoteText.className = 'quote-text';
        quoteText.textContent = quoteData.quote || quoteData.text;

        const quoteAuthor = document.createElement('p');
        quoteAuthor.className = 'quote-author';
        quoteAuthor.textContent = `— ${quoteData.author}`;

        const quoteSource = document.createElement('p');
        quoteSource.className = 'quote-source';
        quoteSource.textContent = `Source: ${quoteData.source}`;

        // Create star rating element
        const starRating = document.createElement('div');
        starRating.className = 'star-rating';

        // Create 5 stars
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('span');
          star.className = 'star';
          star.dataset.rating = i;
          star.innerHTML = '★';
          star.addEventListener('click', function () {
            setRating(starRating, i);
          });
          starRating.appendChild(star);
        }

        // Append elements to the quote block
        quoteBlock.appendChild(quoteText);
        quoteBlock.appendChild(quoteAuthor);
        quoteBlock.appendChild(quoteSource);
        quoteBlock.appendChild(starRating);

        quotesContainer.appendChild(quoteBlock);

        // Copy quote on click
        quoteBlock.addEventListener('click', function () {
          navigator.clipboard.writeText(quoteText.textContent)
            .then(() => {
              console.log("Quote copied to clipboard!");
            })
            .catch(err => {
              console.log('Error copying text: ', err);
            });
        });
      });
    })
    .catch(error => {
      console.error('Error fetching the JSON data:', error);
    });
});

// Function to set rating
function setRating(starRating, rating) {
  const stars = starRating.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('rated');
    } else {
      star.classList.remove('rated');
    }
  });
}
