const express = require("express");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const app = express();

app.use((req, res, next) => {
  console.log("test");
  const requestedPath = path.normalize(req.path);
  let dirname = __dirname.toString();
  console.log(dirname);

  let resolvedGzipPath = path.join(
    __dirname.toString(),
    "public_gzip",
    `${requestedPath}.gz`
  );

  let resolvedBrPath = path.join(
    __dirname.toString(),
    "public_br",
    `${requestedPath}.br`
  );
  let resolvedGzipPath_folder = path.join(
    __dirname.toString(),
    "public_gzip",
    `${requestedPath}.gz`
  );
  let resolvedBrPath_folder = path.join(
    __dirname.toString(),
    "public_br",
    `${requestedPath}.br`
  );

  const acceptedEncodings = req.headers["accept-encoding"] || "";
  const canAcceptBrotli = acceptedEncodings.includes("br");
  const canAcceptGzip = acceptedEncodings.includes("gzip");

  if (fs.existsSync(resolvedBrPath_folder)) {
    let statsObj_Brotli = fs.statSync(resolvedGzipPath);
    if (statsObj_Brotli.isDirectory()) {
      resolvedGzipPath = path.resolve(
        __dirname.toString(),
        "public_gzip",
        `${requestedPath}`,
        "index.html.gz"
      );
    }
  }
  if (fs.existsSync(canAcceptGzip)) {
    console.log("sending Gzip");
    let statsObj_Gzip = fs.statSync(canAcceptGzip);
    if (statsObj_Gzip.isDirectory()) {
      canAcceptGzip = path.resolve(
        __dirname.toString(),
        "public_br",
        `${requestedPath}`,
        "index.html.br"
      );
    }
  }

  if (canAcceptBrotli && fs.existsSync(resolvedBrPath)) {
    const brReadStream = fs.createReadStream(resolvedBrPath);
    res.set("Content-Encoding", "br");
    const fileExtension = path.extname(requestedPath).slice(1);
    const contentType =
      mime.contentType(fileExtension) || "application/octet-stream";
    res.set("Content-Type", contentType);
    brReadStream.pipe(res);
    return;
  }
  if (canAcceptGzip && fs.existsSync(resolvedGzipPath)) {
    const gzipReadStream = fs.createReadStream(resolvedGzipPath);
    res.set("Content-Encoding", "gzip");
    const fileExtension = path.extname(requestedPath).slice(1);
    const contentType =
      mime.contentType(fileExtension) || "application/octet-stream";
    res.set("Content-Type", contentType);
    gzipReadStream.pipe(res);
    return;
  }
  next();
});

app.use(express.static("output"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});