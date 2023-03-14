const express = require("express");
const router = express.Router();
const fs = require("fs");
const gm = require("gray-matter");
const markdownIt = require("markdown-it");

// Define a markdown parser with default options
const md = markdownIt();


function getArticleByFileName(fileName) {
  // Read the file and extract front matter and content
  const fileContent = fs.readFileSync(`./articles/${fileName}.md`, "utf-8");
  const { data, content } = gm(fileContent);

  // Parse the markdown content to HTML
  const htmlContent = md.render(content);

  // Get the file creation and modification dates
  const fileStats = fs.statSync(`./articles/${fileName}.md`);
  const creationDate = fileStats.birthtime;
  const modificationDate = fileStats.mtime;

  // Create the article object
  const article = {
    title: data.title,
    slug: data.slug,
    summary: data.description,
    tags: data.Keywords,
    name: data.name,
    datePublished: creationDate.toUTCString(),
    modificationDate: modificationDate.toUTCString(),
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

    // Add the article object to the articles array
    articles.push({
      title: data.title,
      slug: data.slug,
      summary: data.description,
      tags: data.Keywords,
      name: data.name,
      datePublished: creationDate.toUTCString(),
      modificationDate: modificationDate.toUTCString(),
      comments:[],
      htmlContent,
    });
  });

  return articles;
}


// GET /articles - display all articles
router.get("/", (req, res) => {
  const articles = getArticles();
  res.render("articles/index", { articles, user: ""  });
});

// GET /articles/:slug - display a specific article
router.get("/:FileName", (req, res) => {
  const article = getArticleByFileName(req.params.FileName);

  if (!article) {
    return res.status(404).send("Article not found");
  }

  res.render("articles/show", { article:article, user: "" });
});


router.get("/", (req, res) => {
  const articles = getArticles();
  console.log(articles);
  res.render("articles/index", { title: "Articles" ,articles, user: ""  });
});

module.exports = {
  articlesRouter: router,
  getArticles: getArticles,
};