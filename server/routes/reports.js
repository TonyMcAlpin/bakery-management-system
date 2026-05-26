const express =
  require("express");

const router =
  express.Router();

const db =
  require("../database/db");

const authenticateToken =
  require("../middleware/authMiddleware");

router.get(
  "/summary",
  authenticateToken,
  (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } = req.query;

      const summaryStmt =
        db.prepare(`
          SELECT
            COUNT(*) AS total_sales,

            COALESCE(
              SUM(total_revenue),
              0
            ) AS total_revenue,

            COALESCE(
              SUM(total_profit),
              0
            ) AS total_profit

          FROM sales

          WHERE user_id = ?

          AND DATE(sale_date)
            BETWEEN DATE(?)
            AND DATE(?)
        `);

      const summary =
        summaryStmt.get(
          req.user.id,
          startDate,
          endDate
        );

      const topProductsStmt =
        db.prepare(`
          SELECT
            recipes.name,

            SUM(sale_items.quantity)
              AS total_quantity_sold

          FROM sale_items

          JOIN sales
            ON sale_items.sale_id =
            sales.id

          JOIN recipes
            ON sale_items.recipe_id =
            recipes.id

          WHERE sales.user_id = ?

          AND DATE(sales.sale_date)
            BETWEEN DATE(?)
            AND DATE(?)

          GROUP BY recipes.name

          ORDER BY
            total_quantity_sold DESC

          LIMIT 5
        `);

      const topProducts =
        topProductsStmt.all(
          req.user.id,
          startDate,
          endDate
        );

      const revenueTrendStmt =
        db.prepare(`
          SELECT
            DATE(sale_date)
              AS sale_date,

            ROUND(
              SUM(total_revenue),
              2
            ) AS revenue,

            ROUND(
              SUM(total_profit),
              2
            ) AS profit

          FROM sales

          WHERE user_id = ?

          AND DATE(sale_date)
            BETWEEN DATE(?)
            AND DATE(?)

          GROUP BY DATE(sale_date)

          ORDER BY DATE(sale_date) ASC
        `);

      const revenueTrend =
        revenueTrendStmt.all(
          req.user.id,
          startDate,
          endDate
        );

      res.json({
        summary,
        topProducts,
        revenueTrend,
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