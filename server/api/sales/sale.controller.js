const { getSales, getGlobalSales } = require("./sale.service");

module.exports = {
  getSals: (req, res) => {
    getSales((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json(results);
    });
  },
  getSalesGlobal: (req, res) => {
    getGlobalSales((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json(results);
    });
  },
};
