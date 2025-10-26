/**
 * Creates and triggers a download of a text file with the given filename and content.
 * @param {string} filename The name of the file to be downloaded
 * @param {string} content The content of the file to be downloaded
 */
export function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
