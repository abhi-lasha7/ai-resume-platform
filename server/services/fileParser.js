const mammoth = require('mammoth');
const PDFParser = require('pdf2json');

const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', (errData) => {
      reject(new Error(errData.parserError));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      let text = '';
      pdfData.Pages.forEach(page => {
        page.Texts.forEach(t => {
          text += decodeURIComponent(t.R[0].T) + ' ';
        });
        text += '\n';
      });
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
};

const extractText = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    return await extractTextFromPDF(buffer);
  }
  
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error('Unsupported file type. Please upload PDF or DOCX.');
};

module.exports = { extractText };