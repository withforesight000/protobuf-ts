import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { asset, manifest, output, capture, sha256 } from './common.mjs';
export function verifyRelease(directory = output) {
  const checksum = readFileSync(join(directory, 'SHA256SUMS'), 'utf8');
  assert.match(checksum, new RegExp(`^[a-f0-9]{64}  ${asset.replaceAll('.', '\\.')}\\n$`));
  const digest = sha256(join(directory, asset));
  assert.equal(checksum.slice(0, 64), digest, 'Artifact checksum mismatch');
  const provenance = JSON.parse(readFileSync(join(directory, 'provenance.json')));
  assert.equal(provenance.sourceCommit, capture('git', ['rev-parse', 'HEAD']), 'Source commit mismatch');
  assert.equal(provenance.worktreeDirty, false, 'Release must come from a clean checkout');
  assert.equal(provenance.package, manifest.name);
  assert.equal(provenance.version, manifest.version);
  assert.deepEqual(provenance.artifact, { name: asset, sha256: digest });
  return provenance;
}
if (process.argv[1] === new URL(import.meta.url).pathname) verifyRelease(process.argv[2] ? resolve(process.argv[2]) : output);
