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
  addQtyToOrder,
  deleteOrder,
  removeItemFromOrder,
  getOrdersStatistics,
  makeAsPaid,
  annulerOrder,
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
  // get Orders Statisctics To Dashboard
  getOrdsStatisticsDash: (req, res) => {
    getOrdersStatistics((err, results) => {
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
  updateQtyItemOrder: (req, res) => {
    const body = req.body;
    addQtyToOrder(body, (err, results) => {
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
  updateMakedAsPaid: (req, res) => {
    const order_num = req.params.order_num;
    const custom_id = req.params.custom_id;
    const { coins_payed, amountSpent, infos } = req.body;
    makeAsPaid(
      { order_num, custom_id, amountSpent, coins_payed, infos },
      (err, results) => {
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
      }
    );
  },
  canceledOrderCustomer: (req, res) => {
    const order_num = req.params.order_num;
    const custom_id = req.params.custom_id;
    const { justification, infos } = req.body;
    annulerOrder(
      { order_num, custom_id, justification, infos },
      (err, results) => {
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
      }
    );
  },
  deleteOredrByNumOrder: (req, res) => {
    const id = req.params.id;
    deleteOrder(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record Not Found",
        });
      }
      return res.json({
        success: 1,
        message: "user deleted successfully",
      });
    });
  },
  deleteItemFromOrder: (req, res) => {
    const { prod_id, custom_id, order_num } = req.params;
    let data = { prod_id, custom_id, order_num };
    removeItemFromOrder(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record Not Found",
        });
      }
      return res.json({
        success: 1,
        message: "user deleted successfully",
      });
    });
  },
};
