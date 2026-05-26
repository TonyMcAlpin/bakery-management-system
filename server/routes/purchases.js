const express =
  require("express");

const router =
  express.Router();

const db =
  require("../database/db");

const authenticateToken =
  require("../middleware/authMiddleware");

const {
  convertUnits,
} = require("../utils/unitConversions");

router.get(
  "/",
  authenticateToken,
  (req, res) => {
    try {
      const stmt =
        db.prepare(`
          SELECT *
          FROM purchases
          WHERE user_id = ?
          ORDER BY purchase_date DESC
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
        supplier,
        purchaseDate,
        items,
      } = req.body;

      const totalCost =
        items.reduce(
          (sum, item) =>
            sum +
            Number(item.cost),
          0
        );

      const purchaseStmt =
        db.prepare(`
          INSERT INTO purchases
          (
            user_id,
            supplier,
            purchase_date,
            total_cost
          )
          VALUES (?, ?, ?, ?)
        `);

      const purchaseResult =
        purchaseStmt.run(
          req.user.id,
          supplier,
          purchaseDate,
          totalCost
        );

      const purchaseId =
        purchaseResult.lastInsertRowid;

      const itemStmt =
        db.prepare(`
          INSERT INTO purchase_items
          (
            purchase_id,
            ingredient_id,
            quantity,
            unit,
            cost
          )
          VALUES (?, ?, ?, ?, ?)
        `);

      const ingredientStmt =
        db.prepare(`
          SELECT base_unit
          FROM ingredients
          WHERE id = ?
          AND user_id = ?
        `);

      const updateIngredientStmt =
        db.prepare(`
          UPDATE ingredients
          SET
            quantity = quantity + ?,
            cost_per_unit = ?
          WHERE id = ?
          AND user_id = ?
        `);

      items.forEach(
        (item) => {
          itemStmt.run(
            purchaseId,
            item.ingredientId,
            item.quantity,
            item.unit,
            item.cost
          );

          const ingredient =
            ingredientStmt.get(
              item.ingredientId,
              req.user.id
            );

          if (
            !ingredient ||
            !ingredient.base_unit
          ) {
            console.error(
              "Ingredient not found:",
              item.ingredientId
            );

            return;
          }

          let convertedQuantity = 0;

          try {
            convertedQuantity =
              convertUnits(
                Number(
                  item.quantity
                ),
                item.unit,
                ingredient.base_unit
              );
          } catch (error) {
            console.error(
              "Unit conversion failed:",
              error.message
            );

            return;
          }

          const unitCost =
            Number(item.cost) /
            convertedQuantity;

          updateIngredientStmt.run(
            convertedQuantity,
            unitCost,
            item.ingredientId,
            req.user.id
          );
        }
      );

      res.json({
        message:
          "Purchase saved",
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

      const itemStmt =
        db.prepare(`
          SELECT *
          FROM purchase_items
          WHERE purchase_id = ?
        `);

      const items =
        itemStmt.all(id);

      const ingredientStmt =
        db.prepare(`
          SELECT base_unit
          FROM ingredients
          WHERE id = ?
          AND user_id = ?
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
          const ingredient =
            ingredientStmt.get(
              item.ingredient_id,
              req.user.id
            );

          if (
            !ingredient ||
            !ingredient.base_unit
          ) {
            console.error(
              "Ingredient not found:",
              item.ingredient_id
            );

            return;
          }

          let convertedQuantity = 0;

          try {
            convertedQuantity =
              convertUnits(
                Number(
                  item.quantity
                ),
                item.unit,
                ingredient.base_unit
              );
          } catch (error) {
            console.error(
              "Unit conversion failed:",
              error.message
            );

            return;
          }

          updateIngredientStmt.run(
            convertedQuantity,
            item.ingredient_id,
            req.user.id
          );
        }
      );

      const deleteItemsStmt =
        db.prepare(`
          DELETE FROM purchase_items
          WHERE purchase_id = ?
        `);

      deleteItemsStmt.run(id);

      const deletePurchaseStmt =
        db.prepare(`
          DELETE FROM purchases
          WHERE id = ?
          AND user_id = ?
        `);

      deletePurchaseStmt.run(
        id,
        req.user.id
      );

      res.json({
        message:
          "Purchase deleted",
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