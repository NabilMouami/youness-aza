const db = require("../../config/database");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

module.exports = {
  createOrder: (data, callBack) => {
    const now = new Date();
    const date_order = formatDate(now);
    console.log(data);
    for (i = 0; i < data.items.length; i++) {
      db.query(
        `INSERT INTO orders(nom_client,telephone,adresse,ville,code_postal,email,prod_id,custom_id,date_order,qty,status,total_price,size) 
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.nom_client,
          data.telephone,
          data.adresse,
          data.ville,
          data.code_postal,
          data.email,
          data.items[i]?.productId,
          data.customer_id,
          date_order,
          1,
          "impayer",
          data.items[i]?.productPrice,
          data.items[i]?.productSize,
        ],

        (error, results, fields) => {
          if (error) {
            callBack(error);
          }
          console.log("Order emitted to Socket.IO:", data);
          io.emit("newOrder", data);
          return callBack(null, results);
        }
      );
    }
  },

  getOrders: (callBack) => {
    db.query(
      `SELECT
    nom_client,
    ville,
    telephone,
    email,
    adresse,
    code_postal,
    status,
    date_order,
    SUM(total_price) AS total_price_sum,
    SUM(orders.qty) AS sum_qty
FROM
    orders
GROUP BY
    nom_client,
    ville,
    telephone,
    email,
    adresse,
    code_postal,
    status,
    date_order;`,
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
  getOrdersByDateOrder: (date_order, callBack) => {
    console.log(date_order);
    db.query(
      `SELECT prod_id,orders.qty as items,orders.size as size,orders.total_price as total_price,name,image,produit.qty from orders JOIN 
    produit ON orders.prod_id = produit.id where date_order=?;`,
      [date_order],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
