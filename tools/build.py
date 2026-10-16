#!/usr/bin/env python3
"""Sestaví web ze zdrojových komponent návrhu (src/*.dc.html).

Výstup:
  assets/js/components.js  – všechny komponenty (šablona jako strom, logika, styly do <head>)
  *.html                   – jedna stránka na každý artboard ze seznamu PAGES

Spuštění z kořene repozitáře:  python3 tools/build.py
Bez závislostí (jen standardní knihovna Pythonu 3.8+).
"""
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
IMG = os.path.join(ROOT, 'assets', 'img')

# Artboard → soubor stránky. Komponenty, které nejsou stránkou (Header, Footer, ProductCard), tu nejsou.
PAGES = {
    'HP': 'index.html',
    'Kategorie': 'kategorie.html',
    'Detail': 'detail.html',
    'Kosik': 'kosik.html',
    'Stranka': 'o-nas.html',
    'StrankaAkce': 'akce.html',
    'StrankaKontakt': 'kontakt.html',
    'StrankaObchodniPodminky': 'obchodni-podminky.html',
    'StrankaPoradna': 'poradna.html',
    'StrankaProdejny': 'prodejny.html',
    'StrankaPujcovna': 'pujcovna.html',
    'StrankaReklamace': 'reklamace.html',
    'StrankaVelkoobchod': 'velkoobchod.html',
    'Main': 'prehled.html',
    'Ikony': 'ikony.html',
}

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}
RAW_TEXT = {'script', 'style'}

TOKEN = re.compile(r'<!--.*?-->|<(/?)([A-Za-z][A-Za-z0-9:-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+))?)*)\s*(/?)>', re.S)
ATTR = re.compile(r'([^\s=/>]+)(?:\s*=\s*("([^"]*)"|\'([^\']*)\'|([^\s>]+)))?')


def parse(src):
    """Jednoduchý tolerantní parser HTML šablony → strom [tag, {attrs}, [děti]] / text.
    Zachovává velikost písmen v názvech atributů (onClick, viewBox) a nepřesouvá prvky
    (na rozdíl od prohlížeče, který by <sc-for> uvnitř <tbody> vystrčil ven)."""
    root = ['#root', {}, []]
    stack = [root]
    pos = 0
    while True:
        m = TOKEN.search(src, pos)
        text = src[pos:m.start() if m else len(src)]
        if text:
            stack[-1][2].append(html.unescape(text))
        if not m:
            break
        pos = m.end()
        tok = m.group(0)
        if tok.startswith('<!--'):
            continue
        closing, tag, attrs_s, selfclose = m.group(1), m.group(2), m.group(3), m.group(4)
        if closing:
            for i in range(len(stack) - 1, 0, -1):
                if stack[i][0] == tag:
                    del stack[i:]
                    break
            continue
        attrs = {}
        for a in ATTR.finditer(attrs_s or ''):
            name = a.group(1)
            if a.group(2) is None:
                val = ''
            else:
                val = a.group(3) if a.group(3) is not None else (a.group(4) if a.group(4) is not None else a.group(5))
                val = html.unescape(val)
            attrs[name] = val
        node = [tag, attrs, []]
        stack[-1][2].append(node)
        if tag.lower() in RAW_TEXT:
            end = re.compile(r'</%s\s*>' % tag, re.I).search(src, pos)
            node[2].append(src[pos:end.start()] if end else src[pos:])
            pos = end.end() if end else len(src)
            continue
        if not selfclose and tag.lower() not in VOID:
            stack.append(node)
    return root[2]


def strip_ws(nodes, pre=False):
    """Odstraní čistě bílé textové uzly mezi prvky (jako odsazení ve zdroji)."""
    out = []
    for n in nodes:
        if isinstance(n, str):
            if not pre and n.strip() == '' and '\n' in n:
                continue
            out.append(n)
        else:
            tag = n[0].lower()
            n[2] = n[2] if tag in RAW_TEXT else strip_ws(n[2], pre or tag in ('pre', 'textarea'))
            out.append(n)
    return out


def find(nodes, tag):
    for n in nodes:
        if isinstance(n, list):
            if n[0].lower() == tag:
                return n
            r = find(n[2], tag)
            if r is not None:
                return r
    return None


def serialize(nodes):
    """Strom zpět na HTML (pro obsah <helmet>)."""
    out = []
    for n in nodes:
        if isinstance(n, str):
            out.append(n)
            continue
        tag, attrs, kids = n
        a = ''.join(' %s="%s"' % (k, html.escape(v, quote=True)) if v != '' else ' ' + k for k, v in attrs.items())
        if tag.lower() in VOID:
            out.append('<%s%s>' % (tag, a))
        else:
            inner = kids[0] if tag.lower() in RAW_TEXT and kids else serialize(kids)
            out.append('<%s%s>%s</%s>' % (tag, a, inner, tag))
    return ''.join(out)


def load(name):
    with open(os.path.join(SRC, name + '.dc.html'), encoding='utf-8') as f:
        src = f.read()
    title = re.search(r'<title>(.*?)</title>', src, re.S)
    lang = re.search(r'<html[^>]*\blang="([^"]+)"', src)
    xdc = re.search(r'<x-dc>(.*)</x-dc>', src, re.S)
    script = re.search(r'<script type="text/x-dc"[^>]*data-props=\'([^\']*)\'[^>]*>(.*?)</script>', src, re.S)
    tree = strip_ws(parse(xdc.group(1)))
    helmet = find(tree, 'helmet')
    helmet_html = serialize(helmet[2]).strip() if helmet else ''
    if helmet:
        tree = [n for n in tree if n is not helmet]
    props = json.loads(html.unescape(script.group(1))) if script else {}
    return {
        'title': html.unescape(title.group(1).strip()) if title else name,
        'lang': lang.group(1) if lang else 'cs',
        'helmet': helmet_html,
        'tree': tree,
        'preview': props.get('$preview'),
        'logic': script.group(2).strip() if script else 'class Component extends DCLogic { renderVals() { return {}; } }',
    }


def image_map():
    m = {}
    for f in sorted(os.listdir(IMG)):
        stem, ext = os.path.splitext(f)
        if re.fullmatch(r'[0-9a-f]{32}', stem):
            m[stem] = 'assets/img/' + f
    return m


PAGE_TMPL = '''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>html,body{{overflow-x:hidden;overflow-x:clip}}</style>
<!-- Vygenerováno skriptem tools/build.py ze src/{name}.dc.html – needitujte ručně, upravte zdroj a spusťte build. -->
</head>
<body>
<div id="app"></div>
<noscript>Pro zobrazení stránky povolte JavaScript.</noscript>
<script src="assets/js/components.js"></script>
<script src="assets/js/dc-runtime.js"></script>
<script>DC.mount({name_js}, document.getElementById('app'));</script>
</body>
</html>
'''


def main():
    names = sorted(f[:-len('.dc.html')] for f in os.listdir(SRC) if f.endswith('.dc.html'))
    comps = {n: load(n) for n in names}
    links = {n + '.dc.html': PAGES[n] for n in names if n in PAGES}
    data = {'components': comps, 'links': links, 'images': image_map()}
    js = ('/* Vygenerováno skriptem tools/build.py ze src/*.dc.html – needitujte ručně. */\n'
          'window.DC_DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    # logiku vkládáme jako zdrojový text; </script> uvnitř řetězce by HTML stránku nerozbil, ale pro jistotu:
    js = js.replace('</script', '<\\/script')
    with open(os.path.join(ROOT, 'assets', 'js', 'components.js'), 'w', encoding='utf-8') as f:
        f.write(js)
    for n, page in PAGES.items():
        if n not in comps:
            print('chybí src/%s.dc.html – stránka %s přeskočena' % (n, page), file=sys.stderr)
            continue
        c = comps[n]
        with open(os.path.join(ROOT, page), 'w', encoding='utf-8') as f:
            f.write(PAGE_TMPL.format(lang=c['lang'], title=html.escape(c['title']), name=n, name_js=json.dumps(n)))
    print('Hotovo: %d komponent, %d stránek, %d obrázků' % (len(comps), len([n for n in PAGES if n in comps]), len(data['images'])))


if __name__ == '__main__':
    main()
