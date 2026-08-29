/**
 * How far the Swift renderer may drift from the web baselines, per theme.
 *
 * Core Graphics and librsvg will never agree pixel-for-pixel: they antialias
 * edges differently, and an avatar is mostly edges. So parity is measured as
 * the share of pixels differing by more than a visible amount, plus the mean
 * absolute error to catch a uniform shift that a per-pixel threshold would miss.
 *
 * Anything needing a value above the default is a bug rather than a tolerance,
 * and every override has to say why it earned one.
 */

export interface Threshold {
  /** Percentage of pixels allowed to differ by more than `channelTolerance`. */
  maxDifferingPercent: number
  /** Mean absolute per-channel error allowed across the whole image. */
  maxMeanError: number
}

/** Per-channel difference below which a pixel counts as matching. */
export const CHANNEL_TOLERANCE = 32

/**
 * Observed worst across all 16 themes and 25 seeds: 0.82% differing, 0.43 mean
 * error. The limits below leave headroom for Core Graphics version differences,
 * but a run approaching them means something regressed rather than that the
 * tolerance was too tight.
 */
export const DEFAULT_THRESHOLD: Threshold = {
  maxDifferingPercent: 2,
  maxMeanError: 3,
}

/**
 * Themes needing more room than the default, each with the reason.
 * Keep this list short: a growing one means the renderer is drifting.
 */
export const THEME_THRESHOLDS: Record<string, Threshold> = {}

export function thresholdFor(theme: string): Threshold {
  return THEME_THRESHOLDS[theme] ?? DEFAULT_THRESHOLD
}
