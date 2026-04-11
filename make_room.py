#!/usr/bin/env python3
"""
Compositer et maleri ind i det skandinaviske stue-foto.
Målområdet er den eksisterende ramme på væggen: ca. 36-68% X, 3.5-63% Y
Usage: python3 make_room.py <maleri.jpg> <output.jpg> [room-bg.jpg]
"""
import sys
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import math

def make_room_preview(painting_path, output_path, room_path, size_cm=None, width_cm=None, height_cm=None):
    room = Image.open(room_path).convert('RGB')
    painting = Image.open(painting_path).convert('RGB')

    rw, rh = room.size

    # Optimal placering over sofaen på den tomme hvide væg
    frame_x1 = int(rw * 0.38)
    frame_y1 = int(rh * 0.12)
    frame_x2 = int(rw * 0.78)
    frame_y2 = int(rh * 0.48)
    frame_w = frame_x2 - frame_x1
    frame_h = frame_y2 - frame_y1

    # Tilpas maleriets proportioner til rammeområdet
    pw, ph = painting.size

    # Brug eksplicitte bredde/højde-værdier hvis angivet (width_cm = vandret, height_cm = lodret)
    if width_cm and height_cm:
        w_cm = float(width_cm)  # BREDDE = vandret
        h_cm = float(height_cm) # HØJDE = lodret
        scale = min(frame_w / w_cm, frame_h / h_cm) * 0.80
        new_w = int(w_cm * scale)
        new_h = int(h_cm * scale)
    elif size_cm:
        try:
            parts = size_cm.replace('×','x').split('x')
            w_cm = float(parts[0].strip())  # første tal = BREDDE
            h_cm = float(parts[1].strip())  # andet tal = HØJDE
            scale = min(frame_w / w_cm, frame_h / h_cm) * 0.80
            new_w = int(w_cm * scale)
            new_h = int(h_cm * scale)
        except:
            ratio = min(frame_w / pw, frame_h / ph) * 0.80
            new_w = int(pw * ratio)
            new_h = int(ph * ratio)
    else:
        ratio = min(frame_w / pw, frame_h / ph) * 0.80
        new_w = int(pw * ratio)
        new_h = int(ph * ratio)

    painting_resized = painting.resize((new_w, new_h), Image.LANCZOS)

    # Centrer i frame-området
    paste_x = frame_x1 + (frame_w - new_w) // 2
    paste_y = frame_y1 + (frame_h - new_h) // 2

    # Tilføj ramme (guldfarvet)
    frame_thickness = max(8, int(new_w * 0.015))
    shadow = 6

    # Lav kopi af rummet
    result = room.copy()

    # Let skygge bag rammen
    shadow_layer = Image.new('RGBA', room.size, (0,0,0,0))
    draw = ImageDraw.Draw(shadow_layer)
    draw.rectangle([
        paste_x - frame_thickness + shadow,
        paste_y - frame_thickness + shadow,
        paste_x + new_w + frame_thickness + shadow,
        paste_y + new_h + frame_thickness + shadow
    ], fill=(0,0,0,80))
    shadow_blur = shadow_layer.filter(ImageFilter.GaussianBlur(radius=12))
    result = result.convert('RGBA')
    result = Image.alpha_composite(result, shadow_blur).convert('RGB')

    # Ramme baggrund (guld-lignende)
    draw2 = ImageDraw.Draw(result)
    draw2.rectangle([
        paste_x - frame_thickness,
        paste_y - frame_thickness,
        paste_x + new_w + frame_thickness,
        paste_y + new_h + frame_thickness
    ], fill=(195, 165, 115))  # guldfarve

    # Indre hvid kant
    draw2.rectangle([
        paste_x - 2,
        paste_y - 2,
        paste_x + new_w + 2,
        paste_y + new_h + 2
    ], fill=(240, 238, 232))

    # Paste maleriet
    result.paste(painting_resized, (paste_x, paste_y))

    # Let brightness-justering for at matche rummets lys
    result = ImageEnhance.Brightness(result).enhance(1.0)

    result.save(output_path, 'JPEG', quality=90)
    print(f"Gemt: {output_path} ({new_w}x{new_h}px maleri i {rw}x{rh}px rum)")

if __name__ == '__main__':
    painting = sys.argv[1]
    output = sys.argv[2]
    room = sys.argv[3] if len(sys.argv) > 3 else '/var/www/frub-app/public/images/room-bg.jpg'
    size_cm = sys.argv[4] if len(sys.argv) > 4 else None
    make_room_preview(painting, output, room, size_cm)
