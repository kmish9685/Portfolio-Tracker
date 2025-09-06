"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useSectorData } from "@/hooks/use-sector-data"

export default function MarketCorrelation() {
  const { sectors, isLoading } = useSectorData()

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
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded animate-pulse w-20" />
                    <div className="h-3 bg-muted rounded animate-pulse w-16" />
                  </div>
                </div>
                <div className="h-4 bg-muted rounded animate-pulse w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mock correlation data (in a real app, this would come from market data)
  const correlationData = [
    { sector: 'Financial', correlation: 0.85, beta: 1.2, volatility: 18 },
    { sector: 'Technology', correlation: 0.92, beta: 1.4, volatility: 25 },
    { sector: 'Consumer', correlation: 0.78, beta: 0.9, volatility: 15 },
    { sector: 'Power', correlation: 0.88, beta: 1.1, volatility: 22 },
    { sector: 'Pipe', correlation: 0.82, beta: 1.0, volatility: 20 },
    { sector: 'Others', correlation: 0.75, beta: 0.8, volatility: 19 },
  ]

  // Calculate portfolio-level metrics
  const totalValue = sectors.reduce((sum, sector) => sum + sector.totalInvestment, 0)
  const weightedCorrelation = sectors.reduce((sum, sector) => {
    const weight = sector.totalInvestment / totalValue
    const correlation = correlationData.find(c => c.sector === sector.name)?.correlation || 0.8
    return sum + (weight * correlation)
  }, 0)

  const weightedBeta = sectors.reduce((sum, sector) => {
    const weight = sector.totalInvestment / totalValue
    const beta = correlationData.find(c => c.sector === sector.name)?.beta || 1.0
    return sum + (weight * beta)
  }, 0)

  const weightedVolatility = sectors.reduce((sum, sector) => {
    const weight = sector.totalInvestment / totalValue
    const volatility = correlationData.find(c => c.sector === sector.name)?.volatility || 20
    return sum + (weight * volatility)
  }, 0)

  const getCorrelationLevel = (correlation: number) => {
    if (correlation > 0.9) return { level: 'Very High', color: 'bg-chart-2 text-chart-2-foreground' }
    if (correlation > 0.8) return { level: 'High', color: 'bg-chart-3 text-chart-3-foreground' }
    if (correlation > 0.6) return { level: 'Moderate', color: 'bg-chart-4 text-chart-4-foreground' }
    return { level: 'Low', color: 'bg-chart-1 text-chart-1-foreground' }
  }

  const getBetaIcon = (beta: number) => {
    if (beta > 1.2) return <TrendingUp className="w-4 h-4 text-chart-2" />
    if (beta < 0.8) return <TrendingDown className="w-4 h-4 text-chart-1" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Correlation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {(weightedCorrelation * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Correlation</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {weightedBeta.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Portfolio Beta</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {weightedVolatility.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">Volatility</div>
            </div>
          </div>

          {/* Sector Correlations */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Sector Correlations</h4>
            {sectors.map((sector, index) => {
              const correlation = correlationData.find(c => c.sector === sector.name)
              if (!correlation) return null

              const correlationInfo = getCorrelationLevel(correlation.correlation)
              
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      <span className="text-sm font-medium text-muted-foreground">
                        {sector.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{sector.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(sector.totalInvestment)} • {sector.stockCount} stocks
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium text-foreground">
                        {(correlation.correlation * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        β {correlation.beta.toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getBetaIcon(correlation.beta)}
                      <Badge variant="secondary" className={correlationInfo.color}>
                        {correlationInfo.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Market Insights */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Market Insights</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {weightedBeta > 1.2 && (
                <p>• Your portfolio is highly sensitive to market movements (β = {weightedBeta.toFixed(2)})</p>
              )}
              {weightedBeta < 0.8 && (
                <p>• Your portfolio is defensive and less sensitive to market movements</p>
              )}
              {weightedCorrelation > 0.85 && (
                <p>• High correlation with market - consider adding defensive assets</p>
              )}
              {weightedVolatility > 22 && (
                <p>• Above-average volatility - monitor risk exposure</p>
              )}
              {weightedVolatility < 18 && (
                <p>• Lower volatility portfolio - good for risk-averse investors</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
