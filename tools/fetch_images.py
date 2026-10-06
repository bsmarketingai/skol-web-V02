"""Stáhne fotky ze skol.net podle assets/img/zdroje.json, zmenší je a uloží jako assets/img/<klíč>.jpg.
Potom v assets/js/data.js nastavte hasImages: true.
Použití: pip install pillow && python3 tools/fetch_images.py"""
import io, json, os, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'assets', 'img')
MAX = {'ban': 1800, 'cat': 900, 'logo': 600}
for key, url in json.load(open(os.path.join(IMG, 'zdroje.json'))).items():
    try:
        raw = urllib.request.urlopen(url, timeout=30).read()
    except Exception as e:
        print('CHYBA', key, e); continue
    im = Image.open(io.BytesIO(raw))
    lim = MAX.get(key.split('_')[0], 1000)
    im.thumbnail((lim, lim))
    if key == 'logo':
        im.save(os.path.join(IMG, 'logo.png'), optimize=True)
    else:
        im.convert('RGB').save(os.path.join(IMG, key + '.jpg'), quality=82, optimize=True, progressive=True)
    print('OK', key, im.size)
