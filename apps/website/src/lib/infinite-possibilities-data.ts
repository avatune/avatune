export type PackSummary = {
  name: string
  description: string
  combinations: number
}

export const PACK_SUMMARIES: PackSummary[] = [
  {
    name: 'Miniavs',
    description: 'Compact gradients with punchy outlines.',
    combinations: 1296,
  },
  {
    name: 'Yanliu',
    description: 'Editorial palettes with flowing hairstyles.',
    combinations: 2376,
  },
  {
    name: 'Nevmstas',
    description: 'Rounded geometry made for product UI.',
    combinations: 8064,
  },
  {
    name: 'Micah',
    description: 'Bold lines with playful accessories.',
    combinations: 129024,
  },
]

export const TOTAL_COMBINATIONS = PACK_SUMMARIES.reduce(
  (sum, pack) => sum + pack.combinations,
  0,
)
