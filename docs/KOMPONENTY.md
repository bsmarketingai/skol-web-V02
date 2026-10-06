# Komponenty – mapování na knihovnu BSSHOP

Každá komponenta v kódu odpovídá komponentě z knihovny v Claude Design. Vzhled je řízený tokeny v `assets/css/tokens.css` (`--c-*`, `--font-*`, `--r-*`), jejichž názvy jsou stejné jako v knihovně.

## Atomy (`base.css`)

| Knihovna | Třída | Varianty / stavy |
|---|---|---|
| Button | `.btn` | `--primary`, `--dark` (Varianty), `--secondary`, `--ghost`, `--link`; velikosti `--s`, `--l`; `--full` |
| IconButton | `.ibtn` | `--elevated`; počet v košíku `.ibtn__count` |
| Badge | `.badge` | `--tip` (Akce, oranžová), `--new`, `--bubble` (sleva, žlutá) |
| Price | `.price` | `--sale`, `--l` (detail); `__old`, `__save`, `__vat` |
| Stock | `.stock` | skladem (zelená #00851C) |
| Chip | `.chip` | `--on`, `--remove` (aktivní filtr) |
| TextField / Select | `.input`, `.select`, `.field` | focus |
| Checkbox | `.check` | počet `__count`, disabled |
| Switch | `.switch` | (Jen skladem) |
| QuantityStepper | `.qty` | `--s` (košík) |
| SectionHeading | `.shead` | šipky karuselu `.shead__arrows` od L |

Zaoblení: tlačítka, záložky, chipy, kontaktní tlačítka a dlaždice mají `--r-m` (4 px). Plně kulaté (`--r-pill`) jsou jen odznaky, počítadla a přepínač.

## Bloky a sekce (`components.css`)

| Knihovna | Třída | Chování podle breakpointu |
|---|---|---|
| Header (navStyle bar) | `.site-header`, `.topbar`, `.hmain`, `.hcontact`, `.nav`, `.mega` | od L: horní lišta s odkazy, hledání roztažené v řádku, kontakt mezi hledáním a ikonami (od L telefon s otevírací dobou, od XL i e-mail), modrá lišta kategorií s mega menu (klik / najetí). Pod L: hamburger + panel `.drawer` s rozbalovacími kategoriemi, hledání pod hlavičkou |
| SearchField | `.search` | pole s `role=combobox`; Enter / lupa → `kategorie.html#hledat` |
| SearchPanel | `.spanel` | otevře se po kliknutí do pole. Prázdné pole: naposledy hledané (localStorage `skol-recent`, odebrat / vymazat), tipy (`searchTips`), kategorie, akční nabídka. Od 2 znaků: návrhy (značky, typy), kategorie s cestou, produkty s fotkou, cenou a zvýrazněnou shodou, „Zobrazit všech N výsledků“. Nic nenalezeno: hláška, tipy, telefon. Šipky, Enter, Esc. Desktop min. 720 px a 2 sloupce, mobil pod sebou, max. 72 % výšky okna |
| HeroBanners (single) | `.hero`, `.slide` | posun gestem / šipkami (od L) / tečkami; výška 380 → 560 px |
| CategoryTiles | `.tiles`, `.tile` | 2 → 4 (M) sloupce; lifestyle fotka přes celou dlaždici (cover, poměr 4 : 3, od XL 3 : 2), popisek 18 px od L |
| GuideTiles | `.guides`, `.guide` | 1 → 2 (S) → 4 (M); vede na kategorii s předvybraným stylem; jen na stránce kategorie (z HP odebráno) |
| ProductCard | `.card` | bublina slevy, štítek Akce, tlačítko Varianty / Detail / Do košíku; `--compact` |
| ProductCarousel | `.carousel` | viditelné karty 1,6 → 2,4 (S) → 3,3 (M) → 4 (L) → 5 (XXL); `--small` pro doplňky |
| TabBar | `.tabs` / `.tab` (pill), `.utabs` / `.utab` (podtržené) | |
| UspBar | `.uspbar`, `.usps--strip` (HP pod bannerem), `.usps` | HP: lišta pod úvodním bannerem; mobil 2 × 2 (ikona nad textem, na střed), od M 4 sloupce, od L ikona vedle textu. Jinde 1 → 2 (S) → 4 (M) |
| BrandStrip | `.brands` | 2 → 3 (XS) → 6 (M); písmo 15 → 16 (M) → 18 px (L) |
| ArticleTeasers | `.articles`, `.article` (kompaktní s ikonou), `.article--media` (s fotkou 3:2, „Číst článek“) | 1 → 2 (S) → 4 (XL); varianta se volí klíčem `img` v `guides` |
| SeoText | `.seo`, `.seo-wrap--img` (s fotkou a tlačítkem) | bez fotky sbalený text s „Číst více“; s fotkou celý text a tlačítko, od M fotka vlevo na výšku přes celou sekci (1 : 2), na mobilu nad textem |
| AboutSplit (HP) | `.abouts`, `.about`, `.about--rev` | 2 bloky pod sebou: fotka + nadpis, krátký text, 4 odrážky s ikonou, tlačítko. Na mobilu fotka nahoře, od M fotka vlevo / vpravo (střídá se). Odrážky 1 → 2 sloupce (S). Data `about` v `data.js` |
| ContactBand | `.contact`, `.contact--rich` | basic: „Nevíte si rady?“, od M v jednom řádku. rich: karta s fotkou (na mobilu nahoře 16 : 9, od M vlevo 2 : 3) a třemi kontakty (telefon, e-mail, prodejna). Volí se `footerVariant` v `data.js` |
| Footer | `.footer`, `.footer--brand` (`.fd__*`), `.footer__ilink` | `footerVariant` v `data.js`. brand (výchozí u SKOL): v barvě značky (`--c-footer-brand`, u SKOL modrá), logo nahoře, 4 sloupce Kontakt + sociální sítě / Prodejna (`stores`) / odkazy s linkami, pak Doprava a Platba (`shipping`, `payment`, zatím zástupné), spodní lišta s tlačítkem Začátek stránky; pruh „Nevíte si rady?“ se nezobrazuje. 1 → 2 (S) → 4 sloupce (L). rich: pruh s fotkou a ikony u odkazů. basic: světlá |
| Breadcrumbs | `.crumbs` | |
| CategoryHead | `.cathead`, `.subcats` | podkategorie: posuv na mobilu, zalomení od M |
| CategoryListing + FilterPanel | `.listing`, `.filters`, `.fgroup`, `.ltool`, `.pgrid`, `.promo-cell` | od L: levý panel filtrů 232 / 264 / 288 px a řazení tlačítky. Pod L: tlačítko Filtrovat (panel zprava) + výběr řazení. Mřížka 2 → 3 (M) → 4 (XXL) |
| ProductMain | `.pdp`, `.gallery`, `.buy`, `.variants`, `.guide-box`, `.addon` | 1 sloupec → 2 (M) → 7 : 5 (L); od XL je nákupní box lepivý. Galerie: hlavní fotka se šipkami a počítadlem, pod ní náhledy `.thumbs` (5 viditelných na mobilu, 6 od XS, další se posouvají). Ukázkový počet fotek `galleryDemo` v `data.js` |
| SizeGuide | `.guide-box` | tabulka velikostí / délek, rozbalovací |
| ServiceAddon | `.addon` | montáž vázání u lyží a setů |
| ProductInfo | `.pinfo`, `.utabs`, `.params`, `.features` | záložky Popis / Technické parametry |
| Košík | `.cart`, `.citems`, `.summary`, `.steps` | od L souhrn vpravo (lepivý) |

## Data

`assets/js/data.js` obsahuje vše, co v ostrém provozu dodá platforma: kategorie, produkty (cena, původní cena, štítek, varianty, parametry), texty patičky, SEO texty a bannery. Košík se v prototypu ukládá do `localStorage` (`skol-cart`).
