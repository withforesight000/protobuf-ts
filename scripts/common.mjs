import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const packagePath = 'packages/tempgrpcd-protos';
export const manifest = JSON.parse(readFileSync(join(root, packagePath, 'package.json')));
export const tag = `tempgrpcd-protos-v${manifest.version}`;
export const asset = `tempgrpcd-protos-${manifest.version}.tgz`;
export const output = join(root, 'releases');
export function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed (${result.status})`);
  return typeof result.stdout === 'string' ? result.stdout.trim() : result.stdout;
}
export const capture = (command, args, options = {}) => run(command, args, { ...options, stdio: 'pipe' });
export const sha256 = file => createHash('sha256').update(readFileSync(file)).digest('hex');
export function files(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = join(prefix, entry.name);
    return entry.isDirectory() ? files(join(directory, entry.name), name) : [name];
  }).sort();
}
export function tools() {
  if (process.versions.node !== '24.2.0') throw new Error('Use Node.js 24.2.0');
  if (capture('pnpm', ['--version']) !== '10.15.0') throw new Error('Use pnpm 10.15.0');
}
