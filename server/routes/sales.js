const express = require("express");

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
    const sql = `
      SELECT *
      FROM sales
      WHERE user_id = ?
      ORDER BY sale_date DESC
    `;

    db.all(
      sql,
      [req.user.id],
      (err, rows) => {
        if (err) {
          res
            .status(500)
            .json(err);
        } else {
          res.json(rows);
        }
      }
    );
  }
);

router.post(
  "/",
  authenticateToken,
  (req, res) => {
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

    const saleSql = `
      INSERT INTO sales
      (
        user_id,
        sale_date,
        total_revenue,
        total_cost,
        total_profit
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      saleSql,
      [
        req.user.id,
        saleDate,
        totalRevenue,
        totalCost,
        totalProfit,
      ],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        const saleId =
          this.lastID;

        const itemSql = `
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
        `;

        items.forEach(
          (item) => {
            db.run(
              itemSql,
              [
                saleId,
                item.recipeId,
                item.quantity,
                item.salePrice,
                item.recipeCost,
                item.lineRevenue,
                item.lineProfit,
              ]
            );

            const recipeIngredientSql = `
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
            `;

            db.all(
              recipeIngredientSql,
              [
                item.recipeId,
                req.user.id,
              ],
              (
                err,
                ingredients
              ) => {
                if (err) {
                  console.error(
                    err
                  );

                  return;
                }

                ingredients.forEach(
                  (
                    ingredient
                  ) => {
                    const usagePerItem =
                      ingredient.quantity /
                      ingredient.yield_quantity;

                    const totalUsage =
                      usagePerItem *
                      item.quantity;

                    db.run(
                      `
                      UPDATE ingredients
                      SET quantity =
                        quantity - ?
                      WHERE id = ?
                      AND user_id = ?
                      `,
                      [
                        totalUsage,
                        ingredient.ingredient_id,
                        req.user.id,
                      ]
                    );
                  }
                );
              }
            );
          }
        );

        res.json({
          message:
            "Sale recorded",
        });
      }
    );
  }
);

router.delete(
  "/:id",
  authenticateToken,
  (req, res) => {
    const { id } =
      req.params;

    db.run(
      `
      DELETE FROM sale_items
      WHERE sale_id = ?
      `,
      [id],
      (err) => {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        db.run(
          `
          DELETE FROM sales
          WHERE id = ?
          AND user_id = ?
          `,
          [
            id,
            req.user.id,
          ],
          function (err) {
            if (err) {
              res
                .status(500)
                .json(err);
            } else {
              res.json({
                message:
                  "Sale deleted",
              });
            }
          }
        );
      }
    );
  }
);

module.exports = router;