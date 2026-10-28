// page-kit v2026.10.29-0847
window.__kitBuilt = "v2026.10.29-0847";
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
  pdfjs() { const [p, s] = this.c.pdfjs; return import(new URL(p, document.querySelector(`script[src*="${s}"]`).src).href); },
};
const KIT_CFGV = 1;
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
    d = document.createElement("div"); d.id = "__kitBadge"; document.body.appendChild(d);
    clearInterval(window.__kitBadgeT); window.__kitBadgeT = setInterval(window.__kitBadge, 3000);
  }
  const s = window.__kitReady(), bad = s.startsWith("도구를 못 씀"), warn = !bad && s.includes("주의");
  const [bg, fg] = bad ? ["#c62828", "#fff"] : warn ? ["#ffb300", "#000"] : ["#2e7d32", "#fff"];
  const txt = bad ? s : warn ? "⚠ 도구 켜짐 · " + s.split(" · 주의: ").slice(1).join(" · ") : `✓ 도구 켜짐 ${window.__kitCfg.ver}`;
  if (d.textContent !== txt) d.textContent = txt;
  d.style.cssText = `position:fixed;left:8px;bottom:8px;z-index:99999;pointer-events:none;max-width:560px;background:${bg};color:${fg};padding:4px 10px;border-radius:6px;font:bold 12px sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.4)`;
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
  const ROW = /\\\\(?![A-Za-z])/;
  const splitAmp = (row) => { for (let i = 0; (i = row.indexOf("&", i)) >= 0; i++) if (i === 0 || row[i - 1] !== "\\") return [row.slice(0, i), row.slice(i + 1)]; return [row, null]; };
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
window.__fixT2 = (msgs, { apply = false, start } = {}) => {
  const meta = msgs.find((m) => m.type === "meta");
  if (meta && meta.textbook && meta.textbook !== window.__K.A) return [];
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    const lx = m.latex || "";
    let changed = false;
    const next = lx.replace(/\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/g, (all, inner) => {
      const rows = inner.split(/(\\\\(?![A-Za-z]))/);
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
window.__check = (msgs, { start } = {}) => {
  const meta = msgs.find((m) => m.type === "meta") || {};
  const vendor = window.__K.key(msgs);
  if (!vendor) return [{ where: "파일", index: null, type: "meta", rule: "-", what: `업체 모름(meta.textbook=${meta.textbook || "없음"}) — 검사 안 함. 사람에게 교재를 묻는다`, snip: "" }];
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
    const bad = [...new Set([...(m.latex || "").matchAll(/\\setmyfontspacing\{([^}]*)\}\{([^}]*)\}/g)].map((x) => x[1] + "/" + x[2]))].filter((v) => !ok.includes(v)).sort();
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
      for (const a of lx.matchAll(window.__CW18)) add(m, "CW18", `${a[1]}\\,\\left( → ${a[1]}\\left( (__fixCW18)`, lx.slice(Math.max(0, a.index - 30), a.index + 40));
      for (const a of lx.matchAll(window.__PMAT)) if (__pmatBad(a)) add(m, "CW19", "행렬 꼴(빈 열·~·칸) (__fixCW19)", a[0].slice(0, 80));
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
      ["[①-⑳ⓐ-ⓩⒶ-Ⓩ㉠-㉭㉮-㉻➀-➉]", "①"], ["\\([A-Z]\\)", "(A)"], ["[A-Z][.)]", "A."], ["\\d+\\)", "1)"], ["[a-z][.)]", "a)"]];
    const LALT = KINDS.map((x) => x[0]).join("|");
    const LAB_HEAD = new RegExp("^(?:\\\\sffamily\\s*|\\s|\\{)*(?:\\\\textrm\\{)?(" + LALT + ")\\}?\\s");
    const LAB_SIDE = new RegExp("\\\\tab\\s*(?:\\\\hspace\\*\\{0\\.01mm\\}\\\\tab\\s*)*\\{?(?:\\\\textrm\\{)?(" + LALT + ")\\}?\\s");
    const labelOf = (s) => KINDS.find(([p]) => new RegExp("^(?:" + p + ")$").test(s))[1];
    const LW = { "(ⅰ)": [5.6, 6.2, 5.9], "ⅰ)": [4.7, 5.2, 5.0], "ㄱ.": [4.8, 5.3, 5.3], "(a)": [4.5, 5.1, 4.7], "(1)": [4.6, 5.2, 4.9],
      "①": [3.9, 4.2, 4.2], "(A)": [4.9, 5.5, 5.0], "A.": [4.0, 4.5, 4.5], "1)": [3.8, 4.2, 4.2], "a)": [3.7, 4.1, 4.1] };
    const LSRC = { "①": [4.04, 4.39], "(1)": [4.87, 5.46], "(ⅰ)": [5.81, 6.49], "ⅰ)": [4.92, 6.49], "ㄱ.": [5.04, 5.62], "(a)": [4.97, 4.97], "(A)": [5.12, 5.12], "A.": [5.12, 5.12] };
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
      if (hasEq && op) return ["GW08", "다 연산자 이음 — aligned 로 묶고 GW17 계단"];
      if (t === "question" && !hasEq) return null;
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
      if (t === "table" && /\\longdivrows|\\sdreset|\\left\)\\vphantom/.test(lx)) continue;
      if (aBad.has(m)) { const [F, h] = aBad.get(m); add(m, "GW26", `${window.__K.w.lvA} 첫 문단 왼쪽 여백 ${F} → ${aMode}(다른 ${window.__K.w.lvA} 문제와 같게)`, snip(F, h[2], h[4])); }
      for (const [, F, N, , b] of lx.matchAll(HB)) {
        for (const a of b.matchAll(AL)) {
          if (noAmp(a[1])) add(m, "GW01", "aligned 행에 최상위 & 없음", snip(F, N, b, a.index));
          const pat = classify(b.slice(Math.max(0, a.index - 30), a.index), a[1]);
          if (starts(pat, ["AL-I4", "AL-II"])) add(m, "GW10", `${window.__K.nA} 꼴 ${pat.replace(/\+$/, "")}(4칸·2칸 묶음)`, snip(F, N, b, a.index));
          if (pat === "AL-T" && a[1].trimStart().startsWith("\\therefore\\,\\,&")) add(m, "GW03", `∴ 머리 묶음에 ${window.__K.nA}-T2 꼴`, snip(F, N, b, a.index));
          if (t === "explanation" && pat.startsWith("AL-I0") && !firstLead(a[1]).includes("\\text{")) add(m, "GW02", "라벨 머리 아닌 묶음에 머리 TAB 없음", snip(F, N, b, a.index));
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
          if (tabs > 1 && !OP_LEAD.test(lead(b))) add(m, "GW06", `단독 수식 줄 앞 TAB ${tabs}개(여럿 — 후보)`, snip(F, N, b));
          else if (p.includes("\\hspace*{0.01mm}\\qquad")) add(m, "GW10", `${window.__K.nA} 꼴(단독 수식 줄 앞 4칸)`, snip(F, N, b));
          else if (!tabs && !fixed && !starts(lead(b), ["$=", "$+", "$-"])) add(m, "GW06", "단독 수식 줄 앞 TAB 없음", snip(F, N, b));
        }
        if (!(nb8 && nb8[1].startsWith("다")))
          for (let seg of b.split("\\hblinebreak")) {
            seg = seg.replace(/^[ \n]+/, "");
            const tp = seg.match(TABS)[0];
            if (tabUnits(tp) >= 2 && OP_LEAD.test(seg.slice(tp.length))) add(m, "GW17", `계단 후보 — 탭 ${tabUnits(tp)}개로 민 이음 조각(마지막 조각은 \\hbright)`, snip(F, N, seg));
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
          const wantL = par ? par[1] : L, want = side ? 0 : LW[kd][col];
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
      spacing(m, "GW12");
    }
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
  if (/\\qquad\s*\$/.test(lx))
    rows.forEach((r, k) => {
      if (!seen.has(k) && isMath[k] && !isEq[k] && r.x0 / MM <= 0.8 && k > 0) out.push(["4칸 빠짐", k, "원본은 \\qquad 들여쓰기인데 0mm 에서 시작(식이 넓어 넘어감)", cut30(r.text)]);
    });
  if (gak && m.type === "question") {
    const k = rows.findIndex((r) => r.text.includes("(단"));
    if (k >= 0) {
      const r = rows[k], w = r.w.find((v) => v.t.includes("(단")), x = charX(w, len(w.t.slice(0, w.t.indexOf("(단"))));
      if (lx.includes("\\hbright{(단")) {
        if (k > 0 && x - r.x0 <= 1) {
          const prev = rows[k - 1], cw = (r.x1 - r.x0) / MM, need = prev.x1 / MM + DAN_GAP + cw;
          if (need <= W / MM) out.push(["(단,)", k, `붙일 수 있음(땡기기) — 앞 줄 끝 ${(prev.x1 / MM).toFixed(1)} + 빈칸 ${g(DAN_GAP)} + 조건 ${cw.toFixed(1)} = ${need.toFixed(1)} ≤ 칸 ${(W / MM).toFixed(1)}mm`, cut30(r.text)]);
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
      if (n !== 2) return;
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
  const LW = { "(ⅰ)": [5.6, 6.2, 5.9], "ⅰ)": [4.7, 5.2, 5.0], "ㄱ.": [4.8, 5.3, 5.3], "(a)": [4.5, 5.1, 4.7], "(1)": [4.6, 5.2, 4.9],
    "①": [3.9, 4.2, 4.2], "(A)": [4.9, 5.5, 5.0], "A.": [4.0, 4.5, 4.5], "1)": [3.8, 4.2, 4.2], "a)": [3.7, 4.1, 4.1] };
  const LAB_S = "\\([ⅰ-ⅻ]+\\)|[ⅰ-ⅻ]+\\)|[ㄱ-ㅎ]\\.|\\(\\d+\\)|\\d+\\)|\\([a-z]\\)|[a-z][.)]|\\([A-Z]\\)|[A-Z][.)]|[①-⑳ⓐ-ⓩⒶ-Ⓩ㉠-㉭㉮-㉻➀-➉]";
  const LAB = new RegExp(`^(?:\\\\sffamily\\s*|\\\\bfseries\\s*|\\s)*(?:\\\\textrm\\{)?(${LAB_S})\\}?(?=\\s|~|\\\\tab|\\\\hspace)`);
  const SIDE = new RegExp(`\\\\tab\\s*(?:\\\\hspace\\*\\{0\\.01mm\\}\\\\tab\\s*)*(?:\\\\sffamily\\s*)?(?:\\\\textrm\\{)?(?:${LAB_S})\\}?(?=\\s|~)`);
  const labKind = (l) => /^\([ⅰ-ⅻ]+\)$/.test(l) ? "(ⅰ)" : /^[ⅰ-ⅻ]+\)$/.test(l) ? "ⅰ)" : /^[ㄱ-ㅎ]\.$/.test(l) ? "ㄱ." : /^\(\d+\)$/.test(l) ? "(1)"
    : /^\d+\)$/.test(l) ? "1)" : /^\([a-z]\)$/.test(l) ? "(a)" : /^[a-z][.)]$/.test(l) ? "a)" : /^\([A-Z]\)$/.test(l) ? "(A)" : /^[A-Z][.)]$/.test(l) ? "A." : "①";
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
      if (apply) { m.latex = r.latex; window.__clearRender && window.__clearRender(m); }
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
  for (const h of hbs) {
    const x = h.body.match(G.LAB), isSide = !!x && G.SIDE.test(h.body);
    h.nL = h.L > 0 && colMap.has(h.L.toFixed(1)) ? colMap.get(h.L.toFixed(1)) : h.L;
    h.nN = h.N + (h.nL - h.L);
    if (isSide) { if (side) { h.nN = h.nL; h.why = "좌우 나열 — 내어쓰기 없이"; } }
    else if (x && h.N >= h.L && h.N - h.L < 8) {
      if (labels) { h.nN = h.nL + G.LW[G.labKind(x[1])][col]; h.why = `${x[1]} 라벨 폭`; }
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
    const lt = a.replace(/\\text\{[^}]*\}|~|\\,|\s/g, "");
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
  }
  return { latex, changes: ch };
});
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
window.__fixB = (msgs, { apply = false, start } = {}) => {
  const G = window.__vb;
  if (!G.isB(msgs)) return { fix: [], render: [{ where: "파일", what: `${window.__K.nB} 파일 아님(meta.textbook=${G.vendor(msgs) || "없음"}) — 아무것도 안 함` }] };
  const warn = new Map(msgs.map((m) => [m.index, Math.max(0, ...((m.renderWarnings || []).map((w) => w.overflowMM || 0)))]));
  const work = apply ? msgs : G.deep(msgs);
  const fix = [];
  for (const f of [window.__fixGW20, window.__fixGW18, window.__fixGW08, window.__fixGW23, window.__fixGW19, window.__fixGW17, window.__fixGW26, window.__fixGW13, window.__fixGW25])
    fix.push(...f(work, { apply: true, start }));
  return { fix, render: window.__vbRenderList(work, { start, warn }) };
};
window.__vbRenderList = (msgs, { start, warn } = {}) => {
  const W = window.__where ? window.__where(msgs, { start }) : {};
  const out = [];
  for (const m of msgs) {
    if (!m.latex) continue;
    const w = W[m.index] || "?";
    for (const b of window.__vbStepBlocks(m)) if (b.rows.length > 1) out.push({ where: w, index: m.index, rule: "GW17", what: `계단 앞 줄 ${b.rows.length - 1}개 \\hspace* D(렌더로 재기)` });
    if (window.__vbDanFind(m)) out.push({ where: w, index: m.index, rule: "GW24", what: "(단, …) 붙일지·뗄지(렌더로 재기)" });
    if (window.__vbColFind(m).length) out.push({ where: w, index: m.index, rule: "GW25", what: "좌우 나열 둘째 열 자리(렌더로 재기)" });
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
window.__vbDanFind = (m) => {
  if (m.type !== "question" || !/\(단,/.test(m.latex || "")) return null;
  const lx = m.latex;
  const det = lx.match(/(\\end\{hangblock\})(\s*)\\begin\{hangblock\}\[0mm\]\{0mm\}\{0\}\\hbright\{(\(단,[\s\S]*?\))\}\\end\{hangblock\}/);
  if (det) return { attached: false, cond: det[3], at: det.index, src: det[0] };
  const att = lx.match(/ (\(단,(?:[^()]|\([^()]*\))*\))(\\end\{hangblock\})/);
  if (att) return { attached: true, cond: att[1], at: att.index, src: att[0] };
  return null;
};
window.__vbDanDecide = ({ attached, closed, condW, prevEnd, W, gap = 1.5 }) => {
  if (attached) return closed ? null : condW > W ? null : "detach";
  return prevEnd + gap + condW <= W ? "attach" : null;
};
window.__vbDanApply = (lx, f, act) => {
  if (act === "detach") return lx.replace(f.src, () => `\\end{hangblock}\n\\begin{hangblock}[0mm]{0mm}{0}\\hbright{${f.cond}}\\end{hangblock}`);
  if (act === "attach") return lx.replace(f.src, () => ` ${f.cond}\\end{hangblock}`);
  return lx;
};
window.__vbDanMeasure = (f, R) => {
  const k = R.rows.findIndex((r) => r.text.includes("(단"));
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
  return { attached: false, prevEnd: R.rows[k - 1].x1, condW: r.x1 - r.x0, W: R.W };
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
  return out;
};
window.__vbColDecide = ({ x, prevEnd, W, L = 0, j, n }) => {
  const G = window.__vb.GRID, want = L + (W - L) * j / n;
  const kt = Math.max(1, Math.round(want / G)), kc = Math.round(x / G);
  if (Math.abs(x - kc * G) > 1) return { add: 0, why: `지금 자리 ${x.toFixed(1)} 가 탭 격자가 아님` };
  if (kt <= kc) return { add: 0, target: kt * G };
  if (prevEnd > kt * G - 1) return { add: 0, why: "앞 항목이 길어 못 옮김" };
  return { add: kt - kc, target: kt * G };
};
window.__vbColMeasure = (c, R) => {
  for (const r of R.rows) {
    const xs = c.labs.map((l) => r.w.find((w) => w.t.normalize("NFKC").startsWith(l.normalize("NFKC"))));
    if (xs.some((x) => !x)) continue;
    return xs.map((w, j) => j ? { x: w.x0, prevEnd: Math.max(...r.w.filter((v) => v.x1 <= w.x0 + 0.01).map((v) => v.x1)), W: R.W, L: c.L, j, n: c.labs.length } : null).slice(1);
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
    const f = V === "B" && window.__vbDanFind({ ...m, latex: lx });
    if (f) {
      const x = window.__vbDanMeasure(f, R), act = x && window.__vbDanDecide(x);
      if (act) {
        lx = window.__vbDanApply(lx, f, act);
        out.push({ where, index: m.index, rule: "GW24", before: f.src.slice(0, 70), after: act === "attach" ? "땡김(붙임)" : "뗌(다음 줄 \\hbright)",
          what: act === "attach" ? `앞 줄 끝 ${x.prevEnd.toFixed(1)} + 조건 ${x.condW.toFixed(1)} ≤ 칸 ${x.W.toFixed(1)}` : `조건이 두 줄로 쪼개짐(조건 폭 ${x.condW.toFixed(1)})` });
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
        body = body.replace(re, (all, tabs, l) => tabs + "\\hspace*{0.01mm}\\tab ".repeat(d.add) + l);
        out.push({ where, index: m.index, rule: "GW25", what: `${lab} 자리 ${x.x.toFixed(1)} → ${d.target.toFixed(1)}mm (탭 ${d.add}개 더함)` });
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
        return (await window.__K.exportRendered()).messages.find((x) => x.index === 0);
      };
      const worst = (r) => Math.max(0, ...((r && r.renderWarnings) || []).map((w) => w.overflowMM || 0));
      const lineOver = async (r) => r && r.pdf ? (await window.__lineFind(lib, r, "B")).some((f) => f[0] === "넘침") : false;
      const W = window.__where(work, { start }), isB = G.isB(work);
      if (!isB && window.__K.key(work) !== "A") throw new Error(`업체 모름(meta.textbook=${G.vendor(work) || "없음"})`);
      const pre = isB ? window.__fixB(work, { apply: true, start })
        : { fix: window.__fixGW17(work, { apply: true, start }), render: work.filter((m) => window.__vbStepBlocks(m, { alignedOnly: true }).some((b) => b.rows.length > 1)).map((m) => ({ index: m.index })) };
      __job.fix.push(...pre.fix);
      __job.log.push(`렌더 없는 고침 ${pre.fix.length} · 렌더로 볼 곳 ${pre.render.length}`);
      const todo = new Set([...pre.fix.map((x) => x.index), ...pre.render.map((x) => x.index)]);
      for (const m of work) {
        if (!todo.has(m.index) || !m.latex) continue;
        let r = m.pdf ? m : await one(m);
        if (!r || !r.pdf) { __job.left.push(`${W[m.index]} 렌더 실패`); continue; }
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
        return all;
      }
      const rows = al[1].split(/\\\\(?![A-Za-z])/).map((r) => r.replace(/^\n/, ""));
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
      const lines = async (r) => r && r.pdf ? (await window.__lineFind(lib, r, "A")).filter((f) => f[0] === "넘침").length : 0;
      const targets = [];
      for (const m of work) {
        if (!m.latex || !m.pdf || m.type === "table" || (W[m.index] || "").includes("정답")) continue;
        if (warn(m) > 0 || await lines(m)) targets.push(m);
      }
      __job.log.push(`넘친 메시지 ${targets.length}`);
      for (const m of targets) {
        const cands = window.__ovCandidates(m.latex);
        let ok = null;
        for (let i = 0; i < cands.length && i < max; i++) {
          const r = await one(cands[i], m);
          if (r && r.pdf && warn(r) === 0 && !(await lines(r))) { ok = [i, cands[i]]; break; }
        }
        if (ok) { m.latex = ok[1]; window.__clearRender(m); __job.fix.push({ where: W[m.index], index: m.index, rule: "넘침", what: `끊기·묶기 후보 ${ok[0] + 1}/${cands.length}` }); }
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
