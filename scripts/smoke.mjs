import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

const origin = process.env.WEBPT_ORIGIN || "http://127.0.0.1:3121";
const products = JSON.parse(await readFile(new URL("../src/data/products.json", import.meta.url), "utf8"));
const assets = JSON.parse(await readFile(new URL("../src/data/assets.json", import.meta.url), "utf8"));
const routes = ["/", "/tentang-kami", "/produk", "/layanan", "/rental", "/kontak", "/artikel", ...products.map((product) => `/produk/${product.slug}`), "/artikel/mengenal-jenis-forklift", "/artikel/perbedaan-scissor-lift-dan-boom-lift", "/artikel/preventive-maintenance-forklift"];
const results = [];
const internalLinks = new Set();

for (let offset = 0; offset < routes.length; offset += 6) {
  await Promise.all(routes.slice(offset, offset + 6).map(async (route) => {
    const response = await fetch(new URL(route, origin));
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert.match(html, /<html[^>]*lang="id"/, route);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route}: h1`);
    assert.match(html, /<meta name="description" content="[^\"]+"/, `${route}: description`);
    assert.doesNotMatch(html, /hasta karya|hka\.co\.id|lorem ipsum|figma ipsum|garansi 3 tahun/i, route);
    for (const match of html.matchAll(/<a\b[^>]*\bhref="([^\"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (href.startsWith("/")) internalLinks.add(href.split("#")[0]);
      assert.notEqual(href, "#", `${route}: placeholder anchor`);
    }
    results.push({ route, status: response.status, title: html.match(/<title>(.*?)<\/title>/)?.[1] });
  }));
}

const images = [...new Set([...products.flatMap((product) => product.images.map((image) => image.src)), ...Object.values(assets).map((asset) => asset.src)])];
for (let offset = 0; offset < images.length; offset += 8) {
  await Promise.all(images.slice(offset, offset + 8).map(async (image) => {
    const response = await fetch(new URL(image, origin));
    assert.equal(response.status, 200, image);
    assert.match(response.headers.get("content-type") || "", /^image\//, image);
    assert.ok((await response.arrayBuffer()).byteLength > 50, image);
  }));
}
for (const link of internalLinks) {
  if (routes.includes(link)) continue;
  const response = await fetch(new URL(link, origin));
  assert.equal(response.status, 200, link);
  await response.arrayBuffer();
}
for (const route of ["/produk/nonexistent-product", "/artikel/nonexistent-article", "/missing-page"]) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 404, route);
  await response.arrayBuffer();
}
for (const route of ["/robots.txt", "/sitemap.xml", "/opengraph-image", "/icon.png"]) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 200, route);
  await response.arrayBuffer();
}
const report = { origin, routes: results.sort((first, second) => first.route.localeCompare(second.route)), routeCount: routes.length, imageCount: images.length, internalLinkCount: internalLinks.size, invalidRoutes: "3 correctly returned 404", metadataAssets: "robots, sitemap, Open Graph image and icon returned 200" };
await writeFile(new URL("../docs/http-smoke.json", import.meta.url), JSON.stringify(report, null, 2) + "\n");
console.log(`${routes.length} pages, ${images.length} local images, ${internalLinks.size} internal links, 3 invalid routes, 4 metadata assets passed.`);
