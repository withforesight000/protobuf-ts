import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkTag, checkExistingRelease } from './guard-release.mjs';
import { verifyRelease } from './verify-release.mjs';
import { output, asset, tag } from './common.mjs';
test('Tag mismatch and preexisting releases fail closed', () => {
  checkTag(tag); checkExistingRelease(404);
  assert.throws(() => checkTag('tempgrpcd-protos-v99.0.0'));
  for (const status of [200, 401, 403, 500]) assert.throws(() => checkExistingRelease(status));
});
test('Tampered artifact, source commit and dirty provenance are rejected', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'proto-negative-'));
  try {
    cpSync(output, temporary, { recursive: true });
    const path = join(temporary, 'provenance.json');
    const original = JSON.parse(readFileSync(path));
    writeFileSync(path, JSON.stringify({ ...original, sourceCommit: '0'.repeat(40) }));
    assert.throws(() => verifyRelease(temporary), /Source commit mismatch/);
    writeFileSync(path, JSON.stringify({ ...original, worktreeDirty: true }));
    assert.throws(() => verifyRelease(temporary), /clean checkout/);
    writeFileSync(path, JSON.stringify(original));
    writeFileSync(join(temporary, asset), 'tampered');
    assert.throws(() => verifyRelease(temporary), /checksum mismatch/);
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});
