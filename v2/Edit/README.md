# v2 / Edit

This folder mirrors the layout Resolve expects for **Edit page** templates.

```
  this repo                              DaVinci Resolve
  ─────────────────────────────────      ─────────────────────────────────────
  v2/Edit/Effects/*.setting   ──────►    Templates/Edit/Effects/
                                              │
                                              ▼
                                         Edit page → Effects panel
```

```
Edit/
└── Effects/        ← the effect files go here
```

Install `Effects/*.setting` into:

```text
%APPDATA%\Blackmagic Design\DaVinci Resolve\Support\Fusion\Templates\Edit\Effects
```

The path must contain the `Edit` folder and the `Effects` folder, spelled
exactly that way, or Resolve will not load the templates. Restart Resolve after
copying files.

See [../README.md](../README.md) for what each effect does.
