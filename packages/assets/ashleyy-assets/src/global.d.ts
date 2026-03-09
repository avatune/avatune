declare module '*.svg?raw' {
  import type { AvatarSvgProps } from '@avatune/types'
  const raw: (props: AvatarSvgProps) => string
  export default raw
}

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'
  const Component: FC<SVGProps<SVGSVGElement>>
  export default Component
}

declare module '*.svg?native' {
  import type { FC, SVGProps } from 'react-native-svg'
  const Component: FC<SVGProps<SVGSVGElement>>
  export default Component
}

declare module '*.svg' {
  const url: string
  export default url
}

declare module '*.svg?svelte' {
  import type { Component } from 'svelte'
  import type { SVGAttributes } from 'svelte/elements'

  interface SvgComponentProps extends SVGAttributes<SVGSVGElement> {
    className?: string
    style?: string
  }

  const component: Component<SvgComponentProps>
  export default component
  export const raw: string
}

declare module '*.svg?vue' {
  import type { DefineComponent, SVGAttributes } from 'vue'

  interface SvgComponentProps extends SVGAttributes {
    className?: string
    style?: string
  }

  const component: DefineComponent<SvgComponentProps>
  export default component
}

declare module '*.svg?angular' {
  const asset: {
    template: string | ((color: string, uid: string) => string)
  }
  export default asset
}

declare module '*.svg?solid' {
  import type { Component, JSX } from 'solid-js'

  interface SvgComponentProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
    class?: string
    style?: JSX.CSSProperties | string
  }

  const component: Component<SvgComponentProps>
  export default component
  export const raw: string
}
