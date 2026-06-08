#!/usr/bin/env python3
"""Regenerate the standalone HTML files from App.jsx.

Replaces only the in-browser Babel app block (`<script type="text/babel"
data-presets="react"> ... </script>`) inside each target, preserving the
surrounding markup and any inlined libraries (React / ReactDOM / Babel in
barberlink.html). Also injects the React-hooks destructuring and the
ReactDOM render call that the raw module form omits.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OPEN_TAG = '<script type="text/babel" data-presets="react">'
RENDER = "    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));\n  "


def app_body():
    src = open(os.path.join(ROOT, "App.jsx"), encoding="utf8").read()
    # ESM import -> globals provided by the React UMD build
    src = src.replace(
        "import React, { useState, useEffect, useRef } from 'react';",
        "const { useState, useEffect, useRef } = React;",
    )
    # default export -> plain declaration (App referenced by the render call)
    src = src.replace("export default function App()", "function App()")
    return src


def patch(path, body):
    html = open(path, encoding="utf8").read()
    start = html.find(OPEN_TAG)
    if start == -1:
        raise SystemExit(f"open tag not found in {path}")
    inner_start = start + len(OPEN_TAG)
    close = html.find("</script>", inner_start)
    if close == -1:
        raise SystemExit(f"closing </script> not found in {path}")
    new_inner = "\n" + body + "\n" + RENDER
    out = html[:inner_start] + new_inner + html[close:]
    open(path, "w", encoding="utf8").write(out)
    print(f"patched {path} ({len(out)} bytes)")


# Balises PWA injectées dans index.html (installation écran d'accueil)
PWA_HEAD = """  <link rel="manifest" href="./manifest.json" />
  <meta name="theme-color" content="#0a0a0b" />
  <link rel="icon" type="image/png" sizes="192x192" href="./icon-192.png" />
  <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="BarberLink" />
  <meta name="application-name" content="BarberLink" />
"""
PWA_SW = """  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function () {});
      });
    }
  </script>
"""
STYLE_ANCHOR = "  <style>body{margin:0;background:#0a0a0b;}"


def generate_index():
    """index.html = version autonome (index_standalone) + balises PWA + SW.

    On évite ainsi le bug du `import` brut : l'app est inlinée et prête à tourner
    dans le navigateur, tout en restant installable (manifest + service worker).
    """
    src = open(os.path.join(ROOT, "index_standalone.html"), encoding="utf8").read()
    # Injecte les balises PWA juste avant le <style> du <head>
    if PWA_HEAD.strip() not in src:
        src = src.replace(STYLE_ANCHOR, PWA_HEAD + STYLE_ANCHOR, 1)
    # Injecte l'enregistrement du service worker avant </body>
    if "serviceWorker" not in src:
        src = src.replace("</body>", PWA_SW + "</body>", 1)
    open(os.path.join(ROOT, "index.html"), "w", encoding="utf8").write(src)
    print(f"generated index.html ({len(src)} bytes)")


if __name__ == "__main__":
    body = app_body()
    patch(os.path.join(ROOT, "index_standalone.html"), body)
    patch(os.path.join(ROOT, "barberlink.html"), body)
    generate_index()
