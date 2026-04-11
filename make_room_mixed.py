#!/usr/bin/env python3
"""
Compositer et mixed media-værk ind i entre-foto over konsolbordet.
"""
import sys
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

def make_room_preview(painting_path, output_path, room_path, width_cm=None, height_cm=None):
    room = Image.open(room_path).convert('RGB')
    painting = Image.open(painting_path).convert('RGB')

    rw, rh = room.size

    # Placering: over konsolbordet til venstre for vinduet
    frame_x1 = int(rw * 0.05)
    frame_y1 = int(rh * 0.08)
    frame_x2 = int(rw * 0.35)
    frame_y2 = int(rh * 0.40)
    frame_w = frame_x2 - frame_x1
    frame_h = frame_y2 - frame_y1

    pw, ph = painting.size

    if width_cm and height_cm:
        w_cm = float(width_cm)
        h_cm = float(height_cm)
        scale = min(frame_w / w_cm, frame_h / h_cm) * 0.78
        new_w = int(w_cm * scale)
        new_h = int(h_cm * scale)
    else:
        ratio = min(frame_w / pw, frame_h / ph) * 0.78
        new_w = int(pw * ratio)
        new_h = int(ph * ratio)

    painting_resized = painting.resize((new_w, new_h), Image.LANCZOS)

    # Centrer i frame-området
    paste_x = frame_x1 + (frame_w - new_w) // 2
    paste_y = frame_y1 + (frame_h - new_h) // 2

    frame_thickness = max(6, int(new_w * 0.015))
    shadow = 5

    result = room.copy()

    # Skygge
    shadow_layer = Image.new('RGBA', room.size, (0,0,0,0))
    draw = ImageDraw.Draw(shadow_layer)
    draw.rectangle([
        paste_x - frame_thickness + shadow,
        paste_y - frame_thickness + shadow,
        paste_x + new_w + frame_thickness + shadow,
        paste_y + new_h + frame_thickness + shadow
    ], fill=(0,0,0,70))
    shadow_blur = shadow_layer.filter(ImageFilter.GaussianBlur(radius=10))
    result = result.convert('RGBA')
    result = Image.alpha_composite(result, shadow_blur).convert('RGB')

    # Tyn hvid ramme
    draw2 = ImageDraw.Draw(result)
    draw2.rectangle([
        paste_x - frame_thickness,
        paste_y - frame_thickness,
        paste_x + new_w + frame_thickness,
        paste_y + new_h + frame_thickness
    ], fill=(235, 230, 220))

    draw2.rectangle([
        paste_x - 2,
        paste_y - 2,
        paste_x + new_w + 2,
        paste_y + new_h + 2
    ], fill=(245, 242, 238))

    result.paste(painting_resized, (paste_x, paste_y))
    result.save(output_path, 'JPEG', quality=90)
    print(f"Gemt: {output_path} ({new_w}x{new_h}px)")

if __name__ == '__main__':
    painting = sys.argv[1]
    output = sys.argv[2]
    room = sys.argv[3] if len(sys.argv) > 3 else '/var/www/frub-app/public/images/room-bg-mixed.jpg'
    size = sys.argv[4] if len(sys.argv) > 4 else None
    w, h = None, None
    if size:
        try:
            parts = size.replace('×','x').split('x')
            h = float(parts[0])  # højde først
            w = float(parts[1])
        except: pass
    make_room_preview(painting, output, room, w, h)
