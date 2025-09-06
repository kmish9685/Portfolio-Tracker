import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SectorPerformanceChart from "@/components/dashboard/sector-performance-chart"
import SectorDetailedTable from "@/components/dashboard/sector-detailed-table"
import SectorAnalysis from "@/components/dashboard/sector-analysis"

export default async function SectorsPage() {
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Sector Analysis</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live Updates Every 15s</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectorPerformanceChart />
            <SectorDetailedTable />
          </div>
          <div>
            <SectorAnalysis />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
