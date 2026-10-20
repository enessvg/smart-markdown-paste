'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { alignPaste, commonIndent, getDestinationIndent } = require('../src/paste');

test('aligns each next line at four destination tabs', () => {
  assert.equal(alignPaste('ilk\nikinci\nucuncu', '\t\t\t\t'),
    'ilk\n\t\t\t\tikinci\n\t\t\t\tucuncu');
});

test('does not prepend indentation to first line', () => {
  assert.equal(alignPaste('ilk\nikinci', '    '), 'ilk\n    ikinci');
});

test('removes common indentation and retains deeper indentation', () => {
  assert.equal(alignPaste('  A\n    B\n  C', '\t'), 'A\n\t  B\n\tC');
});

test('does not introduce spaces on blank lines', () => {
  assert.equal(alignPaste('A\n  \nB\n', '  '), 'A\n\n  B\n');
});

test('works with CRLF clipboard and CRLF document', () => {
  assert.equal(alignPaste('A\r\nB\r\nC', '  ', '\r\n'), 'A\r\n  B\r\n  C');
});

test('matches shared tab indentation safely', () => {
  assert.equal(commonIndent(['\tfoo', '\t  bar']), '\t');
  assert.equal(commonIndent(['  foo', '\tbar']), '');
});

test('preserves the existing line indentation', () => {
  assert.equal(getDestinationIndent('\t\t\t\tcontent', 6), '\t\t\t\t');
  assert.equal(getDestinationIndent('\t\t\t\tcontent', 2), '\t\t');
  assert.equal(getDestinationIndent('  - thing', 6), '  ');
});

test('preserves inner clipboard relative nesting', () => {
  assert.equal(alignPaste('- one\n  - sub\n- two', '\t'), '- one\n\t  - sub\n\t- two');
});
