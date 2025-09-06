"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, Info, ArrowUpDown } from "lucide-react"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import TrendIndicator from "@/components/ui/trend-indicator"
import AnimatedNumber from "@/components/ui/animated-number"
import { useState } from "react"

type SortField = "particulars" | "investment" | "presentValue" | "gainLoss" | "gainLossPercent"
type SortDirection = "asc" | "desc"

export default function PortfolioTable() {
  const { data, isLoading, isUpdating, lastUpdated, error, refreshData } = usePortfolioData()
  const [sortField, setSortField] = useState<SortField>("gainLossPercent")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

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

  const formatNumber = (num: number | null) => {
    if (num === null) return "N/A"
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedHoldings = data?.holdings
    ? [...data.holdings].sort((a, b) => {
        let aValue: number | string
        let bValue: number | string

        switch (sortField) {
          case "particulars":
            aValue = a.particulars
            bValue = b.particulars
            break
          case "investment":
            aValue = a.investment
            bValue = b.investment
            break
          case "presentValue":
            aValue = a.presentValue
            bValue = b.presentValue
            break
          case "gainLoss":
            aValue = a.gainLoss
            bValue = b.gainLoss
            break
          case "gainLossPercent":
            aValue = a.gainLossPercent
            bValue = b.gainLossPercent
            break
          default:
            return 0
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        const numA = Number(aValue)
        const numB = Number(bValue)
        return sortDirection === "asc" ? numA - numB : numB - numA
      })
    : []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refreshData} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card className={isUpdating ? "ring-2 ring-primary/20 transition-all duration-300" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Portfolio Holdings</span>
              {isUpdating && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              )}
            </CardTitle>
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <span className="text-sm text-muted-foreground">Updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={refreshData} disabled={isUpdating} className="h-8 w-8 p-0">
                    <RefreshCw className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh portfolio data</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("investment")}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Investment</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Portfolio %</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead className="text-right">CMP</TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("presentValue")}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Present Value</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("gainLossPercent")}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Gain/Loss</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span>P/E Ratio</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Price-to-Earnings Ratio</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHoldings.map((holding, index) => (
                  <TableRow
                    key={holding.id}
                    className="hover:bg-muted/30 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{holding.particulars}</div>
                        <div className="text-sm text-muted-foreground">{holding.symbol}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {holding.sector}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        <AnimatedNumber value={holding.investment} formatter={formatCurrency} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {holding.quantity} × {formatCurrency(holding.purchasePrice)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{holding.portfolioPercent.toFixed(1)}%</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{holding.exchange}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        <AnimatedNumber value={holding.currentPrice} formatter={formatCurrency} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        <AnimatedNumber value={holding.presentValue} formatter={formatCurrency} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className={`font-medium ${holding.gainLoss >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                          <AnimatedNumber value={holding.gainLoss} formatter={formatCurrency} />
                        </div>
                        <TrendIndicator value={holding.gainLossPercent} size="sm" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{formatNumber(holding.peRatio)}</div>
                      {holding.latestEarnings && (
                        <div className="text-xs text-muted-foreground">EPS: {formatNumber(holding.latestEarnings)}</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {sortedHoldings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No portfolio holdings found. Add some stocks to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
