-- Create sectors table
CREATE TABLE IF NOT EXISTS public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stocks table
CREATE TABLE IF NOT EXISTS public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sector_id UUID REFERENCES public.sectors(id) ON DELETE CASCADE,
  exchange TEXT NOT NULL, -- NSE/BSE
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_holdings table
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  purchase_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stock_id)
);

-- Create stock_prices table for real-time data
CREATE TABLE IF NOT EXISTS public.stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  current_price DECIMAL(10,2) NOT NULL,
  pe_ratio DECIMAL(8,2),
  latest_earnings DECIMAL(15,2),
  market_cap DECIMAL(20,2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stock_id)
);

-- Enable RLS on all tables
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_prices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sectors (public read access)
CREATE POLICY "sectors_select_all" ON public.sectors FOR SELECT USING (true);

-- RLS Policies for stocks (public read access)
CREATE POLICY "stocks_select_all" ON public.stocks FOR SELECT USING (true);

-- RLS Policies for portfolio_holdings (user-specific access)
CREATE POLICY "portfolio_holdings_select_own" ON public.portfolio_holdings 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "portfolio_holdings_insert_own" ON public.portfolio_holdings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "portfolio_holdings_update_own" ON public.portfolio_holdings 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "portfolio_holdings_delete_own" ON public.portfolio_holdings 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for stock_prices (public read access)
CREATE POLICY "stock_prices_select_all" ON public.stock_prices FOR SELECT USING (true);
