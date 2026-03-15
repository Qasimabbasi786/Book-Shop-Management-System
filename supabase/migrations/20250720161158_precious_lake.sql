/*
  # Fix RLS Policy for Inventory Table

  1. Security Updates
    - Update RLS policies for inventory table to allow authenticated users to perform all operations
    - Ensure proper access control while allowing inventory management

  2. Changes
    - Drop existing restrictive policies
    - Create new policies that allow authenticated users full access to inventory
    - Maintain security by requiring authentication
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can insert inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can read inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can update inventory" ON inventory;
DROP POLICY IF EXISTS "Authenticated users can delete inventory" ON inventory;

-- Create new policies that allow authenticated users full access
CREATE POLICY "Allow authenticated users to insert inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

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