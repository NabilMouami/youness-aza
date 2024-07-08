const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const { createGrp, getGrps } = require("./group.controller");
router.get("/", getGrps);
router.post("/", createGrp);

module.exports = router;
