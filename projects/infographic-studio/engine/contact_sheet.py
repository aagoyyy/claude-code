"""contact_sheet.py <video> <out.png> [cols=6] [rows=5] — evenly spaced frames with timestamps."""
import sys, subprocess, json
from PIL import Image, ImageDraw
v, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6; rows = int(sys.argv[4]) if len(sys.argv) > 4 else 5
dur = float(json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", v], capture_output=True, text=True).stdout)["format"]["duration"])
n = cols * rows; tw, th = 270, 480; sheet = Image.new("RGB", (cols * (tw + 6) + 6, rows * (th + 26) + 6), (18, 18, 22)); d = ImageDraw.Draw(sheet)
for i in range(n):
    t = (i + 0.5) * dur / n
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-vf", f"scale={tw}:{th}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    im = Image.frombytes("RGB", (tw, th), raw); x = 6 + (i % cols) * (tw + 6); y = 6 + (i // cols) * (th + 26)
    sheet.paste(im, (x, y + 20)); d.text((x + 2, y + 3), f"{t:.2f}s", fill=(255, 210, 90))
sheet.save(out); print(out)
