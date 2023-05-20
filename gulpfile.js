const { series ,parallel} = require("gulp");
const gulp = require("gulp");
const ejs = require("gulp-ejs");
const path = require("path");
const fs = require("fs");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const gulpBrotli = require("gulp-brotli");
const zlib = require("zlib");
const gzip = require("gulp-gzip");
const data = require("gulp-data");
const inline = require("gulp-inline");
var winify = require("gulp-winify");
// const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const purgecss = require("gulp-purgecss");
const terser = require("gulp-terser");
const { glob } = require("glob");
const svgo = require("gulp-svgo");
const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");
const each = require("gulp-each");
// const gulp_sass = require("gulp-sass")(require("sass"));
const gulp_sass = require("gulp-dart-sass");
const cssnano = require("cssnano");
const ejs_lowlevel = require("ejs");
const webp = require("gulp-webp");
const minifyInline = require("gulp-minify-inline");
const postcss = require("gulp-postcss");
const inlineCss = require("gulp-inline-css");

const ARTICLES_PER_PAGE = 5;

let myFileLoader = function (filePath) {
  let data = fs.readFileSync(filePath);
    return  data;
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
          { views: ["./src/views/"]}
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
          views: ["./src/views"],
          root: "./src/views/",
        }
      )
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("temp/"));
}
function convertImagesToWebP(cb) {
  return gulp
    .src("src/public/media/*.{png,jpeg,gif,apng}")
    .pipe(webp())
    .pipe(gulp.dest("temp/media/"));
}
function compileSassToCss(cb) {
  var plugins = [autoprefixer(),cssnano()];
  return gulp
    .src("src/styles/*.sass")
    .pipe(gulp_sass())
    .pipe(postcss(plugins))
    .pipe(
      purgecss({
        content: ["src/views/**/*.ejs"],
      })
    )
    .pipe(gulp.dest("temp/styles/"));
}
function optimizeSvg(cb) {
  return gulp
    .src("src/public/media/*.svg")
    .pipe(svgo())
    .pipe(gulp.dest("temp/media/"));
}
function inlineCssforMainPage(cb) {
    return (
      gulp
        .src("temp/*?.html")
        .pipe(inline({ base: "output/", disabledTypes: ["svg", "img", "js"] }))
        // .pipe(winify())
        //
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("output/"))
    );
}
function inlineCssForArticles(cb) {
  return (
    gulp
      .src("temp/articles/*?.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(winify())
      // .pipe(inlineCss())
      .pipe(gulp.dest("output/articles"))
  );
}
function copyMediaFiles(cb) {
  return gulp
    .src("temp/media/*.{png,jpeg,gif,webp,apng,svg}")
    .pipe(gulp.dest("output/media/"));
}
function copyCssFiles(cb) {
  return gulp.src("temp/styles/*.css").pipe(gulp.dest("output/styles/"));
}
function compressHtmlWithBrotli(cb) {
  return gulp
    .src("output/**")
    .pipe(
      gulpBrotli({
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]:
            zlib.constants.BROTLI_MAX_QUALITY,
        },
      })
    )
    .pipe(gulp.dest(`public_br/`));
}
function compressHtmlWithGzip(cb) {
  return gulp
    .src("output/**")
    .pipe(gzip({ postExtension: "gz", gzipOptions: { level: 9 } }))
    .pipe(gulp.dest(`public_gzip/`));
}
function copy_html(cb) {
  cb();
}


function cleanTempDirectory(cb) {
  try {
    fs.rmSync("./temp", { recursive: true, force: true });
    console.log("Temporary directory cleaned successfully.");
    cb(null);
  } catch (error) {
    console.error("Error cleaning temporary directory:", error);
    cb(error);
  }
}


function cleanOutputDirectory(cb) {
  try {
    fs.rmSync("./output", { recursive: true, force: true });
    console.log("Temporary directory cleaned successfully.");
    cb(null);
  } catch (error) {
    console.error("Error cleaning temporary directory:", error);
    cb(error);
  }
}

function cleanOutputDirectory(cb) {
  try {
    fs.rmSync("./output", { recursive: true, force: true });
    console.log("Temporary directory cleaned successfully.");
    cb(null);
  } catch (error) {
    console.error("Error cleaning temporary directory:", error);
    cb(error);
  }
}
function cleanPublicBrDirectory(cb) {
  try {
    fs.rmSync("public_br", { recursive: true, force: true });
    console.log("public_br directory cleaned successfully.");
    cb(null);
  } catch (error) {
    console.error("Error cleaning public_br directory:", error);
    cb(error);
  }
}
function cleanPublicGzipDirectory(cb) {
  try {
    fs.rmSync("./public_gzip", { recursive: true, force: true });
    console.log("Temporary directory cleaned successfully.");
    cb(null);
  } catch (error) {
    console.error("Error cleaning temporary directory:", error);
    cb(error);
  }
}
exports.build = series(
  parallel(
    cleanTempDirectory,
    cleanOutputDirectory,
    cleanPublicGzipDirectory,
    cleanPublicBrDirectory
  ),
  //
  parallel(
    generateArticleHtmlPages,
    generateArticleHtmlList,
    generatePaths,
    convertImagesToWebP,
    compileSassToCss,
    optimizeSvg
  ),
  parallel(
    copy_html,
    inlineCssforMainPage,
    inlineCssForArticles,
    copyMediaFiles,
    copyCssFiles
  ),
  parallel(compressHtmlWithBrotli, compressHtmlWithGzip)
);
