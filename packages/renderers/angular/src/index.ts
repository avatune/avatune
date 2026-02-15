import { Component, input, type OnInit, signal } from '@angular/core'
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

const uid = () => Math.random().toString(36).slice(2, 9)

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

interface SortedItem {
  category: string
  template: string
  layer: number
  position: { x: number; y: number }
}

@Component({
  selector: 'avatune-avatar',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="avatarSize()"
      [attr.height]="avatarSize()"
      [attr.viewBox]="'0 0 ' + avatarSize() + ' ' + avatarSize()"
      [attr.role]="'img'"
      [attr.aria-label]="'Avatar'"
      [class]="avatarClass()"
      [style]="avatarStyle()"
    >
      <defs>
        <clipPath [id]="avatarClipId">
          <rect
            x="0"
            y="0"
            [attr.width]="avatarSize()"
            [attr.height]="avatarSize()"
            [attr.rx]="avatarBorderRadius()"
            [attr.ry]="avatarBorderRadius()"
          />
        </clipPath>
      </defs>

      @if (avatarBackgroundColor()) {
        <rect
          x="0"
          y="0"
          [attr.width]="avatarSize()"
          [attr.height]="avatarSize()"
          [attr.rx]="avatarBorderRadius()"
          [attr.ry]="avatarBorderRadius()"
          [attr.fill]="avatarBackgroundColor()"
        />
      }

      <g [attr.clip-path]="'url(#' + avatarClipId + ')'">
        @for (item of avatarSortedItems(); track item.category) {
          <g
            [attr.data-testid]="'avatar-item-' + item.category + '-' + item.layer"
            [attr.transform]="'translate(' + item.position.x + ', ' + item.position.y + ') scale(' + avatarScaleFactor() + ')'"
            [innerHTML]="item.template"
          ></g>
        }
      </g>

      @if (avatarBorderColor() && avatarBorderWidth() > 0) {
        <rect
          [attr.x]="avatarBorderWidth() / 2"
          [attr.y]="avatarBorderWidth() / 2"
          [attr.width]="avatarSize() - avatarBorderWidth()"
          [attr.height]="avatarSize() - avatarBorderWidth()"
          [attr.rx]="avatarBorderRadius()"
          [attr.ry]="avatarBorderRadius()"
          fill="none"
          [attr.stroke]="avatarBorderColor()"
          [attr.stroke-width]="avatarBorderWidth()"
        />
      }
    </svg>
  `,
  imports: [],
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

  avatarClipId = uid()
  avatarUid = uid()

  avatarSize = signal(400)
  avatarBorderRadius = signal(0)
  avatarBackgroundColor = signal<string | undefined>(undefined)
  avatarBorderColor = signal<string | undefined>(undefined)
  avatarBorderWidth = signal(0)
  avatarScaleFactor = signal(1)

  avatarSortedItems = signal<SortedItem[]>([])

  ngOnInit() {
    const themeValue = this.theme()
    const size = this.inputSize() ?? themeValue.style.size
    this.avatarSize.set(size)

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

    const result = selectItems(config, themeValue, this.predictions())

    this.avatarBackgroundColor.set(
      result.style?.backgroundColor || themeValue.style.backgroundColor,
    )
    this.avatarBorderColor.set(themeValue.style.borderColor)
    this.avatarBorderWidth.set(parseBorderWidth(themeValue.style.borderWidth))
    this.avatarBorderRadius.set(
      parseBorderRadius(themeValue.style.borderRadius, size),
    )
    this.avatarScaleFactor.set(size / themeValue.style.size)

    const items: SortedItem[] = Object.entries(result.selected)
      .filter(([, item]) => item != null)
      .sort(([, a], [, b]) => (a?.layer || 0) - (b?.layer || 0))
      .map(([category, item]) => {
        const angularItem = item as AngularAvatarItem
        const positionRaw =
          typeof angularItem.position === 'function'
            ? angularItem.position(size)
            : angularItem.position

        const position = {
          x:
            typeof positionRaw.x === 'string'
              ? parseFloat(String(positionRaw.x))
              : positionRaw.x,
          y:
            typeof positionRaw.y === 'string'
              ? parseFloat(String(positionRaw.y))
              : positionRaw.y,
        }

        const color = result.colors[category as AvatarPartCategory]

        const template = angularItem.template
          .replace(/\{color\}/g, color || 'currentColor')
          .replace(/\{uid\}/g, this.avatarUid)

        return {
          category,
          template,
          layer: angularItem.layer || 0,
          position,
        }
      })

    this.avatarSortedItems.set(items)
  }
}
