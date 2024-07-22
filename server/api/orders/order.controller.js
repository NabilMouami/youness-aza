const {
  createOrder,
  getOrders,
  getOrdersByCustomer,
  getOrdersByDateOrder,
  getMaxNumOrder,
} = require("./order.service");

module.exports = {
  createOrd: (req, res) => {
    const body = req.body;
    createOrder(body, (err, results) => {
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
  getOrds: (req, res) => {
    getOrders((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json(results);
    });
  },
  getOrdersByCust: (req, res) => {
    const id = req.params.id;
    getOrdersByCustomer(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.status(200).json(results);
    });
  },
  getOrdersByDtOrd: (req, res) => {
    const id = req.params.date_order;
    getOrdersByDateOrder(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.status(200).json(results);
    });
  },
  getLastNumOrder: (req, res) => {
    getMaxNumOrder((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json(results);
    });
  },
};
