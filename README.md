# SKOL – redesign e-shopu (klikací prototyp)

Klikací a plně responzivní prototyp nového webu **skol.net**, který připravilo studio BSSHOP.
Komponenty pochází z knihovny BSSHOP v Claude Design (mapování v `docs/KOMPONENTY.md`), barvy z design systému SKOL. Samostatný grafický návrh není: tento prototyp je návrh i podklad zároveň.
Tento repozitář je podklad pro implementaci do e-shopové platformy (Pohoda / BSSHOP).

- Čisté HTML + CSS + JavaScript. Bez sestavování, bez závislostí a bez frameworku.
- Texty, názvy, ceny a slevy jsou převzaté ze skol.net (stav k 4. 10. 2026).
- Fotky jsou převzaté ze skol.net (5. 10. 2026) a zmenšené v `assets/img/`.

## Spuštění

```bash
python3 -m http.server 8000
# otevřít http://localhost:8000
```

Stačí jakýkoli statický server. Přímé otevření souboru (`file://`) funguje taky, jen odkaz „úvod“ vede na `index.html`.

## Stránky

| Soubor | Co obsahuje | Proklik |
|---|---|---|
| `index.html` | Homepage: slider, kategorie, výběr podle stylu, akční produkty se záložkami, výhody, značky, poradna, SEO text | vše vede na kategorii, detail nebo obsahovou stránku |
| `kategorie.html#<id>` | Výpis s filtry (druh, styl, vázání, značka, cena), řazením, aktivními filtry a „Zobrazit další“ | `#bezecke-lyzovani`, `#akcni-produkty`, `#sjezdove-lyzovani`, `#styl-klasika` / `#styl-brusleni` / `#styl-kombi`, `#hledat` (výsledky hledání); ostatní kategorie ukážou prázdný stav |
| `detail.html#<id-produktu>` | Galerie, varianty (velikost / délka) se skladem, tabulka velikostí, montáž vázání (u lyží a setů), množství, Do košíku, popis a parametry, podobné produkty, doplňky | např. `#spine-rs-energy-258`, `#set-fischer-fibre-crown` |
| `kosik.html` | Položky, změna množství, odebrání, souhrn s úsporou a cenou bez DPH | dál „Doprava a platba“ (zde prototyp končí) |
| `stranka.html#<slug>` | Obsahové stránky (O nás, Prodejny, Půjčovna, Poradna…) | texty k doplnění označené [ ] |

Stav se předává přes `#hash`, ne přes query string. Na ostrém webu ho nahradí normální URL platformy.

## Struktura

```
assets/
  css/tokens.css      design tokeny (barvy, písmo, mezery, breakpointy) – jediné místo pro vzhled značky
  css/base.css        základ a atomy: Button, IconButton, Badge, Price, Stock, Chip, pole, QuantityStepper
  css/components.css  bloky a sekce: Header, HeroBanners, CategoryTiles, ProductCard, ProductCarousel, …
  js/data.js          data prototypu (kategorie, produkty, texty) – v ostrém provozu je dodá platforma
  js/app.js           chování a šablony komponent (menu, hledání, karusely, filtry, galerie, košík)
  img/zdroje.json     klíče fotek a jejich adresy na cdn.skol.net
tools/
  build.py            vygeneruje HTML stránky ze sdílené hlavičky (upravujte šablony v něm, ne výstup)
  fetch_images.py     stáhne a zmenší fotky ze skol.net do assets/img/
docs/
  KOMPONENTY.md       mapování na knihovnu komponent, breakpointy, tokeny
```

## Breakpointy

Mobile-first, `min-width`: **XXS 320 · XS 420 · S 550 · M 820 · L 1000 · XL 1362 · XXL 1745**.
Nad 1745 px je obsah na střed (max. šířka 1745 px). Pod 1000 px je hamburger menu a hledání pod hlavičkou.
Podrobnosti po komponentách najdete v `docs/KOMPONENTY.md`.

## Fotky

Fotky jsou v `assets/img/` (klíč = hodnota `img` v `data.js`), zdrojové adresy v `assets/img/zdroje.json`.
Fotka u SEO textu (`seo_bezky.jpg`) fotky Poradny (`g_*.jpg`) fotka u kontaktu (`k_kontakt.jpg`) a fotky dlaždic kategorií (`t_*.jpg`) jsou výřezy z bannerů. Lední brusle a Oblečení zatím fotku nemají. Jsou zástupné, dokud SKOL nedodá vlastní.
Znovu je stáhne `python3 tools/fetch_images.py` (vyžaduje Pillow). `hasImages: false` v `data.js` vrátí rámečky.

Na ostrém webu fotky dodá platforma. Klíč `img` u produktu je jen vazba pro prototyp.

## Co je zástupné (doplní SKOL)

- Logo je převzaté ze stávajícího webu (PNG). Na ostrém webu ho ideálně nahradí SVG.
- Podkategorie v mega menu jsou návrh, hlavní kategorie odpovídají webu.
- Ceník montáže vázání („dle ceníku“), ceny dopravy a platby.
- Tabulka délek lyží podle hmotnosti. Hodnoty jsou zatím v PDF v Poradně.
- Texty obsahových stránek označené `[ ]`.
- U setu FISCHER uvádí stávající web jako výrobce „ATOMIC“. V prototypu je FISCHER, je potřeba to ověřit.

## Přístupnost

- Skutečné `button` / `a` / `input` s popisky.
- Viditelný focus, ovládání z klávesnice (menu, záložky, výběr varianty šipkami), Esc zavírá menu i panely.
- Kontrast textu min. 4,5 : 1. Zelená „Skladem“ je kvůli tomu ztmavená na #00851C.
- Respektuje `prefers-reduced-motion`.
