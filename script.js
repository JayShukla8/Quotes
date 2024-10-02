  document.addEventListener("DOMContentLoaded", function () {
    // Fetch the data from data.json
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        // Get the container to display the quotes
        const quotesContainer = document.getElementById('quotes-container');

        // Shuffle the quotes array
        const shuffledQuotes = data.quotes.sort(() => Math.random() - 0.5);

        // Iterate over the shuffled quotes
        shuffledQuotes.forEach(quoteData => {
          // Create a div for each quote block
          const quoteBlock = document.createElement('div');
          quoteBlock.className = 'quote-block';

          // Add the quote text
          const quoteText = document.createElement('p');
          quoteText.className = 'quote-text';
          quoteText.textContent = quoteData.quote || quoteData.text; // Handle both "quote" and "text" keys

          // Add the author
          const quoteAuthor = document.createElement('p');
          quoteAuthor.className = 'quote-author';
          quoteAuthor.textContent = `— ${quoteData.author}`;

          // Add the source
          const quoteSource = document.createElement('p');
          quoteSource.className = 'quote-source';
          quoteSource.textContent = `Source: ${quoteData.source}`;

          // Append the elements to the quote block
          quoteBlock.appendChild(quoteText);
          quoteBlock.appendChild(quoteAuthor);
          quoteBlock.appendChild(quoteSource);

          // Append the quote block to the container
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
