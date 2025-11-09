#!/usr/bin/env node

import { setTimeout } from 'node:timers/promises'

const PORTS = [6005, 6006, 6007, 6008, 6009]
const TIMEOUT = 60000 // 60 seconds
const CHECK_INTERVAL = 500 // 500ms

async function isPortReady(port) {
  try {
    const response = await fetch(`http://localhost:${port}/iframe.html`, {
      method: 'HEAD',
    })
    return response.ok
  } catch {
    return false
  }
}

async function waitForPort(port, timeout = TIMEOUT) {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await isPortReady(port)) {
      console.log(`✓ Port ${port} is ready`)
      return true
    }
    await setTimeout(CHECK_INTERVAL)
  }

  throw new Error(`Port ${port} not ready within ${timeout}ms`)
}

async function main() {
  console.log('⏳ Waiting for all Storybook instances to be ready...\n')

  try {
    await Promise.all(PORTS.map((port) => waitForPort(port)))
    console.log('\n✓ All Storybook instances are ready!')
  } catch (error) {
    console.error(`\n❌ ${error.message}`)
    process.exit(1)
  }
}

main()
