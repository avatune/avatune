export interface AvatarConfig {
  // Canvas settings
  size?: number
  backgroundColor?: string

  // Face
  face?: {
    shape?: 'oval'
    skinTone?: SkinTone
  }

  // Eyes
  eyes?: {
    style?: 'dots'
    color?: EyeColor
  }

  // Eyebrows
  eyebrows?: {
    style?: 'funny'
    color?: HairColor
  }

  // Nose
  nose?: {
    style?: 'curve'
  }

  // Mouth
  mouth?: {
    style?: 'laugh' | 'nervous' | 'smile'
    lipColor?: string
  }

  // Ears
  ears?: {
    style?: 'default'
    visible?: boolean
  }

  // Hair
  hair?: {
    style?: HairStyle
    color?: HairColor
  }

  clothing?: {
    style?: 'shirt' | 'sweater' | 'turtleneck'
    color?: string
  }
}

export type Color = string

// Enums for type safety
export type SkinTone = Color

export type EyeColor = Color

export type HairColor = Color

export type HairStyle = 'short' | 'long'
