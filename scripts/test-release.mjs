import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { asset, tag } from './common.mjs';
import { verifyRelease } from './verify-release.mjs';
import { testPackage } from './test-package.mjs';
const base = `https://github.com/withforesight000/protobuf-ts/releases/download/${tag}`;
const temporary = mkdtempSync(join(tmpdir(), 'proto-public-release-'));
try {
  for (const name of [asset, 'SHA256SUMS', 'provenance.json']) {
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(`${base}/${name}`, { signal: AbortSignal.timeout(30000) });
      if (response.ok) break;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 3000));
    }
    if (!response.ok) throw new Error(`Public download failed: ${name} (${response.status})`);
    writeFileSync(join(temporary, name), Buffer.from(await response.arrayBuffer()));
  }
  verifyRelease(temporary);
  testPackage(join(temporary, asset), `${base}/${asset}`);
  console.log(`Verified public release: ${tag}`);
} finally { rmSync(temporary, { recursive: true, force: true }); }
