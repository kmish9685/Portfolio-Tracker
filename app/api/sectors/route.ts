import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { DEMO_SECTOR_DATA } from "@/lib/demo-data"

export async function GET() {
  try {
    const supabase = await createClient()

    // If Supabase is not configured, return demo data
    if (!supabase) {
      console.log("[v0] Supabase not configured, returning demo sector data")
      return NextResponse.json({
        sectors: DEMO_SECTOR_DATA,
        totalPortfolioValue: DEMO_SECTOR_DATA.reduce((sum, sector) => sum + sector.totalInvestment, 0),
        totalSectors: DEMO_SECTOR_DATA.length,
      })
    }

    // Always use demo user ID for now to show the sector data
    let userId = "00000000-0000-0000-0000-000000000000" // Demo user ID

    // Comment out authentication check for now
    // const {
    //   data: { user },
    //   error: authError,
    // } = await supabase.auth.getUser()

    // if (user && !authError) {
    //   userId = user.id
    // }

    console.log("[v0] Fetching sector data for user:", userId)

    // Fetch portfolio holdings with stock and sector information
    const { data: holdings, error } = await supabase
      .from("portfolio_holdings")
      .select(`
        purchase_price,
        quantity,
        stock_id,
        stocks:stock_id (
          symbol,
          name,
          sectors:sector_id (
            name
          )
        )
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("[v0] Sector data fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch sector data" }, { status: 500 })
    }

    console.log("[v0] Found", holdings?.length || 0, "portfolio holdings")

    // Fetch current stock prices separately
    const stockIds = holdings?.map(h => h.stock_id) || []
    const { data: stockPrices, error: pricesError } = await supabase
      .from("stock_prices")
      .select("stock_id, current_price, updated_at")
      .in("stock_id", stockIds)

    if (pricesError) {
      console.error("[v0] Stock prices fetch error:", pricesError)
    }

    console.log("[v0] Fetched stock prices:", stockPrices?.length || 0, "prices")

    // Create a map for quick lookup
    const priceMap = new Map()
    stockPrices?.forEach(price => {
      priceMap.set(price.stock_id, price)
    })

    // Group by sector and calculate metrics
    const sectorMap = new Map()

    holdings?.forEach((holding) => {
      const sectorName = holding.stocks?.sectors?.name || "Others"
      const stockPrice = priceMap.get(holding.stock_id)
      const currentPrice = stockPrice?.current_price || holding.purchase_price
      
      console.log("[v0] Debug - Sector price lookup:", {
        stock: holding.stocks?.symbol,
        stockId: holding.stock_id,
        stockPrice: stockPrice,
        currentPrice,
        purchasePrice: holding.purchase_price
      })
      
      const investment = holding.purchase_price * holding.quantity
      const presentValue = currentPrice * holding.quantity
      const gainLoss = presentValue - investment

      console.log("[v0] Processing holding:", {
        stock: holding.stocks?.symbol,
        sector: sectorName,
        investment,
        currentPrice,
        presentValue,
        gainLoss,
      })

      if (!sectorMap.has(sectorName)) {
        sectorMap.set(sectorName, {
          name: sectorName,
          totalInvestment: 0,
          totalPresentValue: 0,
          totalGainLoss: 0,
          stockCount: 0,
        })
      }

      const sector = sectorMap.get(sectorName)
      sector.totalInvestment += investment
      sector.totalPresentValue += presentValue
      sector.totalGainLoss += gainLoss
      sector.stockCount += 1
    })

    // Convert to array and add percentages
    const sectors = Array.from(sectorMap.values()).map((sector) => ({
      ...sector,
      gainLossPercent: sector.totalInvestment > 0 ? (sector.totalGainLoss / sector.totalInvestment) * 100 : 0,
    }))

    // Calculate total portfolio value for sector percentages
    const totalPortfolioValue = sectors.reduce((sum, sector) => sum + sector.totalInvestment, 0)

    const sectorsWithPortfolioPercent = sectors.map((sector) => ({
      ...sector,
      portfolioPercent: totalPortfolioValue > 0 ? (sector.totalInvestment / totalPortfolioValue) * 100 : 0,
    }))

    console.log("[v0] Returning", sectors.length, "sectors with total portfolio value:", totalPortfolioValue)

    return NextResponse.json({
      sectors: sectorsWithPortfolioPercent,
      totalPortfolioValue,
      totalSectors: sectors.length,
    })
  } catch (error) {
    console.error("[v0] Sectors API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
