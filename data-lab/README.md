# Data Lab — Sales Analytics (portfolio demo)

This is a **working interactive, static dashboard** based on **500 deterministic synthetic sales orders** (2024–2026). It is **not connected to a live database**. This distinction is intentional: visitors can explore a real working demo without exposing database credentials.

## Demo
Open `../data-lab.html` through GitHub Pages or a local HTTP server. Filters update the KPIs, monthly chart and category bars. The page reads `orders.csv` via `fetch`, so opening as a `file://` URL may block CSV loading. Use `python -m http.server 8000` in the `Portfolio` folder and open `http://localhost:8000/data-lab.html`.

## PostgreSQL / ETL
1. Create your own PostgreSQL instance (locally or hosted). Never commit passwords or service-role keys.
2. Execute `schema.sql` against your database.
3. `python -m pip install pandas sqlalchemy 'psycopg[binary]'`
4. Run `python etl.py` to validate the dataset without loading.
5. Set `DATABASE_URL` securely and run `python etl.py` to load rows **once** into an empty table. Re-running against existing primary keys will fail, intentionally preventing silent duplicates.
6. Run `analytics.sql` to reproduce the metrics.

## Architecture / next production step
CSV (synthetic) → Pandas ETL + validation → PostgreSQL → read-only backend API → dashboard. The public dashboard currently reads the CSV directly, **not PostgreSQL**. To enable live database-backed results, deploy a read-only API with restricted CORS, pagination/rate limiting and credentials stored server-side. Never connect browser JavaScript to a private database using privileged keys.
