"use client"

import { useEffect, useState, useCallback } from "react"
import { DEMO_SECTOR_DATA } from "@/lib/demo-data"

interface SectorData {
  name: string
  totalInvestment: number
  totalPresentValue: number
  totalGainLoss: number
  gainLossPercent: number
  portfolioPercent: number
  stockCount: number
}

export function useSectorData() {
  const [sectors, setSectors] = useState<SectorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSectorData = useCallback(async (isRealTimeUpdate = false) => {
    try {
      if (isRealTimeUpdate) {
        setIsUpdating(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      console.log("[v0] Fetching sector data...")

      try {
        const response = await fetch("/api/sectors")
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch sector data`)
        }

        const data = await response.json()
        console.log("[v0] Sector data received:", {
          sectorsCount: data.sectors?.length || 0,
          totalPortfolioValue: data.totalPortfolioValue || 0,
        })

        setSectors(data.sectors || [])
      } catch (apiError) {
        // If API fails, use demo data
        console.log("[v0] API failed, using demo sector data:", apiError)
        setSectors(DEMO_SECTOR_DATA)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("[v0] Sector data fetch error:", err)

      // Don't clear existing data on update errors, only on initial load errors
      if (!isRealTimeUpdate) {
        setSectors([])
      }
    } finally {
      setIsLoading(false)
      setIsUpdating(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchSectorData()
  }, [fetchSectorData])

  // Real-time updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSectorData(true)
    }, 15000) // 15 seconds

    return () => clearInterval(interval)
  }, [fetchSectorData])

  return {
    sectors,
    isLoading,
    isUpdating,
    error,
  }
}
