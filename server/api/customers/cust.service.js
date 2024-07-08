const db = require("../../config/database");

module.exports = {
  createCustomer: (data, callBack) => {
    console.log(data);
    db.query(
      `insert into customer(firstName, lastName, email, password) 
                values(?,?,?,?)`,
      [data.firstName, data.lastName, data.email, data.password],

      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getCustomerByCustomerEmail: (email, callBack) => {
    db.query(
      `select * from customer where email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getCustomerByCustomerId: (id, callBack) => {
    db.query(
      `select id,firstName,lastName,email,password from customer where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getCustomers: (callBack) => {
    db.query(`select * from customer`, (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },
  updateCustomer: (id, data, callBack) => {
    console.log(data.password);
    db.query(
      `update customer set firstName=?, lastName=?, email=?, password=? where id = ?`,
      [data.firstName, data.lastName, data.email, data.password, id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateCustomerWithoutPassword: (id, data, callBack) => {
    db.query(
      `update customer set firstName=?, lastName=?, email=? where id = ?`,
      [data.firstName, data.lastName, data.email, id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  deleteCustomer: (id, callBack) => {
    console.log(id);

    db.query(
      `delete from customer where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};
