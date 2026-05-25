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
      FROM recipes
      WHERE user_id = ?
      ORDER BY name ASC
    `;

    db.all(
      sql,
      [req.user.id],
      (err, recipes) => {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        res.json(recipes);
      }
    );
  }
);

router.get(
  "/:id",
  authenticateToken,
  (req, res) => {
    const { id } =
      req.params;

    db.get(
      `
      SELECT *
      FROM recipes
      WHERE id = ?
      AND user_id = ?
      `,
      [id, req.user.id],
      (err, recipe) => {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        if (!recipe) {
          return res
            .status(404)
            .json({
              message:
                "Recipe not found",
            });
        }

        db.all(
          `
          SELECT
            recipe_ingredients.*,
            ingredients.name

          FROM recipe_ingredients

          JOIN ingredients
            ON recipe_ingredients.ingredient_id =
            ingredients.id

          WHERE recipe_id = ?
          `,
          [id],
          (
            err,
            ingredients
          ) => {
            if (err) {
              return res
                .status(500)
                .json(err);
            }

            recipe.ingredients =
              ingredients;

            res.json(recipe);
          }
        );
      }
    );
  }
);

router.get(
  "/:id/cost",
  authenticateToken,
  (req, res) => {
    const { id } =
      req.params;

    const sql = `
      SELECT
        ingredients.name,
        recipe_ingredients.quantity,
        ingredients.cost_per_unit

      FROM recipe_ingredients

      JOIN ingredients
        ON recipe_ingredients.ingredient_id =
        ingredients.id

      JOIN recipes
        ON recipe_ingredients.recipe_id =
        recipes.id

      WHERE recipe_id = ?
      AND recipes.user_id = ?
    `;

    db.all(
      sql,
      [id, req.user.id],
      (err, rows) => {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        let totalRecipeCost = 0;

        const breakdown =
          rows.map((row) => {
            const ingredientCost =
              row.quantity *
              row.cost_per_unit;

            totalRecipeCost +=
              ingredientCost;

            return {
              ingredient:
                row.name,

              quantity:
                row.quantity,

              unitCost:
                row.cost_per_unit.toFixed(
                  2
                ),

              ingredientCost:
                ingredientCost.toFixed(
                  2
                ),
            };
          });

        db.get(
          `
          SELECT yield_quantity
          FROM recipes
          WHERE id = ?
          `,
          [id],
          (err, recipe) => {
            if (err) {
              return res
                .status(500)
                .json(err);
            }

            const costPerItem =
              totalRecipeCost /
              recipe.yield_quantity;

            res.json({
              totalRecipeCost:
                totalRecipeCost.toFixed(
                  2
                ),

              costPerItem:
                costPerItem.toFixed(
                  2
                ),

              breakdown,
            });
          }
        );
      }
    );
  }
);

router.post(
  "/",
  authenticateToken,
  (req, res) => {
    const {
      name,
      yieldQuantity,
      ingredients,
    } = req.body;

    db.run(
      `
      INSERT INTO recipes
      (
        user_id,
        name,
        yield_quantity
      )
      VALUES (?, ?, ?)
      `,
      [
        req.user.id,
        name,
        yieldQuantity,
      ],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        const recipeId =
          this.lastID;

        ingredients.forEach(
          (ingredient) => {
            db.run(
              `
              INSERT INTO recipe_ingredients
              (
                recipe_id,
                ingredient_id,
                quantity,
                unit
              )
              VALUES (?, ?, ?, ?)
              `,
              [
                recipeId,
                ingredient.ingredientId,
                ingredient.quantity,
                ingredient.unit,
              ]
            );
          }
        );

        res.json({
          message:
            "Recipe created",
        });
      }
    );
  }
);

router.put(
  "/:id",
  authenticateToken,
  (req, res) => {
    const { id } =
      req.params;

    const {
      name,
      yieldQuantity,
      ingredients,
    } = req.body;

    db.run(
      `
      UPDATE recipes
      SET
        name = ?,
        yield_quantity = ?
      WHERE id = ?
      AND user_id = ?
      `,
      [
        name,
        yieldQuantity,
        id,
        req.user.id,
      ],
      (err) => {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        db.run(
          `
          DELETE FROM recipe_ingredients
          WHERE recipe_id = ?
          `,
          [id],
          (err) => {
            if (err) {
              return res
                .status(500)
                .json(err);
            }

            ingredients.forEach(
              (
                ingredient
              ) => {
                db.run(
                  `
                  INSERT INTO recipe_ingredients
                  (
                    recipe_id,
                    ingredient_id,
                    quantity,
                    unit
                  )
                  VALUES (?, ?, ?, ?)
                  `,
                  [
                    id,
                    ingredient.ingredientId,
                    ingredient.quantity,
                    ingredient.unit,
                  ]
                );
              }
            );

            res.json({
              message:
                "Recipe updated",
            });
          }
        );
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
      DELETE FROM recipe_ingredients
      WHERE recipe_id = ?
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
          DELETE FROM recipes
          WHERE id = ?
          AND user_id = ?
          `,
          [id, req.user.id],
          function (err) {
            if (err) {
              return res
                .status(500)
                .json(err);
            }

            res.json({
              message:
                "Recipe deleted",
            });
          }
        );
      }
    );
  }
);

module.exports = router;