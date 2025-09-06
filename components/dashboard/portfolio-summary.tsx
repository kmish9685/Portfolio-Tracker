"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import TrendIndicator from "@/components/ui/trend-indicator"
import AnimatedNumber from "@/components/ui/animated-number"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

export default function PortfolioSummary() {
  const { data, isLoading, isUpdating } = usePortfolioData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const summary = data?.summary

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No portfolio data available</p>
        </CardContent>
      </Card>
    )
  }

  const cards = [
    {
      title: "Total Investment",
      value: summary.totalInvestment,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Current Value",
      value: summary.totalPresentValue,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Total Gain/Loss",
      value: summary.totalGainLoss,
      icon: summary.totalGainLoss >= 0 ? TrendingUp : TrendingDown,
      color: summary.totalGainLoss >= 0 ? "text-chart-1" : "text-chart-2",
      bgColor: summary.totalGainLoss >= 0 ? "bg-green-50" : "bg-red-50",
      showTrend: true,
      trendValue: summary.totalGainLossPercent,
    },
    {
      title: "Holdings",
      value: summary.totalHoldings,
      icon: PieChart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      suffix: " stocks",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className={`transition-all duration-300 hover:shadow-md ${
              isUpdating ? "ring-2 ring-primary/20 scale-[1.02]" : ""
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${card.color}`}>
                  <AnimatedNumber
                    value={card.value}
                    formatter={(val) =>
                      card.title === "Holdings" ? `${Math.round(val)}${card.suffix || ""}` : formatCurrency(val)
                    }
                  />
                </div>
                {card.showTrend && card.trendValue !== undefined && (
                  <TrendIndicator value={card.trendValue} size="sm" />
                )}
                {isUpdating && (
                  <div className="flex items-center space-x-1 text-xs text-primary">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <span>Updating...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
