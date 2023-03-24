const express = require("express");
const postcode = require("postcode");
const router = express.Router();

router.get("/:postcode", async (req, res) => {
  const postcodeStr = req.params.postcode.replace(/\s+/g, "").toUpperCase();

  try {
    const postcodeInfo = await postcode.lookup(postcodeStr);
    if (!postcodeInfo) {
      return res.status(404).json({ error: "Postcode not found" });
    }

    // Extract address fields from postcodeInfo
    const {
      line_1,
      line_2,
      line_3,
      post_town,
      county,
      postcode: fullPostcode,
    } = postcodeInfo;

    // Return address fields as JSON response
    res.json({
      line1: line_1,
      line2: line_2,
      line3: line_3,
      city: post_town,
      county,
      postcode: fullPostcode,
      country: "United Kingdom",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
