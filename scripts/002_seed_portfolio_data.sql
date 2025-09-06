-- Insert sectors
INSERT INTO public.sectors (name) VALUES 
  ('Financial'),
  ('Technology'),
  ('Consumer'),
  ('Power'),
  ('Pipe'),
  ('Others')
ON CONFLICT (name) DO NOTHING;

-- Insert stocks with sector mapping
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

-- Insert initial stock prices (sample data - will be updated by API)
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
