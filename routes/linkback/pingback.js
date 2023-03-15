const express = require("express");
const router = express.Router();
const Pingback = require("../../models/Pingback.js");

router.post("/", (req, res) => {
  // Check if the request is a Pingback request
  if (req.headers["content-type"] === "application/xml" && req.body) {
    const requestBody = req.body.toString();

    // Parse the Pingback request XML
    parsePingbackXML(requestBody)
      .then(({ sourceUrl, targetUrl }) => {
        // Receive the Pingback and send a success or error message in response
        Pingback.receivePingback(sourceUrl, targetUrl)
          .then((message) => {
            res
              .status(200)
              .set("Content-Type", "text/xml")
              .send(getPingbackResponseXML(message));
          })
          .catch((error) => {
            console.error(error);
            res
              .status(400)
              .set("Content-Type", "text/plain")
              .send("Bad Request");
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).set("Content-Type", "text/plain").send("Bad Request");
      });
  } else {
    res.status(404).set("Content-Type", "text/plain").send("Not Found");
  }
});

// Function to parse the Pingback request XML
function parsePingbackXML(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const params = result.methodCall.params[0].param;
        const sourceUrl = params[0].value[0];
        const targetUrl = params[1].value[0];
        resolve({ sourceUrl, targetUrl });
      }
    });
  });
}

// Function to generate the Pingback response XML
function getPingbackResponseXML(message) {
  return `<?xml version="1.0"?>
          <methodResponse>
            <params>
              <param>
                <value><string>${message}</string></value>
              </param>
            </params>
          </methodResponse>
        `;
}

module.exports = router;
