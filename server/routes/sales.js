const express =
  require("express");

const router =
  express.Router();

const db =
  require("../database/db");

const authenticateToken =
  require("../middleware/authMiddleware");

router.get(
  "/",
  authenticateToken,
  (req, res) => {
    try {
      const stmt =
        db.prepare(`
          SELECT *
          FROM sales
          WHERE user_id = ?
          ORDER BY sale_date DESC
        `);

      const rows =
        stmt.all(req.user.id);

      res.json(rows);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json(error);
    }
  }
);

router.post(
  "/",
  authenticateToken,
  (req, res) => {
    try {
      const {
        saleDate,
        items,
      } = req.body;

      let totalRevenue = 0;

      let totalCost = 0;

      items.forEach(
        (item) => {
          totalRevenue +=
            item.lineRevenue;

          totalCost +=
            item.recipeCost *
            item.quantity;
        }
      );

      const totalProfit =
        totalRevenue -
        totalCost;

      const saleStmt =
        db.prepare(`
          INSERT INTO sales
          (
            user_id,
            sale_date,
            total_revenue,
            total_cost,
            total_profit
          )
          VALUES (?, ?, ?, ?, ?)
        `);

      const saleResult =
        saleStmt.run(
          req.user.id,
          saleDate,
          totalRevenue,
          totalCost,
          totalProfit
        );

      const saleId =
        saleResult.lastInsertRowid;

      const itemStmt =
        db.prepare(`
          INSERT INTO sale_items
          (
            sale_id,
            recipe_id,
            quantity,
            sale_price,
            recipe_cost,
            line_revenue,
            line_profit
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

      const recipeIngredientStmt =
        db.prepare(`
          SELECT
            recipe_ingredients.quantity,
            recipe_ingredients.ingredient_id,
            recipes.yield_quantity

          FROM recipe_ingredients

          JOIN recipes
            ON recipe_ingredients.recipe_id =
            recipes.id

          WHERE recipe_ingredients.recipe_id = ?
          AND recipes.user_id = ?
        `);

      const updateIngredientStmt =
        db.prepare(`
          UPDATE ingredients
          SET quantity =
            quantity - ?
          WHERE id = ?
          AND user_id = ?
        `);

      items.forEach(
        (item) => {
          itemStmt.run(
            saleId,
            item.recipeId,
            item.quantity,
            item.salePrice,
            item.recipeCost,
            item.lineRevenue,
            item.lineProfit
          );

          const ingredients =
            recipeIngredientStmt.all(
              item.recipeId,
              req.user.id
            );

          ingredients.forEach(
            (ingredient) => {
              const usagePerItem =
                ingredient.quantity /
                ingredient.yield_quantity;

              const totalUsage =
                usagePerItem *
                item.quantity;

              updateIngredientStmt.run(
                totalUsage,
                ingredient.ingredient_id,
                req.user.id
              );
            }
          );
        }
      );

      res.json({
        message:
          "Sale recorded",
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json(error);
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  (req, res) => {
    try {
      const { id } =
        req.params;

      const deleteItemsStmt =
        db.prepare(`
          DELETE FROM sale_items
          WHERE sale_id = ?
        `);

      deleteItemsStmt.run(id);

      const deleteSaleStmt =
        db.prepare(`
          DELETE FROM sales
          WHERE id = ?
          AND user_id = ?
        `);

      deleteSaleStmt.run(
        id,
        req.user.id
      );

      res.json({
        message:
          "Sale deleted",
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json(error);
    }
  }
);

module.exports = router;