import assert from 'node:assert/strict'
import { test } from 'node:test'

import { isTabId, parseOwnedLines } from '../src/views/Soulforge/progress.ts'

test('old paired slots keep progress on item one, while item two remains independent', () => {
  const owned = parseOwnedLines(
    JSON.stringify({ 'earrings|Move Speed %': true, 'rings|Attack': true, 'earring-2|Might': true }),
  )
  assert.deepEqual(owned, { 'earring-1|Move Speed %': true, 'ring-1|Attack': true, 'earring-2|Might': true })
  assert.equal(owned['earring-2|Move Speed %'], undefined)
  assert.deepEqual(parseOwnedLines(JSON.stringify(owned)), owned)
})

test('explicit new-slot values win over legacy keys and Increase keeps its tick', () => {
  const owned = parseOwnedLines(
    JSON.stringify({
      'earrings|Attack': true,
      'earring-1|Attack': false,
      'helmet|Attack increase %': true,
      'pauldrons|Defense increase %': true,
    }),
  )
  assert.equal(owned['earring-1|Attack'], false)
  assert.equal(owned['helmet|Attack Increase %'], true)
  assert.equal(owned['pauldrons|Defense Increase %'], true)
})

test('invalid browser data cannot become checklist state', () => {
  for (const value of [null, '', '{broken', 'null', '[]', '42']) assert.deepEqual(parseOwnedLines(value), {})
  assert.deepEqual(parseOwnedLines('{"chest|Attack":"true","ring-1|Attack":true}'), { 'ring-1|Attack': true })
  for (const value of [null, undefined, 'sources', 'basic ']) assert.equal(isTabId(value), false)
  for (const value of ['dps', 'basic', 'bracelet']) assert.equal(isTabId(value), true)
})
