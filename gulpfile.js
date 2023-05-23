const { series, parallel } = require("gulp");
const gulp = require("gulp");
const ejs = require("gulp-ejs");
const path = require("path");
const fs = require("fs");
const { createWriteStream } = require("fs");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const babel = require('gulp-babel');
const gulpBrotli = require("gulp-brotli");
const zlib = require("zlib");
const gzip = require("gulp-gzip");
const data = require("gulp-data");
const inline = require("gulp-inline");
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const RSS = require("rss");
const { SitemapAndIndexStream, SitemapStream } = require("sitemap");
const autoprefixer = require("autoprefixer");
const { glob } = require("glob");
const svgo = require("gulp-svgo");
const MarkdownIt = require("markdown-it");
const matter = require("gray-matter");
const each = require("gulp-each");
const purify = require("gulp-purifycss");
const gulp_sass = require("gulp-dart-sass");
const ejs_lowlevel = require("ejs");
const webp = require("gulp-webp");
const postcss = require("gulp-postcss");
const { resolve } = require("path");
const ARTICLES_PER_PAGE = 5;
let myFileLoader = function (filePath) {
  let data = fs.readFileSync(filePath);
  return data;
};
ejs_lowlevel.fileLoader = myFileLoader;

function generateArticleHtmlPages(cb) {
  let md = new MarkdownIt();
  const index_article = fs.readFileSync(
    `./src/views/articles/show.ejs`,
    "utf-8"
  );
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
          { views: ["./src/views/"] }
        );
        callback(null, out);
      })
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("temp/articles/"));
}

function generateArticleHtmlList(cb) {
  try {
    fs.mkdirSync("./temp/");
  } catch {}
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
      cb(null);
    })
    .catch((error) => {
      cb(error);
    });
}

function generatePaths(cb) {
  return gulp
    .src("src/views/page/*.ejs")
    .pipe(
      ejs(
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
function compileCss(cb) {
  var plugins = [autoprefixer()];
  return gulp
    .src("src/styles/**/*.css")
    .pipe(postcss(plugins))
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
      .src("temp/**.html")
      .pipe(inline({ base: "temp/", disabledTypes: ["svg", "img", "js"] }))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("output/"))
  );
}

function inlineCssForArticles(cb) {
  return (
    gulp
      .src("temp/articles/**.html")
      // .pipe(htmlmin({ collapseWhitespace: true }))
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
  return gulp.src("temp/styles/**/*.{css,.min.css}").pipe(gulp.dest("output/styles/"));
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

function sitemap(cb) {
  const sms = new SitemapAndIndexStream({
    limit: 50000, // defaults to 45k
    lastmodDateOnly: false, // print date not time
    getSitemapStream: (i) => {
      const sitemapStream = new SitemapStream({
        hostname: "http://ukpirate.party/",
        lastmodDateOnly: false, // print date not time
        xmlns: {
          news: true,
          xhtml: true,
          image: false,
          video: false,
        },
      });
      const path_ = path.join(__dirname, `temp/sitemap-${i}.xml`);
      const ws = sitemapStream.pipe(createWriteStream(resolve(path_)));
      return [
        new URL(path_, "http://ukpirate.party/").toString(),
        sitemapStream,
        ws,
      ];
    },
  });
  let arrayOfSitemapItems = [];
  const articleFilenames = fs.readdirSync("./src/articles");
  articleFilenames.forEach((filename) => {
    const fileContent = fs.readFileSync(`./src/articles/${filename}`, "utf-8");
    const { data, content } = matter(fileContent);
    const articleSlug = filename.slice(0, filename.length - 3);
    arrayOfSitemapItems.push({
      url: `/articles/${articleSlug}.html`,
      news: {
        publication: {
          name: "uk pirate party",
          language: "en",
        },
        genres: "PressRelease, Blog",
        publication_date: data.publishData,
        title: data.title,
        keywords: data.Keywords,
      },
    });
  });
  arrayOfSitemapItems.forEach((item) => sms.write(item));
  sms.end();
  cb();
}

function compressSitemapWithBrotli(cb) {
  return gulp
    .src("output/*.xml")
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

function sitemap_copy(cb) {
  return gulp.src("temp/*.xml").pipe(gulp.dest(`output/`));
}
function style_copy(cb) {
  return gulp.src("temp/style/**.css").pipe(gulp.dest(`output/style/`));
}
function text_copy(cb) {
  return gulp.src("src/*.txt").pipe(gulp.dest(`output/`));
}
function compile_react(cb) {
    return  gulp
    .src('src/js/*.js') // Replace 'src/index.js' with the entry point of your JavaScript files
    .pipe(
      webpackStream({
        mode: 'development', // Adjust the mode as needed
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-react'],
                },
              },
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
        resolve: {
          extensions: ['.js', '.jsx'],
        },
      }),
      webpack
    )
    .pipe(gulp.dest('output/js')); // Replace 'dist' with your desired output directory // Output directory for compiled files
}

function compile_scripts(cb) {
  return   gulp.src('src/js/**/*.+(js|ts)') // Path to your JavaScript and TypeScript files
    .pipe(babel({
      presets: ['@babel/preset-env', '@babel/preset-react','@babel/preset-env', '@babel/preset-typescript'],
    }))
    .pipe(gulp.dest('dist/js')); // Destination folder for compiled files
}



function sitemap_gzip_copy(cb) {
  return gulp
    .src("output/*.xml")
    .pipe(gzip({ postExtension: "gz", gzipOptions: { level: 9 } }))
    .pipe(gulp.dest(`public_gzip/`));
}
function robots_copy(cb) {
  return gulp.src("temp/*.txt").pipe(gulp.dest(`output/`));
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
    cb(null);
  } catch (error) {
    console.error("Error cleaning temporary directory:", error);
    cb(error);
  }
}

function cleanOutputDirectory(cb) {
  try {
    fs.rmSync("./output", { recursive: true, force: true });
    cb(null);
  } catch (error) {
    cb(error);
  }
}
function cleanPublicBrDirectory(cb) {
  try {
    fs.rmSync("public_br", { recursive: true, force: true });
    cb(null);
  } catch (error) {
    cb(error);
  }
}
function cleanPublicGzipDirectory(cb) {
  try {
    fs.rmSync("./public_gzip", { recursive: true, force: true });
    cb(null);
  } catch (error) {
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
    compileCss,
    optimizeSvg,
    text_copy
  ),

  sitemap,
  parallel(
    copy_html,
    inlineCssforMainPage,
    inlineCssForArticles,
    copyMediaFiles,
    copyCssFiles,
    sitemap_copy,
    robots_copy,
    style_copy,
    compile_react
  ),
  parallel(
    compressHtmlWithBrotli,
    compressHtmlWithGzip,
    sitemap_gzip_copy,
    compressSitemapWithBrotli
  )
);
