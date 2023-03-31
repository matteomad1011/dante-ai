const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function generateMediaImage(quote) {
  // Set up canvas dimensions and context
  const canvas = createCanvas(1080, 1080);
  const context = canvas.getContext('2d');

  // Fill canvas with black background
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Set up quote styling
  context.fillStyle = 'white';
  context.font = 'bold 48px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Calculate quote positioning and wrap text if necessary
  const margin = 100;
  const quoteWidth = canvas.width - margin * 2;
  const quoteLines = [];
  const words = quote.split(' ');
  let currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = context.measureText(`${currentLine} ${word}`).width;
    if (width < quoteWidth) {
      currentLine += ` ${word}`;
    } else {
      quoteLines.push(currentLine);
      currentLine = word;
    }
  }
  quoteLines.push(currentLine);
  const quoteHeight = quoteLines.length * 60;
  const quoteY = canvas.height / 2 - quoteHeight / 2;

  // Draw quote on canvas
  for (let i = 0; i < quoteLines.length; i++) {
    const line = quoteLines[i];
    const x = canvas.width / 2;
    const y = quoteY + i * 60;
    context.fillText(line, x, y);
  }

  // Convert canvas to image buffer
  const mediaImageBuffer = canvas.toBuffer('image/jpeg');

  return mediaImageBuffer;
}

function saveJpegFile(buffer, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const run = async () => {
	const args = process.argv.slice(2);
	const name = args[1];
  	const mediaImageBuffer = await generateMediaImage(name ? name : 'This is a test quote');
	await saveJpegFile(mediaImageBuffer, 'test.jpg');
}

run()
