const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createCust,
  login,
  getCustByCustId,
  getCusts,
  updateCusts,
  deleteCust,
  getAllOrdersCustomer,
  verifyOtpCust,
} = require("./cust.controller");
router.get("/", getCusts);
router.post("/", createCust);
router.post("/verify-otp", verifyOtpCust);
router.get("/:id", checkToken, getCustByCustId);
router.get("/orders/:id", getAllOrdersCustomer);

router.post("/login", login);
router.put("/:id", updateCusts);
router.delete("/:id", deleteCust);

module.exports = router;
