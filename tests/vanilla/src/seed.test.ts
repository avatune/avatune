import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import ashleyTheme from '@avatune/ashley-seo-theme/vanilla'
import ashleyyTheme from '@avatune/ashleyy-theme/vanilla'
import fatinVerseTheme from '@avatune/fatin-verse-theme/vanilla'
import kyuteTheme from '@avatune/kyute-theme/vanilla'
import micahTheme from '@avatune/micah-theme/vanilla'
import miniavsTheme from '@avatune/miniavs-theme/vanilla'
import nevmstasTheme from '@avatune/nevmstas-theme/vanilla'
import pacovqzzTheme from '@avatune/pacovqzz-theme/vanilla'
import pawelOlekManTheme from '@avatune/pawel-olek-man-theme/vanilla'
import pawelOlekWomanTheme from '@avatune/pawel-olek-woman-theme/vanilla'
import { avatar } from '@avatune/vanilla'
import yanliuTheme from '@avatune/yanliu-theme/vanilla'

import { SEEDS } from './seeds.js'
import { cleanupTmpDir, saveTmpPng, setupTmpDir, svgToPng } from './utils.js'

import '@blazediff/bun'

const THEMES = {
  'ashley-seo': ashleyTheme,
  ashleyy: ashleyyTheme,
  'fatin-verse': fatinVerseTheme,
  kyute: kyuteTheme,
  micah: micahTheme,
  miniavs: miniavsTheme,
  nevmstas: nevmstasTheme,
  pacovqzz: pacovqzzTheme,
  'pawel-olek-man': pawelOlekManTheme,
  'pawel-olek-woman': pawelOlekWomanTheme,
  yanliu: yanliuTheme,
} as const

beforeAll(async () => {
  await setupTmpDir()
})

afterAll(async () => {
  if (!process.env.CI) {
    await cleanupTmpDir()
  }
})

describe('Seed Avatar Snapshot Tests', () => {
  for (const [themeName, theme] of Object.entries(THEMES)) {
    describe(`Theme: ${themeName}`, () => {
      for (let i = 0; i < SEEDS.length; i++) {
        const seed = SEEDS[i]

        test(`seed ${i + 1}: ${seed}`, async () => {
          const svg = avatar({
            theme,
            seed,
            size: 400,
          })

          const pngBuffer = await svgToPng(svg, 400)

          const id = `${themeName}-seed-${i + 1}`
          const filePath = await saveTmpPng(pngBuffer, `${id}.png`)

          expect(filePath).toMatchImageSnapshot({
            method: 'bin',
            snapshotIdentifier: id,
            snapshotsDir: `./__snapshots__/seed/${themeName}`,
          })
        })
      }
    })
  }
})
