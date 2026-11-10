// Prisma contract checker: the learner writes models, the page checks them against rules.
// It is a teaching aid, not a real PSL parser: it understands models, scalar fields,
// the ? and [] modifiers, and attributes as raw text.
//
// Markup:
// <div class="model-check" data-rules='[ ...rules ]'>
//   <textarea>starter code</textarea>
// </div>
//
// Rule shapes (each needs a "label"; "hint" is shown when it fails):
//   { "kind": "header" }                                   first non-blank line is "// use prisma-8"
//   { "kind": "model", "model": "Book" }                   model exists
//   { "kind": "field", "model": "Book", "field": "title",
//     "type": "String", "optional": false, "list": false,
//     "attr": "@id", "noAttr": "@default" }               attr/noAttr are regex sources tested on the attribute text
//   { "kind": "count", "model": "Book", "attr": "@id", "exactly": 1 }   how many fields carry an attribute
(function () {
  function parse(text) {
    const lines = text.split(/\r?\n/);
    const firstLine = lines.find((l) => l.trim() !== "") || "";
    const models = {};
    let current = null;
    for (const raw of lines) {
      const line = raw.replace(/\/\/.*$/, "").trim();
      if (!line) continue;
      const start = line.match(/^model\s+(\w+)\s*\{$/);
      if (start) { current = { name: start[1], fields: {}, block: [] }; models[start[1]] = current; continue; }
      if (line === "}") { current = null; continue; }
      if (!current) continue;
      if (line.startsWith("@@")) { current.block.push(line); continue; }
      const f = line.match(/^(\w+)\s+([\w.]+)(\[\])?(\?)?\s*(.*)$/);
      if (f) current.fields[f[1]] = { name: f[1], type: f[2], list: !!f[3], optional: !!f[4], attrs: f[5] };
    }
    return { headerOk: firstLine.trim() === "// use prisma-8", models };
  }

  function check(rule, parsed) {
    if (rule.kind === "header") return parsed.headerOk;
    const model = parsed.models[rule.model];
    if (!model) return false;
    if (rule.kind === "model") return true;
    if (rule.kind === "count") {
      const re = new RegExp(rule.attr);
      return Object.values(model.fields).filter((f) => re.test(f.attrs)).length === rule.exactly;
    }
    const field = model.fields[rule.field];
    if (!field) return false;
    if (rule.type && field.type !== rule.type) return false;
    if (rule.optional !== undefined && field.optional !== rule.optional) return false;
    if (rule.list !== undefined && field.list !== rule.list) return false;
    if (rule.attr && !new RegExp(rule.attr).test(field.attrs)) return false;
    if (rule.noAttr && new RegExp(rule.noAttr).test(field.attrs)) return false;
    return true;
  }

  document.querySelectorAll(".model-check").forEach((box) => {
    const rules = JSON.parse(box.dataset.rules);
    const textarea = box.querySelector("textarea");
    textarea.spellcheck = false;
    const starter = textarea.value;

    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn"; btn.textContent = "Verificar";
    const reset = document.createElement("button");
    reset.type = "button"; reset.className = "btn ghost"; reset.textContent = "Recomeçar";
    reset.style.marginLeft = ".5rem";
    const results = document.createElement("ul"); results.className = "results";
    const summary = document.createElement("p"); summary.className = "summary";
    box.append(btn, reset, results, summary);

    // Tab inserts two spaces instead of leaving the textarea.
    textarea.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      const { selectionStart: s, selectionEnd: t } = textarea;
      textarea.setRangeText("  ", s, t, "end");
    });

    btn.addEventListener("click", () => {
      const parsed = parse(textarea.value);
      results.replaceChildren();
      let passed = 0;
      rules.forEach((rule) => {
        const ok = check(rule, parsed);
        if (ok) passed++;
        const li = document.createElement("li");
        li.className = ok ? "pass" : "fail";
        li.textContent = rule.label;
        if (!ok && rule.hint) {
          const h = document.createElement("span"); h.className = "hint"; h.textContent = rule.hint;
          li.append(h);
        }
        results.append(li);
      });
      summary.textContent = passed === rules.length
        ? "Tudo certo! Seu model atende a todos os requisitos."
        : `${passed} de ${rules.length} requisitos atendidos.`;
    });

    reset.addEventListener("click", () => {
      textarea.value = starter; results.replaceChildren(); summary.textContent = "";
    });
  });
})();
