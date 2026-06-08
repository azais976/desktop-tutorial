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


if __name__ == "__main__":
    body = app_body()
    patch(os.path.join(ROOT, "index_standalone.html"), body)
    patch(os.path.join(ROOT, "barberlink.html"), body)
