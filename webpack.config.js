// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const fs = require("fs");
const gm = require("gray-matter");
const markdownIt = require("markdown-it");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackInlineSVGPlugin = require("html-webpack-inline-svg-plugin");
const OfflinePlugin = require("offline-plugin");
const ejs = require("ejs");
const { log } = require("console");
const md = markdownIt();
const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

let myFileLoad = function (filePath) {
  return fs.readFileSync(filePath);
};

ejs.fileLoader = myFileLoad;

function generateArticleHtmlPages() {
  const ARTICLES_PER_PAGE = 5;
  const articleFilenames = fs.readdirSync("./src/articles");
  const index_article = fs.readFileSync(
    `./src/views/articles/index.ejs`,
    "utf-8"
  );
  const show_article = fs.readFileSync(
    `./src/views/articles/show.ejs`,
    "utf-8"
  );

  const articleDataList = [];
  const htmlPluginList = [
    new CompressionPlugin(),
    new HtmlWebpackPlugin({
      template: "!!ejs-webpack-loader!src/views/index.ejs",
      title: "Custom template using Handlebars",
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "!!ejs-webpack-loader!src/views/about.ejs",
      title: "Custom template using Handlebars",
      filename: "about.html",
    }),
    new HtmlWebpackPlugin({
      template: "!!ejs-webpack-loader!src/views/contact.ejs",
      title: "Custom template using Handlebars",
      filename: "contact.html",
    }),
    new HtmlWebpackPlugin({
      template: "!!ejs-webpack-loader!src/views/contact.ejs",
      title: "Custom template using Handlebars",
      filename: "contact.html",
      templateParameters: {
        foo: "bar",
      },
    }),
    new HtmlWebpackInlineSVGPlugin(),
    new MiniCssExtractPlugin(),
    // new OfflinePlugin(),
  ];

  articleFilenames.forEach((filename) => {
    const fileContent = fs.readFileSync(`./src/articles/${filename}`, "utf-8");
    const { data, content } = gm(fileContent);
    const htmlContent = md.render(content);
    const articleSlug = filename.slice(0, filename.length - 3);
    const page_data = {
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
    let html = ejs.render(
      show_article,
      {
        article: page_data,
        user: undefined,
      },
      { views: ["./src/views/"], root: "./src/views/" }
    );
    htmlPluginList.push(
      new HtmlWebpackPlugin({
        templateContent: html,
        filename: "articles/" + articleSlug + ".html",
        article: page_data,
      })
    );
    articleDataList.push(page_data);
  });

  for (
    let pageStartIndex = 0;
    pageStartIndex < articleDataList.length;
    pageStartIndex = pageStartIndex + ARTICLES_PER_PAGE
  ) {
    const articlesForCurrentPage = articleDataList.slice(
      pageStartIndex,
      pageStartIndex + ARTICLES_PER_PAGE
    );
    let page_num = pageStartIndex / ARTICLES_PER_PAGE;
    let html = ejs.render(
      index_article,
      {
        articles: articlesForCurrentPage,
        page: page_num,
        hasNextPage: false,
      },
      { views: ["./src/views/"], root: "./src/views/" }
    );
    htmlPluginList.push(
      new HtmlWebpackPlugin({
        templateContent: html,
        filename: "articles/" + page_num + ".html",
        templateParameters: {
          articles: articlesForCurrentPage,
          page: pageStartIndex / ARTICLES_PER_PAGE,
          hasNextPage: false,
        },
      })
    );
  }

  return htmlPluginList;
}
// console.log(generateArticleHtmlPages());

const config = {
  entry: {
    main: "./src/index.js",
    pp_svg: "./src/public/media/PP.svg",
    pp_png: "./src/public/media/PP.png",
  },
  output: {
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  module: {
    rules: [
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {},
        },
      },
      {
        test: /\.ejs$/,
        loader: "ejs-loader",
        options: {
          esModule: false,
        },
      },
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "postcss-loader", "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  plugins: generateArticleHtmlPages(),
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
  }
  return config;
};
