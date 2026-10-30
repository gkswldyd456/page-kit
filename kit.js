// page-kit v2026.10.30-1716
window.__kitBuilt = "v2026.10.30-1716";
window.__K = {
  get c() { if (!window.__kitCfg) throw new Error("설정(__kitCfg)이 없음 — 북마크 '도구'를 다시 누르기"); return window.__kitCfg; },
  get A() { return this.c.vendor.A; }, get B() { return this.c.vendor.B; },
  get nA() { return this.c.name.A; }, get nB() { return this.c.name.B; },
  get w() { return this.c.word; },
  key(msgs) {
    const tb = ((msgs.find((m) => m.type === "meta") || {}).textbook || "").toUpperCase();
    return tb === this.A.toUpperCase() ? "A" : tb === this.B.toUpperCase() ? "B" : "";
  },
  exportRendered() { return window[this.c.hook][this.c.exp](); },
  el(k) { return document.getElementById(this.c.sel[k]); },
  async pdfjs() {
    const [p, s] = this.c.pdfjs, u = new URL(p, document.querySelector(`script[src*="${s}"]`).src).href, lib = await import(u + "?kit");
    const o = lib.GlobalWorkerOptions;
    if (o && !/^[a-z]+:/i.test(o.workerSrc || "")) o.workerSrc = u.replace(/(\.min\.mjs)$/, ".worker$1");
    return lib;
  },
};
var KIT_CFGV = 1;
window.__kitReady = () => {
  if (!window.__kitCfg) return "도구를 못 씀 — 설정(__kitCfg)이 없음. 북마크 '도구'를 다시 누르기";
  const c = window.__kitCfg, n = Object.keys(window).filter((k) => /^__/.test(k) && typeof window[k] === "function").length;
  if ((c.cfgv || 0) < KIT_CFGV) return `도구를 못 씀 — 북마크 '도구'가 옛것(설정 ${c.cfgv || 0} < ${KIT_CFGV}). 캔버스 ① 대로 북마크를 새로 만들기`;
  const built = window.__kitBuilt && window.__kitBuilt !== c.ver ? ` · 주의: 받은 도구 판 ${window.__kitBuilt} ≠ 설정 판 ${c.ver}` : "";
  const hook = typeof (window[c.hook] || {})[c.exp] === "function" ? "" : " · 주의: 페이지 통로가 없음(지침의 주소로 다시 열기)";
  return `도구 ${c.ver} 준비됨 · 함수 ${n}개 · 업체 A=${c.name.A}(${c.vendor.A}) / B=${c.name.B}(${c.vendor.B})${built}${hook}`;
};
window.__kitBadge = () => {
  if (typeof document === "undefined" || !document.body) return;
  let d = document.getElementById("__kitBadge");
  if (!d) {
    for (const t of document.body.querySelectorAll(":scope > div")) if (t.style.top === "8px" && t.style.right === "8px" && t.style.position === "fixed") t.remove();
    d = document.createElement("div"); d.id = "__kitBadge"; document.body.appendChild(d);
    clearInterval(window.__kitBadgeT); window.__kitBadgeT = setInterval(window.__kitBadge, 3000);
  }
  const s = window.__kitReady(), bad = s.startsWith("도구를 못 씀"), warn = !bad && s.includes("주의");
  const [bg, fg] = bad ? ["#c62828", "#fff"] : warn ? ["#ffb300", "#000"] : ["#2e7d32", "#fff"];
  const txt = bad ? s : warn ? "⚠ 도구 켜짐 · " + s.split(" · 주의: ").slice(1).join(" · ") : `✓ 도구 켜짐 ${window.__kitCfg.ver}`;
  if (d.textContent !== txt) d.textContent = txt;
  d.style.cssText = `position:fixed;right:12px;top:46px;z-index:99999;pointer-events:none;max-width:560px;background:${bg};color:${fg};padding:4px 10px;border-radius:6px;font:bold 12px sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.4)`;
};
if (typeof setTimeout === "function") setTimeout(() => { try { window.__kitBadge(); } catch (e) {  } }, 0);
window.__show = (x, n = 4000) => (typeof x === "string" ? x : JSON.stringify(x)).replace(/&/g, "＆").slice(0, n);
window.__loadMessages = (messages, name = "edited.json") => {
  const dt = new DataTransfer();
  dt.items.add(new File([JSON.stringify(messages)], name, { type: "application/json" }));
  const inp = window.__K.el("fileInput");
  inp.files = dt.files;
  inp.dispatchEvent(new Event("change", { bubbles: true }));
};
window.__clearRender = (m) => {
  for (const k of ["pdf", "svg", "hash", "segments", "blockPositions", "paragraphBreaks",
                   "bacenters", "renderStatus", "renderWarnings", "height"]) delete m[k];
  return m;
};
window.__lx = (() => {
  const HB = /\\begin\{hangblock\}(?:\[([^\]]*)\])?\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{hangblock\}/g;
  const AL = /\$\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}\$/g;
  const ROW = { [Symbol.split](s) {
    const out = []; let d = 0, last = 0;
    for (const x of s.matchAll(/\\\\(?![A-Za-z])|[{}]/g)) {
      const esc = x.index > 0 && s[x.index - 1] === "\\";
      if (x[0] === "{" && !esc) d++; else if (x[0] === "}" && !esc) d--;
      else if (x[0].length === 2 && d === 0) { out.push(s.slice(last, x.index)); last = x.index + 2; }
    }
    return [...out, s.slice(last)];
  } };
  const splitAmp = (row) => {
    let d = 0;
    for (let i = 0; i < row.length; i++) {
      const c = row[i], esc = i > 0 && row[i - 1] === "\\";
      if ((c === "{" || c === "}") && !esc) d += c === "{" ? 1 : -1;
      else if (c === "&" && d === 0 && !esc) return [row.slice(0, i), row.slice(i + 1)];
    }
    return [row, null];
  };
  const classify = (prefix, inner) => {
    const rows = inner.split(ROW).map((r) => r.trim()).filter(Boolean);
    const lead = (rows.length ? splitAmp(rows[0])[0] : "").trim();
    const step = (r) => !splitAmp(r)[0].trim() && /^\s*\\(?:hbright|hspace\*)/.test(splitAmp(r)[1] || "");
    const heads = rows.slice(1).filter((r) => !step(r)).map((r) => splitAmp(r)[0].trim());
    const tails = rows.slice(1).map((r) => (splitAmp(r)[1] || "").trimStart());
    if (lead.startsWith("\\therefore") && !lead.slice(10).replace(/[ ~\\,]/g, "")) return "AL-T";
    if (["\\qquad", "~~", ""].includes(lead) && heads.length && heads.every((h) => h.replace(/~|\\,/g, "").trim()))
      return lead === "\\qquad" ? "AL-II4" : lead === "~~" ? "AL-II2" : "AL-II0";
    if (lead.includes("\\text{(")) return "AL-IL";
    const fixed = prefix.match(/\\hspace\*\{([0-9.]+)mm\}\s*\{?$/);
    const tab = (fixed && +fixed[1] >= 1) || /\\tab\s*\{?$/.test(prefix);
    return (prefix.includes("\\qquad") ? "AL-I4" : tab ? "AL-IT" : "AL-I0") + (tails.some((t) => /^[+-]/.test(t)) ? "+" : "");
  };
  const nbKind = (body) => {
    if (body.includes("\\begin{aligned}")) return null;
    if (!body.includes("\\hblinebreak")) return /^(\\sffamily|\\hspace\*\{0\.01mm\}|\\qquad|~|\s|\{)*\$=/.test(body) ? "NB-PARA" : null;
    const segs = body.split("\\hblinebreak");
    if (!segs.slice(1).some((s) => /^[ {\n]*(\$[=+-]|\\hspace\*\{0\.01mm\}\\tab \$\+)/.test(s))) return null;
    return body.includes("\\hbright") ? "NB-TAIL" : /\\tab \{?\$\+/.test(body) ? "NB-TAB"
      : /^(\\sffamily|\\hspace\*\{[0-9.]+mm\}|\s|\{)*([①-⑳]|[ㄱ-ㅎ]\.|\(\d+\)|\([ⅰ-ⅹ]+\))/.test(segs[0]) ? "NB-LABEL"
      : /[가-힣]/.test(segs[0].replace(/\$[^$]*\$/g, "")) ? "NB-TEXT" : "NB-OTHER";
  };
  return { HB, AL, ROW, splitAmp, classify, nbKind };
})();
window.__find = (msgs, { report = "aligned", pattern = "", types = [], ownerLabel = "", start } = {}) => {
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const { HB, AL, classify, nbKind } = window.__lx;
  const out = []; let owner = null;
  for (const m of msgs) {
    const t = m.type;
    if (t === "question") owner = { index: m.index, label: m.label || "" };
    else if (["subtitle", "concept", "title", "questionTitle", "columnbreak", "pagebreak"].includes(t)) owner = null;
    if (t === "meta" || t === "done" || (types.length && !types.includes(t)) || (ownerLabel && (!owner || owner.label !== ownerLabel))) continue;
    for (const [, F, N, , body] of (m.latex || "").matchAll(HB)) {
      const hits = [];
      if (report === "aligned") for (const a of body.matchAll(AL)) hits.push([classify(body.slice(Math.max(0, a.index - 30), a.index), a[1]), body.slice(Math.max(0, a.index - 20), a.index + 110)]);
      if (report === "nb") { const k = nbKind(body); if (k) hits.push([k, body.slice(0, 130)]); }
      if (report === "colon") for (const c of body.replace(/\$[^$]*\$/g, "〔식〕").matchAll(/(\S)( ?):( ?)/g))
        if (!"\\{".includes(c[1])) hits.push([c[2] ? "COLON-sp" : "COLON-nosp", c.input.slice(Math.max(0, c.index - 25), c.index + 30)]);
      if (report === "d1" && ["contents_D1", "analysis_D1"].includes(t)) hits.push(["D1-" + (m.label || "?"), body.slice(0, 80)]);
      for (const [pat, snip] of hits) if (!pattern || pat === pattern) out.push({ where: W[m.index] || "?", index: m.index, type: t, owner: owner && t !== "question" ? owner.index : null, pat, snip: `[${F || "0mm"}]{${N}} ` + snip });
    }
  }
  return out;
};
window.__where = (msgs, { start } = {}) => {
  const w = window.__K.w;
  const PART = { choice: "선지", explain_t: w.tSol, answer_t: w.tAns, fillSolution: w.fill,
    fillAnswer: w.fillAns, checkpoint: "글상자", table: "표", image: "그림" };
  if (start == null) {
    let k = 0;
    for (const m of msgs) if (m.type === "question" && m.hasNum === true) {
      k++; const n = (m.attrs || {}).number;
      if (n && /^\d+$/.test(n)) { start = +n - k + 1; break; }
    }
    start = start || 1;
  }
  const num = (k) => String(start + k - 1).padStart(4, "0");
  const out = {}; let k = 0, owner = "", concept = "", sub = "", sol = "", kind = "유형";
  const conceptFile = !msgs.some((m) => m.type === "question" || m.type === "explanation");
  for (const m of msgs) {
    const t = m.type, lab = m.label || "", i = m.index;
    const sw = t === "table" ? new RegExp(w.essay + "[\\s\\S]*?[}\\s](\\d{1,2})\\}").exec(m.latex || "") : null;
    if (sw) { kind = w.essay; sub = sw[1].padStart(2, "0"); owner = ""; out[i] = `${w.essay} ${sub} 박스 · 제목`; }
    else if (t === "subtitle" && conceptFile) { concept = sub = lab; out[i] = `개념 ${concept} · 제목`; }
    else if (t === "half_contents" || t === "half_contents_D1")
      out[i] = (conceptFile ? `개념 ${concept}` : `유형 ${sub} 박스`) + (t.endsWith("_D1") && lab ? ` · ${lab}` : conceptFile ? " · 본문" : " · 설명");
    else if (t === "concept") { concept = (m.attrs || {}).label || lab; owner = ""; out[i] = `개념 ${concept}`; }
    else if (["contents", "contents_D1", "conceptUp"].includes(t)) out[i] = `개념 ${concept} · ` + ({ contents: "개념", conceptUp: w.up }[t] || lab || w.ex);
    else if (t === "subtitle") { sub = lab; owner = ""; kind = m.category === w.essay ? w.essay : "유형"; out[i] = `${kind} ${sub} 박스 · 제목`; }
    else if (t === "analysis" || t === "analysis_D1") out[i] = `${kind} ${sub} 박스 · ${w.ana}` + (lab ? `(${lab})` : "");
    else if (t === "questionTitle") { const a = m.attrs || {}; out[i] = `문제 ${a.rangeFrom ? `${a.rangeFrom}~${a.rangeTo || ""}` : num(k + 1) + "~"} · 묶음 머리`; }
    else if (t === "question") {
      if (m.hasNum === true) owner = `문제 ${num(++k)}`;
      else if (m.hasNum === "none") owner = `${kind} ${sub} ${lab || w.rep}`;
      out[i] = owner + (m.hasNum === true || m.hasNum === "none" ? "" : " · 발문 이어짐");
    }
    else if (t === "explanation") { if (m.hasNum === true) { sol = `해설 ${num(++k)}`; out[i] = sol + " · 정답 줄"; } else out[i] = sol + " · 풀이"; }
    else if (t === "label" && sol) out[i] = sol + " · " + (lab.includes("다른") ? "다른 풀이" : lab || "라벨");
    else if (t === "title") out[i] = "단원 제목";
    else if (PART[t]) { const base = sol && !owner ? sol : owner || (concept ? `개념 ${concept}` : ""); out[i] = (base ? base + " · " : "") + PART[t]; }
  }
  return out;
};
window.__rowSplit = (s) => {
  const out = []; let d = 0, cur = "";
  for (let i = 0; i < s.length;) {
    if (s[i] === "\\" && s[i + 1] === "\\" && d === 0 && !/[A-Za-z]/.test(s[i + 2] || "")) { out.push(cur, "\\\\"); cur = ""; i += 2; continue; }
    if (s[i] === "\\") { cur += s.slice(i, i + 2); i += 2; continue; }
    d += (s[i] === "{") - (s[i] === "}"); cur += s[i]; i++;
  }
  return [...out, cur];
};
window.__fixT2 = (msgs, { apply = false, start } = {}) => {
  const meta = msgs.find((m) => m.type === "meta");
  if (meta && meta.textbook && meta.textbook !== window.__K.A) return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    const lx = m.latex || "";
    let changed = false;
    const next = lx.replace(/\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/g, (all, inner) => {
      const rows = window.__rowSplit(inner);
      const lead = rows[0].match(/^\s*\\therefore(?:~|\\,|\s)*&/);
      if (!lead || /=/.test(rows[0].slice(lead[0].length))) return all;
      const conts = rows.filter((r, i) => i % 2 === 0 && i > 0);
      if (/\\therefore\\,\\,&/.test(lead[0]) && conts.every((r) => /^\s*=&/.test(r))) return all;
      if (!conts.every((r) => /^\s*&=/.test(r))) { out.push({ where: W[m.index] || "?", index: m.index, skipped: true, before: all.slice(0, 140) }); return all; }
      const fixed = rows.map((r, i) => i === 0 ? r.replace(/^(\s*)\\therefore(?:~|\\,|\s)*&/, "$1\\therefore\\,\\,&")
        : i % 2 === 0 ? r.replace(/^(\s*)&=/, "$1=&") : r).join("");
      const after = "\\begin{aligned}" + fixed + "\\end{aligned}";
      out.push({ where: W[m.index] || "?", index: m.index, before: all.slice(0, 140), after: after.slice(0, 140) });
      changed = true;
      return after;
    });
    if (changed && apply) { m.latex = next; window.__clearRender && window.__clearRender(m); }
  }
  return out;
};
window.__CW17 = /\\therefore\s*(?:\\,){4,}(?!\s*&)/g;
window.__CW18 = /(?<![A-Za-z\\])([0-9]|[a-eh-z])\\,(?=\\left\()/g;
window.__fixRe = (re, to) => (msgs, { apply = false, start } = {}) => {
  const meta = msgs.find((m) => m.type === "meta");
  if (meta && meta.textbook && meta.textbook !== window.__K.A) return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    const lx = m.latex || "";
    const n = (lx.match(re) || []).length;
    if (!n) continue;
    const next = lx.replace(re, to);
    const at = lx.search(re);
    out.push({ where: W[m.index] || "?", index: m.index, n, before: lx.slice(Math.max(0, at - 30), at + 50), after: next.slice(Math.max(0, at - 30), at + 40) });
    if (apply) {
      m.latex = next;
      if (m.attrs && typeof m.attrs.boxAnswer === "string") m.attrs.boxAnswer = m.attrs.boxAnswer.replace(re, to);
      window.__clearRender && window.__clearRender(m);
    }
  }
  return out;
};
window.__CW27 = /\{\}_\{\\,\s*([^{}]*)\}\s*\\mathrm\{([CPH])\}_\{(?:\\,\s*)?|\{\}_\{([^{}]*)\}\s*\\mathrm\{([CPH])\}_\{\\,\s*/g;
window.__fixCW27 = window.__fixRe(window.__CW27, "{}_{$1$3}\\mathrm{$2$4}_{");
window.__cw28 = (lx) => lx.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (all, inner) => {
  if (!/[㉠-㉭]/.test(inner) || /\\hbright/.test(inner)) return all;
  const sp = "(?:\\^\\{\\{\\}\\^\\{\\}\\}|\\{\\}\\^\\{\\{\\}\\^\\{\\}\\}|\\{\\}_\\{\\{\\}_\\{\\}\\}|\\\\,|~|\\s)*";
  const rows = window.__rowSplit(inner).filter((_, i) => i % 2 === 0).map((r) => r.trim()).filter((r) => r && !/^(?:\\,|\s)*$/.test(r));
  const out = [];
  for (const r of rows) {
    const x = r.match(new RegExp("^" + sp + "([\\s\\S]*?)\\s*&?\\s*" + sp + "\\\\cdots\\s*(?:\\\\,)?\\s*\\\\text\\{([㉠-㉭])\\}\\s*$"));
    if (!x) return all;
    out.push(`\\,${x[1].trim()} \\hbright{$\\cdots $ ${x[2]}}`);
  }
  return "\\begin{cases}" + out.join("\\\\") + "\\\\\n\\end{cases}";
});
window.__fixCW28 = (msgs, { apply = false, start } = {}) => {
  if (window.__K.key(msgs) !== "A") return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    if (!m.latex || !m.latex.includes("\\begin{cases}")) continue;
    const next = window.__cw28(m.latex);
    if (next === m.latex) continue;
    const at = m.latex.indexOf("\\begin{cases}");
    out.push({ where: W[m.index] || "?", index: m.index, rule: "CW28", before: m.latex.slice(at, at + 90), after: next.slice(at, at + 90) });
    if (apply) { m.latex = next; window.__clearRender && window.__clearRender(m); }
  }
  return out;
};
window.__CW31 = /(?:\\hspace\*\{0\.01mm\})?\\tab\s*(?:\{\$\\cdots\s*\$\s*([㉠-㉭])~~\\ding\{222\}\s*(\$[^$]*\$)\}(\\%)?|\$\\cdots\s*\$\s*([㉠-㉭])~~\\ding\{222\}\s*([^\\{}$]*?))\s*(?=\\end\{hangblock\})/g;
window.__cw31 = (lx) => {
  if (!lx.match(window.__CW31)) return lx;
  return lx.replace(window.__CW31, (all, c1, v, pct, c2, mark) => c1 ? `\\hspace*{1mm}{$\\cdots $ ${c1}}\\hbright{\\ding{222} {${v}}${pct || ""}}` : `\\hspace*{1mm}$\\cdots $ ${c2}\\hbright{\\ding{222} ${mark.trim()}}`)
    .replace(/\\hbright\{(\{?)\$\\cdots\s*\$\s*([㉠-㉭])(\}?)\}(?=\s*\\end\{hangblock\})/g, (all, a, c, b) => `\\hspace*{1mm}${a}$\\cdots $ ${c}${b}`);
};
window.__fixCW31 = (msgs, { apply = false, start } = {}) => {
  if (window.__K.key(msgs) !== "A") return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    if (!m.latex) continue;
    const next = window.__cw31(m.latex);
    if (next === m.latex) continue;
    const at = m.latex.search(window.__CW31);
    out.push({ where: W[m.index] || "?", index: m.index, rule: "CW31", before: m.latex.slice(Math.max(0, at - 30), at + 60), after: next.slice(Math.max(0, at - 30), at + 70) });
    if (apply) { m.latex = next; window.__clearRender && window.__clearRender(m); }
  }
  return out;
};
window.__cw15 = (msgs) => {
  const HB = /(\\begin\{hangblock\})(\[[^\]]*\])?\{([^}]*)\}\{([^}]*)\}([\s\S]*?)(\\end\{hangblock\})/g;
  const mm = (s) => parseFloat(s) || 0, fmt = (x) => `${Math.round(x * 10) / 10}mm`;
  const shift = (lx, L) => lx.replace(HB, (all, a, F, N, C, body, z) => a + `[${fmt(Math.max(0, mm((F || "[0mm]").slice(1, -1)) - L))}]` + `{${fmt(Math.max(0, mm(N) - L))}}{${C}}` + body + z);
  const out = [], drop = new Set();
  for (let i = 0; i < msgs.length; i++) {
    const m = msgs[i];
    if ((m.type !== "contents_D1" && m.type !== "analysis_D1") || !m.latex) continue;
    const Ns = [...m.latex.matchAll(HB)].map((x) => mm(x[3]));
    if (!Ns.length) continue;
    let L = Math.min(...Ns);
    if (![12.9, 8.9, 8.5].some((w) => Math.abs(L - w) < 0.05)) continue;
    const r = { i, L, latex: shift(m.latex, L), merged: [] };
    for (let j = i + 1; j < msgs.length && msgs[j].type === "contents"; j++) {
      const hb = [...(msgs[j].latex || "").matchAll(HB)];
      if (!hb.length || hb.some((x) => mm((x[2] || "[0mm]").slice(1, -1)) < L - 0.5 || x[4] !== "0")) break;
      r.latex = r.latex.replace(/\s*$/, "\n" + hb.map((x) => shift(x[0], L)).join("\n") + "\n");
      r.merged.push(j); drop.add(j);
    }
    out.push(r);
  }
  return { out, drop };
};
window.__fixCW15 = (msgs, { apply = false, start } = {}) => {
  if (window.__K.key(msgs) !== "A") return apply ? msgs : [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const { out, drop } = window.__cw15(msgs);
  const list = out.map((r) => ({ where: W[msgs[r.i].index] || "?", index: msgs[r.i].index, rule: "CW15", what: `상자 내어쓰기 −${r.L}mm` + (r.merged.length ? ` · 뒷문단 ${r.merged.length}개 합침(${r.merged.map((j) => W[msgs[j].index]).join(", ")})` : "") }));
  if (!apply) return list;
  const work = JSON.parse(JSON.stringify(msgs));
  for (const r of out) { work[r.i].latex = r.latex; window.__clearRender && window.__clearRender(work[r.i]); }
  if (!drop.size) return work;
  const keep = work.filter((_, i) => !drop.has(i)), map = new Map();
  let k = 0;
  for (const m of keep) { if (m.type === "meta" || m.type === "done") continue; map.set(m.index, k); m.index = k++; }
  for (const m of keep) {
    if (m.sourceIndex != null && map.has(m.sourceIndex)) m.sourceIndex = map.get(m.sourceIndex);
    if (Array.isArray(m.children)) m.children.forEach((c) => { if (c && map.has(c.index)) c.index = map.get(c.index); });
    if (m.type === "meta" && m.totalCount != null) m.totalCount = k;
  }
  return keep;
};
window.__CW14 = {
  analysis: { "①": 3.3, "(1)": 3.5, "(ⅰ)": 4.4 }, conceptUp: { "①": 3.3, "(1)": 3.5, "(ⅰ)": 4.4 },
  explain_t: { "①": 2.6, "(1)": 3.3, "(ⅰ)": 3.6, "ㄱ.": 2.9 },
  explanation: { "①": 4.1, "(1)": 5.1, "(ⅰ)": 6.1, "ㄱ.": 5.2 },
  question: { "①": 4.2, "(1)": 5.2, "(ⅰ)": 6.2, "ㄱ.": 5.3 }, fillSolution: { "①": 4.2, "(1)": 5.2, "(ⅰ)": 6.2, "ㄱ.": 5.3 },
};
window.__cw14 = (m) => {
  const tb = window.__CW14[m.type], out = [];
  if (!tb || !m.latex) return out;
  const LAB = /^(?:\\sffamily\s*|\\bfseries\s*|\\textmd\s*|\{\\fontsize\{[^}]*\}\{[^}]*\}\\selectfont\s*|\\hspace\*\{[^}]*\}\s*|\{|\s)*(?:\\textrm\{)?(\([ⅰ-ⅻ]+\)|\(\d+\)|[①-⑳]|[ㄱ-ㅎ]\.)/;
  for (const h of m.latex.matchAll(/\\begin\{hangblock\}(?:\[[^\]]*\])?\{([^}]*)\}\{[^}]*\}([\s\S]*?)\\end\{hangblock\}/g)) {
    const lab = (h[2].match(LAB) || [])[1];
    if (!lab) continue;
    const kind = /^\([ⅰ-ⅻ]/.test(lab) ? "(ⅰ)" : /^\(\d/.test(lab) ? "(1)" : /^[①-⑳]/.test(lab) ? "①" : "ㄱ.";
    const want = tb[kind], N = parseFloat(h[1]) || 0;
    if (want == null || !N) continue;
    const rest = h[2].slice(h[2].indexOf(lab) + lab.length);
    if (LAB.test(rest.replace(/^\}?\s*/, ""))) continue;
    if (Math.abs(N - want) > 0.05) out.push({ lab: kind, N, want, snip: h[2].slice(0, 40), src: h[0] });
  }
  return out;
};
window.__cw30 = (lx) => {
  let n = 0;
  const HB = /\\begin\{hangblock\}(?:\[[^\]]*\])?\{([^}]*)\}\{[^}]*\}([\s\S]*?)\\end\{hangblock\}/g;
  const hbs = [...lx.matchAll(HB)];
  let out = lx;
  for (let i = hbs.length - 1; i > 0; i--) {
    const prev = hbs[i - 1], cur = hbs[i];
    const lab = prev[2].match(/^(?:\\sffamily\s*)?\\hspace\*\{([0-9.]+)mm\}\s*(?:\\sffamily\s*)?(?:\\textsf\{)?(?:\{?\\fontsize\{[^}]*\}\{[^}]*\}\\selectfont\s*)?\(\d+\)/);
    const body = cur[2].match(/^(\\hspace\*\{[0-9.]+mm\})((?:\s*\\hspace\*\{0\.01mm\}\\tab\s*)+)/);
    if (!lab || !body || !(parseFloat(prev[1]) > 0)) continue;
    const N = parseFloat(prev[1]), H = parseFloat(lab[1]), L = +(N - H).toFixed(1);
    const nb = `\\begin{hangblock}[${L}mm]{${N}mm}{0}\\hspace*{${H}mm}` + cur[2].slice(body[0].length).replace(/^\s+/, "") + "\\end{hangblock}";
    out = out.slice(0, cur.index) + nb + out.slice(cur.index + cur[0].length);
    n++;
  }
  return { lx: out, n };
};
window.__fixCW30 = (msgs, { apply = false, start } = {}) => {
  if (window.__K.key(msgs) !== "A") return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    if (m.type !== "contents" || !m.latex) continue;
    const r = window.__cw30(m.latex);
    if (!r.n) continue;
    out.push({ where: W[m.index] || "?", index: m.index, rule: "CW30", n: r.n, what: `라벨 항목 뒷문단 ${r.n}개 → 라벨 글 자리` });
    if (apply) { m.latex = r.lx; window.__clearRender && window.__clearRender(m); }
  }
  return out;
};
window.__fixCW14 = (msgs, { apply = false, start } = {}) => {
  if (window.__K.key(msgs) !== "A") return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    if (m.type !== "explain_t") continue;
    let lx = m.latex;
    for (const x of window.__cw14(m).filter((x) => x.N > x.want * 2 && x.N > x.want + 4)) {
      const fixed = x.src.replace(/^(\\begin\{hangblock\}(?:\[[^\]]*\])?\{)[^}]*\}/, (a, h) => `${h}${x.want}mm}`);
      lx = lx.replace(x.src, () => fixed);
      out.push({ where: W[m.index] || "?", index: m.index, rule: "CW14", what: `라벨 ${x.lab} 폭 ${x.N} → ${x.want}(서버 값 망가짐)` });
    }
    if (apply && lx !== m.latex) { m.latex = lx; window.__clearRender && window.__clearRender(m); }
  }
  return out;
};
window.__fixCW17 = window.__fixRe(window.__CW17, "\\therefore ~");
window.__fixCW18 = window.__fixRe(window.__CW18, "$1");
window.__PMAT = /\\pmat\[(\w+)\]\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g;
window.__splitTop = (s, sep) => {
  const out = []; let depth = 0, cur = "", i = 0;
  while (i < s.length) {
    if (depth === 0 && s.startsWith(sep, i) && !(sep === "&" && i && s[i - 1] === "\\")) { out.push(cur); cur = ""; i += sep.length; continue; }
    depth += (s[i] === "{") - (s[i] === "}"); cur += s[i]; i++;
  }
  return [...out, cur];
};
window.__pmatCells = (body) => {
  const rows = __splitTop(body, "\\\\").filter((r) => r.trim());
  const cells = rows.map((r) => __splitTop(r, "&").map((c) => c.replace(/^(?:\\,|~|\s)+|(?:\\,|~|\s)+$/g, "")));
  const w = Math.max(0, ...cells.map((r) => r.length));
  return [cells.map((r) => [...r, ...Array(w - r.length).fill("")]), w];
};
window.__pmatFix = (all, spec, body) => {
  const [cells, w] = __pmatCells(body);
  const keep = [...Array(w).keys()].filter((j) => cells.some((r) => r[j]));
  if (!cells.length || !keep.length) return all;
  if (keep.length === 1 && w === 1 && !/~|\\,/.test(body)) return all;
  return `\\pmat[${spec[0].repeat(keep.length)}]{` + cells.map((r) => keep.map((j) => r[j]).join("\\, & \\,")).join(" \\\\ ") + "}";
};
window.__pmatBad = (a) => __pmatFix(...a) !== a[0];
window.__fixCW19 = (msgs, { apply = false, start } = {}) => {
  const meta = msgs.find((m) => m.type === "meta");
  if (meta && meta.textbook && meta.textbook !== window.__K.A) return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    const lx = m.latex || "";
    const next = lx.replace(__PMAT, __pmatFix);
    if (next === lx) continue;
    const a = [...lx.matchAll(__PMAT)].find(__pmatBad);
    out.push({ where: W[m.index] || "?", index: m.index, n: [...lx.matchAll(__PMAT)].filter(__pmatBad).length,
      before: a[0].slice(0, 80), after: __pmatFix(...a).slice(0, 80) });
    if (apply) {
      m.latex = next;
      if (m.attrs && typeof m.attrs.boxAnswer === "string") m.attrs.boxAnswer = m.attrs.boxAnswer.replace(__PMAT, __pmatFix);
      window.__clearRender && window.__clearRender(m);
    }
  }
  return out;
};
window.__colonFix = (lx) => {
  let n = 0;
  const at = [];
  const HB = /(\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\})([\s\S]*?)(\\end\{hangblock\})/g;
  const bare = (s) => s.replace(/\\[A-Za-z]+\*?(?:\[[^\]]*\])?(?:\{[^{}]*\})*/g, "").replace(/[{}\s]/g, "");
  const seg = (s) => {
    const p = s.split(/(\$[^$]*\$)/);
    for (let i = 0; i < p.length; i += 2) {
      p[i] = p[i].replace(/( *):( *)/g, (all, a, b, off, str) => {
        const before = p.slice(0, i).join("") + str.slice(0, off), after = str.slice(off + all.length) + p.slice(i + 1).join("");
        if (str[off - 1] === "\\" || /(?:\\tab|~)\s*$/.test(before) || /^\s*(?:\\tab|~)/.test(after)) return all;
        if (!bare(before) || !bare(after)) return all;
        if (a === " " && b === " ") return all;
        n++; at.push((before.slice(-12) + ":" + after.slice(0, 12)).replace(/\s+/g, " "));
        return " : ";
      });
    }
    return p.join("");
  };
  const out = lx.replace(HB, (all, head, body, tail) => head + body.split(/(\\hblinebreak)/).map((s, i) => i % 2 ? s : seg(s)).join("") + tail);
  return { lx: out, n, at };
};
window.__fixColon = (msgs, { apply = false, start } = {}) => {
  const V = window.__K.key(msgs);
  if (!V) return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    if (!m.latex || !m.latex.includes(":")) continue;
    const r = window.__colonFix(m.latex);
    if (!r.n) continue;
    out.push({ where: W[m.index] || "?", index: m.index, rule: V === "A" ? "CW12" : "GW28", n: r.n, before: r.at[0], after: r.at[0].replace(/ *: */, " : ") });
    if (apply) { m.latex = r.lx; window.__clearRender && window.__clearRender(m); }
  }
  return out;
};
window.__fixA = (msgs, { start, apply = false } = {}) => {
  if (window.__K.key(msgs) !== "A") return { fix: [], msgs };
  const fix = window.__fixCW15(msgs, { start }).map((x) => ({ ...x }));
  const work = apply ? window.__fixCW15(msgs, { apply: true, start }) : msgs;
  for (const [rule, f] of [["CW05", window.__fixT2], ["CW17", window.__fixCW17], ["CW18", window.__fixCW18], ["CW19", window.__fixCW19], ["CW25", window.__fixDiv], ["CW12", window.__fixColon],
    ["CW27", window.__fixCW27], ["CW28", window.__fixCW28], ["CW30", window.__fixCW30], ["CW14", window.__fixCW14], ["CW31", window.__fixCW31]])
    for (const x of f(work, { apply, start })) fix.push({ ...x, rule: x.rule || rule });
  return { fix, msgs: work };
};
window.__div = (() => {
  const grab = (s, i) => { let d = 0; for (let j = i; j < s.length; j++) { if (s[j] === "\\") { j++; continue; } if (s[j] === "{") d++; else if (s[j] === "}" && --d === 0) return j; } return -1; };
  const splitTop = (s, sep) => { const out = []; let d = 0, cur = ""; for (let j = 0; j < s.length; j++) { const ch = s[j]; if (d === 0 && s.startsWith(sep, j)) { out.push(cur); cur = ""; j += sep.length - 1; continue; } if (ch === "\\") { cur += ch + (s[j + 1] || ""); j++; continue; } if (ch === "{") d++; if (ch === "}") d--; cur += ch; } out.push(cur); return out; };
  const num = (v) => String(+(+v).toFixed(2));
  const kind = (lx) => /\\begin\{tabular\}/.test(lx) && /\\left\)\\vphantom/.test(lx) ? "B" : /\\sdreset/.test(lx) ? "S" : /\\longdiv\b/.test(lx) ? "A" : "";
  const isDiv = (m) => !!kind(m.latex || "");
  const TEACH = (t) => { const lx = t.latex || "", h = lx.indexOf("\\begin{hangblock}");
    return ["explain_t", "answer_t", "fillAnswer"].includes(t.type) || (h >= 0 ? lx.slice(0, h) : lx).includes("teacherink"); };
  const size = (msgs, i) => {
    if ((msgs[i].latex || "").includes("teacherink")) return [7, 4.5];
    for (let j = i - 1; j >= 0; j--) {
      const t = msgs[j]; if (t.type === "meta" || t.type === "done" || isDiv(t) || TEACH(t)) continue;
      const s = /\\setmyfontsize\{([\d.]+)pt\}/.exec(t.latex || ""); if (s) return [+s[1], null];
    }
    return null;
  };
  const unbox = (s) => {
    for (let i = s.indexOf("\\boxed{"); i >= 0; i = s.indexOf("\\boxed{", i + 1)) {
      const st = i + "\\boxed".length, en = grab(s, st); if (en < 0) break;
      const x = s.slice(st + 1, en).replace(/^~|~$/g, "").trim(), a = s.slice(0, i).replace(/\\,\s*$/, ""), b = s.slice(en + 1).replace(/^\\,/, "");
      const rep = `{\\,\\divboxed{\\,${x}\\,}\\,}`; s = a + rep + b; i = a.length + rep.length - 1;
    }
    return s;
  };
  const term = (s, v) => {
    s = s.replace(/^\s*\$|\$\s*$/g, "").replace(/\\left\)\\vphantom\{\\wfrac\{0\}\{0\}\}\\,\\right\.\\hspace\{-0\.12em\}/, "").replace(/\\Centering/g, "").trim();
    s = unbox(s);
    let sg = ""; const m0 = /^(?:\\,|\s)*([+-])(?:\\,|\s)*/.exec(s); if (m0) { sg = m0[1]; s = s.slice(m0[0].length); }
    const lm = new RegExp(`(${v}(?:\\^\\{[^}]*\\}|\\^\\d)?)$`).exec(s.trim());
    const let_ = lm ? lm[1] : "", co = (lm ? s.trim().slice(0, -lm[1].length) : s.trim()).replace(/^(?:\\,|\s)+|(?:\\,|\s)+$/g, "");
    return [sg, co, let_];
  };
  const terms = (expr, v) => {
    const out = []; let d = 0, cur = "";
    for (let j = 0; j < expr.length; j++) {
      const ch = expr[j]; if (ch === "\\") { const w = /^\\[A-Za-z]+|^\\./.exec(expr.slice(j))[0]; cur += w; j += w.length - 1; if (w === "\\left") d++; if (w === "\\right") d--; continue; }
      if (ch === "{" || ch === "(") d++; if (ch === "}" || ch === ")") d--;
      if (d === 0 && (ch === "+" || ch === "-") && cur.replace(/\\Centering|\\,|\s/g, "")) { out.push(cur); cur = ""; }
      cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out.map((t) => term(t, v));
  };
  const cell = ([sg, co, l], first, lead = "") => [first && sg === "+" ? "" : sg, lead + co, l ? `\\mkern-4mu ${l}` : ""];
  const qArray = (ts, gak) => {
    const cells = ts.flatMap((t, k) => cell(t, k === 0, k === 0 && gak ? "\\Centering " : ""));
    return `\\begin{array}[b]{${"crl".repeat(ts.length)}} ${cells.join(" & ")}\\end{array}`;
  };
  const varOf = (div) => (/[a-z]/.exec(div.replace(/\\[A-Za-z]+/g, "")) || ["x"])[0];
  const resize = (lx, [S, L]) => lx.replace(/\\setmyfontsize\{([\d.]+)pt\}\{(-?[\d.]+)pt\}(%?)/g, (a, X, Y, pct) =>
    `\\setmyfontsize{${num(S)}pt}{${L != null ? num(L) : +Y <= 0 ? num(S * 0.6) : pct ? num(Y * S / X) : Y}pt}${pct}`);
  const toA = (lx, gak) => {
    const b0 = lx.indexOf("\\begin{tabular}"), e0 = lx.indexOf("\\end{tabular}");
    const spec = /\\begin\{tabular\}\{([^}]*)\}/.exec(lx.slice(b0))[1], n = spec.replace(/[^lcr]/g, "").length - 1;
    const pre = lx.slice(0, b0), post = lx.slice(e0 + "\\end{tabular}".length);
    let body = lx.slice(b0 + `\\begin{tabular}{${spec}}`.length, e0).replace(/\\TabPositions\{[^}]*\}\s*/g, "");
    const rows = []; let rule = false;
    for (let r of splitTop(body, "\\\\")) {
      while (/^\s*\\cline\{[^}]*\}/.test(r)) { rule = true; r = r.replace(/^\s*\\cline\{[^}]*\}/, ""); }
      if (!r.trim()) continue;
      const cs = splitTop(r, "&").map((c) => { c = c.trim(); const mc = /^\\multicolumn\{\d+\}\{[lcr]\}\{([\s\S]*)\}$/.exec(c); if (mc) c = mc[1]; return c.replace(/\\tab\s*/g, "").trim(); });
      rows.push({ cs, rule }); rule = false;
    }
    const di = rows.findIndex((r) => r.cs.some((c) => c.includes("\\left)\\vphantom")));
    if (di < 0 || n < 1) return null;
    const dvs = rows[di].cs[0].replace(/^\$|\$$/g, "").trim(), v = varOf(dvs), E = 3 * n + 2;
    const tcells = (cs) => { const out = []; let first = true; for (let k = 1; k <= n; k++) { const c = (cs[k] || "").trim(); if (!c || c === "$$") { out.push("", "", ""); continue; } out.push(...cell(term(c, v), first)); first = false; } return out; };
    const qs = rows.slice(0, di).flatMap((r) => r.cs.slice(1).filter((c) => c.trim()).map((c) => term(c, v)));
    const sp = (/\\setmyfontspacing\{([^}]*)\}\{([^}]*)\}/.exec(pre) || [, "0.95", "-4"]);
    const fs = /\\setmyfontsize\{([\d.]+)pt\}/.exec(pre), S = fs ? +fs[1] : 10;
    const lines = [`{\\renewcommand{\\arraystretch}{1.2}%`, `\\setmyfontspacing{${sp[1]}}{${sp[2]}}%`, `\\setmyfontsize{${num(S)}pt}{${num(S * 0.6)}pt}%`, `\\longdivrows`];
    if (!gak) lines.push(`\\setlength{\\fboxsep}{1pt}%`);
    lines.push(`\\arraycolsep=0.1em%`, `\\sbox0{$\\begin{array}{r@{\\hskip\\arraycolsep}c@{\\hskip\\arraycolsep}${"crl".repeat(n)}}`);
    lines.push(` &  & \\multicolumn{${3 * n}}{l}{${qArray(qs, gak)}} \\\\`, `\\cline{2-${E}}`);
    const rest = rows.slice(di);
    rest.forEach((r, k) => {
      if (k > 0 && r.rule) lines.push(`\\cline{2-${E}}`);
      const head = k === 0 ? `${dvs} & \\longdiv` : " & ";
      lines.push(`${head} & ${tcells(r.cs).join(" & ")}${k < rest.length - 1 ? " \\\\" : ""}`);
    });
    lines.push(`\\end{array}$}%`, `\\noindent\\usebox0\\par}`);
    return pre.replace(/\s*$/, "\n") + lines.join("\n") + post;
  };
  const splitQ = (lx, gak) => {
    const i = lx.search(/\\multicolumn\{\d+\}\{l\}\{\\Centering /); if (i < 0) return lx;
    const k = /\\multicolumn\{(\d+)\}\{l\}\{/.exec(lx.slice(i)), st = i + k[0].length - 1, en = grab(lx, st);
    const expr = lx.slice(st + 1, en), dv = (/\n\s*([^&\n]+?)\s*&\s*\\longdiv/.exec(lx) || [, "x"])[1];
    return lx.slice(0, st + 1) + qArray(terms(expr, varOf(dv)), gak) + lx.slice(en);
  };
  const issues = (msgs, i, gak) => {
    const m = msgs[i], lx = m.latex || "", k = kind(lx), out = [];
    if (!k) return out;
    if (k === "B") out.push(["나눗셈이 깨진 꼴(tabular + \\left)\\vphantom) → \\longdiv array 꼴로", lx.slice(lx.indexOf("\\begin{tabular}"), lx.indexOf("\\begin{tabular}") + 90)]);
    if (k === "A" && /\\multicolumn\{\d+\}\{l\}\{\\Centering /.test(lx)) out.push(["나눗셈 몫이 통글 → 항마다 칸으로", (/\\multicolumn\{\d+\}\{l\}\{\\Centering [^\n]*/.exec(lx) || [""])[0].slice(0, 90)]);
    const want = size(msgs, i);
    if (want) {
      const bad = [...lx.matchAll(/\\setmyfontsize\{([\d.]+)pt\}\{(-?[\d.]+)pt\}/g)].filter((x) => +x[1] !== want[0] || (want[1] != null && +x[2] !== want[1]));
      if (bad.length) out.push([`${k === "S" ? "조립제법" : "나눗셈"} 크기 ${[...new Set(bad.map((x) => x[1] + "pt{" + x[2] + "pt}"))].join(", ")} → ${want[0]}pt${want[1] != null ? `{${want[1]}pt}` : ""}(이 자리)`, bad[0][0]]);
    }
    return out;
  };
  const fixOne = (msgs, i, gak) => {
    let lx = msgs[i].latex || "";
    if (kind(lx) === "B") lx = toA(lx, gak) || lx;
    if (kind(lx) === "A" && /\\multicolumn\{\d+\}\{l\}\{\\Centering /.test(lx)) lx = splitQ(lx, gak);
    const want = size(msgs, i); if (want) lx = resize(lx, want);
    return lx;
  };
  return { kind, isDiv, size, issues, fixOne, toA, splitQ, terms };
})();
window.__fixDiv = (msgs, { start, apply = false } = {}) => {
  const V = window.__K.key(msgs); if (!V) return [];
  const gak = V === "B", rule = gak ? "GW27" : "CW25", W = window.__where(msgs, { start }), out = [];
  msgs.forEach((m, i) => {
    if (!window.__div.isDiv(m) || !window.__div.issues(msgs, i, gak).length) return;
    const after = window.__div.fixOne(msgs, i, gak);
    if (after === m.latex) return;
    out.push({ where: W[m.index] || m.type, index: m.index, rule, before: m.latex, after });
    if (apply) { m.latex = after; window.__clearRender && window.__clearRender(m); }
  });
  return out;
};
window.__fixGW27 = (msgs, o) => window.__fixDiv(msgs, o);
window.__fixCW25 = (msgs, o) => window.__fixDiv(msgs, o);
window.__check = (msgs, { start } = {}) => {
  const meta = msgs.find((m) => m.type === "meta") || {};
  const vendor = window.__K.key(msgs);
  if (!vendor) return [{ where: "파일", index: null, type: "meta", rule: "-", what: `업체 모름(meta.textbook=${meta.textbook || "없음"}) — 검사 안 함. 사람에게 교재를 묻는다`, snip: "" }];
  const all = msgs;
  msgs = msgs.filter((m) => m.type !== "meta" && m.type !== "done");
  const { HB, AL, ROW, splitAmp, classify, nbKind } = window.__lx;
  const W = window.__where(msgs, { start });
  const PREFIX = /^(?:\\hspace\*\{[0-9.]+mm\}|\\qquad|~|\\tab|\\sffamily|\\Centering|\s|\{)*/;
  const TAIL = /\\hbright\{[\s\S]*?\}\s*$/;
  const pre = (b) => b.match(PREFIX)[0];
  const lead = (b) => b.slice(pre(b).length).replace(/^\{+/, "");
  const starts = (s, xs) => xs.some((x) => s.startsWith(x));
  const visible = (b) => b.replace(TAIL, "").replace(/\$[^$]*\$/g, "").replace(/\\(?:hspace\*?|textcolor|color|TabPositions)\{[^}]*\}/g, "")
    .replace(/\\[A-Za-z]+\*?/g, "").replace(/[{}~,.\s]/g, "");
  const kind = (b) => {
    if (b.includes("\\begin{aligned}")) return "al";
    const rest = b.slice(pre(b).length);
    if (rest.startsWith("$\\therefore") || rest.startsWith("{$\\therefore")) return "eq";
    if (!b.replace(TAIL, "").includes("$")) return visible(b) || b.includes("\\hbright") ? "text" : "";
    return visible(b) ? "text" : "eq";
  };
  const snip = (F, N, b, at = 0) => `[${F || "0mm"}]{${N}} ` + b.slice(Math.max(0, at - 20), at + 110);
  const firstLead = (inner) => splitAmp(inner.split(ROW)[0])[0];
  const noAmp = (inner) => inner.split(ROW).map((r) => r.trim()).filter(Boolean).some((r) => splitAmp(r)[1] === null);
  const SP = {
    A: { explanation: ["1/0"], explain_t: ["0.9/-10"], answer_t: ["0.9/-10"], question: ["0.92/0", "1/0", "0.9/-10"],
      choice: ["0.92/0"], fillSolution: ["0.92/0"], fillAnswer: ["1/0"], questionTitle: ["0.92/0"],
      analysis: ["1/-3"], analysis_D1: ["1/-3"], contents: ["0.95/-5"], contents_D1: ["0.95/-5"], conceptUp: ["0.95/0"] },
    B: { explanation: ["0.95/-4"], question: ["0.95/-4"], questionTitle: ["0.95/-4"], half_contents: ["0.95/-4"],
      half_contents_D1: ["0.95/-4"], checkpoint: ["0.95/-5"], subtitle: ["0.95/-5"] },
  }[vendor];
  const out = [];
  const add = (m, rule, what, s) => out.push({ where: W[m.index] || "?", index: m.index, type: m.type, rule, what, snip: s });
  const spacing = (m, rid) => {
    const ok = SP[m.type]; if (!ok) return;
    const seen = [...new Set([...(m.latex || "").matchAll(/\\setmyfontspacing\{([^}]*)\}\{([^}]*)\}/g)].map((x) => x[1] + "/" + x[2]))];
    const squeeze = (v) => { const [r, s] = v.split("/").map(Number); return seen.some((x) => ok.includes(x)) && r >= 0.9 && s >= -10; };
    const bad = seen.filter((v) => !ok.includes(v) && !(rid === "GW12" && squeeze(v))).sort();
    if (bad.length) add(m, rid, `장평/자간 ${bad.join(", ")} (이 자리 기준 ${[...ok].sort().join(", ")})`, "");
  };
  const nb = (m, rid) => { for (const [, F, N, , b] of (m.latex || "").matchAll(HB)) { const k = nbKind(b); if (k) add(m, rid(k), k, `[${F ?? ""}]{${N}} ` + b.slice(0, 130)); } };
  if (vendor === "A") {
    const units = []; let cur = [], key = null, marker = false;
    for (const m of msgs) {
      if (m.type === "explanation") {
        const k = (W[m.index] || "").split(" · ")[0];
        if (m.hasNum === true || k !== key) { if (cur.length) units.push([cur, marker]); cur = []; key = k; marker = false; }
        if (m.hasNum !== true) cur.push(m);
      } else if (m.type === "label" && cur.length) marker = true;
      else if (m.type === "explain_t" || m.type === "fillSolution") units.push([[m], false]);
    }
    if (cur.length) units.push([cur, marker]);
    for (const [unit, mk] of units) {
      const paras = unit.flatMap((m) => [...(m.latex || "").matchAll(HB)].map(([, F, N, , b]) => [m, F, N, b]));
      const tog = mk || paras.some(([, , , b]) => kind(b) === "text");
      const word = tog ? "함께" : "혼자";
      for (const [m, F, N, b] of paras) {
        const k = kind(b);
        if (k === "al") {
          for (const a of b.matchAll(AL)) {
            if (firstLead(a[1]).includes("\\text{")) continue;
            const pat = classify(b.slice(Math.max(0, a.index - 30), a.index), a[1]).replace(/\+$/, "");
            const want = { "AL-I4": tog ? "AL-I4" : "AL-I0", "AL-I0": tog ? "AL-I4" : "AL-I0",
              "AL-II4": tog ? "AL-II4" : "AL-II2", "AL-II2": tog ? "AL-II4" : "AL-II2" }[pat];
            if (want && want !== pat) add(m, pat.startsWith("AL-II") ? "CW04" : "CW03", `${pat} → ${want} (${word})`, snip(F, N, b, a.index));
          }
        } else if (k === "eq" && !lead(b).startsWith("$\\therefore") && !(starts(lead(b), ["$+", "$-"]) && pre(b).includes("\\tab"))) {
          const has4 = pre(b).includes("\\qquad");
          if (has4 !== tog) add(m, "CW06", `단독 수식 줄 ${has4 ? "4칸" : "0칸"} → ${tog ? "4칸" : "0칸"} (${word})`, snip(F, N, b));
        }
      }
    }
    for (const m of msgs) {
      const t = m.type; let pi = -1;
      for (const [, F, N, , b] of (m.latex || "").matchAll(HB)) {
        pi++;
        for (const a of b.matchAll(AL)) {
          if (noAmp(a[1])) add(m, "CW01", "aligned 행에 최상위 & 없음", snip(F, N, b, a.index));
          const pat = classify(b.slice(Math.max(0, a.index - 30), a.index), a[1]);
          if (pat === "AL-T" && !a[1].trimStart().startsWith("\\therefore\\,\\,&")) add(m, "CW05", "∴ 머리 묶음이 서버 꼴 → __fixT2", snip(F, N, b, a.index));
          if (pat.startsWith("AL-IT")) add(m, "CW16", `${window.__K.nB} 꼴(묶음 머리 고정 폭 TAB)`, snip(F, N, b, a.index));
        }
        const k = kind(b), p = pre(b);
        if (t === "question" && k === "eq" && (p.includes("\\qquad") || p.includes("\\tab"))) add(m, "CW07", "발문 단독수식줄 앞에 4칸·TAB", snip(F, N, b));
        if (["contents", "conceptUp", "analysis", "analysis_D1"].includes(t) && k === "eq" && !p.includes("\\qquad")
            && !starts(lead(b), ["$+", "$-", "$="]) && !b.includes("\\hblinebreak") && !(t === "conceptUp" && pi === 0)) add(m, "CW08", `개념·${window.__K.w.up}·${window.__K.w.ana} 단독수식줄에 4칸 없음`, snip(F, N, b));
        if (["explanation", "explain_t", "fillSolution"].includes(t) && k === "eq" && p.includes("\\hspace*{0.01mm}\\tab")
            && !starts(lead(b), ["$+", "$-"])) add(m, "CW16", `${window.__K.nB} 꼴(단독 수식 줄 앞 TAB)`, snip(F, N, b));
      }
      nb(m, (k) => k === "NB-PARA" ? "CW09" : "CW10");
      const lx = m.latex || "";
      for (const a of lx.matchAll(window.__CW17)) add(m, "CW17", "∴ 뒤 \\,\\,\\,\\, → ~ (__fixCW17)", lx.slice(Math.max(0, a.index - 20), a.index + 60));
      for (const x of window.__cw14(m)) add(m, "CW14", `라벨 ${x.lab} 폭 ${x.N} → 표 ${x.want}`, x.snip);
      if ((m.type === "contents_D1" || m.type === "analysis_D1") && window.__cw15([m]).out.length) add(m, "CW15", "예시·참고 상자 내어쓰기에 [참고] 글자 폭이 남음 (__fixCW15)", lx.slice(lx.indexOf("\\begin{hangblock}")).slice(0, 60));
      if (lx.includes("\\begin{cases}") && window.__cw28(lx) !== lx) add(m, "CW28", "연립 ㉠㉡ 꼬리 → 한 칸 + \\hbright (__fixCW28)", lx.slice(lx.indexOf("\\begin{cases}")).slice(0, 90));
      for (const a of lx.matchAll(window.__CW27)) add(m, "CW27", "조합 기호 첨자 앞 \\, 지움 (__fixCW27)", a[0]);
      for (const a of lx.matchAll(window.__CW31)) add(m, "CW31", "⋯㉠ 꼬리 + 채점 꼬리 한 줄 → \\hspace*{D} + \\hbright (__fixCW31 · 렌더로 D)", lx.slice(Math.max(0, a.index - 30), a.index + a[0].length));
      for (const a of lx.matchAll(window.__CW18)) add(m, "CW18", `${a[1]}\\,\\left( → ${a[1]}\\left( (__fixCW18)`, lx.slice(Math.max(0, a.index - 30), a.index + 40));
      for (const a of lx.matchAll(window.__PMAT)) if (__pmatBad(a)) add(m, "CW19", "행렬 꼴(빈 열·~·칸) (__fixCW19)", a[0].slice(0, 80));
      if (window.__div.isDiv(m)) for (const [w, s] of window.__div.issues(msgs, msgs.indexOf(m), false)) add(m, "CW25", w + " (__fixDiv)", s);
      for (const at of window.__colonFix(lx).at) add(m, "CW12", "글 콜론 앞뒤 빈칸 한 칸 (__fixColon)", at);
      spacing(m, "CW13");
    }
    msgs.forEach((m, i) => {
      const c = msgs[i + 1];
      if (m.type !== "question" || !c || c.type !== "choice") return;
      const marks = [...new Set([...(c.latex || "").matchAll(/checkmark\}\\,\}\s*\\rlap\{([①-⑤])\}/g)].map((x) => x[1]))].sort().join("");
      const ans = [...new Set(String((m.attrs || {}).answer || "").match(/[①-⑤]/g) || [])].sort().join("");
      if (marks !== ans) add(c, "CW11", `attrs.answer ${ans || "없음"} ≠ 선지 ✓ ${marks || "없음"}`, "");
    });
  } else {
    const mm = (v) => +((v || "").replace(/[^0-9.]/g, "") || 0);
    const g = (v) => String(+v.toPrecision(6));
    const maths = (s) => (s.match(/\$[^$]*\$/g) || []).join("");
    const hasText = (s) => /[가-힣]/.test(visible(s));
    const TABS = /^(?:\\hspace\*\{[0-9.]+mm\}|\\tab|\s)*/;
    const tabUnits = (p) => p.split("\\tab").length - 1 + [...p.matchAll(/\\hspace\*\{([0-9.]+)mm\}/g)].filter((x) => +x[1] >= 1).length;
    const OP_LEAD = /^\{?\$\{?(?:~|\\,|\s)*(?:[+-]|\\left\.)/;
    const REL = /[=<>]|\\(?:le|ge|leq|geq|ne|neq)(?![A-Za-z])/;
    const AMP_REL = /^\s*(?:\\,|~|\s)*(?:[=<>]|\\(?:le|ge|leq|geq|ne|neq|rightarrow|Rightarrow|iff|equiv)(?![A-Za-z]))/;
    const AMP_OP = /^\s*(?:\\,|~|\s)*(?:[+-]|\\(?:times|cdot|cdots|hspace|hbright|quad|qquad)(?![A-Za-z]))/;
    const inHbright = (s, at) => { const i = s.slice(0, at).lastIndexOf("\\hbright{"); if (i < 0) return false; const x = s.slice(i + 9, at); return x.split("{").length >= x.split("}").length; };
    const KINDS = [["\\([ⅰ-ⅹ]+\\)", "(ⅰ)"], ["[ⅰ-ⅹ]+\\)", "ⅰ)"], ["[ㄱ-ㅎ]\\.", "ㄱ."], ["\\([a-z]\\)", "(a)"], ["\\(\\d+\\)", "(1)"],
      ["[①-⑳Ⓐ-Ⓩ➀-➉]", "①"], ["[ⓐ-ⓩ㉠-㉭㉮-㉻]", "ⓐ"], ["\\([A-Z]\\)", "(A)"], ["[A-Z]\\.", "A."], ["[A-Z]\\)", "A)"], ["\\d+\\)", "1)"],
      ["[a-z]\\)", "a)"], ["[a-z]\\.", "a."]];
    const LALT = KINDS.map((x) => x[0]).join("|");
    const LAB_HEAD = new RegExp("^(?:\\\\sffamily\\s*|\\s|\\{)*(?:\\\\textrm\\{)?(" + LALT + ")\\}?\\s");
    const LAB_SIDE = new RegExp("\\\\tab\\s*(?:\\\\hspace\\*\\{0\\.01mm\\}\\\\tab\\s*)*\\{?(?:\\\\textrm\\{)?(" + LALT + ")\\}?\\s");
    const labelOf = (s) => KINDS.find(([p]) => new RegExp("^(?:" + p + ")$").test(s))[1];
    const LW = { "(ⅰ)": [5.6, 6.2, 5.9], "ⅰ)": [4.7, 5.3, 5.0], "ㄱ.": [4.8, 5.4, 4.6], "(a)": [4.5, 5.0, 4.7], "(1)": [4.6, 5.1, 4.9],
      "①": [3.9, 4.4, 3.9], "ⓐ": [3.9, 4.4, 4.0], "(A)": [4.9, 5.4, 5.0], "A.": [4.0, 4.5, 3.8], "A)": [4.0, 4.5, 4.1],
      "1)": [3.8, 4.2, 4.0], "a)": [3.7, 4.1, 3.8], "a.": [3.7, 4.1, 3.5] };
    const LSRC = { "①": [4.04, 4.39], "ⓐ": [4.04, 4.39], "(1)": [4.87, 5.46], "(ⅰ)": [5.81, 6.49], "ⅰ)": [4.92, 6.49], "ㄱ.": [5.04, 5.62], "(a)": [4.97, 4.97],
      "(A)": [5.12, 5.12], "A.": [5.12, 5.12], "A)": [5.12, 5.12] };
    const LCOL = { explanation: 0, question: 1, table: 1, half_contents: 2, half_contents_D1: 2 };
    const conceptFile = !msgs.some((m) => m.type === "question" || m.type === "explanation");
    const gw08 = (b, t) => {
      if (b.includes("\\begin{aligned}") || !b.includes("\\hblinebreak")) return null;
      const segs = b.split("\\hblinebreak"), head = segs[0], lab = head.match(LAB_HEAD);
      const headBody = lab ? head.slice(lab[0].length) : head;
      let eq = false, op = false, prev = headBody;
      for (let s of segs.slice(1)) {
        s = s.replace(/^[ {\n]+/, "");
        let rest = s.slice(s.match(TABS)[0].length);
        if (rest.startsWith("\\hbright{")) rest = rest.slice(9);
        if (s.startsWith("$=")) eq = true;
        else if (OP_LEAD.test(rest) && !hasText(s) && !hasText(prev) && !REL.test(maths(rest))) op = true;
        prev = s;
      }
      if (!eq && !op) return null;
      const hasEq = maths(headBody).includes("=") || /\$\s*=/.test(headBody);
      if (hasText(headBody) && hasEq) return ["GW08", "가 글 좌변 — aligned 로 묶기(`\\text{(주어진 식)}&=…`)"];
      if (lab && !hasEq) return ["참고", "GW08 나 라벨 머리·첫 줄 = 없음 — 그대로(넘치면 끊어 계단)"];
      if (hasEq && op && segs.length === 2 && /^[ \n]*\\hbright\{/.test(segs[1])) return null;
      if (hasEq && op) return ["GW08", "다 연산자 이음 — aligned 로 묶고 GW17 계단"];
      if (t === "question" && !hasEq) return null;
      if (/^[ \n{]*(?:\\hspace\*\{[1-9][0-9.]*mm\}|\\hspace\*\{0\.01mm\}\\tab)/.test(head)) return null;
      return ["GW08", `그 밖 — 사람 판단(${nbKind(b) || "NB-?"})`];
    };
    const aFirst = []; let seenSub = false;
    for (const m of msgs) {
      seenSub = seenSub || m.type === "subtitle";
      if (m.type === "question" && m.hasNum === true && (m.category === "A" || (!m.category && !seenSub))) {
        const h = new RegExp(HB.source).exec(m.latex || "");
        if (h) aFirst.push([m, h[1] || "0mm", h]);
      }
    }
    const cnt = new Map(); for (const [, F] of aFirst) cnt.set(F, (cnt.get(F) || 0) + 1);
    let aMode = ""; for (const [F, c] of cnt) if (!aMode || c > cnt.get(aMode)) aMode = F;
    const aBad = new Map(aFirst.filter(([, F]) => F !== aMode).map(([m, F, h]) => [m, [F, h]]));
    let labs = [];
    for (const m of msgs) {
      const t = m.type, lx = m.latex || "";
      if (m.hasNum === true || t === "subtitle" || t === "questionTitle") labs = [];
      if (window.__div.isDiv(m)) {
        for (const [w, s] of window.__div.issues(msgs, msgs.indexOf(m), true)) add(m, "GW27", w + " (__fixDiv)", s);
        if (msgs.some((x) => x.type === "explanation") && lx.includes("\\boldsymbol{"))
          add(m, "GW32", `해설 표 안 볼드 ${lx.split("\\boldsymbol{").length - 1}곳 — 벗기기`, lx.slice(lx.indexOf("\\boldsymbol{")).slice(0, 60));
        continue;
      }
      if (aBad.has(m)) { const [F, h] = aBad.get(m); add(m, "GW26", `${window.__K.w.lvA} 첫 문단 왼쪽 여백 ${F} → ${aMode}(다른 ${window.__K.w.lvA} 문제와 같게)`, snip(F, h[2], h[4])); }
      for (const [, F, N, , b] of lx.matchAll(HB)) {
        for (const a of b.matchAll(AL)) {
          if (noAmp(a[1])) add(m, "GW01", "aligned 행에 최상위 & 없음", snip(F, N, b, a.index));
          const pat = classify(b.slice(Math.max(0, a.index - 30), a.index), a[1]);
          if (starts(pat, ["AL-I4", "AL-II"])) add(m, "GW10", `${window.__K.nA} 꼴 ${pat.replace(/\+$/, "")}(4칸·2칸 묶음)`, snip(F, N, b, a.index));
          if (pat === "AL-T" && a[1].trimStart().startsWith("\\therefore\\,\\,&")) add(m, "GW03", `∴ 머리 묶음에 ${window.__K.nA}-T2 꼴`, snip(F, N, b, a.index));
          if (t === "explanation" && pat.startsWith("AL-I0") && mm(F) < 0.05 && !firstLead(a[1]).includes("\\text{")) add(m, "GW02", "라벨 머리 아닌 묶음에 머리 TAB 없음", snip(F, N, b, a.index));
          a[1].split(ROW).map((r) => r.trim()).filter(Boolean).forEach((r, i) => {
            const [left, right] = splitAmp(r);
            if (right === null) return;
            const bare = left.replace(/\\text\{[^}]*\}|\\therefore|~|\\,|\s/g, "");
            if (i === 0 && !AMP_REL.test(right) && !left.includes("\\therefore"))
              add(m, "GW18", bare ? "첫 행 `&` 뒤가 관계 기호 아님" : "첫 행 `&` 가 좌변 앞(좌변 뒤 첫 관계 기호 앞으로)", snip(F, N, b, a.index));
            else if (i > 0 && /^(?:~|\\,|\s)*(?:[+-]|\\times(?![A-Za-z]))/.test(right))
              add(m, "GW17", `계단 후보 — ${i + 1}행 \`&${right.trim().slice(0, 1)}\` 이 \`=\` 바로 아래(\\hspace*·\\hbright 계단으로)`, snip(F, N, b, a.index));
            else if (i > 0 && !AMP_REL.test(right) && !AMP_OP.test(right)) add(m, "GW18", `${i + 1}행 \`&\` 뒤가 관계 기호·계단 줄 아님`, snip(F, N, b, a.index));
          });
        }
        const k = kind(b), p = pre(b), nb8 = gw08(b, t);
        if (nb8) add(m, nb8[0], nb8[1], snip(F, N, b));
        const bold = b.includes("\\boldsymbol{") && mm(F) >= 10;
        if (t === "explanation" && m.hasNum !== true && bold) add(m, "참고", "해설 번호 빠짐 — 정답 줄 모양(굵은 줄)이 번호 없이 풀이 안에. 원고에서 해설 번호가 빠진 것 같다(위치 번호가 하나씩 밀림)", snip(F, N, b));
        else if (t === "explanation" && m.hasNum !== true && k === "eq" && !b.includes("\\begin{aligned}")) {
          const tabs = p.split("\\tab").length - 1;
          const fixed = [...p.matchAll(/\\hspace\*\{([0-9.]+)mm\}/g)].some((x) => +x[1] >= 1);
          if (tabs > 1 && !OP_LEAD.test(lead(b)) && !b.includes("\\vdots")) add(m, "GW06", `단독 수식 줄 앞 TAB ${tabs}개(여럿 — 후보)`, snip(F, N, b));
          else if (p.includes("\\hspace*{0.01mm}\\qquad")) add(m, "GW10", `${window.__K.nA} 꼴(단독 수식 줄 앞 4칸)`, snip(F, N, b));
          else if (!tabs && !fixed && !starts(lead(b), ["$=", "$+", "$-"])) add(m, "GW06", "단독 수식 줄 앞 TAB 없음", snip(F, N, b));
        }
        if (!(nb8 && nb8[1].startsWith("다")))
          for (let seg of b.split("\\hblinebreak")) {
            seg = seg.replace(/^[ \n]+/, "");
            const tp = seg.match(TABS)[0];
            if (tabUnits(tp) >= 2 && OP_LEAD.test(seg.slice(tp.length))) add(m, "GW17", `계단 후보 — 탭 ${tabUnits(tp)}개로 민 이음 조각(마지막 조각은 \\hbright)`, snip(F, N, seg));
            else if (/\$[ \t]*(?:(?:\\hspace\*\{0\.01mm\})?\\tab\s*){3,}\{?\$\s*[+-]/.test(seg)) add(m, "GW17", "계단 후보 — 문단 가운데 탭 여럿으로 민 이음 조각(줄 바꿈 + \\hbright)", snip(F, N, seg));
          }
        if (t === "explanation" && m.hasNum === true && b.includes("\\qquad")) add(m, "GW09", "정답 줄에 4칸", snip(F, N, b));
        if (t === "explanation" && m.hasNum !== true)
          for (const seg of b.split("\\hblinebreak")) {
            const e = seg.match(/(?!또는)[가-힣]{2}( ?)(\{?\$[^$]*\$\}?(?:(?:\s*,\s*|\s+또는\s+)\{?\$[^$]*\$\}?)*)\s*(?:\\hbright\{[\s\S]*\})?\s*$/);
            if (e && !lead(seg).startsWith("$\\therefore") && !/^\{?\$(?:\s|~|\\,)*(?:[=<>+-]|\\(?:le|ge|leq|geq|ne|rightarrow|Rightarrow|to|times|cdot)(?![A-Za-z]))/.test(e[2])) add(m, "GW11", "문장 끝 수식 앞 4칸 없음", `[${F || "0mm"}]{${N}} ` + seg.slice(-110));
          }
        for (const e of b.matchAll(/\((?:참|거짓)\)|\\cdots\s*\\cdots\s*\$?\s*[㉠-㉭]/g))
          if (!inHbright(b, e.index)) add(m, "GW19", "꼬리가 우정렬(\\hbright) 아님", snip(F, N, b, e.index));
        if (t === "question" && k === "eq" && mm(F) > 0 && (p.includes("\\tab") || /\$\s*\\tab\s*\$\s*=/.test(b)))
          add(m, "GW23", "발문 단독수식줄에 탭(앞 탭 지움 · 줄 나눔은 \\hblinebreak)", snip(F, N, b));
        const lab = !conceptFile && LCOL[t] !== undefined ? b.match(LAB_HEAD) : null;
        if (lab) {
          const kd = labelOf(lab[1]), col = LCOL[t], L = mm(F), Nv = mm(N);
          const sd = LAB_SIDE.exec(b.slice(lab[0].length)), side = !!sd && labelOf(sd[1]) === kd;
          const par = [...labs].reverse().find((x) => L > 0 && Math.abs(x[0] - L) < 0.05);
          const in2 = b.slice(lab[0].length).replace(/^\s+/, "").match(LAB_HEAD), kd2 = in2 && labelOf(in2[1]);
          const dash = /^[^$\\]{0,30}?\s-\s/.test(b.slice(lab[0].length).replace(/\$[^$]*\$/g, "x"));
          const wantL = par ? par[1] : L, want = side ? 0 : LW[kd][col] + (kd2 && LW[kd2] ? LW[kd2][col] : 0);
          if (dash && !side) { labs.push([Nv, wantL + LW[kd][col]]); continue; }
          if (side) {
            if (Nv - L > 0.05 || Math.abs(L - wantL) > 0.05) add(m, "GW25", `좌우 나열 줄 내어쓰기 [${g(L)}]{${g(Nv)}} → [${g(wantL)}]{${g(wantL)}}(\\TabPositions = 탭 격자 − ${g(wantL)})`, snip(F, N, b));
          } else {
            const W = Nv - L, src = (LSRC[kd] || [])[Math.min(col, 1)];
            const why = src && Math.abs(W - src) <= 0.06 ? "실측 값 — 아직 안 바꾼 것" : W < 0.05 ? "내어쓰기 없음" : "표·실측 어느 쪽도 아님";
            if (Math.abs(W - want) > 0.05 || Math.abs(L - wantL) > 0.05)
              add(m, col === 0 ? "GW13" : "GW21", `라벨 ${lab[1]} 폭 ${W.toFixed(1)} → 표 ${g(want)}` + (par ? `, 라벨 안 라벨 [${g(L)}]{${g(Nv)}} → [${g(wantL)}]{${(wantL + want).toFixed(1)}}` : "") + ` (${why})`, snip(F, N, b));
            labs.push([Nv, wantL + want]);
          }
        }
      }
      for (const a of lx.matchAll(/\$\\begin\{array\}\{c\}((?:(?!\\end\{array\})[\s\S])*)\\end\{array\}\$/g))
        if (a[1].split(ROW).filter((r) => r.trim()).length === 1) add(m, "GW20", "한 줄 array 감싸기 → $식$ 으로 풀기", a[0].slice(0, 100).replace(/\n/g, " "));
      for (const at of window.__colonFix(lx).at) add(m, "GW28", "글 콜론 앞뒤 빈칸 한 칸 (__fixColon)", at);
      if (m.type === "explanation" && m.hasNum === true) {
        for (const h of lx.matchAll(/\\begin\{hangblock\}(?:\[([^\]]*)\])?\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{hangblock\}/g)) {
          const b = h[4];
          if (!b.includes("\\hblinebreak") && /^(?:\\bfseries|\s)*\(1\)\s/.test(b) && /\s\(2\)\s/.test(b.replace(/\$[^$]*\$/g, "")))
            add(m, "GW30", "새끼문제 정답이 한 줄에 — (2) 부터 줄 바꿈", b.slice(0, 100).replace(/\n/g, " "));
        }
        for (const x of lx.matchAll(/\\hblinebreak\s*(?:(?:\\hspace\*\{0\.01mm\})?\\tab\s*)+또는/g)) add(m, "GW31", "정답 줄 둘째 줄 '또는' 앞 탭 — 탭 빼기", x[0].slice(0, 60));
      } else if (m.type === "explanation")
        for (const x of lx.matchAll(/\$\s*(?:(?:\\hspace\*\{0\.01mm\})?\\tab\s*)+또는/g)) add(m, "GW31", "'또는' 앞 탭(탭으로 민 접힘) — 줄 바꿈으로", x[0].slice(0, 60));
      const cells = ((m.tableData && m.tableData.cells) || []).flatMap((r) => r || []).map((c) => (c && c.latex) || "").join("");
      if (m.type === "table" && msgs.some((x) => x.type === "explanation") && (lx.includes("\\boldsymbol{") || cells.includes("\\boldsymbol{"))) {
        const src = lx.includes("\\boldsymbol{") ? lx : cells;
        add(m, "GW32", `해설 표 안 볼드 ${src.split("\\boldsymbol{").length - 1}곳 — 벗기기`, src.slice(src.indexOf("\\boldsymbol{")).slice(0, 60));
      }
      spacing(m, "GW12");
    }
    if (window.__fixGW35)
      for (const x of window.__fixGW35(all, { start })) add(msgs.find((m) => m.index === x.index), "GW35", x.sure ? "떨어진 문장 — 합치기 (__fixGW35)" : "떨어진 문장 — 합칠지 사람 확인", x.before);
    if (window.__vb36Find)
      for (const m of msgs) { const x = window.__vb36Find(m, W[m.index] || ""); if (x) add(m, "GW36", "탭 빠진 단독 수식줄 — 4칸으로 붙이거나 탭 (__fixBRun)", x.before); }
  }
  return out;
};
window.__lineCheck = (msgs, { start, pdfjs } = {}) => {
  window.__job = { lines: [], done: false, n: 0, err: [] };
  (async () => {
    const lib = pdfjs || await window.__K.pdfjs();
    const W_ = window.__where(msgs, { start });
    const vendor = window.__K.key(msgs);
    for (const m of msgs) {
      if (!m.pdf) continue;
      const where = W_[m.index] || m.type;
      if (where.includes("정답")) continue;
      try {
        for (const f of await window.__lineFind(lib, m, vendor)) __job.lines.push({ where: `${where} · ${f[1] + 1}째 줄`, kind: f[0], what: f[2], snip: f[3] });
      } catch (e) { __job.err.push(`${where} ${e.message}`); }
      __job.n++;
    }
    __job.done = true;
  })();
  return "started";
};
window.__lineFind = async (lib, m, vendor = "") => {
  let bin = atob(m.pdf.split(",").pop()), W = 0, H = 0;
  bin = bin.replace(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/, (all, w, h) => { W = +w; H = +h; return `/MediaBox [0 -300 ${(W + 300).toFixed(3)} ${H}]`; });
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const doc = await lib.getDocument({ data: bytes, isEvalSupported: false }).promise;
  const page = await doc.getPage(1), [vx, , vx1, vy1] = page.view, vy = vy1 - (H || vy1 - page.view[1]);
  if (!W) { W = vx1 - vx; H = vy1 - page.view[1]; }
  const tc = await page.getTextContent();
  doc.destroy();
  const ws = tc.items.filter((it) => it.str.trim() && it.str.replace(/√/g, "").trim()).map((it) => {
    const fs = Math.hypot(it.transform[2], it.transform[3]) || it.height, x = it.transform[4] - vx, base = H - (it.transform[5] - vy);
    return { t: it.str.replace(/\s+/g, ""), x0: x, x1: x + it.width, y0: base - 0.8 * fs, y1: base + 0.2 * fs, base };
  });
  if (!ws.length) return [];
  const cut = m.type !== "table" && Math.max(...ws.map((w) => w.base)) > H + 0.5;
  return window.__lineRules(m, W, H, ws, cut, vendor);
};
window.__DAN_A = ["question", "questionTitle", "contents", "contents_D1", "conceptUp", "analysis", "fillSolution"];
window.__danPrevEnd = (rows, k, mm = 1) => {
  let end = rows[k - 1].x1;
  for (let j = k - 1; j > 0 && rows[j].y0 - rows[j - 1].y1 < 1 * mm; j--) end = Math.max(end, rows[j - 1].x1);
  return end;
};
window.__danLim = (rows, k, W, mm = 1) => {
  if (k < 3) return W;
  const pw = Math.max(...rows.slice(0, k).map((x) => x.x1)), near = (x) => x.x1 >= pw - 1.5 * mm;
  return pw < W - 5 * mm && near(rows[k - 2]) && rows.slice(0, k).filter(near).length >= 2 ? pw : W;
};
window.__lineRules = (m, W, H, ws, cut = false, vendor = "") => {
  const MM = 72 / 25.4, HAN = /[가-힣]/, GRID = 20, DAN_GAP = 1.5;
  const g = (v) => String(+v.toPrecision(6)), cut30 = (s) => [...s].slice(0, 30).join("");
  const len = (s) => [...s].length, charX = (w, i) => w.x0 + (w.x1 - w.x0) * i / Math.max(1, len(w.t));
  const ov = (a, b) => (Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)) / Math.max(0.1, Math.min(a.y1 - a.y0, b.y1 - b.y0));
  const rows = [];
  for (const w of ws.filter((w) => w.t.replace(/√/g, "").trim()).sort((a, b) => a.y0 - b.y0)) {
    const r = rows[rows.length - 1];
    if (r && r.w.some((v) => ov(w, v) > 0.3)) { r.w.push(w); r.y1 = Math.max(r.y1, w.y1); } else rows.push({ y0: w.y0, y1: w.y1, w: [w] });
  }
  if (!rows.length) return [];
  for (const r of rows) { r.w.sort((a, b) => a.x0 - b.x0); r.x0 = r.w[0].x0; r.x1 = Math.max(...r.w.map((w) => w.x1)); r.text = r.w.map((w) => w.t).join(""); }
  const lx = m.latex || "", out = [], tol = 0.5, gak = vendor === "B";
  if (gak && m.type === "table" && /\\longdivrows|\\sdreset|\\left\)\\vphantom/.test(lx)) return [];
  const stops = new Set([0]);
  for (const t of lx.matchAll(/\\TabPositions\{([^}]*)\}/g)) for (const v of t[1].matchAll(/([\d.]+)\s*mm/g)) stops.add(+v[1]);
  for (const t of lx.matchAll(/\\begin\{hangblock\}\[([\d.]+)mm\]\{([\d.]+)mm\}/g)) { stops.add(+t[1]); stops.add(+t[2]); stops.add(+t[1] + +t[2]); }
  for (const t of lx.matchAll(/\\hspace\*?\{([\d.]+)mm\}/g)) stops.add(+t[1]);
  const stopList = [...stops].sort((a, b) => a - b);
  if (cut && m.type !== "table") out.push(["아래 잘림", rows.length - 1, `글자가 칸 아래로 ${((Math.max(...ws.map((w) => w.y1)) - H) / MM).toFixed(1)}mm 나가 잘림`, cut30(rows[rows.length - 1].text)]);
  rows.forEach((r, k) => {
    const x0mm = r.x0 / MM, snip = cut30(r.text), left = r.x0, right = W - r.x1;
    if (r.x1 > W + tol) out.push(["넘침", k, `줄 끝이 칸 밖 ${((r.x1 - W) / MM).toFixed(1)}mm`, snip]);
    if (r.x0 < -tol) out.push(["넘침", k, `줄 시작이 칸 왼쪽 밖 ${(-x0mm).toFixed(1)}mm`, snip]);
    const linedUp = rows.some((o, j) => j !== k && Math.abs(o.x0 - r.x0) < 1);
    const inAl = lx.includes("\\begin{aligned}") && !HAN.test(r.text);
    if (left > 3 && right > 3 && Math.abs(left - right) < 1.5 && r.x1 - r.x0 < W - 6 && !linedUp && !inAl) out.push(["가운데", k, `왼쪽 ${(left / MM).toFixed(1)}mm · 오른쪽 ${(right / MM).toFixed(1)}mm`, snip]);
    if (HAN.test(r.text[0] || "") && x0mm > 0.8 && !stopList.some((s) => Math.abs(x0mm - s) < 0.5)) out.push(["글줄 시작", k, `시작 ${x0mm.toFixed(1)}mm (맞는 자리 ${stopList.map(g).join(", ")})`, snip]);
  });
  const isMath = rows.map((r) => m.type !== "table" && !HAN.test(r.text) && !/^[✓①-⑳]/.test(r.text)), isEq = rows.map((r) => /^[=<>≤≥≠]/.test(r.text));
  const ROW_LABEL = /^(?:\(\d+\)|\([ⅰ-ⅹ]+\)|[①-⑳ⓐ-ⓩⒶ-Ⓩ㉠-㉭㉮-㉻➀-➉]|[ㄱ-ㅎ]\.|\([가-하]\)|\d+\))/;
  const seen = new Set();
  rows.forEach((r, k) => {
    if (!isMath[k] || isEq[k] || r.x0 / MM > 0.8 || k === 0 || !isMath[k - 1] || rows[k - 1].x0 / MM <= 2) return;
    if (gak && ROW_LABEL.test(r.text)) return;
    const nb = [k - 1, k + 1].filter((j) => j < rows.length && isMath[j]).map((j) => (rows[j].x0 / MM).toFixed(1));
    if (nb.length) { out.push(["수식 줄 시작", k, `이 줄만 0mm, 앞뒤 수식 줄은 ${nb.join(", ")}mm`, cut30(r.text)]); seen.add(k); }
  });
  if (!gak && /\\qquad\s*\$/.test(lx))
    rows.forEach((r, k) => {
      if (!seen.has(k) && isMath[k] && !isEq[k] && r.x0 / MM <= 0.8 && k > 0) out.push(["4칸 빠짐", k, "원본은 \\qquad 들여쓰기인데 0mm 에서 시작(식이 넓어 넘어감)", cut30(r.text)]);
    });
  if (gak ? m.type === "question" : vendor === "A" && window.__DAN_A.includes(m.type)) {
    const k = rows.findIndex((r) => r.text.includes("(단"));
    if (k >= 0) {
      const r = rows[k], w = r.w.find((v) => v.t.includes("(단")), x = charX(w, len(w.t.slice(0, w.t.indexOf("(단"))));
      if (lx.includes("\\hbright{(단")) {
        if (k > 0 && x - r.x0 <= 1) {
          const pe = window.__danPrevEnd(rows, k, MM), cw = (r.x1 - r.x0) / MM, need = pe / MM + DAN_GAP + cw;
          if (need <= window.__danLim(rows, k, W, MM) / MM) out.push(["(단,)", k, `붙일 수 있음(땡기기) — 앞 줄 끝 ${(pe / MM).toFixed(1)} + 빈칸 ${g(DAN_GAP)} + 조건 ${cw.toFixed(1)} = ${need.toFixed(1)} ≤ 칸 ${(W / MM).toFixed(1)}mm`, cut30(r.text)]);
        }
      } else {
        const tail = r.text.slice(r.text.indexOf("(단"));
        let bal = tail.split("(").length - tail.split(")").length, end = null;
        if (bal > 0 && k + 1 < rows.length) {
          for (const v of rows[k + 1].w) {
            const cs = [...v.t];
            for (let i = 0; i < cs.length; i++) { bal += (cs[i] === "(") - (cs[i] === ")"); if (bal === 0) { end = charX(v, i + 1); break; } }
            if (end !== null) break;
          }
          const cw = end === null ? 0 : (r.x1 - x + end - rows[k + 1].x0) / MM;
          if (end !== null && cw <= W / MM) out.push(["(단,)", k, `쪼개짐(떼기) — 조건 ${cw.toFixed(1)}mm 가 두 줄로 나뉨, 떼어 다음 줄 우정렬(\\hbright)`, cut30(r.text)]);
        }
      }
    }
  }
  if (gak && (["question", "table"].includes(m.type) || (m.type === "half_contents" && m.category))) {
    const FAM = [/^\(\d+\)/, /^[ㄱ-ㅎ]\./, /^[①-⑳]/];
    rows.forEach((r, k) => {
      const fam = FAM.find((f) => f.test(r.w[0].t));
      if (!fam || (m.type === "question" && fam === FAM[2])) return;
      const labs = r.w.slice(1).filter((w) => fam.test(w.t)), n = labs.length + 1, F = r.x0;
      const nMax = Math.max(...rows.filter((x) => x.w.length && fam.test(x.w[0].t)).map((x) => 1 + x.w.slice(1).filter((w) => fam.test(w.t)).length));
      if (n !== 2 || nMax !== 2) return;
      labs.forEach((w, j) => {
        const i = j + 1, want = Math.floor((F + (W - F) * i / n) / GRID + 0.5) * GRID;
        if (Math.abs(w.x0 - want) > 0.5 * MM) out.push(["좌우 열", k, `${w.t.match(fam)[0]} 자리 ${(w.x0 / MM).toFixed(1)} → ${(want / MM).toFixed(1)}mm(시작 ${(F / MM).toFixed(1)} ~ 칸 ${(W / MM).toFixed(1)} 의 ${i}/${n} 에 가까운 탭 자리)`, cut30(r.text)]);
      });
    });
  }
  return out;
};
window.__paneReplace = async (from, to) => {
  const ta = window.__K.el("chunkPane");
  if (!ta) return "청크 LaTeX 창이 없음 — 미리보기에서 상자를 먼저 클릭";
  if (!ta.value.includes(from)) return "창에 찾는 글이 없음";
  ta.focus(); ta.value = ta.value.replace(from, to);
  ta.dispatchEvent(new Event("input", { bubbles: true }));
  ta.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true, bubbles: true }));
  await new Promise((r) => setTimeout(r, 1500));
  return window.__K.el("paneHint")?.textContent;
};
window.__vb = (() => {
  const GRID = 20 * 25.4 / 72;
  const HBX = /\\begin\{hangblock\}(?:\[([^\]]*)\])?\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{hangblock\}/g;
  const TOK = /\\TabPositions\{([^}]*)\}|\\begin\{hangblock\}(?:\[([^\]]*)\])?\{([^}]*)\}\{([^}]*)\}([\s\S]*?)\\end\{hangblock\}/g;
  const vendor = (msgs) => ((msgs.find((m) => m.type === "meta") || {}).textbook || "").toUpperCase();
  const isB = (msgs) => window.__K.key(msgs) === "B";
  const num = (s) => parseFloat(s || "0") || 0;
  const mm = (v) => `${+(+v).toFixed(1)}mm`;
  const near = (a, b, e = 0.06) => Math.abs(a - b) < e;
  const gridVals = (N) => [...Array(10).keys()].map((k) => (k + 1) * GRID - N).filter((v) => v > 0.05).map((v) => +v.toFixed(1));
  const gridTP = (N) => gridVals(N).map((v) => v.toFixed(1) + "mm").join(", ");
  const tpVals = (s) => [...s.matchAll(/([\d.]+)\s*mm/g)].map((x) => +x[1]);
  const tpIsGrid = (vals, N) => { const g = gridVals(N); return vals.length === g.length && vals.every((v, i) => Math.abs(v - g[i]) < 0.11); };
  const tpSame = (a, b) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 0.05);
  const LW = { "(ⅰ)": [5.6, 6.2, 5.9], "ⅰ)": [4.7, 5.3, 5.0], "ㄱ.": [4.8, 5.4, 4.6], "(a)": [4.5, 5.0, 4.7], "(1)": [4.6, 5.1, 4.9],
    "①": [3.9, 4.4, 3.9], "ⓐ": [3.9, 4.4, 4.0], "(A)": [4.9, 5.4, 5.0], "A.": [4.0, 4.5, 3.8], "A)": [4.0, 4.5, 4.1],
    "1)": [3.8, 4.2, 4.0], "a)": [3.7, 4.1, 3.8], "a.": [3.7, 4.1, 3.5] };
  const LAB_S = "\\([ⅰ-ⅻ]+\\)|[ⅰ-ⅻ]+\\)|[ㄱ-ㅎ]\\.|\\(\\d+\\)|\\d+\\)|\\([a-z]\\)|[a-z][.)]|\\([A-Z]\\)|[A-Z][.)]|[①-⑳ⓐ-ⓩⒶ-Ⓩ㉠-㉭㉮-㉻➀-➉]";
  const LAB = new RegExp(`^(?:\\\\sffamily\\s*|\\\\bfseries\\s*|\\s)*(?:\\\\textrm\\{)?(${LAB_S})\\}?(?=\\s|~|\\\\tab|\\\\hspace)`);
  const SIDE = new RegExp(`\\\\tab\\s*(?:\\\\hspace\\*\\{0\\.01mm\\}\\\\tab\\s*)*(?:\\\\sffamily\\s*)?(?:\\\\textrm\\{)?(?:${LAB_S})\\}?(?=\\s|~)`);
  const labKind = (l) => /^\([ⅰ-ⅻ]+\)$/.test(l) ? "(ⅰ)" : /^[ⅰ-ⅻ]+\)$/.test(l) ? "ⅰ)" : /^[ㄱ-ㅎ]\.$/.test(l) ? "ㄱ." : /^\(\d+\)$/.test(l) ? "(1)"
    : /^\d+\)$/.test(l) ? "1)" : /^\([a-z]\)$/.test(l) ? "(a)" : /^[a-z]\)$/.test(l) ? "a)" : /^[a-z]\.$/.test(l) ? "a." : /^\([A-Z]\)$/.test(l) ? "(A)"
    : /^[A-Z]\.$/.test(l) ? "A." : /^[A-Z]\)$/.test(l) ? "A)" : /^[ⓐ-ⓩ㉠-㉭㉮-㉻]$/.test(l) ? "ⓐ" : "①";
  const COL = { explanation: 0, question: 1, choice: 1, table: 1, half_contents: 2, half_contents_D1: 2 };
  const scan = (s) => {
    const out = []; let bd = 0, ld = 0;
    for (let i = 0; i < s.length;) {
      const c = s[i];
      if (c === "{") { bd++; i++; continue; }
      if (c === "}") { bd--; i++; continue; }
      if (c === "\\") {
        const x = /^\\([A-Za-z]+|.)/.exec(s.slice(i)), name = x[1]; let j = i + x[0].length;
        if (name === "left" || name === "right") {
          const d = /^\s*(\\[A-Za-z]+|\\.|.)/.exec(s.slice(j)); j += d ? d[0].length : 0;
          out.push({ i, end: j, t: name, bd, ld, dot: !!d && d[1] === "." });
          ld += name === "left" ? 1 : -1; i = j; continue;
        }
        if (/^(le|leq|ge|geq|ne|neq|equiv)$/.test(name)) out.push({ i, end: j, t: "rel", bd, ld });
        else if (/^(times|cdots)$/.test(name)) out.push({ i, end: j, t: "op", bd, ld });
        i = j; continue;
      }
      if (c === "=" || c === "<" || c === ">") out.push({ i, end: i + 1, t: "rel", bd, ld });
      else if (c === "+" || c === "-") out.push({ i, end: i + 1, t: "op", bd, ld });
      i++;
    }
    return out;
  };
  const firstRel = (s) => scan(s).find((x) => x.t === "rel" && x.bd === 0 && x.ld === 0);
  const hasRel = (s) => !!firstRel(s);
  const OPSTART = /^(?:~|\\,|\\;|\s|\{|\\left\.\\hspace\{-0\.12em\})*(?:[+-]|\\times(?![A-Za-z])|\\cdots(?![A-Za-z]))/;
  const isStepMath = (s) => OPSTART.test(s) && !hasRel(s);
  const RELSTART = /^\s*(?:\\,|~|\s)*(?:[=<>]|\\(?:le|ge|leq|geq|ne|neq|equiv|rightarrow|Rightarrow|iff)(?![A-Za-z]))/;
  const rowSplit = (s) => {
    const out = []; let d = 0, cur = "";
    for (let i = 0; i < s.length;) {
      if (s[i] === "\\" && s[i + 1] === "\\" && d === 0 && !/[A-Za-z]/.test(s[i + 2] || "")) { out.push(cur, "\\\\"); cur = ""; i += 2; continue; }
      if (s[i] === "\\") { cur += s.slice(i, i + 2); i += 2; continue; }
      d += (s[i] === "{") - (s[i] === "}"); cur += s[i]; i++;
    }
    return [...out, cur];
  };
  const ALIGNED = /\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/g;
  const splitAmp = (row) => {
    for (let i = 0, d = 0; i < row.length; i++) {
      if (row[i] === "\\") { i++; continue; }
      d += (row[i] === "{") - (row[i] === "}");
      if (row[i] === "&" && d === 0) return [row.slice(0, i), row.slice(i + 1)];
    }
    return [row, null];
  };
  const filled = (s) => s.replace(/~|\\,|\s/g, "") !== "";
  const PRE = /^(?:\s|\\hspace\*\{[0-9.]+mm\}|\\tab(?![A-Za-z])|\\sffamily(?![A-Za-z]))*/;
  const tabby = (p) => /\\tab(?![A-Za-z])/.test(p) || [...p.matchAll(/\\hspace\*\{([0-9.]+)mm\}/g)].some((x) => +x[1] >= 1);
  const mathLine = (s) => {
    const pre = s.match(PRE)[0], rest = s.slice(pre.length);
    const x = rest.match(/^(\{?)\$([^$]*)\$(\}?)\s*(\\hbright\{[\s\S]*\})?\s*$/);
    if (!x || (x[1] && !x[3])) return null;
    return { pre, math: x[2], tail: x[4] || "", lead: s.slice(0, s.length - s.trimStart().length), brace: !!x[1] };
  };
  const isEqLine = (l) => !!l && !l.tail.includes("(단") && (hasRel(l.math) || /^\s*=/.test(l.math) || isStepMath(l.math));
  const deep = (msgs) => msgs.map((m) => ({ ...m }));
  const runner = (rule, ok, xform) => (msgs, { apply = false, start } = {}) => {
    if (!ok(msgs)) return [];
    const W = window.__where ? window.__where(msgs, { start }) : {};
    const out = [], ctx = { msgs, W };
    for (const m of msgs) {
      if (typeof m.latex !== "string" || !m.latex) continue;
      const r = xform(m, ctx);
      if (!r) continue;
      for (const n of r.notes || []) out.push({ where: W[m.index] || "?", index: m.index, rule, skipped: true, what: n });
      if (r.latex === m.latex || !r.changes || !r.changes.length) continue;
      out.push({ where: W[m.index] || "?", index: m.index, rule, n: r.changes.length, before: r.changes[0][0], after: r.changes[0][1], changes: r.changes });
      if (apply) { m.latex = r.latex; window.__clearRender && window.__clearRender(m); if (r.also) r.also(m); }
    }
    return out;
  };
  return { GRID, HBX, TOK, vendor, isB, num, mm, near, gridVals, gridTP, tpVals, tpIsGrid, tpSame, LW, LAB, SIDE, labKind, COL,
    scan, firstRel, hasRel, OPSTART, isStepMath, RELSTART, rowSplit, ALIGNED, splitAmp, PRE, tabby, mathLine, isEqLine, filled, deep, runner };
})();
window.__vbHang = (m, { labels, side }) => {
  const G = window.__vb, col = G.COL[m.type];
  if (col === undefined || (m.type === "explanation" && m.hasNum === true)) return null;
  const lx = m.latex, toks = [...lx.matchAll(G.TOK)].map((t) => t[1] !== undefined
    ? { tp: true, at: t.index, len: t[0].length, vals: G.tpVals(t[1]), src: t[0] }
    : { tp: false, at: t.index, len: t[0].length, F: t[2], L: G.num(t[2]), N: G.num(t[3]), C: t[4], body: t[5], src: t[0], hasF: t[2] !== undefined });
  const hbs = toks.filter((t) => !t.tp);
  if (!hbs.length) return null;
  const sibW = {};
  for (const h of hbs) { const x = h.body.match(G.LAB); if (x && h.N > h.L) (sibW[h.L.toFixed(1)] = sibW[h.L.toFixed(1)] || []).push(h.N - h.L); }
  const colMap = new Map([["0.0", 0]]);
  const changes = [];
  let nest = null;
  for (const h of hbs) {
    const x = h.body.match(G.LAB), isSide = !!x && G.SIDE.test(h.body);
    const x2 = x && h.body.slice(x[0].length).replace(/^\s+/, "").match(G.LAB);
    h.nL = h.L > 0 && colMap.has(h.L.toFixed(1)) ? colMap.get(h.L.toFixed(1))
      : nest && h.L > nest.L + 0.05 && h.L < nest.N - 0.05 ? nest.innerL : h.L;
    h.nN = h.N + (h.nL - h.L);
    if (isSide) { if (side) { h.nN = h.nL; h.why = "좌우 나열 — 내어쓰기 없이"; } }
    else if (x && h.N >= h.L && h.N - h.L < (x2 ? 14 : 8)) {
      if (labels) {
        const w1 = G.LW[G.labKind(x[1])][col], w2 = x2 ? G.LW[G.labKind(x2[1])][col] : 0;
        h.nN = h.nL + w1 + w2; h.why = x2 ? `${x[1]} ${x2[1]} 중첩 라벨 폭(${w1} + ${w2})` : `${x[1]} 라벨 폭`;
        if (x2) nest = { L: h.L, N: h.N, innerL: h.nL + w1 };
      }
      colMap.set(h.N.toFixed(1), h.nN);
    } else if (!x && labels && m.type === "explanation" && h.N > h.L + 0.05
        && (sibW[h.L.toFixed(1)] || []).some((w) => G.near(w, h.N - h.L))) {
      h.nN = h.nL; h.why = "라벨 밖 글 줄 — 남은 내어쓰기 없앰";
    }
  }
  let effOld = null, effNew = null;
  toks.forEach((t, k) => {
    if (t.tp) {
      const nx = toks.slice(k + 1).find((u) => !u.tp);
      let want = t.vals;
      if (nx && G.tpIsGrid(t.vals, nx.N) && !G.near(nx.N, nx.nN)) want = G.gridVals(nx.nN);
      effOld = t.vals;
      if (effNew && G.tpSame(want, effNew)) { t.out = ""; return; }
      t.out = G.tpSame(want, t.vals) ? t.src : `\\TabPositions{${want.map((v) => v.toFixed(1) + "mm").join(", ")}}`;
      effNew = want;
      return;
    }
    const prevTp = k > 0 && toks[k - 1].tp && /^\s*$/.test(lx.slice(toks[k - 1].at + toks[k - 1].len, t.at).replace(/\\vspace\{[^}]*\}/g, ""));
    if (!prevTp && /\\tab(?![A-Za-z])/.test(t.body) && effOld && G.tpIsGrid(effOld, t.N) && !G.near(t.N, t.nN)) {
      const want = G.gridVals(t.nN);
      if (!effNew || !G.tpSame(want, effNew)) { t.pre = `\\TabPositions{${want.map((v) => v.toFixed(1) + "mm").join(", ")}}\n`; effNew = want; }
    }
  });
  let out = "", pos = 0;
  for (const t of toks) {
    out += lx.slice(pos, t.at); pos = t.at + t.len;
    if (t.tp) {
      if (t.out === t.src) { out += t.src; continue; }
      changes.push([t.src.slice(0, 60), t.out ? t.out.slice(0, 60) : "(지움 — 앞 \\TabPositions 와 같음)"]);
      if (t.out) out += t.out; else if (lx[pos] === "\n") pos++;
      continue;
    }
    const same = G.near(t.nL, t.L, 0.01) && G.near(t.nN, t.N, 0.01);
    const body = G.near(t.nL, t.L, 0.01) ? t.body : t.body.replace(/^(\s*)\\hspace\*\{([0-9.]+)mm\}/, (all, sp, x) => {
      const k = Math.round((+x + t.L) / G.GRID);
      return +x >= 0.5 && k > 0 && G.near(+x + t.L, k * G.GRID, 0.11) ? `${sp}\\hspace*{${G.mm(k * G.GRID - t.nL)}}` : all;
    });
    const nsrc = (t.pre || "") + (same ? t.src : `\\begin{hangblock}[${G.mm(t.nL)}]{${G.mm(t.nN)}}{${t.C}}${body}\\end{hangblock}`);
    if (nsrc !== t.src) changes.push([`[${t.F || "0mm"}]{${G.mm(t.N)}} ${t.body.slice(0, 40)}`, `[${G.mm(t.nL)}]{${G.mm(t.nN)}}${t.why ? " (" + t.why + ")" : ""}${t.pre ? " +\\TabPositions" : ""}`]);
    out += nsrc;
  }
  return { latex: out + lx.slice(pos), changes };
};
window.__vbConcept = (ctx) => ctx.concept ??= !ctx.msgs.some((x) => x.type === "question" || x.type === "explanation");
window.__fixGW13 = window.__vb.runner("GW13", window.__vb.isB, (m, ctx) => window.__vbConcept(ctx) ? null : window.__vbHang(m, { labels: true, side: false }));
window.__fixGW21 = window.__fixGW13;
window.__fixGW25 = window.__vb.runner("GW25", window.__vb.isB, (m, ctx) => window.__vbConcept(ctx) ? null : window.__vbHang(m, { labels: false, side: true }));
window.__fixGW26 = (msgs, opts = {}) => {
  const G = window.__vb;
  if (!G.isB(msgs)) return [];
  const firstSub = msgs.findIndex((m) => m.type === "subtitle");
  const A = msgs.slice(0, firstSub < 0 ? 0 : firstSub).filter((m) => m.type === "question" && m.hasNum === true && /\\begin\{hangblock\}/.test(m.latex || ""));
  const firstL = (m) => (m.latex.match(/\\begin\{hangblock\}\[([^\]]*)\]/) || [])[1] || "0mm";
  const cnt = {};
  A.forEach((m) => { const k = G.mm(G.num(firstL(m))); cnt[k] = (cnt[k] || 0) + 1; });
  const mode = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
  if (!mode || A.length < 3 || G.num(mode[0]) <= 0) return [];
  const ids = new Set(A.filter((m) => G.mm(G.num(firstL(m))) !== mode[0]).map((m) => m.index));
  return G.runner("GW26", () => true, (m) => {
    if (!ids.has(m.index)) return null;
    const latex = m.latex.replace(/\\begin\{hangblock\}\[[^\]]*\]/, `\\begin{hangblock}[${mode[0]}]`);
    return { latex, changes: [[`첫 문단 [${firstL(m)}]`, `[${mode[0]}] (${window.__K.w.lvA} ${mode[1]}/${A.length} 문제와 같게)`]] };
  })(msgs, opts);
};
window.__GW20 = /\$\\begin\{array\}\{c\}\s*((?:(?!\\\\|\\end\{array\}|&)[^$])*?)\s*\\\\\s*\\end\{array\}\$/g;
window.__fixGW20 = window.__vb.runner("GW20", window.__vb.isB, (m) => {
  const ch = [];
  const latex = m.latex.replace(window.__GW20, (all, body) => { ch.push([all.slice(0, 70), `$${body.trim()}$`]); return `$${body.trim()}$`; });
  return { latex, changes: ch };
});
window.__gw08Para = (b) => {
  if (b.includes("\\begin{aligned}") || !b.includes("\\hblinebreak")) return null;
  const pre = b.match(/^(?:\s|\\hspace\*\{[0-9.]+mm\}|\\tab(?![A-Za-z]))*/)[0];
  const segs = b.slice(pre.length).split(/\\hblinebreak\s*/);
  const h = segs[0].match(/^(\$\\therefore\s*\$\s*)?\(([^()$\\]*[가-힣][^()$\\]*)\)\{?\$\s*=([^$]*)\$\}?\s*(\\hbright\{[\s\S]*\})?\s*$/);
  if (!h) return null;
  const rows = [`${h[1] ? "\\therefore~" : ""}\\text{(${h[2]})}&=${h[3]}${h[4] || ""}`];
  for (const s of segs.slice(1)) {
    const x = s.match(/^\s*\{?\$\s*(=[^$]*)\$\}?\s*(\\hbright\{[\s\S]*\})?\s*$/);
    if (!x) return null;
    rows.push(`&${x[1].trim()}${x[2] || ""}`);
  }
  return pre + "$\\begin{aligned}" + rows.join("\\\\ ") + "\\end{aligned}$";
};
window.__fixGW08 = window.__vb.runner("GW08", window.__vb.isB, (m) => {
  const ch = [];
  const latex = m.latex.replace(/(\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\})([\s\S]*?)(\\end\{hangblock\})/g, (all, head, b, tail) => {
    const nb = window.__gw08Para(b);
    if (nb === null) return all;
    ch.push([b.slice(0, 80), nb.slice(0, 80)]);
    return head + nb + tail;
  });
  return { latex, changes: ch };
});
window.__fixGW18 = window.__vb.runner("GW18", window.__vb.isB, (m) => {
  const G = window.__vb, ch = [], notes = [];
  const latex = m.latex.replace(G.ALIGNED, (all, inner) => {
    const rows = G.rowSplit(inner);
    const [a, b] = G.splitAmp(rows[0]);
    if (b === null || G.RELSTART.test(b) || a.includes("\\therefore")) return all;
    const lt = a.replace(/\\text\{[^}]*\}|~|\\,|\{\}|\s/g, "");
    if (lt) { notes.push(`첫 행 & 뒤가 관계 기호로 시작하지 않음 — 사람 판단: ${rows[0].trim().slice(0, 70)}`); return all; }
    const r = G.firstRel(b);
    if (!r) { notes.push(`첫 행에 관계 기호 없음: ${rows[0].trim().slice(0, 70)}`); return all; }
    rows[0] = a + b.slice(0, r.i).replace(/\s+$/, "") + "&" + b.slice(r.i);
    const after = "\\begin{aligned}" + rows.join("") + "\\end{aligned}";
    ch.push([all.slice(0, 70), after.slice(0, 70)]);
    return after;
  });
  return { latex, changes: ch, notes };
});
window.__vbStepAligned = (inner) => {
  const G = window.__vb, parts = G.rowSplit(inner);
  const rows = parts.filter((r, i) => i % 2 === 0);
  const isStep = (r, k) => { if (k === 0) return false; const [a, b] = G.splitAmp(r); if (b === null || G.filled(a)) return false;
    const c = b.replace(/^\s*\\hspace\*\{[0-9.]+mm\}/, "").trim(); return /^\\hbright\{\$/.test(c) || G.isStepMath(c); };
  let changed = false;
  for (let k = 1; k < rows.length; k++) {
    if (!isStep(rows[k], k) || (k + 1 < rows.length && isStep(rows[k + 1], k + 1))) continue;
    const [a, b] = G.splitAmp(rows[k]);
    const c = b.trim();
    if (/^\\hbright\{/.test(c) || c.includes("\\hbright")) continue;
    rows[k] = a + "&\\hbright{$" + c.replace(/^\\hspace\*\{[0-9.]+mm\}\s*/, "").replace(/^(?:~|\\,|\s)+/, "") + "$}" + (b.match(/\s*$/)[0]);
    changed = true;
  }
  if (!changed) return null;
  return parts.map((p, i) => i % 2 === 0 ? rows[i / 2] : p).join("");
};
window.__vbStepNb = (b) => {
  const G = window.__vb;
  if (b.includes("\\begin{aligned}") || !b.includes("\\hblinebreak")) return null;
  const segs = b.split(/\\hblinebreak/);
  const ls = segs.map(G.mathLine);
  if (ls.some((l) => !l) || ls[0].tail || !G.firstRel(ls[0].math) || G.OPSTART.test(ls[0].math) || /^\s*=/.test(ls[0].math)) return null;
  const kinds = ls.slice(1).map((l) => /^\s*=/.test(l.math) ? "eq" : G.isStepMath(l.math) ? "step" : "");
  if (kinds.some((k) => !k) || !kinds.includes("step")) return null;
  if (G.LAB.test(ls[0].pre + "$")) return null;
  const r = G.firstRel(ls[0].math);
  const rows = [ls[0].math.slice(0, r.i).trim() + "&" + ls[0].math.slice(r.i).trim()];
  kinds.forEach((k, j) => {
    const l = ls[j + 1], c = l.math.trim().replace(/^(?:~|\\,|\s)+/, "");
    const last = k === "step" && kinds[j + 1] !== "step";
    rows.push(k === "eq" ? "&" + c + l.tail : last ? `&\\hbright{$${c}$}` + l.tail : "&" + c + l.tail);
  });
  return ls[0].pre.replace(/\s+$/, "") + "$\\begin{aligned}" + rows.join("\\\\ ") + "\\end{aligned}$";
};
window.__vbStepLines = (lines) => {
  const G = window.__vb, ls = lines.map(G.mathLine);
  const step = ls.map((l) => !!l && !l.tail && G.tabby(l.pre) && G.isStepMath(l.math));
  const out = [...lines]; let n = 0;
  for (let k = 1; k < lines.length; k++) {
    if (!step[k]) continue;
    let j = k; while (j > 0 && step[j - 1]) j--;
    if (j === 0 || !G.isEqLine(ls[j - 1]) || step[j - 1]) continue;
    if (k + 1 < lines.length && step[k + 1]) continue;
    out[k] = ls[k].lead + `\\hbright{${ls[k].brace ? "{" : ""}$${ls[k].math}$${ls[k].brace ? "}" : ""}}` + (lines[k].match(/\s*$/)[0]);
    n++;
  }
  return n ? out : null;
};
window.__fixGW17 = window.__vb.runner("GW17", (msgs) => !!window.__K.key(msgs), (m, ctx) => {
  const G = window.__vb, ch = [];
  let latex = m.latex.replace(G.ALIGNED, (all, inner) => {
    const ni = window.__vbStepAligned(inner);
    if (ni === null) return all;
    const after = "\\begin{aligned}" + ni + "\\end{aligned}";
    ch.push([all.slice(-90), after.slice(-90)]);
    return after;
  });
  if (G.isB(ctx.msgs)) {
    latex = latex.replace(/(\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\})([\s\S]*?)(\\end\{hangblock\})/g, (all, head, b, tail) => {
      const nb = window.__vbStepNb(b);
      if (nb !== null) { ch.push([b.slice(0, 90), nb.slice(0, 90)]); return head + nb + tail; }
      if (!b.includes("\\hblinebreak") || b.includes("\\begin{aligned}")) return all;
      const segs = b.split(/\\hblinebreak/);
      const ns = window.__vbStepLines(segs);
      if (!ns) return all;
      const nb2 = ns.join("\\hblinebreak");
      ch.push([segs.find((s, i) => s !== ns[i]).trim().slice(0, 90), ns.find((s, i) => s !== segs[i]).trim().slice(0, 90)]);
      return head + nb2 + tail;
    });
    const hbs = [...latex.matchAll(G.HBX)];
    if (hbs.length > 1) {
      const bodies = hbs.map((h) => h[4]);
      const ns = window.__vbStepLines(bodies);
      if (ns) {
        let out = "", pos = 0;
        hbs.forEach((h, k) => {
          out += latex.slice(pos, h.index);
          const glue = k > 0 ? latex.slice(hbs[k - 1].index + hbs[k - 1][0].length, h.index) : "";
          const keep = ns[k] === bodies[k] || (k > 0 && !/^(?:\s|\\TabPositions\{[^}]*\}|\\vspace\{[^}]*\})*$/.test(glue));
          out += keep ? h[0] : h[0].replace(bodies[k], () => ns[k]);
          if (!keep) ch.push([bodies[k].trim().slice(0, 90), ns[k].trim().slice(0, 90)]);
          pos = h.index + h[0].length;
        });
        latex = out + latex.slice(pos);
      }
    }
    latex = window.__vbPushed(latex, ch);
  }
  return { latex, changes: ch };
});
window.__vbPushed = (latex, ch) => {
  const TABS = "(?:(?:\\\\hspace\\*\\{0\\.01mm\\})?\\\\tab\\s*)";
  const PIECE = "(\\{?\\$\\s*[+-][^$]*\\$\\}?)";
  const END = "(?=\\s*(?:\\\\hblinebreak|\\\\end\\{hangblock\\}))";
  const headPiece = new RegExp(`^\\s*${TABS}{2,}\\{?\\$\\s*[+-]`);
  return latex
    .replace(new RegExp(`(\\$)[ \\t]*${TABS}{3,}${PIECE}${END}`, "g"), (all, d, p) => {
      ch.push([all.slice(0, 70), `$\\hblinebreak \\hbright{${p.slice(0, 50)}}`]);
      return `${d}\\hblinebreak \\hbright{${p}}`;
    })
    .replace(/(\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\})([\s\S]*?)(\\end\{hangblock\})/g, (all, head, b, tail) => {
      if (!b.includes("\\hblinebreak")) return all;
      const segs = b.split(/\\hblinebreak/), piece = segs.map((s) => headPiece.test(s));
      let n = 0;
      const ns = segs.map((s, k) => {
        if (!piece[k] || k === 0 || piece[k - 1] || piece[k + 1] || !/\$\}?\s*$/.test(segs[k - 1])) return s;
        const x = s.match(new RegExp(`^(\\s*)${TABS}{2,}${PIECE}(\\s*)$`));
        if (!x) return s;
        n++;
        ch.push([s.trim().slice(0, 70), `\\hbright{${x[2].slice(0, 50)}}`]);
        return `${x[1] || " "}\\hbright{${x[2]}}${x[3]}`;
      });
      return n ? head + ns.join("\\hblinebreak") + tail : all;
    });
};
window.__GW19 = /(?:\\hspace\*\{0\.01mm\}\\tab\s*|\\tab\s*)+(\((?:참|거짓)\)(?:\\hphantom\{짓\})?|\$\\cdots\s*\\cdots\s*\$\s*[㉠-㉭])\s*(?=\\hblinebreak|\\end\{hangblock\}|\\\\|$)/g;
window.__fixGW19 = window.__vb.runner("GW19", window.__vb.isB, (m) => {
  const ch = [];
  const latex = m.latex.replace(window.__GW19, (all, t) => { ch.push([all.slice(0, 60), `\\hbright{${t}}`]); return `\\hbright{${t}}`; });
  return { latex, changes: ch };
});
window.__fixGW23 = window.__vb.runner("GW23", window.__vb.isB, (m) => {
  if (m.type !== "question") return null;
  const ch = [];
  const latex = m.latex.replace(/(\\begin\{hangblock\}\[[^\]]*\]\{[^}]*\}\{[^}]*\})((?:\\hspace\*\{0\.01mm\}\\tab\s*|\\tab\s*)*)\$([^$]*)\$\s*(?:\\hspace\*\{0\.01mm\}\\tab\s*|\\tab\s*)+\$(\s*=[^$]*)\$\s*(\\end\{hangblock\})/g,
    (all, head, pre, a, b, tail) => { const nb = `$${a}$\\hblinebreak $${b.trim()}$`; ch.push([all.slice(head.length, head.length + 80), nb.slice(0, 80)]); return head + nb + tail; })
    .replace(/(\\begin\{hangblock\}\[(\d*\.?\d+)mm\]\{[^}]*\}\{[^}]*\})((?:\\hspace\*\{0\.01mm\}\\tab\s*|\\tab\s*)+)(\$[^$]*\$(?:\s*\\hblinebreak\s*\$[^$]*\$)*\s*)(\\end\{hangblock\})/g,
      (all, head, F, pre, body, tail) => { if (!(+F > 0)) return all; ch.push([(pre + body).slice(0, 80), body.slice(0, 80)]); return head + body + tail; });
  return { latex, changes: ch };
});
window.__fixGW30 = window.__vb.runner("GW30", window.__vb.isB, (m) => {
  if (m.type !== "explanation" || m.hasNum !== true) return null;
  const ch = [];
  const latex = m.latex.replace(/(\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\})([\s\S]*?)(\\end\{hangblock\})/g, (all, head, b, tail) => {
    if (b.includes("\\hblinebreak") || !/^(?:\\bfseries|\s)*\(1\)\s/.test(b) || !/\s\(2\)\s/.test(b)) return all;
    const nb = b.split(/(\$[^$]*\$)/).map((p, i) => i % 2 ? p : p.replace(/\s+(?=\((?:[2-9]|\d{2,})\)\s)/g, "\\hblinebreak ")).join("");
    if (nb === b) return all;
    ch.push([b.trim().slice(0, 70), nb.trim().slice(0, 90)]);
    return head + nb + tail;
  });
  return { latex, changes: ch };
});
window.__fixGW31 = window.__vb.runner("GW31", window.__vb.isB, (m) => {
  if (m.type !== "explanation") return null;
  const G = window.__vb, ch = [], TABS = /(?:\\hspace\*\{0\.01mm\})?\\tab\s*/;
  let latex = m.latex;
  if (m.hasNum === true) {
    latex = latex.replace(/(\\hblinebreak\s*)((?:(?:\\hspace\*\{0\.01mm\})?\\tab\s*)+)(?=또는)/g, (all, br) => { ch.push([all.trim().slice(0, 60), "\\hblinebreak 또는"]); return br; });
    return { latex, changes: ch };
  }
  latex = latex.replace(/\\begin\{hangblock\}\[([^\]]*)\]\{([^}]*)\}\{([^}]*)\}(\\hspace\*\{([0-9.]+)mm\})((?:(?!\\end\{hangblock\})[\s\S])*?\$\s*(?:(?:\\hspace\*\{0\.01mm\})?\\tab\s*)+또는(?:(?!\\end\{hangblock\})[\s\S])*?)\\end\{hangblock\}(\s*\\begin\{hangblock\}\[\1\]\{\2\}\{\3\}\\hspace\*\{\5mm\}(\$[^$]*\$)\\end\{hangblock\})?/g,
    (all, F, N, C, hs, D, body, next, z) => {
      let nb = body.replace(new RegExp(`\\$\\s*(?:${TABS.source})+(?=또는)`, "g"), () => "$\\hblinebreak ");
      if (z && /또는\s*$/.test(nb)) nb = nb.replace(/\s*$/, " ") + z; else if (next) return all;
      const nN = G.mm(G.num(F) + +D);
      const out = `\\begin{hangblock}[${F}]{${nN}}{${C}}${hs}${nb}\\end{hangblock}`;
      ch.push([body.slice(-70), (nb.slice(-60)) + ` (내어쓰기 ${N} → ${nN})`]);
      return out;
    });
  return { latex, changes: ch };
});
window.__unbold = (s) => {
  let out = "", i = 0;
  for (;;) {
    const k = s.indexOf("\\boldsymbol{", i);
    if (k < 0) return out + s.slice(i);
    let d = 1, j = k + 12;
    for (; j < s.length && d; j++) d += s[j] === "{" ? 1 : s[j] === "}" ? -1 : 0;
    if (d) return out + s.slice(i);
    out += s.slice(i, k) + s.slice(k + 12, j - 1); i = j;
  }
};
window.__fixGW32 = window.__vb.runner("GW32", window.__vb.isB, (m, ctx) => {
  if (m.type !== "table" || !m.latex.includes("\\boldsymbol{")) return null;
  if (!(ctx.hasExpl ??= ctx.msgs.some((x) => x.type === "explanation"))) return null;
  const latex = window.__unbold(m.latex);
  const n = (m.latex.match(/\\boldsymbol\{/g) || []).length;
  const also = (mm) => { for (const row of (mm.tableData && mm.tableData.cells) || []) for (const c of row || []) if (c && typeof c.latex === "string" && c.latex.includes("\\boldsymbol{")) { c.latex = window.__unbold(c.latex); delete c.pdf; delete c.hash; } };
  return { latex, also, changes: [[(m.latex.match(/\\boldsymbol\{[^}]*\}/) || [""])[0], `볼드 ${n}곳 벗김${m.tableData ? "(표 칸 포함)" : ""}`]] };
});
window.__fixB = (msgs, { apply = false, start, corpus, edited } = {}) => {
  const G = window.__vb;
  if (!G.isB(msgs)) return { fix: [], render: [{ where: "파일", what: `${window.__K.nB} 파일 아님(meta.textbook=${G.vendor(msgs) || "없음"}) — 아무것도 안 함` }] };
  const warn = new Map(msgs.map((m) => [m.index, Math.max(0, ...((m.renderWarnings || []).map((w) => w.overflowMM || 0)))]));
  const work = apply ? msgs : G.deep(msgs);
  const g35 = window.__fixGW35(work, { apply: true, start, corpus, edited });
  const fix = g35.filter((x) => x.sure), ask = g35.filter((x) => !x.sure);
  for (const f of [window.__fixGW27, window.__fixGW32, window.__fixGW20, window.__fixGW18, window.__fixGW08, window.__fixGW23, window.__fixGW19, window.__fixGW17,
    window.__fixGW30, window.__fixGW31, window.__fixGW26, window.__fixGW13, window.__fixGW25])
    fix.push(...f(work, { apply: true, start }));
  return { fix, ask, render: window.__vbRenderList(work, { start, warn }) };
};
window.__vbRenderList = (msgs, { start, warn } = {}) => {
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    if (!m.latex) continue;
    const w = W[m.index] || "?";
    for (const b of window.__vbStepBlocks(m)) if (b.rows.length > 1) out.push({ where: w, index: m.index, rule: "GW17", what: `계단 앞 줄 ${b.rows.length - 1}개 \\hspace* D(렌더로 재기)` });
    if (window.__vbDanFind(m)) out.push({ where: w, index: m.index, rule: "GW24", what: "(단, …) 붙일지·뗄지(렌더로 재기)" });
    if (window.__vb36Find && window.__vb36Find(m, w)) out.push({ where: w, index: m.index, rule: "GW36", what: "탭 빠진 단독 수식줄 — 4칸으로 붙일지·탭(렌더로 재기)" });
    if (window.__vbColFind(m).length) out.push({ where: w, index: m.index, rule: "GW25", what: "좌우 나열 둘째 열 자리(렌더로 재기)" });
    if (window.__vbTailFind(m.latex).length) out.push({ where: w, index: m.index, rule: "GW29", what: "꼬리·괄호 설명이 줄 끝에 들어가나(렌더로 재기)" });
    if (window.__vbPullFind(m.latex).length) out.push({ where: w, index: m.index, rule: "GW29", what: "혼자 한 줄인 꼬리를 앞 줄에 땡길지(렌더로 재기)" });
    const ov = warn ? warn.get(m.index) : Math.max(0, ...((m.renderWarnings || []).map((x) => x.overflowMM || 0)));
    if (ov > 0 && m.type !== "table") out.push({ where: w, index: m.index, rule: "넘침", what: `${ov}mm 넘침 — 끊기 후보 ${window.__vbCutCands(m).length}개(렌더로 고름)` });
  }
  return out;
};
window.__vbStepBlocks = (m, { alignedOnly = false } = {}) => {
  const G = window.__vb, lx = m.latex || "", out = [];
  for (const a of lx.matchAll(G.ALIGNED)) {
    const rows = G.rowSplit(a[1]).filter((r, i) => i % 2 === 0);
    let cur = null;
    rows.forEach((r, k) => {
      const [, b] = G.splitAmp(r);
      const c = b === null ? "" : b.trim(), d = c.match(/^\\hspace\*\{([0-9.]+)mm\}\s*/);
      const body = d ? c.slice(d[0].length) : c, hb = body.match(/^\\hbright\{\$([\s\S]*)\$\}$/);
      const step = k > 0 && b !== null && !G.filled(G.splitAmp(r)[0]) && (hb || G.isStepMath(body));
      if (step) {
        if (!cur) { cur = { kind: "al", at: a.index, head: rows[k - 1].replace("&", ""), eqRow: rows.find((x, j) => j > 0 && /^\s*&\s*=/.test(x)), rows: [] }; out.push(cur); }
        cur.rows.push({ k, math: hb ? hb[1] : body, d: d ? +d[1] : null, last: !!hb });
      } else cur = null;
    });
  }
  const scanLines = (lines, kind, lineOrigin, hb) => {
    const ls = lines.map((s) => {
      const hb = s.trim().match(/^\\hbright\{(\{?)\$([\s\S]*)\$\}?\}$/);
      if (hb) return { pre: "", math: hb[2], last: true };
      const l = G.mathLine(s); if (!l) return null;
      const d = l.pre.match(/\\hspace\*\{([0-9.]+)mm\}\s*$/);
      return { ...l, d: d && !/\\tab/.test(l.pre) ? +d[1] : null };
    });
    let cur = null;
    ls.forEach((l, k) => {
      const step = !!l && !l.tail && (l.last || (G.tabby(l.pre) && G.isStepMath(l.math)));
      if (step && k > 0 && (cur || (G.isEqLine(ls[k - 1]) && !ls[k - 1].last))) {
        if (!cur) { cur = { kind, hb, head: ls[k - 1].math, rows: [], origin: lineOrigin(k) }; out.push(cur); }
        cur.rows.push({ k, math: l.math, d: l.last ? null : l.d, last: !!l.last });
      } else cur = null;
    });
  };
  const hbs = alignedOnly ? [] : [...lx.matchAll(G.HBX)];
  hbs.forEach((h, i) => { if (h[4].includes("\\hblinebreak") && !h[4].includes("\\begin{aligned}")) scanLines(h[4].split(/\\hblinebreak/), "seg", () => G.num(h[2]), i); });
  if (hbs.length) scanLines(hbs.map((h) => h[4]), "t3", (k) => G.num(hbs[k][1]));
  return out.filter((b) => b.rows.some((r) => r.last));
};
window.__vbStepD = ({ E, W, L }) => {
  const k = L.length, S = W - L[k - 1];
  const st = L.map((l, i) => i === k - 1 ? S : E + (S - E) * (i + 1) / k);
  const clamped = st.map(() => false);
  for (let i = 0; i < k - 1; i++) { const lim = W - 1 - L[i]; if (st[i] > lim) { st[i] = lim; clamped[i] = true; } }
  for (let i = k - 2; i >= 0; i--) if (st[i] > st[i + 1]) st[i] = st[i + 1];
  for (let i = 0; i < k - 1; i++) if (st[i] < E) { st[i] = E; clamped[i] = true; }
  return { start: st.map((v) => +v.toFixed(2)), D: st.map((v) => +(v - E).toFixed(1)), clamped };
};
window.__vbSkel = (latex) => latex.replace(/\\(?:hspace\*?|hphantom|vspace|setmyfont\w*)\{[^}]*\}/g, "").replace(/\\left\.|\\right\./g, "")
  .replace(/\\text\{[^}]*\}/g, "").replace(/\\[A-Za-z]+/g, "").replace(/[^A-Za-z0-9]/g, "");
window.__vbRowSkel = (t) => t.normalize("NFKC").replace(/[^A-Za-z0-9]/g, "");
window.__vbFindSeq = (rows, latexLines) => {
  const want = latexLines.map((l) => window.__vbSkel(l).slice(0, 4));
  for (let j = 0; j + want.length <= rows.length; j++)
    if (want.every((w, i) => window.__vbRowSkel(rows[j + i].text).startsWith(w))) return j;
  return -1;
};
window.__vbRelX = (row) => { const w = row.w.find((x) => /^[=<>≤≥≠]/.test(x.t)); return w ? w.x0 : null; };
window.__vbDanFind = (m, V = "B") => {
  if (!(V === "A" ? window.__DAN_A.includes(m.type) : m.type === "question") || !/\(단,/.test(m.latex || "")) return null;
  const lx = m.latex;
  const det = V === "A" ? lx.match(/(\\end\{hangblock\})(\s*)\\begin\{hangblock\}\[0mm\]\{[0-9.]+mm\}\{0\}(\\sffamily\s*)?\\hbright\{(\(단,[\s\S]*?\))\}\\end\{hangblock\}/)
    : lx.match(/(\\end\{hangblock\})(\s*)\\begin\{hangblock\}\[0mm\]\{0mm\}\{0\}()\\hbright\{(\(단,[\s\S]*?\))\}\\end\{hangblock\}/);
  const nth = (at) => (lx.slice(0, at).match(/\(단,/g) || []).length;
  if (det && V !== "A") return { attached: false, cond: det[4], at: det.index, src: det[0], nth: nth(det.index) };
  const tailAt = (i) => {
    const t = lx.slice(i).match(/^\s*\\hbtail\{/);
    if (!t) return "";
    let d = 1, j = i + t[0].length;
    for (; j < lx.length && d; j++) { if (lx[j] === "\\") { j++; continue; } d += (lx[j] === "{") - (lx[j] === "}"); }
    return lx.slice(i, j);
  };
  if (V === "A") {
    const COND = String.raw`(\(단,(?:[^()]|\([^()]*\))*\))`, PAD = String.raw`(?:\\hspace\*\{[^}]*\}|\\qquad|~|\s)*`;
    const br = new RegExp(String.raw`\\hblinebreak` + PAD + COND).exec(lx);
    if (br) {
      const tail = tailAt(br.index + br[0].length), end = br.index + br[0].length + tail.length;
      if (/^\s*\\end\{hangblock\}/.test(lx.slice(end))) {
        const hb = lx.slice(0, br.index).lastIndexOf("\\begin{hangblock}");
        const sf = /^\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\}\s*\\sffamily/.test(lx.slice(hb));
        return { attached: false, needRight: true, kind: "br", nth: nth(br.index), cond: br[1], tail, sf, at: br.index, src: lx.slice(br.index, end) };
      }
    }
    const sp = new RegExp(String.raw`(\\end\{hangblock\})(\s*)\\begin\{hangblock\}\[0mm\]\{[0-9.]+mm\}\{0\}(\\sffamily\s*)?` + PAD + COND).exec(lx);
    if (sp) {
      const tail = tailAt(sp.index + sp[0].length), end = sp.index + sp[0].length + tail.length;
      const close = lx.slice(end).match(/^\s*\\end\{hangblock\}/);
      if (close) return { attached: false, needRight: true, kind: "sep", nth: nth(sp.index), cond: sp[4], tail, sf: !!sp[3], at: sp.index, src: lx.slice(sp.index, end + close[0].length) };
    }
    if (det) return { attached: false, cond: det[4], at: det.index, src: det[0], nth: nth(det.index) };
  }
  for (const a of lx.matchAll(/ (\(단,(?:[^()]|\([^()]*\))*\))/g)) {
    const tail = tailAt(a.index + a[0].length), end = a.index + a[0].length + tail.length;
    const close = lx.slice(end).match(/^\\end\{hangblock\}/);
    if (!close) continue;
    const hb = lx.slice(0, a.index).lastIndexOf("\\begin{hangblock}");
    const sf = V === "A" && /^\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\}\s*\\sffamily/.test(lx.slice(hb));
    return { attached: true, nth: nth(a.index), cond: a[1], tail, at: a.index, src: lx.slice(a.index, end + close[0].length), sf };
  }
  return null;
};
window.__vbDanDecide = ({ attached, closed, condW, prevEnd, W, gap = 1.5 }) => {
  if (attached) return closed ? null : condW > W ? null : "detach";
  return prevEnd + gap + condW <= W ? "attach" : null;
};
window.__vbDanApply = (lx, f, act) => {
  if (f.kind === "br") {
    if (act === "attach") return lx.replace(f.src, () => ` ${f.cond}${f.tail}`);
    if (act === "right") return lx.replace(f.src, () => `\\hblinebreak \\hbright{${f.cond}}${f.tail}`);
    return lx;
  }
  if (f.kind === "sep") {
    if (act === "attach") return lx.replace(f.src, () => ` ${f.cond}${f.tail}\\end{hangblock}`);
    if (act === "right") return lx.replace(f.src, () => `\\end{hangblock}\n\\begin{hangblock}[0mm]{0mm}{0}${f.sf ? "\\sffamily " : ""}\\hbright{${f.cond}}${f.tail}\\end{hangblock}`);
    return lx;
  }
  if (act === "detach") return lx.replace(f.src, () => `\\end{hangblock}\n\\begin{hangblock}[0mm]{0mm}{0}${f.sf ? "\\sffamily " : ""}\\hbright{${f.cond}}${f.tail || ""}\\end{hangblock}`);
  if (act === "attach") return lx.replace(f.src, () => ` ${f.cond}\\end{hangblock}`);
  return lx;
};
window.__vbDanMeasure = (f, R) => {
  const ks = R.rows.map((r, i) => r.text.includes("(단") ? i : -1).filter((i) => i >= 0);
  const k = ks[f.nth || 0] ?? ks[0] ?? -1;
  if (k < 0) return null;
  const r = R.rows[k], w0 = r.w.find((w) => w.t.includes("(단")) || r.w[0];
  const cx = w0.t.includes("(단") ? w0.x0 + (w0.x1 - w0.x0) * [...w0.t.slice(0, w0.t.indexOf("(단"))].length / Math.max(1, [...w0.t].length) : w0.x0;
  if (f.attached) {
    const tail = r.text.slice(r.text.indexOf("(단"));
    const closed = tail.includes(")");
    const condW = closed ? r.x1 - cx : (r.x1 - cx) + (R.rows[k + 1] ? R.rows[k + 1].x1 - R.rows[k + 1].x0 : 0);
    return { attached: true, closed, condW, W: R.W };
  }
  if (k === 0) return null;
  return { attached: false, prevEnd: window.__danPrevEnd(R.rows, k, 1), condW: r.x1 - r.x0, W: window.__danLim(R.rows, k, R.W, 1) };
};
window.__vbTailFind = (lx) => {
  const out = [], norm = (s) => s.replace(/\\cdots/g, "⋯").replace(/\\ding\{222\}/g, "➞").replace(/\\ding\{\d+\}/g, "").replace(/\\[A-Za-z]+\*?|\\,|[$~{}\s]/g, "");
  for (const a of lx.matchAll(/(\S)\\hbright\{((?:[^{}]|\{[^{}]*\})*)\}(?=\s*(?:\\end\{hangblock\}|\\hblinebreak))/g)) {
    const before = lx.slice(0, a.index + 1), segStart = Math.max(before.lastIndexOf("\\begin{hangblock}"), before.lastIndexOf("\\hblinebreak"));
    const seg = before.slice(segStart).replace(/^\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\}|^\\hblinebreak/, "");
    if (!norm(seg)) continue;
    const key = norm(a[2]);
    out.push({ kind: "tail", src: a[0], at: a.index, rep: a[1] + "\\hblinebreak \\hbright{" + a[2] + "}", key, nth: out.filter((x) => x.kind === "tail" && x.key.slice(0, 2) === key.slice(0, 2)).length });
  }
  for (const a of lx.matchAll(/\$\s*~?\s*(\((?!단,|∵|\\because|참\)|거짓\))[^()$\\]{1,40}\))\s*(?=\\end\{hangblock\}|\\hblinebreak)/g))
    out.push({ kind: "paren", src: a[0], rep: "$\\hblinebreak \\hbright{" + a[1] + "}", key: norm(a[1]) });
  return out;
};
window.__vbTailMeasure = (t, R) => {
  if (!t.key) return false;
  if (t.kind === "tail") {
    const h = t.key.slice(0, 2), rs = R.rows.filter((r) => { const i = r.text.lastIndexOf(h); return i >= 0 && i >= r.text.length - t.key.length - 1; });
    return !!rs[t.nth] && rs[t.nth].x1 > R.W + 0.1;
  }
  for (let k = 0; k + 1 < R.rows.length; k++)
    for (let p = 1; p < t.key.length; p++) if (R.rows[k].text.endsWith(t.key.slice(0, p)) && R.rows[k + 1].text.startsWith(t.key.slice(p))) return true;
  return false;
};
window.__vbPullFind = (lx) => {
  const out = [], norm = (s) => s.replace(/\\hphantom\{[^}]*\}/g, "").replace(/\\[A-Za-z]+\*?|[$~{}\s]/g, "");
  for (const a of lx.matchAll(/(\$\}?)\s*\\hblinebreak\s*\\hbright\{(\((?:참|거짓)\)(?:\\hphantom\{[^}]*\})?)\}(?=\s*(?:\\end\{hangblock\}|\\hblinebreak))/g)) {
    const key = norm(a[2]);
    out.push({ src: a[0], at: a.index, rep: a[1] + "\\hbright{" + a[2] + "}", key, nth: out.filter((x) => x.key === key).length });
  }
  return out;
};
window.__vbPullMeasure = (t, R) => {
  const rs = R.rows.map((r, k) => [r, k]).filter(([r]) => r.text.replace(/\s/g, "") === t.key && r.x0 > R.W / 2);
  const hit = rs[t.nth];
  if (!hit || hit[1] === 0) return false;
  const [r, k] = hit, prev = R.rows[k - 1];
  return prev.x1 + 1.5 + (r.x1 - r.x0) <= R.W - 0.1;
};
window.__vbCw31Find = (lx) => {
  const ms = [...lx.matchAll(/\\hspace\*\{([\d.]+)mm\}(\{?)\$\\cdots\s*\$\s*([㉠-㉭])\}?(?=\\hbright\{\\ding\{222\}|\s*\\end\{hangblock\})/g)]
    .map((a) => ({ at: a.index, len: a[0].length, D: +a[1], circ: a[3], tail: lx.startsWith("\\hbright{\\ding{222}", a.index + a[0].length) }));
  return ms.some((x) => x.tail) ? ms : [];
};
window.__vbCw31Measure = (ms, R) => {
  const hits = [];
  for (const r of R.rows) {
    const ai = r.w.findIndex((w) => w.t.startsWith("➞")), ws = ai >= 0 ? r.w.slice(0, ai) : r.w, w = ws[ws.length - 1];
    if (!w || ws.length < 2) continue;
    const cs = [...w.t], c = cs[cs.length - 1];
    if (!/[㉠-㉭]/.test(c)) continue;
    const prev = cs.length > 1 ? cs[cs.length - 2] : [...ws[ws.length - 2].t].pop();
    if (!/[⋯…·]/.test(prev)) continue;
    hits.push({ cx: cs.length > 1 ? w.x1 - 2.9 : w.x0, cw: cs.length > 1 ? 2.9 : w.x1 - w.x0, arrow: ai >= 0 ? r.w[ai].x0 : null, circ: c });
  }
  if (hits.length !== ms.length || hits.some((h, i) => h.circ !== ms[i].circ || (h.arrow != null) !== ms[i].tail)) return null;
  const X = Math.min(...hits.map((h) => (h.arrow != null ? h.arrow - 2 : R.W) - h.cw));
  return hits.map((h, i) => ({ D: +(X - (h.cx - ms[i].D)).toFixed(1), X }));
};
window.__vbSideLab = String.raw`(?:\{\\fontsize\{[^}]*\}\{[^}]*\}\\selectfont\s*)?\{?(?:\\textrm\{)?(\(\d+\)|\([ⅰ-ⅻ]+\)|[ㄱ-ㅎ]\.|[①-⑳]|\([a-z]\))`;
window.__vbSideFind = (lx) => {
  const out = [], G = window.__vb;
  for (const h of lx.matchAll(G.HBX)) {
    const body = h[4], first = body.match(new RegExp("^((?:\\\\sffamily\\s*|\\\\hspace\\*\\{[\\d.]+mm\\}\\s*)*)" + window.__vbSideLab));
    if (!first || body.includes("\\hblinebreak")) continue;
    const cuts = [...body.matchAll(new RegExp(String.raw`\\qquad\s*(?=` + window.__vbSideLab + ")", "g"))];
    if (!cuts.length) continue;
    const labs = [first[2], ...cuts.map((c) => body.slice(c.index).match(new RegExp(String.raw`\\qquad\s*` + window.__vbSideLab))[1])];
    const items = [body.slice(first[1].length, cuts[0].index), ...cuts.map((c, k) => body.slice(c.index + c[0].length, k + 1 < cuts.length ? cuts[k + 1].index : body.length))];
    out.push({ nth: out.length, src: h[0], head: h[0].slice(0, h[0].length - body.length - "\\end{hangblock}".length), lead: first[1], items, labs, L: G.num(h[1]), N: G.num(h[2]), H: +((first[1].match(/\\hspace\*\{([\d.]+)mm\}/) || [0, 0])[1]) });
  }
  return out;
};
window.__vbSideMeasure = (s, R) => {
  const nf = (t) => t.normalize("NFKC"), at = (r, l) => r.w.findIndex((w) => nf(w.t).startsWith(nf(l)));
  const js = R.rows.map((r, i) => { const k = at(r, s.labs[0]); return k >= 0 && Math.abs(r.w[k].x0 - s.L - s.H) < 0.6 ? i : -1; }).filter((i) => i >= 0);
  const j = js[s.nth];
  if (j == null) return null;
  const r = R.rows[j], nx = R.rows[j + 1];
  if (!nx || Math.abs(nx.x0 - s.N) > 0.6) return 0;
  let k = 0;
  s.labs.forEach((l, i) => { if (i && at(r, l) >= 0) k = i; });
  if (k && nf(r.w[r.w.length - 1].t) === nf(s.labs[k])) return k;
  if (k + 1 < s.labs.length && at(nx, s.labs[k + 1]) === 0) return k + 1;
  return k || -1;
};
window.__vbSideApply = (lx, s, k) => {
  const join = (its) => its.map((t, i) => (i ? "\\qquad " : "") + t.replace(/\s+$/, "")).join("");
  return lx.replace(s.src, () => s.head + s.lead + join(s.items.slice(0, k)) + "\\end{hangblock}\n" + s.head + s.lead + join(s.items.slice(k)) + "\\end{hangblock}");
};
window.__vbColFind = (m) => {
  const G = window.__vb;
  if (!["question", "table", "half_contents", "half_contents_D1"].includes(m.type)) return [];
  const out = []; let tp = null;
  for (const t of (m.latex || "").matchAll(G.TOK)) {
    if (t[1] !== undefined) { tp = G.tpVals(t[1]); continue; }
    const body = t[5], L = G.num(t[2]), N = G.num(t[3]);
    if (!G.LAB.test(body) || !G.SIDE.test(body) || !tp || !G.tpIsGrid(tp, N)) continue;
    const labs = [body.match(G.LAB)[1], ...[...body.matchAll(new RegExp(G.SIDE.source, "g"))].map((x) => x[0].match(/(\([ⅰ-ⅻ]+\)|[ⅰ-ⅻ]+\)|[ㄱ-ㅎ]\.|\(\d+\)|\d+\)|\([a-z]\)|[a-z][.)]|\([A-Z]\)|[A-Z][.)]|[①-⑳ⓐ-ⓩⒶ-Ⓩ㉠-㉭㉮-㉻➀-➉])\}?\s*$/)[1])];
    out.push({ src: t[0], body, L, labs });
  }
  for (const c of out) c.n = Math.max(...out.filter((d) => G.near(d.L, c.L, 0.01)).map((d) => d.labs.length));
  return out;
};
window.__vbColDecide = ({ x, prevEnd, W, L = 0, j, n }) => {
  const G = window.__vb.GRID, want = L + (W - L) * j / n;
  const kt = Math.max(1, Math.round(want / G)), kc = Math.round(x / G);
  if (Math.abs(x - kc * G) > 1) return { add: 0, why: `지금 자리 ${x.toFixed(1)} 가 탭 격자가 아님` };
  if (kt === kc) return { add: 0, target: kt * G };
  if (kt < kc) return j !== 1 ? { add: 0, target: kc * G } : prevEnd > kt * G - 1 ? { add: 0, why: "앞 항목이 길어 왼쪽으로 못 옮김" } : { add: kt - kc, target: kt * G };
  if (prevEnd > kt * G - 1) return { add: 0, why: "앞 항목이 길어 못 옮김" };
  return { add: kt - kc, target: kt * G };
};
window.__vbColMeasure = (c, R) => {
  for (const r of R.rows) {
    const xs = c.labs.map((l) => r.w.find((w) => w.t.normalize("NFKC").startsWith(l.normalize("NFKC"))));
    if (xs.some((x) => !x)) continue;
    return xs.map((w, j) => j ? { x: w.x0, prevEnd: Math.max(...r.w.filter((v) => v.x1 <= w.x0 + 0.01).map((v) => v.x1)), W: R.W, L: c.L, j, n: c.n || c.labs.length } : null).slice(1);
  }
  return null;
};
window.__fixBMeasure = (msgs, rowsOf, { apply = false, start } = {}) => {
  const G = window.__vb, V = window.__K.key(msgs);
  if (!V) return [];
  const Wh = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    if (!m.latex) continue;
    const R = rowsOf(m);
    if (!R) continue;
    const where = Wh[m.index] || "?", note = (rule, what) => out.push({ where, index: m.index, rule, skipped: true, what });
    let lx = m.latex;
    for (const b of window.__vbStepBlocks(m, { alignedOnly: V !== "B" })) {
      if (b.rows.length < 2) continue;
      const j = window.__vbFindSeq(R.rows, [b.head, ...b.rows.map((r) => r.math)]);
      if (j < 0) { note("GW17", "계단 — 렌더 줄을 못 맞춤(사람 확인)"); continue; }
      const eqRow = b.kind === "al" && b.eqRow ? R.rows.slice(j + b.rows.length + 1).find((r) => /^=/.test(r.text)) : null;
      const E = window.__vbRelX(R.rows[j]) ?? (eqRow ? eqRow.x0 : null);
      if (E == null) { note("GW17", "계단 — 머리 줄 = 자리를 못 찾음"); continue; }
      const plan = window.__vbStepD({ E, W: R.W, L: b.rows.map((r, i) => R.rows[j + 1 + i].x1 - R.rows[j + 1 + i].x0) });
      const want = b.rows.map((r, i) => r.last ? null : b.kind === "al" ? plan.D[i] : +(plan.start[i] - b.origin).toFixed(1));
      const todo = b.rows.map((r, i) => want[i] != null && !(r.d != null && Math.abs(r.d - want[i]) <= 0.1));
      if (!todo.some(Boolean)) continue;
      if (b.kind === "al") {
        lx = lx.replace(G.ALIGNED, (all, inner, at) => {
          if (at !== b.at) return all;
          const parts = G.rowSplit(inner);
          b.rows.forEach((r, i) => {
            if (!todo[i]) return;
            const [a, c] = G.splitAmp(parts[2 * r.k]);
            parts[2 * r.k] = a + "&\\hspace*{" + G.mm(want[i]) + "}" + c.replace(/^\s*\\hspace\*\{[0-9.]+mm\}\s*/, "").replace(/^\s+/, "");
          });
          return "\\begin{aligned}" + parts.join("") + "\\end{aligned}";
        });
      } else {
        const hbs = [...lx.matchAll(G.HBX)];
        b.rows.forEach((r, i) => {
          if (!todo[i]) return;
          const h = hbs[b.kind === "t3" ? r.k : b.hb];
          const segs = b.kind === "t3" ? [h[4]] : h[4].split(/\\hblinebreak/), s = segs[b.kind === "t3" ? 0 : r.k], l = G.mathLine(s);
          segs[b.kind === "t3" ? 0 : r.k] = l.lead + "\\hspace*{" + G.mm(want[i]) + "}" + (l.brace ? "{" : "") + "$" + l.math + "$" + (l.brace ? "}" : "") + l.tail + s.match(/\s*$/)[0];
          const nh = h[0].replace(h[4], () => segs.join("\\hblinebreak"));
          lx = lx.replace(h[0], () => nh);
        });
      }
      out.push({ where, index: m.index, rule: "GW17", what: `계단 D ${want.filter((d) => d != null).map((d, i) => d + "mm" + (plan.clamped[i] ? "(넘쳐 줄임 — 확인)" : "")).join(", ")} (E ${E.toFixed(1)} · 칸 ${R.W.toFixed(1)})`,
        D: want.filter((d) => d != null), clamped: plan.clamped.slice(0, -1) });
    }
    for (let dn = 0, seen = new Set(); dn < 4; dn++) {
      const f = window.__vbDanFind({ ...m, latex: lx }, V);
      if (!f || seen.has(f.nth + "|" + f.src)) break;
      seen.add(f.nth + "|" + f.src);
      const x = window.__vbDanMeasure(f, R);
      let act = x && window.__vbDanDecide(x);
      if (!act && f.needRight) act = "right";
      if (!act) break;
      {
        lx = window.__vbDanApply(lx, f, act);
        out.push({ where, index: m.index, rule: V === "A" ? "CW26" : "GW24", before: f.src.slice(0, 70), after: act === "attach" ? "땡김(붙임)" : "뗌(다음 줄 \\hbright)",
          what: act === "attach" ? `앞 줄 끝 ${x.prevEnd.toFixed(1)} + 조건 ${x.condW.toFixed(1)} ≤ 칸 ${x.W.toFixed(1)}` : act === "right" ? "정렬 없이 줄만 바뀐 조건 → 오른쪽 정렬(\\hbright)" : `조건이 두 줄로 쪼개짐(조건 폭 ${x.condW.toFixed(1)})` });
      }
    }
    for (const t of window.__vbTailFind(lx).filter((x) => window.__vbTailMeasure(x, R)).reverse()) {
      lx = t.at != null ? lx.slice(0, t.at) + t.rep + lx.slice(t.at + t.src.length) : lx.replace(t.src, () => t.rep);
      out.push({ where, index: m.index, rule: V === "A" ? "CW29" : "GW29", before: t.src.slice(-50), after: t.rep.slice(-60),
        what: t.kind === "tail" ? `꼬리 ${t.key} 가 줄 끝에 안 들어감 → 한 줄 내려 우정렬` : `괄호 설명 ${t.key} 가 두 줄로 갈림 → 다음 줄 우정렬` });
    }
    for (const t of (V === "B" ? window.__vbPullFind(lx) : []).filter((x) => window.__vbPullMeasure(x, R)).reverse()) {
      lx = lx.slice(0, t.at) + t.rep + lx.slice(t.at + t.src.length);
      out.push({ where, index: m.index, rule: "GW29", before: t.src.slice(-50), after: t.rep.slice(-50), what: `혼자 한 줄인 꼬리 ${t.key} 가 앞 줄 끝에 들어감 → 땡김` });
    }
    const c31 = V === "A" ? window.__vbCw31Find(lx) : [];
    if (c31.length) {
      const got = window.__vbCw31Measure(c31, R);
      if (!got) note("CW31", "⋯ 꼬리 — 렌더 줄을 못 맞춤(사람 확인)");
      else if (got.some((g) => g.D < 2)) note("CW31", `⋯ 꼬리 — 식이 길어 ⋯ 자리가 모자람(D ${got.map((g) => g.D).join(", ")}mm · 사람 확인)`);
      else if (got.some((g, i) => Math.abs(g.D - c31[i].D) > 0.1)) {
        c31.slice().reverse().forEach((c, ri) => { const g = got[c31.length - 1 - ri]; lx = lx.slice(0, c.at) + lx.slice(c.at, c.at + c.len).replace(/^\\hspace\*\{[\d.]+mm\}/, `\\hspace*{${G.mm(g.D)}}`) + lx.slice(c.at + c.len); });
        out.push({ where, index: m.index, rule: "CW31", what: `㉠ 세로 자리 ${got[0].X.toFixed(1)}mm · D ${got.map((g) => g.D).join(", ")}mm (칸 ${R.W.toFixed(1)})` });
      }
    }
    for (const s of V === "A" ? window.__vbSideFind(lx) : []) {
      const k = window.__vbSideMeasure(s, R);
      if (k === null) note("CW32", `좌우 나열 ${s.labs.join(" ")} — 렌더 줄을 못 맞춤(사람 확인)`);
      else if (k < 0) note("CW32", `좌우 나열 ${s.labs[0]} 부터 안 들어감(사람 확인)`);
      else if (k > 1) {
        lx = window.__vbSideApply(lx, s, k);
        out.push({ where, index: m.index, rule: "CW32", before: s.labs.join(" "), after: s.labs.slice(0, k).join(" ") + " / " + s.labs.slice(k).join(" "), what: `좌우 나열 ${s.labs[k]} 가 접힘 → ${s.labs[k]} 부터 다음 줄 ${s.labs[0]} 라벨 자리(${(s.L + s.H).toFixed(1)}mm)` });
      }
    }
    for (const c of V === "B" ? window.__vbColFind({ ...m, latex: lx }) : []) {
      const ms = window.__vbColMeasure(c, R);
      if (!ms) continue;
      let body = c.body;
      ms.slice().reverse().forEach((x) => {
        const d = window.__vbColDecide(x);
        if (!d.add) { if (d.why) note("GW25", `${c.labs[x.j]} — ${d.why}`); return; }
        const lab = c.labs[x.j];
        const re = new RegExp(`(\\\\tab\\s*(?:\\\\hspace\\*\\{0\\.01mm\\}\\\\tab\\s*)*)((?:\\\\sffamily\\s*)?(?:\\\\textrm\\{)?${lab.replace(/[()[\].]/g, "\\$&")})`);
        let ok = true;
        body = body.replace(re, (all, tabs, l) => {
          if (d.add > 0) return tabs + "\\hspace*{0.01mm}\\tab ".repeat(d.add) + l;
          let t = tabs;
          for (let i = 0; i < -d.add; i++) { const j = t.lastIndexOf("\\hspace*{0.01mm}\\tab"); if (j < 0) { ok = false; break; } t = t.slice(0, j) + t.slice(j + "\\hspace*{0.01mm}\\tab".length).replace(/^ /, ""); }
          return ok ? t + l : all;
        });
        if (!ok) { note("GW25", `${lab} — 뺄 탭이 없음`); return; }
        out.push({ where, index: m.index, rule: "GW25", what: `${lab} 자리 ${x.x.toFixed(1)} → ${d.target.toFixed(1)}mm (탭 ${Math.abs(d.add)}개 ${d.add > 0 ? "더함" : "뺌"})` });
      });
      if (body !== c.body) lx = lx.replace(c.src, () => c.src.replace(c.body, () => body));
    }
    if (apply && lx !== m.latex) { m.latex = lx; window.__clearRender && window.__clearRender(m); }
  }
  return out;
};
window.__vbCut = (math, i) => {
  const G = window.__vb;
  let head = math.slice(0, i), tail = math.slice(i);
  const open = [];
  for (const t of G.scan(head)) { if (t.t === "left") open.push(t); else if (t.t === "right") open.pop(); }
  for (const t of open.slice().reverse()) {
    if (t.dot) head = head.slice(0, t.i) + head.slice(t.end).replace(/^\\hspace\{-0\.12em\}/, "");
    else head += "\\right.\\hspace{-0.12em}";
  }
  if (open.length) tail = "{" + "\\left.\\hspace{-0.12em}".repeat(open.length) + tail + "}";
  return [head.replace(/\s+$/, ""), tail.trim()];
};
window.__vbCutCands = (m, R) => {
  const G = window.__vb, lx = m.latex || "", cands = [];
  const over = R ? R.rows.filter((r) => r.x1 > R.W + 0.3).map((r) => window.__vbRowSkel(r.text).slice(0, 4)) : null;
  const hbs = [...lx.matchAll(G.HBX)];
  for (const h of hbs) {
    const body = h[4], paraOnly = !body.includes("\\hblinebreak");
    if (body.includes("\\begin{aligned}")) continue;
    const segs = body.split(/\\hblinebreak/);
    segs.forEach((s, k) => {
      const l = G.mathLine(s);
      if (!l || l.tail || /^\\hbright/.test(s.trim())) return;
      if (over && over.length && !over.some((o) => window.__vbSkel(l.math).startsWith(o))) return;
      const end = s.match(/\s*$/)[0];
      const mk = (a, b, eqCut) => {
        const ns = [...segs];
        if (eqCut) ns[k] = l.pre + `$${a}$\\hblinebreak $${b}$` + end;
        else if (paraOnly && !G.LAB.test(body)) {
          const nh = h[0].replace(body, () => l.pre + `$${a}$`) + `\n\\begin{hangblock}[${h[1] || "0mm"}]{${h[2]}}{${h[3]}}\\hbright{$${b}$}\\end{hangblock}`;
          return lx.replace(h[0], () => nh);
        } else ns[k] = l.pre + `$${a}$\\hblinebreak \\hbright{$${b}$}` + end;
        return lx.replace(h[0], () => h[0].replace(body, () => ns.join("\\hblinebreak")));
      };
      const bec = l.math.match(/~?\\left\(\\because[\s\S]*\\right\)\s*$/);
      if (bec) cands.push({ why: "(∵) 다음 줄 우정렬(GW19)", latex: mk(l.math.slice(0, bec.index), bec[0].replace(/^~/, ""), false) });
      const toks = G.scan(l.math);
      if (m.type === "question" && !/^\s*=/.test(l.math))
        toks.filter((t) => t.t === "rel" && t.bd === 0 && t.ld === 0 && t.i > 0).reverse()
          .forEach((t) => cands.push({ why: "= 앞에서 끊기(GW23)", latex: mk(l.math.slice(0, t.i).trim(), l.math.slice(t.i).trim(), true) }));
      if (!G.isEqLine({ ...l, math: l.math.replace(/^\s*\\left\.\\hspace\{-0\.12em\}/, "") })) return;
      const dummy = /^\s*\\left\.\\hspace\{-0\.12em\}/.test(l.math) ? 1 : 0;
      const ops = toks.filter((t) => t.t === "op" && t.bd === 0 && t.i > 2 && !/(?:\\left[(\[{|.]|\\left\\\{|[=(<>{]|\\le|\\ge|\\hspace\{-0\.12em\})\s*$/.test(l.math.slice(0, t.i)));
      const marks = toks.filter((t) => t.t === "right" && t.dot && /^\\hspace\{-0\.12em\}/.test(l.math.slice(t.end))).map((t) => ({ i: t.end + "\\hspace{-0.12em}".length }));
      const R2L = (a, b) => b.i - a.i;
      [...marks.sort(R2L), ...ops.filter((t) => t.ld <= dummy).sort(R2L), ...ops.filter((t) => t.ld > dummy).sort(R2L)].forEach((t) => {
        const [a, b] = window.__vbCut(l.math, t.i);
        if (a && b) cands.push({ why: "연산자 앞에서 끊어 계단(\\hbright)", latex: mk(a, b, false) });
      });
    });
  }
  const seen = new Set();
  return cands.filter((c) => c.latex !== lx && !seen.has(c.latex) && seen.add(c.latex));
};
window.__vbRows = async (lib, m) => {
  const MM = 72 / 25.4;
  let bin = atob(m.pdf.split(",").pop()), W = 0, H = 0;
  bin = bin.replace(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/, (all, w, h) => { W = +w; H = +h; return `/MediaBox [0 -300 ${(W + 300).toFixed(3)} ${H}]`; });
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const doc = await lib.getDocument({ data: bytes, isEvalSupported: false }).promise;
  const page = await doc.getPage(1), [vx, , vx1, vy1] = page.view, vy = vy1 - (H || vy1 - page.view[1]);
  if (!W) { W = vx1 - vx; H = vy1 - page.view[1]; }
  const tc = await page.getTextContent();
  doc.destroy();
  const ws = tc.items.filter((it) => it.str.trim() && it.str.replace(/√/g, "").trim()).map((it) => {
    const fs = Math.hypot(it.transform[2], it.transform[3]) || it.height, x = it.transform[4] - vx, base = H - (it.transform[5] - vy);
    return { t: it.str.replace(/\s+/g, ""), x0: x / MM, x1: (x + it.width) / MM, y0: (base - 0.8 * fs) / MM, y1: (base + 0.2 * fs) / MM };
  });
  const ov = (a, b) => (Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)) / Math.max(0.03, Math.min(a.y1 - a.y0, b.y1 - b.y0));
  const rows = [];
  for (const w of [...ws].sort((a, b) => a.y0 - b.y0)) {
    const r = rows[rows.length - 1];
    if (r && r.w.some((v) => ov(w, v) > 0.3)) { r.w.push(w); r.y1 = Math.max(r.y1, w.y1); } else rows.push({ y0: w.y0, y1: w.y1, w: [w] });
  }
  for (const r of rows) { r.w.sort((a, b) => a.x0 - b.x0); r.x0 = r.w[0].x0; r.x1 = Math.max(...r.w.map((w) => w.x1)); r.text = r.w.map((w) => w.t).join(""); }
  return { W: W / MM, H: H / MM, rows };
};
window.__vbRendered = async (mm, tries = 6) => {
  for (let t = 0; t < tries; t++) {
    const r = (await window.__K.exportRendered()).messages.find((x) => x.index === 0);
    if (r && r.pdf && r.latex === mm.latex) return r;
    await new Promise((res) => setTimeout(res, 1500));
  }
  return null;
};
window.__vb35 = (() => {
  const plain = (s) => s.replace(/\$[^$]*\$/g, "X").replace(/\\[A-Za-z]+\*?(\{[^{}]*\})?/g, "").replace(/[{}]/g, "").trim();
  const END = /(?:다|요|오|라)\.?\)?\s*$|[.:?!]\)?\s*$/;
  const DISPLAY = /^\s*(?:\\sffamily\s*)?(?:\\hspace\*\{[0-9.]+mm\}|\\tab|\\qquad|\{?\$\\therefore|\\hbright|\{?\$\\begin\{(?:aligned|cases)\})/;
  const LAB = /^(?:\\sffamily\s*|\\bfseries\s*|\s)*(?:\\textrm\{)?(?:\([ⅰ-ⅹ]+\)|\(\d+\)|[①-⑳]|[ㄱ-ㅎ]\.|\([가-하]\)|\(\{?\$[^$]*\$\}?\))/;
  const RESULT = (s) => { const i = s.lastIndexOf("\\qquad"); return i >= 0 && /^[X\s,]*의\s*X\s*(?:개|가지)$/.test(plain(s.slice(i + 6))); };
  const PART = /^(?:이므로|이고|이며|이면|이다|이라|을|를|이|가|은|는|의|에|에서|로|으로|와|과|도|만|라|이라고|라고)(?=[\s,.]|$)/;
  const ADV = /^(?:반드시|항상|모두|각각|다시|또한|서로|이미|먼저|바로|함께|특히|모든|어떤|즉|또|곧|더|덜|가장|매우|아주|오직|단지)$/;
  const tailWord = (s) => (plain(s).match(/([가-힣]+)\s*$/) || [])[1] || "";
  const headWord = (s) => (plain(s).match(/^([가-힣]+)/) || [])[1] || "";
  const decide = (prev, next, corpus) => {
    const pp = plain(prev), nn = next.trim();
    if (!pp || END.test(pp) || DISPLAY.test(prev) || DISPLAY.test(nn) || LAB.test(nn)) return null;
    if (/\\qquad\s*\{?\$[^$]*\$\}?\s*$/.test(prev.trim()) || RESULT(prev) || RESULT(nn)) return null;
    if (/X\s*(?:개|가지)\s*$/.test(pp)) return null;
    if (LAB.test(prev) && /(때|경우),?\s*$/.test(pp)) return null;
    if (!/^[가-힣$]/.test(nn)) return null;
    if (/X\s*$/.test(pp)) return PART.test(plain(nn)) ? { join: "", why: "수식 끝 + 조사로 시작" } : null;
    if (!/[가-힣]\s*$/.test(pp)) return null;
    const a = tailWord(prev), b = headWord(nn) || "";
    if (!b) return { join: " ", why: "글 다음 수식으로 이어짐" };
    const g = corpus.split(a + b).length - 1, s = corpus.split(a + " " + b).length - 1;
    if (g && !s) return { join: "", why: `붙여 쓴 곳 ${g}` };
    if (s && !g) return { join: " ", why: `띄어 쓴 곳 ${s}` };
    if (/(므로|하여|해서|하면|이면|려면|다면|으면|니까|도록|하고|이고|며|지만|는데|또는|은|는|이|가|을|를|의|에|와|과|로)$/.test(a) || ADV.test(a)) return { join: " ", why: "낱말 끝 말", weak: true };
    if ((corpus.match(new RegExp(a + "\\s", "g")) || []).length >= 2 && !new RegExp(a + "[가-힣]").test(corpus)) return { join: " ", why: "앞 낱말이 늘 띄어 씀" };
    return { join: null, why: `띄어쓰기 근거 없음(${a}|${b})` };
  };
  return { plain, decide, END, LAB };
})();
window.__fixGW35 = (msgs, { apply = false, start, edited = false, corpus } = {}) => {
  if (!window.__vb.isB(msgs)) return [];
  const K = window.__vb35, W = window.__where(msgs, { start });
  const text = corpus || msgs.map((m) => m.latex || "").join("\n").replace(/\$[^$]*\$/g, " X ").replace(/\\[A-Za-z]+\*?/g, " ");
  const out = [];
  for (const m of msgs) {
    if (!m.latex || m.type !== "explanation" || /정답/.test(W[m.index] || "")) continue;
    let lx = m.latex, guard = 0, changed = true;
    while (changed && guard++ < 20) {
      changed = false;
      const hs = [...lx.matchAll(window.__vb.HBX)];
      for (const h of hs) {
        const segs = h[4].split(/\\hblinebreak\s*/);
        for (let k = 0; k + 1 < segs.length; k++) {
          const d = K.decide(segs[k], segs[k + 1], text);
          if (!d) continue;
          if (/^\s*\{?\$/.test(segs[k + 1])) { d.join = null; d.why += " · 문단 안 다음 줄이 수식으로 시작(일부러 나눴을 수 있음)"; }
          const sure = d.join !== null && !edited;
          out.push({ where: W[m.index], index: m.index, rule: "GW35", sure, what: `문단 안 줄바꿈 ${sure ? "합침" : "후보"} — ${d.why}`, before: `${K.plain(segs[k]).slice(-12)} ⏎ ${K.plain(segs[k + 1]).slice(0, 12)}` });
          if (sure && apply) {
            const ns = [...segs]; ns.splice(k, 2, segs[k].replace(/\s+$/, "") + d.join + segs[k + 1].replace(/^\s+/, ""));
            lx = lx.replace(h[0], () => h[0].replace(h[4], () => ns.join("\\hblinebreak\n"))); changed = true; break;
          }
        }
        if (changed) break;
      }
      if (changed) continue;
      for (let i = 0; i + 1 < hs.length; i++) {
        const a = hs[i], b = hs[i + 1];
        if ((a[1] || "0mm") !== (b[1] || "0mm") || a[2] !== b[2] || a[3] !== b[3]) continue;
        const between = lx.slice(a.index + a[0].length, b.index);
        if (between.trim()) continue;
        const last = a[4].split(/\\hblinebreak\s*/).pop(), d = K.decide(last, b[4], text);
        if (!d) continue;
        const sure = d.join !== null && !edited;
        out.push({ where: W[m.index], index: m.index, rule: "GW35", sure, what: `문단 ${sure ? "합침" : "후보"} — ${d.why}`, before: `${K.plain(last).slice(-12)} ⏎ ${K.plain(b[4]).slice(0, 12)}` });
        if (sure && apply) {
          const merged = a[0].replace(/\\end\{hangblock\}$/, "").replace(/\s+$/, "") + d.join + b[4].replace(/^\s+/, "") + "\\end{hangblock}";
          lx = lx.slice(0, a.index) + merged + lx.slice(b.index + b[0].length); changed = true; break;
        }
      }
    }
    if (apply && lx !== m.latex) { m.latex = lx; window.__clearRender(m); }
  }
  return out;
};
window.__vb36Find = (m, where = "") => {
  if (!m.latex || m.type !== "explanation" || /정답/.test(where)) return null;
  const K = window.__vb35, G = window.__vb, lx = m.latex;
  const mathOnly = (s) => /^\s*\{?\$/.test(s) && !/^\s*\{?\$\\(?:Rightarrow|Leftrightarrow)/.test(s)
    && !/[가-힣A-Za-z]/.test(s.replace(/\$[^$]*\$/g, "").replace(/\\[A-Za-z]+\*?/g, "").replace(/[{}]/g, ""));
  const mid = (p) => { const pp = K.plain(p); return pp && /[가-힣]\s*$/.test(pp) && !K.END.test(pp) && !(K.LAB.test(p) && /(때|경우),?\s*$/.test(pp)); };
  const tabOf = (h, line) => {
    const pre = lx.slice(0, h.index).includes("\\TabPositions") ? "" : `\\TabPositions{${G.gridTP(G.num(h[2]))}}\n`;
    return { pre, line: "\\hspace*{0.01mm}\\tab " + line.replace(/^\s+/, "") };
  };
  const hs = [...lx.matchAll(G.HBX)];
  for (let i = 0; i < hs.length; i++) {
    const h = hs[i], segs = h[4].split(/\\hblinebreak\s*/);
    for (let k = 1; k < segs.length; k++) {
      if (!mathOnly(segs[k]) || !mid(segs[k - 1])) continue;
      const rebuild = (ns, pre = "") => lx.slice(0, h.index) + pre + h[0].replace(h[4], () => ns.join("\\hblinebreak\n")) + lx.slice(h.index + h[0].length);
      const four = [...segs]; four.splice(k - 1, 2, segs[k - 1].replace(/\s+$/, "") + "\\qquad " + segs[k].replace(/^\s+/, ""));
      const t = tabOf(h, segs[k]), tab = [...segs]; tab[k] = t.line;
      return { four: rebuild(four), tab: rebuild(tab, t.pre), before: `${K.plain(segs[k - 1]).slice(-12)} ⏎ ${segs[k].trim().slice(0, 40)}` };
    }
    const b = hs[i + 1];
    if (!b || (h[1] || "0mm") !== (b[1] || "0mm") || h[2] !== b[2] || h[3] !== b[3] || lx.slice(h.index + h[0].length, b.index).trim()) continue;
    const last = segs[segs.length - 1], first = b[4].split(/\\hblinebreak\s*/)[0];
    if (!mathOnly(first) || !mid(last)) continue;
    const four = lx.slice(0, h.index) + h[0].replace(/\\end\{hangblock\}$/, "").replace(/\s+$/, "") + "\\qquad " + b[4].replace(/^\s+/, "") + "\\end{hangblock}" + lx.slice(b.index + b[0].length);
    const t = tabOf(b, first);
    const tab = lx.slice(0, b.index) + t.pre + b[0].replace(b[4], () => t.line + b[4].slice(first.length)) + lx.slice(b.index + b[0].length);
    return { four, tab, before: `${K.plain(last).slice(-12)} ⏎ ${first.trim().slice(0, 40)}` };
  }
  return null;
};
window.__vb37Cands = (m) => {
  if (!m.latex) return [];
  const out = [], lx = m.latex;
  for (const h of lx.matchAll(window.__vb.HBX)) {
    const segs = h[4].split(/(\\hblinebreak\s*)/);
    for (let k = 0; k < segs.length; k += 2) {
      const lead = (segs[k].match(/^\s*(?:\\hspace\*\{0\.01mm\}\\tab\s*)+/) || [""])[0];
      if (!lead) continue;
      const cuts = [...segs[k].matchAll(/\$,(\s*)(?=\{?\$)/g)].map((x) => x.index + 2);
      for (const at of cuts.reverse()) {
        const ns = [...segs]; ns[k] = segs[k].slice(0, at) + "\\hblinebreak\n" + lead.trim() + " " + segs[k].slice(at).replace(/^\s+/, "");
        const body = ns.join("");
        out.push({ latex: lx.slice(0, h.index) + h[0].replace(h[4], () => body) + lx.slice(h.index + h[0].length), why: `'${window.__vb35.plain(segs[k].slice(0, at)).slice(-10)}' 뒤에서 줄 나눔 + 탭` });
      }
    }
  }
  return out;
};
window.__vb37Fix = async (m, r, { lib, one }) => {
  const zero = async (x) => (await window.__lineFind(lib, x, "B")).some((f) => f[0] === "수식 줄 시작");
  if (!r || !r.pdf || !(await zero(r))) return null;
  const n0 = (await window.__vbRows(lib, r)).rows.length;
  for (const c of window.__vb37Cands(m).slice(0, 12)) {
    const t = await one({ ...m, latex: c.latex });
    if (!t || !t.pdf || Math.max(0, ...((t.renderWarnings || []).map((w) => w.overflowMM || 0))) > 0) continue;
    if ((await window.__vbRows(lib, t)).rows.length === n0 && !(await zero(t)) && !(await window.__lineFind(lib, t, "B")).some((f) => f[0] === "넘침")) return { latex: c.latex, r: t, why: c.why };
  }
  return null;
};
window.__vbOrphanRe = /^[)?.,\]}”’]/;
window.__vbOneCharRe = /^[가-힣][)?.,!”’]*$/;
window.__vbOrphans = (R) => R.rows.slice(1).map((r, k) => ({ i: k + 1, r })).filter(({ r }) => window.__vbOrphanRe.test(r.text));
window.__vbOneChars = (R) => R.rows.slice(1).map((r, k) => ({ i: k + 1, r })).filter(({ r }) => window.__vbOneCharRe.test(r.text));
window.__vbSqueezeSteps = [[-0.01, 0], [0, -2], [-0.02, 0], [-0.01, -2], [0, -4], [-0.02, -2], [-0.03, 0], [0, -6], [-0.03, -4], [-0.04, 0], [-0.05, 0]];
window.__vbSqueezeLimit = { ratio: 0.90, spacing: -10 };
window.__vbOrphanPara = (lx, R, o) => {
  const ko = (s) => (s.match(/[가-힣]/g) || []).join("");
  const key = ko(R.rows[o.i - 1].text).slice(-3) + ko(o.r.text);
  const hbs = [...lx.matchAll(window.__vb.HBX)];
  const plain = (b) => ko(b.replace(/\$[^$]*\$/g, "").replace(/\\[A-Za-z]+\*?(\{[^{}]*\})?/g, ""));
  return hbs.find((h) => plain(h[4]).includes(key)) || hbs.find((h) => plain(h[4]).endsWith(ko(o.r.text))) || null;
};
window.__vbSqueezeApply = (lx, h, ra, sp) => {
  const at = lx.indexOf(h[0]); if (at < 0) return null;
  const before = lx.slice(0, at), sets = [...before.matchAll(/\\setmyfontspacing\{([\d.]+)\}\{(-?\d+)\}/g)], cur = sets[sets.length - 1];
  if (!cur) return null;
  const after = lx.slice(at + h[0].length), restore = after.trim() ? `\n\\setmyfontspacing{${cur[1]}}{${cur[2]}}` : "";
  return before + `\\setmyfontspacing{${ra}}{${sp}}\n` + h[0] + restore + after;
};
window.__vbSqueezeBase = (lx, h) => {
  const sets = [...lx.slice(0, lx.indexOf(h[0])).matchAll(/\\setmyfontspacing\{([\d.]+)\}\{(-?\d+)\}/g)], c = sets[sets.length - 1];
  return c ? [+c[1], +c[2]] : null;
};
window.__fixGW33Run = (msgs, { start, apply = false, pdfjs, wait = 2500 } = {}) => {
  const sleep = (t) => new Promise((r) => setTimeout(r, t));
  window.__job = { done: false, log: [], fix: [], left: [] };
  (async () => {
    try {
      if (!window.__vb.isB(msgs)) throw new Error(`${window.__K.nB} 파일만`);
      const lib = pdfjs || await window.__K.pdfjs(), W = window.__where(msgs, { start });
      const meta = msgs.find((m) => m.type === "meta"), done = msgs.find((m) => m.type === "done") || { type: "done" };
      const one = async (m) => {
        const mm = JSON.parse(JSON.stringify(m)); mm.index = 0; window.__clearRender(mm);
        window.__loadMessages([JSON.parse(JSON.stringify(meta)), mm, JSON.parse(JSON.stringify(done))], "one.json"); await sleep(wait);
        return window.__vbRendered(mm);
      };
      const worst = (r) => Math.max(0, ...((r && r.renderWarnings) || []).map((w) => w.overflowMM || 0));
      const over = async (r) => worst(r) > 0 || (await window.__lineFind(lib, r, "B")).some((f) => f[0] === "넘침");
      let seen = 0;
      for (const m of msgs) {
        if (!m.pdf || !m.latex || ["table", "title", "image"].includes(m.type) || /정답/.test(W[m.index] || "")) continue;
        let R = await window.__vbRows(lib, m), os = window.__vbOrphans(R);
        for (const o of window.__vbOneChars(R))
          (__job.cand = __job.cand || []).push({ where: W[m.index], index: m.index, rule: "GW33 후보", what: `'${R.rows[o.i - 1].text.slice(-8)} / ${o.r.text}' 한 글자만 다음 줄 — 장평·자간을 조금 줄이면 당겨질 수 있음` });
        if (!os.length) continue;
        seen += os.length;
        const failed = new Set();
        for (let guard = 0; guard < 6; guard++) {
          const o = window.__vbOrphans(R).find((x) => !failed.has(x.r.text + "|" + R.rows[x.i - 1].text.slice(-6)));
          if (!o) break;
          const h = window.__vbOrphanPara(m.latex, R, o), base = h && window.__vbSqueezeBase(m.latex, h);
          const fkey = o.r.text + "|" + R.rows[o.i - 1].text.slice(-6);
          if (!h || !base) { failed.add(fkey); __job.left.push(`${W[m.index]} '${o.r.text}' — 문단을 못 찾음(사람 확인)`); continue; }
          let ok = false;
          for (const [dr, ds] of window.__vbSqueezeSteps) {
            const ra = +(base[0] + dr).toFixed(2), sp = base[1] + ds;
            if (ra < window.__vbSqueezeLimit.ratio || sp < window.__vbSqueezeLimit.spacing) continue;
            const lx = window.__vbSqueezeApply(m.latex, h, ra, sp); if (!lx) break;
            const r = await one({ ...m, latex: lx });
            if (!r || !r.pdf) continue;
            const R2 = await window.__vbRows(lib, r);
            if (window.__vbOrphans(R2).length < window.__vbOrphans(R).length && R2.rows.length <= R.rows.length && !(await over(r))) {
              __job.fix.push({ where: W[m.index], index: m.index, rule: "GW33", before: `${R.rows[o.i - 1].text.slice(-8)} / ${o.r.text}`, what: `장평 ${base[0]}→${ra} · 자간 ${base[1]}→${sp} (그 문단만)` });
              if (apply) { m.latex = lx; Object.assign(m, { ...r, index: m.index }); }
              ok = true; R = R2; break;
            }
          }
          if (!ok) { failed.add(fkey); __job.left.push(`${W[m.index]} '${R.rows[o.i - 1].text.slice(-8)} / ${o.r.text}' — 장평 ${window.__vbSqueezeLimit.ratio} · 자간 ${window.__vbSqueezeLimit.spacing} 안에서 못 당김(사람 확인)`); }
          if (ok && !apply) break;
        }
        __job.log.push(`${W[m.index]} 끝`);
      }
      __job.log.unshift(`기호로 시작하는 줄 ${seen} · 당김 ${__job.fix.length} · 못 함 ${__job.left.length} · 한 글자 후보 ${(__job.cand || []).length}`);
    } catch (e) { __job.log.push("ERR " + e.message); }
    __job.done = true;
  })();
  return "started";
};
window.__vbHangMarks = (lx) => {
  const out = [];
  for (const h of lx.matchAll(window.__vb.HBX)) {
    const b = h[4].replace(/\$[^$]*\$/g, "x");
    const dash = /^(?:\\sffamily\s*)?\S{1,4}\s[^\\]{0,30}?\s-\s/.test(b), arrow = /\\Rightarrow|⇒/.test(h[4]);
    if (dash || arrow) out.push({ h, kind: dash ? "dash" : "arrow" });
  }
  return out;
};
window.__fixGW34Run = (msgs, { start, apply = false, pdfjs, wait = 2500 } = {}) => {
  const sleep = (t) => new Promise((r) => setTimeout(r, t));
  window.__job = { done: false, log: [], fix: [], left: [] };
  (async () => {
    try {
      if (!window.__vb.isB(msgs)) throw new Error(`${window.__K.nB} 파일만`);
      const lib = pdfjs || await window.__K.pdfjs(), W = window.__where(msgs, { start }), G = window.__vb;
      const meta = msgs.find((m) => m.type === "meta"), done = msgs.find((m) => m.type === "done") || { type: "done" };
      const render = async (m, latex) => {
        const mm = { ...JSON.parse(JSON.stringify(m)), index: 0, latex }; window.__clearRender(mm);
        window.__loadMessages([meta, mm, done].map((x) => JSON.parse(JSON.stringify(x))), "one.json"); await sleep(wait);
        return window.__vbRendered(mm);
      };
      for (const m of msgs) {
        if (!m.latex) continue;
        let lx = m.latex, changed = [];
        for (const { h, kind } of window.__vbHangMarks(lx)) {
          const pre = lx.slice(0, lx.indexOf(h[0])), font = [...pre.matchAll(/\\setmyfont(?:spacing|size)\{[^}]*\}\{[^}]*\}/g)].map((x) => x[0]).slice(-2);
          const tp = [...pre.matchAll(/\\TabPositions\{[^}]*\}/g)].pop();
          const r = await render(m, [...font, tp ? tp[0] : "", h[0]].filter(Boolean).join("\n") + "\n");
          if (!r || !r.pdf) { __job.left.push(`${W[m.index]} 렌더 실패`); continue; }
          const R = await window.__vbRows(lib, r);
          let target = null, at = -1, glued = false;
          const isMark = (t) => kind === "dash" ? /^[-−–]/.test(t) : /^⇒/.test(t);
          R.rows.some((row, i) => row.w.some((w, j) => {
            if (!isMark(w.t)) return false;
            glued = [...w.t].length > 1;
            target = glued ? w.x0 + (w.x1 - w.x0) / [...w.t].length : (row.w[j + 1] || {}).x0; at = i; return true;
          }));
          if (R.rows.length < 2 || (at >= 0 && at === R.rows.length - 1)) continue;
          if (target == null) { __job.left.push(`${W[m.index]} ${kind === "dash" ? "-" : "⇒"} 자리를 못 찾음(사람 확인)`); continue; }
          const after = R.rows.slice(at + 1);
          if (glued) { __job.left.push(`${W[m.index]} ${kind === "dash" ? "-" : "⇒"} 접힌 줄 ${Math.min(...after.map((x) => x.x0)).toFixed(1)}mm — 설명 첫 글자 어림 ${target.toFixed(1)}mm(표시와 글자가 한 조각이라 못 잼, 사람 확인)`); continue; }
          const cont = Math.min(...after.map((x) => x.x0)), N = +target.toFixed(1);
          if (Math.abs(cont - target) <= 0.2) continue;
          const segs = h[4].split(/\\hblinebreak\s*/), k = segs.findIndex((s) => kind === "arrow" ? /^\s*(?:\\sffamily\s*)?\$\\Rightarrow/.test(s) : false);
          let nh;
          if (kind === "arrow" && k > 0) {
            const sf = /^\s*\\sffamily/.test(h[4]) && !/^\s*\\sffamily/.test(segs[k]) ? "\\sffamily " : "";
            nh = `\\begin{hangblock}[${h[1] || "0mm"}]{${h[2]}}{${h[3]}}${segs.slice(0, k).join("\\hblinebreak\n")}\\end{hangblock}\n\\begin{hangblock}[${h[2]}]{${G.mm(N)}}{${h[3]}}${sf}${segs.slice(k).join("\\hblinebreak\n")}\\end{hangblock}`;
          } else nh = `\\begin{hangblock}[${h[1] || "0mm"}]{${G.mm(N)}}{${h[3]}}${h[4]}\\end{hangblock}`;
          lx = lx.replace(h[0], () => nh);
          changed.push(`${kind === "dash" ? "-" : "⇒"} 접힌 줄 ${cont.toFixed(1)} → ${N}mm(설명 첫 글자)`);
        }
        if (!changed.length) continue;
        const r = await render(m, lx), R = r && r.pdf ? await window.__vbRows(lib, r) : null;
        const over = r && Math.max(0, ...((r.renderWarnings || []).map((w) => w.overflowMM || 0))) > 0;
        if (!R || over) { __job.left.push(`${W[m.index]} 고친 뒤 렌더 실패·넘침 — 그대로(사람 확인)`); continue; }
        __job.fix.push({ where: W[m.index], index: m.index, rule: "GW34", what: changed.join(" · ") });
        if (apply) { m.latex = lx; Object.assign(m, { ...r, index: m.index }); }
      }
      __job.log.unshift(`고침 ${__job.fix.length} · 못 함 ${__job.left.length}`);
    } catch (e) { __job.log.push("ERR " + e.message); }
    __job.done = true;
  })();
  return "started";
};
window.__fixBRun = (msgs, { start, apply = false, pdfjs, wait = 2500 } = {}) => {
  const sleep = (t) => new Promise((r) => setTimeout(r, t));
  window.__job = { done: false, log: [], fix: [], left: [] };
  (async () => {
    try {
      const G = window.__vb, orig = JSON.parse(JSON.stringify(msgs));
      const work = apply ? msgs : JSON.parse(JSON.stringify(msgs));
      const lib = pdfjs || await window.__K.pdfjs();
      const meta = work.find((m) => m.type === "meta"), done = work.find((m) => m.type === "done") || { type: "done" };
      const one = async (m) => {
        const mm = JSON.parse(JSON.stringify(m)); mm.index = 0; window.__clearRender(mm);
        window.__loadMessages([JSON.parse(JSON.stringify(meta)), mm, JSON.parse(JSON.stringify(done))], "one.json"); await sleep(wait);
        return window.__vbRendered(mm);
      };
      const worst = (r) => Math.max(0, ...((r && r.renderWarnings) || []).map((w) => w.overflowMM || 0));
      const lineOver = async (r) => r && r.pdf ? (await window.__lineFind(lib, r, "B")).some((f) => f[0] === "넘침") : false;
      const W = window.__where(work, { start }), isB = G.isB(work);
      if (!isB && window.__K.key(work) !== "A") throw new Error(`업체 모름(meta.textbook=${G.vendor(work) || "없음"})`);
      const pre = isB ? window.__fixB(work, { apply: true, start })
        : { fix: [...window.__fixGW17(work, { apply: true, start }), ...(window.__fixCW31 ? window.__fixCW31(work, { apply: true, start }) : [])],
          render: work.filter((m) => window.__vbStepBlocks(m, { alignedOnly: true }).some((b) => b.rows.length > 1) || window.__vbDanFind(m, "A") || (m.latex && (window.__vbTailFind(m.latex).length || window.__vbCw31Find(m.latex).length || window.__vbSideFind(m.latex).length))).map((m) => ({ index: m.index })) };
      __job.fix.push(...pre.fix);
      __job.left.push(...(pre.ask || []).map((x) => `${x.where} ${x.before} — ${x.what}(사람 확인)`));
      __job.log.push(`렌더 없는 고침 ${pre.fix.length} · 렌더로 볼 곳 ${pre.render.length}${pre.ask && pre.ask.length ? ` · 문장 합칠지 확인 ${pre.ask.length}` : ""}`);
      const todo = new Set([...pre.fix.map((x) => x.index), ...pre.render.map((x) => x.index),
        ...(isB ? work.filter((m) => window.__vb37Cands(m).length).map((m) => m.index) : [])]);
      for (const m of work) {
        if (!todo.has(m.index) || !m.latex) continue;
        let r = m.pdf ? m : await one(m);
        if (!r || !r.pdf) { __job.left.push(`${W[m.index]} 렌더 실패`); continue; }
        for (let g = 0, f; isB && g < 5 && (f = window.__vb36Find(m, W[m.index])); g++) {
          const n0 = (await window.__vbRows(lib, r)).rows.length, t = await one({ ...m, latex: f.four });
          const fit = t && t.pdf && worst(t) === 0 && !(await lineOver(t)) && (await window.__vbRows(lib, t)).rows.length === n0 - 1;
          m.latex = fit ? f.four : f.tab; window.__clearRender(m);
          __job.fix.push({ where: W[m.index], index: m.index, rule: "GW36", what: `탭 빠진 단독 수식줄 ${f.before} → ${fit ? "앞 줄 끝에 4칸으로 붙임" : "4칸으로 안 들어가 줄 나눔 + 탭"}` });
          r = fit ? t : await one(m);
        }
        for (let g = 0, f; isB && g < 3 && window.__vb37Cands(m).length && (f = await window.__vb37Fix(m, r, { lib, one })); g++) {
          m.latex = f.latex; window.__clearRender(m); r = f.r;
          __job.fix.push({ where: W[m.index], index: m.index, rule: "GW37", what: `탭으로 민 수식 나열 접힘 → ${f.why}` });
        }
        for (let round = 0; round < 2; round++) {
          const R = await window.__vbRows(lib, r);
          const got = window.__fixBMeasure([meta, m], (x) => x === m ? R : null, { apply: true, start });
          got.forEach((g) => { g.where = W[m.index]; });
          __job.fix.push(...got.filter((g) => !g.skipped)); __job.left.push(...got.filter((g) => g.skipped).map((g) => `${g.where} ${g.what}`));
          if (!got.some((g) => !g.skipped)) break;
          r = await one(m);
        }
        if (isB && m.type !== "table" && (worst(r) > 0 || await lineOver(r))) {
          let ok = false;
          const cands = window.__vbCutCands(m, await window.__vbRows(lib, r));
          for (const c of cands.slice(0, 16)) {
            const t = await one({ ...m, latex: c.latex });
            if (worst(t) === 0 && !(await lineOver(t))) { __job.fix.push({ where: W[m.index], index: m.index, rule: "넘침", what: `${worst(r)}mm 넘침 → ${c.why}(후보 ${cands.indexOf(c) + 1}/${cands.length})` }); m.latex = c.latex; window.__clearRender(m); ok = true; r = t; break; }
          }
          if (!ok) __job.left.push(`${W[m.index]} 넘침 ${worst(r)}mm — 끊을 자리를 못 찾음(사람 확인)`);
          else {
            const R = await window.__vbRows(lib, r);
            const got = window.__fixBMeasure([meta, m], (x) => x === m ? R : null, { apply: true, start });
            __job.fix.push(...got.filter((g) => !g.skipped));
          }
        }
        __job.log.push(`${W[m.index]} 끝`);
      }
      window.__loadMessages(apply ? work : orig, apply ? "fixed.json" : "original.json");
      __job.log.push(apply ? "고친 msgs 를 페이지에 불러옴 — 💾 저장 전 사람 확인" : "미리보기 — 원래 msgs 를 다시 불러옴");
    } catch (e) { __job.log.push("ERR " + e.message); }
    __job.done = true;
  })();
  return "started";
};
(() => {
  const clear = (m) => window.__clearRender && window.__clearRender(m);
  const HBRE = /(\\begin\{hangblock\})(\[[^\]]*\])?\{([^}]*)\}\{([^}]*)\}([\s\S]*?)(\\end\{hangblock\})/g;
  const mm = (s) => parseFloat(s) || 0;
  const fmt = (x) => `${Math.round(x * 10) / 10}mm`;
  const topIdx = (s, test) => { let d = 0; for (let i = 0; i < s.length; i++) { const c = s[i]; if (c === "{") d++; else if (c === "}") d--; else if (d === 0 && test(s, i)) return i; } return -1; };
  const RE_TB = /\\(therefore|because)\s*(?:\\,){4,}(?!\s*&)/g;
  const fixA = (lx) => lx.replace(RE_TB, "\\$1 ~");
  const unwrap = (s) => { s = s.trim(); if (s.startsWith("{") && s.endsWith("}")) { let d = 0, ok = true; for (let i = 0; i < s.length; i++) { if (s[i] === "{") d++; else if (s[i] === "}") { d--; if (d === 0 && i < s.length - 1) { ok = false; break; } } } if (ok) return s.slice(1, -1).trim(); } return s; };
  const PRE = /^(?:\\sffamily |\\hspace\*\{[0-9.]+mm\}|\\qquad|\\tab|~|\s)*/;
  const parseSeg = (raw) => {
    let s = unwrap(raw);
    const pre = s.match(PRE)[0]; s = s.slice(pre.length);
    let label = "";
    const lb = s.match(/^\(([가-힣 ]+)\)\s*/); if (lb) { label = lb[1]; s = s.slice(lb[0].length); }
    const x = s.match(/^\{?\$([^$]*)\$\}?\s*(\\hbright\{[\s\S]*\})?\s*$/);
    if (!x) return null;
    return { pre, label, m: x[1].trim(), tail: x[2] || "", tab: /\\tab/.test(pre) };
  };
  const cw10Para = (b) => {
    if (!b.includes("\\hblinebreak") || b.includes("\\begin{aligned}")) return null;
    let pre = b.match(/^(?:\\sffamily |\\hspace\*\{[0-9.]+mm\}|\\qquad|~|\s)*/)[0];
    const segs = b.slice(pre.length).split(/\\hblinebreak\s*/).map(parseSeg);
    if (segs.some((s) => !s)) return null;
    const f = segs[0];
    if (f.pre.trim()) pre = pre + f.pre.replace(/\\tab\s*/g, "");
    const rest = segs.slice(1);
    const cont = rest.some((r) => /^(?:[+-]|\\times|\\cdot)/.test(r.m));
    let head;
    const rows = [];
    if (f.label) { if (!/^=/.test(f.m)) return null; rows.push(`\\text{(${f.label})}&${f.m}${f.tail}`); }
    else {
      const e = topIdx(f.m, (s, i) => s[i] === "="); if (e < 0) return null;
      if (cont) {
        const together = /\\qquad/.test(pre);
        pre = pre.replace(/\\qquad\s*/g, "");
        rows.push((together ? "\\qquad&" : "~~&") + f.m.slice(0, e).trim());
        rows.push((together ? "~~" : "") + "=&" + f.m.slice(e + 1).trim() + f.tail);
      } else rows.push(f.m.slice(0, e) + "&" + f.m.slice(e) + f.tail);
    }
    const two = cont && !f.label;
    for (let i = 0; i < rest.length; i++) {
      const r = rest[i];
      if (/^=/.test(r.m)) { rows.push(two ? (/\\qquad&/.test(rows[0]) ? "~~" : "") + "=&" + r.m.slice(1).trim() + r.tail : "&" + r.m + r.tail); continue; }
      if (/^(?:[+-]|\\times|\\cdot)/.test(r.m)) {
        const lastOfRun = !(rest[i + 1] && /^(?:[+-]|\\times|\\cdot)/.test(rest[i + 1].m));
        rows.push(lastOfRun ? `&\\hbright{$${r.m}$}` : `&\\hspace*{6mm}${r.m}${r.tail}`); continue;
      }
      return null;
    }
    return { body: pre + "$\\begin{aligned}" + rows.join("\\\\\n") + "\\end{aligned}$", two };
  };
  const splitGroups = (b) => {
    if (!b.includes("\\hblinebreak") || b.includes("\\begin{aligned}")) return null;
    const pre = b.match(/^(?:\\sffamily |\\hspace\*\{[0-9.]+mm\}|\\qquad|~|\s)*/)[0];
    const segs = b.slice(pre.length).split(/\\hblinebreak\s*/).map((s) => s.trim());
    if (!segs.some((s) => /^\{?\$[^$]*\$\}?\s*,\s*\{?\$[^$]*\$\}?$/.test(s))) return null;
    const groups = [[]]; let after = "";
    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      let x;
      if ((x = s.match(/^\{?\$([^$]*)\$\}?\s*,\s*\{?\$([^$]*)\$\}?$/))) { groups[groups.length - 1].push(x[1].trim() + "\\text{,}"); groups.push([x[2].trim()]); continue; }
      if (i === segs.length - 1 && (x = s.match(/^\{?\$([^$]*)\$\}?\s*([가-힣][^$\\]*)$/))) { groups[groups.length - 1].push(x[1].trim()); after = x[2].trim(); continue; }
      if ((x = s.match(/^\{?\$([^$]*)\$\}?$/))) { groups[groups.length - 1].push(x[1].trim()); continue; }
      return null;
    }
    const out = [];
    for (const g of groups) {
      let [lhsRow, ...rest] = g;
      let e = topIdx(lhsRow, (s, i) => s[i] === "=");
      if (e < 0 && rest.length && /^=/.test(rest[0])) { e = lhsRow.length; lhsRow = lhsRow + rest.shift(); }
      if (e < 0 || !rest.every((r) => /^=/.test(r))) return null;
      out.push("\\hspace*{0.01mm}\\qquad$\\begin{aligned}" + [lhsRow.slice(0, e) + "&" + lhsRow.slice(e), ...rest.map((r) => "&" + r)].join("\\\\\n") + "\\end{aligned}$");
    }
    if (after) out.push(after);
    return out;
  };
  const fixD = (lx, log) => lx.replace(HBRE, (all, a, F, b, c, body, z) => {
    const g = splitGroups(body);
    if (g) { log.push("D2"); return g.map((x) => a + (F || "") + `{${b}}{${c}}` + x + z).join("\n"); }
    const r = cw10Para(body); if (r === null) return all;
    log.push("D"); return a + (F || "") + `{${r.two ? "0mm" : b}}{${c}}` + r.body + z;
  });
  const fixG = (lx, log) => lx.replace(/\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/g, (all, inner) => {
    const rows = inner.split(/\\\\(?![A-Za-z])/);
    const r0 = rows[0].match(/^(\s*(?:~~|\\qquad)?\s*)&([\s\S]*)$/);
    if (!r0) return all;
    const e = topIdx(r0[2], (s, i) => s[i] === "=");
    if (e < 0 || !rows.slice(1).every((r) => /^\s*(?:~~)?=&/.test(r))) return all;
    log.push("G");
    const out = [r0[2].slice(0, e) + "&" + r0[2].slice(e), ...rows.slice(1).map((r) => r.replace(/^(\s*)(?:~~)?=&/, "$1&="))];
    return "\\begin{aligned}" + out.join("\\\\") + "\\end{aligned}";
  });
  const fixH = (lx, log) => lx.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (all, inner) => {
    if (!/[㉠-㉭]/.test(inner) || /\\hbright/.test(inner)) return all;
    const sp = /(?:\^\{\{\}\^\{\}\}|\{\}\^\{\{\}\^\{\}\}|\{\}_\{\{\}_\{\}\}|\\,|~|\s)*/;
    const rows = inner.split(/\\\\(?![A-Za-z])/).map((r) => r.trim()).filter((r) => r && !/^(?:\\,|\s)*$/.test(r));
    const out = [];
    for (const r of rows) {
      const x = r.match(new RegExp("^" + sp.source + "([\\s\\S]*?)\\s*&?\\s*" + sp.source + "\\\\cdots\\s*(?:\\\\,)?\\s*\\\\text\\{([㉠-㉭])\\}\\s*$"));
      if (!x) return all;
      out.push(`\\,${x[1].trim()} \\hbright{$\\cdots $ ${x[2]}}`);
    }
    log.push("H");
    return "\\begin{cases}" + out.join("\\\\") + "\\\\\n\\end{cases}";
  });
  const fixF = (m, log) => {
    const want = { analysis: ["3.8mm", "3.3mm"], conceptUp: ["3.8mm", "3.3mm"], explanation: ["4mm", "4.1mm"] }[m.type];
    if (!want) return m.latex;
    return m.latex.replace(HBRE, (all, a, F, N, C, body, z) => {
      if (N !== want[0] || !/^(?:\\sffamily |\\hspace\*\{[^}]*\}|\{|\s)*[①-⑳]/.test(body)) return all;
      log.push("F"); return a + (F || "") + `{${want[1]}}{${C}}` + body + z;
    });
  };
  const shiftHB = (lx, L) => lx.replace(HBRE, (all, a, F, N, C, body, z) => a + `[${fmt(Math.max(0, mm((F || "[0mm]").slice(1, -1)) - L))}]` + `{${fmt(Math.max(0, mm(N) - L))}}{${C}}` + body + z);
  const fixE = (msgs, log) => {
    const drop = new Set();
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      if (m.type !== "contents_D1" && m.type !== "analysis_D1") continue;
      const Ns = [...m.latex.matchAll(HBRE)].map((x) => mm(x[3]));
      let L = Math.min(...Ns);
      if ([12.9, 8.9, 8.5].some((w) => Math.abs(L - w) < 0.05)) {  }
      else if (L > 13.5) L = m.type === "contents_D1" ? 12.9 : 8.5;
      else continue;
      m.latex = shiftHB(m.latex, L); clear(m); log.push("E");
      for (let j = i + 1; j < msgs.length && msgs[j].type === "contents"; j++) {
        const hb = [...msgs[j].latex.matchAll(HBRE)];
        if (!hb.length || hb.some((x) => mm((x[2] || "[0mm]").slice(1, -1)) < L - 0.5 || x[4] !== "0")) break;
        const body = hb.map((x) => shiftHB(x[0], L)).join("\n");
        m.latex = m.latex.replace(/\s*$/, "\n" + body + "\n");
        drop.add(j); log.push("E+");
      }
    }
    if (!drop.size) return msgs;
    const keep = msgs.filter((_, i) => !drop.has(i));
    const map = new Map(); let k = 0;
    for (const m of keep) { if (m.type === "meta" || m.type === "done") continue; map.set(m.index, k); m.index = k++; }
    for (const m of keep) {
      if (m.sourceIndex != null && map.has(m.sourceIndex)) m.sourceIndex = map.get(m.sourceIndex);
      if (Array.isArray(m.children)) m.children.forEach((c) => { if (c && map.has(c.index)) c.index = map.get(c.index); });
      if (m.type === "meta" && m.totalCount != null) m.totalCount = k;
    }
    return keep;
  };
  const depthOps = (s, kind) => {
    const ops = []; let d = 0;
    for (let i = 0; i < s.length; i++) {
      if (s.startsWith("\\{", i)) { d++; i++; continue; }
      if (s.startsWith("\\}", i)) { d--; i++; continue; }
      const c = s[i];
      if ("{([".includes(c)) { if (kind === "prod" && d === 0 && i > 5 && s.slice(0, i).endsWith("\\left") && /\\right[)\]}]$|\\right\\\}$/.test(s.slice(0, i - 5))) ops.push(i - 5); d++; }
      else if ("})]".includes(c)) d--;
      else if (kind === "pm" && d === 0 && i > 0 && (c === "+" || c === "-") && !/[=&(,]\s*$/.test(s.slice(0, i))) ops.push(i);
      else if (kind === "times" && d === 0 && i > 0 && s.startsWith("\\times", i)) ops.push(i);
    }
    return ops;
  };
  window.__ovCandidates = (lx) => {
    const out = [];
    let hbIdx = -1;
    lx.replace(HBRE, (all, a, F, N, C, body, z, off) => {
      hbIdx++;
      const al = body.match(/\$\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}\$/);
      if (!al) {
        const segs = body.split(/\\hblinebreak\s*/);
        const pre0 = (segs[0].match(/^(?:\\sffamily |\\hspace\*\{[0-9.]+mm\}|\\qquad|~|\s)*/) || [""])[0];
        const rows = [], chains = [];
        for (let i = 0; i < segs.length; i++) {
          let s = unwrap(i === 0 ? segs[i].slice(pre0.length) : segs[i]);
          let lab = "";
          const lb = s.match(/^\s*\{?(?:\\fontsize\{[^}]*\}\{[^}]*\}\\selectfont\s*)?(\(\d+\)|[①-⑳])\s*\}?\s*/);
          if (lb) { lab = `\\text{${lb[1]} }`; s = s.slice(lb[0].length); }
          const x = s.match(/^\s*\{?\$([^$]*)\$\}?\s*$/); if (!x) { rows.length = 0; break; }
          const eqs = []; let d = 0;
          for (let j = 1; j < x[1].length; j++) { const c = x[1][j]; if (c === "{") d++; else if (c === "}") d--; else if (c === "=" && d === 0) eqs.push(j); }
          if (!eqs.length) { rows.length = 0; break; }
          const parts = [x[1].slice(0, eqs[0]), ...eqs.map((p, k) => x[1].slice(p, eqs[k + 1] ?? x[1].length))];
          chains.push({ lab, parts });
          rows.push(lab + parts[0].trimEnd() + "&" + parts[1].trim(), ...parts.slice(2).map((p) => "&" + p.trim()));
        }
        if (rows.length) {
          const mk = (rs, p0 = pre0, n = N) => lx.slice(0, off) + a + (F || "") + `{${n}}{${C}}` + p0 + "$\\begin{aligned}" + rs.join("\\\\\n") + "\\end{aligned}$" + z + lx.slice(off + all.length);
          out.push(mk(rows));
          if (chains.length === 1 && !chains[0].lab) {
            const [lhs, ...rhs] = chains[0].parts;
            const together = /\\qquad/.test(pre0);
            if (/^\s*\\therefore/.test(lhs)) out.push(mk(["\\therefore\\,\\,&" + lhs.replace(/^\s*\\therefore\s*(?:~|\\,)*/, "").trim(), ...rhs.map((p) => p.trim().replace(/^=/, "=&"))], pre0, "0mm"));
            else out.push(mk([(together ? "\\qquad&" : "~~&") + lhs.trim(), ...rhs.map((p) => (together ? "~~" : "") + p.trim().replace(/^=/, "=&"))], pre0.replace(/\\qquad\s*/, ""), "0mm"));
          }
          const split = rows.flatMap((r) => {
            const amp = r.indexOf("&"), rhs = r.slice(amp + 1), ops = depthOps(rhs, "pm");
            return ops.length ? [r.slice(0, amp + 1) + rhs.slice(0, ops[ops.length - 1]).trimEnd(), `&\\hbright{$${rhs.slice(ops[ops.length - 1]).trim()}$}`] : [r];
          });
          if (split.length > rows.length) out.push(mk(split));
        }
        const cuts = [];
        for (const c of body.matchAll(/\$\s*,(?:\s*(?:\\,|~))*\s*(?=\{?\$)/g)) cuts.push([c.index, c.index + c[0].length, "$,\\hblinebreak "]);
        for (const mt of body.matchAll(/\$([^$]+)\$/g)) {
          let d = 0;
          const t = mt[1];
          for (let j = 1; j < t.length - 1; j++) {
            const ch = t[j];
            if ("{([".includes(ch)) d++;
            else if ("})]".includes(ch)) d--;
            else if (ch === "," && d === 0 && t[j - 1] !== "\\")  { const st = mt.index + 1 + j; cuts.push([st, st + 1 + t.slice(j + 1).match(/^(?:\\,|~|\s)*/)[0].length, ",$\\hblinebreak $"]); }
          }
        }
        cuts.sort((x, y) => y[0] - x[0]).slice(0, 6).forEach(([st, en, rep]) =>
          out.push(lx.slice(0, off) + a + (F || "") + `{${N}}{${C}}` + body.slice(0, st) + rep + body.slice(en) + z + lx.slice(off + all.length)));
        return all;
      }
      const rows = window.__rowSplit(al[1]).filter((_, i) => i % 2 === 0).map((r) => r.replace(/^\n/, ""));
      const put = (newInner, newN, preFix) => {
        let nb = body.replace(al[0], "$\\begin{aligned}" + newInner + "\\end{aligned}$");
        if (preFix) nb = preFix(nb);
        out.push(lx.slice(0, off) + a + (F || "") + `{${newN ?? N}}{${C}}` + nb + z + lx.slice(off + all.length));
      };
      const r0 = rows[0].match(/^(\s*)([^&]*?)&(=[\s\S]*)$/);
      if (r0 && r0[2].trim() && rows.slice(1).every((r) => /^\s*&(?:=|\\hbright)/.test(r))) {
        const lhs = r0[2].trim();
        const together = /\\qquad\s*\{?\$\\begin\{aligned\}/.test(body) && !/^\\therefore/.test(lhs);
        const conv = (r) => r.replace(/^(\s*)&=/, (s, sp) => sp + (together ? "~~" : "") + "=&");
        let first;
        if (/^\\therefore/.test(lhs)) first = ["\\therefore\\,\\," + "&" + lhs.replace(/^\\therefore\s*(?:~|\\,)*/, ""), "=&" + r0[3].slice(1)];
        else first = [(together ? "\\qquad&" : "~~&") + lhs, (together ? "~~" : "") + "=&" + r0[3].slice(1)];
        const unq = /^\\therefore/.test(lhs) ? null : (nb) => nb.replace(/\\qquad\s*(\{?\$\\begin\{aligned\})/, "$1");
        put([...first, ...rows.slice(1).map(conv)].join("\\\\\n"), "0mm", unq);
      }
      rows.forEach((r, i) => {
        const amp = r.indexOf("&"); if (amp < 0) return;
        const rhs = r.slice(amp + 1);
        const e = topIdx(rhs.replace(/^=/, " "), (s, j) => s[j] === "=" && j > 0);
        if (e < 0) return;
        const lead = r.slice(0, amp + 1);
        const newLead = /=\s*&$/.test(lead) ? lead.replace(/^\s*(?:\\qquad)?/, (s) => (/\\qquad/.test(s) ? "~~" : s)) : "&";
        const nr = [...rows];
        nr.splice(i, 1, lead + rhs.slice(0, e).trimEnd(), newLead + (/=\s*&$/.test(lead) ? rhs.slice(e + 1).trim() : rhs.slice(e).trim()));
        put(nr.join("\\\\\n"));
      });
      const order = rows.map((r, i) => [r.length, i]).sort((x, y) => y[0] - x[0]).slice(0, 2);
      for (const [, i] of order) {
        const r = rows[i]; const amp = r.indexOf("&"); if (amp < 0) continue;
        const rhs = r.slice(amp + 1).replace(/\\hbright\{[\s\S]*\}\s*$/, "");
        const tail = r.slice(amp + 1).slice(rhs.length);
        for (const kind of ["pm", "prod", "times"]) {
          const ops = depthOps(rhs, kind);
          for (let k = 1; k <= Math.min(4, ops.length); k++) {
            const at = ops[ops.length - k];
            const moved = (kind === "prod" ? "\\times " : "") + rhs.slice(at).trim();
            const nr = [...rows];
            nr.splice(i, 1, r.slice(0, amp + 1) + rhs.slice(0, at).trimEnd() + tail, `&\\hbright{$${moved}$}`);
            put(nr.join("\\\\\n"));
          }
        }
      }
      return all;
    });
    const bal = (s) => { let d = 0; for (let i = 0; i < s.length; i++) { if (s[i] === "\\") { i++; continue; } d += (s[i] === "{") - (s[i] === "}"); if (d < 0) return false; } return d === 0; };
    const matBroken = (s) => [...s.matchAll(/\\pmat\[[^\]]*\]\{/g)].some((a) => {
      let d = 1, i = a.index + a[0].length;
      for (; i < s.length && d; i++) { if (s[i] === "\\") { i++; continue; } d += (s[i] === "{") - (s[i] === "}"); }
      return /\\hbright|\\hblinebreak/.test(s.slice(a.index + a[0].length, i - 1));
    });
    return out.filter((c) => bal(c) && !matBroken(c));
  };
  window.__qqCandidates = (lx) => {
    const out = [];
    for (const h of lx.matchAll(/(\\begin\{hangblock\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\})((?:\\sffamily\s*)?\\hspace\*\{0\.01mm\}\\qquad\s*)([^\n]*?)(\\end\{hangblock\})/g)) {
      const [all, head, pre, body, end] = h;
      if (/\\hblinebreak|\\begin\{aligned\}/.test(body)) continue;
      const gaps = [...body.matchAll(/\$\s*(?:,|또는|이고|이면)\s*(?=\{?\$)/g)].map((g) => g.index + g[0].length);
      gaps.reverse().forEach((at) => {
        const nb = head + pre + body.slice(0, at).trimEnd() + end + "\n" + head + pre + body.slice(at).trimStart() + end;
        out.push(lx.slice(0, h.index) + nb + lx.slice(h.index + all.length));
      });
    }
    return out;
  };
})();
window.__fixARun = (msgs, { start, apply = false, pdfjs, max = 12, wait = 2500 } = {}) => {
  const sleep = (t) => new Promise((r) => setTimeout(r, t));
  window.__job = { done: false, log: [], fix: [], left: [] };
  (async () => {
    try {
      if (window.__K.key(msgs) !== "A") throw new Error(`${window.__K.nA} 파일이 아님(meta.textbook=${(msgs.find((m) => m.type === "meta") || {}).textbook || "없음"})`);
      const orig = JSON.parse(JSON.stringify(msgs)), work = apply ? msgs : JSON.parse(JSON.stringify(msgs));
      const lib = pdfjs || await window.__K.pdfjs();
      const W = window.__where(work, { start });
      const meta = work.find((m) => m.type === "meta"), done = work.find((m) => m.type === "done") || { type: "done" };
      const one = async (lx, base) => {
        const mm = JSON.parse(JSON.stringify(base)); mm.latex = lx; mm.index = 0; window.__clearRender(mm);
        window.__loadMessages([meta, mm, done].map((x) => JSON.parse(JSON.stringify(x))), "one.json"); await sleep(wait);
        return (await window.__K.exportRendered()).messages.find((x) => x.index === 0);
      };
      const warn = (r) => Math.max(0, ...((r && r.renderWarnings) || []).map((w) => w.overflowMM || 0));
      const lines = async (r) => r && r.pdf ? (await window.__lineFind(lib, r, "A")).filter((f) => f[0] === "넘침" || ((f[0] === "4칸 빠짐" || f[0] === "수식 줄 시작") && r.type === "conceptUp")).length : 0;
      const targets = [];
      for (const m of work) {
        if (!m.latex || ["table", "title", "checkpoint"].includes(m.type) || (W[m.index] || "").includes("정답")) continue;
        const r = m.pdf ? m : await one(m.latex, m);
        if (!r || !r.pdf) { __job.left.push(`${W[m.index]} 렌더 실패`); continue; }
        if (warn(r) > 0 || await lines({ ...r, type: m.type })) targets.push(m);
      }
      __job.log.push(`넘친 메시지 ${targets.length}`);
      for (const m of targets) {
        const cands = [...(m.type === "conceptUp" && window.__qqCandidates ? window.__qqCandidates(m.latex) : []), ...window.__ovCandidates(m.latex)];
        let ok = null;
        for (let i = 0; i < cands.length && i < max; i++) {
          const r = await one(cands[i], m);
          if (r && r.pdf && warn(r) === 0 && !(await lines(r))) { ok = [i, cands[i], r]; break; }
        }
        if (ok) {
          m.latex = ok[1]; window.__clearRender(m); __job.fix.push({ where: W[m.index], index: m.index, rule: "넘침", what: `끊기·묶기 후보 ${ok[0] + 1}/${cands.length}` });
          if (window.__fixBMeasure && window.__vbRows) {
            const cp = JSON.parse(JSON.stringify(m)), R = await window.__vbRows(lib, ok[2]);
            const got = window.__fixBMeasure([meta, cp], (x) => x === cp ? R : null, { apply: true, start }).filter((g) => !g.skipped);
            if (got.length && got.every((g) => g.rule === "GW17")) { m.latex = cp.latex; window.__clearRender(m); got.forEach((g) => __job.fix.push({ ...g, where: W[m.index], rule: "CW24" })); }
          }
        }
        else __job.left.push(`${W[m.index]} 넘침 — 후보 ${cands.length}개로 못 풀었음(사람 확인)`);
        __job.log.push(`${W[m.index]} 끝`);
      }
      window.__loadMessages(apply ? work : orig, apply ? "fixed.json" : "original.json");
      __job.log.push(apply ? "고친 msgs 를 페이지에 불러옴 — 💾 저장 전 사람 확인" : "미리보기 — 원래 msgs 를 다시 불러옴");
    } catch (e) { __job.log.push("ERR " + e.message); }
    __job.done = true;
  })();
  return "started";
};
{
window.__eyeSyntax = (lx) => {
  const bad = [], s = String(lx || "");
  let d = 0, dollar = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "\\") { i++; continue; }
    if (c === "{") d++;
    else if (c === "}" && --d < 0) { bad.push(`닫는 중괄호가 남음(${i}째 글자 근처)`); d = 0; }
    else if (c === "$") dollar++;
  }
  if (d > 0) bad.push(`여는 중괄호 ${d}개가 안 닫힘`);
  if (dollar % 2) bad.push("$ 짝이 안 맞음");
  const env = [];
  for (const m of s.matchAll(/\\(begin|end)\{([^}]*)\}/g)) {
    if (m[1] === "begin") env.push(m[2]);
    else if (env.pop() !== m[2]) { bad.push(`\\end{${m[2]}} 짝이 안 맞음`); break; }
  }
  if (env.length) bad.push(`\\begin{${env.join(",")}} 이 안 닫힘`);
  const L = (s.match(/\\left(?![a-zA-Z])/g) || []).length, R = (s.match(/\\right(?![a-zA-Z])/g) || []).length;
  if (L !== R) bad.push(`\\left ${L}개 · \\right ${R}개`);
  for (const m of s.matchAll(/\\(w?frac|dfrac|tfrac)(?![a-zA-Z])\s*(\\[,;:!]|~)/g)) bad.push(`\\${m[1]} 바로 뒤에 ${m[2]} — 분자 자리가 비거나 밀림`);
  return bad;
};
window.__eyeWmm = (msgs) => ((msgs || []).find((m) => m.type === "meta")?.pageLayout?.columnWidthMM) || 85;
window.__eyeRender = async (lx, { wmm = 85, scale = 3 } = {}) => {
  const out = { ok: false, wmm };
  try {
    if (typeof globalThis.renderLatexToPdf !== "function") throw new Error("렌더 엔진이 아직 없음 — 페이지가 다 뜬 뒤 다시");
    const r = await globalThis.renderLatexToPdf(lx, wmm, null);
    out.hmm = Math.round(r.pageHmm * 100) / 100;
    const of = r.overfull; out.overfull = of && of.count > 0 ? Math.round((+of.maxMm || 0) * 100) / 100 : 0;
    out.png = await window.__eyePdfPng(r.pdf, scale);
    out.ok = true;
  } catch (e) { out.error = (e && e.message) || String(e); }
  return out;
};
window.__eyePdfPng = async (b64, scale = 3) => {
  const lib = window.__eyeLib || (window.__eyeLib = await window.__K.pdfjs());
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const doc = await lib.getDocument({ data: bin }).promise, pg = await doc.getPage(1), vp = pg.getViewport({ scale });
  const cv = document.createElement("canvas"); cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
  const g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height);
  await pg.render({ canvasContext: g, viewport: vp }).promise;
  doc.destroy();
  return cv.toDataURL("image/png");
};
window.__eyeTry = async (msgs, index, from, to) => {
  const m = msgs.find((x) => x.index === index);
  if (!m || !m.latex) return { block: "메시지 없음" };
  if (!m.latex.includes(from)) return { block: "찾을 글이 없음" };
  const wmm = window.__eyeWmm(msgs), lx = m.latex.replace(from, to);
  const before = await window.__eyeRender(m.latex, { wmm }), after = await window.__eyeRender(lx, { wmm });
  const s0 = window.__eyeSyntax(m.latex), s1 = window.__eyeSyntax(lx);
  before.syntax = s0; after.syntax = s1; after.latex = lx;
  const known = window.__eyeCmds && window.__eyeCmds.msgs === msgs ? window.__eyeCmds.set
    : (window.__eyeCmds = { msgs, set: new Set(msgs.flatMap((x) => (x.latex || "").match(/\\[a-zA-Z]+/g) || [])) }).set;
  const fresh = [...new Set(lx.match(/\\[a-zA-Z]+/g) || [])].filter((c) => !known.has(c));
  after.fresh = fresh;
  let block = "";
  if (s1.length > s0.length || s1.some((x) => !s0.includes(x))) block = "문법 짝: " + s1.filter((x) => !s0.includes(x)).join(" · ");
  else if (fresh.length) block = "이 파일에 없던 명령: " + fresh.join(" ") + " — 렌더가 말없이 무시할 수 있음";
  else if (!after.ok) block = "렌더 오류: " + after.error;
  else if (after.overfull > (before.overfull || 0)) block = `넘침 ${after.overfull}mm`;
  return { before, after, block };
};
const EYE_NOGLYPH = ["∖", "∕"];
window.__eyeRules = (msgs) => {
  const out = [];
  const arg = (s, i) => {
    let d = 0;
    for (let k = i; k < s.length; k++) { if (s[k] === "\\") { k++; continue; } if (s[k] === "{") d++; else if (s[k] === "}" && --d === 0) return k; }
    return -1;
  };
  for (const m of msgs) {
    const s = m.latex || "";
    for (const f of s.matchAll(/\\frac\\,\s*\{/g)) {
      const a0 = f.index + f[0].length - 1, a1 = arg(s, a0);
      if (a1 < 0) continue;
      const rest = s.slice(a1 + 1).match(/^\s*\\,\s*\{/);
      if (!rest) continue;
      const b0 = a1 + 1 + rest[0].length - 1, b1 = arg(s, b0);
      if (b1 < 0) continue;
      const from = s.slice(f.index, b1 + 1), to = `\\wfrac${s.slice(a0, a1 + 1)}${s.slice(b0, b1 + 1)}`;
      out.push({ index: m.index, kind: "깨짐", conf: "높음", src: "규칙", what: "분수가 깨짐 — 분수 명령 바로 뒤 작은 칸 때문에 분자 자리가 비고 분자가 밑으로 감", fix: "작은 칸을 빼고 \\wfrac{분자}{분모} 로", from, to });
    }
    const txt = s.replace(/\$[^$]*\$/g, "");
    for (const c of EYE_NOGLYPH) if (txt.includes(c))
      out.push({ index: m.index, kind: "깨짐", conf: "높음", src: "규칙", what: `글꼴에 없는 글자 ${c} — 빈 네모로 나옴`, fix: "수식 기호로 바꾸기(어떤 기호로 할지 사람이 정함)", from: c, to: "" });
  }
  return out;
};
window.__pageShot = async (pageEl, { scale = 1.5, pad = 24, as = "blob" } = {}) => {
  const P = pageEl.getBoundingClientRect();
  const W = Math.ceil((P.width + pad * 2) * scale), H = Math.ceil((P.height + pad * 2) * scale);
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const g = cv.getContext("2d");
  g.fillStyle = "#e9ecef"; g.fillRect(0, 0, W, H);
  g.scale(scale, scale); g.translate(pad - P.left, pad - P.top);
  const vis = (cs) => cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity !== 0;
  const els = [pageEl, ...pageEl.querySelectorAll("*")];
  for (const pass of [0, 1]) for (const el of els) {
    if (el.closest && el.closest("[data-eye-skip]")) continue;
    const cs = getComputedStyle(el); if (!vis(cs)) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (pass === 1) { await drawFg(el, cs, r); continue; }
    if (el === pageEl) { g.fillStyle = "#fff"; g.fillRect(r.left, r.top, r.width, r.height); }
    const bg = cs.backgroundColor;
    if (el !== pageEl && bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) { g.fillStyle = bg; g.fillRect(r.left, r.top, r.width, r.height); }
    const bi = cs.backgroundImage;
    if (bi && bi !== "none") {
      const u = (bi.match(/url\("?([^")]+)"?\)/) || [])[1];
      if (u) {
        const im = await new Promise((res) => { const x = new Image(); x.crossOrigin = "anonymous"; x.onload = () => res(x); x.onerror = () => res(null); x.src = u; });
        if (im) { try {
          const bs = cs.backgroundSize;
          if (/cover|100%|contain/.test(bs)) g.drawImage(im, r.left, r.top, r.width, r.height);
          else { const [bw, bh] = bs.split(" ").map(parseFloat); g.drawImage(im, r.left, r.top, bw || im.naturalWidth, bh || (bw ? im.naturalHeight * bw / im.naturalWidth : im.naturalHeight)); }
        } catch (e) {} }
      }
    }
  }
  async function drawFg(el, cs, r) {
    for (const [side, x0, y0, x1, y1] of [["Top", r.left, r.top, r.right, r.top], ["Bottom", r.left, r.bottom, r.right, r.bottom], ["Left", r.left, r.top, r.left, r.bottom], ["Right", r.right, r.top, r.right, r.bottom]]) {
      const w = parseFloat(cs["border" + side + "Width"]), st = cs["border" + side + "Style"];
      if (!w || st === "none" || st === "hidden") continue;
      g.strokeStyle = cs["border" + side + "Color"]; g.lineWidth = w; g.setLineDash(st === "dashed" ? [4, 3] : st === "dotted" ? [1, 2] : []);
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    }
    g.setLineDash([]);
    if (el.tagName === "CANVAS" && el.width && el.height) { try { g.drawImage(el, r.left, r.top, r.width, r.height); } catch (e) {  } }
    if (el.tagName === "IMG" && el.complete) { try { g.drawImage(el, r.left, r.top, r.width, r.height); } catch (e) {} }
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const rg = document.createRange();
      g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; g.fillStyle = cs.color; g.textBaseline = "alphabetic";
      const put = (s, q) => {
        const mt = g.measureText(s), A = mt.fontBoundingBoxAscent || mt.actualBoundingBoxAscent, Dd = mt.fontBoundingBoxDescent || mt.actualBoundingBoxDescent;
        const base = q.top + q.height * (A / Math.max(1, A + Dd)), sx = mt.width ? Math.min(1.25, Math.max(0.75, q.width / mt.width)) : 1;
        g.save(); g.translate(q.left, base); g.scale(sx, Math.min(1.25, Math.max(0.75, q.height / Math.max(1, A + Dd)))); g.fillText(s, 0, 0); g.restore();
      };
      const t = n.textContent;
      const re = /\S+/g; let mm;
      while ((mm = re.exec(t))) {
        rg.setStart(n, mm.index); rg.setEnd(n, mm.index + mm[0].length);
        const rs = [...rg.getClientRects()];
        if (rs.length === 1) { if (rs[0].width) put(mm[0], rs[0]); continue; }
        for (let i = 0; i < mm[0].length; i++) { rg.setStart(n, mm.index + i); rg.setEnd(n, mm.index + i + 1); const q = rg.getBoundingClientRect(); if (q.width) put(mm[0][i], q); }
      }
    }
  }
  g.strokeStyle = "#868e96"; g.lineWidth = 1; g.strokeRect(P.left, P.top, P.width, P.height);
  return as === "canvas" ? cv : await new Promise((res) => cv.toBlob(res, "image/png"));
};
const eyeSel = () => window.__K.c.sel;
const eyePages = () => { const s = eyeSel(), box = document.getElementById(s.preview);
  return box ? [...box.querySelectorAll("." + s.page)].filter((p) => !p.classList.contains(s.hidden) && p.getBoundingClientRect().width) : []; };
const eyeBoxEl = (index) => { const s = eyeSel(), box = document.getElementById(s.preview);
  return box && box.querySelector(`.${s.box}[${s.msgAttr}="${index}"]`); };
const sleep = (t) => new Promise((r) => setTimeout(r, t));
const SHOT = { scale: 1.5, pad: 24 };
async function eyeShotPage(pg) {
  pg.scrollIntoView({ block: "center" }); await sleep(700);
  const cv = await window.__pageShot(pg, { ...SHOT, as: "canvas" }), P = pg.getBoundingClientRect(), s = eyeSel();
  const boxes = [...pg.querySelectorAll(`.${s.box}[${s.msgAttr}]`)].map((b) => {
    const r = b.getBoundingClientRect(), k = SHOT.scale;
    return { index: +b.getAttribute(s.msgAttr), x: (r.left - P.left + SHOT.pad) * k, y: (r.top - P.top + SHOT.pad) * k, w: r.width * k, h: r.height * k };
  });
  return { png: cv.toDataURL("image/png"), w: cv.width, h: cv.height, boxes };
}
const eyeKey = (msgs) => {
  const m = msgs.find((x) => x.type === "meta") || {}, s = msgs.map((x) => `${x.type}:${x.label || ""}:${x.hasNum || ""}`).join(",");
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `eye:${m.part || ""}:${msgs.length}:${(h >>> 0).toString(36)}`;
};
const eyeSave = () => { const S = window.__eyeS; if (!S) return;
  try { localStorage.setItem(S.key, JSON.stringify(S.items.map(({ beforePng, afterPng, _baP, ...x }) => x))); localStorage.setItem(S.key + ":log", JSON.stringify(S.log || [])); } catch (e) {  } };
const eyeLoad = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; } };
const EYE_DROP = ["pdf", "svg", "hash", "segments", "blockPositions", "paragraphBreaks", "bacenters", "renderStatus", "renderWarnings", "height", "inlineImages", "imageData"];
const eyeLean = (msgs) => msgs.map((m) => { const o = { ...m }; for (const k of EYE_DROP) delete o[k];
  if (o.tableData && Array.isArray(o.tableData.cells)) o.tableData = { ...o.tableData, cells: o.tableData.cells.map((r) => (r || []).map((c) => { if (!c) return c; const q = { ...c }; for (const k of EYE_DROP) delete q[k]; return q; })) };
  return o; });
const eyeStart = (key, msgs) => {
  try { const s = localStorage.getItem(key + ":start"); if (s) return JSON.parse(s); } catch (e) {  }
  const lean = eyeLean(msgs); try { localStorage.setItem(key + ":start", JSON.stringify(lean)); } catch (e) {  }
  return lean;
};
window.__eyeRecordName = (msgs) => {
  const K = window.__K, k = K.key(msgs), meta = msgs.find((m) => m.type === "meta") || {};
  const part = k === "A" && meta.part === "문제" ? "본문" : meta.part || "파트모름";
  const d = new Date(), p2 = (n) => String(n).padStart(2, "0");
  return `눈검수기록_전달용_${k ? (k === "A" ? K.nA : K.nB) : "업체모름"}_${part}_${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}.json`;
};
window.__eyeRecord = async ({ download = true } = {}) => {
  const S = window.__eyeS; if (!S || !S.key) return "먼저 눈검수를 열기";
  const now = (await window.__K.exportRendered()).messages, name = window.__eyeRecordName(now);
  const rec = { kind: "눈검수기록", tool: (window.__kitCfg || {}).ver || "", at: new Date().toISOString(), name,
    summary: window.__eyeText(), items: S.items.map(({ beforePng, afterPng, _baP, _ba, _baK, ...x }) => x), log: S.log || [],
    start: S.start || null, end: eyeLean(now) };
  const txt = JSON.stringify(rec);
  if (download) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "application/json" })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
  return `${name} · ${Math.round(txt.length / 1024)}KB · 찾은 것 ${rec.items.length} · 적용 기록 ${rec.log.length}${rec.start ? "" : " · 주의: 켰을 때 JSON 없음"}`;
};
const eyeFind = ({ index, no, part, from }) => {
  const S = window.__eyeS;
  if (index != null) return S.msgs.find((m) => m.index === index);
  const n = String(no || "").padStart(4, "0"), W = (m) => S.where[m.index] || "";
  let cand = no ? S.msgs.filter((m) => W(m).includes(" " + n)) : [];
  if (part) { const c2 = (cand.length ? cand : S.msgs).filter((m) => W(m).includes(part)); if (c2.length) cand = c2; }
  return (from && cand.find((m) => (m.latex || "").includes(from))) || cand[0];
};
const eyePageOf = (index) => (window.__eyeS.pages || []).findIndex((p) => p && p.boxes.some((b) => b.index === index));
const EYE_GUIDE = `눈검수 — 쪽 그림을 책 보듯 보고, 자동 도구가 못 잡은 '사람이 고칠 만한 이상한 곳'을 찾는다.
보는 법: __eyePage(n) 으로 n쪽(폭 맞춤) → __eyeTo(1)·__eyeTo(2)·__eyeTo(3) 위/가운데/아래마다 화면을 찍어 본다. 의심 곳만 확대(zoom). 한 쪽 다 보면 다음 쪽.
볼 것: 1 띄어쓰기 벌어짐(수식 뒤 조사 앞 틈 등) 2 줄 시작 자리 어긋남(접힌 줄이 맨 왼쪽) 3 겹침·잘림·칸 밖 4 깨진 표시(명령어 글자·빈 네모·이상한 기호·분수 깨짐)
  5 튀는 글자(크기·굵기·장평) 6 수식 묶음 모양(= 세로줄·꼬리 오른쪽 끝) 7 선지·보기 배열 8 표·그림 9 줄이 . , ) ? 로 시작 10 같은 꼴 다른 처리 11 간격 12 그 밖에 조판하는 사람이 고칠 곳
안 볼 것: 어절이 줄 끝에서 쪼개짐 · 배치(빈 곳·문제가 다음 단/쪽으로) · 한 글자만 다음 줄 · 쪽 머리·꼬리표·아이콘·디자인 요소(유형 박스 제목 넘침 포함)
올리기: __eyeAdd({no:"0091", part:"풀이", what:"보이는 그대로 짧게", fix:"이렇게 고치면 됨", from:"원문 LaTeX 조각", to:"고친 조각", conf:"높음|중간|낮음", kind:"깨짐|새 꼴|간격"})
  no = 상자 위 4자리 화면 번호. 번호 없는 자리(유형 박스·개념)는 no 없이 part:"유형 12 박스". from 은 그 칸에 한 곳만 있게 앞뒤 글을 붙인다. from/to 를 모르면 빼도 된다(원문은 카드의 [전체 LaTeX] 로 사람이 본다). 원문 확인은 __eyeLatex("0091") .
  확실하지 않으면 '낮음'으로라도 올린다(사람이 고른다). 같은 꼴이 여러 번이면 전부.
잘못 올렸으면 __eyeDel(번호).
끝나면: __eyeList() 로 올린 것 확인 · 사람에게 "팝업 카드에서 판정·적용하세요"라고 알린다. 적용·[관리자용 기록 저장]은 사람이 누른다.`;
window.__eyeGuide = () => EYE_GUIDE;
window.__eyeOpen = ({ from = 1, to = 999 } = {}) => {
  const s = (window.__kitCfg || {}).sel || {};
  if (!s.preview) return "눈검수를 못 씀 — 북마크 '도구'가 옛것(미리보기 손잡이 설정 없음). 북마크를 새로 만들기";
  const S = window.__eyeS = window.__eyeS || {};
  if (S.busy) return "이미 뽑는 중 — " + S.msg;
  S.busy = true; S.msg = "준비 중"; S.mode = S.mode || {}; S.mine = S.mine || {}; S.full = S.full || {}; S.ba = S.ba || {}; S.items = S.items || [];
  eyeUI(); eyeBar();
  (async () => {
    try {
      const loading = () => document.getElementById(s.loading)?.classList.contains("on");
      for (let i = 0; i < 180 && loading(); i++) { S.msg = "미리보기 준비가 끝나기를 기다리는 중"; eyeBar(); await sleep(1000); }
      if (!eyePages().length) {
        S.msg = "미리보기 여는 중"; eyeBar();
        document.getElementById(s.previewBtn)?.click();
        for (let i = 0; i < 180 && (!eyePages().length || loading()); i++) await sleep(1000);
        if (!eyePages().length) throw new Error("미리보기가 안 열림 — 파일을 먼저 불러오기");
        await sleep(1500);
      }
      const msgs = (await window.__K.exportRendered()).messages, key = eyeKey(msgs);
      if (S.key !== key) {
        S.key = key; S.items = eyeLoad(key); S.cur = 0; S.zoom = "폭"; S.open = null;
        try { S.log = JSON.parse(localStorage.getItem(key + ":log") || "[]"); } catch (e) { S.log = []; }
        S.start = eyeStart(key, msgs);
        S.next = Math.max(0, ...S.items.map((x) => x.id)) + 1;
        for (const r of window.__eyeRules(msgs)) if (!S.items.some((x) => x.index === r.index && x.from === r.from)) S.items.push({ ...r, id: S.next++, verdict: "", memo: "" });
      }
      S.msgs = msgs; S.where = window.__where(msgs); S.wmm = window.__eyeWmm(msgs);
      for (const it of S.items) {
        it.where = S.where[it.index] || it.where || "";
        const m = msgs.find((x) => x.index === it.index);
        if (it.applied && !(m && (m.latex || "").includes(it.applied.to))) { it.applied = null; it.verdict = ""; it.err = "전에 적용했지만 지금 문서엔 없음(저장 전에 닫혔나?) — 다시 적용"; }
      }
      const pages = eyePages(), last = Math.min(to, pages.length);
      S.pages = S.pages && S.pages.length === pages.length ? S.pages : new Array(pages.length).fill(null);
      const t0 = Date.now();
      for (let i = from - 1; i < last; i++) { S.msg = `쪽 그림 ${i + 1} / ${last}`; eyeBar(); S.pages[i] = await eyeShotPage(pages[i]); if (i === S.cur) eyeShow(); }
      S.msg = `쪽 ${last - from + 1}장 · ${Math.round((Date.now() - t0) / 1000)}초`;
    } catch (e) { S.msg = "오류: " + e.message; }
    S.busy = false; eyeSave(); eyeShow(); eyeCards();
  })();
  return "started — 진행은 __eyeS.msg";
};
window.__eyePage = (n, zoom) => { const S = window.__eyeS; if (!S || !S.pages) return "먼저 __eyeOpen()";
  S.cur = Math.max(0, Math.min(S.pages.length - 1, n - 1)); if (zoom) S.zoom = zoom; eyeUI(); eyeShow(); eyeCards();
  const p = S.pages[S.cur]; return p ? `${S.cur + 1} / ${S.pages.length}쪽 · 상자 ${p.boxes.length}개 · 번호 ${eyeNos(p).join(" ")}` : "이 쪽 그림이 아직 없음"; };
window.__eyeTo = (k) => { const v = document.getElementById("__eyeView"); if (!v) return 0;
  v.scrollTop = k === 1 ? 0 : k === 2 ? (v.scrollHeight - v.clientHeight) / 2 : k === 3 ? v.scrollHeight : k; return Math.round(v.scrollTop); };
window.__eyeLatex = (no, part) => { const m = eyeFind({ no, part }); return m ? window.__show(`${window.__eyeS.where[m.index]}\n${m.latex}`) : "그 번호 없음"; };
window.__eyeAdd = (o) => {
  const S = window.__eyeS; if (!S || !S.msgs) return "먼저 __eyeOpen()";
  const m = eyeFind(o); if (!m) return `번호 ${o.no} 를 못 찾음`;
  if (o.from && !(m.latex || "").includes(o.from)) return `${S.where[m.index]} 에 그 글(from)이 없음 — __eyeLatex("${o.no}") 로 원문 확인`;
  if (o.from && m.latex.split(o.from).length > 2) return `${S.where[m.index]} 에 그 글(from)이 여러 곳 — 앞뒤 글을 더 붙여 한 곳만 맞게`;
  const it = { id: S.next++, index: m.index, where: S.where[m.index] || "", src: o.src || "AI", what: o.what || "", fix: o.fix || "", from: o.from || "", to: o.to || "",
    conf: o.conf || "중간", kind: o.kind || "새 꼴", verdict: "", memo: "" };
  S.items.push(it); eyeSave(); eyeCards(); eyeShow();
  return `#${it.id} ${it.where} 올림`;
};
window.__eyeDel = (id) => { const S = window.__eyeS, k = (S.items || []).findIndex((x) => x.id === id);
  if (k < 0) return "카드 없음"; if (S.items[k].applied) return "적용한 카드 — 먼저 되돌리기"; S.items.splice(k, 1); eyeSave(); eyeCards(); eyeShow(); return `#${id} 지움`; };
window.__eyeList = () => { const S = window.__eyeS; if (!S || !S.items) return "없음";
  return window.__show(S.items.map((x) => `#${x.id} ${x.where} · ${x.what} · ${x.src}/${x.conf} · ${x.verdict || "판정 전"}`).join("\n"), 8000); };
window.__eyeText = () => { const S = window.__eyeS; if (!S || !S.items) return "";
  const n = S.items.filter((x) => x.verdict === "반영 완료").length;
  return [`눈검수 결과 · 찾은 것 ${S.items.length} · 반영 ${n}`, ...S.items.map((x) => `- ${x.where} · ${x.what}` + (x.fix ? ` → ${x.fix}` : "")
    + ` · [${x.verdict || "판정 전"}]` + (x.memo ? ` 메모: ${x.memo}` : "") + (x.applied ? ` 적용: ${x.applied.mine ? "내 수정" : "추천대로"}` : "") + ` (${x.src}·${x.conf})`)].join("\n"); };
window.__eyeCopy = async () => { const t = window.__eyeText(); try { await navigator.clipboard.writeText(t); return "복사함"; } catch (e) { return t; } };
const eyeNos = (p) => [...new Set(p.boxes.map((b) => ((window.__eyeS.where[b.index] || "").match(/\d{4}/) || [])[0]).filter(Boolean))];
async function eyePick(index) {
  const el = eyeBoxEl(index); if (!el) throw new Error("미리보기에 그 상자가 없음");
  el.scrollIntoView({ block: "center" }); await sleep(500);
  const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + Math.min(20, r.height / 2);
  const ov = document.getElementById("__eyePop"); if (ov) ov.style.pointerEvents = "none";
  const ov0 = ov && ov.style.visibility; if (ov) ov.style.visibility = "hidden";
  const tgt = document.elementFromPoint(x, y) || el;
  if (ov) { ov.style.visibility = ov0; ov.style.pointerEvents = ""; }
  for (const t of ["pointerdown", "mousedown", "pointerup", "mouseup", "click"])
    tgt.dispatchEvent(new (t.startsWith("pointer") ? PointerEvent : MouseEvent)(t, { bubbles: true, cancelable: true, ctrlKey: true, clientX: x, clientY: y, button: 0, buttons: t.endsWith("down") ? 1 : 0 }));
  await sleep(700);
}
window.__eyeApply = async (id, { mine, whole } = {}) => {
  const S = window.__eyeS, it = S.items.find((x) => x.id === id); if (!it) return "카드 없음";
  S.msgs = (await window.__K.exportRendered()).messages;
  const cur = (S.msgs.find((x) => x.index === it.index) || {}).latex || "";
  const from = whole != null ? cur : it.from, to = whole != null ? whole : mine != null ? mine : it.to;
  if (!from || !to || from === to) return "고칠 글이 없음 — '내가 고친 것'에서 고치거나 판정을 '고쳐줘'로";
  const t = await window.__eyeTry(S.msgs, it.index, from, to);
  if (t.block) { it.err = "막음 — " + t.block; eyeCards(); return "막음: " + t.block; }
  await eyePick(it.index);
  const h = await window.__paneReplace(from, to);
  const after = (await window.__K.exportRendered()).messages.find((x) => x.index === it.index);
  if (!after || !after.latex.includes(to) || after.latex === cur) { it.err = "반영 안 됨: " + h; eyeCards(); return it.err; }
  it.applied = { from, to, mine: whole != null || mine != null, at: new Date().toISOString() }; it.verdict = "반영 완료"; it.err = "";
  (S.log = S.log || []).push({ act: "적용", id, where: it.where, index: it.index, how: it.applied.mine ? "내 수정" : "추천대로", from, to, at: it.applied.at });
  if (whole != null) delete S.mine[id];
  S.msgs = (await window.__K.exportRendered()).messages; eyeSave();
  await eyeReshot(it.index); eyeCards();
  return `#${id} 반영 완료 · ${h}`;
};
window.__eyeUndo = async (id) => {
  const S = window.__eyeS, it = S.items.find((x) => x.id === id); if (!it || !it.applied) return "적용한 것 없음";
  await eyePick(it.index);
  const h = await window.__paneReplace(it.applied.to, it.applied.from);
  (S.log = S.log || []).push({ act: "되돌림", id, where: it.where, index: it.index, from: it.applied.to, to: it.applied.from, at: new Date().toISOString() });
  it.applied = null; it.verdict = ""; S.msgs = (await window.__K.exportRendered()).messages; eyeSave();
  await eyeReshot(it.index); eyeCards();
  return `#${id} 되돌림 · ${h}`;
};
async function eyeReshot(index) {
  const S = window.__eyeS, k = eyePageOf(index), pages = eyePages();
  if (k < 0 || !pages[k]) return;
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true }));
  await sleep(1200); S.pages[k] = await eyeShotPage(pages[k]); if (k === S.cur) eyeShow();
}
const EYE_KIND = { "깨짐": "A", "새 꼴": "B", "간격": "C" };
const EYE_ST = [["고쳐줘", "fix"], ["아님", "no"], ["보류", "me"]];
const EYE_CSS = `#__eyePop{--bg:#eef1f4;--panel:#fff;--ink:#1d2733;--mute:#5d6b7a;--line:#d5dce4;--soft:#f5f7f9;--accent:#2f5d8a;--a:#c8372d;--b:#b7791f;--c:#64748b;--ok:#2f855a;--add:rgba(47,133,90,.16);--del:rgba(200,55,45,.14);--mark-a:rgba(200,55,45,.18);--mark-b:rgba(183,121,31,.2);--mark-c:rgba(100,116,139,.18);
  --sans:"Noto Sans KR","Malgun Gothic",system-ui,sans-serif;--mono:"IBM Plex Mono",Consolas,monospace;
  position:fixed;inset:10px;z-index:100001;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:8px;box-shadow:0 10px 36px rgba(0,0,0,.5);display:flex;flex-direction:column;font:14px/1.55 var(--sans);overflow:hidden}
@media (prefers-color-scheme:dark){#__eyePop{--bg:#141a21;--panel:#1c242d;--ink:#e3e8ee;--mute:#9aa8b6;--line:#2e3a46;--soft:#222c36;--accent:#7fb0e0;--a:#f0756b;--b:#e0a94a;--c:#94a3b8;--ok:#68c093;--add:rgba(104,192,147,.2);--del:rgba(240,117,107,.2);--mark-a:rgba(240,117,107,.25);--mark-b:rgba(224,169,74,.25);--mark-c:rgba(148,163,184,.22)}}
#__eyePop *{box-sizing:border-box}
#__eyePop .bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 12px;border-bottom:1px solid var(--line);background:var(--soft);font-size:13px}
#__eyePop .bar b{font-weight:700} #__eyePop .sp{flex:1} #__eyePop .note{color:var(--mute)} #__eyePop .toast{font-size:12px;color:var(--accent)}
#__eyePop .pill{display:inline-block;font-size:11px;font-weight:700;padding:1px 7px;border-radius:99px;color:#fff}
#__eyePop .pill.A{background:var(--a)} #__eyePop .pill.B{background:var(--b)} #__eyePop .pill.C{background:var(--c)}
#__eyePop .conf{font-size:11px;color:var(--mute)}
#__eyePop .main{display:grid;grid-template-columns:minmax(0,1fr) 8px var(--cw,400px);flex:1;min-height:0}
#__eyePop .mid{display:flex;flex-direction:column;min-width:0;min-height:0;background:var(--soft)}
#__eyePop .midtop{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:8px 12px;border-bottom:1px solid var(--line)}
#__eyePop .pages{display:flex;gap:4px;flex-wrap:wrap}
#__eyePop .pages span{font-size:12px;padding:1px 7px;border:1px solid var(--line);border-radius:4px;cursor:pointer;color:var(--mute);background:var(--panel)}
#__eyePop .pages span.on{border-color:var(--accent);color:var(--accent);font-weight:700} #__eyePop .pages span.has::after{content:" •";color:var(--a)}
#__eyePop .pages span.wait{opacity:.45}
#__eyePop .zoom{display:flex;gap:4px;align-items:center;font-size:12px;color:var(--mute)}
#__eyePop .zoom button{font:inherit;min-width:28px;height:26px;padding:0 6px;border:1px solid var(--line);border-radius:4px;background:var(--panel);color:var(--ink);cursor:pointer}
#__eyePop .zoom .z{min-width:46px;text-align:center}
#__eyeView{flex:1;overflow:auto;padding:14px}
#__eyeView .page{position:relative;margin:0 auto;background:#fff}
#__eyeView .page img{display:block;width:100%;height:auto}
#__eyeView .wait{padding:40px;color:var(--mute);text-align:center}
#__eyePop .mk{position:absolute;border:2px solid var(--a);background:var(--mark-a);border-radius:3px;cursor:pointer}
#__eyePop .mk.B{border-color:var(--b);background:var(--mark-b)} #__eyePop .mk.C{border-color:var(--c);background:var(--mark-c)}
#__eyePop .mk .pin{position:absolute;left:-11px;top:-11px;width:20px;height:20px;border-radius:50%;background:var(--a);color:#fff;font:700 11px/20px var(--sans);text-align:center}
#__eyePop .mk.B .pin{background:var(--b)} #__eyePop .mk.C .pin{background:var(--c)}
#__eyePop .mk.done{border:2px dashed var(--ok);background:transparent} #__eyePop .mk.done .pin{background:var(--ok)}
#__eyePop .mk.no{border-style:dotted;background:transparent;opacity:.6}
#__eyePop .mk.on{box-shadow:0 0 0 3px var(--accent);animation:eyeblink 1s ease 2}
@keyframes eyeblink{50%{box-shadow:0 0 0 6px transparent}}
#__eyePop .split{cursor:col-resize;background:var(--line);position:relative;touch-action:none}
#__eyePop .split::after{content:"";position:absolute;inset:45% 2px;border-left:2px dotted var(--mute);border-right:2px dotted var(--mute)}
#__eyePop .split:hover,#__eyePop .split.drag{background:var(--accent)}
#__eyePop .cards{overflow:auto;min-width:0;background:var(--panel)}
#__eyePop .empty{padding:24px 14px;color:var(--mute)}
#__eyePop .card{border-bottom:1px solid var(--line);padding:10px 12px;display:grid;gap:6px}
#__eyePop .card .hd{cursor:pointer;display:grid;gap:3px} #__eyePop .card.on{background:var(--soft);box-shadow:inset 3px 0 0 var(--accent)}
#__eyePop .card .body{display:none;gap:10px} #__eyePop .card.on .body{display:grid}
#__eyePop .card.done .hd{opacity:.62} #__eyePop .card.done.on .hd{opacity:1}
#__eyePop .top{display:flex;gap:6px;align-items:center;flex-wrap:wrap} #__eyePop .where{font-weight:700} #__eyePop .what{color:var(--ink);font-size:13.5px}
#__eyePop .num{font:700 11px/18px var(--sans);min-width:18px;height:18px;border-radius:50%;background:var(--mute);color:#fff;text-align:center}
#__eyePop .tick{width:18px;height:18px;border-radius:50%;background:var(--ok);color:#fff;font:700 11px/18px var(--sans);text-align:center}
#__eyePop .chip{font-size:11px;padding:0 6px;border-radius:4px;border:1px solid var(--line);color:var(--mute)}
#__eyePop .chip.s-fix{color:var(--accent);border-color:var(--accent)} #__eyePop .chip.s-me{color:var(--b);border-color:var(--b)} #__eyePop .chip.s-no{text-decoration:line-through}
#__eyePop .chip.s-done{color:var(--ok);border-color:var(--ok);font-weight:700}
#__eyePop .from{font-size:11px;padding:0 6px;border-radius:4px;background:var(--panel);border:1px solid var(--line);color:var(--mute)}
#__eyePop .from.rule{color:var(--ok);border-color:var(--ok)} #__eyePop .from.ai{color:var(--accent);border-color:var(--accent)}
#__eyePop .problem{border-left:4px solid var(--a);background:var(--panel);border-radius:4px;padding:10px 12px;display:grid;gap:8px}
#__eyePop .problem.B{border-left-color:var(--b)} #__eyePop .problem.C{border-left-color:var(--c)}
#__eyePop .problem .lab{font-size:11.5px;font-weight:700;color:var(--mute);letter-spacing:.04em}
#__eyePop .problem .q{font-size:15.5px;font-weight:700;line-height:1.5} #__eyePop .problem .fx{font-size:14.5px;line-height:1.55}
#__eyePop .k{font-size:12px;color:var(--mute);margin-bottom:3px;display:flex;gap:8px;align-items:center} #__eyePop .k button{margin-left:auto}
#__eyePop code{font-family:var(--mono);font-size:12.5px;background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:6px 8px;display:block;overflow-x:auto;white-space:pre-wrap;word-break:break-all;user-select:text}
#__eyePop .full{max-height:260px;overflow:auto}
#__eyePop .st,#__eyePop .tools{display:flex;gap:6px;flex-wrap:wrap}
#__eyePop button.s{font:inherit;font-size:12.5px;padding:4px 10px;border-radius:5px;border:1px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer}
#__eyePop button.s.go{border-color:var(--accent);color:var(--accent)} #__eyePop button.s[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
#__eyePop button.s:disabled{opacity:.45;cursor:not-allowed}
#__eyePop .btn{font:inherit;font-size:13px;padding:5px 12px;border-radius:5px;border:1px solid var(--accent);background:var(--accent);color:#fff;cursor:pointer}
#__eyePop .btn.ghost{background:transparent;color:var(--accent)}
#__eyePop .x{font:inherit;font-size:16px;width:32px;height:32px;border-radius:6px;border:1px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer}
#__eyePop textarea{font:inherit;width:100%;min-height:54px;border:1px solid var(--line);border-radius:5px;padding:6px 8px;background:var(--panel);color:var(--ink);resize:vertical}
#__eyePop textarea.mono{font-family:var(--mono);font-size:12.5px;min-height:150px}
#__eyePop .lint{font-size:12.5px;padding:6px 8px;border-radius:4px;border:1px solid var(--line)}
#__eyePop .lint.ok{color:var(--ok);border-color:var(--ok)} #__eyePop .lint.bad{color:var(--a);border-color:var(--a);background:var(--del)}
#__eyePop .ba{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
#__eyePop .ba figure{margin:0;display:grid;gap:4px} #__eyePop .ba figcaption{font-size:12px;color:var(--mute)}
#__eyePop .ba img,#__eyePop .ba canvas{width:100%;height:auto;border:1px solid var(--line);border-radius:4px;background:#fff;cursor:zoom-in}
#__eyePop .ph{border:1px dashed var(--line);border-radius:4px;display:grid;place-items:center;min-height:60px;padding:8px;font-size:12px;color:var(--mute);text-align:center;background:var(--panel)}
#__eyePop .diff div{padding:0 4px} #__eyePop .diff .d{background:var(--del)} #__eyePop .diff .a{background:var(--add)}
#__eyePop .diff .d::before{content:"− ";color:var(--a)} #__eyePop .diff .a::before{content:"+ ";color:var(--ok)}
#__eyePop .seg{display:inline-flex;border:1px solid var(--line);border-radius:6px;overflow:hidden}
#__eyePop .seg button{font:inherit;font-size:12.5px;border:0;padding:4px 10px;background:var(--panel);color:var(--ink);cursor:pointer}
#__eyePop .seg button[aria-pressed="true"]{background:var(--accent);color:#fff}
#__eyePop .donebar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:13px;color:var(--ok);font-weight:700}
#__eyePop .er{color:var(--a);font-size:12.5px;font-weight:700}
#__eyePop .prog{display:inline-block;width:70px;height:6px;border-radius:3px;background:var(--line);vertical-align:middle;overflow:hidden} #__eyePop .prog i{display:block;height:100%;background:var(--ok)}
#__eyePop .help{font-size:12px;color:var(--mute);padding:6px 12px;border-top:1px solid var(--line);background:var(--soft)}
#__eyeBig{position:fixed;inset:0;z-index:100002;background:rgba(10,14,20,.82);display:grid;place-items:center;padding:24px;cursor:zoom-out}
#__eyeBig img{max-width:96vw;max-height:88vh;background:#fff;border-radius:6px} #__eyeBig p{color:#fff;margin:8px 0 0;text-align:center;font:13px sans-serif}`;
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const eyeK = (it) => EYE_KIND[it.kind] || "B";
const eyeStCls = (it) => it.verdict === "반영 완료" ? "done" : ((EYE_ST.find((s) => s[0] === it.verdict) || [])[1] || "new");
const eyeToast = (m) => { const t = document.getElementById("__eyeToast"); if (t) t.textContent = m; };
const eyeDiff = (a, b) => {
  const A = a.split("\n"), B = b.split("\n"), SA = new Set(A), SB = new Set(B), out = []; let i = 0, j = 0;
  while (i < A.length || j < B.length) {
    if (i < A.length && j < B.length && A[i] === B[j]) { out.push(`<div>${esc(A[i])}</div>`); i++; j++; }
    else if (i < A.length && !SB.has(A[i])) out.push(`<div class="d">${esc(A[i++])}</div>`);
    else if (j < B.length && !SA.has(B[j])) out.push(`<div class="a">${esc(B[j++])}</div>`);
    else { if (i < A.length) out.push(`<div class="d">${esc(A[i++])}</div>`); if (j < B.length) out.push(`<div class="a">${esc(B[j++])}</div>`); }
  }
  return out.join("");
};
const eyeMsg = (it) => ((window.__eyeS.msgs || []).find((x) => x.index === it.index) || {});
function eyeUI() {
  let ov = document.getElementById("__eyePop");
  if (ov) { ov.style.display = "flex"; return ov; }
  if (!document.getElementById("__eyeCss")) { const st = document.createElement("style"); st.id = "__eyeCss"; st.textContent = EYE_CSS; document.head.appendChild(st); }
  ov = document.createElement("div"); ov.id = "__eyePop";
  ov.innerHTML = `<div class="bar"><b>👁 눈검수</b><span id="__eyeFile"></span><span id="__eyeMsg" class="note"></span><span class="sp"></span>
  <span id="__eyeToast" class="toast" role="status"></span><span id="__eyeCnt" class="note"></span>
  <button class="btn ghost" data-a="redo" type="button" title="쪽 그림을 다시 뽑고 규칙 추천을 다시 봄(고친 뒤 뒤 쪽이 밀렸을 때도)">다시 검수</button>
  <button class="btn ghost" data-a="rec" type="button" title="켰을 때·지금 JSON(그림 뺀 LaTeX 판) + 찾은 것·판정·메모·적용 기록을 파일 하나로 내려받기 — 관리자에게 전달">관리자용 기록 저장</button>
  <button class="btn" data-a="copy" type="button" title="찾은 것 · 판정 · 메모를 글로 복사 — 메신저나 AI 대화에 붙여 넣기">결과 글로 복사</button>
  <button class="x" data-a="close" type="button" title="닫기 — 찾은 것·판정은 남음(오른쪽 아래 [👁 눈검수]로 다시 열기)">✕</button></div>
<div class="main"><div class="mid"><div class="midtop"><div class="pages" id="__eyePages"></div><span class="sp"></span>
  <div class="zoom"><button data-z="-1" type="button" title="축소">−</button><span class="z" id="__eyeZ"></span><button data-z="1" type="button" title="확대">+</button>
  <button data-z="w" type="button" title="쪽 폭에 맞춤 — 글이 또렷">폭 맞춤</button><button data-z="h" type="button" title="쪽 전체">쪽 전체</button><span>Ctrl+휠</span></div></div>
  <div id="__eyeView"></div></div>
<div class="split" role="separator" aria-orientation="vertical" title="끌어서 카드 줄 폭 바꾸기"></div><div class="cards" id="__eyeCards"></div></div>
<div class="help">상자 위 번호 = 카드 번호 · 카드를 누르면 펼쳐지고 쪽이 그 자리로 · 적용은 청크 LaTeX 창으로 들어가고(되돌리기 됨) 끝나면 💾 저장은 따로 · 결과 글로 복사 = 메신저나 AI 대화에 붙이기</div>`;
  document.body.appendChild(ov);
  ov.addEventListener("click", eyeClick);
  ov.addEventListener("input", eyeInput);
  ov.addEventListener("change", (e) => { const id = +(e.target.dataset.memo || 0); if (id) { const it = window.__eyeS.items.find((x) => x.id === id); if (it) { it.memo = e.target.value; eyeSave(); } } });
  const view = ov.querySelector("#__eyeView"), S = window.__eyeS;
  view.addEventListener("wheel", (e) => { if (!e.ctrlKey) return; e.preventDefault(); S.zoom = Math.max(0.2, Math.min(4, eyeScale() * (e.deltaY < 0 ? 1.1 : 0.9))); eyeShow(); }, { passive: false });
  const sl = ov.querySelector(".split");
  sl.addEventListener("pointerdown", (e) => { sl.setPointerCapture(e.pointerId); sl.classList.add("drag");
    const mv = (ev) => ov.style.setProperty("--cw", Math.max(280, Math.min(innerWidth * 0.75, ov.getBoundingClientRect().right - ev.clientX)) + "px");
    sl.addEventListener("pointermove", mv); sl.addEventListener("pointerup", () => { sl.removeEventListener("pointermove", mv); sl.classList.remove("drag"); }, { once: true }); });
  return ov;
}
function eyeBar() {
  const S = window.__eyeS; if (!document.getElementById("__eyePop")) return;
  const N = (S.items || []).length, n = (S.items || []).filter((x) => x.verdict === "반영 완료" || x.verdict === "아님").length;
  document.getElementById("__eyeMsg").textContent = S.busy ? "⏳ " + S.msg : S.msg || "";
  document.getElementById("__eyeFile").textContent = S.where ? `${(S.msgs.find((m) => m.type === "meta") || {}).part || ""} · ${S.pages ? S.pages.length : 0}쪽` : "";
  document.getElementById("__eyeCnt").innerHTML = N ? `<span class="prog"><i style="width:${n / N * 100}%"></i></span> 해결 ${n} / ${N}` : "";
  const has = new Set((S.items || []).map((x) => eyePageOf(x.index)));
  document.getElementById("__eyePages").innerHTML = (S.pages || []).map((p, i) => `<span data-page="${i}" class="${i === S.cur ? "on " : ""}${has.has(i) ? "has " : ""}${p ? "" : "wait"}">${i + 1}</span>`).join("");
}
const eyeScale = () => { const S = window.__eyeS, p = S.pages && S.pages[S.cur], v = document.getElementById("__eyeView");
  if (!p || !v) return 1; if (typeof S.zoom === "number") return S.zoom;
  return S.zoom === "쪽" ? (v.clientHeight - 30) / p.h : (v.clientWidth - 46) / p.w; };
function eyeShow() {
  const S = window.__eyeS, v = document.getElementById("__eyeView"); if (!v) return;
  eyeBar();
  const p = S.pages && S.pages[S.cur];
  if (!p) { v.innerHTML = `<div class="wait">${S.busy ? "쪽 그림 뽑는 중…" : "쪽 그림 없음 — [다시 검수]"}</div>`; return; }
  const k = eyeScale(); document.getElementById("__eyeZ").textContent = Math.round(k / ((v.clientWidth - 46) / p.w) * 100) + "%";
  const marks = (S.items || []).map((it) => { const b = p.boxes.find((x) => x.index === it.index); if (!b) return "";
    const st = eyeStCls(it);
    return `<div class="mk ${eyeK(it)}${st === "done" ? " done" : st === "no" ? " no" : ""}${S.open === it.id ? " on" : ""}" data-id="${it.id}" title="${esc(it.where + " · " + it.what)}" style="left:${b.x * k}px;top:${b.y * k}px;width:${b.w * k}px;height:${b.h * k}px"><span class="pin">${st === "done" ? "✓" : it.id}</span></div>`; }).join("");
  const top = v.scrollTop;
  v.innerHTML = `<div class="page" style="width:${p.w * k}px"><img alt="${S.cur + 1}쪽 그림" src="${p.png}">${marks}</div>`;
  v.scrollTop = top;
  if (S.goSel) { S.goSel = false; const it = S.items.find((x) => x.id === S.open), b = it && p.boxes.find((x) => x.index === it.index); if (b) v.scrollTop = Math.max(0, b.y * k - 60); }
}
function eyeCards() {
  const S = window.__eyeS, box = document.getElementById("__eyeCards"); if (!box) return;
  eyeBar();
  const keep = box.scrollTop;
  const list = S.items || [];
  box.innerHTML = list.length ? list.map(eyeCard).join("") : `<div class="empty">${S.busy ? "쪽 그림을 뽑는 중…" : "찾은 것 없음 — 크롬 AI 에게 \"눈검수 해줘\"라고 하면 찾아서 여기 올립니다."}</div>`;
  box.scrollTop = keep;
  const it = list.find((x) => x.id === S.open); if (it) eyeBA(it);
}
function eyeCard(it) {
  const S = window.__eyeS, on = S.open === it.id, st = eyeStCls(it), m = eyeMsg(it), lx = m.latex || "";
  const stName = it.verdict || "새로 찾음", src = it.src === "규칙" ? ["rule", "규칙 추천"] : ["ai", "AI 판단 추천"];
  const head = `<div class="hd" data-id="${it.id}"><div class="top">${st === "done" ? '<span class="tick">✓</span>' : `<span class="num">${it.id}</span>`}<span class="pill ${eyeK(it)}">${esc(it.kind)}</span><span class="where">${esc(it.where)}</span><span class="conf">확신 ${esc(it.conf)}</span><span class="from ${src[0]}">${src[1]}</span><span class="chip s-${st}">${esc(stName)}</span></div><div class="what">${esc(it.what)}</div></div>`;
  if (!on) return `<div class="card${st === "done" ? " done" : ""}">${head}</div>`;
  const key = it.applied ? it.applied.to : it.from, at = key && key.length < 400 ? lx.indexOf(key) : -1;
  const part = at >= 0 ? (at > 50 ? "…" : "") + lx.slice(Math.max(0, at - 50), at + key.length + 50) + (at + key.length + 50 < lx.length ? "…" : "") : "";
  const mode = S.mode[it.id] || (it.to ? "ai" : "mine");
  let ba = "";
  if (S.ba[it.id] !== false) {
    const seg = `<div class="seg"><button type="button" data-mode="ai" data-id="${it.id}" aria-pressed="${mode === "ai"}">AI 추천대로</button><button type="button" data-mode="mine" data-id="${it.id}" aria-pressed="${mode === "mine"}">내가 고친 것</button></div>`;
    if (it.applied) ba = `<div class="ba"><figure><figcaption>전(적용 전)</figcaption><img data-b="before" alt="적용 전"></figure><figure><figcaption>후(지금 — ${it.applied.mine ? "내가 고친 것" : "추천대로"})</figcaption><img data-b="after" alt="지금"></figure></div>
      <div><div class="k">바뀐 LaTeX</div><div class="code diff">${eyeDiff(it.applied.from, it.applied.to)}</div></div>`;
    else if (mode === "ai") ba = `<div>${seg}</div>` + (it.to ? `<div class="ba"><figure><figcaption>전(지금)</figcaption><img data-b="before" alt="지금"></figure><figure><figcaption>후(추천 LaTeX 렌더)</figcaption><img data-b="after" alt="추천대로"></figure></div>
        <div><div class="k">바뀌는 LaTeX</div><div class="code diff">${eyeDiff(it.from, it.to)}</div></div>
        <div class="tools"><button class="s go" type="button" data-apply="ai" data-id="${it.id}">이대로 적용</button><button class="s go" type="button" data-apply="ai-next" data-id="${it.id}">적용하고 다음</button><button class="s" type="button" data-st="고쳐줘" data-id="${it.id}">나중에 모아서(고쳐줘)</button></div>`
      : `<div class="ba"><figure><figcaption>전(지금 쪽 그림)</figcaption><canvas data-crop="${it.id}"></canvas></figure></div><div class="ph">추천 없음 — '내가 고친 것'으로 직접 고치거나 판정에서 고쳐줘(메모에 원하는 모양)</div>`);
    else {
      const v = S.mine[it.id] != null ? S.mine[it.id] : lx, bad = window.__eyeSyntax(v), same = v === lx;
      ba = `<div>${seg}</div><div><div class="k">이 청크 LaTeX — 직접 고쳐 보기 (선택된 곳 = 해당 부분)<button class="s" type="button" data-goto="${it.id}">해당 부분으로</button></div><textarea class="mono" data-mine="${it.id}">${esc(v)}</textarea></div>
        <div data-lint="${it.id}">${eyeLint(bad)}</div>
        <div><div class="k">원본과 다른 곳</div><div class="code diff" data-mdiff="${it.id}">${same ? "<div>아직 바뀐 곳 없음</div>" : eyeDiff(lx, v)}</div></div>
        <div class="ba"><figure><figcaption>전</figcaption><img data-b="before" alt="지금"></figure><figure><figcaption>후(고친 LaTeX 렌더)</figcaption><img data-b="mine" alt="내가 고친 것"></figure></div>
        <div class="tools"><button class="s go" type="button" data-apply="mine" data-id="${it.id}"${bad.length || same ? " disabled" : ""}>내 수정 적용</button><button class="s go" type="button" data-apply="mine-next" data-id="${it.id}"${bad.length || same ? " disabled" : ""}>적용하고 다음</button><button class="s" type="button" data-reset="${it.id}">원래대로</button></div>`;
    }
  }
  return `<div class="card on${st === "done" ? " done" : ""}">${head}<div class="body">
    <div class="problem ${eyeK(it)}"><div><div class="lab">무엇이 문제인가</div><div class="q">${esc(it.what)}</div></div>
      ${it.fix ? `<div><div class="lab">이렇게 고치면 됩니다 <span class="from ${src[0]}">${src[1]}</span></div><div class="fx">${esc(it.fix)}</div></div>` : ""}</div>
    ${part ? `<div><div class="k">원문 LaTeX (해당 부분)<button class="s" type="button" data-copy="src" data-id="${it.id}">복사</button></div><code>${esc(part)}</code></div>` : ""}
    <div class="tools"><button class="s" type="button" data-full="${it.id}" aria-pressed="${!!S.full[it.id]}">전체 LaTeX(이 청크)</button><button class="s" type="button" data-ba="${it.id}" aria-pressed="${S.ba[it.id] !== false}">전/후 보기</button></div>
    ${S.full[it.id] ? `<div><div class="k">이 청크 전체 LaTeX<button class="s" type="button" data-copy="full" data-id="${it.id}">복사</button></div><code class="full">${esc(lx)}</code></div>` : ""}
    ${it.err ? `<div class="er">${esc(it.err)}</div>` : ""}
    ${ba}
    <div><div class="k">판정</div>${it.verdict === "반영 완료" ? `<div class="donebar">✓ 반영 완료 (${it.applied && it.applied.mine ? "내가 고친 것" : "추천대로"})<button class="s" type="button" data-undo="${it.id}">되돌리기</button></div>`
      : `<div class="st">${EYE_ST.map(([n]) => `<button class="s" type="button" data-st="${n}" data-id="${it.id}" aria-pressed="${it.verdict === n}">${n}</button>`).join("")}</div>`}</div>
    <div><div class="k">메모 (AI·관리자에게)</div><textarea data-memo="${it.id}" placeholder="예: 여기는 탭 하나만 / 원고가 원래 이래요">${esc(it.memo)}</textarea></div>
  </div></div>`;
}
const eyeLint = (bad) => bad.length ? `<div class="lint bad">✗ 적용할 수 없음 — ${esc(bad.join(" · "))}</div>` : `<div class="lint ok">✓ 문법 짝 맞음 · 적용 전에 렌더로 한 번 더 확인(넘침·처음 보는 명령은 막음)</div>`;
async function eyeClick(e) {
  const S = window.__eyeS, t0 = e.target;
  if (t0.closest(".ba img, .ba canvas")) { const el = t0.closest("img, canvas"), src = el.tagName === "IMG" ? el.src : el.toDataURL();
    if (!src) return; const bg = document.createElement("div"); bg.id = "__eyeBig"; bg.innerHTML = `<div><img src="${src}"><p>${esc(el.closest("figure").querySelector("figcaption").textContent)} · 누르면 닫기</p></div>`; bg.onclick = () => bg.remove(); document.body.appendChild(bg); return; }
  const t = t0.closest("[data-a],[data-page],[data-z],[data-st],[data-full],[data-ba],[data-mode],[data-copy],[data-goto],[data-apply],[data-reset],[data-undo],.mk,.hd"); if (!t) return;
  if (t.classList.contains("hd") && String(window.getSelection()).trim()) return;
  const d = t.dataset, a = d.a, id = +(d.id || d.undo || d.full || d.ba || d.goto || d.reset || 0), it = S.items.find((x) => x.id === id);
  if (a === "close") { document.getElementById("__eyePop").style.display = "none"; return; }
  if (a === "rec") { eyeToast("기록 묶는 중…"); eyeToast("내려받음: " + await window.__eyeRecord()); return; }
  if (a === "copy") { eyeToast(await window.__eyeCopy() === "복사함" ? "결과 글 복사함" : "복사가 막혀 있음 — __eyeText() 결과를 쓰기"); return; }
  if (a === "redo") { S.pages = null; S.key = null; window.__eyeOpen(); return; }
  if (t.dataset.page != null) { S.cur = +t.dataset.page; eyeShow(); return; }
  if (t.dataset.z) { const z = t.dataset.z; S.zoom = z === "w" ? "폭" : z === "h" ? "쪽" : Math.max(0.2, Math.min(4, eyeScale() * (z === "1" ? 1.25 : 0.8))); eyeShow(); return; }
  if (!it) return;
  if (t.classList.contains("mk") || t.classList.contains("hd")) {
    S.open = S.open === id && t.classList.contains("hd") ? null : id;
    const k = eyePageOf(it.index); if (k >= 0) S.cur = k; S.goSel = true; eyeShow(); eyeCards();
    if (t.classList.contains("mk")) document.querySelector(`#__eyeCards .card.on`)?.scrollIntoView({ block: "nearest" });
    return;
  }
  if (t.dataset.st) { it.verdict = it.verdict === t.dataset.st ? "" : t.dataset.st; eyeSave(); eyeShow(); eyeCards(); return; }
  if (t.dataset.full) { S.full[id] = !S.full[id]; eyeCards(); return; }
  if (t.dataset.ba) { S.ba[id] = S.ba[id] === false; eyeCards(); return; }
  if (t.dataset.mode) { S.mode[id] = t.dataset.mode; eyeCards(); if (t.dataset.mode === "mine") eyeGoto(it, false); return; }
  if (t.dataset.goto) { eyeGoto(it, true); return; }
  if (t.dataset.reset) { delete S.mine[id]; it._mine = null; eyeCards(); return; }
  if (t.dataset.copy) { const lx = eyeMsg(it).latex || "", key = it.applied ? it.applied.to : it.from;
    try { await navigator.clipboard.writeText(t.dataset.copy === "full" ? lx : key); eyeToast(t.dataset.copy === "full" ? "전체 LaTeX 복사함" : "원문 복사함"); } catch (err) { eyeToast("복사가 막혀 있음 — 글을 드래그해서 복사"); } return; }
  t.disabled = true; const old = t.textContent; t.textContent = "확인 중…";
  let r = "";
  try {
    if (t.dataset.apply) r = await window.__eyeApply(id, /mine/.test(t.dataset.apply) ? { whole: S.mine[id] } : {});
    else if (t.dataset.undo) r = await window.__eyeUndo(id);
  } catch (err) { r = "멈춤: " + err.message; it.err = r; }
  eyeToast(r);
  if (/next/.test(t.dataset.apply || "") && it.verdict === "반영 완료") { const nx = S.items.find((x) => x.id > id && !x.verdict) || S.items.find((x) => !x.verdict);
    if (nx) { S.open = nx.id; const k = eyePageOf(nx.index); if (k >= 0) S.cur = k; S.goSel = true; } }
  t.textContent = old; eyeShow(); eyeCards();
}
let eyeTimer = 0;
function eyeInput(e) {
  const id = +(e.target.dataset.mine || 0); if (!id) return;
  const S = window.__eyeS, it = S.items.find((x) => x.id === id), lx = eyeMsg(it).latex || "", v = e.target.value;
  S.mine[id] = v;
  const bad = window.__eyeSyntax(v), same = v === lx, card = e.target.closest(".card");
  card.querySelector(`[data-lint="${id}"]`).innerHTML = eyeLint(bad);
  card.querySelector(`[data-mdiff="${id}"]`).innerHTML = same ? "<div>아직 바뀐 곳 없음</div>" : eyeDiff(lx, v);
  card.querySelectorAll("[data-apply]").forEach((b) => (b.disabled = !!(bad.length || same)));
  clearTimeout(eyeTimer);
  eyeTimer = setTimeout(async () => { if (bad.length) return; const r = await window.__eyeRender(v, { wmm: S.wmm }); const img = card.querySelector('img[data-b="mine"]'); if (img && r.png) img.src = r.png; }, 600);
}
function eyeGoto(it, focus) {
  const ta = document.querySelector(`#__eyeCards textarea[data-mine="${it.id}"]`); if (!ta) return;
  const key = it.from || ""; const at = key ? ta.value.indexOf(key) : -1;
  if (at < 0) { if (focus) eyeToast("해당 부분을 못 찾음 — 고친 뒤 글이 달라졌을 수 있음"); return; }
  ta.focus({ preventScroll: true }); ta.setSelectionRange(at, at + key.length);
  const lh = parseFloat(getComputedStyle(ta).lineHeight) || 18; ta.scrollTop = Math.max(0, (ta.value.slice(0, at).split("\n").length - 2) * lh);
}
async function eyeBA(it) {
  const S = window.__eyeS, m = eyeMsg(it); if (!m.latex) return;
  const k = `${m.latex.length}:${it.applied ? it.applied.to.length : it.to}`;
  if (it._ba !== k) {
    if (it._baK !== k) {
      it._baK = k;
      it._baP = (async () => {
        let b = "", a = "", err = "";
        if (it.applied) { b = (await window.__eyeRender(m.latex.replace(it.applied.to, it.applied.from), { wmm: S.wmm })).png; a = (await window.__eyeRender(m.latex, { wmm: S.wmm })).png; }
        else { const r0 = await window.__eyeRender(m.latex, { wmm: S.wmm }); b = r0.png; if (!r0.ok) err = "전 그림을 못 그림 — " + r0.error;
          if (it.to) { const t = await window.__eyeTry(S.msgs, it.index, it.from, it.to); a = t.after && t.after.png; if (t.block) err = "추천대로 하면 막힘 — " + t.block; } }
        it.beforePng = b; it.afterPng = a; it._ba = k;
        if (err && it.err !== err) { it.err = err; eyeCards(); }
      })();
    }
    await it._baP;
  }
  const card = document.querySelector("#__eyeCards .card.on"); if (!card || S.open !== it.id) return;
  const put = (sel, png) => { const im = card.querySelector(`img[data-b="${sel}"]`); if (im && png) im.src = png; };
  put("before", it.beforePng); put("after", it.afterPng);
  if (S.mine[it.id] != null && !window.__eyeSyntax(S.mine[it.id]).length) put("mine", (await window.__eyeRender(S.mine[it.id], { wmm: S.wmm })).png); else put("mine", it.beforePng);
  const cv = card.querySelector(`canvas[data-crop="${it.id}"]`), k2 = eyePageOf(it.index), p = k2 >= 0 && S.pages[k2], b = p && p.boxes.find((x) => x.index === it.index);
  if (cv && b) { const im = new Image(); im.onload = () => { cv.width = Math.round(b.w); cv.height = Math.round(b.h); cv.getContext("2d").drawImage(im, b.x, b.y, b.w, b.h, 0, 0, cv.width, cv.height); }; im.src = p.png; }
}
window.__eyeButton = () => {
  if (typeof document === "undefined" || !document.body || document.getElementById("__eyeBtn")) return;
  const b = document.createElement("button"); b.id = "__eyeBtn"; b.textContent = "👁 눈검수";
  b.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:99980;font:bold 13px sans-serif;padding:6px 12px;border-radius:18px;border:0;background:#2f5d8a;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.4);cursor:pointer";
  b.onclick = () => { const S = window.__eyeS; if (S && S.pages && S.pages.some(Boolean)) { eyeUI(); eyeShow(); eyeCards(); return; }
    const r = window.__eyeOpen(); if (/^눈검수를 못 씀/.test(r)) { b.textContent = "👁 북마크 '도구'를 새로 만들어야 씀"; b.style.background = "#c62828"; } };
  document.body.appendChild(b);
};
if (typeof setTimeout === "function") setTimeout(() => { try { window.__eyeButton(); } catch (e) {  } }, 0);
}
