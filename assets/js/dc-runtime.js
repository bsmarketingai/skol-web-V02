/*
 * dc-runtime.js – malý běhový modul, který vykreslí komponenty návrhu (src/*.dc.html)
 * jako běžné DOM prvky. Bez závislostí, ~ES2017.
 *
 * Podporovaná syntaxe šablon (stejná jako v návrhu):
 *   {{cesta.k.hodnote}}         – hodnota z renderVals() (nebo z proměnné cyklu)
 *   onClick="{{fn}}" …         – události (onClick, onMouseEnter, onChange, onInput, onFocus …)
 *   <sc-if value="{{x}}">       – podmínka
 *   <sc-for list="{{xs}}" as="x"> – cyklus, uvnitř {{x.…}} a {{$index}}
 *   <dc-import name="Header" a="{{b}}"> – vnořená komponenta (atributy = props, kebab → camelCase)
 * Logika: class Component extends DCLogic { renderVals() {…} } se state / setState / props
 * a metodami componentDidMount / componentWillUnmount.
 */
(function () {
  'use strict';
  var DATA = window.DC_DATA || { components: {}, links: {}, images: {} };
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var BLOB = /\/_blob\/([0-9a-f]{32})/g;

  /* ---------- pomocné ---------- */
  function fixUrl(s) {
    if (typeof s !== 'string') return s;
    if (s.indexOf('/_blob/') !== -1) s = s.replace(BLOB, function (m, id) { return DATA.images[id] || m; });
    return s;
  }
  function fixHref(s) {
    if (typeof s !== 'string') return s;
    var m = /^\/?([A-Za-z0-9_-]+\.dc\.html)(#.*)?$/.exec(s);
    if (m) return (DATA.links[m[1]] || m[1].replace('.dc.html', '.html')) + (m[2] || '');
    return fixUrl(s);
  }
  function camel(s) { return s.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); }
  var LITERALS = { 'true': true, 'false': false, 'null': null, 'undefined': undefined };

  function lookup(path, scope) {
    path = path.trim();
    if (Object.prototype.hasOwnProperty.call(LITERALS, path)) return LITERALS[path];
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.');
    var v;
    for (var s = scope; s; s = s.parent) {
      if (s.vars && Object.prototype.hasOwnProperty.call(s.vars, parts[0])) { v = s.vars[parts[0]]; break; }
    }
    for (var i = 1; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  var HOLE = /\{\{([^}]*)\}\}/g;
  var WHOLE = /^\s*\{\{([^}]*)\}\}\s*$/;
  /* atribut: celý {{x}} → surová hodnota, jinak řetězec */
  function evalAttr(v, scope) {
    var m = WHOLE.exec(v);
    if (m) return lookup(m[1], scope);
    if (v.indexOf('{{') === -1) return v;
    return v.replace(HOLE, function (mm, p) { var r = lookup(p, scope); return r == null ? '' : String(r); });
  }
  function evalText(v, scope) {
    if (v.indexOf('{{') === -1) return v;
    return v.replace(HOLE, function (mm, p) { var r = lookup(p, scope); return r == null || r === false ? '' : String(r); });
  }

  /* ---------- <head>: styly a písma z <helmet> ---------- */
  var helmetDone = {};
  function injectHelmet(name) {
    var c = DATA.components[name];
    if (!c || !c.helmet || helmetDone[name]) return;
    helmetDone[name] = true;
    var tpl = document.createElement('template');
    tpl.innerHTML = fixUrl(c.helmet);
    Array.prototype.forEach.call(tpl.content.childNodes, function (n) {
      if (n.nodeType !== 1) return;
      if (n.tagName === 'LINK' && document.head.querySelector('link[href="' + n.getAttribute('href') + '"]')) return;
      if (n.tagName === 'STYLE') {
        var txt = n.textContent.trim();
        var exists = Array.prototype.some.call(document.head.querySelectorAll('style'), function (s) { return s.textContent.trim() === txt; });
        if (exists) return;
      }
      document.head.appendChild(n.cloneNode(true));
    });
  }

  /* ---------- logika komponent ---------- */
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch, cb) {
    if (typeof patch === 'function') patch = patch(this.state, this.props);
    if (patch) this.state = Object.assign({}, this.state, patch);
    if (this.__inst) this.__inst.schedule(cb);
  };
  DCLogic.prototype.forceUpdate = function (cb) { if (this.__inst) this.__inst.schedule(cb); };
  DCLogic.prototype.renderVals = function () { return {}; };
  window.DCLogic = DCLogic;

  var classes = {};
  function getClass(name) {
    if (classes[name]) return classes[name];
    var c = DATA.components[name];
    if (!c) throw new Error('DC: neznámá komponenta ' + name);
    /* jshint evil:true */
    classes[name] = new Function('DCLogic', c.logic + '\n;return Component;')(DCLogic);
    return classes[name];
  }

  /* ---------- virtuální strom ---------- */
  // vnode: {t:'text', v} | {t:'el', tag, ns, attrs, kids} | {t:'comp', name, props}
  function build(nodes, scope, out, ns) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (typeof n === 'string') { var tx = evalText(n, scope); if (tx !== '') out.push({ t: 'text', v: tx }); continue; }
      var tag = n[0], attrs = n[1], kids = n[2];
      var low = tag.toLowerCase();
      if (low === 'sc-if') {
        if (evalAttr(attrs.value || '', scope)) build(kids, scope, out, ns);
        continue;
      }
      if (low === 'sc-for') {
        var list = evalAttr(attrs.list || '', scope);
        var as = attrs.as || 'item';
        if (list && typeof list.length === 'number') {
          for (var j = 0; j < list.length; j++) {
            var vars = { $index: j }; vars[as] = list[j];
            build(kids, { vars: vars, parent: scope }, out, ns);
          }
        }
        continue;
      }
      if (low === 'dc-import') {
        var props = {};
        for (var k in attrs) {
          if (k === 'name' || k.indexOf('hint-') === 0) continue;
          props[camel(k)] = evalAttr(attrs[k], scope);
        }
        out.push({ t: 'comp', name: attrs.name, props: props });
        continue;
      }
      var cns = low === 'svg' ? SVG_NS : (low === 'foreignobject' ? null : ns);
      var ev = {};
      for (var a in attrs) ev[a] = evalAttr(attrs[a], scope);
      var vk = [];
      if (low !== 'script') build(kids, scope, vk, cns);
      else vk = kids.map(function (s) { return { t: 'text', v: s }; });
      out.push({ t: 'el', tag: tag, ns: cns, attrs: ev, kids: vk });
    }
    return out;
  }

  /* ---------- aktualizace DOM ---------- */
  var EVENT_NAMES = { doubleclick: 'dblclick' };
  function eventName(attr, el) {
    var e = attr.slice(2).toLowerCase();
    if (e === 'change') {
      var t = (el.type || '').toLowerCase();
      if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && t !== 'checkbox' && t !== 'radio' && t !== 'file')) return 'input';
    }
    return EVENT_NAMES[e] || e;
  }
  var PROPS = { value: 1, checked: 1, selected: 1 };
  var BOOL_ATTRS = { disabled: 1, hidden: 1, open: 1, required: 1, readonly: 1, multiple: 1, autofocus: 1 };

  function setAttr(el, k, v, old) {
    if (/^on[A-Z]/.test(k)) {
      var name = eventName(k, el);
      if (!el.__dcH) el.__dcH = {};
      if (!el.__dcH[name]) {
        el.addEventListener(name, function (e) { var h = el.__dcH[name]; if (typeof h === 'function') h(e); });
      }
      el.__dcH[name] = v;
      return;
    }
    if (k === 'ref') { if (typeof v === 'function') v(el); else if (v && typeof v === 'object') v.current = el; return; }
    if (k === 'style') {
      var css = v == null || v === false ? '' : String(v);
      if (css.indexOf('/_blob/') !== -1) css = fixUrl(css);
      if (el.getAttribute('style') !== css) el.setAttribute('style', css);
      return;
    }
    if (PROPS[k] && k in el) {
      if (k === 'value') { var sv = v == null ? '' : String(v); if (el.value !== sv) el.value = sv; }
      else el[k] = !!v && v !== 'false';
      return;
    }
    if (k === 'href') v = fixHref(v);
    else if (k === 'src' || k === 'srcset' || k === 'poster') v = fixUrl(v);
    if (BOOL_ATTRS[k.toLowerCase()]) {
      var on = !(v == null || v === false || v === 'false');
      if (on) el.setAttribute(k, ''); else el.removeAttribute(k);
      return;
    }
    if (v == null || v === false) { el.removeAttribute(k); return; }
    if (v === true) v = (k.indexOf('aria-') === 0 || k.indexOf('data-') === 0) ? 'true' : '';
    var s = String(v);
    if (el.getAttribute(k) !== s) el.setAttribute(k, s);
  }

  function createDom(v, ctx) {
    if (v.t === 'text') return document.createTextNode(v.v);
    if (v.t === 'comp') {
      var inst = new Instance(v.name, v.props, ctx);
      v.inst = inst;
      return inst.host;
    }
    var el = v.ns ? document.createElementNS(v.ns, v.tag) : document.createElement(v.tag);
    for (var k in v.attrs) if (k !== 'value' && k !== 'checked') setAttr(el, k, v.attrs[k]);
    patchChildren(el, [], v.kids, ctx);
    if ('value' in v.attrs) setAttr(el, 'value', v.attrs.value);
    if ('checked' in v.attrs) setAttr(el, 'checked', v.attrs.checked);
    return el;
  }

  function same(a, b) {
    if (a.t !== b.t) return false;
    if (a.t === 'el') return a.tag === b.tag && a.ns === b.ns;
    if (a.t === 'comp') return a.name === b.name;
    return true;
  }

  function shallowEq(a, b) {
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (var i = 0; i < ka.length; i++) if (a[ka[i]] !== b[ka[i]]) return false;
    return true;
  }

  function patchNode(dom, ov, nv, ctx) {
    if (nv.t === 'text') { if (dom.nodeValue !== nv.v) dom.nodeValue = nv.v; return dom; }
    if (nv.t === 'comp') {
      var inst = ov.inst;
      nv.inst = inst;
      if (!shallowEq(inst.props, nv.props)) { inst.setProps(nv.props); }
      return inst.host;
    }
    var oa = ov.attrs, na = nv.attrs, k;
    for (k in oa) if (!(k in na)) {
      if (/^on[A-Z]/.test(k)) { if (dom.__dcH) dom.__dcH[eventName(k, dom)] = null; }
      else dom.removeAttribute(k);
    }
    for (k in na) if (oa[k] !== na[k] || k === 'value' || k === 'checked') setAttr(dom, k, na[k], oa[k]);
    patchChildren(dom, ov.kids, nv.kids, ctx);
    return dom;
  }

  function patchChildren(parent, olds, news, ctx) {
    var doms = [];
    var cur = parent.__dcFirst ? null : null;
    // DOM uzly, které patří k olds, jsou přímé děti parent v pořadí (komponenty mají vlastní obal)
    var existing = parent.__dcNodes || [];
    var n = Math.max(olds.length, news.length);
    for (var i = 0; i < n; i++) {
      var ov = olds[i], nv = news[i], dom = existing[i];
      if (nv === undefined) { removeDom(dom, ov); continue; }
      if (ov === undefined || dom === undefined) {
        var nd = createDom(nv, ctx);
        parent.appendChild(nd);
        doms.push(nd);
        continue;
      }
      if (same(ov, nv)) {
        doms.push(patchNode(dom, ov, nv, ctx));
      } else {
        var rd = createDom(nv, ctx);
        parent.replaceChild(rd, dom);
        destroy(ov);
        doms.push(rd);
      }
    }
    parent.__dcNodes = doms;
  }

  function destroy(v) {
    if (!v) return;
    if (v.t === 'comp' && v.inst) { v.inst.unmount(); return; }
    if (v.kids) v.kids.forEach(destroy);
  }
  function removeDom(dom, v) {
    destroy(v);
    if (dom && dom.parentNode) dom.parentNode.removeChild(dom);
  }

  /* ---------- instance komponenty ---------- */
  var mountQueue = [];
  function Instance(name, props, ctx) {
    this.name = name;
    this.props = props || {};
    injectHelmet(name);
    var Cls = getClass(name);
    this.logic = new Cls(this.props);
    this.logic.props = this.props;
    if (!this.logic.state) this.logic.state = {};
    this.logic.__inst = this;
    this.host = document.createElement('dc-c');
    this.host.style.display = 'contents';
    this.host.setAttribute('data-dc', name);
    this.vnodes = [];
    this.pending = false;
    this.mounted = false;
    this.dead = false;
    this.callbacks = [];
    this.render();
    mountQueue.push(this);
  }
  Instance.prototype.render = function () {
    if (this.dead) return;
    var vals;
    try { vals = this.logic.renderVals() || {}; }
    catch (e) { console.error('DC: chyba v ' + this.name + '.renderVals()', e); vals = {}; }
    var tree = DATA.components[this.name].tree;
    var nv = build(tree, { vars: vals, parent: null }, [], null);
    patchChildren(this.host, this.vnodes, nv, this);
    this.vnodes = nv;
  };
  Instance.prototype.setProps = function (p) {
    this.props = p;
    var prev = this.logic.props;
    this.logic.props = p;
    this.render();
    if (this.mounted && typeof this.logic.componentDidUpdate === 'function') {
      try { this.logic.componentDidUpdate(prev, this.logic.state); } catch (e) { console.error(e); }
    }
  };
  Instance.prototype.schedule = function (cb) {
    if (cb) this.callbacks.push(cb);
    if (this.pending) return;
    this.pending = true;
    var self = this;
    Promise.resolve().then(function () {
      self.pending = false;
      self.render();
      flushMounts();
      var cbs = self.callbacks; self.callbacks = [];
      cbs.forEach(function (f) { try { f(); } catch (e) { console.error(e); } });
    });
  };
  Instance.prototype.unmount = function () {
    if (this.dead) return;
    this.dead = true;
    this.vnodes.forEach(destroy);
    if (this.mounted && typeof this.logic.componentWillUnmount === 'function') {
      try { this.logic.componentWillUnmount(); } catch (e) { console.error(e); }
    }
  };
  function flushMounts() {
    var q = mountQueue; mountQueue = [];
    // děti dřív než rodiče (jako v Reactu)
    for (var i = q.length - 1; i >= 0; i--) {
      var inst = q[i];
      if (inst.dead || inst.mounted) continue;
      inst.mounted = true;
      if (typeof inst.logic.componentDidMount === 'function') {
        try { inst.logic.componentDidMount(); } catch (e) { console.error('DC: chyba v ' + inst.name + '.componentDidMount()', e); }
      }
    }
  }

  /* formuláře v prototypu nikam neodesílají */
  document.addEventListener('submit', function (e) { e.preventDefault(); }, true);

  window.DC = {
    mount: function (name, el) {
      var inst = new Instance(name, {}, null);
      el.appendChild(inst.host);
      flushMounts();
      return inst;
    }
  };
})();
