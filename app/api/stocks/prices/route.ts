import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { StockDataService } from "@/lib/stock-data/providers"

export async function GET() {
  try {
    const supabase = await createClient()

    // If Supabase is not configured, return success (demo mode doesn't need price updates)
    if (!supabase) {
      console.log("[v0] Supabase not configured, skipping stock price update")
      return NextResponse.json({ 
        success: true, 
        updated: 0, 
        message: "Demo mode - no price updates needed" 
      })
    }

    const stockDataService = new StockDataService()

    console.log("[v0] Starting stock price update process")

    // Fetch all stocks from database
    const { data: stocks, error: stocksError } = await supabase.from("stocks").select("id, symbol")

    if (stocksError) {
      console.error("[v0] Stocks fetch error:", stocksError)
      return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 })
    }

    if (!stocks || stocks.length === 0) {
      console.log("[v0] No stocks found in database")
      return NextResponse.json({ success: true, updated: 0, message: "No stocks to update" })
    }

    const symbols = stocks.map((stock) => stock.symbol)
    console.log(`[v0] Fetching data for ${symbols.length} symbols:`, symbols)

    // Get complete stock data with fallback mechanism
    const { prices, fundamentals } = await stockDataService.getCompleteStockData(symbols)

    console.log(`[v0] Received ${prices.length} prices and ${fundamentals.length} fundamentals`)

    // Merge price and fundamental data
    const stockUpdates = stocks
      .map((stock) => {
        const priceData = prices.find((p) => p.symbol === stock.symbol)
        const fundamentalData = fundamentals.find((f) => f.symbol === stock.symbol)

        if (!priceData) {
          console.warn(`[v0] No price data found for ${stock.symbol}`)
          return null
        }

        return {
          stock_id: stock.id,
          current_price: priceData.currentPrice,
          price_change: priceData.change,
          price_change_percent: priceData.changePercent,
          volume: priceData.volume,
          pe_ratio: fundamentalData?.peRatio || null,
          pb_ratio: fundamentalData?.pbRatio || null,
          dividend_yield: fundamentalData?.dividendYield || null,
          eps: fundamentalData?.eps || null,
          revenue: fundamentalData?.revenue || null,
          net_income: fundamentalData?.netIncome || null,
          market_cap: priceData.marketCap || null,
          updated_at: new Date().toISOString(),
        }
      })
      .filter(Boolean)

    console.log(`[v0] Prepared ${stockUpdates.length} stock updates`)

    if (stockUpdates.length > 0) {
      // Upsert stock prices with enhanced data
      const { error: upsertError } = await supabase.from("stock_prices").upsert(stockUpdates, {
        onConflict: "stock_id",
        ignoreDuplicates: false,
      })

      if (upsertError) {
        console.error("[v0] Price update error:", upsertError)
        console.error("[v0] Failed updates:", JSON.stringify(stockUpdates, null, 2))
        return NextResponse.json({ error: "Failed to update prices", details: upsertError.message }, { status: 500 })
      }

      console.log(`[v0] Successfully updated ${stockUpdates.length} stock prices`)
    }

    return NextResponse.json({
      success: true,
      updated: stockUpdates.length,
      message: `Updated prices for ${stockUpdates.length} stocks`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Stock prices API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { symbols } = body

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: "Invalid symbols array" }, { status: 400 })
    }

    console.log(`[v0] Manual price update requested for symbols:`, symbols)

    const supabase = await createClient()

    // If Supabase is not configured, return success (demo mode doesn't need price updates)
    if (!supabase) {
      console.log("[v0] Supabase not configured, skipping manual price update")
      return NextResponse.json({ 
        success: true, 
        updated: 0, 
        message: "Demo mode - no price updates needed" 
      })
    }

    const stockDataService = new StockDataService()

    // Fetch specific stocks
    const { data: stocks, error: stocksError } = await supabase
      .from("stocks")
      .select("id, symbol")
      .in("symbol", symbols)

    if (stocksError) {
      console.error("[v0] Stocks fetch error:", stocksError)
      return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 })
    }

    // Get complete stock data
    const { prices, fundamentals } = await stockDataService.getCompleteStockData(symbols)

    // Merge and update data
    const stockUpdates =
      stocks
        ?.map((stock) => {
          const priceData = prices.find((p) => p.symbol === stock.symbol)
          const fundamentalData = fundamentals.find((f) => f.symbol === stock.symbol)

          if (!priceData) return null

          return {
            stock_id: stock.id,
            current_price: priceData.currentPrice,
            price_change: priceData.change,
            price_change_percent: priceData.changePercent,
            volume: priceData.volume,
            pe_ratio: fundamentalData?.peRatio || null,
            pb_ratio: fundamentalData?.pbRatio || null,
            dividend_yield: fundamentalData?.dividendYield || null,
            eps: fundamentalData?.eps || null,
            revenue: fundamentalData?.revenue || null,
            net_income: fundamentalData?.netIncome || null,
            market_cap: priceData.marketCap || null,
            updated_at: new Date().toISOString(),
          }
        })
        .filter(Boolean) || []

    if (stockUpdates.length > 0) {
      const { error: upsertError } = await supabase.from("stock_prices").upsert(stockUpdates, {
        onConflict: "stock_id",
        ignoreDuplicates: false,
      })

      if (upsertError) {
        console.error("[v0] Price update error:", upsertError)
        console.error("[v0] Failed updates:", JSON.stringify(stockUpdates, null, 2))
        return NextResponse.json({ error: "Failed to update prices", details: upsertError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      updated: stockUpdates.length,
      prices: stockUpdates,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Stock prices POST error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
