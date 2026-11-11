# tools

Small Node.js scripts to catch broken `.setting` files before you restart
Resolve. No dependencies, run with `node` from the repo root.

```bash
node tools/check_setting.js v2/Edit/Effects/*.setting
node tools/check_refs.js    v2/Edit/Effects/*.setting
```

## `check_setting.js`

Verifies that `{ }`, `( )` and `[ ]` are balanced outside of string literals,
and that every `Expression = "…"` has balanced parentheses. A single missing
bracket makes the whole macro fail to load, and Resolve is not loud about it.

## `check_refs.js`

Checks two things that Resolve silently tolerates but that break an effect:

- every `SourceOp = "…"` points at a node that actually exists in the file;
- every key in `UserControls` exists as an `Input` / `InstanceInput`.

## What they do not catch

They are structural checks only. They cannot tell you that a control is
mis-wired, that a node input name is wrong for your Resolve version, or that an
expression produces the wrong number. Those still need a look in the viewer.
