# QB Chrome Extension - Testing Guide

Quick guide to load and test the extension in Chrome.

---

## 🚀 Load Extension in Chrome

### 1. Build the Extension
```bash
cd svelte-extension
npm run build
```

### 2. Load in Chrome

1. Open Chrome and navigate to:
   ```
   chrome://extensions
   ```

2. **Enable Developer Mode** (toggle in top-right corner)

3. Click **"Load unpacked"**

4. Select the build folder:
   ```
   /Users/rubens/Documents/GitHub/QBIt/svelte-extension/build
   ```

5. Verify extension appears in list as **"QB Chrome Extension"**

---

## 📱 Open the Side Panel

The extension uses Chrome's Side Panel API. To open it:

**Method 1: Extension Icon**
- Click the puzzle piece icon in Chrome toolbar
- Find "QB Chrome Extension"
- Click the pin icon to pin it to toolbar
- Click the extension icon → Side panel opens

**Method 2: Right-click**
- Right-click the extension icon
- Select "Open side panel"

**Method 3: Side Panel Menu**
- Look for side panel icon in Chrome toolbar (rectangle with lines)
- Click it and select QB Chrome Extension

---

## ✅ Testing Story 1.1.3: Design System

### What to Test

Once the side panel opens, you'll see the navigation page with two test links.

**Click: 🎨 Design System Showcase**

This takes you to `/test-components` where you can verify:

#### Color Palettes
- [ ] Primary (Blue): 10 shades from 50-900
- [ ] Secondary (Slate/Gray): 10 shades
- [ ] Success (Green): 10 shades
- [ ] Error (Red): 10 shades
- All colors should render as colored squares

#### Typography
- [ ] Text sizes: XS through 4XL (8 sizes total)
- [ ] Font: Inter (check in DevTools: Inspect → Computed → font-family)
- [ ] System fallback works if Inter fails to load

#### Button Components
- [ ] Primary buttons: filled, ghost, outlined, disabled
- [ ] Success buttons: filled, ghost, outlined
- [ ] Error buttons: filled, ghost, outlined
- [ ] Secondary buttons: filled, ghost, outlined
- [ ] Button sizes: small, medium, large
- [ ] Hover effects work

#### Form Components
- [ ] Text input (can type)
- [ ] Email input (can type)
- [ ] Select dropdown (can select)
- [ ] Textarea (can type)
- [ ] Checkboxes (can check/uncheck)
- [ ] Radio buttons (can select)

#### Spacing & Border Radius
- [ ] Spacing scale displays (4px increments)
- [ ] Border radius variants (sm, default, lg, xl, 2xl)

#### Dark Mode Infrastructure
- [ ] Documentation shows dark mode is configured but not enabled
- [ ] Can verify in DevTools: check for `.dark` CSS classes

---

## ✅ Testing Story 1.1.4: Svelte Stores

### What to Test

From the navigation page:

**Click: 📦 Store Reactivity Tests**

This takes you to `/test-stores` where you can verify:

#### Vendor Store
- [ ] Click "Add Test Vendor" button
- [ ] Vendor count increases
- [ ] New vendor appears in list (sorted alphabetically)
- [ ] Check Chrome Storage: DevTools → Application → Storage → Extension Storage
- [ ] Verify 'vendors' key exists with data

#### Bill Store
- [ ] Add a vendor first (needs vendor to create bill)
- [ ] Click "Add Test Bill" button
- [ ] Bill count increases
- [ ] New bill appears in list
- [ ] Check Chrome Storage for 'bill-cache' key

#### Preferences Store
- [ ] Click "Toggle Theme" button
- [ ] Theme value changes (light → dark → system → light)
- [ ] Check Chrome Storage for 'user-preferences' key
- [ ] Note: This uses chrome.storage.sync (syncs across devices)

#### Backend URL Store
- [ ] Click "Set Test URL" button
- [ ] Backend URL shows: http://localhost:3000
- [ ] Status may show "disconnected" or "error" (no actual backend running)
- [ ] Check Chrome Storage for 'backend-url' key

#### Storage Quota
- [ ] Click "Check Quota" button
- [ ] Bytes Used updates (should be small initially)
- [ ] Percent Used shows (should be <1%)
- [ ] Status shows "OK" (green)

#### Reactivity Verification
- [ ] All values update immediately when buttons clicked (no page refresh)
- [ ] Counts update in real-time
- [ ] This proves Svelte store reactivity is working

---

## 🔍 DevTools Inspection

### Check Chrome Storage

1. Open DevTools (F12 or right-click → Inspect)
2. Go to **Application** tab
3. Expand **Storage** in left sidebar
4. Click **Extension Storage** → QB Chrome Extension
5. Verify keys exist:
   - `vendors` (local storage)
   - `bill-cache` (local storage)
   - `user-preferences` (sync storage)
   - `backend-url` (local storage)

### Check CSS Variables

1. Open DevTools
2. Go to **Elements** tab
3. Select `<html>` element
4. Go to **Computed** tab
5. Scroll down to see CSS variables like:
   - `--color-primary-500`
   - `--font-family-sans`
   - `--spacing-*`
   - `--radius-*`

### Check Network/Console

- **Console** tab: Should have no errors (warnings are okay)
- **Network** tab: Inter font should load from Google Fonts

---

## ✅ Review Checklist

### Story 1.1.3: Design System ✓
- [ ] All color palettes render correctly
- [ ] Inter font loads and applies
- [ ] All button variants work and have hover states
- [ ] All form components are interactive
- [ ] Spacing and border radius scales display
- [ ] Dark mode CSS classes exist
- [ ] No console errors

### Story 1.1.4: Stores ✓
- [ ] Vendor store: add/update/display works
- [ ] Bill store: add/display works
- [ ] Preferences store: update works
- [ ] Backend URL store: set works
- [ ] Storage quota check works
- [ ] All values update reactively (no refresh needed)
- [ ] Chrome Storage keys exist in DevTools
- [ ] No console errors

---

## 🐛 Troubleshooting

### Extension won't load
- Check build completed successfully (`npm run build`)
- Verify you selected the `build/` folder, not `src/`
- Check for errors in chrome://extensions

### Side panel won't open
- Ensure Chrome version is 114+ (Side Panel API requirement)
- Try right-click → "Open side panel"
- Check extension permissions in manifest

### Stores not persisting
- Open DevTools console and check for chrome.storage errors
- Verify 'storage' permission in manifest.json
- Check Application → Storage → Extension Storage

### Fonts not loading
- Check Network tab for failed requests
- Verify Google Fonts URL in app.css
- System fonts should work as fallback

---

## 📋 Mark Stories as Done

Once testing is complete and all checklist items pass:

1. Update story status files:
   - `docs/stories/1-1-3-implement-skeleton-ui-design-system.md` → Status: done
   - `docs/stories/1-1-4-create-svelte-stores-for-state-management.md` → Status: done

2. Update sprint status:
   - `docs/sprint-status.yaml`:
     - `1-1-3-implement-skeleton-ui-design-system: done`
     - `1-1-4-create-svelte-stores-for-state-management: done`

3. Move to next story!

---

## 🎉 Success Criteria

Both stories are **DONE** when:
- ✅ Extension loads without errors
- ✅ All test pages accessible via navigation
- ✅ All visual components render correctly
- ✅ All interactive elements work
- ✅ Store reactivity verified
- ✅ Chrome Storage persistence confirmed
- ✅ No console errors
- ✅ Documentation reviewed and accurate
