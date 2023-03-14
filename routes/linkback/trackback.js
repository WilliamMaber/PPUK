const express = require("express");
const bodyParser = require("body-parser");
const xmlbuilder = require("xmlbuilder");
const app = express();

// Trackback endpoint handler
app.post("/trackback/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, excerpt, blog_name } = req.body;

  // Check for required parameters
  if (!url) {
    const errorResponse = xmlbuilder
      .create("response")
      .ele("error", "1")
      .up()
      .ele("message", "Missing url parameter")
      .end();
    res.status(400).send(errorResponse);
    return;
  }

  // Process the Trackback ping and send a success response
  const successResponse = xmlbuilder.create("response").ele("error", "0").end();
  res.send(successResponse);
});
