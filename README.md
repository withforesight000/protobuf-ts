# Protobuf TypeScript SDK

`@withforesight/tempgrpcd-protos` contains generated TypeScript types, runtime
messages and the tempgrpcd service client. The package is ESM and targets bundlers
and Bun; native Node ESM resolution is not part of the compatibility guarantee.

## Fixed release dependency

Use the versioned GitHub Release asset, not the repository source archive or a
`latest` URL:

```json
{
  "dependencies": {
    "@withforesight/tempgrpcd-protos": "https://github.com/withforesight000/protobuf-ts/releases/download/tempgrpcd-protos-v0.1.0/tempgrpcd-protos-0.1.0.tgz"
  }
}
```

Run your package manager's initial install and commit its lockfile. Subsequent
installs should use frozen mode. The SDK's dependency ranges remain `^2.11.1`;
this repository's pnpm lockfile does not constrain downstream resolution. The
compatibility fixture pins runtime/runtime-rpc 2.11.1 and TypeScript 5.9.2.
Consumer installation needs no SDK build step or install script permission.

Release assets include `SHA256SUMS` and `provenance.json`, identifying the exact
source commit, build tools and unpacked generated-file hashes. Verify the
checksum before accepting a new version, inspect API changes and update your
consumer lockfile deliberately. This repository does not modify roomtemp.

## Build and test

Use Node.js **24.2.0**, pnpm **10.15.0** and Bun **1.4.3**. `.node-version` and
`packageManager` declare the build tool versions. `BUN_BINARY` can specify the
absolute Bun executable path when your default tool shim selects another version.

```sh
pnpm install --frozen-lockfile
pnpm run build
pnpm run release:prepare
pnpm run test:package
pnpm run test:guards
```

`release:prepare` copies tracked/current source into a temporary clean directory,
installs frozen dependencies, rebuilds without existing `dist`, compares every
generated JS/declaration byte with the checked-in baseline, and writes assets to
ignored `releases/`. For intentional future generated-code updates, review and
commit `dist` before preparing the release. Compressed archive bytes need not be
identical across builds; unpacked generated files must match the reviewed source.

`test:package` checks the actual tarball, license notices, a fixed binary fixture,
map/Timestamp/uint64 roundtrips, type resolution and a second frozen install in an
isolated Bun consumer. Its PATH excludes the build Node executable. No JSON
fallback is used. `test:guards` exercises publication failure cases.

## Release procedure

1. Review changes and merge them into GitHub `main`. Confirm Package CI passes.
2. Change the package version for subsequent releases and review/commit any
   intentional generated-code changes. Run the preparation and validation above
   from a clean checkout.
3. Create and push a new `tempgrpcd-protos-v<VERSION>` tag on that main commit.
   The workflow rejects version mismatches, non-main commits and existing releases.
4. The workflow builds and validates, creates a draft with all three assets,
   re-downloads and compares them with authentication, then publishes.
5. Anonymous download/checksum checks and a fresh URL-based Bun consumer must pass:

   ```sh
   pnpm run test:release
   ```

Enable GitHub release immutability when available. Never move an existing tag or
replace published assets. Failed pre-publication runs retain their draft for
inspection; automatic reruns refuse existing drafts as well. Investigate and
use a new patch version rather than silently replacing artifacts. If post-publication
validation fails, retain the release, report the failure and stop downstream
adoption until a corrected new version passes.

## Licenses

The SDK is MIT licensed. Each package includes its license and the Google
Protocol Buffers notice in `THIRD_PARTY_NOTICES`.
