-- Fix RLS policies for stock_prices table to allow INSERT and UPDATE operations
-- This is needed for the system to update stock prices automatically

-- Add INSERT policy for stock_prices (allow system to insert new price data)
CREATE POLICY "stock_prices_insert_system" ON public.stock_prices 
  FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for stock_prices (allow system to update existing price data)
CREATE POLICY "stock_prices_update_system" ON public.stock_prices 
  FOR UPDATE USING (true);

-- Also add INSERT and UPDATE policies for stocks table in case we need to add new stocks
CREATE POLICY "stocks_insert_system" ON public.stocks 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "stocks_update_system" ON public.stocks 
  FOR UPDATE USING (true);

-- Add INSERT policy for sectors table in case we need to add new sectors
CREATE POLICY "sectors_insert_system" ON public.sectors 
  FOR INSERT WITH CHECK (true);
