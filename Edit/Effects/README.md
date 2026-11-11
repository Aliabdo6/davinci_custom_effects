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

## Known rough edges in these files

- Move durations cannot go below 1.0 s (`ZoomInDur` / `ZoomOutDur`).
- The easing formulas are duplicated four times each; they are fragile to edit.
- `Animation Mode` drives pan and zoom from the same `Amount` slider in manual
  mode, so they cannot be separated.
- Timing assumes `time` counts frames from the start of the clip and needs the
  **Timeline Frame Rate** menu set by hand.

These are addressed in [`../../v2`](../../v2), which is a separate install and
does not replace these files.
