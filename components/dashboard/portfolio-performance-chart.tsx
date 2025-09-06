"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { useState, useEffect } from "react"

// Mock historical data generator
const generateHistoricalData = (currentValue: number, days: number = 30) => {
  const data = []
  const baseValue = currentValue * 0.85 // Start 15% lower
  const volatility = 0.02 // 2% daily volatility
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Simulate realistic market movement
    const trend = (currentValue - baseValue) / days
    const randomFactor = (Math.random() - 0.5) * volatility
    const value = baseValue + (trend * (days - i)) + (baseValue * randomFactor)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(value, baseValue * 0.7), // Prevent extreme drops
      investment: currentValue * 0.9, // Assume investment was 90% of current value
    })
  }
  
  return data
}

export default function PortfolioPerformanceChart() {
  const { data: portfolio, isLoading } = usePortfolioData()
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D')

  useEffect(() => {
    if (portfolio?.summary?.totalPresentValue) {
      const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90
      const data = generateHistoricalData(portfolio.summary.totalPresentValue, days)
      setHistoricalData(data)
    }
  }, [portfolio?.summary?.totalPresentValue, timeRange])

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
          <div className="h-80 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const currentValue = portfolio?.summary?.totalPresentValue || 0
  const investment = portfolio?.summary?.totalInvestment || 0
  const gainLoss = portfolio?.summary?.totalGainLoss || 0
  const gainLossPercent = portfolio?.summary?.totalGainLossPercent || 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Performance</CardTitle>
          <div className="flex items-center space-x-2">
            {['7D', '30D', '90D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Performance Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(currentValue)}
              </div>
              <div className="text-sm text-muted-foreground">Current Value</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${gainLoss >= 0 ? 'text-chart-1' : 'text-chart-2'}`}>
                {formatCurrency(gainLoss)}
              </div>
              <div className="text-sm text-muted-foreground">Total Gain/Loss</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${gainLossPercent >= 0 ? 'text-chart-1' : 'text-chart-2'}`}>
                {formatPercent(gainLossPercent)}
              </div>
              <div className="text-sm text-muted-foreground">Return %</div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'value' ? 'Portfolio Value' : 'Investment',
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label)
                    return date.toLocaleDateString()
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="investment"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  fill="none"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="url(#portfolioGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
