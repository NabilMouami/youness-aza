const mysql = require("mysql");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "123456789",
  database: "azasnikers",
  dateStrings: true,
});
module.exports = db;
