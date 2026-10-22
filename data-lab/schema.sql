-- Data Lab: synthetic sample dataset, PostgreSQL schema
CREATE TABLE IF NOT EXISTS sales_orders (
 order_id INTEGER PRIMARY KEY,
 order_date DATE NOT NULL,
 region TEXT NOT NULL,
 category TEXT NOT NULL,
 quantity INTEGER NOT NULL CHECK (quantity > 0),
 unit_price_sek NUMERIC(12,2) NOT NULL CHECK (unit_price_sek >= 0),
 revenue_sek NUMERIC(12,2) NOT NULL CHECK (revenue_sek >= 0)
);
-- From psql after generating orders.csv:
-- \copy sales_orders FROM 'orders.csv' WITH (FORMAT csv, HEADER true);
CREATE INDEX IF NOT EXISTS sales_orders_date_idx ON sales_orders(order_date);
CREATE INDEX IF NOT EXISTS sales_orders_region_category_idx ON sales_orders(region,category);
