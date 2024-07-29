const {
  createOrder,
  getOrders,
  getOrdersByCustomer,
  getOrdersByDateOrder,
  getMaxNumOrder,
  getOrdersByOrderId,
  discountAmount,
  deliveryStatus,
  customerInformation,
  createOrderFromDash,
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
  createOrdFromDashboard: (req, res) => {
    const body = req.body;
    createOrderFromDash(body, (err, results) => {
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
  getOrdersByOrdId: (req, res) => {
    const id = req.params.order_num;
    getOrdersByOrderId(id, (err, results) => {
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
  updatePriceOrder: (req, res) => {
    const body = req.body;
    discountAmount(body, (err, results) => {
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
  updateDeliveryStatus: (req, res) => {
    const body = req.body;
    deliveryStatus(body, (err, results) => {
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
  updateCustomerInformation: (req, res) => {
    const body = req.body;
    customerInformation(body, (err, results) => {
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
