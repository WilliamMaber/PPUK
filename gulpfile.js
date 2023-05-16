const { series ,parallel} = require("gulp");
const gulp = require("gulp");
const ejs = require("gulp-ejs");
const path = require("path");
const fs = require("fs");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const data = require("gulp-data");
// const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const { glob } = require("glob");
const svgo = require("gulp-svgo");
const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");
const each = require("gulp-each");
const gulp_sass = require("gulp-sass")(require("sass"));
const ejs_lowlevel = require("ejs");
const webp = require("gulp-webp");
const minifyInline = require("gulp-minify-inline");
const postcss = require("gulp-postcss");
const inlineCss = require("gulp-inline-css");
const ARTICLES_PER_PAGE = 5;

let myFileLoader = function (filePath) {
  console.log(filePath);
    return ""+ fs.readFileSync(filePath);
}
ejs_lowlevel.fileLoader = myFileLoader;

function generateArticleHtmlPages(cb) {
  let md = new MarkdownIt();
  const index_article = fs.readFileSync( `./src/views/articles/show.ejs`,"utf-8");
  return gulp
    .src("src/articles/*.md")
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
              tags: data["data"].Keywords,
              name: data["data"].name,
              datePublished: new Date(data["data"].publishData),
              htmlContent: htmlContent,
            },
          },
          {
            views: ["./src/views/"],
            root: "./src/views/",
          }
        );
        callback(null, out);
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("temp/articles/"));
}


function generateArticleHtmlList(cb) {
  try{
  fs.mkdirSync("./temp/");
  }
  catch{}
  try {
    fs.mkdirSync("./temp/articles");
  } catch {}
  let md = new MarkdownIt();
  const ARTICLES_PER_PAGE = 5;
  const articleFilenames = fs.readdirSync("./src/articles");
  const indexArticlePath = path.join(__dirname, "src/views/articles/index.ejs");
  const indexArticleContent = fs.readFileSync(indexArticlePath, "utf-8");

  const articleDataList = [];
  articleFilenames.forEach((filename) => {
    const fileContent = fs.readFileSync(`./src/articles/${filename}`, "utf-8");
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
      tags: data.Keywords,
      name: data.name,
      datePublished: new Date(data.publishData),
      htmlContent,
    };
    articleDataList.push(pageData);
  });

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
        views: ["./src/views/"],
        root: "./src/views/",
      }
    );

    const htmlFilePath = path.join(
      __dirname,
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
      console.log("HTML pages generated successfully.");
      cb(null);
    })
    .catch((error) => {
      console.error("Error generating HTML pages:", error);
      cb(error);
    });
}


function generatePaths(cb) {
  return gulp
    .src("src/views/page/*.ejs")
    .pipe(ejs(
        {},
        {
          views: ["./src/views/"],
          root: "./src/views/",
        }
      )
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("temp/"));;
}
function media_image_2_webp(cb) {
  return gulp
    .src("src/public/media/*.{png,jpeg,gif,apng}")
    .pipe(webp())
    .pipe(gulp.dest("temp/media/"));
}
function style_sass_2_css(cb) {
  var plugins = [
  ];
  return gulp
    .src("src/styles/*.sass")
    .pipe(gulp_sass({ includePaths: ["./", "./src/sass"] }))
    .pipe(postcss(plugins))
    .pipe(gulp.dest("temp/styles/"));
}
function media_svg_2_svgo(cb) {
  return gulp
    .src("src/public/media/*.svg")
    .pipe(svgo())
    .pipe(gulp.dest("temp/media/"));
}
function style_css_inline(cb) {
    return gulp
      .src("temp/*?.html")
      .pipe(minifyInline())
      .pipe(inlineCss())
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("output/"));
}
function style_articles(cb) {
  return gulp
    .src("temp/articles/*?.html")
    .pipe(inlineCss())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("output/articles"));
}
function copy_html(cb) {
  cb();
}

function clean(cb) {
  try {
    fs.rmSync("./temp", { recursive: true, force: true });
  } catch {}
  cb();
}
exports.build = series(
  // remove all temp files
  clean,
  //
  parallel(
    generateArticleHtmlPages,
    generateArticleHtmlList,
    generatePaths,
    media_image_2_webp,
    style_sass_2_css,
    media_svg_2_svgo
  ),
  parallel(copy_html, style_css_inline, style_articles)
);
