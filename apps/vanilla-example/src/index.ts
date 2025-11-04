import theme from '@avatune/sketch-black-white-theme/vanilla'
import { avatar } from '@avatune/vanilla'
import './index.css'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

function appendSVG(parent: HTMLElement, title: string, svg: string) {
  const sectionTitle = document.createElement('h2')
  sectionTitle.textContent = title
  parent.appendChild(sectionTitle)

  const svgContainer = document.createElement('div')
  svgContainer.innerHTML = svg
  if (svgContainer.firstElementChild) {
    parent.appendChild(svgContainer.firstElementChild)
  }
}

const content = document.createElement('div')
content.className = 'content'

appendSVG(
  content,
  'Custom Avatar Example',
  avatar(theme, {
    ears: 'round',
    eyebrows: 'bold',
    eyes: 'standard',
    hair: 'star',
    head: 'oval',
    mouth: 'smirk',
    noses: 'sharp',
  }),
)

appendSVG(
  content,
  'Random Avatar (tag-based)',
  avatar(theme, {
    seed: 'random-seed-123',
  }),
)

root.appendChild(content)
