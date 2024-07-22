const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createOrd,
  getOrds,
  getOrdersByCust,
  getOrdersByDtOrd,
  getLastNumOrder,
} = require("./order.controller");
router.get("/", getOrds);
router.get("/:id", checkToken, getOrdersByCust);
router.get("/date_order/:date_order", getOrdersByDtOrd);
router.get("/lastorder/lastnumorder", getLastNumOrder);
router.post("/", createOrd);

module.exports = router;
