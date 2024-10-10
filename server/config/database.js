const mysql = require("mysql");

const db = mysql.createConnection({
  user: "yazasnkrz",
  host: "localhost",
  password: "Yazasnkrz_123456789",
  database: "azasnikrs",
  dateStrings: true,
});
module.exports = db;
