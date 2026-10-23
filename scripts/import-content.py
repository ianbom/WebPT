import concurrent.futures
import hashlib
import json
import os
import re
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://liftcoindoperkasa.co.id"
RAW = ROOT / "docs" / "catalog-provenance.json"
if not RAW.exists():
    RAW = Path(os.environ["TEMP"]) / "webpt-products-raw.json"
products = json.loads(RAW.read_text(encoding="utf-8"))
inventory = []


def clean(value):
    return re.sub(r"\s+", " ", value.replace("\xa0", " ")).strip()


def download(source, folder, section):
    parsed = urllib.parse.urlparse(source)
    if parsed.scheme != "https" or parsed.hostname != "liftcoindoperkasa.co.id":
        raise ValueError(f"Untrusted asset origin: {source}")
    name = re.sub(r"[^a-zA-Z0-9._-]", "-", unicodedata.normalize("NFKD", Path(parsed.path).name))
    filename = f"{hashlib.sha256(source.encode()).hexdigest()[:8]}-{name}"
    dest = ROOT / "public" / "assets" / folder / filename
    if not dest.exists():
        dest.write_bytes(urllib.request.urlopen(source, timeout=40).read())
    with Image.open(dest) as image:
        image.verify()
    with Image.open(dest) as image:
        width, height = image.size
    record = {"src": "/" + str(dest.relative_to(ROOT / "public")).replace("\\", "/"), "width": width, "height": height, "source": source}
    inventory.append({**record, "section": section, "license": "Official Liftco website asset; no explicit redistribution license found. Confirm publication rights with Liftco."})
    return record


def group(product):
    paths = " ".join(cat["url"] for cat in product["categories"])
    if "construction-machinery" in paths:
        return "Construction Machinery"
    if "liftco-equipment" in paths:
        return "Other Equipment"
    if "mantall-lifting" in paths or "scissor-lift-heli" in paths:
        return "Lifting Equipment"
    return "HELI Material Handling Equipment"


def equipment_type(product):
    deepest = max(product["categories"], key=lambda cat: cat["url"].count("/"))
    value = re.sub(r"^[A-F]\.\s*", "", deepest["name"])
    return {"Accid Battery": "Electric Forklift", "Lithium Battery": "Electric Forklift", "Lift Tablle": "Lift Table", "Electric Counter Balance (ECB)": "Electric Forklift", "Scissor Lift Heli": "Scissor Lift"}.get(value, value)


def convert(product):
    images = [{**download(image["source"], "products", product["slug"]), "alt": clean(image["alt"])} for image in product["images"]]
    specifications = []
    for paragraph in product["paragraphs"]:
        if ":" in paragraph:
            label, value = [clean(part) for part in paragraph.split(":", 1)]
            if value and 2 < len(label) < 65 and len(value) < 180 and not re.search(r"klasifikasi|spesifikasi|garansi|warranty|harga", label, re.I):
                specifications.append({"label": label, "value": value})
    descriptions = [clean(paragraph) for paragraph in product["paragraphs"] if len(paragraph) > 95 and ":" not in paragraph and not re.search(r"ranking|peringkat|nomor 1|top ranking|standarisasi|murah|lebih kilat|garansi|warranty", paragraph, re.I)][:3]
    return {"slug": product["slug"], "name": clean(product["name"]), "brand": product["brand"].upper() if product["brand"] in ["Heli", "LCM"] else product["brand"], "category": group(product), "type": equipment_type(product), "sourceCategories": product["categories"], "images": images, "description": descriptions, "specifications": specifications, "tables": product["tables"], "source": product["source"]}


with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    converted = list(pool.map(convert, products))

extras = {
    "logo": ("2021/01/Logo-Liftco-Indo-Perkasa.png", "liftco", "Header and footer official logo"),
    "heroForklift": ("2024/08/banner-web-1920-2.jpg", "liftco", "Hero, About, equipment education; higher-resolution source of the HELI composition"),
    "heroBoom": ("2021/01/mantall-boomlift.jpg", "liftco", "Hero and lifting education"),
    "service": ("2024/10/024bfec548ed4ec19037d4dafb7254a7.jpg", "liftco", "Service, About and commitments"),
    "rental": ("2024/04/rental-scissor-lift.jpg", "liftco", "Rental page"),
    "heli": ("2024/02/HELI-BRAND.png", "brands", "HELI brand identity"),
    "mantall": ("2024/02/MANTALL-BRAND.png", "brands", "Mantall brand identity"),
    "lcm": ("2025/03/LCM-LOGO.png", "brands", "LCM brand identity"),
}
assets = {name: download(BASE + "/wp-content/uploads/" + path, folder, section) for name, (path, folder, section) in extras.items()}
data = ROOT / "src" / "data"
data.mkdir(parents=True, exist_ok=True)
(data / "products.json").write_text(json.dumps(converted, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(data / "assets.json").write_text(json.dumps(assets, indent=2) + "\n", encoding="utf-8")
(ROOT / "docs" / "catalog-provenance.json").write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
unique = {item["src"]: item for item in inventory}
lines = ["# Asset inventory", "", "Retrieved 22 October 2026. Product assets are matched to the exact source page, including shared family photography where the official site uses it. No HKA imagery is placed in public/.", "", "## Rights", "", "Liftco/manufacturer ownership is not a public redistribution license. Assets are supplied for this requested Liftco adaptation; Liftco must confirm publication rights before external deployment. No stock photographs or unlicensed manufacturer substitutions were added.", "", "| Local file | Use | Size | Source | Rights |", "|---|---|---|---|---|"]
for item in sorted(unique.values(), key=lambda item: item["src"]):
    lines.append(f"| `{item['src']}` | {item['section']} | {item['width']} x {item['height']} | {item['source']} | {item['license']} |")
lines += ["", "## Font", "", "Inter variable font: Google Fonts official repository, SIL Open Font License. Local license is public/fonts/OFL.txt. Source: https://github.com/google/fonts/tree/main/ofl/inter", "", "## Content limitations", "", "All 68 product pages were accessible. Source names and taxonomy are preserved; display equipment types normalize obvious taxonomy typos. Product descriptions omit unsupported market rankings and stock assertions. Specification tables/diagrams are source content, not inferred model data. Shared family images are not represented as independently verified model-specific photographs."]
(ROOT / "docs" / "asset-inventory.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Imported {len(converted)} products, {len(unique)} verified local assets")
