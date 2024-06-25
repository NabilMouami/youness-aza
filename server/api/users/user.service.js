const db = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    db.query(
      `insert into user(nom, prenom, email, password, role) 
                values(?,?,?,?,?)`,
      [data.firstName, data.lastName, data.email, data.password, data.role],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    db.query(
      `select * from user where email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    db.query(
      `select id,nom,prenom,email,password,role from user where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUsers: (callBack) => {
    db.query(
      `select id,nom,prenom,email,password,role from user`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateUser: (id, data, callBack) => {
    console.log(data.password);
    db.query(
      `update user set nom=?, prenom=?, email=?, password=?, role=? where id = ?`,
      [data.nom, data.prenom, data.email, data.password, data.role, id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateUserWithoutPassword: (id, data, callBack) => {
    db.query(
      `update user set nom=?, prenom=?, email=?, role=? where id = ?`,
      [data.nom, data.prenom, data.email, data.role, id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  deleteUser: (id, callBack) => {
    console.log(id);

    db.query(
      `delete from user where id = ?`,
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
