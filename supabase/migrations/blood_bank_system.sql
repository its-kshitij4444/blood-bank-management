/*
  # Blood Bank Management System Schema

  1. New Tables
    - users (auth.users will be used for authentication)
    - person
      - Stores donor/recipient information
      - Contains personal details and medical information
    - donation
      - Records blood donations
      - Links to person table
    - receive
      - Records blood receiving events
      - Links to person table
    - stock
      - Tracks blood inventory
      - Maintains current blood group quantities

  2. Security
    - RLS enabled on all tables
    - Policies set for authenticated users only
*/

-- Person table
CREATE TABLE IF NOT EXISTS person (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('m', 'f', 'o')),
  dob DATE NOT NULL,
  blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  address TEXT NOT NULL,
  med_issues TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Donation table
CREATE TABLE IF NOT EXISTS donation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES person(id) NOT NULL,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  donation_time TIME NOT NULL DEFAULT CURRENT_TIME,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Receive table
CREATE TABLE IF NOT EXISTS receive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES person(id) NOT NULL,
  receive_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receive_time TIME NOT NULL DEFAULT CURRENT_TIME,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  hospital TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Stock table
CREATE TABLE IF NOT EXISTS stock (
  blood_group TEXT PRIMARY KEY CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert initial stock records
INSERT INTO stock (blood_group) VALUES
  ('A+'), ('A-'), ('B+'), ('B-'),
  ('O+'), ('O-'), ('AB+'), ('AB-')
ON CONFLICT (blood_group) DO NOTHING;

-- Enable RLS
ALTER TABLE person ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation ENABLE ROW LEVEL SECURITY;
ALTER TABLE receive ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to view all persons"
  ON person FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert persons"
  ON person FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view all donations"
  ON donation FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert donations"
  ON donation FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view all receives"
  ON receive FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert receives"
  ON receive FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view stock"
  ON stock FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update stock"
  ON stock FOR UPDATE TO authenticated USING (true);

-- Functions for stock management
CREATE OR REPLACE FUNCTION update_stock_on_donation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stock 
  SET quantity = quantity + NEW.quantity,
      updated_at = now()
  WHERE blood_group = (SELECT blood_group FROM person WHERE id = NEW.person_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_stock_on_receive()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stock 
  SET quantity = quantity - NEW.quantity,
      updated_at = now()
  WHERE blood_group = (SELECT blood_group FROM person WHERE id = NEW.person_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for stock management
CREATE TRIGGER after_donation_insert
  AFTER INSERT ON donation
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_donation();

CREATE TRIGGER after_receive_insert
  AFTER INSERT ON receive
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_receive();