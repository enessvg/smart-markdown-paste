# Smart Markdown Paste

A small, auditable VS Code extension that aligns multi-line Markdown pastes with your cursor's indentation, while preserving relative indentation.

## Example

With the cursor after four tabs:

```text
                |
```

Pasting:

```text
first
  nested
last
```

Produces:

```text
                first
                  nested
                last
```

Use the normal **Cmd+V** (macOS) or **Ctrl+V** (Windows/Linux). Only Markdown editors are affected.

## Features

- Preserves relative indentation in pasted text
- Supports spaces, tabs, LF and CRLF
- Native paste fallback for single-line text and multi-cursor spread
- Configurable via `smartMarkdownPaste.enabled` (default: true)
- No network requests, telemetry, or runtime dependencies

**Note:** Intercepting Markdown paste may interfere with rich paste and other extensions' paste handlers for multi-line content.

## Run locally

Open the repository in VS Code, press **F5**, and test Markdown paste in the Extension Development Host.

Run unit tests:

```bash
npm test
```

## Install locally

```bash
npx @vscode/vsce package --no-dependencies
code --install-extension smart-markdown-paste-0.1.0.vsix
```

The VSIX packaging utility is used only during packaging.

## Security

The runtime uses only the VS Code API: `vscode.env.clipboard.readText` and `TextEditor.edit`. No external network or analytics code.

## License

MIT.
