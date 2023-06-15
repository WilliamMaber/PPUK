const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");
const ejs = require("gulp-ejs");
const ejs_lowlevel = require("ejs");
const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const each = require("gulp-each");
const rename = require("gulp-rename");

const ARTICLES_PER_PAGE = 5;
let myFileLoader = function (filePath) {
  let data = fs.readFileSync(filePath);
  return data;
};
ejs_lowlevel.fileLoader = myFileLoader;

function generateArticleHtmlList(cb) {
  try {
    fs.mkdirSync("./temp/");
  } catch {}
  try {
    fs.mkdirSync("./temp/articles");
  } catch {}
  let md = new MarkdownIt();
  const ARTICLES_PER_PAGE = 5;
  let p_ = path.join(__dirname, "../", "./src/articles");
  console.log(p_);
  const articleFilenames = fs.readdirSync(p_);
  const indexArticlePath = path.join(
    __dirname,
    "../src/views/articles/index.ejs"
  );
  const indexArticleContent = fs.readFileSync(indexArticlePath, "utf-8");
  const articleDataList = [];
  articleFilenames.forEach((filename) => {
    let p = path.join(__dirname, `../src/articles/${filename}`);
    console.log(p);
    const fileContent = fs.readFileSync(p, "utf-8");
    const { data, content } = matter(fileContent);
    console.log(data.author);
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

  for (let page = 0; page < totalPages; page++) {
    const articlesForCurrentPage = articleDataList.slice(
      page * ARTICLES_PER_PAGE,
      (page + 1) * ARTICLES_PER_PAGE
    );
    const renderedPage = ejs_lowlevel.render(
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
        let p = file.history[0];
        const articleSlug = p.slice(0, p.length - 3);
        let out = ejs_lowlevel.render(
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
