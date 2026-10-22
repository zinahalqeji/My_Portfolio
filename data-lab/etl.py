"""Small reproducible ETL for synthetic sales data. pip install pandas sqlalchemy psycopg[binary]"""
from pathlib import Path
import os
import pandas as pd
from sqlalchemy import create_engine

csv_path = Path(__file__).with_name("orders.csv")
df = pd.read_csv(csv_path, parse_dates=["order_date"])
# Transform and validate
for column in ("region", "category"):
    df[column] = df[column].astype(str).str.strip()
df = df.drop_duplicates(subset=["order_id"])
df["revenue_sek"] = (df["quantity"] * df["unit_price_sek"]).round(2)
assert df["order_id"].is_unique
assert df[["order_date", "region", "category"]].notna().all().all()
assert (df["quantity"] > 0).all() and (df["unit_price_sek"] >= 0).all()
print(f"Validated {len(df)} orders, revenue SEK {df['revenue_sek'].sum():,.2f}")
# Optional load: DATABASE_URL must stay in environment variables, never commit it.
url = os.environ.get("DATABASE_URL")
if url:
    engine = create_engine(url)
    with engine.begin() as conn:
        df.to_sql("sales_orders", conn, if_exists="append", index=False, method="multi")
    print("Loaded rows into PostgreSQL")
else:
    print("No DATABASE_URL set; validation-only run completed")
