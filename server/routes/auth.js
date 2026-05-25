const express =
  require("express");

const router =
  express.Router();

const jwt =
  require("jsonwebtoken");

const bcrypt =
  require("bcryptjs");

const db =
  require("../database/db");

const SECRET =
  process.env.JWT_SECRET ||
  "supersecretkey";

router.post(
  "/register",
  async (req, res) => {
    const {
      username,
      password,
    } = req.body;

    try {
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const stmt =
        db.prepare(`
          INSERT INTO users
          (
            username,
            password
          )
          VALUES (?, ?)
        `);

      stmt.run(
        username,
        hashedPassword
      );

      res.json({
        message:
          "User created",
      });
    } catch (error) {
  console.error(error);

  res
    .status(500)
    .json({
      message:
        error.message,
    });
}
  }
);

router.post(
  "/login",
  async (req, res) => {
    const {
      username,
      password,
    } = req.body;

    try {
      const stmt =
        db.prepare(`
          SELECT *
          FROM users
          WHERE username = ?
        `);

      const user =
        stmt.get(username);

      if (!user) {
        return res
          .status(401)
          .json({
            message:
              "Invalid credentials",
          });
      }

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {
        return res
          .status(401)
          .json({
            message:
              "Invalid credentials",
          });
      }

      const token =
        jwt.sign(
          {
            id: user.id,
            username:
              user.username,
          },
          SECRET,
          {
            expiresIn:
              "7d",
          }
        );

      res.json({
        token,
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({
          message:
            "Login failed",
        });
    }
  }
);

module.exports = router;