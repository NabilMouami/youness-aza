const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const { createGrp, getGrps, addProdsToGrp } = require("./group.controller");
router.get("/", getGrps);
router.post("/", createGrp);
router.post("/product_group", addProdsToGrp);

module.exports = router;
