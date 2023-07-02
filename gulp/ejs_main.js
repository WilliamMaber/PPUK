// Purpose: This code is responsible for generating HTML pages from EJS and Markdown files. It performs several tasks:
// 1. Sets up a file loader function to allow EJS to load files from the file system.
// 2. Defines the generateArticleHtmlList function, which generates a list of articles and creates separate HTML pages for each page of articles.
// 3. Defines the generateArticleHtmlPages function, which generates individual HTML pages for each article.
// 4. Defines the generatePaths_user function, which generates HTML pages for user-specific paths.
// 5. Defines the generatePaths_page function, which generates HTML pages for non-user-specific paths.
// The intention of this code is to automate the process of generating HTML pages from EJS and Markdown files, allowing for dynamic content generation and rendering based on templates and data.

const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");
const ejs = require("gulp-ejs");
const ejsCompiler = require("ejs");
const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const each = require("gulp-each");
const rename = require("gulp-rename");
const ARTICLES_PER_PAGE = 5;

// a fix that that will allow ejs to load files from the file system
let myFileLoader = function (filePath) {
  let data = fs.readFileSync(filePath);
  return data;
};
ejsCompiler.fileLoader = myFileLoader;

// make a list of all the articles make it into a it own html page

function generateArticleHtmlList(cb) {
  try {
    fs.mkdirSync("./temp/");
  } catch {}
  try {
    fs.mkdirSync("./temp/articles");
  } catch {}
  let md = new MarkdownIt();
  const ARTICLES_PER_PAGE = 5;
  let articles_path = path.join(__dirname, "../", "./src/articles");
  const articleFilenames = fs.readdirSync(articles_path);
  const indexArticlePath = path.join(
    __dirname,
    "../src/views/articles/index.ejs"
  );
  const indexArticleContent = fs.readFileSync(indexArticlePath, "utf-8");
  const articleDataList = [];
  articleFilenames.forEach((filename) => {
    let p = path.join(__dirname, `../src/articles/${filename}`);
    const fileContent = fs.readFileSync(p, "utf-8");
    const { data, content } = matter(fileContent);
    const htmlContent = md.render(content);
    const articleSlug = filename.slice(0, filename.length - 3);
    const pageData = {
      imageUrl: data.imageUrl,
      imageAlt: data.imageAlt,
      title: data.title,
      filename: articleSlug,
      slug: data.slug,
      summary: data.summary,
      tags: data.Keywords.join(","),
      name: data.author[0].name,
      datePublished: new Date(data.publishData),
      htmlContent,
    };
    articleDataList.push(pageData);
  });
  articleDataList.sort((a, b) => b.datePublished - a.datePublished);

  const totalPages = Math.ceil(articleDataList.length / ARTICLES_PER_PAGE);

  const htmlPagesPromises = [];
  //make a list of all articles and put them into a html page
  for (let page = 0; page < totalPages; page++) {
    const articlesForCurrentPage = articleDataList.slice(
      page * ARTICLES_PER_PAGE,
      (page + 1) * ARTICLES_PER_PAGE
    );
    const renderedPage = ejsCompiler.render(
      indexArticleContent,
      {
        articles: articlesForCurrentPage,
        page,
        hasNextPage: page < totalPages - 1,
      },
      {
        views: [path.join(__dirname, "../src/views/")],
        root: path.join(__dirname, "../src/views)"),
      }
    );

    const htmlFilePath = path.join(
      __dirname,
      "../",
      "temp",
      "articles",
      `${page}.html`
    );
    const writeHtmlPromise = new Promise((resolve, reject) => {
      fs.writeFile(htmlFilePath, renderedPage, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    htmlPagesPromises.push(writeHtmlPromise);
  }

  Promise.all(htmlPagesPromises)
    .then(() => {
      cb(null);
    })
    .catch((error) => {
      cb(error);
    });
}
//put the make html article pages form the markdown files
function generateArticleHtmlPages(cb) {
  let md = new MarkdownIt();
  const index_article = fs.readFileSync(
    path.join(__dirname, `../src/views/articles/show.ejs`),
    "utf-8"
  );
  return gulp
    .src("./src/articles/*.md")
    .pipe(
      each(function (content, file, callback) {
        const data = matter(content);
        const htmlContent = md.render(data.content);
        let file_history = file.history[0];
        const articleSlug = file_history.slice(0, file_history.length - 3);
        let out = ejsCompiler.render(
          index_article,
          {
            article: {
              imageUrl: data["data"].imageUrl,
              imageAlt: data["data"].imageAlt,
              title: data["data"].title,
              filename: articleSlug,
              slug: data["data"].slug,
              summary: data["data"].summary,
              tags: data["data"].Keywords.join(","),
              name: data.data.author[0].name,
              datePublished: new Date(data["data"].publishData),
              htmlContent: htmlContent,
            },
          },
          {
            views: [path.join(__dirname, "../", "./src/views/")],
            root: path.join(__dirname, "../", "./src/views)"),
          }
        );
        callback(null, out);
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("./temp/articles/"));
}
// page that will be only for when user are loaded in. will allow cotome configation later on
function generatePaths_user(cb) {
  return gulp
    .src("./src/views/user/*.ejs")
    .pipe(
      ejs(
        {},
        {
          views: [path.join(__dirname, "../", "./src/views/")],
          root: path.join(__dirname, "../", "./src/views)"),
        }
      )
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("temp/user/"));
}
// all non-user pages will be generated here
function generatePaths_page(cb) {
  return gulp
    .src("./src/views/page/*.ejs")
    .pipe(
      ejs(
        {},
        {
          views: [path.join(__dirname, "../", "./src/views/")],
          root: path.join(__dirname, "../", "./src/views)"),
        }
      )
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("temp/"));
}

exports.generateArticleHtmlList = generateArticleHtmlList;
exports.generateArticleHtmlPages = generateArticleHtmlPages;
exports.generatePaths_user = generatePaths_user;
exports.generatePaths_page = generatePaths_page;
