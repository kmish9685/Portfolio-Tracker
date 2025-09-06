import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { DEMO_PORTFOLIO_DATA } from "@/lib/demo-data"

export async function GET() {
  try {
    const supabase = await createClient()

    // If Supabase is not configured, return demo data
    if (!supabase) {
      console.log("[v0] Supabase not configured, returning demo portfolio data")
      return NextResponse.json(DEMO_PORTFOLIO_DATA)
    }

    // Always use demo user ID for now to show the portfolio data
    let userId = "00000000-0000-0000-0000-000000000000" // Demo user ID

    // Comment out authentication check for now
    // const {
    //   data: { user },
    //   error: authError,
    // } = await supabase.auth.getUser()

    // if (user && !authError) {
    //   userId = user.id
    // }

    console.log("[v0] Fetching portfolio data for user:", userId)

    // Fetch portfolio holdings with stock and sector information
    const { data: holdings, error } = await supabase
      .from("portfolio_holdings")
      .select(`
        *,
        stocks:stock_id (
          *,
          sectors:sector_id (
            name
          ),
          stock_prices (
            current_price,
            pe_ratio,
            latest_earnings,
            market_cap,
            updated_at
          )
        )
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("[v0] Portfolio fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
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

    // Calculate portfolio metrics
    const portfolioData =
      holdings?.map((holding) => {
        const stock = holding.stocks
        const stockPrice = priceMap.get(holding.stock_id)
        const currentPrice = stockPrice?.current_price || holding.purchase_price
        
        console.log("[v0] Debug - Stock price lookup:", {
          symbol: stock?.symbol,
          stockId: holding.stock_id,
          stockPrice: stockPrice,
          currentPrice,
          purchasePrice: holding.purchase_price
        })
        
        const investment = holding.purchase_price * holding.quantity
        const presentValue = currentPrice * holding.quantity
        const gainLoss = presentValue - investment
        const gainLossPercent = investment > 0 ? (gainLoss / investment) * 100 : 0

        console.log("[v0] Processing portfolio holding:", {
          stock: stock?.symbol,
          purchasePrice: holding.purchase_price,
          currentPrice,
          investment,
          presentValue,
          gainLoss,
          gainLossPercent,
        })

        return {
          id: holding.id,
          particulars: stock?.name || "",
          symbol: stock?.symbol || "",
          purchasePrice: holding.purchase_price,
          quantity: holding.quantity,
          investment,
          exchange: stock?.exchange || "",
          currentPrice,
          presentValue,
          gainLoss,
          gainLossPercent,
          peRatio: stock?.stock_prices?.[0]?.pe_ratio || null,
          latestEarnings: stock?.stock_prices?.[0]?.latest_earnings || null,
          marketCap: stock?.stock_prices?.[0]?.market_cap || null,
          sector: stock?.sectors?.name || "Others",
          lastUpdated: stock?.stock_prices?.[0]?.updated_at || null,
        }
      }) || []

    // Calculate total portfolio value
    const totalInvestment = portfolioData.reduce((sum, item) => sum + item.investment, 0)
    const totalPresentValue = portfolioData.reduce((sum, item) => sum + item.presentValue, 0)
    const totalGainLoss = totalPresentValue - totalInvestment
    const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0

    // Add portfolio percentage for each holding
    const portfolioWithPercentages = portfolioData.map((item) => ({
      ...item,
      portfolioPercent: totalInvestment > 0 ? (item.investment / totalInvestment) * 100 : 0,
    }))

    console.log("[v0] Returning portfolio with", portfolioData.length, "holdings, total investment:", totalInvestment)

    return NextResponse.json({
      holdings: portfolioWithPercentages,
      summary: {
        totalInvestment,
        totalPresentValue,
        totalGainLoss,
        totalGainLossPercent,
        totalHoldings: portfolioData.length,
      },
    })
  } catch (error) {
    console.error("[v0] Portfolio API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { stockSymbol, purchasePrice, quantity } = body

    // Find stock by symbol
    const { data: stock, error: stockError } = await supabase
      .from("stocks")
      .select("id")
      .eq("symbol", stockSymbol)
      .single()

    if (stockError || !stock) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 })
    }

    // Insert or update portfolio holding
    const { data, error } = await supabase
      .from("portfolio_holdings")
      .upsert({
        user_id: user.id,
        stock_id: stock.id,
        purchase_price: purchasePrice,
        quantity: quantity,
      })
      .select()

    if (error) {
      console.error("Portfolio insert error:", error)
      return NextResponse.json({ error: "Failed to add holding" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Portfolio POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
