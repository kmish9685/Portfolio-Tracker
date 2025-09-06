"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Clock, TrendingUp, TrendingDown } from "lucide-react"

interface MarketStatus {
  isOpen: boolean
  nextOpen: string
  nextClose: string
  timezone: string
  currentTime: string
  tradingSession: string
}

export default function MarketStatusIndicator() {
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch("/api/stocks/market-status")
        if (response.ok) {
          const status = await response.json()
          setMarketStatus(status)
        }
      } catch (error) {
        console.error("Failed to fetch market status:", error)
      }
    }

    fetchMarketStatus()
    const interval = setInterval(fetchMarketStatus, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!marketStatus) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-muted rounded-full animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading market status...</span>
      </div>
    )
  }

  const getStatusColor = () => {
    if (marketStatus.isOpen) return "bg-chart-1"
    if (marketStatus.tradingSession === "pre-market" || marketStatus.tradingSession === "after-market")
      return "bg-chart-3"
    return "bg-chart-2"
  }

  const getStatusText = () => {
    if (marketStatus.isOpen) return "Market Open"
    if (marketStatus.tradingSession === "pre-market") return "Pre-Market"
    if (marketStatus.tradingSession === "after-market") return "After Hours"
    return "Market Closed"
  }

  const getStatusIcon = () => {
    if (marketStatus.isOpen) return <TrendingUp className="h-3 w-3" />
    if (marketStatus.tradingSession === "pre-market" || marketStatus.tradingSession === "after-market")
      return <Clock className="h-3 w-3" />
    return <TrendingDown className="h-3 w-3" />
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${marketStatus.isOpen ? "animate-pulse" : ""}`} />
        <Badge variant={marketStatus.isOpen ? "default" : "secondary"} className="text-xs">
          {getStatusIcon()}
          <span className="ml-1">{getStatusText()}</span>
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">
        IST: {currentTime.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}
      </div>
    </div>
  )
}
