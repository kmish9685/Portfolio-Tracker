"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle } from "lucide-react"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { useSectorData } from "@/hooks/use-sector-data"

export default function PortfolioInsights() {
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolioData()
  const { sectors, isLoading: sectorsLoading } = useSectorData()

  const isLoading = portfolioLoading || sectorsLoading

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
              <div key={i} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const holdings = portfolio?.holdings || []
  const totalValue = portfolio?.summary?.totalPresentValue || 0
  const totalInvestment = portfolio?.summary?.totalInvestment || 0
  const totalGainLoss = portfolio?.summary?.totalGainLoss || 0
  const totalGainLossPercent = portfolio?.summary?.totalGainLossPercent || 0

  // Generate insights based on portfolio data
  const insights = []

  // Performance insights
  if (totalGainLossPercent > 10) {
    insights.push({
      type: 'success',
      icon: <TrendingUp className="w-5 h-5 text-chart-1" />,
      title: 'Strong Performance',
      description: `Your portfolio is up ${formatPercent(totalGainLossPercent)} this period, significantly outperforming market averages.`,
      action: 'Consider taking some profits or rebalancing.'
    })
  } else if (totalGainLossPercent < -5) {
    insights.push({
      type: 'warning',
      icon: <TrendingDown className="w-5 h-5 text-chart-2" />,
      title: 'Underperformance',
      description: `Your portfolio is down ${formatPercent(Math.abs(totalGainLossPercent))} this period.`,
      action: 'Review your holdings and consider defensive positions.'
    })
  }

  // Diversification insights
  const maxSectorAllocation = Math.max(...sectors.map(s => s.portfolioPercent))
  if (maxSectorAllocation > 40) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="w-5 h-5 text-chart-3" />,
      title: 'High Concentration Risk',
      description: `Your largest sector represents ${maxSectorAllocation.toFixed(1)}% of your portfolio.`,
      action: 'Consider diversifying across more sectors to reduce risk.'
    })
  } else if (maxSectorAllocation < 25) {
    insights.push({
      type: 'success',
      icon: <CheckCircle className="w-5 h-5 text-chart-1" />,
      title: 'Well Diversified',
      description: 'Your portfolio shows good diversification across sectors.',
      action: 'Maintain this balanced approach.'
    })
  }

  // Stock count insights
  if (holdings.length < 10) {
    insights.push({
      type: 'info',
      icon: <Target className="w-5 h-5 text-chart-4" />,
      title: 'Limited Holdings',
      description: `You have ${holdings.length} stocks in your portfolio.`,
      action: 'Consider adding more stocks to improve diversification.'
    })
  } else if (holdings.length > 30) {
    insights.push({
      type: 'info',
      icon: <Target className="w-5 h-5 text-chart-4" />,
      title: 'Large Portfolio',
      description: `You have ${holdings.length} stocks in your portfolio.`,
      action: 'Consider consolidating to focus on your best performers.'
    })
  }

  // Sector performance insights
  const bestSector = sectors.reduce((best, sector) => 
    sector.gainLossPercent > best.gainLossPercent ? sector : best
  )
  const worstSector = sectors.reduce((worst, sector) => 
    sector.gainLossPercent < worst.gainLossPercent ? sector : worst
  )

  if (bestSector.gainLossPercent > 5) {
    insights.push({
      type: 'success',
      icon: <TrendingUp className="w-5 h-5 text-chart-1" />,
      title: 'Sector Outperformer',
      description: `${bestSector.name} sector is up ${formatPercent(bestSector.gainLossPercent)} and contributing significantly to returns.`,
      action: 'Monitor for potential profit-taking opportunities.'
    })
  }

  if (worstSector.gainLossPercent < -5) {
    insights.push({
      type: 'warning',
      icon: <TrendingDown className="w-5 h-5 text-chart-2" />,
      title: 'Sector Underperformer',
      description: `${worstSector.name} sector is down ${formatPercent(Math.abs(worstSector.gainLossPercent))} and dragging performance.`,
      action: 'Review holdings in this sector for potential exits.'
    })
  }

  // Portfolio size insights
  if (totalValue > 1000000) {
    insights.push({
      type: 'info',
      icon: <CheckCircle className="w-5 h-5 text-chart-1" />,
      title: 'Large Portfolio Value',
      description: `Your portfolio is worth ${formatCurrency(totalValue)}, giving you access to institutional-grade strategies.`,
      action: 'Consider professional management or advanced strategies.'
    })
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-chart-1 bg-chart-1/5'
      case 'warning': return 'border-chart-3 bg-chart-3/5'
      case 'info': return 'border-chart-4 bg-chart-4/5'
      default: return 'border-muted bg-muted/5'
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-chart-1 text-chart-1-foreground'
      case 'warning': return 'bg-chart-3 text-chart-3-foreground'
      case 'info': return 'bg-chart-4 text-chart-4-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-chart-1" />
              <p>Your portfolio looks well-balanced!</p>
              <p className="text-sm">No immediate action items at this time.</p>
            </div>
          ) : (
            insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <Badge variant="secondary" className={getBadgeColor(insight.type)}>
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.description}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      💡 {insight.action}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Portfolio Summary Stats */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Holdings:</span>
                <span className="font-medium">{holdings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sectors:</span>
                <span className="font-medium">{sectors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Return:</span>
                <span className={`font-medium ${totalGainLossPercent >= 0 ? 'text-chart-1' : 'text-chart-2'}`}>
                  {formatPercent(totalGainLossPercent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Portfolio Value:</span>
                <span className="font-medium">{formatCurrency(totalValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
