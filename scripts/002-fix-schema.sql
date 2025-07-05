-- Drop and recreate exchange_rates table with correct columns
DROP TABLE IF EXISTS exchange_rates CASCADE;

CREATE TABLE exchange_rates (
  id SERIAL PRIMARY KEY,
  from_currency VARCHAR(10) NOT NULL,
  to_currency VARCHAR(10) NOT NULL,
  rate DECIMAL(10,4) NOT NULL,
  admin_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate, admin_id) 
VALUES 
  ('INR', 'NGN', 18.21, 1),
  ('NGN', 'INR', 0.0549, 1)
ON CONFLICT DO NOTHING;

-- Create exchange_requests table to store all user exchange details
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

-- Add pin field to users table for authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin VARCHAR(20);

-- Create admin user
INSERT INTO users (email, full_name, is_admin, kyc_status) 
VALUES ('admin@qudpay.com', 'QudPay Admin', true, 'approved')
ON CONFLICT (email) DO NOTHING;
