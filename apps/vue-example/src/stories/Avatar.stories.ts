import type { Meta, StoryObj } from '@storybook/vue3'
import { Avatar } from '@avatune/vue'
import theme from '@avatune/sketch-black-white-theme/vue'
import { ref } from 'vue'

const meta = {
  title: 'Avatar/Configurator',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

// Story 1: Interactive configurator with all combinations
export const AllCombinations: Story = {
  args: { theme },
  render: () => ({
    components: { Avatar },
    setup() {
      const config = ref({
        ears: 'round',
        eyebrows: 'bold',
        eyes: 'standard',
        hair: 'star',
        head: 'oval',
        mouth: 'smile',
        noses: 'standard',
      })

      const options = {
        ears: ['round', 'standard'],
        eyebrows: ['bold', 'raised', 'sharp'],
        eyes: ['arrows', 'cute', 'sharp', 'standard'],
        hair: ['boom', 'bundle', 'cute', 'rocket', 'star'],
        head: ['oval'],
        mouth: ['lips', 'smile', 'smirk'],
        noses: ['sharp', 'standard', 'wide'],
      }

      return { config, options, theme }
    },
    template: `
      <div style="padding: 2rem">
        <div style="margin-bottom: 2rem; text-align: center">
          <Avatar
            :theme="theme"
            v-bind="config"
            :width="300"
            :height="300"
          />
        </div>

        <div style="display: grid; grid-template-columns: auto 1fr; gap: 1rem; max-width: 500px; margin: 0 auto">
          <template v-for="(items, category) in options" :key="category">
            <label
              :for="category"
              style="font-weight: bold; text-transform: capitalize; align-self: center"
            >
              {{ category }}:
            </label>
            <select
              :id="category"
              v-model="config[category]"
              style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc"
            >
              <option v-for="item in items" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </template>
        </div>
      </div>
    `,
  }),
}

// Story 2: Seed-based generator
export const SeedGenerator: Story = {
  args: { theme },
  render: () => ({
    components: { Avatar },
    setup() {
      const seed = ref('hello-world')
      return { seed, theme }
    },
    template: `
      <div style="padding: 2rem; text-align: center">
        <div style="margin-bottom: 2rem">
          <Avatar :theme="theme" :seed="seed" :width="300" :height="300" />
        </div>

        <div style="max-width: 400px; margin: 0 auto">
          <label
            for="seed"
            style="display: block; font-weight: bold; margin-bottom: 0.5rem"
          >
            Seed Phrase:
          </label>
          <input
            id="seed"
            type="text"
            v-model="seed"
            placeholder="Enter a seed phrase..."
            style="width: 100%; padding: 0.75rem; font-size: 1rem; border-radius: 4px; border: 1px solid #ccc; font-family: monospace"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: #666">
            Try different phrases to generate unique avatars deterministically!
          </p>
        </div>
      </div>
    `,
  }),
}
