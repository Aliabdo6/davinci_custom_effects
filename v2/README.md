# v2 — Fusion effects suite

Second-generation versions of the effects in `../Edit/Effects`, plus a set of
VOX-style motion graphics. Same install and same workflow (Adjustment Clip on
the Edit page), but with the timing engine rebuilt so one effect can carry a
whole multi-target camera move.

Nothing in `../Edit` is modified. Both sets can be installed side by side.

## Install

1. Press `Win + R`, paste this and hit Enter:

   ```text
   %APPDATA%\Blackmagic Design\DaVinci Resolve\Support\Fusion\Templates
   ```

2. Go to (or create) `Templates\Edit\Effects`.
3. Copy every `*.setting` file from `v2\Edit\Effects` into it.
4. Quit DaVinci Resolve completely, then reopen it.
5. On the Edit page, add an **Adjustment Clip** above your footage and drop the
   effect on it.

More detail and troubleshooting: [../README.md](../README.md).

## What is in here

| File | Effect | What it is for |
|---|---|---|
| `CineFocusMulti.setting` | **CineFocusMulti** | Full frame → target A → target B → target C → target D → back to full frame. Replaces `CineFocus_SmoothZoom` for anything with more than one subject. |
| `VOX_ArchivalPush.setting` | **VOXArchivalPush** | The slow, deliberate push-in on a still. Constant speed by default. |
| `VOX_Callout.setting` | **VOXCallout** | Animated circle/oval outline that pops on with a slight overshoot. |
| `VOX_StatCard.setting` | **VOXStatCard** | Big number + label + accent bar, built in sequence. |
| `VOX_MapFocus.setting` | **VOXMapFocus** | Dims the frame, keeps one region at full brightness, adds a pulsing marker dot. |
| `VOX_HighlightBar.setting` | **VOXHighlightBar** | Accent bar that wipes on behind a word, a row, or a number. |
| `VOX_PhotoCard.setting` | **VOXPhotoCard** | Archival still as a tilted paper card with a soft shadow, sliding in. |

## How every effect works

```
  EDIT PAGE                                   FUSION (inside the .setting)

  ┌──────────────────────────┐
  │ V2  Adjustment Clip      │
  │     effect: <macro>      │          ┌───────┐    ┌───────────┐    ┌────────┐
  └──────────────────────────┘          │ Input │───►│ Transform │───►│ Output │
               │                        └───────┘    └───────────┘    └────────┘
               │ affects                       ▲            ▲
               ▼                               │            │
  ┌──────────────────────────┐            footage      expression on
  │ V1  your footage         │            below        `time` = animation
  └──────────────────────────┘
```

The adjustment clip passes the picture underneath into the macro. The macro
transforms it and hands it back. All animation is computed from the clip's
`time` — nothing is keyframed, so an effect works the moment you drop it.

Per-effect node graphs (and the exact timing curve of each) are in
[`Edit/Effects/README.md`](Edit/Effects/README.md).

---

## CineFocusMulti — quick start

1. Drop it on an Adjustment Clip.
2. Set **How Many Targets** (1–4, meaning how many areas after the opening
   full frame).
3. Tick **Step 1: Select Target**.
4. Pick **Which Target Box to Show / Edit**, then drag the yellow box in the
   viewer and size it. Repeat for each target.
5. Untick **Step 1**. The move plays.

That is the whole setup. Timing controls are on the `Timing` page.

### How the move is built

```
full frame ──move──> Target 1 ──hold──> Target 2 ──hold──> … ──move──> full frame
```

- **Move Duration** is used for every move, including the return.
- **Target N Hold** is how long it sits on that area before moving on.
- **After Last Target** chooses whether it stays there or returns to full frame.
- The `Debug` page shows **Total Runtime** so you can match the clip length.

### Motion blur

Two independent options, both in `Advanced`:

- **Soft Blur During Move** — a Gaussian blur that fades in and out with the
  move. Always works, costs one cheap blur node, does nothing when set to 0.
- **Motion Blur (real, from Transform)** — turns on the Transform node's own
  motion blur. This is the physically correct one. On some Resolve versions the
  input is ignored; if you enable it and see no change, open the macro
  (right-click → Macro → Expand Into Nodes), select `ZoomXf`, and tick Motion
  Blur in its Settings tab by hand.

Best result: a small Soft Blur (2–4 px) *and* real motion blur off, or real
motion blur on with Soft Blur at 0.

### Why it stays light

The whole move is one `Transform` node plus one optional `Blur`. Everything
else is a mask used for the on-screen guides. No trackers, no optical flow, no
per-frame keyframes — the animation is a closed-form expression of `time`.

---

## VOX effects — quick start

### VOXArchivalPush

Drop on the photo. Set **Move Duration** to the length of the shot and
**End Zoom** to something small: 1.10–1.20 for a barely-there push,
1.3–1.5 for a more deliberate one.

- **Drift X / Y** pans while it pushes, so it is never a dead-centre zoom.
  `0.03` is a noticeable drift.
- **Handheld Bob** adds a tiny wobble. `0.001` is subtle.
- **Motion Curve** defaults to *Constant speed*, which is what archival footage
  usually wants. Pick *Silky* if the shot has a soft start.

One node, no guides, nothing to position.

### VOXCallout

Tick **Step 1**, drag and resize the oval, then untick it. **Outline Thickness**
is on the first page; colour is on the `Color` page.

- **Overshoot** is the snap as it draws on. `0.15` is a confident pop, `0` is a
  clean ease.
- **Pulse After Draw-On** makes it breathe gently while it sits there.

### VOXStatCard

Tick **Step 1**, drag the yellow box to where the card should sit, untick it.
Type into **Big Value Text** and **Small Label Text**.

The build order is bar → number → label, spaced by **Stagger**. Text sizes are
on the first page; accent colour is on `Color`. Text colour is white and light
grey — to change it, expand the macro and set the colour on the two Text+ nodes.

### VOXMapFocus

Put a map (or any still) underneath, tick **Step 1** and drag the region box
over the area you want to point at. Untick it.

- **Dim Everything Else** is how much the rest of the frame is knocked back.
  `0.55` is a clear focus, `0.75` is close to a spotlight.
- **Marker Dot Size** draws a pulsing dot at the centre of the region — set it
  to `0` for a clean dim with no marker.
- **Pulse** and **Pulse Period** control the breathing. `1` and `1.2 s` is a
  calm heartbeat.

The region is a hard-edged rectangle. For an oval emphasis, put `VOXCallout` on
top of this effect on the next track up.

### VOXHighlightBar

Tick **Step 1**, drag the bar onto the word or row, untick it. **Bar Width** and
**Bar Height** are sliders; position is the drag.

- **Wipe Direction** chooses left→right or right→left.
- **Opacity** at `1` is a solid bar. Drop it to `0.35–0.45` to lay it over text
  like a marker pen.
- The bar appears once and stays. Trim the adjustment clip to control when it
  disappears.

### VOXPhotoCard

Tick **Step 1**, drag the yellow box to where the card should land, untick it.
The photo underneath becomes the card's picture.

- **Card Width / Height** and **Paper Border** set the frame and the white
  inset. The photo is scaled to cover the inner area and cropped by the border.
- **Rotation** is the tilt. `-2°` reads as "placed by hand"; `0` looks digital.
- **Entrance From** + **Entrance Distance** + **Overshoot** give the slide and
  the little snap at the end. Set distance to `0` for a card that just appears.
- Shadow shape lives on the `Shadow` page: offset, darkness, softness.

---

## Fixes and changes vs `CineFocus_SmoothZoom`

- **Easing rewritten.** The original had the same ~40-term curve pasted into
  four inputs, with a very deeply nested "Cinematic" branch. All five curves
  are now one verified formula, so a typo cannot silently break one menu option.
- **Sub-second moves allowed.** The original clamped move durations to a
  minimum of 1.0 s, which made fast punch-ins impossible.
- **Time can be offset.** A **Time Shift** control exists in case the effect
  reads `time` from the timeline rather than from the clip start on your build.
- **Return lands exactly on full frame.** Zoom is interpolated geometrically,
  so it ends on exactly 1.0 and the frame centre, no matter how many targets
  are active.
- **Only the guide you are editing is drawn.** The original drew its guides
  into the image; if you stack adjustment clips, that overlay would be baked
  into the clip above. v2 shows one box, for the selected target only.
- **Removed the "Manual / Animation Mode" pair.** In the original, manual mode
  drove pan from the same slider as zoom, so the two could not be separated.
  CineFocusMulti is auto-only by design.
- **Removed the redundant blue "result" rectangle.** It duplicated the guide
  box, so it was dropped to save nodes.

## Templates and presets

Yes — and these files already are templates. Resolve uses the **folder name** to
decide where a template appears:

| Folder | Appears as | Notes |
|---|---|---|
| `Templates\Edit\Effects` | Effects panel | what everything in this folder uses |
| `Templates\Edit\Titles` | Titles panel | same `.setting` format |
| `Templates\Edit\Transitions` | Transitions panel | needs **two** image inputs |
| `Templates\Edit\Generators` | Generators panel | one input, or none |

So a "VOX lower third" could be dropped in as a Title instead of an Effect by
copying the file to the `Titles` folder — the graph is identical.

**Presets** (same effect, different starting values) are a separate matter.
Resolve's Edit page has no preset browser for effects, so there are two routes:

1. **One file per preset** — simplest. Copy the effect, rename both the
   `MacroOperator` key and `ActiveTool` to match the new filename, and change
   the default `Value` fields. It shows up as its own entry, e.g.
   `VOXArchivalPush_Slow`, `VOXArchivalPush_Drift`.
2. **A preset dropdown inside the macro** — add a `Preset` combo whose
   expression drives the other parameters. Tidier palette, but the individual
   sliders become read-only while a preset is selected.

**Transitions cannot be built from this pattern.** An adjustment clip supplies
one image, and a transition needs the outgoing and incoming clips at once. Those
have to be Transition templates with two inputs, or done as two stacked clips.

## Limitations

- A Fusion macro cannot see how long its clip is, so all timing is seconds
  from the start of the clip. That is why every effect has a frame-rate menu —
  set it to match the project.
- Four targets is the built-in maximum in CineFocusMulti. The pattern extends
  cleanly; ask and a 6- or 8-target version can be generated.
- Stacking effects means stacking Adjustment Clips on separate tracks. Only
  tracks *below* an adjustment clip are affected.
