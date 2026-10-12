import { cpSync, mkdirSync, mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { root, packagePath, asset, output, manifest, run, capture, sha256, files, tools } from './common.mjs';
tools();
const temporary = mkdtempSync(join(tmpdir(), 'proto-release-'));
try {
  const paths = capture('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard']).split('\0').filter(Boolean);
  for (const path of new Set(paths)) {
    if (path.split('/').includes('node_modules') || path.startsWith(`${packagePath}/dist/`) || path === 'package-lock.json') continue;
    const destination = join(temporary, path);
    mkdirSync(join(destination, '..'), { recursive: true });
    cpSync(join(root, path), destination);
  }
  run('pnpm', ['install', '--frozen-lockfile'], { cwd: temporary });
  run('pnpm', ['run', 'build'], { cwd: temporary });
  const built = join(temporary, packagePath, 'dist');
  const baselinePaths = capture('git', ['ls-tree', '-r', '--name-only', 'HEAD', `${packagePath}/dist`]).split('\n');
  assert.deepEqual(files(built), baselinePaths.map(path => path.slice(`${packagePath}/dist/`.length)).sort(), 'dist file inventory changed');
  for (const path of baselinePaths) {
    const baseline = run('git', ['show', `HEAD:${path}`], { stdio: 'pipe', encoding: null });
    assert.deepEqual(readFileSync(join(temporary, path)), baseline, `Generated output changed: ${path}`);
  }
  mkdirSync(output, { recursive: true });
  run('pnpm', ['pack', '--out', join(output, asset)], { cwd: join(temporary, packagePath) });
  const digest = sha256(join(output, asset));
  writeFileSync(join(output, 'SHA256SUMS'), `${digest}  ${asset}\n`);
  const provenance = {
    package: manifest.name, version: manifest.version,
    sourceCommit: capture('git', ['rev-parse', 'HEAD']),
    worktreeDirty: Boolean(capture('git', ['status', '--porcelain'])),
    tools: { node: process.versions.node, pnpm: '10.15.0', typescript: '5.9.2', bunConsumer: '1.4.3' },
    artifact: { name: asset, sha256: digest },
    dist: Object.fromEntries(files(built).map(path => [path, sha256(join(built, path))]))
  };
  writeFileSync(join(output, 'provenance.json'), JSON.stringify(provenance, null, 2) + '\n');
  console.log(`Prepared ${asset} (${digest})`);
} finally { rmSync(temporary, { recursive: true, force: true }); }
