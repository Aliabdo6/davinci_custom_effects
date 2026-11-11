# Custom Effects in DaVinci Resolve

Install a Fusion effect so it appears in DaVinci Resolve's **Edit** page and can be used on an **Adjustment Clip**.

## What is in this repo

| Folder | Contents |
|---|---|
| [`Edit`](Edit) | The original effects: `ZoomCrop`, `ZoomCropPro`, `CineFocus`. Unchanged. |
| [`v2`](v2) | Rewritten multi-target move (`CineFocusMulti`) plus VOX-style effects (`VOXArchivalPush`, `VOXCallout`, `VOXStatCard`). |
| [`tools`](tools) | Node scripts that sanity-check a `.setting` file before you install it. |

Each folder has its own README. If you only want the new material, read
[`v2/README.md`](v2/README.md) — it installs alongside the originals.

## How an effect works

Every effect here is a Fusion **macro** placed on an **Adjustment Clip**, not on
the footage itself:

```
   V2   ┌────────────────────────────┐
        │  Adjustment Clip           │   ← the effect lives here
        │  + your macro on it        │
        └────────────┬───────────────┘
                     │  reaches down through the tracks
                     ▼
   V1   ┌────────────────────────────┐
        │  your footage              │   ← this is what gets affected
        └────────────────────────────┘
```

The clip above sends the picture below into the macro, the macro transforms it,
and the result is what you see. That is why one adjustment clip can affect
several clips at once, and why stacking effects means stacking tracks.

Inside the macro, animation comes from expressions on the frame number — never
from keyframes — so an effect plays as soon as you drop it. Every macro has a
**Timeline Frame Rate** menu so seconds convert correctly.

Node-level diagrams for each effect are in
[`v2/Edit/Effects/README.md`](v2/Edit/Effects/README.md) and
[`Edit/Effects/README.md`](Edit/Effects/README.md).

## Install the effect

1. Press **`Win + R`** to open the Run dialog.
2. Paste this path and press **Enter**:

   ```text
   %APPDATA%\Blackmagic Design\DaVinci Resolve\Support\Fusion\Templates
   ```

3. If the `Templates` folder does not exist, create it.
4. Inside `Templates`, create the folders `Edit`, then `Effects`. The complete destination should be:

   ```text
   %APPDATA%\Blackmagic Design\DaVinci Resolve\Support\Fusion\Templates\Edit\Effects
   ```

5. Copy `effect_name.setting` into the `Effects` folder. Replace `effect_name.setting` with the actual name of your effect file.
6. Close DaVinci Resolve completely, then reopen it so Resolve can load the new template.

## Apply it to your footage

1. Open a project and go to the **Edit** page.
2. Add an **Adjustment Clip** to a track above the footage you want to affect. Extend it to cover the desired duration.
3. Open the **Effects** panel and search for the effect by name.
4. Drag the effect onto the Adjustment Clip.

The effect is applied to the image beneath the Adjustment Clip for the duration of that clip. Adjust or remove the effect using the clip's controls as needed.

## If the effect does not appear

- Check that the file ends in `.setting` and is in `Templates\Edit\Effects` (not directly in `Templates`).
- Make sure the folders are spelled exactly `Edit` and `Effects`.
- Quit and relaunch Resolve after installing the file.
- Search for the effect by its displayed name in the **Effects** panel.