import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import PortfolioPerformanceChart from "@/components/dashboard/portfolio-performance-chart"
import RiskAnalysis from "@/components/dashboard/risk-analysis"
import TopPerformers from "@/components/dashboard/top-performers"
import DiversificationMetrics from "@/components/dashboard/diversification-metrics"
import MarketCorrelation from "@/components/dashboard/market-correlation"
import PortfolioInsights from "@/components/dashboard/portfolio-insights"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  
  // Check if Supabase is configured, if not redirect to demo
  if (!supabase) {
    redirect("/demo")
  }

  // Skip authentication check for now - use demo data
  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser()

  // if (error || !user) {
  //   redirect("/auth/login")
  // }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portfolio Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Advanced insights and performance metrics for your portfolio
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live Analytics</span>
          </div>
        </div>

        {/* Portfolio Performance Trends */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <PortfolioPerformanceChart />
          </div>
        </div>

        {/* Risk Analysis and Top Performers */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RiskAnalysis />
          <TopPerformers />
        </div>

        {/* Diversification and Market Correlation */}
        <div className="grid lg:grid-cols-2 gap-6">
          <DiversificationMetrics />
          <MarketCorrelation />
        </div>

        {/* Portfolio Insights */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioInsights />
          </div>
          <div className="space-y-6">
            {/* Additional metrics can be added here */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
