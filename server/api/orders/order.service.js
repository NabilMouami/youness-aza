const db = require("../../config/database");
module.exports = {
  createOrder: (data, callBack) => {
    console.log(data);
    db.query(
      `insert into orders(name) 
                value(?)`,
      [data.name],

      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getOrders: (callBack) => {
    db.query(
      `SELECT orders.*,produit.name as product_name,produit.image as image FROM orders JOIN customer ON  orders.custom_id = customer.id JOIN 
            produit ON orders.prod_id = produit.id;`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getOrdersByCustomer: (id, callBack) => {
    db.query(
      "SELECT * from orders where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
