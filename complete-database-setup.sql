-- Complete Database Setup for Portfolio Dashboard
-- Run this script in your Supabase SQL Editor

-- 1. Create sectors table
CREATE TABLE IF NOT EXISTS public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create stocks table
CREATE TABLE IF NOT EXISTS public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sector_id UUID REFERENCES public.sectors(id) ON DELETE CASCADE,
  exchange TEXT NOT NULL, -- NSE/BSE
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create portfolio_holdings table
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

-- 4. Create enhanced stock_prices table
CREATE TABLE IF NOT EXISTS public.stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
  current_price DECIMAL(10,2) NOT NULL,
  price_change DECIMAL(10,2) DEFAULT 0,
  price_change_percent DECIMAL(8,4) DEFAULT 0,
  volume BIGINT DEFAULT 0,
  pe_ratio DECIMAL(8,2),
  pb_ratio DECIMAL(8,2),
  dividend_yield DECIMAL(8,4),
  eps DECIMAL(15,2),
  revenue DECIMAL(20,2),
  net_income DECIMAL(20,2),
  market_cap DECIMAL(20,2),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stock_id)
);

-- 5. Enable RLS on all tables
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_prices ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist
DROP POLICY IF EXISTS "sectors_select_all" ON public.sectors;
DROP POLICY IF EXISTS "stocks_select_all" ON public.stocks;
DROP POLICY IF EXISTS "portfolio_holdings_select_own" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "portfolio_holdings_insert_own" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "portfolio_holdings_update_own" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "portfolio_holdings_delete_own" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "stock_prices_select_all" ON public.stock_prices;

-- 7. Create RLS Policies
-- Sectors (public read access)
CREATE POLICY "sectors_select_all" ON public.sectors FOR SELECT USING (true);

-- Stocks (public read access)
CREATE POLICY "stocks_select_all" ON public.stocks FOR SELECT USING (true);

-- Portfolio holdings (user-specific access)
CREATE POLICY "portfolio_holdings_select_own" ON public.portfolio_holdings 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "portfolio_holdings_insert_own" ON public.portfolio_holdings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "portfolio_holdings_update_own" ON public.portfolio_holdings 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "portfolio_holdings_delete_own" ON public.portfolio_holdings 
  FOR DELETE USING (auth.uid() = user_id);

-- Stock prices (public read access)
CREATE POLICY "stock_prices_select_all" ON public.stock_prices FOR SELECT USING (true);

-- 8. Insert sectors
INSERT INTO public.sectors (name) VALUES 
  ('Financial'),
  ('Technology'),
  ('Consumer'),
  ('Power'),
  ('Pipe'),
  ('Others')
ON CONFLICT (name) DO NOTHING;

-- 9. Insert stocks with sector mapping
WITH sector_mapping AS (
  SELECT id, name FROM public.sectors
)
INSERT INTO public.stocks (symbol, name, sector_id, exchange) VALUES 
  -- Financial Sector
  ('HDFCBANK', 'HDFC Bank', (SELECT id FROM sector_mapping WHERE name = 'Financial'), 'NSE'),
  ('BAJFINANCE', 'Bajaj Finance', (SELECT id FROM sector_mapping WHERE name = 'Financial'), 'NSE'),
  ('ICICIBANK', 'ICICI Bank', (SELECT id FROM sector_mapping WHERE name = 'Financial'), 'NSE'),
  ('BAJAJHSG', 'Bajaj Housing', (SELECT id FROM sector_mapping WHERE name = 'Financial'), 'NSE'),
  ('SAVANI', 'Savani Financials', (SELECT id FROM sector_mapping WHERE name = 'Financial'), 'NSE'),
  
  -- Technology Sector
  ('AFFLE', 'Affle India', (SELECT id FROM sector_mapping WHERE name = 'Technology'), 'NSE'),
  ('LTIM', 'LTI Mindtree', (SELECT id FROM sector_mapping WHERE name = 'Technology'), 'NSE'),
  ('KPITTECH', 'KPIT Tech', (SELECT id FROM sector_mapping WHERE name = 'Technology'), 'NSE'),
  ('TATATECH', 'Tata Tech', (SELECT id FROM sector_mapping WHERE name = 'Technology'), 'NSE'),
  ('BLSE', 'BLS E-Services', (SELECT id FROM sector_mapping WHERE name = 'Technology'), 'NSE'),
  ('TANLA', 'Tanla', (SELECT id FROM sector_mapping WHERE name = 'Technology'), 'NSE'),
  
  -- Consumer Sector
  ('DMART', 'Dmart', (SELECT id FROM sector_mapping WHERE name = 'Consumer'), 'NSE'),
  ('TATACONS', 'Tata Consumer', (SELECT id FROM sector_mapping WHERE name = 'Consumer'), 'NSE'),
  ('PIDILITE', 'Pidilite', (SELECT id FROM sector_mapping WHERE name = 'Consumer'), 'NSE'),
  
  -- Power Sector
  ('TATAPOWER', 'Tata Power', (SELECT id FROM sector_mapping WHERE name = 'Power'), 'NSE'),
  ('KPIGREEN', 'KPI Green', (SELECT id FROM sector_mapping WHERE name = 'Power'), 'NSE'),
  ('SUZLON', 'Suzlon', (SELECT id FROM sector_mapping WHERE name = 'Power'), 'NSE'),
  ('GENSOL', 'Gensol', (SELECT id FROM sector_mapping WHERE name = 'Power'), 'NSE'),
  
  -- Pipe Sector
  ('HARIOM', 'Hariom Pipes', (SELECT id FROM sector_mapping WHERE name = 'Pipe'), 'NSE'),
  ('ASTRAL', 'Astral', (SELECT id FROM sector_mapping WHERE name = 'Pipe'), 'NSE'),
  ('POLYCAB', 'Polycab', (SELECT id FROM sector_mapping WHERE name = 'Pipe'), 'NSE'),
  
  -- Others
  ('CLEAN', 'Clean Science', (SELECT id FROM sector_mapping WHERE name = 'Others'), 'NSE'),
  ('DEEPAK', 'Deepak Nitrite', (SELECT id FROM sector_mapping WHERE name = 'Others'), 'NSE'),
  ('FINEORG', 'Fine Organic', (SELECT id FROM sector_mapping WHERE name = 'Others'), 'NSE'),
  ('GRAVITA', 'Gravita', (SELECT id FROM sector_mapping WHERE name = 'Others'), 'NSE'),
  ('SBILIFE', 'SBI Life', (SELECT id FROM sector_mapping WHERE name = 'Others'), 'NSE')
ON CONFLICT (symbol) DO NOTHING;

-- 10. Insert initial stock prices
WITH stock_data AS (
  SELECT s.id, s.symbol FROM public.stocks s
)
INSERT INTO public.stock_prices (stock_id, current_price, pe_ratio, market_cap) VALUES 
  ((SELECT id FROM stock_data WHERE symbol = 'HDFCBANK'), 1700.00, 18.69, 1300796),
  ((SELECT id FROM stock_data WHERE symbol = 'BAJFINANCE'), 8420.00, 32.63, 521013),
  ((SELECT id FROM stock_data WHERE symbol = 'ICICIBANK'), 1280.00, 17.68, 859584),
  ((SELECT id FROM stock_data WHERE symbol = 'BAJAJHSG'), 1356.00, 5.72, 138017),
  ((SELECT id FROM stock_data WHERE symbol = 'AFFLE'), 1460.00, 34.69, 173004),
  ((SELECT id FROM stock_data WHERE symbol = 'LTIM'), 4794.00, 46.57, 350734),
  ((SELECT id FROM stock_data WHERE symbol = 'DMART'), 3451.00, 82.63, 224584),
  ((SELECT id FROM stock_data WHERE symbol = 'TATAPOWER'), 351.00, 29.26, 791529),
  ((SELECT id FROM stock_data WHERE symbol = 'ASTRAL'), 1318.00, 40.91, 353986)
ON CONFLICT (stock_id) DO UPDATE SET 
  current_price = EXCLUDED.current_price,
  pe_ratio = EXCLUDED.pe_ratio,
  market_cap = EXCLUDED.market_cap,
  updated_at = NOW();

-- 11. Create demo portfolio holdings (for demo user)
INSERT INTO portfolio_holdings (user_id, stock_id, purchase_price, quantity, purchase_date)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid as user_id,
  s.id as stock_id,
  CASE s.symbol
    -- Financial Sector
    WHEN 'HDFCBANK' THEN 1490
    WHEN 'BAJFINANCE' THEN 6466
    WHEN 'ICICIBANK' THEN 780
    WHEN 'BAJAJHSG' THEN 1305
    WHEN 'SAVANI' THEN 2410
    -- Tech Sector  
    WHEN 'AFFLE' THEN 1151
    WHEN 'LTIM' THEN 4775
    WHEN 'KPITTECH' THEN 672
    WHEN 'TATATECH' THEN 1072
    WHEN 'BLSE' THEN 2321
    WHEN 'TANLA' THEN 1134
    -- Consumer Sector
    WHEN 'DMART' THEN 3777
    WHEN 'TATACONS' THEN 845
    WHEN 'PIDILITE' THEN 2376
    -- Power Sector
    WHEN 'TATAPOWER' THEN 224
    WHEN 'KPIGREEN' THEN 875
    WHEN 'SUZLON' THEN 44
    WHEN 'GENSOL' THEN 998
    -- Pipe Sector
    WHEN 'HARIOM' THEN 580
    WHEN 'ASTRAL' THEN 1517
    WHEN 'POLYCAB' THEN 2818
    -- Others
    WHEN 'CLEAN' THEN 1610
    WHEN 'DEEPAK' THEN 2248
    WHEN 'FINEORG' THEN 4284
    WHEN 'GRAVITA' THEN 203
    WHEN 'SBILIFE' THEN 1197
    ELSE 1000
  END as purchase_price,
  CASE s.symbol
    -- Financial Sector quantities
    WHEN 'HDFCBANK' THEN 50
    WHEN 'BAJFINANCE' THEN 15
    WHEN 'ICICIBANK' THEN 84
    WHEN 'BAJAJHSG' THEN 50
    WHEN 'SAVANI' THEN 80
    -- Tech Sector quantities
    WHEN 'AFFLE' THEN 50
    WHEN 'LTIM' THEN 16
    WHEN 'KPITTECH' THEN 61
    WHEN 'TATATECH' THEN 63
    WHEN 'BLSE' THEN 19
    WHEN 'TANLA' THEN 45
    -- Consumer Sector quantities
    WHEN 'DMART' THEN 27
    WHEN 'TATACONS' THEN 90
    WHEN 'PIDILITE' THEN 36
    -- Power Sector quantities
    WHEN 'TATAPOWER' THEN 225
    WHEN 'KPIGREEN' THEN 50
    WHEN 'SUZLON' THEN 450
    WHEN 'GENSOL' THEN 45
    -- Pipe Sector quantities
    WHEN 'HARIOM' THEN 60
    WHEN 'ASTRAL' THEN 56
    WHEN 'POLYCAB' THEN 28
    -- Others quantities
    WHEN 'CLEAN' THEN 32
    WHEN 'DEEPAK' THEN 27
    WHEN 'FINEORG' THEN 16
    WHEN 'GRAVITA' THEN 78
    WHEN 'SBILIFE' THEN 49
    ELSE 10
  END as quantity,
  NOW() - INTERVAL '30 days' as purchase_date
FROM stocks s
ON CONFLICT (user_id, stock_id) DO NOTHING;

-- 12. Create function to allow demo user access
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  )::uuid
$$;

-- 13. Create policy for demo user access
CREATE POLICY "portfolio_holdings_demo_access" ON public.portfolio_holdings 
  FOR ALL USING (
    auth.uid() = user_id OR 
    user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );

-- 14. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Setup completed!
SELECT 'Database setup completed successfully!' as status;
