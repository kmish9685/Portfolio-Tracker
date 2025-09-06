-- Fix RLS policies to allow access to demo user data
-- This allows the portfolio to work without authentication for demo purposes

-- Drop existing portfolio_holdings policies
DROP POLICY IF EXISTS "portfolio_holdings_select_own" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "portfolio_holdings_insert_own" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "portfolio_holdings_update_own" ON public.portfolio_holdings;
DROP POLICY IF EXISTS "portfolio_holdings_delete_own" ON public.portfolio_holdings;

-- Create new policies that allow access to demo user data
CREATE POLICY "portfolio_holdings_select_policy" ON public.portfolio_holdings 
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );

CREATE POLICY "portfolio_holdings_insert_policy" ON public.portfolio_holdings 
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );

CREATE POLICY "portfolio_holdings_update_policy" ON public.portfolio_holdings 
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );

CREATE POLICY "portfolio_holdings_delete_policy" ON public.portfolio_holdings 
  FOR DELETE USING (
    auth.uid() = user_id OR 
    user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );

-- Also ensure we have INSERT and UPDATE policies for stock_prices
DROP POLICY IF EXISTS "stock_prices_insert_all" ON public.stock_prices;
DROP POLICY IF EXISTS "stock_prices_update_all" ON public.stock_prices;

CREATE POLICY "stock_prices_insert_all" ON public.stock_prices FOR INSERT WITH CHECK (true);
CREATE POLICY "stock_prices_update_all" ON public.stock_prices FOR UPDATE USING (true);
