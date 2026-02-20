# Creating the S Browser Windows Installer

S Browser uses **electron-builder** with an NSIS target.

## Prerequisites

- Node.js 18+
- npm

## Build commands

```bash
npm install
npm run dist:win
```

## Output

- Installer: `dist/S-Browser-Setup-<version>.exe`

## Config source

- `electron-builder.yml`

Current installer behavior:

- x64 Windows build
- NSIS installer
- User can choose installation directory
- Desktop + Start Menu shortcuts are created
