const Database =
  require("better-sqlite3");

const path =
  require("path");

const db =
  new Database(
    path.join(
      __dirname,
      "bakery.db"
    )
  );

console.log(
  "Initializing database..."
);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    quantity REAL DEFAULT 0,
    unit TEXT,
    base_unit TEXT,
    cost_per_unit REAL DEFAULT 0,
    supplier TEXT,
    minimum_stock REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    yield_quantity REAL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER,
    ingredient_id INTEGER,
    quantity REAL,
    unit TEXT
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    supplier TEXT,
    purchase_date TEXT,
    total_cost REAL
  );

  CREATE TABLE IF NOT EXISTS purchase_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_id INTEGER,
    ingredient_id INTEGER,
    quantity REAL,
    unit TEXT,
    cost REAL
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    sale_date TEXT,
    total_revenue REAL,
    total_profit REAL
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    recipe_id INTEGER,
    quantity REAL,
    sale_price REAL,
    recipe_cost REAL,
    line_revenue REAL,
    line_profit REAL
  );
`);

console.log(
  "Database initialized."
);

module.exports = db;