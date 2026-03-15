/*
  # Create inventory table

  1. New Tables
    - `inventory`
      - `id` (uuid, primary key)
      - `item_name` (text)
      - `price` (decimal)
      - `quantity` (integer)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `inventory` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

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
  USING (true);

CREATE POLICY "Authenticated users can delete inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (true);