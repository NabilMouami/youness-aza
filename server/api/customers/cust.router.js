const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createCust,
  login,
  getCustByCustId,
  getCusts,
  updateCusts,
  deleteCust,
} = require("./cust.controller");
router.get("/", getCusts);
router.post("/", createCust);
router.get("/:id", checkToken, getCustByCustId);
router.post("/login", login);
router.put("/:id", updateCusts);
router.delete("/:id", deleteCust);

module.exports = router;
