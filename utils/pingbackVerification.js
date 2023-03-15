const fetch = require("node-fetch");

async function pingbackVerification(sourceUrl, targetUrl) {
  // Fetch the source URL to check if it contains a link to the target URL
  const response = await fetch(sourceUrl);
  const html = await response.text();
  if (!html.includes(targetUrl)) {
    throw new Error("The source URL does not contain a link to the target URL");
  }
}

module.exports = pingbackVerification;
