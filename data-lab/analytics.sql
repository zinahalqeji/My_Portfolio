-- Monthly revenue trend
SELECT date_trunc('month',order_date)::date AS month,
       ROUND(SUM(revenue_sek),2) AS revenue_sek,
       COUNT(*) AS orders
FROM sales_orders GROUP BY 1 ORDER BY 1;

-- Revenue by region
SELECT region, ROUND(SUM(revenue_sek),2) AS revenue_sek,
       COUNT(*) AS orders
FROM sales_orders GROUP BY region ORDER BY revenue_sek DESC;

-- Data quality checks
SELECT COUNT(*) AS total_rows,
       COUNT(DISTINCT order_id) AS unique_order_ids,
       COUNT(*) FILTER (WHERE order_date IS NULL OR region IS NULL
                       OR category IS NULL OR quantity <= 0
                       OR unit_price_sek < 0) AS invalid_rows
FROM sales_orders;
