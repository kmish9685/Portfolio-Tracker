-- Add additional columns for enhanced stock data
ALTER TABLE public.stock_prices 
ADD COLUMN IF NOT EXISTS price_change DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_change_percent DECIMAL(8,4),
ADD COLUMN IF NOT EXISTS volume BIGINT,
ADD COLUMN IF NOT EXISTS pb_ratio DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS dividend_yield DECIMAL(6,4),
ADD COLUMN IF NOT EXISTS eps DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS revenue DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS net_income DECIMAL(15,2);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_stock_prices_updated_at ON public.stock_prices(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_prices_stock_id ON public.stock_prices(stock_id);

-- Update existing records with sample enhanced data
UPDATE public.stock_prices 
SET 
  price_change = (current_price - (current_price * 0.98)),
  price_change_percent = ((current_price - (current_price * 0.98)) / (current_price * 0.98)) * 100,
  volume = FLOOR(RANDOM() * 1000000 + 100000),
  pb_ratio = pe_ratio * 0.3,
  dividend_yield = RANDOM() * 3,
  eps = current_price / COALESCE(pe_ratio, 20),
  revenue = market_cap * 0.8,
  net_income = market_cap * 0.1
WHERE price_change IS NULL;
