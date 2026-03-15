/*
  # Fix Inventory RLS Policy

  1. Security
    - Drop existing restrictive policies
    - Add new policies that allow authenticated users full access to inventory
    - Enable RLS on inventory table
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can insert inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can update inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can delete inventory" ON inventory;

-- Ensure RLS is enabled
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create new policies that allow authenticated users full access
CREATE POLICY "Allow authenticated users to read inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (true);