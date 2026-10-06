"""Sestaví HTML stránky prototypu SKOL ze sdílené hlavičky a obsahu stránek.

Použití:  python3 tools/build.py
Výstup:   *.html v kořeni projektu (zdrojem jsou šablony níže).
Volitelně --artifact <složka>: kopie pro náhled na claude.ai (úvodní stránka bez <html>/<head>, odkazy na úvod jako "./").
"""
import os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HEAD = """<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&amp;display=swap">
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/components.css">"""

SHELL_TOP = '<header id="site-header"></header>\n<main id="main">\n'
SHELL_BOTTOM = '\n</main>\n<div id="contact-band"></div>\n<footer id="site-footer"></footer>\n<script src="assets/js/data.js"></script>\n<script src="assets/js/app.js"></script>'

ARROWS = '<div class="shead__arrows"><button type="button" class="ibtn ibtn--elevated" data-prev aria-label="Předchozí produkty"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button><button type="button" class="ibtn ibtn--elevated" data-next aria-label="Další produkty"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button></div>'

PAGES = {
  'index.html': dict(page='home', title='SKOL – vše pro běžky', desc='Běžky, boty, vázání a hole. Vlastní výroba vázání v Dražicích, montáž a půjčovna.', body=f"""
<section id="hero" class="hero" aria-label="Hlavní nabídka"></section>

<section class="uspbar" aria-label="Proč nakoupit u nás">
  <div class="wrap"><ul class="usps usps--strip" id="usps"></ul></div>
</section>

<section class="section" aria-labelledby="h-tiles">
  <div class="wrap">
    <div class="shead"><h2 id="h-tiles">Co hledáte?</h2></div>
    <ul class="tiles" id="tiles"></ul>
  </div>
</section>

<section class="section section--surface" aria-labelledby="h-akce">
  <div class="wrap">
    <div class="shead"><h2 id="h-akce">Akční produkty</h2>{ARROWS}</div>
    <div class="tabs" role="tablist" aria-label="Výběr produktů" id="home-tabs">
      <button type="button" class="tab" role="tab" data-tab="akce" aria-selected="true">Akce</button>
      <button type="button" class="tab" role="tab" data-tab="best" aria-selected="false">Nejprodávanější</button>
      <button type="button" class="tab" role="tab" data-tab="vyprodej" aria-selected="false">Výprodej −40 % a více</button>
    </div>
    <div id="home-products" role="tabpanel"></div>
  </div>
</section>

<section class="section" aria-labelledby="h-brands">
  <div class="wrap">
    <div class="shead"><h2 id="h-brands">Značky</h2></div>
    <ul class="brands" id="brands"></ul>
  </div>
</section>

<section class="section" style="padding-top:0" aria-labelledby="h-poradna">
  <div class="wrap">
    <div class="shead"><h2 id="h-poradna">Poradna</h2><a class="shead__link" href="stranka.html#poradna">Všechny návody</a></div>
    <ul class="articles" id="articles"></ul>
  </div>
</section>

<section class="section section--surface" aria-label="O obchodě">
  <div class="wrap" id="seo"></div>
</section>"""),

  'kategorie.html': dict(page='category', title='Běžecké lyžování | SKOL', desc='Běžky, boty na běžky, vázání a hole.', body="""
<div id="crumbs"></div>
<div class="wrap">
  <div class="cathead" id="cathead"></div>
  <section id="cat-styles" aria-label="Výběr podle stylu" style="padding-bottom:24px"><ul class="guides"></ul></section>
  <div class="listing" id="listing"></div>
</div>
<section class="section section--surface" aria-label="O kategorii">
  <div class="wrap" id="seo"></div>
</section>"""),

  'detail.html': dict(page='detail', title='Detail produktu | SKOL', desc='Detail produktu SKOL.', body=f"""
<div id="crumbs"></div>
<div class="wrap">
  <div class="pdp" id="pdp"></div>
  <section class="pinfo" id="pinfo" aria-label="Informace o produktu"></section>
</div>
<section class="section section--surface" aria-labelledby="h-sim">
  <div class="wrap">
    <div class="shead"><h2 id="h-sim">Podobné produkty</h2>{ARROWS}</div>
    <div id="similar"></div>
  </div>
</section>
<section class="section" aria-labelledby="h-ext">
  <div class="wrap">
    <div class="shead"><h2 id="h-ext">Doplňte výbavu</h2>{ARROWS}</div>
    <div id="extras"></div>
  </div>
</section>"""),

  'kosik.html': dict(page='cart', title='Košík | SKOL', desc='Nákupní košík.', body=f"""
<div class="wrap">
  <div style="height:16px"></div>
  <div class="cart" id="cart"></div>
</div>
<section class="section section--surface" id="cart-best" aria-labelledby="h-best" hidden>
  <div class="wrap">
    <div class="shead"><h2 id="h-best">Nejprodávanější</h2>{ARROWS}</div>
    <div id="cart-best-list"></div>
  </div>
</section>"""),

  'stranka.html': dict(page='page', title='SKOL', desc='Informace SKOL.', body="""
<div id="crumbs"></div>
<div class="wrap"><article class="page" id="page"></article></div>"""),
}


def full(name, cfg):
    return ('<!doctype html>\n<html lang="cs">\n<head>\n' + HEAD.format(**cfg) + '\n</head>\n'
            '<body data-page="' + cfg['page'] + '">\n' + SHELL_TOP + cfg['body'].strip('\n') + SHELL_BOTTOM + '\n</body>\n</html>\n')


def main():
    for name, cfg in PAGES.items():
        with open(os.path.join(ROOT, name), 'w', encoding='utf-8') as f:
            f.write(full(name, cfg))
        print('napsáno', name)
    if '--artifact' in sys.argv:
        out = sys.argv[sys.argv.index('--artifact') + 1]
        if os.path.exists(out):
            shutil.rmtree(out)
        shutil.copytree(os.path.join(ROOT, 'assets'), os.path.join(out, 'assets'))
        for name, cfg in PAGES.items():
            html = full(name, cfg).replace('href="index.html"', 'href="./"')
            if name == 'index.html':
                # Artifact obalí úvodní stránku vlastní kostrou – vynechat doctype/html/head/body.
                head = HEAD.format(**cfg).replace('<meta charset="utf-8">\n', '').replace('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n', '')
                html = head + '\n' + SHELL_TOP + cfg['body'].strip('\n') + SHELL_BOTTOM + '\n'
            with open(os.path.join(out, name), 'w', encoding='utf-8') as f:
                f.write(html)
        js = os.path.join(out, 'assets', 'js', 'app.js')
        s = open(js, encoding='utf-8').read().replace("href=\"index.html\"", 'href="./"')
        open(js, 'w', encoding='utf-8').write(s)
        print('artifact →', out)


if __name__ == '__main__':
    main()
