const RSS = require("rss");
// const Atom = require("atom-generator");
const express = require("express");
 const { articlesRouter, getArticles } = require("./articles.js");

const router = express.Router();

router.get("/articles.json", (req, res) => {
  const articles = getArticles();
  res.json({
    version: "https://jsonfeed.org/version/1",
    title: "My Website",
    home_page_url: "https://mywebsite.com",
    feed_url: "https://mywebsite.com/articles.json",
    items: articles.map((article) => ({
      id: article.slug,
      title: article.title,
      url: `https://mywebsite.com/articles/${article.slug}`,
      content_html: article.html,
      summary: article.description,
      date_published: article.date.toISOString(),
    })),
  });
});


// router.get("/articles.atom", (req, res) => {
//   const articles = getArticles();

//   const feed = new Atom({
//     title: "My Website",
//     subtitle: "The latest articles from My Website",
//     feed_id: "https://mywebsite.com/articles.atom",
//     feed_links: {
//       self: "https://mywebsite.com/articles.atom",
//     },
//   });

//   articles.forEach((article) => {
//     feed.add({
//       id: `https://mywebsite.com/articles/${article.slug}`,
//       title: article.title,
//       author: {
//         name: "John Doe",
//       },
//       link: `https://mywebsite.com/articles/${article.slug}`,
//       content: article.html,
//       summary: article.description,
//       updated: article.date,
//     });
//   });

//   res.set("Content-Type", "application/atom+xml");
//   res.send(feed.render());
// });


router.get("/articles.rss", (req, res) => {
  const articles = getArticles();

  const feed = new RSS({
    title: "My Website",
    feed_url: "https://mywebsite.com/articles.rss",
    site_url: "https://mywebsite.com",
  });

  articles.forEach((article) => {
    feed.item({
      title: article.title,
      description: article.description,
      url: `https://mywebsite.com/articles/${article.slug}`,
      date: article.date,
    });
  });

  res.set("Content-Type", "application/rss+xml");
  res.send(feed.xml());
});

module.exports = router;