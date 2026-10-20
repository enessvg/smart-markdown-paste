'use strict';

const vscode = require('vscode');
const { alignPaste, getDestinationIndent } = require('./paste');

async function nativePaste() {
  await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
}

async function smartPaste() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'markdown' ||
    !vscode.workspace.getConfiguration('smartMarkdownPaste', editor.document.uri).get('enabled', true)) {
    await nativePaste();
    return;
  }

  let clipboardText;
  try {
    clipboardText = await vscode.env.clipboard.readText();
  } catch (_) {
    await nativePaste();
    return;
  }

  if (!clipboardText || !/[\r\n]/.test(clipboardText)) {
    await nativePaste();
    return;
  }

  const selections = editor.selections.slice();
  const lines = clipboardText.replace(/\r\n?/g, '\n').split('\n');
  const spread = vscode.workspace.getConfiguration('editor', editor.document.uri)
    .get('multiCursorPaste', 'spread');

  if (selections.length > 1 && spread === 'spread' &&
      (lines.length === selections.length ||
       (lines.at(-1) === '' && lines.length - 1 === selections.length))) {
    await nativePaste();
    return;
  }

  const doc = editor.document;
  const eol = doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
  const edits = selections.map((selection, index) => {
    const line = doc.lineAt(selection.start.line);
    const indent = getDestinationIndent(line.text, selection.start.character);
    const content = alignPaste(clipboardText, indent, eol);
    return {
      selection,
      content,
      index,
      start: doc.offsetAt(selection.start),
      end: doc.offsetAt(selection.end)
    };
  });

  let offsetDelta = 0;
  for (const item of edits.slice().sort((a, b) => a.start - b.start)) {
    item.caretOffset = item.start + offsetDelta + item.content.length;
    offsetDelta += item.content.length - (item.end - item.start);
  }

  const applied = await editor.edit((builder) => {
    for (const item of edits) builder.replace(item.selection, item.content);
  }, { undoStopBefore: true, undoStopAfter: true });

  if (applied) {
    editor.selections = edits.sort((a, b) => a.index - b.index).map((item) => {
      const position = editor.document.positionAt(item.caretOffset);
      return new vscode.Selection(position, position);
    });
  }
}

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand(
    'smartMarkdownPaste.paste', smartPaste
  ));
}

function deactivate() {}

module.exports = { activate, deactivate };
