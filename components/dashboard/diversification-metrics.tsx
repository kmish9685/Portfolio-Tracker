"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useSectorData } from "@/hooks/use-sector-data"

const SECTOR_COLORS = [
  "hsl(var(--chart-1))", // Financial - Green
  "hsl(var(--chart-2))", // Technology - Red
  "hsl(var(--chart-3))", // Consumer - Amber
  "hsl(var(--chart-4))", // Power - Lime
  "hsl(var(--chart-5))", // Pipe - Emerald
  "hsl(var(--primary))", // Others - Primary
]

export default function DiversificationMetrics() {
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
    return `${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate diversification metrics
  const totalSectors = sectors.length
  const maxSectorAllocation = Math.max(...sectors.map(s => s.portfolioPercent))
  const minSectorAllocation = Math.min(...sectors.map(s => s.portfolioPercent))
  
  // Calculate Herfindahl-Hirschman Index (HHI) - concentration measure
  const hhi = sectors.reduce((sum, sector) => {
    const weight = sector.portfolioPercent / 100
    return sum + (weight * weight)
  }, 0)
  
  // Convert HHI to diversification score (0-100)
  const diversificationScore = Math.max(0, 100 - (hhi * 100))
  
  // Calculate sector balance score
  const idealAllocation = 100 / totalSectors
  const sectorBalanceScore = sectors.reduce((sum, sector) => {
    const deviation = Math.abs(sector.portfolioPercent - idealAllocation)
    return sum + Math.max(0, idealAllocation - deviation)
  }, 0) / totalSectors

  // Prepare data for pie chart
  const pieData = sectors.map((sector, index) => ({
    name: sector.name,
    value: sector.portfolioPercent,
    investment: sector.totalInvestment,
    color: SECTOR_COLORS[index % SECTOR_COLORS.length],
  }))

  const metrics = [
    {
      label: 'Diversification Score',
      value: `${diversificationScore.toFixed(0)}/100`,
      description: 'Portfolio spread quality',
      level: diversificationScore > 80 ? 'Excellent' : diversificationScore > 60 ? 'Good' : diversificationScore > 40 ? 'Fair' : 'Poor',
      progress: diversificationScore,
    },
    {
      label: 'Sector Balance',
      value: `${(sectorBalanceScore * 100).toFixed(0)}/100`,
      description: 'Allocation uniformity',
      level: sectorBalanceScore > 0.8 ? 'Excellent' : sectorBalanceScore > 0.6 ? 'Good' : sectorBalanceScore > 0.4 ? 'Fair' : 'Poor',
      progress: sectorBalanceScore * 100,
    },
    {
      label: 'Concentration Risk',
      value: `${maxSectorAllocation.toFixed(1)}%`,
      description: 'Max sector allocation',
      level: maxSectorAllocation > 40 ? 'High' : maxSectorAllocation > 25 ? 'Medium' : 'Low',
      progress: maxSectorAllocation,
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Excellent': return 'bg-chart-1 text-chart-1-foreground'
      case 'Good': return 'bg-chart-3 text-chart-3-foreground'
      case 'Fair': return 'bg-chart-4 text-chart-4-foreground'
      case 'Poor': return 'bg-chart-2 text-chart-2-foreground'
      case 'High': return 'bg-chart-2 text-chart-2-foreground'
      case 'Medium': return 'bg-chart-3 text-chart-3-foreground'
      case 'Low': return 'bg-chart-1 text-chart-1-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diversification Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(1)}%`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Diversification Metrics */}
          <div className="space-y-4">
            {metrics.map((metric, index) => (
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
          </div>

          {/* Sector Legend */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Sector Allocation</h4>
            <div className="grid grid-cols-2 gap-2">
              {pieData.map((sector, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="text-sm text-muted-foreground">{sector.name}</span>
                  <span className="text-sm font-medium ml-auto">{formatPercent(sector.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Diversification Tips</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {maxSectorAllocation > 40 && (
                <p>• Consider reducing allocation to your largest sector ({maxSectorAllocation.toFixed(1)}%)</p>
              )}
              {totalSectors < 6 && (
                <p>• Add holdings from more sectors to improve diversification</p>
              )}
              {diversificationScore < 60 && (
                <p>• Your portfolio could benefit from more balanced sector allocation</p>
              )}
              {diversificationScore >= 80 && (
                <p>• Excellent diversification! Your portfolio is well-balanced across sectors.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
