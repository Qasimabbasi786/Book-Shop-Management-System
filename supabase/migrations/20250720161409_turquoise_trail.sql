/*
  # Update transactions RLS policies for Supabase Auth

  1. Security
    - Drop existing policies that don't work with Supabase auth
    - Create new policies that work with auth.uid()
    - Allow authenticated users full CRUD access to transactions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can read transactions" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can update transactions" ON transactions;
DROP POLICY IF EXISTS "Authenticated users can delete transactions" ON transactions;

-- Create new policies that work with Supabase auth
CREATE POLICY "Authenticated users can read transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (true);