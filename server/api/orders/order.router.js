const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const { createOrd, getOrds, getOrdersByCust } = require("./order.controller");
router.get("/", getOrds);
router.get("/:id", checkToken, getOrdersByCust);
router.post("/", createOrd);

module.exports = router;
