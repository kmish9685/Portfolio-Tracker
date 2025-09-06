-- Fix stock_prices table RLS policies to allow upsert operations
-- This addresses the "duplicate key value violates unique constraint" error

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "stock_prices_insert_system" ON public.stock_prices;
DROP POLICY IF EXISTS "stock_prices_update_system" ON public.stock_prices;

-- Add INSERT policy for stock_prices (allow system operations)
CREATE POLICY "stock_prices_insert_system" ON public.stock_prices 
  FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for stock_prices (allow system operations)  
CREATE POLICY "stock_prices_update_system" ON public.stock_prices 
  FOR UPDATE USING (true);

-- Ensure the unique constraint is properly configured for upsert
-- The UNIQUE(stock_id) constraint should allow upsert operations
ALTER TABLE public.stock_prices 
  DROP CONSTRAINT IF EXISTS stock_prices_stock_id_key;

ALTER TABLE public.stock_prices 
  ADD CONSTRAINT stock_prices_stock_id_key UNIQUE (stock_id);

-- Add some debug info
DO $$
BEGIN
  RAISE NOTICE 'Stock prices RLS policies updated successfully';
  RAISE NOTICE 'Unique constraint on stock_id recreated';
END $$;
