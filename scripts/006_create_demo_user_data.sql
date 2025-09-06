-- Create demo user and portfolio data for testing
-- This script creates a demo user with portfolio holdings

-- First, let's create a demo user (this would normally be done through Supabase Auth)
-- We'll create portfolio data that can be accessed without strict user authentication for demo purposes

-- Create demo portfolio holdings with proper sector relationships
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
