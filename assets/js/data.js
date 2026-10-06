/* SKOL – data prototypu.
   Texty, názvy, ceny a slevy jsou převzaté ze skol.net (4. 10. 2026).
   V ostrém provozu tato data dodá e-shopová platforma (Pohoda / BSSHOP).
   Fotky: assets/img/<img>.jpg ze skol.net (5. 10. 2026, velikost /2/ z CDN, zmenšené).
   hasImages: false = místo fotek rámečky. */
window.SKOL = {
  hasImages: true,
  imgBase: 'assets/img/',

  shop: {
    name: 'SKOL, s.r.o.',
    phone: '+420 326 373 000',
    email: 'info@skol.net',
    hours: 'Po–Pá 8.30–16.00',
    store: 'Podniková prodejna v Dražicích u Benátek nad Jizerou. Otevřeno máme každý všední den od 8.30 do 16.00 hod.',
    copyright: '©2026 SKOL, s.r.o.'
  },

  topLinks: [
    { label: 'Poradna', href: 'stranka.html#poradna' },
    { label: 'Kontakty', href: 'stranka.html#kontakty' },
    { label: 'O nás', href: 'stranka.html#o-nas' },
    { label: 'Obchodní podmínky', href: 'stranka.html#obchodni-podminky' },
    { label: 'Prodejny', href: 'stranka.html#prodejny' },
    { label: 'Půjčovna – nově otevřeno', href: 'stranka.html#pujcovna', hot: true },
    { label: 'Velkoobchod – přihlášení', href: 'stranka.html#velkoobchod' }
  ],

  /* Hlavní kategorie odpovídají webu, podkategorie v menu jsou návrh. */
  categories: [
    { id: 'akcni-produkty', label: 'Akční produkty a sety', subs: ['Akce', 'Sety lyže + vázání', 'Výprodej'] },
    { id: 'bezecke-lyzovani', label: 'Běžecké lyžování', subs: ['Běžky', 'Boty na běžky', 'Vázání', 'Hole', 'Kolečkové běžky a boty', 'Montáž vázání'] },
    { id: 'sjezdove-lyzovani', label: 'Sjezdové lyžování', subs: ['Sjezdové lyže', 'Lyžáky', 'Vázání', 'Hůlky'] },
    { id: 'ledni-brusle', label: 'Lední brusle', subs: ['Pánské brusle', 'Dámské brusle', 'Dětské nastavitelné brusle'] },
    { id: 'obleceni', label: 'Oblečení', subs: ['Funkční prádlo', 'Bundy', 'Kalhoty', 'Čepice a rukavice'] },
    { id: 'treking', label: 'Treking', subs: ['Trekové hole', 'Nordic walking'] },
    { id: 'dalsi-sporty', label: 'Další sporty', subs: [] }
  ],

  slides: [
    { eyebrow: 'Půjčovna', title: 'Půjčovna – nově otevřeno', sub: 'Běžky, boty a hole na víkend i na celou sezónu.', cta: 'Více o půjčovně', href: 'stranka.html#pujcovna', img: 'ban_pujcovna', tone: 'blue' },
    { eyebrow: 'SKOL', title: 'SKOL Trinity Skin 180–200 cm', sub: 'Běžky z naší nabídky v délkách 180–200 cm.', cta: 'Zobrazit běžky', href: 'kategorie.html#bezecke-lyzovani', img: 'ban_trinity', tone: 'ink' },
    { eyebrow: 'SPINE', title: 'Boty SPINE', sub: 'Partnerem značky SPINE jsme od roku 2017.', cta: 'Boty SPINE', href: 'kategorie.html#bezecke-lyzovani', img: 'ban_spine', tone: 'red' },
    { eyebrow: 'Atomic', title: 'Sjezdové lyžování', sub: 'Lyže a vázání Atomic v akci až −40 %.', cta: 'Sjezdové lyžování', href: 'kategorie.html#sjezdove-lyzovani', img: 'ban_atomic', tone: 'ink' },
    { eyebrow: 'Léto', title: 'Kolečkové běžky a boty', sub: 'SPINE Rollerski pro letní trénink.', cta: 'Kolečkové běžky', href: 'kategorie.html#bezecke-lyzovani', img: 'ban_roller', tone: 'blue' },
    { eyebrow: 'SPINE Racing', title: 'SPINE RS Carrera Skate 598 M', sub: 'Závodní boty na bruslení.', cta: 'Zobrazit boty', href: 'kategorie.html#bezecke-lyzovani', img: 'ban_racing', tone: 'red' },
    { eyebrow: 'Treking', title: 'Treking', sub: 'Trekové a nordic walking hole.', cta: 'Zobrazit treking', href: 'kategorie.html#treking', img: 'ban_treking', tone: 'ink' }
  ],

  tiles: [
    { label: 'Akční produkty a sety', href: 'kategorie.html#akcni-produkty', icon: 'tag', img: 't_akce' },
    { label: 'Běžecké lyžování', href: 'kategorie.html#bezecke-lyzovani', icon: 'ski', img: 't_bezky' },
    { label: 'Kolečkové běžky a boty', href: 'kategorie.html#bezecke-lyzovani', icon: 'boot', img: 'cat_leto' },
    { label: 'Montáž vázání', href: 'stranka.html#montaz-vazani', icon: 'wrench', img: 'cat_montaz' },
    { label: 'Sjezdové lyžování', href: 'kategorie.html#sjezdove-lyzovani', icon: 'mountain', img: 't_sjezd' },
    { label: 'Lední brusle', href: 'kategorie.html#ledni-brusle', icon: 'skate' },
    { label: 'Oblečení', href: 'kategorie.html#obleceni', icon: 'shirt' },
    { label: 'Treking', href: 'kategorie.html#treking', icon: 'pole', img: 't_treking' }
  ],

  styles: [
    { id: 'klasika', title: 'Klasika', sub: 'Klasický styl ve stopě', cta: 'Běžky na klasiku' },
    { id: 'brusleni', title: 'Bruslení', sub: 'Volný styl, skate', cta: 'Vybavení na bruslení' },
    { id: 'kombi', title: 'Kombi', sub: 'Boty pro oba styly', cta: 'Kombi boty' },
    { id: 'kolecko', title: 'Kolečkové', sub: 'Letní trénink', cta: 'Kolečkové běžky' }
  ],

  usps: [
    { icon: 'factory', title: 'Vlastní výroba vázání', sub: 'v Dražicích od 60. let' },
    { icon: 'wrench', title: 'Montáž vázání', sub: 'lyže připravené na stopu' },
    { icon: 'store', title: 'Půjčovna – nově otevřeno', sub: 'běžky, boty, hole' },
    { icon: 'truck', title: 'Dodáváme do celé Evropy', sub: 'partner značky SPINE' }
  ],

  brands: ['Atomic', 'Fischer', 'Salomon', 'Spine', 'Briko', 'SKOL'],

  /* Poradna – ArticleCard. S klíčem img se vykreslí varianta s fotkou (article--media), bez něj kompaktní s ikonou. */
  guides: [
    { title: 'Lyže: tabulka doporučených délek', perex: 'Doporučené délky běžeckých lyží SKOL, BRADOS a SABLE.', tag: 'Lyže', img: 'g_lyze' },
    { title: 'Hole: jak dlouhé vybrat', perex: 'Tabulky délek holí pro běžky, sjezd, treking a nordic walking.', tag: 'Hole', img: 'g_hole' },
    { title: 'Boty: tabulky velikostí', perex: 'Velikosti bot SPINE a SKOL a jak vybrat správnou obuv.', tag: 'Boty', img: 'g_boty' },
    { title: 'Vosky: mazání a ošetřování skluznice', perex: 'Jak mazat běžky a starat se o skluznici.', tag: 'Vosky', img: 'g_vosky' }
  ],

  /* HP – AboutSplit: 2 bloky (fotka vlevo / vpravo), krátký text a odrážky s ikonami. Fakta ze SEO textu skol.net. */
  about: [
    { title: 'Tradice běžkařského vázání z Dražic', text: 'Kompletní vybavení pro začínající i pokročilé vyznavače bílého sportu.', img: 'seo_bezky', alt: 'Běžkařka na upravené stopě v zimním lese',
      points: [
        { icon: 'factory', t: 'Vlastní výroba vázání', s: 'v Dražicích už od 60. let' },
        { icon: 'ski', t: 'Vázání, běžky, boty a hole', s: 'samostatně i smontované do setů' },
        { icon: 'boot', t: 'Dětské běžky s protismykem', s: 'vyrábíme už od délky 100 cm' },
        { icon: 'tag', t: 'Světové značky', s: 'Atomic, Salomon, Briko a další' }
      ], cta: { label: 'Více o nás', href: 'stranka.html#o-nas' } },
    { title: 'Navštivte naši prodejnu', text: 'Veškeré zboží si můžete prohlédnout a koupit v podnikové prodejně v sídle společnosti.', img: 'k_kontakt', alt: 'Rodina na procházce v podzimním lese',
      points: [
        { icon: 'store', t: 'Dražice u Benátek nad Jizerou', s: 'podniková prodejna SKOL' },
        { icon: 'clock', t: 'Otevřeno každý všední den', s: 'Po–Pá 8.30–16.00' },
        { icon: 'skate', t: 'Lední brusle', s: 'pánské, dámské i dětské s nastavitelnou velikostí' },
        { icon: 'shield', t: 'Partner značky SPINE', s: 'od roku 2017, dodáváme do celé Evropy' }
      ], cta: { label: 'Prodejna a kontakt', href: 'stranka.html#prodejny' } }
  ],

  seo: [
    'Vítáme Vás v internetovém obchodě firmy SKOL, s.r.o. Naší snahou je poskytnout kompletní vybavení nejen pro začínající, ale i pokročilé vyznavače bílého sportu. Využíváme letitých zkušeností plynoucích z tradiční výroby běžkařského vázání, která pokračuje v Dražicích již od 60. let minulého století.',
    'V naší nabídce naleznete především běžecké vázání, běžky, běžkařskou obuv a běžecké hole. Můžete u nás koupit i dětské běžky s protismykem, které se vyrábí již od délky 100 cm. Najdete u nás také různé zboží od světoznámých firem Atomic, Salomon, Briko a další. Běžecké vázání je možné vybírat z několika variant jako např. vázání SNS, NNN, SPs a NN75. Běžky je možné zakoupit samostatně, nebo smontované do běžeckých setů.',
    'Ze zimního sortimentu dále nabízíme lední brusle a to také v několika variantách. Jedná se o pánské brusle, dámské brusle (krasobrusle) a dětské brusle. U dětských bruslí je velkou předností možnost nastavitelných velikostí. V roce 2017 jsme se stali partnerem firmy SPINE, zastupujeme tuto značku a dodáváme jejich kvalitní výrobky do celé Evropy.',
    'Veškeré zboží můžete zakoupit v podnikové prodejně v sídle naší společnosti – Dražice u Benátek nad Jizerou. Otevřeno máme každý všední den od 8.30 do 16.00 hod. Těšíme se na Vaši návštěvu!'
  ],

  /* Patička: 'brand' = v barvě značky se sloupci Kontakt / Prodejna / odkazy, dopravou a platbou (bez pruhu „Nevíte si rady?“),
     'rich' = pruh s fotkou + ikony u důležitých odkazů, 'basic' = jednoduchá */
  footerVariant: 'brand',
  stores: [
    { name: 'Podniková prodejna SKOL', place: 'Dražice u Benátek nad Jizerou', hours: 'Po–Pá 8.30–16.00', phone: '+420 326 373 000', href: 'stranka.html#prodejny' }
  ],
  social: [{ label: 'Facebook', icon: 'fb', href: 'https://www.facebook.com/vseprobezky/' }],
  shipping: { text: '[Způsoby doručení doplní SKOL.]', items: ['[Dopravce]', '[Dopravce]', '[Výdejní místa]'] },
  payment: { text: '[Způsoby platby doplní SKOL.]', items: ['[Karta]', '[Převod]', '[Dobírka]', '[Platební brána]'] },
  contactImg: 'k_kontakt',
  footerIcons: { 'Prodejny': 'store', 'Kontakt': 'chat', 'Jak nakupovat': 'bag', 'Reklamační řád': 'shield', 'Dárkové poukazy': 'tag', 'Poradna': 'book' },

  footer: [
    { title: 'O společnosti', links: ['O nás', 'Prodejny', 'Kontakt', 'Naše akce', 'SP Dražice'] },
    { title: 'Užitečné informace', links: ['Jak nakupovat', 'Reklamační řád', 'Obchodní podmínky', 'Dárkové poukazy', 'Poradna'] }
  ],

  /* type: bezky | boty | hole | set | sjezd | doplnek
     style: klasika | bruslení | kombi
     cat: id kategorie; flag: 'akce' = štítek Akce na webu */
  products: [
    { id: 'spine-rs-energy-258', name: 'SPINE RS ENERGY 258', brand: 'SPINE', code: '258', cat: 'bezecke-lyzovani', type: 'boty', style: 'kombi', binding: 'NNN', price: 2290, old: 2600, flag: 'akce', img: 'p_spine258', 
      perex: 'Kombi boty na běžky SPINE RS ENERGY – sportovní KOMBI boty pro vázání NNN. Vhodné jak na klasiku tak i na bruslení.',
      desc: ['Pevná plastová pata a vyztužená manžeta s páskem na suchý zip zajišťuje pevnost v kotníku a tím i velmi dobrý přenos síly na lyže.'],
      params: [['Určeno pro', 'muže i ženy'], ['Schopnosti lyžaře', 'sportovní lyžař'], ['Typ bot', 'KOMBI'], ['Hmotnost', '934 g / pár (velikost 42)'], ['Pata', 'plastový korpus s pevnou, vyztuženou manžetou'], ['Zapínání', 'suchý zip, klasické překryté šněrování'], ['Stélka', 'tvarovaná vnitřní'], ['Velikosti', 'EUR 37–47'], ['Vázání', 'SPINE RS, PROLINK, NNN'], ['Záruka', '24 měsíců']],
      variantLabel: 'Velikost EU', variants: ['37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'], guide: 'boots', trail: ['Běžecké lyžování', 'Boty na běžky', 'Boty SPINE', 'pro vázání NNN (RS)'] },
    { id: 'set-fischer-fibre-crown', name: 'set FISCHER Fibre Crown + vázání Tour Step IN', brand: 'FISCHER', code: '0012768', cat: 'bezecke-lyzovani', type: 'set', style: 'klasika', binding: 'NNN', price: 2999, old: 5090, flag: 'akce', img: 'p_fischer', 
      perex: 'Set běžeckých lyží FISCHER Fibre Crown s vázáním Tour Step IN.',
      desc: ['Skluznice s protismykem.', 'Vázání kompatibilní s botami NNN nebo SPINE RS.'],
      params: [['Lyže', 'FISCHER Fibre Crown'], ['Skluznice', 's protismykem'], ['Vázání', 'Tour Step IN'], ['Kompatibilní boty', 'NNN, SPINE RS'], ['Délky', '176–204 cm'], ['Záruka', '24 měsíců']],
      variantLabel: 'Délka lyží (cm)', variants: ['176', '184', '189', '194', '199', '204'], guide: 'length', service: true, trail: ['Běžecké lyžování', 'Běžky', 'Běžky FISCHER'] },
    { id: 'salomon-escape-plus-prolink', name: 'Salomon Escape PLUS Prolink Black/White 13', brand: 'SALOMON', cat: 'bezecke-lyzovani', type: 'boty', style: 'klasika', binding: 'Prolink', price: 1990, img: 'p_salomon' },
    { id: 'atomic-savor-35-black', name: 'ATOMIC Savor 35 Black', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'boty', style: 'klasika', binding: 'Prolink', price: 2900, old: 3790, img: 'p_savor' },
    { id: 'atomic-c1-skintec-hard', name: 'ATOMIC C1 Skintec Hard + Shift CL, 209 cm', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'bezky', style: 'klasika', binding: 'Prolink', price: 3990, img: 'c_c1', perex: 'Běžky ATOMIC C1 Skintec s vázáním PROLINK Shift CL.' },
    { id: 'atomic-pro-c3-skintec-w-med', name: 'ATOMIC PRO C3 Skintec W med + Shift CL, 195 cm', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'bezky', style: 'klasika', binding: 'Prolink', price: 4990, old: 5990, flag: 'akce', img: 'c_c3' },
    { id: 'atomic-redster-c2-skintec-hard-psp', name: 'ATOMIC Redster C2 Skintec Hard PSP + Shift PRO CL', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'bezky', style: 'klasika', binding: 'Prolink', price: 4421, old: 4574, img: 'c_c2', perex: 'Běžky Atomic REDSTER C2 SKINTEC Hard s vázáním PROLINK Shift PRO.' },
    { id: 'atomic-redster-c5-skintec-med', name: 'ATOMIC REDSTER C5 Skintec MED + shift PRO CL', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'bezky', style: 'klasika', binding: 'Prolink', price: 6114, old: 10190, img: 'c_c5', perex: 'Běžecké lyže ATOMIC Redster C5 Skintec MED s vázáním Shift NNN PRO Classic.' },
    { id: 'atomic-pro-s2', name: 'ATOMIC PRO S2', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'boty', style: 'brusleni', binding: 'Prolink', price: 2990, old: 5290, img: 'c_s2', perex: 'Jedny z nejlepších běžkařských bot z řady Atomic na bruslení.' },
    { id: 'atomic-pro-s3', name: 'ATOMIC PRO S3', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'boty', style: 'brusleni', binding: 'Prolink', price: 1599, old: 2900, img: 'c_s3', perex: 'Boty na běžky ATOMIC PRO S3. Skate boty určené na bruslení.' },
    { id: 'spine-rs-comfort', name: 'SPINE RS Comfort', brand: 'SPINE', cat: 'bezecke-lyzovani', type: 'boty', style: 'klasika', binding: 'NNN', price: 1780, img: 's_rscomfort', perex: 'Boty SPINE RS Comfort – sportovní boty CLASSIC pro vázání NNN.', best: 8 },
    { id: 'spine-gs-comfort', name: 'SPINE GS Comfort', brand: 'SPINE', cat: 'bezecke-lyzovani', type: 'boty', style: 'klasika', binding: 'SNS', price: 1780, img: 's_gscomfort', perex: 'Boty na běžky SPINE GS Comfort – skvěle padnoucí sportovní boty CLASSIC pro vázání SNS.', best: 3 },
    { id: 'spine-gs-x-rider', name: 'SPINE GS X-Rider', brand: 'SPINE', cat: 'bezecke-lyzovani', type: 'boty', style: 'kombi', binding: 'SNS', price: 2290, img: 's_xrider', perex: 'Sportovní KOMBI boty pro vázání SNS. Vhodné jak na klasiku tak i na bruslení.', best: 6 },
    { id: 'spine-rs-smart', name: 'SPINE RS Smart (37-50)', brand: 'SPINE', cat: 'bezecke-lyzovani', type: 'boty', style: 'klasika', binding: 'NNN', price: 1450, img: 's_smart', perex: 'Boty na běžky SPINE RS Smart pro vázání NNN.', best: 9 },
    { id: 'skol-stc-race-sport', name: 'SKOL STC Race Sport', brand: 'SKOL', cat: 'bezecke-lyzovani', type: 'hole', price: 1490, img: 'x_stc', perex: 'Karbonové hole RACE SPORT. Velmi pevné hole s extrémně nízkou hmotností, korkové madlo.', best: 2 },
    { id: 'skol-rs-skate', name: 'SKOL RS Skate', brand: 'SKOL', cat: 'bezecke-lyzovani', type: 'hole', style: 'brusleni', price: 770, img: 'x_rsskate', perex: 'Velmi lehké sportovní běžecké hole s vysokou pevností (60 % karbonu).', best: 5 },
    { id: 'skol-start-red-125-160', name: 'SKOL Start RED (125-160 cm)', brand: 'SKOL', cat: 'bezecke-lyzovani', type: 'hole', price: 310, img: 'x_start', perex: 'Turistické lyžařské běžecké hůlky START dodáváme již od dětských délek.', best: 1 },
    { id: 'skol-start-red-80-120', name: 'SKOL Start RED (80-120 cm)', brand: 'SKOL', cat: 'bezecke-lyzovani', type: 'hole', price: 290, img: 'x_start80', perex: 'Velmi lehké, turistické lyžařské hůlky START.', best: 7 },
    { id: 'atomic-pro-carbon-qrs', name: 'ATOMIC PRO CARBON QRS Black/Grey', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'hole', price: 1800, img: 'c_qrs', perex: '3* karbonové hole s profesionálním výkonem za rozumnou cenu.' },
    { id: 'atomic-mover-lite', name: 'ATOMIC Mover LITE Black/White', brand: 'ATOMIC', cat: 'bezecke-lyzovani', type: 'hole', price: 799, img: 'c_mover', perex: 'Základní turistický model holí z kvalitního hliníku.' },
    { id: 'poutko-racing', name: 'Poutko Racing', brand: 'SKOL', cat: 'bezecke-lyzovani', type: 'doplnek', price: 135, img: 'x_poutko', perex: 'Poutko Racing k holím SKOL Skate, Cyber, Pro Race, Avanti. Samostatné poutko na levou nebo pravou stranu.', best: 4 },
    { id: 'pm-redster-rx-era', name: 'PM REDSTER RX ERA + M 10 GW, 156 cm', brand: 'ATOMIC', cat: 'sjezdove-lyzovani', type: 'sjezd', price: 7900, old: 10990, img: 'p_redster_rx' },
    { id: 'atomic-cloud-cl', name: 'ATOMIC CLOUD CL + M 10 GW Black/Or.', brand: 'ATOMIC', cat: 'sjezdove-lyzovani', type: 'sjezd', price: 7790, old: 12990, img: 'p_cloud_cl' },
    { id: 'atomic-cloud-q9', name: 'ATOMIC CLOUD Q9 Blue + M 10 GW Black/Or.', brand: 'ATOMIC', cat: 'sjezdove-lyzovani', type: 'sjezd', price: 10970, img: 'p_cloud_q9' }
  ],

  /* SearchPanel – tipy pro prázdné pole (návrh, upraví SKOL) */
  searchTips: ['běžky na klasiku', 'boty SPINE', 'vázání NNN', 'set s vázáním', 'kolečkové běžky'],

  /* Detail: počet fotek v galerii pro ukázku (doplní se opakováním hlavní fotky); 0 = jen skutečné fotky */
  galleryDemo: 6,

  homeProducts: ['spine-rs-energy-258', 'set-fischer-fibre-crown', 'salomon-escape-plus-prolink', 'atomic-savor-35-black', 'pm-redster-rx-era', 'atomic-cloud-cl', 'atomic-cloud-q9'],

  styleLabels: { klasika: 'Klasika', brusleni: 'Bruslení', kombi: 'Kombi' },

  typeLabels: { bezky: 'Běžky', boty: 'Boty na běžky', hole: 'Hole', set: 'Sety lyže + vázání', sjezd: 'Sjezdové lyže', doplnek: 'Doplňky' },

  lengthGuide: {
    head: ['Hmotnost lyžaře', 'Délka lyží – klasika'],
    rows: [['do 55 kg', '[doplní SKOL]'], ['55–65 kg', '[doplní SKOL]'], ['65–75 kg', '[doplní SKOL]'], ['75–85 kg', '[doplní SKOL]'], ['nad 85 kg', '[doplní SKOL]']],
    note: 'Hodnoty jsou v tabulce doporučených délek v Poradně (PDF). Pro bruslení volte kratší lyže.'
  },
  bootGuide: {
    head: ['EU', 'Délka chodidla'],
    rows: [['37', '[cm]'], ['39', '[cm]'], ['41', '[cm]'], ['43', '[cm]'], ['45', '[cm]'], ['47', '[cm]']],
    note: 'Změřte délku chodidla ve stoje. Tabulka velikostí SPINE je v Poradně.'
  },

  pages: {
    'poradna': { title: 'Poradna', text: ['Tabulky doporučených délek lyží SKOL – BRADOS – SABLE, délek běžeckých, sjezdových a trekových holí, tabulky velikostí bot SPINE a SKOL, výběr obuvi, mazání a ošetřování skluznice a návod k vázání SPINE.'] },
    'kontakty': { title: 'Kontakty', text: ['SKOL, s.r.o., Dražice u Benátek nad Jizerou.', 'Telefon +420 326 373 000, e-mail info@skol.net.'] },
    'o-nas': { title: 'O nás', text: ['Využíváme letitých zkušeností plynoucích z tradiční výroby běžkařského vázání, která pokračuje v Dražicích již od 60. let minulého století.'] },
    'prodejny': { title: 'Prodejny', text: ['Podniková prodejna v sídle společnosti – Dražice u Benátek nad Jizerou. Otevřeno každý všední den od 8.30 do 16.00 hod.'] },
    'pujcovna': { title: 'Půjčovna – nově otevřeno', text: ['[Text o půjčovně doplní SKOL – ceník, otevírací doba, rezervace.]'] },
    'montaz-vazani': { title: 'Montáž vázání', text: ['Vázání namontujeme na zakoupené lyže podle velikosti vaší boty. [Ceník montáže doplní SKOL.]'] },
    'obchodni-podminky': { title: 'Obchodní podmínky', text: ['[Text obchodních podmínek převezme programátor ze stávajícího webu.]'] },
    'velkoobchod': { title: 'Velkoobchod – přihlášení', text: ['[Přihlášení pro velkoobchodní partnery.]'] }
  }
};
