"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useSectorData } from "@/hooks/use-sector-data"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function SectorDetailedTable() {
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
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`
  }

  const getTrendIcon = (percent: number) => {
    if (percent > 0) return <TrendingUp className="h-4 w-4 text-chart-1" />
    if (percent < 0) return <TrendingDown className="h-4 w-4 text-chart-2" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getPerformanceLevel = (percent: number) => {
    if (percent >= 10) return { label: "Excellent", variant: "default" as const, color: "text-chart-1" }
    if (percent >= 5) return { label: "Good", variant: "secondary" as const, color: "text-chart-1" }
    if (percent >= 0) return { label: "Positive", variant: "outline" as const, color: "text-chart-1" }
    if (percent >= -5) return { label: "Moderate Loss", variant: "outline" as const, color: "text-chart-2" }
    return { label: "High Loss", variant: "destructive" as const, color: "text-chart-2" }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detailed Sector Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort sectors by performance
  const sortedSectors = [...sectors].sort((a, b) => b.gainLossPercent - a.gainLossPercent)

  return (
    <Card className={isUpdating ? "ring-2 ring-primary/20" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Detailed Sector Analysis</CardTitle>
          {isUpdating && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary">Updating</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Investment</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Performance</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSectors.map((sector) => {
                const performance = getPerformanceLevel(sector.gainLossPercent)
                return (
                  <TableRow key={sector.name}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(sector.gainLossPercent)}
                        <div>
                          <div className="font-medium">{sector.name}</div>
                          <div className="text-sm text-muted-foreground">{sector.stockCount} stocks</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(sector.totalInvestment)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(sector.totalPresentValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className={`font-medium ${sector.totalGainLoss >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                        {formatCurrency(sector.totalGainLoss)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`font-medium ${performance.color}`}>{formatPercent(sector.gainLossPercent)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{sector.portfolioPercent.toFixed(1)}%</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={performance.variant} className="text-xs">
                        {performance.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        {sectors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No sector data available. Add portfolio holdings to see sector analysis.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
