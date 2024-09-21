const db = require("../../config/database");
module.exports = {
  createGroupe: (data, callBack) => {
    db.query(
      `insert into groupes(name) 
                value(?)`,
      [data.groupe],

      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  AffectProuductsToGroupe: (data, callBack) => {
    console.log(data);
    for (let i = 0; i < data.rowSelectionModel.length; i++) {
      db.query(
        `insert into product_group(product_id,group_id) 
                values(?,?) ON DUPLICATE KEY UPDATE product_id = product_id`,
        [data.rowSelectionModel[i], data.group_id],

        (insertError, insertResults, insertFields) => {
          if (insertError) {
            return callBack(insertError);
          }
        }
      );
    }
    callBack(null, { message: "Insertions completed successfully" });
  },
  getGroupes: (callBack) => {
    db.query("SELECT id,name FROM groupes", [], (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },

  deleteGroupe: (id, callBack) => {
    db.query(
      `delete from groupes where id = ?`,
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
