import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(
      `SELECT c.*, COUNT(p.id) as product_count 
       FROM categories c 
       LEFT JOIN products p ON c.id = p.category_id 
       GROUP BY c.id 
       ORDER BY c.name ASC`,
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    const result = await query(`INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`, [
      name,
      description,
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error creating category:", error)
    if (error.code === "23505") {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
