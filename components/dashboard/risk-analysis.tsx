"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { useSectorData } from "@/hooks/use-sector-data"

export default function RiskAnalysis() {
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

  // Calculate risk metrics
  const totalValue = portfolio?.summary?.totalPresentValue || 0
  const totalInvestment = portfolio?.summary?.totalInvestment || 0
  
  // Calculate portfolio volatility (simplified)
  const sectorVolatilities = {
    'Financial': 0.18,
    'Technology': 0.25,
    'Power': 0.22,
    'Consumer': 0.15,
    'Pipe': 0.20,
    'Others': 0.19,
  }
  
  const portfolioVolatility = sectors.reduce((acc, sector) => {
    const weight = sector.portfolioPercent / 100
    const volatility = sectorVolatilities[sector.name as keyof typeof sectorVolatilities] || 0.20
    return acc + (weight * volatility)
  }, 0)

  // Calculate concentration risk (max sector allocation)
  const maxSectorAllocation = Math.max(...sectors.map(s => s.portfolioPercent))
  const concentrationRisk = maxSectorAllocation > 40 ? 'High' : maxSectorAllocation > 25 ? 'Medium' : 'Low'

  // Calculate diversification score
  const diversificationScore = sectors.length > 0 
    ? Math.min(100, (sectors.length * 15) + (100 - maxSectorAllocation))
    : 0

  // Calculate Sharpe ratio (simplified)
  const riskFreeRate = 0.06 // 6% risk-free rate
  const portfolioReturn = portfolio?.summary?.totalGainLossPercent || 0
  const sharpeRatio = portfolioVolatility > 0 ? (portfolioReturn - riskFreeRate) / portfolioVolatility : 0

  const riskMetrics = [
    {
      label: 'Portfolio Volatility',
      value: `${(portfolioVolatility * 100).toFixed(1)}%`,
      description: 'Annual volatility',
      level: portfolioVolatility > 0.20 ? 'High' : portfolioVolatility > 0.15 ? 'Medium' : 'Low',
      progress: Math.min(portfolioVolatility * 100, 100),
    },
    {
      label: 'Concentration Risk',
      value: concentrationRisk,
      description: `Max sector: ${maxSectorAllocation.toFixed(1)}%`,
      level: concentrationRisk,
      progress: maxSectorAllocation,
    },
    {
      label: 'Diversification Score',
      value: `${diversificationScore.toFixed(0)}/100`,
      description: 'Portfolio spread',
      level: diversificationScore > 80 ? 'High' : diversificationScore > 60 ? 'Medium' : 'Low',
      progress: diversificationScore,
    },
    {
      label: 'Sharpe Ratio',
      value: sharpeRatio.toFixed(2),
      description: 'Risk-adjusted return',
      level: sharpeRatio > 1 ? 'High' : sharpeRatio > 0.5 ? 'Medium' : 'Low',
      progress: Math.max(0, Math.min(sharpeRatio * 50, 100)),
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-chart-1 text-chart-1-foreground'
      case 'Medium': return 'bg-chart-3 text-chart-3-foreground'
      case 'Low': return 'bg-chart-2 text-chart-2-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {riskMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{metric.label}</div>
                  <div className="text-sm text-muted-foreground">{metric.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-foreground">{metric.value}</div>
                  <Badge variant="secondary" className={getLevelColor(metric.level)}>
                    {metric.level}
                  </Badge>
                </div>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}
          
          {/* Risk Summary */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Risk Summary</h4>
            <p className="text-sm text-muted-foreground">
              Your portfolio shows {concentrationRisk.toLowerCase()} concentration risk with 
              {portfolioVolatility > 0.20 ? ' high' : portfolioVolatility > 0.15 ? ' moderate' : ' low'} volatility. 
              Consider diversifying across more sectors to reduce concentration risk.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
