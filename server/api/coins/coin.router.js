const {
  earnCoinPonits,
  getCoinsTotalBalanceByCustomer,
} = require("./coin.controller");

const router = require("express").Router();

router.post("/", earnCoinPonits);
router.get("/:id", getCoinsTotalBalanceByCustomer);

module.exports = router;
