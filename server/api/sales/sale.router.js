const { getSals, getSalesGlobal } = require("./sale.controller");

const router = require("express").Router();
router.get("/", getSals);
router.get("/global", getSalesGlobal);
module.exports = router;
