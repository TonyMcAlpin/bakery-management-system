const sqlite3 =
  require("sqlite3").verbose();

const path = require("path");

const db = new sqlite3.Database(
  path.join(
    __dirname,
    "bakery.db"
  )
);

db.serialize(() => {
  console.log(
    "Connected to SQLite database."
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
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
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      yield_quantity REAL DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER,
      ingredient_id INTEGER,
      quantity REAL,
      unit TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      supplier TEXT,
      purchase_date TEXT,
      total_cost REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER,
      ingredient_id INTEGER,
      quantity REAL,
      unit TEXT,
      cost REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      sale_date TEXT,
      total_revenue REAL,
      total_cost REAL,
      total_profit REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER,
      recipe_id INTEGER,
      quantity REAL,
      sale_price REAL,
      recipe_cost REAL,
      line_revenue REAL,
      line_profit REAL
    )
  `);

  console.log(
    "Database initialized."
  );
});

db.close();