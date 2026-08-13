export function cleanJobDescription(description) {
  if (!description) {
    return "";
  }

  let text = String(description);

  // Convert common HTML elements into readable spacing
  text = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ");

  // Remove remaining HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Decode common HTML entities & remove extra symbols like ~
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/~/g, " "); // <-- Yeh line Jooble ke tilde symbols ko clean space mein badal degi

  // Clean whitespace
// Clean whitespace and handle keyword-heavy snippets
  text = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();

  // Agar description mein bohot sari technologies/skills aik sath comma ya space se separated hain, toh unhe readable banayein
  if (text.length > 0 && !text.includes(".") && text.length < 250) {
    text = `Required Skills & Technologies: ${text}`;
  }

  return text;
  return text;
}