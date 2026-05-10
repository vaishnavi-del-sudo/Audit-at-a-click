CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE associations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  audit_category VARCHAR(50) NOT NULL,
  system_placement VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  association_id INTEGER NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  vendor_employee VARCHAR(255),
  amount DECIMAL(15, 2),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE anomalies (
  id SERIAL PRIMARY KEY,
  association_id INTEGER NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
  record_id INTEGER REFERENCES records(id) ON DELETE CASCADE,
  anomaly_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  description TEXT,
  legal_summary TEXT,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  association_id INTEGER NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
  audit_type VARCHAR(100),
  total_records INTEGER,
  anomalies_found INTEGER,
  critical_count INTEGER,
  run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_associations_user_id ON associations(user_id);
CREATE INDEX idx_records_association_id ON records(association_id);
CREATE INDEX idx_anomalies_association_id ON anomalies(association_id);
CREATE INDEX idx_anomalies_status ON anomalies(status);
CREATE INDEX idx_audit_logs_association_id ON audit_logs(association_id);
