import type { Meta, StoryObj } from '@storybook/html-vite'

const meta: Meta = {
  title: 'Welcome',
  tags: ['autodocs'],
  render: () => {
    const container = document.createElement('div')
    container.style.cssText = `
      padding: 3rem;
      max-width: 800px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    `

    container.innerHTML = `
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #1ea7fd;">
        Welcome to Avatune Storybook
      </h1>
      <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #666;">
        This is a composed Storybook that brings together all Avatune component examples in one place.
      </p>
      
      <div style="background: #f6f9fc; padding: 2rem; border-radius: 8px; margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #333;">
          📚 What's Inside
        </h2>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 0.5rem 0; border-bottom: 1px solid #e0e0e0;">
            <strong>React Components</strong> - Avatar components built with React
          </li>
          <li style="padding: 0.5rem 0; border-bottom: 1px solid #e0e0e0;">
            <strong>Vue Components</strong> - Avatar components built with Vue 3
          </li>
          <li style="padding: 0.5rem 0; border-bottom: 1px solid #e0e0e0;">
            <strong>Svelte Components</strong> - Avatar components built with Svelte 5
          </li>
          <li style="padding: 0.5rem 0;">
            <strong>Vanilla Components</strong> - Framework-agnostic avatar components
          </li>
        </ul>
      </div>

      <div style="background: #fff4e6; padding: 2rem; border-radius: 8px; border-left: 4px solid #ffa726;">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #333;">
          🎨 Available Themes
        </h2>
        <ul style="margin-left: 1.5rem;">
          <li><strong>Flat Design Theme</strong> - Modern, minimalist design</li>
          <li><strong>Sketch Black & White Theme</strong> - Hand-drawn aesthetic</li>
        </ul>
      </div>

      <div style="margin-top: 2rem; padding: 1.5rem; background: #e8f5e9; border-radius: 8px;">
        <p style="margin: 0; color: #2e7d32;">
          <strong>💡 Tip:</strong> Navigate through the sidebar to explore different components 
          and their variations across different frameworks and themes.
        </p>
      </div>
    `

    return container
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {}
