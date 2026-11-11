# Custom Effects in DaVinci Resolve

Install a Fusion effect so it appears in DaVinci Resolve's **Edit** page and can be used on an **Adjustment Clip**.

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