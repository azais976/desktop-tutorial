#!/usr/bin/env python3
"""Generate BarberLink PWA PNG icons with a hand-rolled PNG encoder (no deps).

Draws a 3D-shaded barber pole (cylinder lighting, specular highlight, chrome
end caps, drop shadow, radial-gradient background). The same file works as a
normal icon, a maskable icon and an iOS apple-touch-icon.
"""
import struct, zlib, math, os

# Brand palette
BG_IN   = (28, 28, 32)
BG_OUT  = (8, 8, 10)
RED     = (208, 40, 40)
WHITE   = (245, 245, 245)
BLUE    = (28, 84, 165)
CHROME  = (239, 227, 200)   # cream chrome caps


def clamp(v):
    return 0 if v < 0 else (255 if v > 255 else int(round(v)))


def mix(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


def scale(c, f):
    return (c[0] * f, c[1] * f, c[2] * f)


def make_icon(size, pad_ratio=0.0):
    px = [[(0.0, 0.0, 0.0) for _ in range(size)] for _ in range(size)]

    cx = cy = size / 2.0
    safe = size * (1.0 - pad_ratio)
    maxr = math.hypot(cx, cy)

    # --- background : radial gradient + subtle vignette ---
    for y in range(size):
        for x in range(size):
            d = math.hypot(x + 0.5 - cx, y + 0.5 - cy) / maxr
            px[y][x] = mix(BG_IN, BG_OUT, min(1.0, d * 1.15))

    # --- pole geometry ---
    pole_w = safe * 0.34
    pole_h = safe * 0.60
    x0, x1 = cx - pole_w / 2.0, cx + pole_w / 2.0
    y0, y1 = cy - pole_h / 2.0, cy + pole_h / 2.0
    radius = pole_w / 2.0
    stripe = safe * 0.105

    # --- soft drop shadow beneath the pole ---
    sh_cx, sh_cy = cx + size * 0.02, y1 + pole_w * 0.42
    sh_rx, sh_ry = pole_w * 0.95, pole_w * 0.28
    for y in range(int(sh_cy - sh_ry * 3), int(sh_cy + sh_ry * 3) + 1):
        if y < 0 or y >= size:
            continue
        for x in range(int(sh_cx - sh_rx * 3), int(sh_cx + sh_rx * 3) + 1):
            if x < 0 or x >= size:
                continue
            nx = (x + 0.5 - sh_cx) / sh_rx
            ny = (y + 0.5 - sh_cy) / sh_ry
            dd = nx * nx + ny * ny
            if dd < 9:
                a = math.exp(-dd * 0.8) * 0.55
                px[y][x] = mix(px[y][x], (0, 0, 0), a)

    def cyl_shade(u):
        """u in [-1,1] across pole width -> (shade factor, specular add)."""
        u = max(-1.0, min(1.0, u))
        # surface normal angle; light from upper-left
        ndotl = math.cos(u * 1.32) * 0.78 + 0.30  # diffuse term
        shade = 0.30 + 0.85 * max(0.0, ndotl)      # ambient + diffuse
        # specular band slightly left of centre
        spec = math.exp(-((u + 0.34) ** 2) / 0.012) * 0.9
        return shade, spec

    def cap(cy_c, half_h):
        """Draw a chrome dome cap centred at cy_c with given half height."""
        cap_w = pole_w * 1.20
        hx0, hx1 = cx - cap_w / 2.0, cx + cap_w / 2.0
        cr = half_h
        for y in range(int(cy_c - half_h - 1), int(cy_c + half_h + 2)):
            if y < 0 or y >= size:
                continue
            for x in range(int(hx0 - 1), int(hx1 + 2)):
                if x < 0 or x >= size:
                    continue
                fx, fy = x + 0.5, y + 0.5
                inside = False
                if hx0 + cr <= fx <= hx1 - cr and cy_c - half_h <= fy <= cy_c + half_h:
                    inside = True
                else:
                    for ex in (hx0 + cr, hx1 - cr):
                        if (fx - ex) ** 2 + (fy - cy_c) ** 2 <= cr * cr:
                            inside = True
                            break
                if not inside:
                    continue
                # vertical chrome gradient (dark -> bright -> dark) + horiz cylinder
                vy = (fy - (cy_c - half_h)) / (2 * half_h)
                vshade = 0.55 + 0.75 * math.sin(vy * math.pi)
                u = (fx - cx) / (cap_w / 2.0)
                hshade = 0.7 + 0.4 * math.cos(u * 1.2)
                col = scale(CHROME, min(1.25, vshade * hshade))
                # top highlight glint
                if vy < 0.32:
                    col = mix(col, (255, 255, 255), (0.32 - vy) * 1.4)
                px[y][x] = (min(255, col[0]), min(255, col[1]), min(255, col[2]))

    def inside_body(fx, fy):
        if x0 <= fx <= x1 and y0 + radius <= fy <= y1 - radius:
            return True
        if fx >= x0 and fx <= x1:
            if fy < y0 + radius and (fx - cx) ** 2 + (fy - (y0 + radius)) ** 2 <= radius ** 2:
                return True
            if fy > y1 - radius and (fx - cx) ** 2 + (fy - (y1 - radius)) ** 2 <= radius ** 2:
                return True
        return False

    # --- glass tube body with diagonal stripes + cylinder shading ---
    for y in range(int(y0 - 2), int(y1 + 2)):
        if y < 0 or y >= size:
            continue
        for x in range(int(x0 - 2), int(x1 + 2)):
            if x < 0 or x >= size:
                continue
            fx, fy = x + 0.5, y + 0.5
            if not inside_body(fx, fy):
                continue
            u = (fx - cx) / radius
            shade, spec = cyl_shade(u)
            d = (fx + fy) % (stripe * 3)
            if d < stripe:
                base = RED
            elif d < stripe * 2:
                base = WHITE
            else:
                base = BLUE
            col = scale(base, shade)
            col = (col[0] + 255 * spec, col[1] + 255 * spec, col[2] + 255 * spec)
            # thin dark rim at the tube edges for glassy depth
            edge = abs(u)
            if edge > 0.86:
                col = mix(col, (0, 0, 0), (edge - 0.86) / 0.14 * 0.55)
            px[y][x] = (min(255, col[0]), min(255, col[1]), min(255, col[2]))

    # caps on top of body
    cap(y0, safe * 0.052)
    cap(y1, safe * 0.052)

    # --- encode ---
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size):
            c = px[y][x]
            raw.extend((clamp(c[0]), clamp(c[1]), clamp(c[2])))
    return bytes(raw)


def write_png(path, size, pad_ratio=0.0):
    raw = make_icon(size, pad_ratio)

    def chunk(typ, data):
        c = struct.pack(">I", len(data)) + typ + data
        crc = zlib.crc32(typ + data) & 0xFFFFFFFF
        return c + struct.pack(">I", crc)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    idat = zlib.compress(raw, 9)
    png = sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)
    print(f"wrote {path} ({size}x{size}, {len(png)} bytes)")


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here)
    write_png(os.path.join(root, "icon-192.png"), 192, pad_ratio=0.18)
    write_png(os.path.join(root, "icon-512.png"), 512, pad_ratio=0.18)
    write_png(os.path.join(root, "apple-touch-icon.png"), 180, pad_ratio=0.08)
