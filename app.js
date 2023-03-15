const express = require("express");
const ejsLocals = require("ejs-locals");
const sassMiddleware = require("node-sass-middleware");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const { articlesRouter, getArticles } = require("./routes/articles.js");
const { userRouter, User } = require("./routes/user.js");
const miscRouter = require("./routes/misc.js");
const feedRouter = require("./routes/feed.js");
async function load(){
  const app = express();
  // Set up EJS, Markdown, Grey Matter, and Sass
  app.engine("ejs", ejsLocals);
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");


  app.use(
    sassMiddleware({
      src: __dirname + "/sass",
      dest: __dirname + "/public/",
      debug: true,
      outputStyle: "compressed",
    })
  );

  app.use(express.static(__dirname + "/public"));

  app.use(express.urlencoded({ extended: true }));

  // Set up session and passport
  const store = new MongoStore({
    mongoUrl: "mongodb://localhost:27017/myapp",
    ttl: 14 * 24 * 60 * 60, // = 14 days. Default
  });

  app.use(
    session({
      secret: "my-secret-key",
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );

  // app.use(passport.initialize());
  // app.use(passport.session());

  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Define routes
  app.get("/", (req, res) => {
    const articles = getArticles();
    res.render("index", { articles, title: "", user: "" });
  });

  app.use("/", miscRouter);
  app.use("/articles", articlesRouter);
  app.use("/user", userRouter);
  app.use("/feed", feedRouter);

  app.use(express.static("public"));

  app.get("/*", (req, res, next) => {
    const filePath = path.join("public", req._parsedUrl.path + ".md");
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return next();
      } else {
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContents);
        const ejsPath = data.template;

        res.render(ejsPath, { ...data, content, user: "" });
      }
    });
  });

  app.get("/*", (req, res, next) => {
    const test_path = path.join(
      __dirname,
      "views",
      req._parsedUrl.path + ".ejs"
    );
    console.log(test_path);
    if (fs.existsSync(test_path)) {
      // ...
      const filePath = path.join(req._parsedUrl.path + ".ejs").slice(1);
      console.log(filePath);
      try {
        res.render(filePath, { user: "" });
      } catch {
        next();
      }
    } else {
      next();
    }
  });

  // Start the server
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}
load();