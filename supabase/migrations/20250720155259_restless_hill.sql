/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `mobile_number` (text)
      - `payment_method` (text)
      - `account_details` (text)
      - `item_name` (text)
      - `quantity` (integer)
      - `amount` (decimal)
      - `description` (text)
      - `purchase_date` (date)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  mobile_number text NOT NULL,
  payment_method text NOT NULL DEFAULT 'Cash',
  account_details text,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  amount decimal(10,2) NOT NULL,
  description text,
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

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
  USING (true);

CREATE POLICY "Authenticated users can delete transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (true);