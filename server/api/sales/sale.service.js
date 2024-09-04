const db = require("../../config/database");

module.exports = {
  getGlobalSales: (callBack) => {
    db.query(
      `SELECT 
      p.name AS product_name,
      p.category as name,
      count(p.category) as value,
      o.date_order,
      o.order_status,
      SUM(o.qty) AS total_quantity_sold,
      SUM(o.qty * o.total_price) AS total_sales_amount
    FROM orders o
    JOIN produit p ON o.prod_id = p.id
    GROUP BY p.name, p.category, o.date_order, o.order_status;
    `,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }

        const order_closed = results.filter(
          (order) => order.order_status === "closed"
        );

        const totalPriceSumPayed = order_closed.reduce(
          (sum, order) => sum + parseFloat(order.total_sales_amount),
          0
        );

        const totalPriceSum = results.reduce(
          (sum, order) => sum + parseFloat(order.total_sales_amount),
          0
        );

        return callBack(null, {
          totalPriceSum,
          totalPriceSumPayed,
          orders: results,
        });
      }
    );
  },
  getSales: (callBack) => {
    db.query(
      `SELECT 
        p.name AS product_name,
        p.category as name,
        
        count(p.category) as value,
        o.date_order,
        o.order_status,
        SUM(o.qty) AS total_quantity_sold,
        SUM(o.qty * o.total_price) AS total_sales_amount
      FROM orders o
      JOIN produit p ON o.prod_id = p.id
      GROUP BY p.name,p.category,o.date_order,o.order_status;
      `,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }

        return callBack(null, results);
      }
    );
  },
};
