import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HomePage() {
  const supabase = await createClient()
  
  // If Supabase is not configured, show demo mode
  if (!supabase) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Portfolio Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/demo">
                <Button variant="outline">View Demo</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Professional Portfolio Management Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Track your investments with real-time market data, sector analysis, and comprehensive portfolio insights.
              Built for serious investors who demand precision and performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  View Dashboard
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Real-Time Data</CardTitle>
                <CardDescription>Live market prices and portfolio valuations updated every 15 seconds</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stay ahead with instant price updates from Yahoo Finance and comprehensive financial metrics from Google
                  Finance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Sector Analysis</CardTitle>
                <CardDescription>Comprehensive breakdown by industry sectors and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Understand your portfolio allocation across Financial, Technology, Consumer, and other sectors with
                  detailed analytics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Professional Interface</CardTitle>
                <CardDescription>Clean, data-focused design inspired by Bloomberg and trading platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intuitive dashboard with advanced filtering, sorting, and visualization tools for professional
                  investment management.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Portfolio Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Professional Portfolio Management Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Track your investments with real-time market data, sector analysis, and comprehensive portfolio insights.
            Built for serious investors who demand precision and performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Real-Time Data</CardTitle>
              <CardDescription>Live market prices and portfolio valuations updated every 15 seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stay ahead with instant price updates from Yahoo Finance and comprehensive financial metrics from Google
                Finance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Sector Analysis</CardTitle>
              <CardDescription>Comprehensive breakdown by industry sectors and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Understand your portfolio allocation across Financial, Technology, Consumer, and other sectors with
                detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Professional Interface</CardTitle>
              <CardDescription>Clean, data-focused design inspired by Bloomberg and trading platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Intuitive dashboard with advanced filtering, sorting, and visualization tools for professional
                investment management.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
