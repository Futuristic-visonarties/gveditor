export const getLengthOfContentExcludingTags = (htmlString) => {
  // Create a DOMParser
  const parser = new DOMParser();

  // Parse the HTML string into a DOM object
  const dom = parser.parseFromString(htmlString, "text/html");

  // Get the text content of the parsed DOM
  const textContent = dom.body.textContent;

  // Calculate the length of the text content
  const contentLength = textContent.length;

  return contentLength;
};
