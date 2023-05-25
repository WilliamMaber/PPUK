const gulp = require("gulp");
const fs = require("fs");

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

exports.cleanTempDirectory = cleanTempDirectory;
exports.cleanOutputDirectory = cleanOutputDirectory;
exports.cleanOutputDirectory = cleanOutputDirectory;
exports.cleanPublicBrDirectory = cleanPublicBrDirectory;
exports.cleanPublicGzipDirectory = cleanPublicGzipDirectory;
