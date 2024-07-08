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
  getGroupes: (callBack) => {
    db.query("SELECT id,name FROM groupes", [], (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },
};
