# Extension Support in S Browser

S Browser loads unpacked extensions from:

- `%APPDATA%/S Browser/extensions` (Windows)
- equivalent `userData/extensions` path on other platforms

## Workflow

1. Get an unpacked extension folder (contains `manifest.json`).
2. Place it inside the extensions directory.
3. Restart S Browser.
4. Open the **Extensions** modal to verify it is loaded.

## Notes

- Extension loading is intentionally local-only for development/prototyping.
- Packed `.crx` install UI is not included in this iteration.
