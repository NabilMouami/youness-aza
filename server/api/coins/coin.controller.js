const { createCoins, getCoinsTotalBalanceByCust } = require("./coin.service");

module.exports = {
  earnCoinPonits: (req, res) => {
    const body = req.body;
    createCoins(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getCoinsTotalBalanceByCustomer: (req, res) => {
    const customer_id = req.params.id;
    getCoinsTotalBalanceByCust(customer_id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
};
