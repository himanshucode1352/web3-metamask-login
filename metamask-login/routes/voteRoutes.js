const router = require("express").Router();
const { poll } = require("../controller/voteController");
const validateToken = require("../middleware/validateToken");
router.post("/poll", validateToken, poll);

module.exports = router;
