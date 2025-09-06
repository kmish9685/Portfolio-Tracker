"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSectorData } from "@/hooks/use-sector-data"

export default function SectorAnalysis() {
  const { sectors, isLoading, isUpdating } = useSectorData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sector Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-2 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isUpdating ? "ring-2 ring-primary/20" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sector Analysis</CardTitle>
          {isUpdating && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary">Updating</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sectors.map((sector) => (
            <div key={sector.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{sector.name}</h4>
                  <p className="text-sm text-muted-foreground">{sector.stockCount} stocks</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(sector.totalInvestment)}</div>
                  <div className={`text-sm ${sector.gainLossPercent >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                    {formatPercent(sector.gainLossPercent)}
                  </div>
                </div>
              </div>
              <Progress value={sector.portfolioPercent} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{sector.portfolioPercent.toFixed(1)}% of portfolio</span>
                <span>{formatCurrency(sector.totalGainLoss)}</span>
              </div>
            </div>
          ))}
        </div>
        {sectors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No sector data available. Add portfolio holdings to see sector breakdown.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
