-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  nationality VARCHAR(100),
  phone VARCHAR(20),
  pin VARCHAR(20),
  is_admin BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KYC details table
CREATE TABLE IF NOT EXISTS kyc_details (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  residential_address TEXT,
  school_name VARCHAR(255),
  passport_number VARCHAR(50),
  student_id VARCHAR(50),
  purpose_of_use TEXT,
  photo_url VARCHAR(500),
  identity_card_url VARCHAR(500),
  student_id_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exchange rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id SERIAL PRIMARY KEY,
  from_currency VARCHAR(10),
  to_currency VARCHAR(10),
  rate DECIMAL(10,4),
  admin_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Account balances table
CREATE TABLE IF NOT EXISTS account_balances (
  id SERIAL PRIMARY KEY,
  currency VARCHAR(10),
  available_amount DECIMAL(15,2),
  account_number VARCHAR(50),
  account_name VARCHAR(255),
  bank_name VARCHAR(255),
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace listings table
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  from_currency VARCHAR(10),
  to_currency VARCHAR(10),
  amount DECIMAL(15,2),
  exchange_rate DECIMAL(10,4),
  platform_fee DECIMAL(10,4) DEFAULT 4.5,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  listing_id INTEGER REFERENCES marketplace_listings(id),
  amount_sent DECIMAL(15,2),
  amount_received DECIMAL(15,2),
  sender_receipt_url VARCHAR(500),
  receiver_receipt_url VARCHAR(500),
  sender_account_details JSONB,
  receiver_account_details JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  platform_fee DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Exchange requests table
CREATE TABLE IF NOT EXISTS exchange_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  receive_method VARCHAR(20),
  upi_id VARCHAR(100),
  receiver_whatsapp VARCHAR(30),
  display_name VARCHAR(100),
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  ifsc_code VARCHAR(30),
  email VARCHAR(255),
  amount DECIMAL(15,2),
  receipt_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default exchange rate
INSERT INTO exchange_rates (from_currency, to_currency, rate, admin_id) 
VALUES ('INR', 'NGN', 18.21, 1) ON CONFLICT DO NOTHING;

-- Insert default account balances
INSERT INTO account_balances (currency, available_amount, account_number, account_name, bank_name, updated_by)
VALUES 
  ('NGN', 1000000.00, '1234567890', 'QudPay Nigeria Ltd', 'First Bank Nigeria', 1),
  ('INR', 500000.00, '9876543210', 'QudPay India Pvt Ltd', 'State Bank of India', 1)
ON CONFLICT DO NOTHING;
