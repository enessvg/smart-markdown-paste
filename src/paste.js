'use strict';

function commonIndent(lines) {
  const meaningful = lines.filter((line) => line.trim().length > 0);
  if (meaningful.length === 0) return '';
  let prefix = (meaningful[0].match(/^[\t ]*/) || [''])[0];
  for (const line of meaningful.slice(1)) {
    const current = (line.match(/^[\t ]*/) || [''])[0];
    let shared = 0;
    while (shared < prefix.length && shared < current.length && prefix[shared] === current[shared]) shared++;
    prefix = prefix.slice(0, shared);
    if (!prefix) break;
  }
  return prefix;
}

function alignPaste(clipboardText, destinationIndent, eol = '\n') {
  const lines = clipboardText.replace(/\r\n?/g, '\n').split('\n');
  const shared = commonIndent(lines);
  return lines.map((line, index) => {
    if (!line.trim()) return '';
    const dedented = line.slice(shared.length);
    return index === 0 ? dedented : destinationIndent + dedented;
  }).join(eol);
}

function getDestinationIndent(lineText, column) {
  const indent = (lineText.match(/^[\t ]*/) || [''])[0];
  return indent.slice(0, Math.min(indent.length, column));
}

module.exports = { alignPaste, commonIndent, getDestinationIndent };
