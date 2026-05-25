CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  quantity REAL DEFAULT 0,
  base_unit TEXT,
  cost_per_unit REAL
);

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  yield_quantity REAL,
  instructions TEXT
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER,
  ingredient_id INTEGER,
  quantity REAL,
  unit TEXT,

  FOREIGN KEY (recipe_id)
    REFERENCES recipes(id),

  FOREIGN KEY (ingredient_id)
    REFERENCES ingredients(id)
);

CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  cost REAL,

  FOREIGN KEY (purchase_id)
    REFERENCES purchases(id),

  FOREIGN KEY (ingredient_id)
    REFERENCES ingredients(id)
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_date TEXT,
  total_revenue REAL,
  total_cost REAL,
  total_profit REAL
);

CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  sale_id INTEGER,
  recipe_id INTEGER,

  quantity INTEGER,
  sale_price REAL,

  recipe_cost REAL,
  line_revenue REAL,
  line_profit REAL,

  FOREIGN KEY (sale_id)
    REFERENCES sales(id),

  FOREIGN KEY (recipe_id)
    REFERENCES recipes(id)
);