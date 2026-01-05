import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Get total products
    const totalProductsResult = await query("SELECT COUNT(*) as count FROM products")
    const totalProducts = Number.parseInt(totalProductsResult.rows[0].count)

    // Get total categories
    const totalCategoriesResult = await query("SELECT COUNT(*) as count FROM categories")
    const totalCategories = Number.parseInt(totalCategoriesResult.rows[0].count)

    // Get total suppliers
    const totalSuppliersResult = await query("SELECT COUNT(*) as count FROM suppliers")
    const totalSuppliers = Number.parseInt(totalSuppliersResult.rows[0].count)

    // Get low stock products (stock < min_stock)
    const lowStockResult = await query("SELECT COUNT(*) as count FROM products WHERE stock < min_stock")
    const lowStockProducts = Number.parseInt(lowStockResult.rows[0].count)

    // Get total stock value
    const stockValueResult = await query("SELECT SUM(price * stock) as total FROM products")
    const totalStockValue = Number.parseFloat(stockValueResult.rows[0].total || "0")

    // Get recent stock movements
    const recentMovementsResult = await query(
      `SELECT sm.*, p.name as product_name 
       FROM stock_movements sm 
       LEFT JOIN products p ON sm.product_id = p.id 
       ORDER BY sm.created_at DESC 
       LIMIT 10`,
    )

    // Get category distribution
    const categoryDistResult = await query(
      `SELECT c.name, COUNT(p.id) as value 
       FROM categories c 
       LEFT JOIN products p ON c.id = p.category_id 
       GROUP BY c.id, c.name 
       ORDER BY value DESC`,
    )

    // Get stock trends for the last 7 days
    const stockTrendsResult = await query(
      `SELECT 
        DATE(created_at) as date,
        SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE 0 END) as in_qty,
        SUM(CASE WHEN movement_type = 'OUT' THEN ABS(quantity) ELSE 0 END) as out_qty
       FROM stock_movements 
       WHERE created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
    )

    const stockTrends = stockTrendsResult.rows.map((row) => ({
      date: new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      in: Number.parseInt(row.in_qty),
      out: Number.parseInt(row.out_qty),
    }))

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalSuppliers,
      lowStockProducts,
      totalStockValue,
      recentMovements: recentMovementsResult.rows,
      categoryDistribution: categoryDistResult.rows,
      stockTrends,
    })
  } catch (error) {
    console.warn("[v0] Stats handler error, returning defaults:", error)
    // Return safe defaults so the dashboard can render while the DB is down
    return NextResponse.json(
      {
        totalProducts: 0,
        totalCategories: 0,
        totalSuppliers: 0,
        lowStockProducts: 0,
        totalStockValue: 0,
        recentMovements: [],
        categoryDistribution: [],
        stockTrends: [],
      },
      { status: 200 },
    )
  }
}
