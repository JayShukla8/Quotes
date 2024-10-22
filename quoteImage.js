function saveQuoteAsImage(quoteElement) {
    const quoteText = quoteElement.querySelector('.quote-text').textContent;
    const authorText = quoteElement.querySelector('.quote-author').textContent;
    const sourceText = quoteElement.querySelector('.quote-source').textContent;

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, document.body.classList.contains('dark') ? '#1a1a4b' : '#ffe6e6');
    gradient.addColorStop(1, document.body.classList.contains('dark') ? '#4b0082' : '#e6f7ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '24px "Merriweather", serif';
    ctx.fillStyle = document.body.classList.contains('dark') ? '#e3cdb3' : '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = wrapText(ctx, quoteText, canvas.width * 0.8);

    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, (canvas.height / 2) - ((lines.length - 1) * 15) + (index * 30));
    });

    ctx.font = 'italic 18px "Merriweather", serif';
    ctx.fillText(authorText, canvas.width / 2, canvas.height - 80);

    // Draw source
    ctx.font = '14px "Merriweather", serif';
    ctx.fillText(sourceText, canvas.width / 2, canvas.height - 50);

    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = 'quote.png';
    link.click();
}

function wrapText(context, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}