import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { root, output, asset, manifest, capture, run, files, sha256 } from './common.mjs';
export function testPackage(tarball = join(output, asset), dependency = `file:${resolve(tarball)}`) {
  const bun = process.env.BUN_BINARY || capture('which', ['bun']);
  assert.equal(capture(bun, ['--version']), '1.4.3', 'Use Bun 1.4.3');
  const temporary = mkdtempSync(join(tmpdir(), 'proto-consumer-'));
  try {
    const names = capture('tar', ['-tzf', tarball]).split('\n');
    assert(names.every(name => name.startsWith('package/') && !name.split('/').includes('..') && !name.includes('node_modules')), 'Unexpected tarball path');
    run('tar', ['-xzf', tarball, '-C', temporary]);
    const packed = join(temporary, 'package');
    const p = JSON.parse(readFileSync(join(packed, 'package.json')));
    assert.equal(p.name, manifest.name); assert.equal(p.version, manifest.version);
    assert.deepEqual(p.exports, manifest.exports);
    assert.deepEqual(p.dependencies, manifest.dependencies);
    assert(!p.scripts?.prepare && !p.scripts?.install && !p.scripts?.postinstall, 'Consumer must not build package');
    for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES']) assert.equal(readFileSync(join(packed, name), 'utf8'), readFileSync(join(root, 'packages/tempgrpcd-protos', name), 'utf8'));
    const baseline = capture('git', ['ls-tree', '-r', '--name-only', 'HEAD', 'packages/tempgrpcd-protos/dist']).split('\n').map(path => path.slice('packages/tempgrpcd-protos/'.length));
    assert.deepEqual(files(join(packed, 'dist')).map(path => `dist/${path}`), baseline.sort());
    for (const path of baseline) {
      assert.deepEqual(readFileSync(join(packed, path)), run('git', ['show', `HEAD:packages/tempgrpcd-protos/${path}`], { stdio: 'pipe', encoding: null }), `Packed output changed: ${path}`);
    }
    const consumer = join(temporary, 'consumer'); mkdirSync(consumer);
    writeFileSync(join(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: { [manifest.name]: dependency, typescript: '5.9.2', '@protobuf-ts/runtime': '2.11.1', '@protobuf-ts/runtime-rpc': '2.11.1' }, overrides: { '@protobuf-ts/runtime': '2.11.1', '@protobuf-ts/runtime-rpc': '2.11.1' }, trustedDependencies: [] }));
    writeFileSync(join(consumer, 'bunfig.toml'), '[install]\nlinker = "isolated"\n[run]\nbun = true\n');
    cpSync(join(root, 'scripts/fixtures'), consumer, { recursive: true });
    const env = { ...process.env, PATH: dirname(bun), BUN_INSTALL_CACHE_DIR: join(temporary, 'cache') };
    run(bun, ['install'], { cwd: consumer, env });
    const digest = sha256(join(consumer, 'bun.lock'));
    for (const name of ['@protobuf-ts/runtime', '@protobuf-ts/runtime-rpc', 'typescript']) {
      const actual = JSON.parse(readFileSync(join(consumer, 'node_modules', name, 'package.json'))).version;
      assert.equal(actual, name === 'typescript' ? '5.9.2' : '2.11.1');
    }
    rmSync(join(consumer, 'node_modules'), { recursive: true });
    run(bun, ['install', '--frozen-lockfile'], { cwd: consumer, env });
    assert.equal(sha256(join(consumer, 'bun.lock')), digest);
    run(bun, ['--bun', 'node_modules/typescript/bin/tsc', '--noEmit', '--strict', '--skipLibCheck', '--moduleResolution', 'bundler', '--module', 'esnext', '--target', 'es2020', 'types.ts'], { cwd: consumer, env });
    run(bun, ['smoke.mjs'], { cwd: consumer, env });
    console.log('Standalone package contents, types, binary fixtures and frozen install passed');
  } finally { rmSync(temporary, { recursive: true, force: true }); }
}
if (process.argv[1] === new URL(import.meta.url).pathname) testPackage();
