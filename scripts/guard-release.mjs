import assert from 'node:assert/strict';
import { capture, tag, manifest } from './common.mjs';
export function checkTag(actual) {
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(actual, tag, 'Tag and package version must match');
}
export function checkExistingRelease(status) {
  assert.equal(status, 404, 'Release already exists or API check failed; never overwrite');
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  checkTag(process.env.RELEASE_TAG);
  const commit = capture('git', ['rev-parse', 'HEAD']);
  assert.equal(capture('git', ['rev-parse', `${tag}^{commit}`]), commit, 'Tag commit mismatch');
  capture('git', ['merge-base', '--is-ancestor', commit, 'origin/main']);
  assert.equal(capture('git', ['status', '--porcelain']), '', 'Dirty checkout');
  const response = await fetch(`https://api.github.com/repos/withforesight000/protobuf-ts/releases/tags/${tag}`, {
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GH_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28' },
    signal: AbortSignal.timeout(30000)
  });
  checkExistingRelease(response.status);
}
