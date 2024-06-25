const db = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    db.query(
      `insert into produit(nom, prix, category, description) values(?,?,?,?)`,
      [data.nom, data.prix, data.category, data.descrition],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getProds: (callBack) => {
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
  updateProd: (data, callBack) => {
    db.query(
      `update produit set nom=?, prenom=?, email=?, password=?, role=? where id = ?`,
      [data.nom, data.prenom, data.email, data.password, data.role, data.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  deleteProd: (id, callBack) => {
    db.query(
      `delete from produit where id = ?`,
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
