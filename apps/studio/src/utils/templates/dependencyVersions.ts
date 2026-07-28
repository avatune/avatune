/**
 * Third-party versions written into generated asset and theme packages.
 *
 * They must match the versions the monorepo already uses, otherwise a freshly
 * generated package fails `syncpack lint`. `bun run generate:studio` runs
 * `syncpack fix` after writing, so drift here is corrected in the monorepo —
 * but standalone Studio downloads only get what is listed below.
 */
export const dependencyVersions = {
  '@rsbuild/core': '^1.6.12',
  '@rsbuild/plugin-react': '^1.4.2',
  '@rsbuild/plugin-solid': '^1.0.5',
  '@rsbuild/plugin-svelte': '^1.0.10',
  '@rsbuild/plugin-svgr': '^1.2.2',
  '@rsbuild/plugin-vue': '^1.2.0',
  '@rslib/core': '^0.16.1',
  '@types/node': '^24.9.1',
  colord: '^2.9.3',
  react: '19.2.8',
  'solid-js': '^1.9.11',
  svelte: '^5.43.8',
  svgo: '^4.0.0',
  typescript: '^5.9.3',
  vue: '^3.5.25',
} as const
