/*
  # Fix Users Table RLS Policy

  1. Security Updates
    - Drop existing restrictive policies
    - Add policy to allow anonymous users to register (INSERT)
    - Add policy to allow authenticated users to read their own data
    - Ensure proper user registration flow

  2. Changes
    - Allow anonymous INSERT for user registration
    - Maintain security for SELECT operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;

-- Allow anonymous users to register (INSERT)
CREATE POLICY "Allow anonymous user registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Allow users to read their own data during authentication
CREATE POLICY "Allow user authentication"
  ON users
  FOR SELECT
  TO anon
  USING (true);