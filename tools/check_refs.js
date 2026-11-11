const fs = require('fs');

function check(p) {
  const s = fs.readFileSync(p, 'utf8');
  const defined = new Set();
  const reDef = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*[A-Za-z][A-Za-z0-9_]*\s*\{/gm;
  let m;
  while ((m = reDef.exec(s))) defined.add(m[1]);

  const refs = new Set();
  const reRef = /SourceOp\s*=\s*"([^"]+)"/g;
  while ((m = reRef.exec(s))) refs.add(m[1]);

  const missing = [...refs].filter((r) => !defined.has(r));

  // UserControls keys vs Inputs keys (rough: look inside Inputs block)
  const uiStart = s.indexOf('UserControls = ordered()');
  const uiBlock = uiStart >= 0 ? s.slice(uiStart) : '';
  const inStart = s.indexOf('Inputs = ordered()');
  const inBlock = inStart >= 0 ? s.slice(inStart, uiStart >= 0 ? uiStart : undefined) : '';
  const reKey = /^\s{3,}([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:Input|InstanceInput)\s*\{/gm;
  const inputs = new Set();
  while ((m = reKey.exec(inBlock))) inputs.add(m[1]);
  const uiKeys = new Set();
  const reUi = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{\s*$/gm;
  while ((m = reUi.exec(uiBlock))) uiKeys.add(m[1]);
  const uiMissing = [...uiKeys].filter((k) => !inputs.has(k));

  console.log(`${missing.length || uiMissing.length ? 'FAIL' : 'OK  '} ${p}`);
  if (missing.length) console.log('   missing SourceOp targets:', missing);
  if (uiMissing.length) console.log('   UserControls not in Inputs:', uiMissing);
  console.log('   nodes defined:', [...defined].length, '| inputs:', inputs.size, '| ui:', uiKeys.size);
}

for (const f of process.argv.slice(2)) check(f);
