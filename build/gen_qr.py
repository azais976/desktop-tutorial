#!/usr/bin/env python3
"""Génère le QR code BarberLink (SVG net pour l'impression + écran)."""
import os, segno

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Le QR pointe vers la page d'installation intelligente (détecte la plateforme).
URL = "https://azais976.github.io/desktop-tutorial/install.html"

def main():
    qr = segno.make(URL, error="h")  # correction haute = robuste même imprimé/abîmé
    # SVG scombleur foncé sur fond clair, sans bordure interne (on gère la marge en CSS)
    out = os.path.join(ROOT, "qr-install.svg")
    qr.save(out, kind="svg", scale=10, border=2, dark="#0a0a0b", light="#ffffff")
    print("QR ->", out, "| cible:", URL)

if __name__ == "__main__":
    main()
