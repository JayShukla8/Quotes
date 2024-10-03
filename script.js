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

        const likeIcon = document.createElement('i');
        likeIcon.className = 'fa-regular fa-heart like-button'; // Unliked heart icon

        let isLiked = false;
        let count = 0;

        likeIcon.addEventListener('click', function () {
          isLiked = !isLiked;
          if (isLiked) {
            count++;
            likeIcon.className = 'fa-solid fa-heart like-button'; 
          } else {
            count--;
            likeIcon.className = 'fa-regular fa-heart like-button'; 
          } 
          console.log(isLiked ? 'Quote liked!' : 'Quote unliked!');
        });

        quoteBlock.appendChild(quoteText);
        quoteBlock.appendChild(quoteAuthor);
        quoteBlock.appendChild(quoteSource);
        quoteBlock.appendChild(likeIcon); 

        quotesContainer.appendChild(quoteBlock);

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
