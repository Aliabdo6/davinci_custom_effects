# v2 / Edit / Effects

The effect files themselves. Copy all of them into the Resolve templates
folder; leave this folder alone and nothing changes in Resolve.

| File | Shows up as | Notes |
|---|---|---|
| `CineFocusMulti.setting` | CineFocusMulti | Up to 4 targets, auto-timed, returns to full frame |
| `VOX_ArchivalPush.setting` | VOXArchivalPush | Slow push-in on stills, one node |
| `VOX_Callout.setting` | VOXCallout | Animated oval callout with overshoot |
| `VOX_StatCard.setting` | VOXStatCard | Number + label + accent bar build-on |

## Hints

- Effects that use guides start with **Step 1: Select …**. Turn it on to place
  things, off to play. Guides are drawn into the image, so always leave them off
  when rendering or when stacking another adjustment clip above.
- Every effect has a **Timeline Frame Rate** menu. Match it to the project or
  the animation will run slightly fast or slow.
- A `Debug` page on each effect exposes read-only values (current zoom, clip
  time, total runtime). Useful when something looks off.

Setup and behaviour details: [../../README.md](../../README.md).
