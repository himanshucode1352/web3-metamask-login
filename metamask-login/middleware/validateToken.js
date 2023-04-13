const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
        if (err) {
          res.status(401);
          return res.status(404).json({ message: "User is not authorized" });
        }
        req.id = decoded.id;
        req.email = decoded.email;
        next();
      });

      if (!token) {
        res.status(401);
        return res
          .status(404)
          .json({ message: "User is not authorized or token is missing" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = validateToken;
