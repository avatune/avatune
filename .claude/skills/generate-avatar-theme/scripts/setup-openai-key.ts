#!/usr/bin/env bun
/** Store OPENAI_API_KEY in the repository-root .env.local without exposing it. */
import { chmod, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const usage = `Usage:
  bun setup-openai-key.ts             Prompt securely and write .env.local
  bun setup-openai-key.ts --from-env  Persist the current OPENAI_API_KEY
  bun setup-openai-key.ts --check     Verify configuration without printing the key
  bun setup-openai-key.ts --force     Replace an existing configured key
  bun setup-openai-key.ts --help`

const options = process.argv.slice(2)
if (options.includes('--help')) {
  console.log(usage)
  process.exit(0)
}

const repositoryRoot = resolve(import.meta.dir, '../../../..')
const envPath = resolve(repositoryRoot, '.env.local')
const gitignorePath = resolve(repositoryRoot, '.gitignore')
const existingContent = existsSync(envPath) ? await readFile(envPath, 'utf8') : ''

const readFileKey = (content: string) => {
  const line = content
    .split(/\r?\n/)
    .find((candidate) => candidate.startsWith('OPENAI_API_KEY='))
  return line?.slice('OPENAI_API_KEY='.length).trim().replace(/^(['"])(.*)\1$/, '$2')
}

const isValidKey = (value: string | undefined) => Boolean(value && value.startsWith('sk-') && value.length >= 20)
const configuredKey = process.env.OPENAI_API_KEY || readFileKey(existingContent)

if (options.includes('--check')) {
  if (!isValidKey(configuredKey)) {
    console.error(`OPENAI_API_KEY is not configured. Run:\n  bun ${import.meta.path}`)
    process.exit(1)
  }
  console.log(`OPENAI_API_KEY is configured through ${existsSync(envPath) ? '.env.local or the process environment' : 'the process environment'}`)
  process.exit(0)
}

if (isValidKey(configuredKey) && !options.includes('--force') && !options.includes('--from-env')) {
  console.log('OPENAI_API_KEY is already configured; no changes made')
  process.exit(0)
}

const gitignore = await readFile(gitignorePath, 'utf8')
if (!gitignore.split(/\r?\n/).includes('.env.local')) {
  throw new Error('Refusing to write a secret because repository .gitignore does not contain .env.local')
}

const readHiddenKey = () =>
  new Promise<string>((resolveKey, reject) => {
    if (!process.stdin.isTTY || !process.stdout.isTTY || !process.stdin.setRawMode) {
      reject(new Error('Interactive setup requires a TTY. Set OPENAI_API_KEY and rerun with --from-env'))
      return
    }

    let value = ''
    const cleanup = () => {
      process.stdin.off('data', onData)
      process.stdin.setRawMode(false)
      process.stdin.pause()
    }
    const onData = (chunk: Buffer | string) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') {
          cleanup()
          process.stdout.write('\n')
          reject(new Error('Setup cancelled'))
          return
        }
        if (character === '\r' || character === '\n') {
          cleanup()
          process.stdout.write('\n')
          resolveKey(value)
          return
        }
        if (character === '\u007f' || character === '\b') {
          if (value) {
            value = value.slice(0, -1)
            process.stdout.write('\b \b')
          }
          continue
        }
        if (character >= ' ') {
          value += character
          process.stdout.write('*')
        }
      }
    }

    process.stdout.write('OpenAI API key: ')
    process.stdin.setRawMode(true)
    process.stdin.setEncoding('utf8')
    process.stdin.resume()
    process.stdin.on('data', onData)
  })

const key = options.includes('--from-env') ? process.env.OPENAI_API_KEY : await readHiddenKey()
if (!isValidKey(key)) throw new Error('OpenAI API key must start with sk- and contain at least 20 characters')

const preservedLines = existingContent
  .split(/\r?\n/)
  .filter((line) => line && !line.startsWith('OPENAI_API_KEY='))
preservedLines.push(`OPENAI_API_KEY=${key}`)
await writeFile(envPath, `${preservedLines.join('\n')}\n`, { mode: 0o600 })
await chmod(envPath, 0o600)

console.log('Stored OPENAI_API_KEY in repository-root .env.local with mode 0600')
