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
          FROM ingredients
          WHERE user_id = ?
          ORDER BY name ASC
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
        name,
        quantity,
        unit,
        baseUnit,
        costPerUnit,
        supplier,
        minimumStock,
      } = req.body;

      const stmt =
        db.prepare(`
          INSERT INTO ingredients
          (
            user_id,
            name,
            quantity,
            unit,
            base_unit,
            cost_per_unit,
            supplier,
            minimum_stock
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

      const result =
        stmt.run(
          req.user.id,
          name,
          quantity,
          unit,
          baseUnit,
          costPerUnit,
          supplier,
          minimumStock
        );

      res.json({
        id:
          result.lastInsertRowid,
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
        quantity,
        unit,
        baseUnit,
        costPerUnit,
        supplier,
        minimumStock,
      } = req.body;

      const stmt =
        db.prepare(`
          UPDATE ingredients
          SET
            name = ?,
            quantity = ?,
            unit = ?,
            base_unit = ?,
            cost_per_unit = ?,
            supplier = ?,
            minimum_stock = ?
          WHERE id = ?
          AND user_id = ?
        `);

      stmt.run(
        name,
        quantity,
        unit,
        baseUnit,
        costPerUnit,
        supplier,
        minimumStock,
        id,
        req.user.id
      );

      res.json({
        message:
          "Ingredient updated",
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

      const stmt =
        db.prepare(`
          DELETE FROM ingredients
          WHERE id = ?
          AND user_id = ?
        `);

      stmt.run(
        id,
        req.user.id
      );

      res.json({
        message:
          "Ingredient deleted",
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