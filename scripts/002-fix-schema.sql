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

-- Create admin user
INSERT INTO users (email, full_name, is_admin, kyc_status) 
VALUES ('admin@qudpay.com', 'QudPay Admin', true, 'approved')
ON CONFLICT (email) DO NOTHING;
