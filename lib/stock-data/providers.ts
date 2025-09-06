// Stock data provider interfaces and implementations
export interface StockPrice {
  symbol: string
  currentPrice: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  lastUpdated: Date
}

export interface StockFundamentals {
  symbol: string
  peRatio: number | null
  pbRatio: number | null
  dividendYield: number | null
  eps: number | null
  revenue: number | null
  netIncome: number | null
  lastUpdated: Date
}

export interface StockDataProvider {
  name: string
  getPrices(symbols: string[]): Promise<StockPrice[]>
  getFundamentals(symbols: string[]): Promise<StockFundamentals[]>
}

// Enhanced mock data that simulates real market conditions
const MOCK_STOCK_DATA = {
  HDFCBANK: {
    basePrice: 1700,
    volatility: 0.02,
    peRatio: 18.69,
    pbRatio: 2.8,
    dividendYield: 1.2,
    eps: 91.02,
    revenue: 321990,
    netIncome: 69181,
    marketCap: 1300796,
  },
  BAJFINANCE: {
    basePrice: 8420,
    volatility: 0.03,
    peRatio: 32.63,
    pbRatio: 6.7,
    dividendYield: 0.8,
    eps: 257.8,
    revenue: 62279,
    netIncome: 15375,
    marketCap: 521013,
  },
  ICICIBANK: {
    basePrice: 1280,
    volatility: 0.025,
    peRatio: 17.68,
    pbRatio: 3.3,
    dividendYield: 1.5,
    eps: 68.72,
    revenue: 174379,
    netIncome: 47368,
    marketCap: 859584,
  },
  BAJAJHSG: {
    basePrice: 1356,
    volatility: 0.04,
    peRatio: 5.72,
    pbRatio: 6.2,
    dividendYield: 0.5,
    eps: 22.53,
    revenue: 8527,
    netIncome: 1861,
    marketCap: 138017,
  },
  AFFLE: {
    basePrice: 1460,
    volatility: 0.05,
    peRatio: 34.69,
    pbRatio: 8.0,
    dividendYield: 0.3,
    eps: 145.92,
    revenue: 2067,
    netIncome: 343,
    marketCap: 20489,
  },
  LTIM: {
    basePrice: 4794,
    volatility: 0.03,
    peRatio: 46.57,
    pbRatio: 7.1,
    dividendYield: 2.1,
    eps: 27.77,
    revenue: 36485,
    netIncome: 4654,
    marketCap: 173004,
  },
  DMART: {
    basePrice: 3451,
    volatility: 0.035,
    peRatio: 82.63,
    pbRatio: 12.0,
    dividendYield: 0.1,
    eps: 41.75,
    revenue: 54813,
    netIncome: 2687,
    marketCap: 224584,
  },
  TATAPOWER: {
    basePrice: 351,
    volatility: 0.045,
    peRatio: 29.26,
    pbRatio: 3.5,
    dividendYield: 2.8,
    eps: 13.75,
    revenue: 1328,
    netIncome: 98,
    marketCap: 79152,
  },
  ASTRAL: {
    basePrice: 1318,
    volatility: 0.04,
    peRatio: 40.91,
    pbRatio: 9.2,
    dividendYield: 0.7,
    eps: 121.97,
    revenue: 5749,
    netIncome: 526,
    marketCap: 35398,
  },
  SAVANI: {
    basePrice: 2410,
    volatility: 0.06,
    peRatio: 25.5,
    pbRatio: 4.2,
    dividendYield: 1.8,
    eps: 94.5,
    revenue: 1250,
    netIncome: 95,
    marketCap: 12050,
  },
  KPITTECH: {
    basePrice: 672,
    volatility: 0.05,
    peRatio: 28.3,
    pbRatio: 6.8,
    dividendYield: 0.5,
    eps: 23.7,
    revenue: 1850,
    netIncome: 85,
    marketCap: 18500,
  },
  TATATECH: {
    basePrice: 1072,
    volatility: 0.04,
    peRatio: 35.2,
    pbRatio: 5.5,
    dividendYield: 0.8,
    eps: 30.4,
    revenue: 3200,
    netIncome: 120,
    marketCap: 32000,
  },
  BLSE: {
    basePrice: 2321,
    volatility: 0.07,
    peRatio: 42.1,
    pbRatio: 8.9,
    dividendYield: 0.3,
    eps: 55.1,
    revenue: 850,
    netIncome: 20,
    marketCap: 8500,
  },
  TANLA: {
    basePrice: 1134,
    volatility: 0.05,
    peRatio: 31.8,
    pbRatio: 7.2,
    dividendYield: 1.2,
    eps: 35.7,
    revenue: 2100,
    netIncome: 75,
    marketCap: 21000,
  },
  TATACONS: {
    basePrice: 845,
    volatility: 0.03,
    peRatio: 22.4,
    pbRatio: 4.1,
    dividendYield: 2.1,
    eps: 37.7,
    revenue: 12500,
    netIncome: 450,
    marketCap: 125000,
  },
  PIDILITE: {
    basePrice: 2376,
    volatility: 0.025,
    peRatio: 45.8,
    pbRatio: 12.3,
    dividendYield: 1.5,
    eps: 51.9,
    revenue: 8500,
    netIncome: 850,
    marketCap: 85000,
  },
  KPIGREEN: {
    basePrice: 875,
    volatility: 0.08,
    peRatio: 38.5,
    pbRatio: 9.7,
    dividendYield: 0.4,
    eps: 22.7,
    revenue: 650,
    netIncome: 17,
    marketCap: 6500,
  },
  SUZLON: {
    basePrice: 44,
    volatility: 0.12,
    peRatio: 15.2,
    pbRatio: 2.8,
    dividendYield: 0.0,
    eps: 2.9,
    revenue: 3200,
    netIncome: 210,
    marketCap: 32000,
  },
  GENSOL: {
    basePrice: 998,
    volatility: 0.09,
    peRatio: 52.3,
    pbRatio: 11.4,
    dividendYield: 0.2,
    eps: 19.1,
    revenue: 450,
    netIncome: 8.6,
    marketCap: 4500,
  },
  HARIOM: {
    basePrice: 580,
    volatility: 0.06,
    peRatio: 18.9,
    pbRatio: 3.2,
    dividendYield: 2.3,
    eps: 30.7,
    revenue: 1800,
    netIncome: 95,
    marketCap: 18000,
  },
  POLYCAB: {
    basePrice: 2818,
    volatility: 0.035,
    peRatio: 28.7,
    pbRatio: 6.1,
    dividendYield: 1.8,
    eps: 98.2,
    revenue: 12500,
    netIncome: 435,
    marketCap: 125000,
  },
  CLEAN: {
    basePrice: 1610,
    volatility: 0.04,
    peRatio: 35.6,
    pbRatio: 8.3,
    dividendYield: 0.6,
    eps: 45.2,
    revenue: 3200,
    netIncome: 140,
    marketCap: 32000,
  },
  DEEPAK: {
    basePrice: 2248,
    volatility: 0.045,
    peRatio: 26.8,
    pbRatio: 5.7,
    dividendYield: 1.9,
    eps: 83.9,
    revenue: 8500,
    netIncome: 320,
    marketCap: 85000,
  },
  FINEORG: {
    basePrice: 4284,
    volatility: 0.03,
    peRatio: 32.1,
    pbRatio: 7.8,
    dividendYield: 1.1,
    eps: 133.5,
    revenue: 4200,
    netIncome: 180,
    marketCap: 42000,
  },
  GRAVITA: {
    basePrice: 203,
    volatility: 0.08,
    peRatio: 12.4,
    pbRatio: 2.1,
    dividendYield: 3.2,
    eps: 16.4,
    revenue: 2800,
    netIncome: 95,
    marketCap: 28000,
  },
  SBILIFE: {
    basePrice: 1197,
    volatility: 0.04,
    peRatio: 24.6,
    pbRatio: 4.8,
    dividendYield: 2.8,
    eps: 48.7,
    revenue: 18500,
    netIncome: 380,
    marketCap: 185000,
  },
}

// Simulate realistic price movements
function simulateMarketPrice(basePrice: number, volatility: number): number {
  // Use Box-Muller transform for normal distribution
  const u1 = Math.random()
  const u2 = Math.random()
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

  // Apply volatility and market trend
  const marketTrend = 0.0001 // Slight upward bias
  const priceChange = basePrice * (marketTrend + volatility * z0)

  return Math.max(basePrice + priceChange, basePrice * 0.8) // Prevent negative prices
}

// Enhanced Yahoo Finance Mock Provider
export class YahooFinanceMockProvider implements StockDataProvider {
  name = "Yahoo Finance (Mock)"
  private cache = new Map<string, { data: StockPrice; timestamp: number }>()
  private readonly CACHE_DURATION = 5000 // 5 seconds cache

  async getPrices(symbols: string[]): Promise<StockPrice[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200))

    const prices: StockPrice[] = []
    const now = Date.now()

    for (const symbol of symbols) {
      // Check cache first
      const cached = this.cache.get(symbol)
      if (cached && now - cached.timestamp < this.CACHE_DURATION) {
        prices.push(cached.data)
        continue
      }

      const mockData = MOCK_STOCK_DATA[symbol as keyof typeof MOCK_STOCK_DATA]
      if (!mockData) {
        console.warn(`No mock data for symbol: ${symbol}`)
        continue
      }

      const currentPrice = simulateMarketPrice(mockData.basePrice, mockData.volatility)
      const previousPrice = mockData.basePrice
      const change = currentPrice - previousPrice
      const changePercent = (change / previousPrice) * 100

      const stockPrice: StockPrice = {
        symbol,
        currentPrice: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        marketCap: mockData.marketCap,
        lastUpdated: new Date(),
      }

      // Cache the result
      this.cache.set(symbol, { data: stockPrice, timestamp: now })
      prices.push(stockPrice)
    }

    return prices
  }

  async getFundamentals(symbols: string[]): Promise<StockFundamentals[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 100))

    return symbols.map((symbol) => {
      const mockData = MOCK_STOCK_DATA[symbol as keyof typeof MOCK_STOCK_DATA]
      if (!mockData) {
        return {
          symbol,
          peRatio: null,
          pbRatio: null,
          dividendYield: null,
          eps: null,
          revenue: null,
          netIncome: null,
          lastUpdated: new Date(),
        }
      }

      return {
        symbol,
        peRatio: mockData.peRatio,
        pbRatio: mockData.pbRatio,
        dividendYield: mockData.dividendYield,
        eps: mockData.eps,
        revenue: mockData.revenue,
        netIncome: mockData.netIncome,
        lastUpdated: new Date(),
      }
    })
  }
}

// Enhanced Google Finance Mock Provider
export class GoogleFinanceMockProvider implements StockDataProvider {
  name = "Google Finance (Mock)"

  async getPrices(symbols: string[]): Promise<StockPrice[]> {
    // Google Finance typically has slightly different prices
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 400 + 150))

    return symbols.map((symbol) => {
      const mockData = MOCK_STOCK_DATA[symbol as keyof typeof MOCK_STOCK_DATA]
      if (!mockData) {
        return {
          symbol,
          currentPrice: 0,
          change: 0,
          changePercent: 0,
          volume: 0,
          lastUpdated: new Date(),
        }
      }

      // Slightly different price simulation for Google Finance
      const currentPrice = simulateMarketPrice(mockData.basePrice, mockData.volatility * 0.9)
      const change = currentPrice - mockData.basePrice
      const changePercent = (change / mockData.basePrice) * 100

      return {
        symbol,
        currentPrice: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.floor(Math.random() * 800000) + 50000,
        lastUpdated: new Date(),
      }
    })
  }

  async getFundamentals(symbols: string[]): Promise<StockFundamentals[]> {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 250 + 100))

    return symbols.map((symbol) => {
      const mockData = MOCK_STOCK_DATA[symbol as keyof typeof MOCK_STOCK_DATA]
      if (!mockData) {
        return {
          symbol,
          peRatio: null,
          pbRatio: null,
          dividendYield: null,
          eps: null,
          revenue: null,
          netIncome: null,
          lastUpdated: new Date(),
        }
      }

      // Add slight variations to simulate different data sources
      return {
        symbol,
        peRatio: mockData.peRatio * (0.95 + Math.random() * 0.1),
        pbRatio: mockData.pbRatio * (0.95 + Math.random() * 0.1),
        dividendYield: mockData.dividendYield,
        eps: mockData.eps * (0.98 + Math.random() * 0.04),
        revenue: mockData.revenue,
        netIncome: mockData.netIncome,
        lastUpdated: new Date(),
      }
    })
  }
}

// Provider factory with fallback mechanism
export class StockDataService {
  private providers: StockDataProvider[]
  private primaryProvider: StockDataProvider
  private fallbackProvider: StockDataProvider

  constructor() {
    this.primaryProvider = new YahooFinanceMockProvider()
    this.fallbackProvider = new GoogleFinanceMockProvider()
    this.providers = [this.primaryProvider, this.fallbackProvider]
  }

  async getPricesWithFallback(symbols: string[]): Promise<StockPrice[]> {
    for (const provider of this.providers) {
      try {
        console.log(`[v0] Fetching prices from ${provider.name}`)
        const prices = await provider.getPrices(symbols)
        console.log(`[v0] Successfully fetched ${prices.length} prices from ${provider.name}`)
        return prices
      } catch (error) {
        console.error(`[v0] Failed to fetch prices from ${provider.name}:`, error)
        continue
      }
    }
    throw new Error("All stock data providers failed")
  }

  async getFundamentalsWithFallback(symbols: string[]): Promise<StockFundamentals[]> {
    for (const provider of this.providers) {
      try {
        console.log(`[v0] Fetching fundamentals from ${provider.name}`)
        const fundamentals = await provider.getFundamentals(symbols)
        console.log(`[v0] Successfully fetched ${fundamentals.length} fundamentals from ${provider.name}`)
        return fundamentals
      } catch (error) {
        console.error(`[v0] Failed to fetch fundamentals from ${provider.name}:`, error)
        continue
      }
    }
    throw new Error("All fundamental data providers failed")
  }

  async getCompleteStockData(symbols: string[]): Promise<{
    prices: StockPrice[]
    fundamentals: StockFundamentals[]
  }> {
    const [prices, fundamentals] = await Promise.allSettled([
      this.getPricesWithFallback(symbols),
      this.getFundamentalsWithFallback(symbols),
    ])

    return {
      prices: prices.status === "fulfilled" ? prices.value : [],
      fundamentals: fundamentals.status === "fulfilled" ? fundamentals.value : [],
    }
  }
}
