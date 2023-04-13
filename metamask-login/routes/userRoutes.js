const router = require("express").Router();
const {
  signUp,
  signIn,
  getNonce,
  userVerify,
} = require("../controller/userController");
const validateToken = require("../middleware/validateToken");

router.post("/signup", validateToken, signUp);
router.post("/signin", validateToken, signIn);
router.get("/nonce", getNonce);
router.post("/verify", userVerify);

module.exports = router;
