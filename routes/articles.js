const express = require("express");
const router = express.Router();
const fs = require("fs");
const gm = require("gray-matter");
const markdownIt = require("markdown-it");
const {
  router_sitemap,
  add_page,
  page_remove,
  update_sitemap,
} = require("./sitemap.js");

// Define a markdown parser with default options
const md = markdownIt();


function getArticleByFileName(fileName) {
  // Read the file and extract front matter and content
  const fileContent = fs.readFileSync(`./articles/${fileName}.md`, "utf-8");
  const { data, content } = gm(fileContent);

  // Parse the markdown content to HTML
  const htmlContent = md.render(content);

  // Get the file creation and modification dates
  const creationDate = Date(data.publishData);

  // Create the article object
  const article = {
    imageUrl: data.imageUrl,
    imageAlt: data.imageAlt,
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    tags: data.Keywords,
    name: data.name,
    datePublished: creationDate,
    comments: [],
    htmlContent,
  };

  return article;
}



// Function to get all articles
function getArticles() {
  const files = fs.readdirSync("./articles");
  const articles = [];

  files.forEach((filename) => {
    // Read the file and extract front matter and content
    const fileContent = fs.readFileSync(`./articles/${filename}`, "utf-8");
    const { data, content } = gm(fileContent);

    // Parse the markdown content to HTML
    const htmlContent = md.render(content);

    // Get the file creation and modification dates
    const fileStats = fs.statSync(`./articles/${filename}`);
    const creationDate = fileStats.birthtime;
    const modificationDate = fileStats.mtime;
    let filename_ = filename.slice(0,filename.length-3);
    // Add the article object to the articles array
    articles.push({
      imageUrl: data.imageUrl,
      imageAlt: data.imageAlt,
      title: data.title,
      filename: filename_,
      slug: data.slug,
      summary: data.summary,
      tags: data.Keywords,
      name: data.name,
      datePublished: new Date(data.publishData),
      // modificationDate: modificationDate.toUTCString(),
      comments: [],
      htmlContent,
    });
  });
  articles.sort((a, b) => b.datePublished - a.datePublished);
  return articles;
}


// GET /articles - display all articles with pagination
router.get("/", (req, res) => {
  // Set default page size and current page
  const pageSize = 5;
  let page = req.query.page ? parseInt(req.query.page) : 1;

  // Get all articles
  const allArticles = getArticles();

  // Calculate start and end indexes for the current page
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Get the articles for the current page
  const articles = allArticles.slice(startIndex, endIndex);

  // Render the articles/index template with the articles and pagination data
  res.render("articles/index", {
    articles,
    user: req.user,
    pageSize,
    page,
    totalPages: Math.ceil(allArticles.length / pageSize),
    hasNextPage: endIndex < allArticles.length,
    hasPrevPage: page > 1,
    nextPage: page + 1,
    prevPage: page - 1,
  });
});

// GET /articles/:slug - display a specific article
router.get("/:FileName", (req, res) => {
  const article = getArticleByFileName(req.params.FileName);

  if (!article) {
    return res.status(404).send("Article not found");
  }

  res.render("articles/show", { article: article, user: req.user });
});

let watcher = fs.watch("./articles/");
watcher.on('change', function name(event, filename) {
  let url_path = "./articles/" + filename.slice(0, filename.length - 3);
  switch (event) {
    case "rename":
      page_remove(url_path);
      getArticles();
      break;
    case "change":
      getArticles();
      break;
    default:
      getArticles();
  }
});
      getArticles();

module.exports = {
  articlesRouter: router,
  getArticles: getArticles,
};