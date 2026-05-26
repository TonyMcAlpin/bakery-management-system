const jwt =
  require("jsonwebtoken");

const SECRET =
  process.env.JWT_SECRET;

function authenticateToken(
  req,
  res,
  next
) {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({
        message:
          "No token provided",
      });
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({
        message:
          "Invalid token",
      });
  }

  try {
    const user =
      jwt.verify(
        token,
        SECRET
      );

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "JWT VERIFY ERROR:",
      error.message
    );

    return res
      .status(403)
      .json({
        message:
          "Token invalid",
      });
  }
}

module.exports =
  authenticateToken;