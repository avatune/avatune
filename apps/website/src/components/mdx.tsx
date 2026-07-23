import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { ApiClientDemo } from './docs/api-client-demo'
import { AssetPreview } from './docs/asset-preview'
import { AvatarUsagePreview } from './docs/avatar-usage-preview'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tabs,
    Tab,
    Callout,
    AssetPreview,
    AvatarUsagePreview,
    ApiClientDemo,
    ...components,
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMDXComponents(components)
}
