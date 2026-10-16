# SKOL – redesign e-shopu (klikací prototyp)

Klikací a responzivní prototyp nového webu **skol.net** od studia BSSHOP.
Vychází 1 : 1 z návrhu v Claude Design („SKOL – web (náhled stránek)“, stav k 16. 10. 2026): každý artboard návrhu je tu jedna stránka a vypadá i se chová stejně jako v návrhu (hover stavy, mega menu, našeptávač, mini košík, přihlášení, karusely, filtry, kroky košíku, mobilní menu).

- Čisté HTML + JavaScript, bez frameworku, bez závislostí a bez sestavování při běhu.
- Styly jsou přímo v komponentách (stejně jako v návrhu), písmo Open Sans z Google Fonts.
- Fotky jsou v `assets/img/` (název = ID souboru z návrhu).

## Spuštění

```bash
python3 -m http.server 8000
# otevřít http://localhost:8000
```

Funguje i přímé otevření `index.html` z disku (`file://`).

## Stránky

| Soubor | Artboard v návrhu |
|---|---|
| `index.html` | Homepage |
| `kategorie.html` | Kategorie – Běžecké lyžování |
| `detail.html` | Detail produktu – SPINE RS ENERGY 258 |
| `kosik.html` | Košík (3 kroky: Nákupní košík → Kontaktní údaje → Kontrola údajů) |
| `o-nas.html` | O nás |
| `akce.html` | Naše akce |
| `kontakt.html` | Kontakty |
| `prodejny.html` | Prodejny |
| `pujcovna.html` | Půjčovna |
| `poradna.html` | Poradna |
| `obchodni-podminky.html` | Obchodní podmínky |
| `reklamace.html` | Reklamace |
| `velkoobchod.html` | Velkoobchod |
| `prehled.html` | Přehled stránek |
| `ikony.html` | Sada ikon (Tabler) |

Hlavička (`Header`), patička (`Footer`) a karta produktu (`ProductCard`) jsou sdílené komponenty – jsou ve všech stránkách stejné.

## Struktura

```
src/*.dc.html            zdrojové komponenty z návrhu (šablona + logika) – tady se dělají úpravy
assets/js/components.js  vygenerované ze src/ skriptem tools/build.py (needitovat ručně)
assets/js/dc-runtime.js  malý běhový modul (~400 řádků), který komponenty vykreslí do stránky
assets/img/              fotky, loga a ikony dopravců/plateb
tools/build.py           sestaví components.js a stránky *.html ze src/
*.html                   vygenerované stránky (needitovat ručně)
```

### Jak upravit web

1. Upravte komponentu v `src/` (nebo ji v návrhu upravte a znovu vyexportujte do `src/`).
2. Spusťte `python3 tools/build.py` (jen standardní Python 3, bez balíčků).
3. Obnovte stránku v prohlížeči.

### Formát komponent (`src/*.dc.html`)

Každý soubor je jedna komponenta: HTML šablona v `<x-dc>`, styly / písma do `<head>` v `<helmet>` a logika ve `<script type="text/x-dc">`:

- `{{cesta.k.hodnote}}` – hodnota z `renderVals()` (jen tečková cesta, ne výraz),
- `onClick="{{fn}}"`, `onMouseEnter`, `onChange`, `onInput`, `onFocus`, … – události,
- `<sc-if value="{{x}}">` – podmínka, `<sc-for list="{{xs}}" as="x">` – cyklus (uvnitř `{{x.…}}`, `{{$index}}`),
- `<dc-import name="Header" …>` – vnořená komponenta, atributy jsou její `props`,
- logika: `class Component extends DCLogic { renderVals() { … } }` se `this.state`, `this.setState()`, `this.props`, `componentDidMount()`, `componentWillUnmount()`.

Odkazy mezi artboardy (`href="Kategorie.dc.html"`) a obrázky z návrhu (`/_blob/<id>`) runtime automaticky převede na `kategorie.html` a `assets/img/<id>.jpg`.

## Responzivita

Breakpointy (min-width): **320 · 420 · 550 · 820 · 1000 · 1200 (hlavička) · 1362 · 1745**. Nad 1745 px je obsah na střed.
Pod 1200 px má hlavička hamburger menu (vpravo, modré tlačítko) a hledání pod logem.
Rozvržení se počítá podle šířky okna v logice komponent (`vw`), proto stránka potřebuje JavaScript.

## Poznámky pro implementaci

- Data (produkty, kategorie, ceny, texty) jsou v logice komponent jako ukázková; v ostrém provozu je dodá platforma BSSHOP.
- Formuláře (hledání, přihlášení, košík) v prototypu nic neodesílají.
- Fotky u části podkategorií v mega menu jsou zatím zástupné (jiný produkt z nabídky) – nahradit reálnými obrázky kategorií.
