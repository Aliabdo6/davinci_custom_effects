# v2 / Edit / Effects

The effect files themselves. Every one is a Fusion **macro**: a self-contained
node graph driven by expressions on the frame number, saved as a `.setting`.

## The shared pattern

```
  EDIT PAGE                                   FUSION (inside the .setting)

  ┌──────────────────────────┐
  │ V2  Adjustment Clip      │
  │     effect: <macro>      │          ┌───────┐    ┌───────────┐    ┌────────┐
  └──────────────────────────┘          │ Input │───►│ Transform │───►│ Output │
               │                        └───────┘    └───────────┘    └────────┘
               │ affects                       ▲            ▲
               ▼                               │            │
  ┌──────────────────────────┐           footage      expression on
  │ V1  your footage         │           below        `time` = animation
  └──────────────────────────┘
```

No keyframes are ever written. Each effect reads the clip's `time`, converts it
to seconds with the **Timeline Frame Rate** menu, and computes its position from
that. That is why they can be dropped on a clip and play immediately.

| File | Shows up as | Nodes | Guide? |
|---|---|---|---|
| `CineFocusMulti.setting` | CineFocusMulti | 11 | yes |
| `VOX_ArchivalPush.setting` | VOXArchivalPush | 1 | no |
| `VOX_Callout.setting` | VOXCallout | 7 | yes |
| `VOX_StatCard.setting` | VOXStatCard | 11 | yes |
| `VOX_MapFocus.setting` | VOXMapFocus | 10 | yes |
| `VOX_HighlightBar.setting` | VOXHighlightBar | 7 | yes |
| `VOX_PhotoCard.setting` | VOXPhotoCard | 17 | yes |

"Guide" means the effect needs to be placed: tick **Step 1**, drag the box,
untick it.

---

## CineFocusMulti

```
                 ┌───────────────────────────┐
   Input ───────►│  Transform                │───►┌──────────┐
                 │  Pivot = where to look    │    │  Blur    │───►┌──────────────────┐
                 │  Size  = how close        │    │ optional │    │ Merge 1..4       │───► Output
                 └───────────────────────────┘    └──────────┘    │ guide boxes      │
                             ▲                                    └──────────────────┘
                             │                                              ▲
                    one expression per frame                     RectangleMask 1..4
                    (sum of eased segment deltas)                (visible only in Edit Mode)
```

**How the move is built** — every move is a delta added on top of the previous
one, so there is no branching and no keyframes:

```
  t=0 ──delay──► move1 ──► hold1 ──► move2 ──► hold2 ──► ... ──► return ──► end
       full       target A    A        target B    B              full
       frame                                                            frame
```

Zoom is interpolated **geometrically**, which is why it lands exactly on 1.0:

```
  Size = Z1^p1  ×  (Z2/Z1)^p2  ×  (Z3/Z2)^p3  ×  (Z4/Z3)^p4  ×  (1/Zlast)^pReturn
         ↑ each p is that segment's eased progress, 0→1
```

Pan is interpolated linearly between target centres, with **Pan Lead** finishing
the pan slightly before the zoom so the camera settles onto the subject.

`NumTargets` gates the later segments to zero, so unused targets cost nothing
and cannot fire early.

---

## VOXArchivalPush

```
   Input ───────►┌─────────────────────────────┐───► Output
                 │ Transform                   │
                 │ Size  = Start × (End/Start)^p│
                 │ Pivot = centre + drift × p   │
                 └─────────────────────────────┘
```

```
  0 ───────────── move duration ─────────────► end
  1.00× .................................. 1.15×     constant speed (default)
                                                   pick "Silky" for soft start
```

One node, no guide. The drift is applied to the pivot, so the frame pans toward
one side of the photo while it pushes in — that is what stops it looking like a
dead-centre zoom.

---

## VOXCallout

```
   ColorBG (flat colour) ──┐
                           ├──► Merge ──► Transform ──► Merge ──► Output
   EmptyBG (transparent) ──┘      ▲          ▲            ▲
                                  │          │            │
                            EllipseMask   scale-on    Input (footage)
                            (hollow)      + overshoot
```

The transparent layer + merge builds an RGBA outline that can be scaled as a
unit. Scaling the whole layer (rather than the mask edges) keeps the outline
thickness even as it grows.

```
  0 ── delay ──► draw-on ────────────────── hold ─────────────────►
                 size 0 → 1 + overshoot     1 + (optional pulse)
```

---

## VOXStatCard

```
   ImgXf ──► Merge bar ──► Merge value ──► Merge label ──► Merge guide ──► Output
                 ▲              ▲                ▲              ▲
            BarMask         TextPlus         TextPlus       Anchor mask
            width wipe      fade + rise      fade + rise    (Edit Mode only)
```

```
  0 ── delay ──► ▇▇▇▇▇▇  bar wipes wide
                 └► 1.2M   number fades and rises
                       └► people affected   label follows
                       ↑ stagger between each step
```

Each element's opacity comes from its `Merge.Blend`, so nothing depends on a
text-specific fade control.

---

## VOXMapFocus

```
   ImgXf ──┬──► Merge dim ──► Merge bright ──► Merge dot ──► Merge guide ──► Output
           │        ▲              ▲                ▲              ▲
           │    black @ 55%    ImgXf through    EllipseMask    region outline
           │                   RegionMask       (pulsing)
           └──────────────────────┘
```

The bright region is the *original* image merged back on top of the dimmed one
through the region mask, so it is full quality, not brightened.

```
   dim:    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
   region: ░░░░░░░░██████████░░░░░░░░░░░░░░░   full brightness
   dot:    ░░░░░░░░█████◉████░░░░░░░░░░░░░░░   pulse 1 ± 15%
```

---

## VOXHighlightBar

```
   ImgXf ──► Merge bar ──► Merge guide ──► Output
                 ▲              ▲
            BarMask        Anchor outline
            width = W × p   (Edit Mode only)
```

```
  p=0        p=0.5              p=1
  │           ████████          ████████████████
  left edge fixed ─────────────────────────────►
```

The bar's **left edge stays put** while its width grows, which is what makes it
read as a wipe rather than a scale-up.

---

## VOXPhotoCard

Built in five passes, bottom to top:

```
  1. shadow    black rect + ShadowMask ──► Blur ──► over image
  2. paper     WhiteBG + CardMask ──► over the shadow
  3. photo     input scaled to cover ──► cropped by PhotoMask ──► over the paper
  4. card      Master Transform: rotate + slide, Pivot = card centre
  5. guide     yellow outline when Edit Mode = ON
```

```
  ┌─────────────────────────┐
  │ ░░░░░░░░░░░░░░░░░░░░░░░ │  ← paper inset
  │ ░┌───────────────────┐░ │
  │ ░│                   │░ │  ← photo (covers, then cropped)
  │ ░│      picture      │░ │
  │ ░│                   │░ │
  │ ░└───────────────────┘░ │
  └─────────────────────────┘
     ╲ soft shadow offset down-right
```

```
  0 ── delay ──► slide in from chosen side ──► settle (+ overshoot) ──► hold
```

---

## Adding your own

Copy any file, rename both the tool name (`ActiveTool` and the `MacroOperator`
key) and the filename, and it appears as a new effect. If you only want a
preset of an existing effect, duplicate the file and change the default `Value`
of the controls instead — see [../../README.md](../../README.md#templates-and-presets).
