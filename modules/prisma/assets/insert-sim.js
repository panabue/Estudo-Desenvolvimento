// INSERT simulator: a tiny in-browser imitation of how PostgreSQL treats an INSERT.
// The learner chooses which columns to send, clicks INSERT, and sees the SQL plus
// either the new row or the error PostgreSQL would raise. Teaching aid, not a database.
//
// Faithful to PostgreSQL on purpose:
//   - omitted column -> DEFAULT if there is one, otherwise NULL
//   - NULL in a NOT NULL column -> error 23502
//   - duplicate value in a UNIQUE/PK column -> error 23505 (NULLs never collide)
//   - serial ids are taken from the sequence BEFORE constraints are checked,
//     so a failed insert "burns" an id (sequences are never rolled back)
//   - typing NULL in a field sends an explicit NULL
//
// Markup:
// <div class="insert-sim" data-config='{
//   "table": "Event",
//   "columns": [
//     {"name":"id","type":"integer","pk":true,"serial":true},
//     {"name":"name","type":"text","sample":"Tech Day"},
//     {"name":"date","type":"timestamptz","default":"now()","sample":"2026-12-05 19:00"},
//     {"name":"company","type":"text","unique":true,"sample":"Acme"},
//     {"name":"cpf","type":"text","nullable":true}
//   ]
// }'></div>
// Column flags: pk, serial, nullable, unique, default ("now()" or a literal), sample (prefilled value),
// send (false = checkbox starts unchecked; serial columns start unchecked automatically).
(function () {
  const quoteIdent = (s) => (/^[a-z_][a-z0-9_]*$/.test(s) ? s : `"${s}"`);
  const sqlIdent = (s) => `"${s}"`;

  function fmt(v, type) {
    if (v === null) return "NULL";
    if (type === "timestamptz") return v.toISOString().replace("T", " ").replace("Z", "+00");
    return String(v);
  }
  function sqlLiteral(raw, type) {
    if (/^null$/i.test(raw.trim())) return "NULL";
    if (type === "integer" && /^-?\d+$/.test(raw.trim())) return raw.trim();
    if (type === "timestamptz" && raw.trim() === "now()") return "now()";
    return `'${raw.replace(/'/g, "''")}'`;
  }
  function parse(raw, col) {
    const t = raw.trim();
    if (/^null$/i.test(t)) return { value: null };
    if (col.type === "integer") {
      if (!/^-?\d+$/.test(t) || Math.abs(Number(t)) > 2147483647)
        return { error: `invalid input syntax for type integer: "${raw}"`, code: "22P02" };
      return { value: Number(t) };
    }
    if (col.type === "timestamptz") {
      if (t === "now()") return { value: new Date() };
      const d = new Date(t.replace(" ", "T"));
      if (!t || isNaN(d)) return { error: `invalid input syntax for type timestamp with time zone: "${raw}"`, code: "22007" };
      return { value: d };
    }
    return { value: raw };
  }
  function defaultValue(col) {
    if (col.default === "now()") return new Date();
    return parse(String(col.default), col).value;
  }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  document.querySelectorAll(".insert-sim").forEach((box) => {
    const cfg = JSON.parse(box.dataset.config);
    const cols = cfg.columns;
    let rows = [];
    let seq = 0;

    // Column picker
    const form = el("div", "sim-form");
    const inputs = cols.map((col) => {
      const row = el("label", "sim-col");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = col.send !== undefined ? col.send : !col.serial;
      const name = el("code", "sim-name", col.name);
      const meta = [col.type];
      if (col.pk) meta.push("PRIMARY KEY");
      else if (!col.nullable) meta.push("NOT NULL");
      if (col.unique) meta.push("UNIQUE");
      if (col.serial) meta.push("DEFAULT nextval");
      else if (col.default !== undefined) meta.push(`DEFAULT ${col.default}`);
      const info = el("span", "sim-meta", meta.join(" · "));
      const input = document.createElement("input");
      input.type = "text";
      input.value = col.sample || "";
      input.placeholder = "valor (ou NULL)";
      input.setAttribute("aria-label", `valor de ${col.name}`);
      input.disabled = !cb.checked;
      cb.addEventListener("change", () => { input.disabled = !cb.checked; });
      const head = el("span", "sim-head");
      head.append(cb, name, info);
      row.append(head, input);
      form.append(row);
      return { col, cb, input };
    });

    const actions = el("div", "sim-actions");
    const go = el("button", "btn", "INSERT");
    go.type = "button";
    const clear = el("button", "btn ghost", "Esvaziar tabela");
    clear.type = "button";
    actions.append(go, clear);

    const sqlOut = el("pre", "sim-sql");
    sqlOut.hidden = true;
    const msg = el("p", "sim-msg");
    const tableWrap = el("div", "table-wrap");

    function render() {
      tableWrap.replaceChildren();
      const cap = el("p", "label", `Tabela "${cfg.table}" · ${rows.length} linha(s)`);
      const t = document.createElement("table");
      t.className = "sim-rows";
      const hr = document.createElement("tr");
      cols.forEach((c) => hr.append(el("th", null, c.name)));
      t.append(hr);
      if (!rows.length) {
        const tr = document.createElement("tr");
        const td = el("td", "muted", "(vazia)");
        td.colSpan = cols.length;
        tr.append(td);
        t.append(tr);
      }
      rows.forEach((r, i) => {
        const tr = document.createElement("tr");
        if (i === rows.length - 1 && r.__new) tr.className = "fresh";
        cols.forEach((c) => {
          const td = el("td", r[c.name] === null ? "null" : null, fmt(r[c.name], c.type));
          tr.append(td);
        });
        t.append(tr);
      });
      tableWrap.append(cap, t);
    }

    function fail(text, code, detail) {
      msg.className = "sim-msg bad";
      msg.replaceChildren(el("strong", null, "ERROR: "), document.createTextNode(text));
      if (detail) msg.append(el("br"), el("span", "sim-detail", `DETAIL: ${detail}`));
      msg.append(el("br"), el("span", "sim-detail", `SQLSTATE ${code}. Nenhuma linha foi gravada.`));
      render();
    }

    go.addEventListener("click", () => {
      rows.forEach((r) => delete r.__new);
      const sent = inputs.filter((i) => i.cb.checked);
      sqlOut.hidden = false;
      sqlOut.textContent = sent.length
        ? `INSERT INTO ${sqlIdent(cfg.table)} (${sent.map((i) => sqlIdent(i.col.name)).join(", ")})\nVALUES (${sent.map((i) => sqlLiteral(i.input.value, i.col.type)).join(", ")});`
        : `INSERT INTO ${sqlIdent(cfg.table)} DEFAULT VALUES;`;

      // 1. Input values are converted before anything runs.
      const row = {};
      for (const i of sent) {
        const p = parse(i.input.value, i.col);
        if (p.error) return fail(p.error, p.code);
        row[i.col.name] = p.value;
      }
      // 2. Omitted columns get their default (serial = next sequence value, burned even on failure) or NULL.
      const filled = [];
      for (const c of cols) {
        if (c.name in row) continue;
        if (c.serial) { row[c.name] = ++seq; filled.push(c.name); }
        else if (c.default !== undefined) { row[c.name] = defaultValue(c); filled.push(c.name); }
        else row[c.name] = null;
      }
      // 3. NOT NULL.
      for (const c of cols) {
        if (row[c.name] === null && (c.pk || !c.nullable))
          return fail(`null value in column "${c.name}" of relation "${cfg.table}" violates not-null constraint`, "23502");
      }
      // 4. UNIQUE / PRIMARY KEY (NULLs never collide).
      for (const c of cols) {
        if (!(c.pk || c.unique) || row[c.name] === null) continue;
        const key = fmt(row[c.name], c.type);
        if (rows.some((r) => fmt(r[c.name], c.type) === key))
          return fail(
            `duplicate key value violates unique constraint "${cfg.table}_${c.pk ? "pkey" : c.name + "_key"}"`,
            "23505",
            `Key (${quoteIdent(c.name)})=(${key}) already exists.`
          );
      }
      row.__new = true;
      rows.push(row);
      msg.className = "sim-msg ok";
      msg.replaceChildren(el("strong", null, "INSERT 0 1. "),
        document.createTextNode(filled.length
          ? `Linha gravada. O banco preencheu sozinho: ${filled.join(", ")}.`
          : "Linha gravada. O banco não precisou preencher nada."));
      render();
    });

    clear.addEventListener("click", () => {
      rows = []; sqlOut.hidden = true; msg.className = "sim-msg"; msg.textContent = "";
      render();
    });

    box.append(form, actions, sqlOut, msg, tableWrap);
    render();
  });
})();
