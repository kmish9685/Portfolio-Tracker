import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import PortfolioTable from "@/components/dashboard/portfolio-table"
import PortfolioSummary from "@/components/dashboard/portfolio-summary"
import SectorAnalysis from "@/components/dashboard/sector-analysis"
import SectorPerformanceChart from "@/components/dashboard/sector-performance-chart"
import MarketStatusIndicator from "@/components/ui/market-status-indicator"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">Portfolio Dashboard</h1>
          <MarketStatusIndicator />
        </div>

        <PortfolioSummary />

        <SectorPerformanceChart />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioTable />
          </div>
          <div>
            <SectorAnalysis />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
