import { Pool } from "pg"

// Create a singleton connection pool
let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    pool = new Pool({
      user: process.env.POSTGRES_USER || "inventory_user",
      password: process.env.POSTGRES_PASSWORD || "inventory_pass",
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number.parseInt(process.env.POSTGRES_PORT || "5432"),
      database: process.env.POSTGRES_DB || "inventory_db",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("[v0] Query executed", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}
