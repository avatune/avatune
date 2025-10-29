import type { AvatarConfig } from './types/avatar-config'

export type NormalizedConfig = Required<
  Pick<AvatarConfig, 'size' | 'backgroundColor'>
> &
  AvatarConfig

export const normalizeConfig = (cfg: AvatarConfig): NormalizedConfig => {
  return {
    size: cfg.size ?? 400,
    backgroundColor: cfg.backgroundColor ?? 'transparent',
    ...cfg,
    // Set defaults for optional props using first asset
    face: {
      shape: cfg.face?.shape ?? 'oval',
      skinTone: cfg.face?.skinTone ?? '#F6C7AC',
      ...cfg.face,
    },
    mouth: {
      style: cfg.mouth?.style ?? 'smile',
      lipColor: cfg.mouth?.lipColor,
      ...cfg.mouth,
    },
    eyes: {
      style: cfg.eyes?.style ?? 'dots',
      color: cfg.eyes?.color ?? '#4A2E14',
      ...cfg.eyes,
    },
    eyebrows: {
      style: cfg.eyebrows?.style ?? 'funny',
      color: cfg.eyebrows?.color ?? '#8B4513',
      ...cfg.eyebrows,
    },
    nose: {
      style: cfg.nose?.style ?? 'curve',
      ...cfg.nose,
    },
    ears: {
      style: cfg.ears?.style ?? 'default',
      visible: cfg.ears?.visible ?? true,
      ...cfg.ears,
    },
    hair: {
      style: cfg.hair?.style ?? 'short',
      color: cfg.hair?.color ?? '#8B4513',
      ...cfg.hair,
    },
    clothing: {
      style: cfg.clothing?.style ?? 'shirt',
      color: cfg.clothing?.color,
      ...cfg.clothing,
    },
  }
}
