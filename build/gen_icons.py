#!/usr/bin/env python3
"""Generate BarberLink PWA PNG icons with a hand-rolled PNG encoder (no deps).

Draws a brand-dark, full-bleed icon with a centered barber pole motif so the
same file works as a normal icon, a maskable icon and an iOS apple-touch-icon.
"""
import struct, zlib, math, os

DARK   = (18, 18, 20)     # #121214 background
CREAM  = (239, 227, 200)  # #EFE3C8 pole caps / ring
RED    = (204, 34, 34)    # #CC2222
WHITE  = (245, 245, 245)  # #F5F5F5
BLUE   = (26, 79, 154)    # #1A4F9A


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def make_icon(size, pad_ratio=0.0):
    """Return raw RGB pixel buffer (bytearray) of size*size."""
    buf = [[DARK for _ in range(size)] for _ in range(size)]

    cx = cy = size / 2.0
    # Safe area: maskable icons keep content within central 80%.
    safe = size * (1.0 - pad_ratio)

    # Barber pole geometry (relative to safe area)
    pole_w = safe * 0.34
    pole_h = safe * 0.66
    x0 = cx - pole_w / 2.0
    x1 = cx + pole_w / 2.0
    y0 = cy - pole_h / 2.0
    y1 = cy + pole_h / 2.0
    radius = pole_w / 2.0
    stripe = safe * 0.10  # diagonal stripe period

    cap_w = pole_w * 1.26   # cream end-cap width
    cap_h = safe * 0.10     # cream end-cap height
    cap_rad = cap_h / 2.0

    def inside_round_rect(px, py):
        # within vertical body (rounded top/bottom)
        if x0 <= px <= x1 and y0 + radius <= py <= y1 - radius:
            return True
        # top cap
        if (px - cx) ** 2 + (py - (y0 + radius)) ** 2 <= radius ** 2 and py < y0 + radius:
            return True
        # bottom cap
        if (px - cx) ** 2 + (py - (y1 - radius)) ** 2 <= radius ** 2 and py > y1 - radius:
            return True
        return False

    def inside_cap(px, py, ccy):
        # rounded horizontal bar centered at (cx, ccy)
        hx0 = cx - cap_w / 2.0
        hx1 = cx + cap_w / 2.0
        cy0 = ccy - cap_h / 2.0
        cy1 = ccy + cap_h / 2.0
        if hx0 + cap_rad <= px <= hx1 - cap_rad and cy0 <= py <= cy1:
            return True
        # left/right rounded ends
        for ex in (hx0 + cap_rad, hx1 - cap_rad):
            if (px - ex) ** 2 + (py - ccy) ** 2 <= cap_rad ** 2:
                return True
        return False

    cap_top_y = y0 - cap_h * 0.35
    cap_bot_y = y1 + cap_h * 0.35

    for y in range(size):
        for x in range(size):
            px, py = x + 0.5, y + 0.5

            # Cream rounded end caps (top & bottom of the pole)
            if inside_cap(px, py, cap_top_y) or inside_cap(px, py, cap_bot_y):
                buf[y][x] = CREAM
                continue

            if inside_round_rect(px, py):
                # diagonal stripe pattern (45deg)
                d = (px + py) % (stripe * 3)
                if d < stripe:
                    col = RED
                elif d < stripe * 2:
                    col = WHITE
                else:
                    col = BLUE
                buf[y][x] = col

    # flatten to RGB bytes
    raw = bytearray()
    for y in range(size):
        raw.append(0)  # filter type 0 per scanline
        for x in range(size):
            raw.extend(buf[y][x])
    return bytes(raw)


def write_png(path, size, pad_ratio=0.0):
    raw = make_icon(size, pad_ratio)

    def chunk(typ, data):
        c = struct.pack(">I", len(data)) + typ + data
        crc = zlib.crc32(typ + data) & 0xFFFFFFFF
        return c + struct.pack(">I", crc)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)  # 8-bit RGB
    idat = zlib.compress(raw, 9)
    png = sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)
    print(f"wrote {path} ({size}x{size}, {len(png)} bytes)")


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here)
    write_png(os.path.join(root, "icon-192.png"), 192, pad_ratio=0.16)
    write_png(os.path.join(root, "icon-512.png"), 512, pad_ratio=0.16)
    write_png(os.path.join(root, "apple-touch-icon.png"), 180, pad_ratio=0.06)
