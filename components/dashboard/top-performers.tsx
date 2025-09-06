"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { usePortfolioData } from "@/hooks/use-portfolio-data"

export default function TopPerformers() {
  const { data: portfolio, isLoading } = usePortfolioData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
                <div className="h-4 bg-muted rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const holdings = portfolio?.holdings || []
  
  // Sort holdings by performance
  const sortedHoldings = [...holdings].sort((a, b) => b.gainLossPercent - a.gainLossPercent)
  
  const topPerformers = sortedHoldings.slice(0, 3)
  const worstPerformers = sortedHoldings.slice(-3).reverse()

  const getPerformanceIcon = (gainLossPercent: number) => {
    if (gainLossPercent > 0) return <TrendingUp className="w-4 h-4 text-chart-1" />
    if (gainLossPercent < 0) return <TrendingDown className="w-4 h-4 text-chart-2" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getPerformanceColor = (gainLossPercent: number) => {
    if (gainLossPercent > 0) return 'text-chart-1'
    if (gainLossPercent < 0) return 'text-chart-2'
    return 'text-muted-foreground'
  }

  const renderPerformanceList = (title: string, holdings: any[], isTop: boolean) => (
    <div className="space-y-3">
      <h4 className="font-medium text-foreground">{title}</h4>
      {holdings.map((holding, index) => (
        <div key={holding.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
            <span className="text-sm font-medium text-muted-foreground">
              {isTop ? index + 1 : holdings.length - index}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground truncate">{holding.symbol}</div>
            <div className="text-sm text-muted-foreground truncate">{holding.particulars}</div>
          </div>
          <div className="text-right">
            <div className={`font-medium ${getPerformanceColor(holding.gainLossPercent)}`}>
              {formatPercent(holding.gainLossPercent)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(holding.gainLoss)}
            </div>
          </div>
          <div className="flex items-center">
            {getPerformanceIcon(holding.gainLossPercent)}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top & Worst Performers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderPerformanceList("Top Performers", topPerformers, true)}
          
          <div className="border-t border-border pt-4">
            {renderPerformanceList("Worst Performers", worstPerformers, false)}
          </div>

          {/* Performance Summary */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Performance Insights</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Best Performer:</span>
                <span className="text-chart-1 font-medium">
                  {topPerformers[0]?.symbol} ({formatPercent(topPerformers[0]?.gainLossPercent || 0)})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Worst Performer:</span>
                <span className="text-chart-2 font-medium">
                  {worstPerformers[0]?.symbol} ({formatPercent(worstPerformers[0]?.gainLossPercent || 0)})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Performance Range:</span>
                <span className="font-medium">
                  {formatPercent(topPerformers[0]?.gainLossPercent || 0)} to {formatPercent(worstPerformers[0]?.gainLossPercent || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
