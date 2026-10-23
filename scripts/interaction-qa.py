import base64
import json
import os
import time
from pathlib import Path

ROOT = Path(r"E:\Webgrow\WebPT")
ORIGIN = os.environ.get("WEBPT_ORIGIN", "http://127.0.0.1:3121")
OUTPUT = ROOT / "docs" / "screenshots" / "local" / "interactions"
OUTPUT.mkdir(parents=True, exist_ok=True)
TARGET = cdp("Target.createTarget", url="about:blank")["targetId"]
SESSION = cdp("Target.attachToTarget", targetId=TARGET, flatten=True)["sessionId"]
checks = []


def evaluate(expression):
    result = cdp("Runtime.evaluate", session_id=SESSION, expression=expression, returnByValue=True, awaitPromise=True)
    if result.get("exceptionDetails"):
        raise RuntimeError(str(result["exceptionDetails"]))
    return result.get("result", {}).get("value")


def load(path, width=1440, height=900):
    cdp("Emulation.setDeviceMetricsOverride", session_id=SESSION, width=width, height=height, deviceScaleFactor=1, mobile=False)
    cdp("Page.navigate", session_id=SESSION, url=ORIGIN + path)
    for attempt in range(80):
        if evaluate("document.readyState==='complete' && !!document.querySelector('main h1')"):
            break
        time.sleep(.2)
    time.sleep(.4)


def node(role, name):
    nodes = cdp("Accessibility.getFullAXTree", session_id=SESSION)["nodes"]
    matches = [item for item in nodes if not item.get("ignored") and item.get("role", {}).get("value") == role and " ".join(item.get("name", {}).get("value", "").split()).casefold() == " ".join(name.split()).casefold()]
    if not matches:
        raise AssertionError(f"Accessible node not found: {role} {name}")
    return matches[0]["backendDOMNodeId"]


def click(role, name):
    backend = node(role, name)
    cdp("DOM.scrollIntoViewIfNeeded", session_id=SESSION, backendNodeId=backend)
    time.sleep(.1)
    points = cdp("DOM.getBoxModel", session_id=SESSION, backendNodeId=backend)["model"]["content"]
    x, y = sum(points[0::2]) / 4, sum(points[1::2]) / 4
    cdp("Input.dispatchMouseEvent", session_id=SESSION, type="mouseMoved", x=x, y=y)
    for kind in ["mousePressed", "mouseReleased"]:
        cdp("Input.dispatchMouseEvent", session_id=SESSION, type=kind, x=x, y=y, button="left", clickCount=1)
    time.sleep(.25)


def key(name, code, number):
    for kind in ["keyDown", "keyUp"]:
        text = {"text": "\r"} if name == "Enter" and kind == "keyDown" else {}
        cdp("Input.dispatchKeyEvent", session_id=SESSION, type=kind, key=name, code=code, windowsVirtualKeyCode=number, **text)
    time.sleep(.15)


def check(name, expression):
    for attempt in range(30):
        if evaluate(expression):
            break
        time.sleep(.1)
    else:
        raise AssertionError(name)
    checks.append(name)
    (OUTPUT / "results.json").write_text(json.dumps(checks, indent=2), encoding="utf-8")
    print("PASS", name, flush=True)


def capture(name):
    image = cdp("Page.captureScreenshot", session_id=SESSION, format="jpeg", quality=75, captureBeyondViewport=False)
    (OUTPUT / (name + ".jpg")).write_bytes(base64.b64decode(image["data"]))


try:
    cdp("Emulation.setEmulatedMedia", session_id=SESSION, features=[{"name": "prefers-reduced-motion", "value": "reduce"}])
    load("/")
    check("reduced motion disables automatic hero playback", "!!document.querySelector('[aria-label=\"Putar pergantian slide\"]')")
    click("button", "Slide 2")
    check("hero pagination selects the second slide", "document.querySelector('[aria-label=\"Slide 2\"]').getAttribute('aria-current')==='true'")
    check("only active hero CTA is keyboard-interactive", "document.querySelectorAll('.hero-slide:not([inert])').length===1")
    cdp("DOM.focus", session_id=SESSION, backendNodeId=node("button", "Buka kategori produk"))
    key("Enter", "Enter", 13)
    check("desktop dropdown opens with keyboard", "document.querySelector('#desktop-product-menu').classList.contains('is-open')")
    key("Tab", "Tab", 9)
    key("Escape", "Escape", 27)
    check("desktop dropdown Escape closes and returns focus", "!document.querySelector('#desktop-product-menu').classList.contains('is-open') && document.activeElement.getAttribute('aria-label')==='Buka kategori produk'")
    evaluate("window.scrollTo({top:1500,behavior:'instant'});true")
    time.sleep(.2)
    check("header remains visible after scrolling", "document.querySelector('header').getBoundingClientRect().top===0")
    click("button", "Kembali ke atas")
    check("back-to-top returns to start", "scrollY===0")
    load("/", 390, 844)
    click("button", "Buka menu navigasi")
    check("mobile navigation opens accessible dialog", "!!document.querySelector('[role=dialog]')")
    check("mobile menu focus moves inside dialog", "document.querySelector('[role=dialog]').contains(document.activeElement)")
    capture("mobile-menu")
    for iteration in range(20):
        key("Tab", "Tab", 9)
    check("mobile navigation traps keyboard focus", "document.querySelector('[role=dialog]').contains(document.activeElement)")
    key("Escape", "Escape", 27)
    check("mobile Escape closes and restores focus", "!document.querySelector('[role=dialog]') && document.activeElement.getAttribute('aria-label')==='Buka menu navigasi'")
    click("button", "Buka menu navigasi")
    click("link", "Rental")
    time.sleep(.6)
    check("mobile navigation follows internal route", "location.pathname==='/rental' && !document.querySelector('[role=dialog]')")
    load("/produk")
    click("button", "Halaman 8")
    check("catalog last page contains remaining five products", "document.querySelectorAll('.catalog-results .product-card').length===5")
    click("checkbox", "HELI")
    check("filter change resets pagination", "document.querySelector('.pagination [aria-current]')?.textContent==='1'")
    check("brand filter affects actual cards", "[...document.querySelectorAll('.catalog-results .product-meta>span:first-child')].every(i=>i.innerText==='HELI')")
    click("checkbox", "Other Equipment")
    check("incompatible filters produce truthful empty state", "document.querySelector('.empty-results')?.innerText.includes('Tidak ada produk')")
    capture("catalog-empty-state")
    click("button", "Reset Filter")
    check("reset restores complete catalog", "document.querySelector('.catalog-toolbar').innerText.includes('68 produk') && document.querySelectorAll('.catalog-results .product-card').length===9")
    load("/produk?brand=Dingli", 390, 844)
    check("verified brand link initializes catalog filter", "[...document.querySelectorAll('.catalog-results .product-meta>span:first-child')].every(i=>i.innerText==='Dingli') && document.querySelectorAll('.catalog-results .product-card').length===2")
    click("button", "Filter Produk")
    check("mobile filtering expands actual controls", "document.querySelector('.catalog-filters').getBoundingClientRect().height>0")
    capture("mobile-filters")
    load("/produk/lcm-scissor-lift-ze16w", 390, 844)
    click("button", "Gambar 2: Spesifikasi Scissor Lift LCM")
    check("product thumbnail switches to verified specification diagram", "document.querySelector('.gallery-main img').alt==='Spesifikasi Scissor Lift LCM'")
    click("button", "Perbesar gambar LCM Scissor Lift ZE16W \u2013 16 Meter")
    check("gallery opens native modal", "document.querySelector('.gallery-dialog').open")
    capture("product-gallery")
    key("Escape", "Escape", 27)
    check("gallery Escape closes and restores trigger focus", "!document.querySelector('.gallery-dialog').open && document.activeElement.classList.contains('gallery-main')")
    load("/kontak", 390, 844)
    click("button", "Buka Draf Email")
    check("contact form rejects missing required fields", "!document.querySelector('.contact-form').checkValidity() && document.activeElement.id==='contact-name'")
    for label, text in [("Nama", "QA Liftco"), ("Email", "qa@example.com"), ("Nomor Telepon", "0211234567"), ("Pesan", "Konsultasi forklift HELI")]:
        cdp("DOM.focus", session_id=SESSION, backendNodeId=node("textbox", label))
        cdp("Input.insertText", session_id=SESSION, text=text)
    check("contact composer accepts valid input without fake submission", "document.querySelector('.contact-form').checkValidity() && document.querySelector('.contact-form').innerText.includes('tidak dikirim')")
    check("contact channels use official email and telephone links", "[...document.querySelectorAll('.contact-offices a[href^=mailto]')].length===3 && [...document.querySelectorAll('.contact-offices a[href^=tel]')].length===3")
    capture("contact-composer-valid")
    load("/")
    cdp("Target.activateTarget", targetId=TARGET)
    cdp("Emulation.setEmulatedMedia", session_id=SESSION, features=[{"name": "prefers-reduced-motion", "value": "no-preference"}])
    cdp("Input.dispatchMouseEvent", session_id=SESSION, type="mouseMoved", x=5, y=5)
    time.sleep(6.3)
    check("normal-motion hero automatically advances", "document.querySelector('[aria-label=\"Slide 2\"]').getAttribute('aria-current')==='true'")
    click("button", "Jeda pergantian slide")
    check("hero pause stops autoplay", "!!document.querySelector('[aria-label=\"Putar pergantian slide\"]')")
finally:
    cdp("Target.closeTarget", targetId=TARGET)
print(f"{len(checks)} interaction checks passed. External email-client dispatch intentionally not launched.", flush=True)
