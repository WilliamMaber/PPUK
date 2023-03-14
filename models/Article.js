const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const Schema = mongoose.Schema;
// Define the article schema
const articleSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  tags: { type: [String], required: true },
  name: { type: String, required: true },
  datePublished: { type: Date, required: true },
  modificationDate: { type: Date, required: true },
  htmlContent: { type: String, required: true },
});

// Define the Article model
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
