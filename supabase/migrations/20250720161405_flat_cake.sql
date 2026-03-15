/*
  # Update inventory RLS policies for Supabase Auth

  1. Security
    - Drop existing policies that don't work with Supabase auth
    - Create new policies that work with auth.uid()
    - Allow authenticated users full CRUD access to inventory
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read inventory" ON inventory;
DROP POLICY IF EXISTS "Allow authenticated users to insert inventory" ON inventory;
DROP POLICY IF EXISTS "Allow authenticated users to update inventory" ON inventory;
DROP POLICY IF EXISTS "Allow authenticated users to delete inventory" ON inventory;

-- Create new policies that work with Supabase auth
CREATE POLICY "Authenticated users can read inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (true);