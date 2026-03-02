import {
  Component,
  ElementRef,
  inject,
  input,
  type OnInit,
} from '@angular/core'
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser'
import type {
  AngularAvatarItem,
  AngularTheme,
  AvatarConfig,
  AvatarPartCategory,
  Predictions,
} from '@avatune/types'
import {
  parseBorderRadius,
  parseBorderWidth,
  selectItems,
} from '@avatune/utils'

const createUid = () => Math.random().toString(36).slice(2, 9)

export type AvatarProps<T extends AngularTheme = AngularTheme> = AvatarConfig<
  AngularAvatarItem,
  T
> & {
  theme: T
  size?: number
  class?: string
  style?: string
  predictions?: Predictions
}

@Component({
  selector: 'avatune-avatar',
  standalone: true,
  template: `<span [innerHTML]="svgContent"></span>`,
  styles: [
    ':host { display: inline-block; line-height: 0; } span { display: inline-block; line-height: 0; }',
  ],
})
export class Avatar<T extends AngularTheme = AngularTheme> implements OnInit {
  theme = input.required<T>()
  seed = input<string | number | undefined>()
  body = input<string | string[] | undefined>()
  ears = input<string | string[] | undefined>()
  eyebrows = input<string | string[] | undefined>()
  eyes = input<string | string[] | undefined>()
  hair = input<string | string[] | undefined>()
  head = input<string | string[] | undefined>()
  mouth = input<string | string[] | undefined>()
  nose = input<string | string[] | undefined>()
  bodyColor = input<string | undefined>()
  earsColor = input<string | undefined>()
  eyebrowsColor = input<string | undefined>()
  eyesColor = input<string | undefined>()
  hairColor = input<string | undefined>()
  headColor = input<string | undefined>()
  mouthColor = input<string | undefined>()
  noseColor = input<string | undefined>()
  backgroundColor = input<string | undefined>()
  inputSize = input<number | undefined>()
  avatarClass = input<string | undefined>()
  avatarStyle = input<string | undefined>()
  predictions = input<Predictions | undefined>()

  svgContent: SafeHtml = ''

  private sanitizer = inject(DomSanitizer)

  ngOnInit() {
    const theme = this.theme()
    const size = this.inputSize() ?? theme.style.size
    const uidValue = createUid()
    const clipId = `clip-${uidValue}`
    const borderRadius = parseBorderRadius(theme.style.borderRadius, size)
    const scaleFactor = size / theme.style.size

    const config: AvatarConfig<AngularAvatarItem, T> = {
      seed: this.seed(),
      body: this.body() as AvatarConfig<AngularAvatarItem, T>['body'],
      ears: this.ears() as AvatarConfig<AngularAvatarItem, T>['ears'],
      eyebrows: this.eyebrows() as AvatarConfig<
        AngularAvatarItem,
        T
      >['eyebrows'],
      eyes: this.eyes() as AvatarConfig<AngularAvatarItem, T>['eyes'],
      hair: this.hair() as AvatarConfig<AngularAvatarItem, T>['hair'],
      head: this.head() as AvatarConfig<AngularAvatarItem, T>['head'],
      mouth: this.mouth() as AvatarConfig<AngularAvatarItem, T>['mouth'],
      nose: this.nose() as AvatarConfig<AngularAvatarItem, T>['nose'],
      bodyColor: this.bodyColor(),
      earsColor: this.earsColor(),
      eyebrowsColor: this.eyebrowsColor(),
      eyesColor: this.eyesColor(),
      hairColor: this.hairColor(),
      headColor: this.headColor(),
      mouthColor: this.mouthColor(),
      noseColor: this.noseColor(),
      backgroundColor: this.backgroundColor(),
    }

    const result = selectItems(config, theme, this.predictions())

    const backgroundColor =
      result.style?.backgroundColor || theme.style.backgroundColor
    const borderColor = theme.style.borderColor
    const borderWidth = parseBorderWidth(theme.style.borderWidth)

    const sortedItems = Object.entries(result.selected)
      .filter(([, item]) => item != null)
      .sort(([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0))

    const parts: string[] = []

    parts.push(`<defs>
      <clipPath id="${clipId}">
        <rect x="0" y="0" width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" />
      </clipPath>
    </defs>`)

    if (backgroundColor) {
      parts.push(
        `<rect x="0" y="0" width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" fill="${backgroundColor}" />`,
      )
    }

    const contentParts: string[] = []
    for (const [category, item] of sortedItems) {
      const angularItem = item as AngularAvatarItem
      if (!angularItem.template) continue

      const positionRaw =
        typeof angularItem.position === 'function'
          ? angularItem.position(size)
          : angularItem.position

      const x =
        typeof positionRaw.x === 'string'
          ? parseFloat(String(positionRaw.x))
          : positionRaw.x
      const y =
        typeof positionRaw.y === 'string'
          ? parseFloat(String(positionRaw.y))
          : positionRaw.y

      const color = result.colors[category as AvatarPartCategory]

      const template =
        typeof angularItem.template === 'function'
          ? angularItem.template(color || 'currentColor', uidValue)
          : angularItem.template
              .replace(/\{color\}/g, color || 'currentColor')
              .replace(/\{uid\}/g, uidValue)

      contentParts.push(
        `<g data-testid="avatar-item-${category}-${angularItem.layer || 0}" transform="translate(${x}, ${y}) scale(${scaleFactor})">${template}</g>`,
      )
    }

    parts.push(`<g clip-path="url(#${clipId})">${contentParts.join('')}</g>`)

    if (borderColor && borderWidth > 0) {
      parts.push(
        `<rect x="${borderWidth / 2}" y="${borderWidth / 2}" width="${size - borderWidth}" height="${size - borderWidth}" rx="${borderRadius}" ry="${borderRadius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" />`,
      )
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Avatar">${parts.join('')}</svg>`

    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg)
  }
}
