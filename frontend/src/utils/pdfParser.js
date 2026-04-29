// Client-side PDF text extraction
// Uses a simple approach: read PDF as text and extract content between stream/endstream

export async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        // Try to extract text from PDF structure
        const extracted = extractTextFromPDFContent(text);
        resolve(extracted);
      } catch (err) {
        // Fallback: try to get any readable text
        const text = e.target.result;
        const cleanText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        resolve(cleanText.slice(0, 50000)); // Limit to 50k chars
      }
    };

    reader.onerror = () => reject(new Error('Failed to read PDF file'));

    // Read as text first to try extraction
    reader.readAsText(file);
  });
}

function extractTextFromPDFContent(content) {
  let text = '';

  // Extract text between BT (Begin Text) and ET (End Text) operators
  const btRegex = /BT\s*(.*?)\s*ET/gs;
  let match;
  while ((match = btRegex.exec(content)) !== null) {
    const block = match[1];
    // Extract Tj and TJ operators which contain text
    const tjMatches = block.match(/\(([^)]*)\)\s*Tj|\[\s*(.*?)\s*\]\s*TJ/gs);
    if (tjMatches) {
      for (const tm of tjMatches) {
        const extract = tm.match(/\(([^)]*)\)/g);
        if (extract) {
          for (const e of extract) {
            text += e.slice(1, -1) + ' ';
          }
        }
      }
    }
  }

  // Also try extracting from stream objects
  const streamRegex = /stream\s*\r?\n([\s\S]*?)\r?\n\s*endstream/gs;
  while ((match = streamRegex.exec(content)) !== null) {
    const stream = match[1];
    // Look for text in streams
    const textMatches = stream.match(/\(([^)]{3,})\)/g);
    if (textMatches) {
      for (const tm of textMatches) {
        text += tm.slice(1, -1) + ' ';
      }
    }
  }

  // Extract from docx-like content (if it was mislabeled)
  const paraRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
  while ((match = paraRegex.exec(content)) !== null) {
    text += match[1] + ' ';
  }

  // Clean up the extracted text
  text = text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\s+/g, ' ')
    .trim();

  // If we got very little text, try a broader extraction
  if (text.length < 100) {
    // Extract any readable ASCII sequences
    const asciiRegex = /[A-Za-z][A-Za-z\s.,;:!?&@#$/()%-]+[A-Za-z.]/g;
    const matches = content.match(asciiRegex);
    if (matches) {
      text = matches.join(' ').replace(/\s+/g, ' ').trim();
    }
  }

  return text.slice(0, 50000);
}

export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    return extractTextFromPDF(file);
  }

  if (ext === 'docx' || ext === 'doc') {
    // For docx/doc, read as text and try to extract content
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        // Try XML extraction for docx
        const paragraphs = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
        if (paragraphs) {
          const extracted = paragraphs.map(p => p.replace(/<[^>]+>/g, '')).join('\n');
          resolve(extracted.slice(0, 50000));
        } else {
          // Fallback: just return readable text
          const clean = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          resolve(clean.slice(0, 50000));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Plain text files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result.slice(0, 50000));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
