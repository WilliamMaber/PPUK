const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define a route for handling incoming Webmention requests
app.post('/webmention', async (req, res) => {
  // Validate the request by checking that the source and target parameters are present
  if (!req.body.source || !req.body.target) {
    return res.status(400).send('Bad Request');
  }

  // Fetch the target URL to discover its Webmention endpoint
  const response = await fetch(req.body.target);
  const webmentionEndpoint = getWebmentionEndpoint(response);

  // If a Webmention endpoint was found, forward the Webmention request to the endpoint
  if (webmentionEndpoint) {
    const webmentionResponse = await fetch(webmentionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        source: req.body.source,
        target: req.body.target,
      }).toString(),
    });

    // Return the response from the Webmention endpoint to the sender
    res.status(webmentionResponse.status).send(webmentionResponse.statusText);
  } else {
    // If no Webmention endpoint was found, return a 404 Not Found response
    res.status(404).send('Webmention endpoint not found');
  }
});

// Function to extract the Webmention endpoint from an HTTP response
async function  getWebmentionEndpoint(response) {
  const linkHeader = response.headers.get('Link');
  if (linkHeader) {
    const links = linkHeader.split(',');
    const webmentionLink = links.find(link => link.includes('rel="webmention"'));
    if (webmentionLink) {
      return webmentionLink.split(';')[0].trim().slice(1, -1);
    }
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const webmentionLink = doc.querySelector('link[rel="webmention"]');
  if (webmentionLink) {
    return webmentionLink.getAttribute('href');
  }

  const webmentionAnchor = doc.querySelector('a[rel="webmention"]');
  if (webmentionAnchor) {
    return webmentionAnchor.getAttribute('href');
  }

  return null;
}

// Start the HTTP server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Webmention router listening on port ${port}`));
