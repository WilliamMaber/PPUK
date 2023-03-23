const express = require("express");
const xmlbuilder = require("xmlbuilder");
const { Firestore } = require("@google-cloud/firestore");
const firestore = new Firestore();
const trackbackRouter = express.Router();

// Trackback endpoint handler
trackbackRouter.post("/:id", async (req, res) => {
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

  // Save the Trackback to the database
  try {
    const trackbackRef = firestore.collection("trackbacks").doc();
    await trackbackRef.set({
      title,
      url,
      excerpt,
      blog_name,
      post_id: id,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error(err);
    const errorResponse = xmlbuilder
      .create("response")
      .ele("error", "1")
      .up()
      .ele("message", "Error saving Trackback")
      .end();
    res.status(500).send(errorResponse);
    return;
  }

  // Process the Trackback ping and send a success response
  const successResponse = xmlbuilder.create("response").ele("error", "0").end();
  res.send(successResponse);
});

module.exports = trackbackRouter;
