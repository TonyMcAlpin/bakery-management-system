const express = require("express");

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
    const sql = `
      SELECT *
      FROM purchases
      WHERE user_id = ?
      ORDER BY purchase_date DESC
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

    const purchaseSql = `
      INSERT INTO purchases
      (
        user_id,
        supplier,
        purchase_date,
        total_cost
      )
      VALUES (?, ?, ?, ?)
    `;

    db.run(
      purchaseSql,
      [
        req.user.id,
        supplier,
        purchaseDate,
        totalCost,
      ],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        const purchaseId =
          this.lastID;

        const itemSql = `
          INSERT INTO purchase_items
          (
            purchase_id,
            ingredient_id,
            quantity,
            unit,
            cost
          )
          VALUES (?, ?, ?, ?, ?)
        `;

        items.forEach(
          (item) => {
            db.run(
              itemSql,
              [
                purchaseId,
                item.ingredientId,
                item.quantity,
                item.unit,
                item.cost,
              ]
            );

            db.get(
              `
              SELECT base_unit
              FROM ingredients
              WHERE id = ?
              AND user_id = ?
              `,
              [
                item.ingredientId,
                req.user.id,
              ],
              (
                err,
                ingredient
              ) => {
                if (err) {
                  console.error(
                    err
                  );

                  return;
                }

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
                  Number(
                    item.cost
                  ) /
                  convertedQuantity;

                db.run(
                  `
                  UPDATE ingredients
                  SET
                    quantity = quantity + ?,
                    cost_per_unit = ?
                  WHERE id = ?
                  AND user_id = ?
                  `,
                  [
                    convertedQuantity,
                    unitCost,
                    item.ingredientId,
                    req.user.id,
                  ]
                );
              }
            );
          }
        );

        res.json({
          message:
            "Purchase saved",
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

    const itemSql = `
      SELECT *
      FROM purchase_items
      WHERE purchase_id = ?
    `;

    db.all(
      itemSql,
      [id],
      (err, items) => {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        items.forEach(
          (item) => {
            db.get(
              `
              SELECT base_unit
              FROM ingredients
              WHERE id = ?
              AND user_id = ?
              `,
              [
                item.ingredient_id,
                req.user.id,
              ],
              (
                err,
                ingredient
              ) => {
                if (err) {
                  console.error(
                    err
                  );

                  return;
                }

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

                db.run(
                  `
                  UPDATE ingredients
                  SET quantity =
                    quantity - ?
                  WHERE id = ?
                  AND user_id = ?
                  `,
                  [
                    convertedQuantity,
                    item.ingredient_id,
                    req.user.id,
                  ]
                );
              }
            );
          }
        );

        db.run(
          `
          DELETE FROM purchase_items
          WHERE purchase_id = ?
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
              DELETE FROM purchases
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
                      "Purchase deleted",
                  });
                }
              }
            );
          }
        );
      }
    );
  }
);

module.exports = router;