export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Portfolio Tracker</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Portfolio Dashboard</h1>
              <p className="text-muted-foreground mt-1">Demo Mode - Using sample data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-sm font-medium text-muted-foreground">Total Investment</h3>
              <p className="text-2xl font-bold text-blue-600">₹5,50,741</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-sm font-medium text-muted-foreground">Current Value</h3>
              <p className="text-2xl font-bold text-emerald-600">₹6,21,484</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-sm font-medium text-muted-foreground">Total Gain/Loss</h3>
              <p className="text-2xl font-bold text-green-600">+₹70,743</p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-sm font-medium text-muted-foreground">Holdings</h3>
              <p className="text-2xl font-bold text-purple-600">7 stocks</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Portfolio Holdings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-medium">HDFC Bank</h3>
                  <p className="text-sm text-muted-foreground">HDFCBANK • Financial</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹85,000</p>
                  <p className="text-sm text-green-600">+14.09%</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-medium">Bajaj Finance</h3>
                  <p className="text-sm text-muted-foreground">BAJFINANCE • Financial</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹1,26,300</p>
                  <p className="text-sm text-green-600">+30.22%</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <div>
                  <h3 className="font-medium">ICICI Bank</h3>
                  <p className="text-sm text-muted-foreground">ICICIBANK • Financial</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹1,07,520</p>
                  <p className="text-sm text-green-600">+64.10%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
