# Manual Testing Guide - Story 1.1.2

## Chrome Extension Loading Test

### Prerequisites
- Chrome browser version 114 or higher
- Extension built successfully (`npm run build` completed without errors)

### Testing Steps

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions`
   - Enable "Developer mode" (toggle in top-right corner)

2. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to: `/Users/rubens/Documents/GitHub/QBIt/svelte-extension/build/`
   - Select the `build` folder

3. **Verify Extension Loads Without Errors**
   - Extension should appear in the extensions list
   - Check for any error messages (should be none)
   - Status should show "Enabled"

4. **Verify Extension Icon**
   - Extension icon should appear in Chrome toolbar
   - Icon should match the placeholder icon (based on favicon.png)

5. **Test Side Panel Opens**
   - Click the extension icon in the toolbar
   - Side panel should open on the right side of the browser window
   - Panel should display the SvelteKit app interface

6. **Verify Service Worker Registration**
   - In chrome://extensions, find "QB Chrome Extension"
   - Click "service worker" link (should show as "active")
   - Check DevTools console - should show: "QB Chrome Extension installed"

7. **Check for CSP Violations**
   - Open DevTools (F12) while side panel is open
   - Check Console tab for any CSP (Content Security Policy) errors
   - Should be no errors related to wasm-unsafe-eval or script execution

### Expected Results

✅ No manifest errors in chrome://extensions
✅ Extension icon visible in Chrome toolbar
✅ Side panel opens when clicking icon
✅ Side panel displays SvelteKit app without errors
✅ Service worker registers and logs installation message
✅ No CSP violations in DevTools Console
✅ Side panel persists when switching browser tabs

### Acceptance Criteria Mapping

- **AC #1**: manifest.json exists in build/ folder ✅ (verified programmatically)
- **AC #2**: Manifest version 3 with required permissions ✅ (verified programmatically)
- **AC #3**: Service worker configured as background script ✅ (test steps 6)
- **AC #4**: Side Panel API configured with default path ✅ (test steps 5)
- **AC #5**: Content Security Policy allows Svelte bundle execution ✅ (test step 7)
- **AC #6**: Extension loads in Chrome without manifest errors ✅ (test steps 1-7)

### Troubleshooting

**Issue**: Extension fails to load
- Verify build directory exists and contains all required files
- Check manifest.json is valid JSON
- Ensure Chrome version is 114+

**Issue**: Side panel doesn't open
- Check service worker is active in chrome://extensions
- Verify no errors in service worker DevTools
- Try reloading the extension

**Issue**: CSP errors appear
- Verify manifest.json has correct CSP configuration
- Check that inline scripts were extracted by adapter
- Confirm build process completed successfully
