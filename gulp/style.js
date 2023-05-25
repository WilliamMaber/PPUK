const gulp = require("gulp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

function compileCss(cb) {
  var plugins = [autoprefixer()];
  return gulp
    .src("src/styles/**/*.css")
    .pipe(postcss(plugins))
    .pipe(gulp.dest("temp/styles/"));
}
exports.compileCss = compileCss;
