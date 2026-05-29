import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

function resolveDbPath(): string {
  const cwd = process.cwd()
  const candidates = [
    path.join(cwd, 'db', 'custom.db'),
    path.join(cwd, '..', '..', 'db', 'custom.db'),
    path.join(cwd, '..', '..', '..', 'db', 'custom.db'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return path.join(cwd, 'db', 'custom.db')
}

const dbPath = resolveDbPath()
process.env.DATABASE_URL = `file:${dbPath}`

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db