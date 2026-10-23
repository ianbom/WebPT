import base64
import json
import os
import time
from pathlib import Path

ROOT = Path(r"E:\Webgrow\WebPT")
ORIGIN = os.environ.get("WEBPT_ORIGIN", "http://127.0.0.1:3120")
PASS = os.environ.get("WEBPT_QA_PASS", "pass3")
OUTPUT = ROOT / "docs" / "screenshots" / "local" / PASS
OUTPUT.mkdir(parents=True, exist_ok=True)
TARGET = cdp("Target.createTarget", url="about:blank")["targetId"]
SESSION = cdp("Target.attachToTarget", targetId=TARGET, flatten=True)["sessionId"]


def evaluate(expression):
    response = cdp("Runtime.evaluate", session_id=SESSION, expression=expression, returnByValue=True, awaitPromise=True)
    if response.get("exceptionDetails"):
        raise RuntimeError(str(response["exceptionDetails"]))
    return response.get("result", {}).get("value")


def load(path, width, height):
    cdp("Emulation.setDeviceMetricsOverride", session_id=SESSION, width=width, height=height, deviceScaleFactor=1, mobile=False)
    cdp("Page.navigate", session_id=SESSION, url=ORIGIN + path)
    for attempt in range(80):
        if evaluate("document.readyState === 'complete' && !!document.querySelector('main h1')"):
            break
        time.sleep(.25)
    evaluate("document.fonts.ready.then(()=>true)")
    page_height = evaluate("document.documentElement.scrollHeight")
    for position in range(0, page_height, height - 150):
        evaluate(f"window.scrollTo({{top:{position},behavior:'instant'}});true")
        time.sleep(.12)
    evaluate("Promise.race([Promise.all([...document.images].filter(i=>i.getBoundingClientRect().width>0&&!i.closest('[aria-hidden=true]')).map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,15000))]).then(()=>true)")
    time.sleep(.25)
    evaluate("window.scrollTo({top:0,behavior:'instant'});true")


cdp("Page.addScriptToEvaluateOnNewDocument", session_id=SESSION, source="window.__qaErrors=[];window.addEventListener('error',event=>{if(event.message)window.__qaErrors.push(event.message)});window.addEventListener('unhandledrejection',event=>window.__qaErrors.push(String(event.reason)));")
cdp("Emulation.setEmulatedMedia", session_id=SESSION, features=[{"name": "prefers-reduced-motion", "value": "reduce"}])
base_routes = ["/", "/tentang-kami", "/produk", "/layanan", "/rental", "/kontak", "/artikel", "/produk/forklift-heli-46-ton-big-forklift", "/produk/lcm-scissor-lift-ze16w", "/produk/dingli-boom-lift-18m-28m-articulated", "/artikel/mengenal-jenis-forklift"]
viewports = [(1440, 900), (390, 844)] if PASS == "pass1" else [(1920, 1080), (1440, 900), (1024, 900), (768, 1024), (390, 844), (375, 812)]
routes = base_routes[:8] if PASS == "pass1" else ["/", "/produk", "/kontak"] if PASS == "pass2" else base_routes
results = []
try:
    for width, height in viewports:
        for route in routes:
            load(route, width, height)
            info = json.loads(evaluate("JSON.stringify({url:location.href,title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,h1:[...document.querySelectorAll('main h1')].length,brokenImages:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&!i.closest('[aria-hidden=true]')&&i.complete&&i.naturalWidth===0).map(i=>i.currentSrc),missingAlt:[...document.querySelectorAll('main img:not([alt])')].length,headingOverflow:[...document.querySelectorAll('main h1,main h2,main h3')].filter(i=>!i.closest('[aria-hidden=true]')).filter(i=>{let r=i.getBoundingClientRect();return r.width&&(r.left < -1 || r.right > innerWidth+1)}).map(i=>i.innerText),errors:window.__qaErrors||[],referenceIdentity:/hasta karya|hka\\.co\\.id|lorem ipsum|figma ipsum/i.test(document.body.innerText),sections:location.pathname==='/'?[...document.querySelector('main').children].map(i=>({class:i.className,top:i.offsetTop,height:i.offsetHeight})):[]})"))
            filename = (route.strip("/").replace("/", "--") or "home") + f"-{width}.jpg"
            image = cdp("Page.captureScreenshot", session_id=SESSION, format="jpeg", quality=70, captureBeyondViewport=True, clip={"x": 0, "y": 0, "width": width, "height": info["height"], "scale": 1})
            (OUTPUT / filename).write_bytes(base64.b64decode(image["data"]))
            failures = []
            info["pendingImages"] = evaluate("[...document.images].filter(i=>i.getBoundingClientRect().width>0&&!i.closest('[aria-hidden=true]')&&!i.complete).map(i=>i.currentSrc||i.src)")
            if info["width"] != width or info["scrollWidth"] > width + 1:
                failures.append("horizontal overflow/viewport mismatch")
            if info["h1"] != 1:
                failures.append("expected exactly one h1")
            for field in ["brokenImages", "pendingImages", "missingAlt", "headingOverflow", "errors", "referenceIdentity"]:
                if info[field]:
                    failures.append(field)
            result = {"route": route, "viewport": [width, height], "screenshot": filename, "failures": failures, **info}
            results.append(result)
            print(PASS, width, route, "PASS" if not failures else failures, flush=True)
            (OUTPUT / "results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
finally:
    cdp("Target.closeTarget", targetId=TARGET)
assert not any(result["failures"] for result in results), "Visual QA structural checks failed; inspect results.json"
print(f"{PASS}: {len(results)} viewport/route captures passed", flush=True)
