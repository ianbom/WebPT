import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import records from "../src/data/products.json" with { type: "json" };
import assets from "../src/data/assets.json" with { type: "json" };
import { filterProducts, paginateProducts, relatedProducts, inquiryEmail } from "../src/lib/catalog.ts";
import { composeEmail } from "../src/lib/contact.ts";
import type { Product } from "../src/types/product.ts";

const products: Product[] = records;
const empty = { categories: [], brands: [], types: [] };

test("all 68 verified source products have unique, usable local records", () => {
  assert.equal(products.length, 68);
  assert.equal(new Set(products.map((product) => product.slug)).size, 68);
  for (const product of products) {
    assert.match(product.slug, /^[a-z0-9-]+$/);
    assert.ok(product.name && product.brand && product.type && product.category);
    assert.equal(new URL(product.source).hostname, "liftcoindoperkasa.co.id");
    assert.ok(product.images.length > 0);
    for (const image of product.images) {
      assert.ok(image.src.startsWith("/assets/products/"));
      assert.ok(existsSync(join("public", image.src)), image.src);
      assert.ok(image.width > 0 && image.height > 0);
    }
  }
  for (const asset of Object.values(assets)) assert.ok(existsSync(join("public", asset.src)), asset.src);
});

test("empty filters preserve the full catalog", () => {
  assert.equal(filterProducts(products, empty).length, 68);
});

test("filter options use OR within groups and AND across groups", () => {
  const heli = filterProducts(products, { ...empty, brands: ["HELI"] });
  const combinedBrands = filterProducts(products, { ...empty, brands: ["HELI", "LCM"] });
  assert.ok(heli.length > 0);
  assert.ok(combinedBrands.length > heli.length);
  assert.ok(combinedBrands.every((product) => ["HELI", "LCM"].includes(product.brand)));
  const lifting = filterProducts(products, { categories: ["Lifting Equipment"], brands: ["HELI"], types: ["Scissor Lift"] });
  assert.ok(lifting.length > 0);
  assert.ok(lifting.every((product) => product.category === "Lifting Equipment" && product.brand === "HELI" && product.type === "Scissor Lift"));
  assert.equal(filterProducts(products, { ...empty, brands: ["unverified-brand"] }).length, 0);
});

test("pagination handles last page, reset, empty results, and invalid page numbers", () => {
  assert.equal(paginateProducts(products, 1).items.length, 9);
  assert.equal(paginateProducts(products, 8).items.length, 5);
  assert.equal(paginateProducts(products, 999).currentPage, 8);
  assert.equal(paginateProducts(products, -1).currentPage, 1);
  assert.equal(paginateProducts([], 5).currentPage, 1);
  assert.deepEqual(paginateProducts([], 1).items, []);
  assert.equal(paginateProducts(filterProducts(products, { ...empty, brands: ["Dingli"] }), 1).currentPage, 1);
});

test("related products exclude current product and prioritize matching types", () => {
  const current = products.find((product) => product.slug === "lcm-scissor-lift-ze16w")!;
  const related = relatedProducts(products, current);
  assert.equal(related.length, 4);
  assert.ok(related.every((product) => product.slug !== current.slug));
  assert.ok(related.every((product) => product.type === current.type));
  assert.equal(relatedProducts([current], current).length, 0);
});

test("source names distinguish 3.5 ton from 35 ton; flagship specs match the source", () => {
  const small = products.find((product) => product.slug === "forklift-heli-35-ton-engine-isuzu")!;
  const heavy = products.find((product) => product.slug === "forklift-heli-35-ton-big-forklift")!;
  assert.match(small.name, /3,5/);
  assert.match(heavy.name, /35/);
  const flagship = products.find((product) => product.slug === "forklift-heli-46-ton-big-forklift")!;
  assert.ok(flagship.specifications.some((specification) => specification.value.includes("46.000")));
  assert.ok(flagship.specifications.some((specification) => specification.value.includes("CPCD460")));
});

test("email links encode user-supplied text without query/header injection", () => {
  const subject = "HELI & LCM?\r\nBcc: someone@example.com";
  const inquiry = new URL(inquiryEmail(subject));
  assert.equal(inquiry.pathname, "marketing@liftco.co.id");
  assert.equal(inquiry.searchParams.size, 1);
  assert.doesNotMatch(inquiry.searchParams.get("subject") || "", /[\r\n]/);
  const draft = new URL(composeEmail({ name: " Budi & Co ", email: "budi@example.com", phone: "08123", message: "Unit A? & unit B\nTerima kasih" }));
  assert.equal(draft.searchParams.size, 2);
  assert.equal(draft.searchParams.get("subject"), "Konsultasi Equipment - Budi & Co");
  assert.ok(draft.searchParams.get("body")?.includes("Unit A? & unit B\nTerima kasih"));
});

test("rendered copy sources contain no reference identity, invented endorsements, or warranty imports", () => {
  const visit = (directory: string): string => readdirSync(directory, { withFileTypes: true }).map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? visit(path) : /\.(tsx?|json)$/.test(entry.name) ? readFileSync(path, "utf8") : "";
  }).join("\n");
  const source = visit("src");
  assert.doesNotMatch(source, /hka\.co\.id|hasta karya|lorem ipsum|figma ipsum|garansi 3 tahun|200 perusahaan/i);
  assert.doesNotMatch(JSON.stringify(products.map((product) => product.description)), /ranking|peringkat|nomor 1/i);
});
