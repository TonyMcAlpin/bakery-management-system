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
      FROM ingredients
      WHERE user_id = ?
      ORDER BY name ASC
    `;

    db.all(
      sql,
      [req.user.id],
      (err, rows) => {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        res.json(rows);
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
      quantity,
      unit,
      baseUnit,
      costPerUnit,
      supplier,
      minimumStock,
    } = req.body;

    const sql = `
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
    `;

    db.run(
      sql,
      [
        req.user.id,
        name,
        quantity,
        unit,
        baseUnit,
        costPerUnit,
        supplier,
        minimumStock,
      ],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        res.json({
          id: this.lastID,
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
      quantity,
      unit,
      baseUnit,
      costPerUnit,
      supplier,
      minimumStock,
    } = req.body;

    const sql = `
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
    `;

    db.run(
      sql,
      [
        name,
        quantity,
        unit,
        baseUnit,
        costPerUnit,
        supplier,
        minimumStock,
        id,
        req.user.id,
      ],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        res.json({
          message:
            "Ingredient updated",
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

    const sql = `
      DELETE FROM ingredients
      WHERE id = ?
      AND user_id = ?
    `;

    db.run(
      sql,
      [id, req.user.id],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json(err);
        }

        res.json({
          message:
            "Ingredient deleted",
        });
      }
    );
  }
);

module.exports = router;