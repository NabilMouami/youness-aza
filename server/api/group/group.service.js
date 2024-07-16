const db = require("../../config/database");
module.exports = {
  createGroupe: (data, callBack) => {
    console.log(data);
    db.query(
      `insert into groupes(name) 
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
  AffectProuductsToGroupe: (data, callBack) => {
    console.log(data);
    for (let i = 0; i < data.rowSelectionModel.length; i++) {
      db.query(
        `insert into product_group(product_id,group_id) 
                values(?,?)`,
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
};
