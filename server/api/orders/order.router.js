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
  updateQtyItemOrder,
  deleteOredrByNumOrder,
  deleteItemFromOrder,
  updateMakedAsPaid,
  getOrdsStatisticsDash,
  canceledOrderCustomer,
} = require("./order.controller");
router.get("/", getOrds);
router.get("/statistics", getOrdsStatisticsDash);
router.get("/:id", getOrdersByCust);
router.get("/date_order/:date_order", getOrdersByDtOrd);
router.get("/order_id/:order_num", getOrdersByOrdId);
router.get("/lastorder/lastnumorder", getLastNumOrder);
router.post("/", createOrd);
router.post("/dashboard", createOrdFromDashboard);
router.post("/discount_price", updatePriceOrder);
router.post("/delivery_status", updateDeliveryStatus);
router.post("/add_qty", updateQtyItemOrder);
router.post("/customer_information", updateCustomerInformation);
router.put("/ispaid/:order_num/:custom_id", updateMakedAsPaid);
router.put("/annuler/:order_num/:custom_id", canceledOrderCustomer);

router.delete("/:id", deleteOredrByNumOrder);
router.delete("/:prod_id/:custom_id/:size/:order_num", deleteItemFromOrder);

module.exports = router;
