const fs = require('fs');
const pdfParse = require('pdf-parse');
async function test() {
  try {
    const buffer = fs.readFileSync('package.json'); // not a pdf, let's create a real pdf test
  } catch (e) {
    console.error(e);
  }
}
test();
