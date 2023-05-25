const svgo = require("gulp-svgo");
const webp = require("gulp-webp");
const gulp = require("gulp");

function convertImagesToWebP(cb) {
  return gulp
    .src("src/public/media/*.{png,jpeg,gif,apng}")
    .pipe(webp())
    .pipe(gulp.dest("temp/media/"));
}
function optimizeSvg(cb) {
  return gulp
    .src("src/public/media/*.svg")
    .pipe(svgo())
    .pipe(gulp.dest("temp/media/"));
}

exports.convertImagesToWebP = convertImagesToWebP;
exports.optimizeSvg = optimizeSvg;
