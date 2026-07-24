import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from 'fumadocs-mdx/config'
import { z } from 'zod'

export const docs = defineDocs({
  dir: 'src/content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      source: z.string().optional(),
      badge: z
        .object({
          text: z.string(),
          variant: z.string(),
        })
        .optional(),
    }),
  },
})

export default defineConfig({
  mdxOptions: {
    remarkNpmOptions: {
      persist: {
        id: 'package-manager',
      },
    },
  },
})
