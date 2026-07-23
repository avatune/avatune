import { Avatar } from '@avatune/react'
import type * as PageTree from 'fumadocs-core/page-tree'
import {
  BookOpen,
  Boxes,
  Braces,
  BrainCircuit,
  CircleUserRound,
  House,
  Palette,
  PanelsTopLeft,
  Rocket,
  Ruler,
  ScanFace,
  Server,
  SlidersHorizontal,
} from 'lucide-react'
import Image, { type StaticImageData } from 'next/image'
import type { ReactNode } from 'react'
import angularLogo from '@/assets/angular-logo.svg'
import javascriptLogo from '@/assets/javascript-logo.svg'
import reactLogo from '@/assets/react-logo.svg'
import reactNativeLogo from '@/assets/react-native.svg'
import solidjsLogo from '@/assets/solidjs-logo.svg'
import svelteLogo from '@/assets/svelte-logo.svg'
import vueLogo from '@/assets/vue-logo.svg'
import { source } from './source'
import { themeDocItems } from './theme-docs.generated'
import { themeMapBySlug } from './theme-registry.generated'

interface PageOptions {
  icon?: ReactNode
  showBadge?: boolean
}

interface FolderOptions {
  defaultOpen?: boolean
  icon?: ReactNode
}

function page(
  name: ReactNode,
  slugs: string[],
  options: PageOptions = {},
): PageTree.Item {
  const sourcePage = source.getPage(slugs)

  if (!sourcePage) {
    throw new Error(`Missing docs page: ${slugs.join('/')}`)
  }

  const displayName =
    options.showBadge && sourcePage.data.badge ? (
      <span className="inline-flex items-center gap-2">
        {name}
        <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
          {sourcePage.data.badge.text}
        </span>
      </span>
    ) : (
      name
    )

  return {
    type: 'page',
    name: displayName,
    url: sourcePage.url,
    icon: options.icon,
  }
}

function folder(
  name: string,
  children: PageTree.Node[],
  options: FolderOptions = {},
): PageTree.Folder {
  return {
    type: 'folder',
    name,
    defaultOpen: options.defaultOpen ?? true,
    icon: options.icon,
    children,
  }
}

function frameworkIcon(source: StaticImageData): ReactNode {
  return (
    <Image
      src={source}
      alt=""
      width={16}
      height={16}
      className="size-4 object-contain"
    />
  )
}

function themeAvatarIcon(previewId: string): ReactNode {
  const theme = themeMapBySlug[previewId]
  if (!theme) throw new Error(`Missing theme preview: ${previewId}`)

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-5 shrink-0 overflow-hidden rounded-full border border-fd-border bg-fd-muted"
    >
      <Avatar theme={theme} seed="docs-navigation-example" size={20} />
    </span>
  )
}

export const docsTree: PageTree.Root = {
  name: 'Avatune',
  children: [
    folder(
      'Overview',
      [
        page('Welcome', ['docs'], { icon: <House /> }),
        page('Getting Started', ['getting-started'], { icon: <Rocket /> }),
        page('Playground', ['playground'], {
          icon: <SlidersHorizontal />,
        }),
        page('Studio', ['studio'], {
          icon: <PanelsTopLeft />,
          showBadge: true,
        }),
      ],
      { icon: <BookOpen /> },
    ),
    folder(
      'Themes',
      themeDocItems.map(({ label, previewId, slugs }) =>
        page(label, slugs, { icon: themeAvatarIcon(previewId) }),
      ),
      { icon: <Palette /> },
    ),
    folder(
      'Frameworks',
      [
        page('React', ['packages', 'react'], {
          icon: frameworkIcon(reactLogo),
        }),
        page('React Native', ['packages', 'react-native'], {
          icon: frameworkIcon(reactNativeLogo),
        }),
        page('Angular', ['packages', 'angular'], {
          icon: frameworkIcon(angularLogo),
        }),
        page('SolidJS', ['packages', 'solidjs'], {
          icon: frameworkIcon(solidjsLogo),
        }),
        page('Vue', ['packages', 'vue'], {
          icon: frameworkIcon(vueLogo),
        }),
        page('Svelte', ['packages', 'svelte'], {
          icon: frameworkIcon(svelteLogo),
        }),
        page('Vanilla', ['packages', 'vanilla'], {
          icon: frameworkIcon(javascriptLogo),
        }),
      ],
      { defaultOpen: false, icon: <Boxes /> },
    ),
    folder(
      'Predictors',
      [
        page('Facial Hair', ['packages', 'facial-hair-predictor'], {
          icon: <ScanFace />,
        }),
        page('Hair Color', ['packages', 'hair-color-predictor'], {
          icon: <Palette />,
        }),
        page('Hair Length', ['packages', 'hair-length-predictor'], {
          icon: <Ruler />,
        }),
        page('Skin Tone', ['packages', 'skin-tone-predictor'], {
          icon: <CircleUserRound />,
        }),
      ],
      { icon: <BrainCircuit /> },
    ),
    folder('API', [page('REST API', ['api'], { icon: <Server /> })], {
      icon: <Braces />,
    }),
  ],
}
