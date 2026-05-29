import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

async function initPrisma(): Promise<PrismaClient> {
  const url = process.env.TURSO_DATABASE_URL?.trim()
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim()

  if (url && authToken) {
    const { createClient } = await import('@libsql/client')
    const { PrismaLibSQL } = await import('@prisma/adapter-libsql')
    const libsql = createClient({
      url,
      authToken,
    })
    return new PrismaClient({ adapter: new PrismaLibSQL(libsql) })
  }
  return new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
  })
}

let initPromise: Promise<PrismaClient> | null = null

function getClient(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return Promise.resolve(globalForPrisma.prisma)
  if (!initPromise) {
    initPromise = initPrisma().then(c => {
      if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = c
      return c
    })
  }
  return initPromise
}

function createHandler(modelName: string) {
  return {
    apply(_target: unknown, _thisArg: unknown, args: unknown[]) {
      return (async () => {
        const client = await getClient()
        const method = (client as any)[modelName]
        if (typeof method === 'function') return method.apply(client, args)
        return method
      })()
    },
    get(_target: unknown, prop: string | symbol) {
      if (prop === 'then') return undefined
      return async (...args: unknown[]) => {
        const client = await getClient()
        const model = (client as any)[modelName]
        const method = model[prop as string]
        if (typeof method === 'function') return method.apply(model, args)
        return method
      }
    },
  }
}

export const db = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    if (prop === 'then') return undefined
    return new Proxy(() => {}, createHandler(prop as string))
  },
})
