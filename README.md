# S Browser

S Browser is a Windows 11-optimized desktop browser concept inspired by Samsung Internet, built with Electron.

## Highlights

- Samsung Internet-inspired dark + glassmorphism top frame
- Desktop-optimized address bar and navigation controls
- Chromium browsing engine (via Electron)
- **Chrome extension support (unpacked extensions)**

## Run locally

```bash
npm install
npm run start
```

## Build Windows installer (.exe)

```bash
npm install
npm run dist:win
```

Installer output will be generated in `dist/`, for example:

- `dist/S-Browser-Setup-0.1.0.exe`

The installer is configured via `electron-builder.yml` (NSIS, x64, user-selectable install path).

## Install Chrome extensions

1. Run S Browser once.
2. Open **Extensions** in the toolbar.
3. Copy an unpacked Chrome extension folder into the shown path.
4. Restart the app to load it.

> Note: Extension compatibility depends on Electron's current Chromium version and API support.

## Tech stack

- Electron
- Electron Builder
- HTML/CSS/JavaScript
