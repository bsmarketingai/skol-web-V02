/* SKOL – prototyp e-shopu. Čistý JavaScript bez závislostí.
   Struktura:
     1. Pomocné funkce a ikony
     2. Košík (localStorage, s náhradou v paměti)
     3. Sdílené komponenty: Header, Footer, ContactBand, ProductCard, ProductCarousel …
     4. Stránky: home, category, detail, cart, page (podle <body data-page>)
   Názvy komponent odpovídají knihovně BSSHOP v Claude Design. */
(function () {
  'use strict';
  const D = window.SKOL;

  /* ---------- 1. Pomocné funkce ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const kc = (n) => Math.round(n).toLocaleString('cs-CZ').replace(/\s/g, ' ') + ' Kč';
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const byId = (id) => D.products.find((p) => p.id === id);
  const pct = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);

  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
    check: '<path d="m5 12 4 4 10-10"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    store: '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18M9 20v-6h6v6"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    factory: '<path d="M3 21V10l6 3V10l6 3V6h6v15H3Z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
    wrench: '<path d="M14.5 4a4.5 4.5 0 0 0-4.2 6.1l-5.7 5.7a2 2 0 0 0 2.8 2.8l5.7-5.7A4.5 4.5 0 0 0 19.5 8.5L17 11l-2.5-.5L14 8l2.5-2.5A4.5 4.5 0 0 0 14.5 4Z"/>',
    pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    fb: '<path d="M15.5 4H13a3 3 0 0 0-3 3v14M7 10.5h7.5"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    ski: '<path d="M3 20 21 4M6 21 22 7"/><path d="M8 14l3 3"/>',
    boot: '<path d="M7 3h6v8l6 3a2 2 0 0 1 1 2v2H4V3h3Z"/><path d="M4 18v3h16v-3"/>',
    pole: '<path d="M8 3l4 18M16 3l-4 18"/><circle cx="7.5" cy="19" r="2"/><circle cx="16.5" cy="19" r="2"/>',
    mountain: '<path d="m2 20 7-12 4 6 3-4 6 10H2Z"/>',
    skate: '<path d="M6 3h5v6l6 2.5a2 2 0 0 1 1.2 1.8V16H6V3Z"/><path d="M4 20h14.5a2 2 0 0 0 2-2M8 16v4M16 16v4"/>',
    shirt: '<path d="m8 3-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0Z"/>',
    book: '<path d="M3 5h6a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5H3V5Z"/><path d="M21 5h-6a3 3 0 0 0-3 3v12a2.5 2.5 0 0 1 2.5-2.5H21V5Z"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6M11 8v6"/>'
  };
  const ic = (n, cls) => '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || '') + '</svg>';
  const typeIcon = (t) => ({ bezky: 'ski', set: 'ski', boty: 'boot', hole: 'pole', sjezd: 'mountain', doplnek: 'tag' }[t] || 'tag');

  /* Fotka nebo zástupný rámeček */
  function media(key, alt, icon, cls) {
    const inner = D.hasImages && key
      ? '<img src="' + D.imgBase + esc(key) + '.jpg" alt="' + esc(alt) + '" loading="lazy">'
      : '<span class="ph" role="img" aria-label="' + esc(alt ? 'Foto: ' + alt : 'Foto') + '">' + ic(icon || 'tag') + '</span>';
    return '<span class="media ' + (cls || '') + '">' + inner + '</span>';
  }

  /* Úložiště – může být nedostupné (anonymní okno), proto vše v try/catch */
  const mem = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return k in mem ? mem[k] : d; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* jen v paměti */ } }
  };

  /* ---------- 2. Košík ---------- */
  const cart = {
    items() { return store.get('skol-cart', []); },
    save(items) { store.set('skol-cart', items); updateCartCount(); },
    count() { return this.items().reduce((s, i) => s + i.qty, 0); },
    add(id, variant, qty, service) {
      const items = this.items();
      const hit = items.find((i) => i.id === id && i.variant === variant && !!i.service === !!service);
      if (hit) hit.qty += qty; else items.push({ id, variant: variant || '', qty, service: !!service });
      this.save(items);
    }
  };
  function updateCartCount() {
    const n = cart.count();
    $$('[data-cart-count]').forEach((el) => { el.textContent = n; el.hidden = n === 0; });
    $$('[data-cart-label]').forEach((el) => { el.setAttribute('aria-label', 'Košík, ' + n + ' ks'); });
  }

  let toastTimer;
  function toast(html) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = html;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 4000);
  }

  /* ---------- 3. Sdílené komponenty ---------- */
  function headerHTML(active) {
    const top = D.topLinks.map((l) => '<li><a href="' + l.href + '"' + (l.hot ? ' class="is-hot"' : '') + '>' + esc(l.label) + '</a></li>').join('');
    const nav = D.categories.map((c, i) => {
      const has = c.subs.length > 0;
      const cur = c.id === active ? ' aria-current="page"' : '';
      return '<li class="nav__item" data-i="' + i + '">' + (has
        ? '<button type="button" class="nav__link" aria-expanded="false" aria-controls="mega-' + i + '"' + cur + '>' + esc(c.label) + ic('down') + '</button>'
          + '<div class="mega" id="mega-' + i + '" hidden><div class="wrap mega__in">'
          + '<div class="mega__title"><h2>' + esc(c.label) + '</h2><a href="kategorie.html#' + c.id + '">Zobrazit vše</a></div>'
          + chunk(c.subs, Math.ceil(c.subs.length / 4)).map((col) => '<ul class="mega__col">' + col.map((s) => '<li><a href="kategorie.html#' + c.id + '">' + esc(s) + '</a></li>').join('') + '</ul>').join('')
          + '<a class="mega__promo" href="kategorie.html#akcni-produkty"><span class="badge badge--tip">Akce</span><strong>Sety lyže + vázání až −41 %</strong><span>Montáž vázání na přání</span></a>'
          + '</div></div>'
        : '<a class="nav__link" href="kategorie.html#' + c.id + '"' + cur + '>' + esc(c.label) + '</a>') + '</li>';
    }).join('');
    const search = (id) => '<form class="search" role="search" data-search>'
      + '<label class="sr-only" for="' + id + '">Hledat v obchodě</label>'
      + '<div class="search__box"><input id="' + id + '" type="search" autocomplete="off" placeholder="Hledat běžky, boty, vázání…" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="' + id + '-list">'
      + '<button type="submit" aria-label="Hledat">' + ic('search') + '</button></div>'
      + '<div class="spanel" id="' + id + '-list" hidden></div></form>';
    return '<a class="skip" href="#main">Přeskočit na obsah</a>'
      + '<div class="topbar"><div class="wrap topbar__in"><ul class="topbar__links">' + top + '</ul>'
      + '</div></div>'
      + '<div class="hmain"><div class="wrap hmain__in">'
      + '<button type="button" class="ibtn hmain__burger" data-open-menu aria-label="Otevřít menu" aria-haspopup="dialog">' + ic('menu') + '</button>'
      + '<a class="logo" href="index.html" aria-label="SKOL – úvodní stránka">' + logoInner() + '</a>'
      + search('q-desk')
      /* HeaderContact: kontakt mezi hledáním a ikonami (od L telefon, od XL i e-mail) */
      + '<div class="hcontact">'
      + '<a class="hcontact__item" href="tel:' + D.shop.phone.replace(/\s/g, '') + '">' + ic('phone') + '<span><b>' + esc(D.shop.phone) + '</b><small>' + esc(D.shop.hours) + '</small></span></a>'
      + '<a class="hcontact__item hcontact__item--mail" href="mailto:' + esc(D.shop.email) + '">' + ic('mail') + '<span><b>' + esc(D.shop.email) + '</b></span></a>'
      + '</div>'
      + '<div class="hmain__actions">'
      + '<a class="ibtn" href="stranka.html#ucet" aria-label="Přihlášení">' + ic('user') + '<span>Přihlášení</span></a>'
      + '<a class="ibtn" href="kosik.html" data-cart-label aria-label="Košík">' + ic('bag') + '<span>Košík</span><b class="ibtn__count" data-cart-count hidden>0</b></a>'
      + '</div></div>'
      + '<div class="msearch">' + search('q-mob') + '</div></div>'
      + '<nav class="nav" aria-label="Kategorie"><div class="wrap"><ul class="nav__list">' + nav + '</ul></div></nav>';
  }
  const logoInner = () => (D.hasImages ? '<img class="logo__img" src="' + D.imgBase + 'logo.png" alt="SKOL – vše pro běžky" width="259" height="49">' : '<span class="logo__word">SKOL</span><span class="logo__claim">vše pro běžky</span>');
  function chunk(a, n) { const out = []; for (let i = 0; i < a.length; i += Math.max(1, n)) out.push(a.slice(i, i + Math.max(1, n))); return out; }

  function drawerMenuHTML() {
    const cats = D.categories.map((c) => c.subs.length
      ? '<li><details><summary>' + esc(c.label) + ic('down') + '</summary><ul class="mnav__subs"><li><a href="kategorie.html#' + c.id + '"><b>Vše v kategorii</b></a></li>'
        + c.subs.map((s) => '<li><a href="kategorie.html#' + c.id + '">' + esc(s) + '</a></li>').join('') + '</ul></details></li>'
      : '<li><a class="mnav__link" href="kategorie.html#' + c.id + '">' + esc(c.label) + '</a></li>').join('');
    return '<div class="drawer" id="menu-drawer" role="dialog" aria-modal="true" aria-label="Menu" hidden>'
      + '<button type="button" class="drawer__scrim" data-close aria-label="Zavřít menu" tabindex="-1"></button>'
      + '<div class="drawer__panel"><div class="drawer__head">Menu<button type="button" class="ibtn" data-close aria-label="Zavřít menu">' + ic('close') + '</button></div>'
      + '<div class="drawer__body"><ul class="mnav">' + cats + '</ul>'
      + '<ul class="mnav__links">' + D.topLinks.map((l) => '<li><a href="' + l.href + '">' + esc(l.label) + '</a></li>').join('') + '</ul>'
      + '<div class="mnav__contact"><span>' + esc(D.shop.phone) + '</span><span>' + esc(D.shop.email) + '</span><span>' + esc(D.shop.hours) + '</span></div>'
      + '</div></div></div>';
  }

  function initHeader(active) {
    const host = $('#site-header');
    host.className = 'site-header';
    host.innerHTML = headerHTML(active);
    document.body.insertAdjacentHTML('beforeend', drawerMenuHTML());

    /* Mega menu: klik i najetí myší, Esc a klik mimo zavírají */
    const items = $$('.nav__item', host);
    const close = () => items.forEach((li) => { li.classList.remove('is-open'); const b = $('button', li); if (b) b.setAttribute('aria-expanded', 'false'); const m = $('.mega', li); if (m) m.hidden = true; });
    const open = (li) => { close(); li.classList.add('is-open'); $('button', li).setAttribute('aria-expanded', 'true'); $('.mega', li).hidden = false; };
    let hoverT;
    items.forEach((li) => {
      const b = $('button', li);
      if (!b) return;
      b.addEventListener('click', () => (li.classList.contains('is-open') ? close() : open(li)));
      li.addEventListener('mouseenter', () => { clearTimeout(hoverT); hoverT = setTimeout(() => open(li), 120); });
      li.addEventListener('mouseleave', () => { clearTimeout(hoverT); hoverT = setTimeout(close, 200); });
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); closeDrawers(); } });
    document.addEventListener('click', (e) => { if (!e.target.closest('.nav')) close(); });

    /* Mobilní menu */
    const drawer = $('#menu-drawer');
    $('[data-open-menu]', host).addEventListener('click', () => openDrawer(drawer));
    $$('[data-close]', drawer).forEach((b) => b.addEventListener('click', () => closeDrawers()));

    $$('[data-search]', host).forEach(initSearch);
    updateCartCount();
  }

  let lastFocus;
  function openDrawer(d) { lastFocus = document.activeElement; d.hidden = false; document.body.style.overflow = 'hidden'; const f = $('button, a, input', d.querySelector('.drawer__panel')); if (f) f.focus(); }
  function closeDrawers() { $$('.drawer').forEach((d) => { d.hidden = true; }); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }

  /* SearchPanel – panel pod polem hledání.
     Stav „prázdné pole“: naposledy hledané, tipy, akční nabídka.
     Stav „píšu“ (od 2 znaků): kategorie, návrhy výrazů, produkty s fotkou a cenou, Zobrazit všechny výsledky.
     Stav „nic nenalezeno“: hláška, tipy a kontakt na poradenství. */
  const RECENT = 'skol-recent';
  const recent = () => store.get(RECENT, []);
  const addRecent = (q) => { q = q.trim(); if (q.length < 2) return; store.set(RECENT, [q].concat(recent().filter((x) => norm(x) !== norm(q))).slice(0, 5)); };
  const mark = (txt, q) => { const t = esc(txt); if (!q) return t; const i = norm(txt).indexOf(q); return i < 0 ? t : esc(txt.slice(0, i)) + '<mark>' + esc(txt.slice(i, i + q.length)) + '</mark>' + esc(txt.slice(i + q.length)); };
  const searchHits = (q) => D.products.filter((p) => norm(p.name + ' ' + p.brand + ' ' + (D.typeLabels[p.type] || '') + ' ' + (D.styleLabels[p.style] || '') + ' ' + (p.binding || '')).includes(q));

  function initSearch(form) {
    const input = $('input', form);
    const panel = $('.spanel', form);
    let idx = -1;
    const pRow = (p, q) => '<li><a class="spanel__prod" data-opt href="detail.html#' + p.id + '">' + media(p.img, '', typeIcon(p.type), 'spanel__img') + '<span class="spanel__pt"><span class="spanel__pn">' + mark(p.name, q) + '</span><small>' + esc(D.typeLabels[p.type] || '') + '</small></span>'
      + '<span class="spanel__pp"><b' + (p.old ? ' class="is-sale"' : '') + '>' + kc(p.price) + '</b>' + (p.old ? '<s>' + kc(p.old) + '</s>' : '') + '</span></a></li>';
    const tips = () => '<div class="spanel__sec"><h3 class="spanel__h">Tipy pro hledání</h3><div class="spanel__chips">' + (D.searchTips || []).map((t) => '<button type="button" class="chip" data-term="' + esc(t) + '">' + esc(t) + '</button>').join('') + '</div></div>';
    const open = (html) => { panel.innerHTML = html; panel.hidden = false; input.setAttribute('aria-expanded', 'true'); idx = -1; };
    const close = () => { panel.hidden = true; input.setAttribute('aria-expanded', 'false'); idx = -1; };
    const go = (q) => { addRecent(q); store.set('skol-q', q); location.href = 'kategorie.html#hledat'; if (/kategorie\.html$/.test(location.pathname)) { close(); renderCategory(); } };

    const render = () => {
      const raw = input.value.trim();
      const q = norm(raw);
      if (q.length < 2) {
        const r = recent();
        const sale = D.products.filter((p) => p.old).slice(0, 3);
        open('<div class="spanel__grid"><div class="spanel__side">'
          + (r.length ? '<div class="spanel__sec"><div class="spanel__hrow"><h3 class="spanel__h">Naposledy hledané</h3><button type="button" class="spanel__clear" data-clear>Vymazat</button></div><ul class="spanel__terms">'
            + r.map((t) => '<li><a data-opt href="kategorie.html#hledat" data-term-go="' + esc(t) + '">' + ic('search', 'icon--s') + esc(t) + '</a><button type="button" class="spanel__x" data-remove="' + esc(t) + '" aria-label="Odebrat ' + esc(t) + '">' + ic('close', 'icon--s') + '</button></li>').join('') + '</ul></div>' : '')
          + tips()
          + '<div class="spanel__sec"><h3 class="spanel__h">Kategorie</h3><ul class="spanel__cats">' + D.categories.slice(0, 4).map((c) => '<li><a data-opt href="kategorie.html#' + c.id + '">' + esc(c.label) + ic('right', 'icon--s') + '</a></li>').join('') + '</ul></div>'
          + '</div><div class="spanel__main"><h3 class="spanel__h">Akční nabídka</h3><ul class="spanel__prods">' + sale.map((p) => pRow(p, '')).join('') + '</ul></div></div>');
        return;
      }
      const hits = searchHits(q);
      const cats = [];
      D.categories.forEach((c) => { if (norm(c.label).includes(q)) cats.push({ label: c.label, path: '', id: c.id }); c.subs.forEach((sub) => { if (norm(sub).includes(q)) cats.push({ label: sub, path: c.label, id: c.id }); }); });
      const terms = [];
      D.brands.forEach((b) => { if (norm(b).includes(q)) terms.push(b.toUpperCase()); });
      Object.values(D.typeLabels).forEach((t) => { if (norm(t).includes(q)) terms.push(t); });
      if (!hits.length && !cats.length) {
        open('<div class="spanel__none">' + ic('search') + '<div><strong>Pro „' + esc(raw) + '“ jsme nic nenašli.</strong><p>Zkontrolujte překlep nebo zkuste obecnější výraz. Rádi poradíme na <a href="tel:' + D.shop.phone.replace(/\s/g, '') + '">' + esc(D.shop.phone) + '</a>.</p></div></div>' + tips());
        return;
      }
      open('<div class="spanel__grid"><div class="spanel__side">'
        + (terms.length ? '<div class="spanel__sec"><h3 class="spanel__h">Návrhy</h3><ul class="spanel__terms">' + terms.slice(0, 4).map((t) => '<li><a data-opt href="kategorie.html#hledat" data-term-go="' + esc(t) + '">' + ic('search', 'icon--s') + mark(t, q) + '</a></li>').join('') + '</ul></div>' : '')
        + (cats.length ? '<div class="spanel__sec"><h3 class="spanel__h">Kategorie</h3><ul class="spanel__cats">' + cats.slice(0, 5).map((c) => '<li><a data-opt href="kategorie.html#' + c.id + '">' + (c.path ? '<small>' + esc(c.path) + ' ›</small> ' : '') + mark(c.label, q) + ic('right', 'icon--s') + '</a></li>').join('') + '</ul></div>' : '')
        + '</div><div class="spanel__main"><h3 class="spanel__h">Produkty <span>(' + hits.length + ')</span></h3>'
        + (hits.length ? '<ul class="spanel__prods">' + hits.slice(0, 4).map((p) => pRow(p, q)).join('') + '</ul>' : '<p class="spanel__muted">Žádný produkt, zkuste kategorii vlevo.</p>')
        + (hits.length ? '<a class="btn btn--primary btn--full spanel__all" data-opt data-all href="kategorie.html#hledat">Zobrazit všech ' + hits.length + ' výsledků' + ic('arrow', 'icon--s') + '</a>' : '')
        + '</div></div>');
    };
    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { close(); return; }
      const opts = $$('[data-opt]', panel);
      if (!opts.length || panel.hidden) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
        opts.forEach((a, i) => a.classList.toggle('is-active', i === idx));
        opts[idx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); opts[idx].click(); }
    });
    panel.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
    panel.addEventListener('click', (e) => {
      const t = e.target;
      const term = t.closest('[data-term]'); if (term) { input.value = term.dataset.term; input.focus(); render(); return; }
      const rm = t.closest('[data-remove]'); if (rm) { store.set(RECENT, recent().filter((x) => x !== rm.dataset.remove)); input.focus(); render(); return; }
      if (t.closest('[data-clear]')) { store.set(RECENT, []); input.focus(); render(); return; }
      const tg = t.closest('[data-term-go]'); if (tg) { e.preventDefault(); go(tg.dataset.termGo); return; }
      if (t.closest('[data-all]')) { e.preventDefault(); go(input.value.trim()); return; }
      if (t.closest('a[href^="detail"], a[href^="kategorie"]')) addRecent(input.value);
    });
    form.addEventListener('submit', (e) => { e.preventDefault(); if (input.value.trim()) go(input.value.trim()); });
    document.addEventListener('click', (e) => { if (!form.contains(e.target)) close(); });
  }


  function footerHTML() {
    if (D.footerVariant === 'brand') return footerBrandHTML();
    const rich = D.footerVariant === 'rich';
    const icons = (rich && D.footerIcons) || {};
    const link = (l) => '<li><a href="stranka.html#' + slug(l) + '"' + (icons[l] ? ' class="footer__ilink"' : '') + '>' + (icons[l] ? '<span class="footer__ico">' + ic(icons[l], 'icon--s') + '</span>' : '') + esc(l) + '</a></li>';
    const cols = D.footer.map((c) => '<div><h3>' + esc(c.title) + '</h3><ul>' + c.links.map(link).join('') + '</ul></div>').join('');
    const contact = rich
      ? '<div><h3>Kontakt</h3><ul>'
        + '<li><a class="footer__ilink" href="tel:' + D.shop.phone.replace(/\s/g, '') + '"><span class="footer__ico">' + ic('phone', 'icon--s') + '</span>' + esc(D.shop.phone) + '</a></li>'
        + '<li><a class="footer__ilink" href="mailto:' + esc(D.shop.email) + '"><span class="footer__ico">' + ic('mail', 'icon--s') + '</span>' + esc(D.shop.email) + '</a></li>'
        + '<li class="footer__note">' + esc(D.shop.hours) + '</li></ul>'
      : '<div><h3>Kontakt</h3><ul><li>' + esc(D.shop.phone) + '</li><li>' + esc(D.shop.email) + '</li><li>' + esc(D.shop.hours) + '</li></ul>';
    return '<div class="wrap"><div class="footer__grid">'
      + '<div class="footer__brand"><a class="logo" href="index.html" aria-label="SKOL – úvodní stránka">' + logoInner() + '</a><p>' + esc(D.shop.store) + '</p></div>'
      + cols
      + contact
      + '<h3 style="margin-top:20px">Sledujte nás</h3><ul><li><a href="https://www.facebook.com/vseprobezky/" target="_blank" rel="noopener">Facebook</a></li></ul></div>'
      + '</div><div class="footer__bottom"><span>' + esc(D.shop.copyright) + '</span><span>Prototyp redesignu · BSSHOP</span></div></div>';
  }

  /* Footer – tmavá varianta: logo, 4 sloupce (Kontakt + sociální sítě, Prodejna, odkazy s linkami), doprava a platba, spodní lišta */
  function footerBrandHTML() {
    const tel = (n) => 'tel:' + n.replace(/\s/g, '');
    const list = (c) => '<div class="fd__col"><h3 class="fd__h">' + esc(c.title) + '</h3><ul class="fd__links">' + c.links.map((l) => '<li><a href="stranka.html#' + slug(l) + '">' + esc(l) + '</a></li>').join('') + '</ul></div>';
    const contact = '<div class="fd__col"><h3 class="fd__h">Kontakt</h3><ul class="fd__contact">'
      + '<li><a href="' + tel(D.shop.phone) + '">' + ic('phone') + '<span><b>' + esc(D.shop.phone) + '</b><small>' + esc(D.shop.hours) + '</small></span></a></li>'
      + '<li><a href="mailto:' + esc(D.shop.email) + '">' + ic('mail') + '<span><b>' + esc(D.shop.email) + '</b></span></a></li></ul>'
      + '<h3 class="fd__h fd__h--sub">Sledujte nás</h3><ul class="fd__social">' + (D.social || []).map((x) => '<li><a href="' + x.href + '" target="_blank" rel="noopener" aria-label="' + esc(x.label) + '">' + ic(x.icon) + '</a></li>').join('') + '</ul></div>';
    const stores = '<div class="fd__col"><h3 class="fd__h">' + 'Prodejny' + '</h3><ul class="fd__stores">'
      + (D.stores || []).map((x) => '<li>' + ic('pin') + '<span><a href="' + x.href + '"><b>' + esc(x.name) + '</b></a><span>' + esc(x.place) + '</span><span>' + esc(x.hours) + '</span><a href="' + tel(x.phone) + '">' + esc(x.phone) + '</a></span></li>').join('') + '</ul><a class="fd__btn" href="stranka.html#prodejny">Všechny prodejny' + ic('arrow', 'icon--s') + '</a></div>';
    const chips = (o) => '<ul class="fd__chips">' + o.items.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
    return '<div class="wrap">'
      + '<div class="fd__top"><a class="logo fd__logo" href="index.html" aria-label="SKOL – úvodní stránka">' + logoInner() + '</a></div>'
      + '<div class="fd__grid">' + contact + stores + D.footer.map(list).join('') + '</div>'
      + '<div class="fd__pay"><div><h3 class="fd__h">Doprava</h3><p>' + esc(D.shipping.text) + '</p>' + chips(D.shipping) + '</div>'
      + '<div><h3 class="fd__h">Platba</h3><p>' + esc(D.payment.text) + '</p>' + chips(D.payment) + '</div></div>'
      + '<div class="fd__bottom"><span>' + esc(D.shop.copyright) + ' · Všechna práva vyhrazena</span>'
      + '<span class="fd__bl"><a href="#">Prototyp redesignu · BSSHOP</a><a href="stranka.html#cookies">Cookies</a>'
      + '<button type="button" class="fd__top-btn" data-to-top>Začátek stránky' + ic('up', 'icon--s') + '</button></span></div></div>';
  }
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  function contactHTML() {
    const tel = 'tel:' + D.shop.phone.replace(/\s/g, ''), mail = 'mailto:' + D.shop.email;
    if (D.footerVariant === 'rich') {
      /* ContactBand – varianta s fotkou: fotka + karta s telefonem, e-mailem a prodejnou */
      const item = (href, icon, label, value, note) => '<li><a class="contact__item" href="' + href + '"><span class="contact__ico">' + ic(icon) + '</span><span><small>' + esc(label) + '</small><b>' + esc(value) + '</b>' + (note ? '<em>' + esc(note) + '</em>' : '') + '</span></a></li>';
      return '<section class="contact contact--rich" aria-labelledby="contact-h"><div class="wrap"><div class="contact__card">'
        + media(D.contactImg, '', 'chat', 'contact__media media--cover').replace(' loading="lazy"', '')
        + '<div class="contact__body"><p class="contact__eyebrow">Poradíme vám</p><h2 id="contact-h">Nevíte si rady?</h2>'
        + '<p>Zeptejte se nás telefonicky, e-mailem nebo se zastavte v podnikové prodejně v Dražicích.</p>'
        + '<ul class="contact__list">'
        + item(tel, 'phone', 'Telefon', D.shop.phone, D.shop.hours)
        + item(mail, 'mail', 'E-mail', D.shop.email)
        + item('stranka.html#prodejny', 'store', 'Prodejna', 'Dražice u Benátek n. J.', 'Po–Pá 8.30–16.00')
        + '</ul></div></div></div></section>';
    }
    return '<section class="contact" aria-labelledby="contact-h"><div class="wrap contact__in">'
      + '<div><h2 id="contact-h">Nevíte si rady?</h2><p>Zeptejte se nás telefonicky nebo e-mailem.</p></div>'
      + '<div class="contact__actions">'
      + '<a class="contact__pill" href="' + tel + '">' + ic('phone') + esc(D.shop.phone) + '</a>'
      + '<a class="contact__pill" href="' + mail + '">' + ic('mail') + esc(D.shop.email) + '</a>'
      + '</div></div></section>';
  }

  function initShell(active) {
    initHeader(active);
    const f = $('#site-footer');
    if (f) {
      f.className = D.footerVariant === 'brand' ? 'footer footer--brand' : 'footer';
      f.innerHTML = footerHTML();
      const top = $('[data-to-top]', f);
      if (top) top.onclick = () => { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); const l = $('#site-header .logo'); if (l) l.focus({ preventScroll: true }); };
    }
    const c = $('#contact-band');
    if (c) { if (D.footerVariant === 'brand') c.remove(); else c.outerHTML = contactHTML(); }
  }

  /* ProductCard */
  function cardHTML(p, o) {
    o = o || {};
    const d = pct(p);
    const flags = (p.flag === 'akce' ? '<span class="badge badge--tip">Akce</span>' : '');
    const hasVariants = p.variants && p.variants.length > 1;
    const btn = o.action === 'cart' && !hasVariants
      ? '<button type="button" class="btn btn--primary btn--s btn--full" data-add="' + p.id + '">' + ic('bag', 'icon--s') + 'Do košíku</button>'
      : '<a class="btn btn--dark btn--s btn--full" href="detail.html#' + p.id + '" tabindex="-1">' + (hasVariants ? 'Varianty' : 'Detail') + '</a>';
    return '<article class="card' + (o.compact ? ' card--compact' : '') + '">'
      + media(p.img, p.name, typeIcon(p.type), 'card__media')
      + (flags ? '<div class="card__flags">' + flags + '</div>' : '')
      + (d ? '<span class="card__bubble badge badge--bubble" aria-label="Sleva ' + d + ' %">−' + d + ' %</span>' : '')
      + '<a class="card__name" href="detail.html#' + p.id + '">' + esc(p.name) + '</a>'
      + (o.compact ? '' : '<span class="card__meta">' + esc([D.typeLabels[p.type], p.style ? D.styleLabels[p.style] : '', p.binding].filter(Boolean).join(' · ')) + '</span>')
      + '<div class="card__bottom"><span class="stock">Skladem</span>'
      + '<div class="price' + (p.old ? ' price--sale' : '') + '"><span class="price__now">' + kc(p.price) + '</span>' + (p.old ? '<span class="price__old"><span class="sr-only">Původně </span>' + kc(p.old) + '</span>' : '') + '</div>'
      + (o.noBtn ? '' : btn) + '</div></article>';
  }

  function bindAdd(root) {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-add]');
      if (!b) return;
      const p = byId(b.dataset.add);
      cart.add(p.id, '', 1, false);
      toast('Přidáno do košíku: <b>' + esc(p.name) + '</b> <a href="kosik.html">Zobrazit košík</a>');
    });
  }

  /* ProductCarousel – posun šipkami po celých kartách */
  function carousel(host, products, o) {
    o = o || {};
    host.innerHTML = '<div class="carousel' + (o.small ? ' carousel--small' : '') + '"><ul class="carousel__track">'
      + products.map((p) => '<li>' + cardHTML(p, o) + '</li>').join('') + '</ul></div>';
    const track = $('.carousel__track', host);
    const sec = host.closest('section');
    if (sec) {
      const prev = $('[data-prev]', sec), next = $('[data-next]', sec);
      const step = () => { const li = $('li', track); return li ? li.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 300; };
      const upd = () => {
        if (!prev) return;
        prev.disabled = track.scrollLeft < 4;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      };
      if (prev) {
        prev.onclick = () => track.scrollBy({ left: -step(), behavior: 'smooth' });
        next.onclick = () => track.scrollBy({ left: step(), behavior: 'smooth' });
      }
      track.addEventListener('scroll', upd, { passive: true });
      requestAnimationFrame(upd);
    }
    bindAdd(host);
  }
  const arrowsHTML = '<div class="shead__arrows"><button type="button" class="ibtn ibtn--elevated" data-prev aria-label="Předchozí produkty">' + ic('left') + '</button><button type="button" class="ibtn ibtn--elevated" data-next aria-label="Další produkty">' + ic('right') + '</button></div>';

  function crumbsHTML(trail) {
    return '<nav class="crumbs wrap" aria-label="Drobečková navigace"><ol><li><a href="index.html">Úvod</a></li>'
      + trail.map((t, i) => '<li>' + (i === trail.length - 1 ? '<span aria-current="page">' + esc(t.label) + '</span>' : '<a href="' + t.href + '">' + esc(t.label) + '</a>') + '</li>').join('') + '</ol></nav>';
  }

  /* ---------- 4. Stránky ---------- */

  /* Homepage */
  function pageHome() {
    initShell(null);
    /* HeroBanners */
    const hero = $('#hero');
    hero.innerHTML = '<div class="wrap"><div class="hero__frame" aria-roledescription="carousel" aria-label="Hlavní nabídka">'
      + '<div class="hero__track" tabindex="0">' + D.slides.map((s, i) => '<a class="slide slide--' + s.tone + (D.hasImages ? ' slide--img' : '') + '" href="' + s.href + '" aria-roledescription="slide" aria-label="' + (i + 1) + ' z ' + D.slides.length + ': ' + esc(s.title) + '">'
        + (D.hasImages ? '<img src="' + D.imgBase + s.img + '.jpg" alt="">' : '<svg class="slide__ski icon" viewBox="0 0 24 24" aria-hidden="true">' + P.ski + '</svg>')
        + (D.hasImages ? '' : '<span class="slide__text"><span class="slide__eyebrow">' + esc(s.eyebrow) + '</span><span class="slide__title">' + esc(s.title) + '</span><span class="slide__sub">' + esc(s.sub) + '</span><span class="btn slide__cta">' + esc(s.cta) + ic('arrow', 'icon--s') + '</span></span>') + '</a>').join('') + '</div>'
      + '<button type="button" class="ibtn ibtn--elevated hero__arrow hero__arrow--prev" aria-label="Předchozí banner">' + ic('left') + '</button>'
      + '<button type="button" class="ibtn ibtn--elevated hero__arrow hero__arrow--next" aria-label="Další banner">' + ic('right') + '</button>'
      + '</div><div class="dots">' + D.slides.map((s, i) => '<button type="button" aria-label="Banner ' + (i + 1) + '"' + (i ? '' : ' aria-current="true"') + '></button>').join('') + '</div></div>';
    const track = $('.hero__track', hero);
    const dots = $$('.dots button', hero);
    const go = (i) => { const n = D.slides.length; i = (i + n) % n; track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); };
    const cur = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    $('.hero__arrow--prev', hero).onclick = () => go(cur() - 1);
    $('.hero__arrow--next', hero).onclick = () => go(cur() + 1);
    dots.forEach((d, i) => { d.onclick = () => go(i); });
    track.addEventListener('scroll', () => { const c = cur(); dots.forEach((d, i) => d.setAttribute('aria-current', i === c ? 'true' : 'false')); }, { passive: true });

    /* CategoryTiles */
    $('#tiles').innerHTML = D.tiles.map((t) => '<li><a class="tile" href="' + t.href + '">' + media(t.img, t.label, t.icon, 'tile__media media--cover') + '<span class="tile__label">' + esc(t.label) + ic('arrow', 'icon--s') + '</span></a></li>').join('');
    /* GuideTiles */
    if ($('#styles')) $('#styles').innerHTML = guidesHTML();
    /* ProductCarousel se záložkami */
    const home = D.homeProducts.map(byId);
    const sets = {
      akce: home.filter((p) => p.old),
      best: D.products.filter((p) => p.best).sort((a, b) => a.best - b.best),
      vyprodej: D.products.filter((p) => pct(p) >= 40)
    };
    const host = $('#home-products');
    const tabs = $$('#home-tabs .tab');
    const show = (k) => { tabs.forEach((t) => t.setAttribute('aria-selected', t.dataset.tab === k ? 'true' : 'false')); carousel(host, sets[k], { action: 'variants' }); };
    tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.tab)));
    show('akce');
    /* UspBar, BrandStrip, ArticleTeasers, SeoText */
    $('#usps').innerHTML = D.usps.map((u) => '<li class="usp"><span class="usp__icon">' + ic(u.icon) + '</span><span><span class="usp__t">' + esc(u.title) + '</span><span class="usp__s">' + esc(u.sub) + '</span></span></li>').join('');
    $('#brands').innerHTML = D.brands.map((b) => '<li><a class="brand" href="kategorie.html#hledat" data-brand="' + esc(b) + '">' + esc(b) + '</a></li>').join('');
    $('#brands').addEventListener('click', (e) => { const a = e.target.closest('[data-brand]'); if (a) store.set('skol-q', a.dataset.brand); });
    $('#articles').innerHTML = D.guides.map(articleCard).join('');
    aboutSplit($('#seo'), D.about);
  }

  /* ArticleCard: varianta s fotkou (article--media) nebo kompaktní s ikonou */
  function articleCard(g) {
    const text = '<span class="article__tag">' + esc(g.tag) + '</span><span class="article__t">' + esc(g.title) + '</span><span class="article__p">' + esc(g.perex) + '</span>';
    if (g.img) return '<li><a class="article article--media" href="stranka.html#poradna">' + media(g.img, g.title, 'book', 'article__media media--cover') + '<span class="article__body">' + text + '<span class="article__more">Číst článek' + ic('arrow', 'icon--s') + '</span></span></a></li>';
    return '<li><a class="article" href="stranka.html#poradna"><span class="article__icon">' + ic('book') + '</span><span>' + text + '</span></a></li>';
  }

  function guidesHTML() {
    const href = (s) => s.id === 'kolecko' ? 'kategorie.html#bezecke-lyzovani' : 'kategorie.html#styl-' + s.id;
    const icon = { klasika: 'ski', brusleni: 'ski', kombi: 'boot', kolecko: 'skate' };
    return D.styles.map((s) => '<li><a class="guide" href="' + href(s) + '"><span class="guide__icon">' + ic(icon[s.id]) + '</span><span><span class="guide__t">' + esc(s.title) + '</span><span class="guide__s">' + esc(s.sub) + '</span></span><span class="btn btn--outline btn--s guide__cta">' + esc(s.cta || 'Zobrazit') + ic('arrow', 'icon--s') + '</span></a></li>').join('');
  }

  /* AboutSplit: střídající se bloky fotka + text s odrážkami (lichý fotka vlevo, sudý vpravo) */
  function aboutSplit(el, blocks) {
    if (!el || !blocks) return;
    el.classList.add('abouts');
    el.innerHTML = '<h2 class="sr-only">SKOL – vše pro běžky</h2>' + blocks.map((b, i) => '<div class="about' + (i % 2 ? ' about--rev' : '') + '">'
      + media(b.img, b.alt, 'ski', 'about__media media--cover')
      + '<div class="about__body"><h3 class="about__t">' + esc(b.title) + '</h3><p class="about__p">' + esc(b.text) + '</p>'
      + '<ul class="about__list">' + b.points.map((x) => '<li><span class="about__ico">' + ic(x.icon) + '</span><span><b>' + esc(x.t) + '</b><small>' + esc(x.s) + '</small></span></li>').join('') + '</ul>'
      + '<a class="btn btn--outline about__cta" href="' + b.cta.href + '">' + esc(b.cta.label) + ic('arrow', 'icon--s') + '</a></div></div>').join('');
  }

  function seo(el, title, paras, pic) {
    if (!el) return;
    /* S fotkou (HP): text je celý otevřený a pod ním tlačítko na obsahovou stránku. Bez fotky: zkrácený text s „Číst více“. */
    const body = paras.map((t) => '<p>' + esc(t) + '</p>').join('');
    if (pic) {
      el.innerHTML = '<div class="seo-wrap seo-wrap--img">' + media(pic.img, pic.alt, pic.icon, 'seo__media media--cover')
        + '<div class="seo"><h2>' + esc(title) + '</h2><div class="seo__body">' + body + '</div>'
        + (pic.cta ? '<a class="btn btn--outline seo__cta" href="' + pic.cta.href + '">' + esc(pic.cta.label) + '</a>' : '') + '</div></div>';
      const sec = el.closest('section'); if (sec) sec.classList.add('section--seo-img');
      return;
    }
    el.innerHTML = '<div class="seo"><h2>' + esc(title) + '</h2><div class="seo__body is-clamped" id="seo-body">' + body + '</div>'
      + '<button type="button" class="btn btn--link" aria-expanded="false" aria-controls="seo-body">Číst více</button></div>';
    const b = $('button', el), bd = $('.seo__body', el);
    b.onclick = () => { const open = bd.classList.toggle('is-clamped'); b.textContent = open ? 'Číst více' : 'Zobrazit méně'; b.setAttribute('aria-expanded', open ? 'false' : 'true'); };
  }

  /* Kategorie */
  const CAT = {
    'bezecke-lyzovani': { title: 'Běžecké lyžování', desc: 'V naší nabídce naleznete především běžecké vázání, běžky, běžkařskou obuv a běžecké hole. Běžky je možné zakoupit samostatně, nebo smontované do běžeckých setů.', list: () => D.products.filter((p) => p.cat === 'bezecke-lyzovani') },
    'akcni-produkty': { title: 'Akční produkty a sety', desc: 'Zlevněné běžky, boty, sety s vázáním a sjezdové vybavení.', list: () => D.products.filter((p) => p.old) },
    'sjezdove-lyzovani': { title: 'Sjezdové lyžování', desc: 'Sjezdové lyže s vázáním Atomic.', list: () => D.products.filter((p) => p.cat === 'sjezdove-lyzovani') },
    'hledat': { title: 'Výsledky hledání', desc: '', list: () => { const q = norm(store.get('skol-q', '')); return D.products.filter((p) => norm(p.name + ' ' + p.brand + ' ' + (D.typeLabels[p.type] || '')).includes(q)); } }
  };
  const state = { f: {}, sort: 'rec', shown: 12 };
  let currentRefresh = null;

  function catKey() {
    const h = location.hash.replace('#', '');
    if (h.indexOf('styl-') === 0) return { key: 'bezecke-lyzovani', style: h.slice(5) };
    return { key: h || 'bezecke-lyzovani' };
  }

  function pageCategory() {
    initShell(catKey().key);
    window.addEventListener('hashchange', () => { renderCategory(); window.scrollTo(0, 0); });
    renderCategory();
  }

  function renderCategory() {
    const k = catKey();
    const cfgCat = D.categories.find((c) => c.id === k.key);
    const cfg = CAT[k.key] || { title: cfgCat ? cfgCat.label : 'Kategorie', desc: '', list: () => [] };
    state.f = { style: k.style ? [k.style] : [] };
    state.sort = 'rec'; state.shown = 12;
    const q = k.key === 'hledat' ? store.get('skol-q', '') : '';
    const title = k.key === 'hledat' ? 'Hledáte „' + q + '“' : cfg.title;
    document.title = title + ' | SKOL';
    $$('.nav__link').forEach((a) => { const li = a.closest('.nav__item'); const c = D.categories[li.dataset.i]; if (c.id === k.key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });

    const all = cfg.list();
    $('#crumbs').innerHTML = crumbsHTML([{ label: title }]);
    const subs = cfgCat ? cfgCat.subs : [];
    $('#cathead').innerHTML = '<div class="cathead__title"><h1>' + esc(title) + '</h1><span class="cathead__count" id="cat-count"></span></div>'
      + (cfg.desc ? '<p class="cathead__desc">' + esc(cfg.desc) + '</p>' : '')
      + (subs.length ? '<ul class="subcats">' + subs.map((s) => '<li><a class="chip" href="kategorie.html#' + k.key + '">' + esc(s) + '</a></li>').join('') + '</ul>' : '');
    const showStyles = k.key === 'bezecke-lyzovani';
    $('#cat-styles').hidden = !showStyles;
    if (showStyles) $('#cat-styles ul').innerHTML = guidesHTML();

    if (!all.length) {
      $('#listing').innerHTML = '<div class="empty" style="grid-column:1/-1"><strong>' + (k.key === 'hledat' ? 'Nic jsme nenašli' : 'Kategorie se připravuje') + '</strong>'
        + (k.key === 'hledat' ? 'Zkuste jiný název nebo značku.' : 'V prototypu jsou produkty v kategoriích Běžecké lyžování, Akční produkty a Sjezdové lyžování.')
        + '<p style="margin-top:14px"><a class="btn btn--primary" href="kategorie.html#bezecke-lyzovani">Běžecké lyžování</a></p></div>';
      $('#cat-count').textContent = '';
      $('#seo').innerHTML = '';
      return;
    }
    $('#listing').innerHTML = '<aside class="filters" aria-label="Filtry"><h2 class="sr-only">Filtry</h2><div id="f-desk"></div></aside>'
      + '<div class="stack" style="min-width:0">'
      + '<div class="ltool"><div class="ltool__row"><button type="button" class="btn btn--secondary" data-open-filters aria-haspopup="dialog">' + ic('filter') + 'Filtrovat <span data-fcount></span></button>'
      + '<label class="sr-only" for="sort-m">Řadit</label><select class="select" id="sort-m">' + SORTS.map((s) => '<option value="' + s[0] + '">' + s[1] + '</option>').join('') + '</select></div>'
      + '<div class="ltool__sort" role="group" aria-label="Řadit"><span>Řadit:</span>' + SORTS.map((s) => '<button type="button" class="seg" data-sort="' + s[0] + '" aria-pressed="' + (s[0] === 'rec') + '">' + s[1] + '</button>').join('') + '</div>'
      + '<span class="ltool__count" id="l-count" aria-live="polite"></span></div>'
      + '<div class="active-chips" id="chips"></div>'
      + '<ul class="pgrid" id="grid"></ul>'
      + '<div class="lmore" id="lmore"></div></div>';
    if (!$('#filter-drawer')) {
      document.body.insertAdjacentHTML('beforeend', '<div class="drawer drawer--right" id="filter-drawer" role="dialog" aria-modal="true" aria-label="Filtry" hidden>'
        + '<button type="button" class="drawer__scrim" data-close aria-label="Zavřít filtry" tabindex="-1"></button>'
        + '<div class="drawer__panel"><div class="drawer__head">Filtry<button type="button" class="ibtn" data-close aria-label="Zavřít filtry">' + ic('close') + '</button></div>'
        + '<div class="drawer__body"><div class="wrap" id="f-mob"></div></div>'
        + '<div class="drawer__foot"><button type="button" class="btn btn--link" data-reset>Zrušit vše</button><button type="button" class="btn btn--primary" style="flex:1" data-close id="f-apply">Zobrazit</button></div></div></div>');
      const fd = $('#filter-drawer');
      $$('[data-close]', fd).forEach((b) => b.addEventListener('click', closeDrawers));
      $('[data-reset]', fd).addEventListener('click', () => { state.f = {}; if (currentRefresh) currentRefresh(); });
    }
    $('[data-open-filters]').addEventListener('click', () => openDrawer($('#filter-drawer')));
    $$('.seg').forEach((b) => b.addEventListener('click', () => { state.sort = b.dataset.sort; refresh(); }));
    $('#sort-m').addEventListener('change', (e) => { state.sort = e.target.value; refresh(); });
    $('#chips').addEventListener('click', (e) => {
      const c = e.target.closest('[data-chip]');
      if (!c) return;
      if (c.dataset.chip === 'all') state.f = {}; else { const [g, v] = c.dataset.chip.split(':'); if (g === 'price') { delete state.f.min; delete state.f.max; } else state.f[g] = (state.f[g] || []).filter((x) => x !== v); }
      refresh();
    });
    seo($('#seo'), title, k.key === 'bezecke-lyzovani' ? D.seo.slice(1, 3) : [D.seo[1]]);

    function refresh() {
      ['f-desk', 'f-mob'].forEach((id) => { const el = document.getElementById(id); if (el) el.innerHTML = filtersHTML(all, id); });
      bindFilters();
      const list = apply(all);
      const shown = list.slice(0, state.shown);
      const grid = $('#grid');
      const cells = shown.map((p) => '<li>' + cardHTML(p, { action: 'variants' }) + '</li>');
      if (cells.length > 4) cells.splice(4, 0, '<li><a class="promo-cell" href="detail.html#set-fischer-fibre-crown"><span class="badge badge--tip" style="align-self:flex-start">Akce −41 %</span><strong>Set FISCHER Fibre Crown s vázáním za 2 999 Kč</strong><span>Montáž vázání na přání</span></a></li>');
      grid.innerHTML = cells.length ? cells.join('') : '<li class="empty" style="grid-column:1/-1"><strong>Žádný produkt neodpovídá filtrům</strong><button type="button" class="btn btn--secondary" data-chip="all" style="margin-top:12px">Zrušit filtry</button></li>';
      const n = list.length;
      $('#cat-count').textContent = all.length + ' produktů';
      $('#l-count').textContent = n + ' z ' + all.length + ' produktů';
      $('#f-apply').textContent = 'Zobrazit ' + n + ' produktů';
      $('#lmore').innerHTML = n > state.shown
        ? '<button type="button" class="btn btn--secondary btn--l" id="more">Zobrazit dalších ' + Math.min(12, n - state.shown) + '</button><span class="lmore__info">Zobrazeno ' + Math.min(state.shown, n) + ' z ' + n + '</span>'
        : (n ? '<span class="lmore__info">Zobrazeno všech ' + n + ' produktů</span>' : '');
      const more = $('#more');
      if (more) more.onclick = () => { state.shown += 12; refresh(); };
      $$('.seg').forEach((b) => b.setAttribute('aria-pressed', b.dataset.sort === state.sort ? 'true' : 'false'));
      $('#sort-m').value = state.sort;
      const chips = activeChips();
      $('#chips').innerHTML = chips.length ? chips.map((c) => '<button type="button" class="chip chip--remove" data-chip="' + c[0] + '" aria-label="Zrušit filtr ' + esc(c[1]) + '">' + esc(c[1]) + '</button>').join('') + '<button type="button" class="btn btn--link" data-chip="all">Zrušit vše</button>' : '';
      $$('[data-fcount]').forEach((el) => { el.textContent = chips.length ? '(' + chips.length + ')' : ''; });
      grid.querySelectorAll('[data-chip="all"]').forEach((b) => b.addEventListener('click', () => { state.f = {}; refresh(); }));
    }

    function bindFilters() {
      $$('[data-f]').forEach((inp) => inp.addEventListener('change', () => {
        const g = inp.dataset.f;
        if (g === 'stock') state.f.stock = inp.checked;
        else if (g === 'min' || g === 'max') { const v = parseInt(inp.value.replace(/\D/g, ''), 10); if (isNaN(v)) delete state.f[g]; else state.f[g] = v; }
        else { const set = new Set(state.f[g] || []); if (inp.checked) set.add(inp.value); else set.delete(inp.value); state.f[g] = Array.from(set); }
        refresh();
        const same = document.getElementById(inp.id);
        if (same) same.focus();
      }));
      $$('.fgroup').forEach((d) => d.addEventListener('toggle', () => { store.set('skol-fopen-' + d.dataset.g, d.open); }));
    }
    currentRefresh = refresh;
    refresh();
  }

  const SORTS = [['rec', 'Doporučené'], ['best', 'Nejprodávanější'], ['cheap', 'Nejlevnější'], ['exp', 'Nejdražší'], ['sale', 'Největší sleva']];
  const GROUPS = [
    { g: 'label', title: 'Štítky', val: (p) => (p.old ? ['Akce / sleva'] : []) },
    { g: 'type', title: 'Druh', val: (p) => [D.typeLabels[p.type]] },
    { g: 'style', title: 'Styl', val: (p) => (p.style ? [p.style] : []), label: (v) => D.styleLabels[v] || v },
    { g: 'binding', title: 'Vázání', val: (p) => (p.binding ? [p.binding] : []) },
    { g: 'brand', title: 'Značka', val: (p) => [p.brand] }
  ];

  function apply(all, skip) {
    const f = state.f;
    let list = all.filter((p) => GROUPS.every((G) => G.g === skip || !(f[G.g] && f[G.g].length) || G.val(p).some((v) => f[G.g].includes(v))))
      .filter((p) => (f.min == null || p.price >= f.min) && (f.max == null || p.price <= f.max));
    const s = state.sort;
    if (s === 'cheap') list = list.slice().sort((a, b) => a.price - b.price);
    if (s === 'exp') list = list.slice().sort((a, b) => b.price - a.price);
    if (s === 'sale') list = list.slice().sort((a, b) => pct(b) - pct(a));
    if (s === 'best') list = list.slice().sort((a, b) => (a.best || 99) - (b.best || 99));
    return list;
  }

  function filtersHTML(all, pre) {
    const prices = all.map((p) => p.price);
    const lo = Math.min.apply(null, prices), hi = Math.max.apply(null, prices);
    const priceHTML = () => '<details class="fgroup" data-g="price" open><summary>Cena' + ic('down') + '</summary><div class="fgroup__body"><div class="fgroup__price">'
      + '<label class="field" for="' + pre + '-min">Od (Kč)<input class="input" id="' + pre + '-min" inputmode="numeric" data-f="min" placeholder="' + lo + '" value="' + (state.f.min != null ? state.f.min : '') + '"></label>'
      + '<label class="field" for="' + pre + '-max">Do (Kč)<input class="input" id="' + pre + '-max" inputmode="numeric" data-f="max" placeholder="' + hi + '" value="' + (state.f.max != null ? state.f.max : '') + '"></label>'
      + '</div></div></details>';
    let h = '<label class="ftoggle" for="' + pre + '-stock">Jen skladem<span class="switch"><input type="checkbox" id="' + pre + '-stock" data-f="stock"' + (state.f.stock ? ' checked' : '') + '><span></span></span></label>';
    GROUPS.forEach((G) => {
      const base = apply(all, G.g);
      const vals = Array.from(new Set(all.flatMap(G.val))).filter(Boolean);
      if (vals.length < (G.g === 'label' ? 1 : 2) && !(state.f[G.g] || []).length) { if (G.g === 'label') h += priceHTML(); return; }
      const openSaved = store.get('skol-fopen-' + G.g, null);
      const open = openSaved == null ? ['label', 'type', 'style'].includes(G.g) || (state.f[G.g] || []).length > 0 : openSaved;
      h += '<details class="fgroup" data-g="' + G.g + '"' + (open ? ' open' : '') + '><summary>' + G.title + ic('down') + '</summary><div class="fgroup__body">'
        + vals.map((v, i) => {
          const id = pre + '-' + G.g + '-' + i;
          const n = base.filter((p) => G.val(p).includes(v)).length;
          const on = (state.f[G.g] || []).includes(v);
          return '<label class="check" for="' + id + '"><input type="checkbox" id="' + id + '" data-f="' + G.g + '" value="' + esc(v) + '"' + (on ? ' checked' : '') + (n || on ? '' : ' disabled') + '>' + esc(G.label ? G.label(v) : v) + '<span class="check__count">' + n + '</span></label>';
        }).join('') + '</div></details>';
      if (G.g === 'label') h += priceHTML();
    });
    return h;
  }

  function activeChips() {
    const out = [];
    GROUPS.forEach((G) => (state.f[G.g] || []).forEach((v) => out.push([G.g + ':' + v, G.title + ': ' + (G.label ? G.label(v) : v)])));
    if (state.f.min != null || state.f.max != null) out.push(['price:', 'Cena: ' + (state.f.min != null ? 'od ' + kc(state.f.min) + ' ' : '') + (state.f.max != null ? 'do ' + kc(state.f.max) : '')]);
    return out;
  }

  /* Detail produktu */
  function pageDetail() {
    initShell('bezecke-lyzovani');
    window.addEventListener('hashchange', () => { renderDetail(); window.scrollTo(0, 0); });
    renderDetail();
  }

  function renderDetail() {
    const id = location.hash.replace('#', '') || 'spine-rs-energy-258';
    const p = byId(id) || byId('spine-rs-energy-258');
    const catCfg = D.categories.find((c) => c.id === p.cat);
    document.title = p.name + ' | SKOL';
    const trail = [{ label: catCfg.label, href: 'kategorie.html#' + p.cat }].concat((p.trail || [D.typeLabels[p.type]]).slice(p.trail ? 1 : 0).map((t) => ({ label: t, href: 'kategorie.html#' + p.cat }))).concat([{ label: p.name }]);
    $('#crumbs').innerHTML = crumbsHTML(trail);
    let imgs = [p.img].concat(p.gallery || []);
    /* Prototyp: produkty na skol.net mají jen 1 fotku – galerie se doplní opakováním, aby šlo ukázat náhledy */
    if (D.galleryDemo && imgs.length < D.galleryDemo) imgs = imgs.concat(Array(D.galleryDemo - imgs.length).fill(p.img));
    const d = pct(p);
    const variants = p.variants || [];
    const ski = p.type === 'set' || p.type === 'bezky';
    const guide = p.guide === 'length' ? D.lengthGuide : (p.guide === 'boots' ? D.bootGuide : null);
    const s = { img: 0, variant: variants.length === 1 ? variants[0] : null };

    $('#pdp').innerHTML = '<div class="gallery"><div class="gallery__main" id="g-main"></div>'
      + (imgs.length > 1 ? '<ul class="thumbs">' + imgs.map((k, i) => '<li><button type="button" class="thumb" data-img="' + i + '" aria-label="Fotografie ' + (i + 1) + '"' + (i ? '' : ' aria-current="true"') + '>' + media(k, '', typeIcon(p.type)) + '</button></li>').join('') + '</ul>' : '')
      + '</div>'
      + '<div class="buy">'
      + '<div class="stack" style="gap:10px">'
      + ((p.flag === 'akce' || d) ? '<div class="buy__flags">' + (p.flag === 'akce' ? '<span class="badge badge--tip">Akce</span>' : '') + (d ? '<span class="badge badge--bubble" style="width:auto;height:24px;padding:0 8px;border-radius:3px">−' + d + ' %</span>' : '') + '</div>' : '')
      + '<h1>' + esc(p.name) + '</h1>'
      + '<div class="buy__meta">' + (p.code ? '<span>Kód: <b>' + esc(p.code) + '</b></span>' : '') + '<span>Značka: <b>' + esc(p.brand) + '</b></span><span>Záruka: <b>24 měsíců</b></span></div>'
      + (p.perex ? '<p class="buy__perex">' + esc(p.perex) + '</p>' : '') + '</div>'
      + '<div class="price price--l' + (p.old ? ' price--sale' : '') + '"><span class="price__now">' + kc(p.price) + '</span>'
      + (p.old ? '<span class="price__old"><span class="sr-only">Původně </span>' + kc(p.old) + '</span><span class="price__save">Ušetříte ' + kc(p.old - p.price) + '</span>' : '')
      + '<span class="price__vat">' + kc(p.price / 1.21) + ' bez DPH</span></div>'
      + '<span class="stock">Skladem</span>'
      + (variants.length > 1 ? '<fieldset class="vgroup"><legend><span>' + esc(p.variantLabel) + ': <b id="v-name">vyberte</b></span></legend><div class="variants" role="radiogroup" aria-label="' + esc(p.variantLabel) + '">'
        + variants.map((v) => '<button type="button" class="variant" role="radio" aria-checked="false" data-v="' + esc(v) + '">' + esc(v) + '<small>Skladem</small></button>').join('') + '</div>'
        + '<p class="variant-error" id="v-err" hidden>Vyberte prosím ' + esc(p.variantLabel.toLowerCase().replace(/ \(.*\)/, '')) + '.</p></fieldset>' : '')
      + (guide ? '<details class="guide-box"><summary>' + ic('book') + (p.guide === 'length' ? 'Jak vybrat délku lyží' : 'Tabulka velikostí') + '</summary><div class="guide-box__body"><table><thead><tr>' + guide.head.map((x) => '<th scope="col">' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' + guide.rows.map((r) => '<tr>' + r.map((x) => '<td>' + esc(x) + '</td>').join('') + '</tr>').join('') + '</tbody></table><p>' + esc(guide.note) + '</p></div></details>' : '')
      + (ski ? '<label class="addon" for="addon"><input type="checkbox" id="addon"><span><span class="addon__t">Montáž vázání</span><span class="addon__s">Vázání namontujeme podle velikosti vaší boty. Velikost uveďte v poznámce k objednávce.</span></span><span class="addon__p">dle ceníku</span></label>' : '')
      + '<div class="buy__cta"><div class="qty"><button type="button" data-q="-1" aria-label="Ubrat kus">−</button><label class="sr-only" for="qty">Počet kusů</label><input id="qty" type="number" min="1" max="20" value="1"><button type="button" data-q="1" aria-label="Přidat kus">+</button></div>'
      + '<button type="button" class="btn btn--primary btn--l" id="buy">' + ic('bag') + 'Do košíku</button></div>'
      + '<ul class="perks"><li>' + ic('shield') + 'Záruka 24 měsíců</li><li>' + ic('store') + 'Vyzkoušejte na prodejně v Dražicích, ' + esc(D.shop.hours) + '</li><li>' + ic('phone') + 'Poradíme: ' + esc(D.shop.phone) + '</li></ul>'
      + '</div>';

    const main = $('#g-main');
    const drawMain = () => {
      main.innerHTML = media(imgs[s.img], p.name + ' – fotografie ' + (s.img + 1), typeIcon(p.type), '')
        + (imgs.length > 1 ? '<button type="button" class="ibtn ibtn--elevated gallery__nav gallery__nav--prev" data-step="-1" aria-label="Předchozí fotografie">' + ic('left') + '</button><button type="button" class="ibtn ibtn--elevated gallery__nav gallery__nav--next" data-step="1" aria-label="Další fotografie">' + ic('right') + '</button>' : '')
        + '<span class="gallery__count">' + (s.img + 1) + ' / ' + imgs.length + '</span>';
      main.firstChild.style.height = '100%';
      $$('.thumb').forEach((t) => t.setAttribute('aria-current', +t.dataset.img === s.img ? 'true' : 'false'));
    };
    main.style.position = 'relative';
    drawMain();
    $('#pdp').addEventListener('click', (e) => {
      const st = e.target.closest('[data-step]');
      if (st) { s.img = (s.img + +st.dataset.step + imgs.length) % imgs.length; drawMain(); }
      const th = e.target.closest('[data-img]');
      if (th) { s.img = +th.dataset.img; drawMain(); }
      const v = e.target.closest('[data-v]');
      if (v) { s.variant = v.dataset.v; $$('.variant').forEach((b) => b.setAttribute('aria-checked', b === v ? 'true' : 'false')); $('#v-name').textContent = v.dataset.v; $('#v-err').hidden = true; }
      const q = e.target.closest('[data-q]');
      if (q) { const i = $('#qty'); i.value = Math.min(20, Math.max(1, (+i.value || 1) + +q.dataset.q)); }
    });
    $('.variants') && $('.variants').addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      const bs = $$('.variant'); const i = bs.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault(); const n = bs[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + bs.length) % bs.length]; n.focus(); n.click();
    });
    $('#buy').addEventListener('click', () => {
      if (variants.length > 1 && !s.variant) { $('#v-err').hidden = false; $('.variant').focus(); return; }
      const qty = Math.max(1, +$('#qty').value || 1);
      const service = !!($('#addon') && $('#addon').checked);
      cart.add(p.id, s.variant || '', qty, service);
      toast('Přidáno do košíku: <b>' + esc(p.name) + (s.variant ? ', ' + esc(s.variant) : '') + '</b> <a href="kosik.html">Zobrazit košík</a>');
    });

    /* ProductInfo */
    const desc = (p.desc || []);
    const params = p.params || [['Značka', p.brand], ['Druh', D.typeLabels[p.type]]].concat(p.style ? [['Styl', D.styleLabels[p.style]]] : []).concat(p.binding ? [['Vázání', p.binding]] : []).concat([['Záruka', '24 měsíců']]);
    const feats = [D.typeLabels[p.type], p.style ? D.styleLabels[p.style] : null, p.binding ? 'Vázání ' + p.binding : null, 'Záruka 24 měsíců'].filter(Boolean);
    $('#pinfo').innerHTML = '<div class="utabs" role="tablist" aria-label="Informace o produktu"><button type="button" class="utab" role="tab" id="t-popis" aria-controls="p-popis" aria-selected="true">Popis</button><button type="button" class="utab" role="tab" id="t-param" aria-controls="p-param" aria-selected="false" tabindex="-1">Technické parametry</button></div>'
      + '<div class="pinfo__panel" role="tabpanel" id="p-popis" aria-labelledby="t-popis"><div class="pinfo__grid"><div class="pinfo__text"><strong>' + esc(p.perex || p.name) + '</strong>' + desc.map((t) => '<p>' + esc(t) + '</p>').join('')
      + (desc.length ? '' : '<p>[Podrobný popis převezme programátor z produktového feedu.]</p>') + '</div>'
      + '<ul class="features">' + feats.map((f) => '<li>' + ic('check') + esc(f) + '</li>').join('') + '</ul></div></div>'
      + '<div class="pinfo__panel" role="tabpanel" id="p-param" aria-labelledby="t-param" hidden><table class="params"><tbody>' + params.map((r) => '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>').join('') + '</tbody></table></div>';
    const tabs = $$('.utab');
    tabs.forEach((t, i) => t.addEventListener('click', () => {
      tabs.forEach((x, j) => { x.setAttribute('aria-selected', i === j ? 'true' : 'false'); x.tabIndex = i === j ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = i !== j; });
    }));
    $('[role="tablist"]', $('#pinfo')).addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const i = tabs.indexOf(document.activeElement); const n = tabs[(i + 1) % 2]; n.focus(); n.click(); } });

    /* Podobné produkty a doplňky */
    const similar = D.products.filter((x) => x.id !== p.id && x.type === p.type).slice(0, 8);
    carousel($('#similar'), similar.length ? similar : D.products.filter((x) => x.old && x.id !== p.id).slice(0, 8), { action: 'variants' });
    const extras = D.products.filter((x) => (x.type === 'hole' || x.type === 'doplnek') && x.id !== p.id).sort((a, b) => (a.best || 99) - (b.best || 99)).slice(0, 8);
    carousel($('#extras'), extras, { action: 'cart', compact: true, small: true });
  }

  /* Košík */
  function pageCart() {
    initShell(null);
    renderCart();
  }
  function renderCart() {
    const items = cart.items().filter((i) => byId(i.id));
    const host = $('#cart');
    const steps = '<ol class="steps"><li class="is-on"><b>1</b>Košík</li><li><b>2</b>Doprava a platba</li><li><b>3</b>Údaje</li></ol>';
    if (!items.length) {
      host.innerHTML = '<div style="grid-column:1/-1">' + steps + '<h1>Košík je prázdný</h1><p style="margin:8px 0 20px;color:var(--c-muted)">Vyberte si z nejprodávanějších produktů nebo projděte kategorie.</p><a class="btn btn--primary" href="kategorie.html#bezecke-lyzovani">Běžecké lyžování</a></div>';
      $('#cart-best').hidden = false;
      carousel($('#cart-best-list'), D.products.filter((p) => p.best).sort((a, b) => a.best - b.best), { action: 'cart' });
      return;
    }
    $('#cart-best').hidden = true;
    const sum = items.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    const old = items.reduce((s, i) => { const p = byId(i.id); return s + (p.old ? (p.old - p.price) * i.qty : 0); }, 0);
    const service = items.some((i) => i.service);
    host.innerHTML = '<div style="min-width:0">' + steps + '<h1>Košík <span class="cathead__count">' + cart.count() + ' ks</span></h1>'
      + '<ul class="citems" style="margin-top:16px">' + items.map((i, n) => {
        const p = byId(i.id);
        return '<li class="citem">' + media(p.img, p.name, typeIcon(p.type), 'citem__media')
          + '<a class="citem__name" href="detail.html#' + p.id + '">' + esc(p.name) + '</a>'
          + '<span class="citem__var">' + [i.variant ? (p.variantLabel || 'Varianta') + ': ' + esc(i.variant) : '', i.service ? 'S montáží vázání' : '', 'Skladem'].filter(Boolean).join(' · ') + '</span>'
          + '<div class="citem__row"><div class="qty qty--s"><button type="button" data-ci="' + n + '" data-d="-1" aria-label="Ubrat kus">−</button><label class="sr-only" for="ci-' + n + '">Počet kusů</label><input id="ci-' + n + '" type="number" min="1" value="' + i.qty + '" data-ci="' + n + '"><button type="button" data-ci="' + n + '" data-d="1" aria-label="Přidat kus">+</button></div>'
          + '<span class="citem__price">' + kc(p.price * i.qty) + '</span><button type="button" class="citem__remove" data-rm="' + n + '">Odebrat</button></div></li>';
      }).join('') + '</ul>'
      + '<p style="margin-top:16px"><a href="kategorie.html#bezecke-lyzovani">‹ Pokračovat v nákupu</a></p></div>'
      + '<aside class="summary" aria-label="Souhrn objednávky"><h2 style="font-size:20px">Souhrn</h2>'
      + '<div class="summary__row"><span>Zboží</span><span>' + kc(sum) + '</span></div>'
      + (old ? '<div class="summary__row" style="color:var(--c-price-sale)"><span>Ušetříte</span><span>' + kc(old) + '</span></div>' : '')
      + (service ? '<div class="summary__row"><span>Montáž vázání</span><span>dle ceníku</span></div>' : '')
      + '<div class="summary__row"><span>Doprava</span><span>v dalším kroku</span></div>'
      + '<div class="summary__row summary__row--total"><span>Celkem s DPH</span><span>' + kc(sum) + '</span></div>'
      + '<div class="summary__row summary__note"><span>Bez DPH</span><span>' + kc(sum / 1.21) + '</span></div>'
      + '<button type="button" class="btn btn--primary btn--l btn--full" id="checkout">Pokračovat k dopravě a platbě</button>'
      + '<p class="proto-note" id="proto" hidden>Tady prototyp končí. Doprava, platba a odeslání objednávky budou napojené na e-shopovou platformu.</p>'
      + '</aside>';
    host.onclick = (e) => {
      const its = cart.items();
      const d = e.target.closest('[data-d]');
      if (d) { const i = its[+d.dataset.ci]; i.qty = Math.max(1, i.qty + +d.dataset.d); cart.save(its); renderCart(); }
      const rm = e.target.closest('[data-rm]');
      if (rm) { const p = byId(its[+rm.dataset.rm].id); its.splice(+rm.dataset.rm, 1); cart.save(its); renderCart(); toast('Odebráno z košíku: <b>' + esc(p.name) + '</b>'); }
      if (e.target.id === 'checkout') $('#proto').hidden = false;
    };
    host.onchange = (e) => {
      const inp = e.target.closest('input[data-ci]');
      if (!inp) return;
      const its = cart.items(); its[+inp.dataset.ci].qty = Math.max(1, parseInt(inp.value, 10) || 1); cart.save(its); renderCart();
    };
  }

  /* Obsahová stránka */
  function pageContent() {
    initShell(null);
    const render = () => {
      const k = location.hash.replace('#', '');
      const pg = D.pages[k] || { title: k ? k.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'Stránka', text: ['[Obsah stránky převezme programátor ze stávajícího webu.]'] };
      document.title = pg.title + ' | SKOL';
      $('#crumbs').innerHTML = crumbsHTML([{ label: pg.title }]);
      $('#page').innerHTML = '<h1>' + esc(pg.title) + '</h1>' + pg.text.map((t) => '<p>' + esc(t) + '</p>').join('');
    };
    window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
    render();
  }

  const pages = { home: pageHome, category: pageCategory, detail: pageDetail, cart: pageCart, page: pageContent };
  const run = () => (pages[document.body.dataset.page] || pageHome)();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
