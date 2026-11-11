const fs = require('fs');

function check(p) {
  const s = fs.readFileSync(p, 'utf8');
  // remove quoted strings
  const t = s.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  const cnt = (c) => t.split(c).length - 1;
  const out = {
    file: p,
    curly: [cnt('{'), cnt('}')],
    paren: [cnt('('), cnt(')')],
    brack: [cnt('['), cnt(']')],
    exprBad: [],
  };
  s.split(/\r?\n/).forEach((line, i) => {
    const m = line.match(/Expression = "(.*)",?\s*$/);
    if (!m) return;
    const e = m[1];
    const o = e.split('(').length - 1;
    const c = e.split(')').length - 1;
    if (o !== c) out.exprBad.push(`${i + 1}: ${o} vs ${c}`);
  });
  out.total = [cnt('{'), cnt('(')];
  return out;
}

for (const f of process.argv.slice(2)) {
  const r = check(f);
  const ok =
    r.curly[0] === r.curly[1] &&
    r.paren[0] === r.paren[1] &&
    r.brack[0] === r.brack[1] &&
    r.exprBad.length === 0;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${r.file}`);
  if (!ok) {
    console.log('   braces', r.curly, 'parens', r.paren, 'brackets', r.brack);
    if (r.exprBad.length) console.log('   bad exprs', r.exprBad);
  }
}
