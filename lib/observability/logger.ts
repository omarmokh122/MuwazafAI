import { after } from 'next/server'

const SERVICE_NAME = 'muwaazaf'
const MAX_STRING_LENGTH = 1_000
const SHIP_TIMEOUT_MS = 3_000
const SHIP_WARN_INTERVAL_MS = 60_000

type LogLevel = 'info' | 'warn' | 'error'

type LogFields = Record<string, string | number | boolean | null | undefined>

type ElasticConfig = { url: string; apiKey: string; index: string }

let configCache: ElasticConfig | null | undefined
let lastShipWarnAt = 0

function cleanEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  const unquoted = trimmed.replace(/^(['"])([\s\S]*)\1$/, '$2').trim()
  return unquoted || undefined
}

function readElasticConfig(): ElasticConfig | null {
  if (configCache !== undefined) return configCache

  const rawUrl = cleanEnvValue(process.env.ELASTIC_LOGS_URL)
  const apiKey = cleanEnvValue(process.env.ELASTIC_LOGS_API_KEY)
  if (!rawUrl || !apiKey) {
    configCache = null
    return null
  }

  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  configCache = {
    url: withProtocol.replace(/\/+$/, ''),
    apiKey,
    index: cleanEnvValue(process.env.ELASTIC_LOGS_INDEX) ?? 'muwazaf-logs',
  }
  return configCache
}

function truncate(value: string): string {
  return value.length > MAX_STRING_LENGTH
    ? `${value.slice(0, MAX_STRING_LENGTH)}…`
    : value
}

function sanitizeFields(fields: LogFields): LogFields {
  const result: LogFields = {}
  for (const [key, value] of Object.entries(fields)) {
    result[key] = typeof value === 'string' ? truncate(value) : value
  }
  return result
}

export function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

function shipToElastic(record: Record<string, unknown>) {
  const config = readElasticConfig()
  if (!config) return

  const send = async () => {
    try {
      const day = String(record['@timestamp']).slice(0, 10).replace(/-/g, '.')
      const response = await fetch(`${config.url}/${config.index}-${day}/_doc`, {
        method: 'POST',
        headers: {
          Authorization: `ApiKey ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(SHIP_TIMEOUT_MS),
        keepalive: true,
        cache: 'no-store',
      })
      if (!response.ok) {
        warnShipFailure(`Elasticsearch responded ${response.status}`)
      }
    } catch (error) {
      warnShipFailure(describeError(error))
    }
  }

  try {
    after(() => {
      void send()
    })
  } catch {
    void send()
  }
}

function warnShipFailure(message: string) {
  const now = Date.now()
  if (now - lastShipWarnAt < SHIP_WARN_INTERVAL_MS) return
  lastShipWarnAt = now
  console.warn(
    JSON.stringify({
      '@timestamp': new Date().toISOString(),
      service: SERVICE_NAME,
      level: 'warn',
      event: 'log_ship_failed',
      message: truncate(message),
    })
  )
}

export function logEvent(level: LogLevel, event: string, fields: LogFields = {}) {
  const record = {
    ...sanitizeFields(fields),
    '@timestamp': new Date().toISOString(),
    service: SERVICE_NAME,
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
    level,
    event,
  }

  const line = JSON.stringify(record)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)

  shipToElastic(record)
}
