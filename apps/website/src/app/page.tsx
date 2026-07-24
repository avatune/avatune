import type { Metadata } from 'next'
import { Toast } from '@/components/client/toast'
import { Footer } from '@/components/landing/footer'
import { Frameworks } from '@/components/landing/frameworks'
import { Hero } from '@/components/landing/hero'
import { Nav } from '@/components/landing/nav'
import { Predictor } from '@/components/landing/predictor'
import { WhyGrid } from '@/components/landing/why-grid'
import '@/styles/landing.css'

export const metadata: Metadata = {
  title: {
    absolute: 'Avatune | Avatars that feel like people',
  },
}

export default function HomePage() {
  return (
    <main className="bg-paper text-ink font-body text-[15px] leading-[1.55] antialiased [text-rendering:optimizeLegibility] [font-feature-settings:'ss01','ss02','cv11'] [&_a]:no-underline">
      <Nav />
      <Hero docsLink="/docs" />
      <WhyGrid />
      <Frameworks />
      <Predictor />
      <Footer />
      <Toast />
    </main>
  )
}
