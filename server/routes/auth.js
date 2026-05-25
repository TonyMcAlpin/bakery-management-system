const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt =
  require("bcryptjs");

const db =
  require("../database/db");

const SECRET =
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

      db.run(
        `
        INSERT INTO users
        (
          username,
          password
        )
        VALUES (?, ?)
        `,
        [
          username,
          hashedPassword,
        ],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json(err);
          }

          res.json({
            message:
              "User created",
          });
        }
      );
    } catch (error) {
      res
        .status(500)
        .json(error);
    }
  }
);

router.post(
  "/login",
  (req, res) => {
    const {
      username,
      password,
    } = req.body;

    db.get(
      `
      SELECT *
      FROM users
      WHERE username = ?
      `,
      [username],
      async (err, user) => {
        if (
          err ||
          !user
        ) {
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
      }
    );
  }
);

module.exports = router;