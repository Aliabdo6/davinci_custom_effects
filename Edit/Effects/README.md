# Edit / Effects (v1)

Original effect files, left as-is.

| File | What it does | Best for |
|---|---|---|
| `ZoomCrop.setting` | Zooms into the rectangle between two corner points. | Quick reframes when you already know the corners. |
| `ZoomCropPro.setting` | Zooms into a box you drag, with Fit/Fill and a keep-inside option. | Cropping to an area of the frame. |
| `CineFocus_SmoothZoom.setting` | Auto-timed zoom: full frame → one target → hold → optional zoom out. | One subject, no keyframes. |

All three use the same pattern:

1. Tick the **Select Area / Edit Mode** checkbox.
2. Drag the yellow guide box in the viewer.
3. Untick it and scrub.

---

## ZoomCrop

```
   Input ──► Transform ──► Merge guide ──► Output
               ▲                ▲
          Size/Pivot        RectangleMask
          from Amount       (Edit Mode only)
```

```
  Amount:  0 ──────────────────────────────► 1
           full frame                       area framed
```

This one has **no timing of its own**. You keyframe `Amount` from 0 to 1 (or the
reverse) and Resolve interpolates. Everything else is derived from the two
corner points, so the zoom factor is `1 / max(width, height)` of that rectangle.

---

## ZoomCropPro

```
   Input ──► Transform ──► Merge guide ──► Merge result box ──► Output
               ▲                ▲                  ▲
          Size/Pivot        yellow guide      blue result rect
          from Amount       (where to look)    (what you will see)
```

Same as `ZoomCrop` but the area is a draggable box with **Fit** (whole box
visible) or **Fill** (box fills the frame), plus **Keep Inside** to clamp the
view so black edges never appear.

```
  Fit  ── max(width, height) drives zoom   → whole box on screen
  Fill ── min(width, height) drives zoom   → box overflows the frame
```

The blue rectangle is a preview of the final framing, drawn only while Edit Mode
is on.

---

## CineFocus (CineFocus_SmoothZoom.setting)

```
   Input ──► Transform ──► Merge guide ──► Merge result box ──► Output
               ▲                ▲                  ▲
          Size/Pivot        yellow guide      blue result rect
          from time
```

```
  0 ── delay ──► zoom in ──► hold ──► (zoom out) ──► end
       full       target      held      full          full
       frame      reached                 (optional)
```

- **Auto mode** (default) derives the whole move from `time`, so no keyframes.
- **Manual mode** replaces the timing with the `Amount` slider — but pan and zoom
  share that one slider, so they cannot be separated.
- **Motion Curve** picks the easing: Linear, Gentle, Smooth, Silky, Cinematic.

Note the effect registers as **`CineFocus`**, not `CineFocus_SmoothZoom`, so
search the Effects panel for "CineFocus".

---

## Known rough edges in these files

- Move durations cannot go below 1.0 s (`ZoomInDur` / `ZoomOutDur`).
- The easing formulas are duplicated four times each; they are fragile to edit.
- `Animation Mode` drives pan and zoom from the same `Amount` slider in manual
  mode, so they cannot be separated.
- Timing assumes `time` counts frames from the start of the clip and needs the
  **Timeline Frame Rate** menu set by hand.

These are addressed in [`../../v2`](../../v2), which is a separate install and
does not replace these files. Node graphs for the rewrite are in
[`../../v2/Edit/Effects/README.md`](../../v2/Edit/Effects/README.md).
