const { series } = require("gulp");
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
const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");
let ejs_2 = require("ejs");
const ARTICLES_PER_PAGE = 5;

let myFileLoader = function (filePath) {
  console.log(filePath);
  try{
    return  fs.readFileSync(filePath);
  }
  catch{
    return "";
  }

}
ejs_2.fileLoader = myFileLoader;
function generateArticleHtmlPages(cb) {
  let md = new MarkdownIt();
  const articleDataList = [];
  const directoryPath = path.join(__dirname, "src/articles");
  const articles = fs.readdirSync(directoryPath);
  for (const article of articles) {
    let file = path.join(directoryPath, article);
      const fileContent = fs.readFileSync(file, "utf-8");
      const { data, content } = matter(fileContent);
      const articleSlug = path.basename(file, ".md");
      const htmlContent = md.render(content);
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

      const showHtml = gulp
        .src("./src/views/articles/show.ejs")
        .pipe(ejs({ article: pageData },{ views: ["./src/views/"], root: "./src/views/" }))
        .pipe(rename({ basename: articleSlug }))
        .pipe(gulp.dest("./dist/articles"));

      // gulp.merge(showHtml, showCompressedHtml);
    }

    for (
      let pageStartIndex = 0;
      pageStartIndex < articleDataList.length;
      pageStartIndex += ARTICLES_PER_PAGE
    ) {
      const articlesForCurrentPage = articleDataList.slice(
        pageStartIndex,
        pageStartIndex + ARTICLES_PER_PAGE
      );
      const pageNum = pageStartIndex / ARTICLES_PER_PAGE;
      const indexData = {
        articles: articlesForCurrentPage,
        page: pageNum,
        hasNextPage: false,
      };

      const indexHtml = gulp
        .src("./src/views/articles/index.ejs")
        .pipe(data(() => indexData))
        .pipe(ejs({ views: ["./src/views/"], root: "./src/views/" }))
        .pipe(rename({ basename: pageNum }))
        .pipe(gulp.dest("./dist/articles"));
      return indexHtml;

}
}


// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  // body omitted
  cb();
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build(cb) {
  // body omitted
  cb();
}

exports.build = generateArticleHtmlPages;
exports.default = series(clean, build);
