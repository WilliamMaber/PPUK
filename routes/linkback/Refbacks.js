app.get("/refback", (req, res) => {
  const referrer = req.headers.referer;
  // Save the referrer to your database or do something else with it
  console.log("Referrer:", referrer);
  res.sendStatus(200);
});
