"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useSectorData } from "@/hooks/use-sector-data"

const SECTOR_COLORS = [
  "hsl(var(--chart-1))", // Financial - Green
  "hsl(var(--chart-2))", // Technology - Red
  "hsl(var(--chart-3))", // Consumer - Amber
  "hsl(var(--chart-4))", // Power - Lime
  "hsl(var(--chart-5))", // Pipe - Emerald
  "hsl(var(--primary))", // Others - Primary
]

export default function SectorPerformanceChart() {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare data for charts
  const performanceData = sectors.map((sector, index) => ({
    name: sector.name,
    gainLoss: sector.totalGainLoss,
    gainLossPercent: sector.gainLossPercent,
    investment: sector.totalInvestment,
    presentValue: sector.totalPresentValue,
    color: SECTOR_COLORS[index % SECTOR_COLORS.length],
  }))

  const allocationData = sectors.map((sector, index) => ({
    name: sector.name,
    value: sector.portfolioPercent,
    investment: sector.totalInvestment,
    color: SECTOR_COLORS[index % SECTOR_COLORS.length],
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Sector Performance Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={formatPercent} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value: number, name: string) => [
                  name === "gainLossPercent" ? formatPercent(value) : formatCurrency(value),
                  name === "gainLossPercent" ? "Performance" : "Gain/Loss",
                ]}
              />
              <Bar dataKey="gainLossPercent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Portfolio Allocation Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                labelLine={false}
              >
                {allocationData.map((entry, index) => (
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
                  `${props.payload.name} (${formatCurrency(props.payload.investment)})`,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
