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
          FROM recipes
          WHERE user_id = ?
          ORDER BY name ASC
        `);

      const recipes =
        stmt.all(req.user.id);

      res.json(recipes);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json(error);
    }
  }
);

router.get(
  "/:id",
  authenticateToken,
  (req, res) => {
    try {
      const { id } =
        req.params;

      const recipeStmt =
        db.prepare(`
          SELECT *
          FROM recipes
          WHERE id = ?
          AND user_id = ?
        `);

      const recipe =
        recipeStmt.get(
          id,
          req.user.id
        );

      if (!recipe) {
        return res
          .status(404)
          .json({
            message:
              "Recipe not found",
          });
      }

      const ingredientStmt =
        db.prepare(`
          SELECT
            recipe_ingredients.*,
            ingredients.name

          FROM recipe_ingredients

          JOIN ingredients
            ON recipe_ingredients.ingredient_id =
            ingredients.id

          WHERE recipe_id = ?
        `);

      const ingredients =
        ingredientStmt.all(id);

      recipe.ingredients =
        ingredients;

      res.json(recipe);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json(error);
    }
  }
);

router.get(
  "/:id/cost",
  authenticateToken,
  (req, res) => {
    try {
      const { id } =
        req.params;

      const stmt =
        db.prepare(`
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
        `);

      const rows =
        stmt.all(
          id,
          req.user.id
        );

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

      const recipeStmt =
        db.prepare(`
          SELECT yield_quantity
          FROM recipes
          WHERE id = ?
        `);

      const recipe =
        recipeStmt.get(id);

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
        name,
        yieldQuantity,
        ingredients,
      } = req.body;

      const recipeStmt =
        db.prepare(`
          INSERT INTO recipes
          (
            user_id,
            name,
            yield_quantity
          )
          VALUES (?, ?, ?)
        `);

      const result =
        recipeStmt.run(
          req.user.id,
          name,
          yieldQuantity
        );

      const recipeId =
        result.lastInsertRowid;

      const ingredientStmt =
        db.prepare(`
          INSERT INTO recipe_ingredients
          (
            recipe_id,
            ingredient_id,
            quantity,
            unit
          )
          VALUES (?, ?, ?, ?)
        `);

      ingredients.forEach(
        (ingredient) => {
          ingredientStmt.run(
            recipeId,
            ingredient.ingredientId,
            ingredient.quantity,
            ingredient.unit
          );
        }
      );

      res.json({
        message:
          "Recipe created",
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json(error);
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        name,
        yieldQuantity,
        ingredients,
      } = req.body;

      const updateStmt =
        db.prepare(`
          UPDATE recipes
          SET
            name = ?,
            yield_quantity = ?
          WHERE id = ?
          AND user_id = ?
        `);

      updateStmt.run(
        name,
        yieldQuantity,
        id,
        req.user.id
      );

      const deleteStmt =
        db.prepare(`
          DELETE FROM recipe_ingredients
          WHERE recipe_id = ?
        `);

      deleteStmt.run(id);

      const insertStmt =
        db.prepare(`
          INSERT INTO recipe_ingredients
          (
            recipe_id,
            ingredient_id,
            quantity,
            unit
          )
          VALUES (?, ?, ?, ?)
        `);

      ingredients.forEach(
        (ingredient) => {
          insertStmt.run(
            id,
            ingredient.ingredientId,
            ingredient.quantity,
            ingredient.unit
          );
        }
      );

      res.json({
        message:
          "Recipe updated",
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

      const deleteIngredientsStmt =
        db.prepare(`
          DELETE FROM recipe_ingredients
          WHERE recipe_id = ?
        `);

      deleteIngredientsStmt.run(
        id
      );

      const deleteRecipeStmt =
        db.prepare(`
          DELETE FROM recipes
          WHERE id = ?
          AND user_id = ?
        `);

      deleteRecipeStmt.run(
        id,
        req.user.id
      );

      res.json({
        message:
          "Recipe deleted",
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