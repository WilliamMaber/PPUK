const express = require("express");
const { SitemapAndIndexStream, SitemapStream } = require("sitemap");
const { promisify, log } = require("util");
const { resolve } = require("path");
const router_sitemap = express.Router();
const {  createWriteStream } = require("fs");
let pages = [];
const pagesSet = new Set();

function add_page(page,update=true) {
    if (!page_exists(page.path)) {
      pages.push(page);
      pagesSet.add(page.path);
      if (update) {
        // update_sitemap();
      }
    }
}

function page_exists(path) {
  return pagesSet.has(path);
}

function page_update(path, update) {
  const index = pages.findIndex((page) => page.path === path);
  if (index !== -1) {
    pages[index] = { ...pages[index], ...update };
    return true;
  }
  return false;
}

function page_remove(path) {
  const index = pages.findIndex((page) => page.path === path);
  if (index !== -1) {
    pages.splice(index, 1);
    pagesSet.delete(path);
    return true;
  }
  return false;
}

function update_sitemap() {
  const domain = "https://example.com"; // Replace with your domain
  const maxSitemapUrls = 50000; // Maximum number of URLs per sitemap
  // Create a sitemap index stream
  const sitemapAndIndexStream = new SitemapAndIndexStream({
    limit: maxSitemapUrls,
    getSitemapStream: (i) => {
      const sitemapStream = new SitemapStream({
        hostname: domain,
      });
      const path = `./sitemap/sitemap-${i}.xml`;
      const ws = sitemapStream.pipe(createWriteStream(resolve(path + ".gz"))); // write it to sitemap-NUMBER.xml
      return [
        new URL(path, "https://example.com/sitemap/").toString(),
        sitemapStream,
        ws,
      ];

    },
  });

  for (const page of pages) {
    sitemapAndIndexStream.write(page);
  }
  sitemapAndIndexStream.end();

  return true;
}

module.exports = {
  router_sitemap,
  add_page,
  page_exists,
  page_update,
  page_remove,
  update_sitemap,
};