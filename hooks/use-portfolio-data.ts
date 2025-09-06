"use client"

import { useEffect, useState, useCallback } from "react"
import { DEMO_PORTFOLIO_DATA } from "@/lib/demo-data"

interface PortfolioHolding {
  id: string
  particulars: string
  symbol: string
  purchasePrice: number
  quantity: number
  investment: number
  exchange: string
  currentPrice: number
  presentValue: number
  gainLoss: number
  gainLossPercent: number
  portfolioPercent: number
  peRatio: number | null
  latestEarnings: number | null
  marketCap: number | null
  sector: string
  lastUpdated: string | null
}

interface PortfolioSummary {
  totalInvestment: number
  totalPresentValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  totalHoldings: number
}

interface PortfolioData {
  holdings: PortfolioHolding[]
  summary: PortfolioSummary
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolioData = useCallback(async (isRealTimeUpdate = false) => {
    try {
      if (isRealTimeUpdate) {
        setIsUpdating(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      console.log("[v0] Fetching portfolio data...")

      try {
        // First update stock prices
        await fetch("/api/stocks/prices", { method: "GET" })

        // Then fetch updated portfolio data
        const response = await fetch("/api/portfolio")
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch portfolio data`)
        }

        const portfolioData = await response.json()
        console.log("[v0] Portfolio data received:", {
          holdingsCount: portfolioData.holdings?.length || 0,
          totalInvestment: portfolioData.summary?.totalInvestment || 0,
        })

        setData(portfolioData)
        setLastUpdated(new Date())
      } catch (apiError) {
        // If API fails, use demo data
        console.log("[v0] API failed, using demo data:", apiError)
        setData(DEMO_PORTFOLIO_DATA as PortfolioData)
        setLastUpdated(new Date())
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("[v0] Portfolio data fetch error:", err)

      // Don't clear existing data on update errors, only on initial load errors
      if (!isRealTimeUpdate) {
        setData(null)
      }
    } finally {
      setIsLoading(false)
      setIsUpdating(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchPortfolioData()
  }, [fetchPortfolioData])

  // Real-time updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPortfolioData(true)
    }, 15000) // 15 seconds

    return () => clearInterval(interval)
  }, [fetchPortfolioData])

  const refreshData = useCallback(() => {
    fetchPortfolioData(true)
  }, [fetchPortfolioData])

  return {
    data,
    isLoading,
    isUpdating,
    lastUpdated,
    error,
    refreshData,
  }
}
