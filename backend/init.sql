CREATE TABLE IF NOT EXISTS customer (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS article (
  article_id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_number TEXT NOT NULL UNIQUE,
  customer_id INTEGER NOT NULL,
  hang_comment TEXT,
  pack_comment TEXT,
  updated_at TEXT,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);