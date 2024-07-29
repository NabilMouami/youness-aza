const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createOrd,
  getOrds,
  getOrdersByCust,
  getOrdersByDtOrd,
  getLastNumOrder,
  getOrdersByOrdId,
  updatePriceOrder,
  updateDeliveryStatus,
  updateCustomerInformation,
  createOrdFromDashboard,
} = require("./order.controller");
router.get("/", getOrds);
router.get("/:id", checkToken, getOrdersByCust);
router.get("/date_order/:date_order", getOrdersByDtOrd);
router.get("/order_id/:order_num", getOrdersByOrdId);
router.get("/lastorder/lastnumorder", getLastNumOrder);
router.post("/", createOrd);
router.post("/dashboard", createOrdFromDashboard);
router.post("/dsicount_price", updatePriceOrder);
router.post("/delivery_status", updateDeliveryStatus);
router.post("/customer_information", updateCustomerInformation);

module.exports = router;
