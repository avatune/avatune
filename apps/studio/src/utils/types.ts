import type { Asset } from '../types'

export interface AssetFile {
  category: string
  name: string
  fileName: string
  asset: Asset
}
