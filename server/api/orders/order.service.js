const db = require("../../config/database");
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const http = require("http");
const socketIo = require("socket.io");
const { createCoins, decreaseBalanceCoins } = require("../coins/coin.service");

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
async function sendOrderEmail(orderData) {
  const {
    nom_client,
    order_num,
    total_price,
    items,

    ville,
    adresse,
    telephone,
    code_postal,
  } = orderData;

  console.log(items);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "nabilmouami353@gmail.com",
      pass: "ujrj njvo atqw tsml",
    },
  });

  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "config",
    "emailTemplate",
    "orderEmailTemplate.hbs"
  );

  const template = await fs.promises.readFile(templatePath, "utf8");

  // Compile the template with Handlebars
  const compiledTemplate = handlebars.compile(template);
  const now = new Date();

  const date_order = formatDate(now);

  const html = compiledTemplate({
    nom_client,
    order_num,
    total_price,
    date_order,
    items,
    ville,
    adresse,
    telephone,
    code_postal,
  });

  // Set up email options
  const mailOptions = {
    from: orderData.customerEmail,
    to: "nabilmouami353@gmail.com",
    subject: "New Order Created",
    html: html,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

async function sendOrderEmailToCustomer(orderData) {
  let coinsEarned = orderData.amountSpent / 2.5;
  const nom_client = orderData?.infos[0]?.nom_client;
  const adresse = orderData?.infos[0]?.adresse;
  const ville = orderData?.infos[0]?.ville;
  const telephone = orderData?.infos[0]?.telephone;
  const code_postal = orderData?.infos[0]?.code_postal;

  const { amountSpent, infos, order_num } = orderData;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "nabilmouami353@gmail.com",
      pass: "ujrj njvo atqw tsml",
    },
  });

  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "config",
    "emailTemplate",
    "invoiceToCustomer.hbs"
  );

  const template = await fs.promises.readFile(templatePath, "utf8");

  // Compile the template with Handlebars
  const compiledTemplate = handlebars.compile(template);
  const now = new Date();

  const date_order = formatDate(now);

  const html = compiledTemplate({
    nom_client,
    order_num,
    amountSpent,
    date_order,
    infos,
    coinsEarned,

    ville,
    adresse,
    telephone,
    code_postal,
  });

  // Set up email options
  const mailOptions = {
    from: "nabilmouami353@gmail.com",
    to: "bill.mou33@gmail.com",
    subject: "New Order Created",
    html: html,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}
async function sendCanceledOrderToCustomer(orderData) {
  const nom_client = orderData?.infos[0]?.nom_client;
  const adresse = orderData?.infos[0]?.adresse;
  const ville = orderData?.infos[0]?.ville;
  const telephone = orderData?.infos[0]?.telephone;
  const code_postal = orderData?.infos[0]?.code_postal;

  const { justification, infos, order_num } = orderData;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "nabilmouami353@gmail.com",
      pass: "ujrj njvo atqw tsml",
    },
  });

  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "config",
    "emailTemplate",
    "cancelOrder.hbs"
  );

  const template = await fs.promises.readFile(templatePath, "utf8");

  // Compile the template with Handlebars
  const compiledTemplate = handlebars.compile(template);
  const now = new Date();

  const date_order = formatDate(now);

  const html = compiledTemplate({
    nom_client,
    order_num,
    date_order,
    infos,
    justification,
    ville,
    adresse,
    telephone,
    code_postal,
  });

  // Set up email options
  const mailOptions = {
    from: "nabilmouami353@gmail.com",
    to: "bill.mou33@gmail.com",
    subject: "New Order Created",
    html: html,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

function updateProductQuantity(productId, shoeSize, qtyToDecrease) {
  // Get the index of the shoeSize in nemuro_shoes array
  const queryGetIndexAndQty = `
    SELECT 
      JSON_UNQUOTE(JSON_SEARCH(nemuro_shoes, 'one', ?)) as ind,
      JSON_UNQUOTE(JSON_EXTRACT(qty, JSON_UNQUOTE(JSON_SEARCH(nemuro_shoes, 'one', ?)))) as currentQty
    FROM produit 
    WHERE id = ?
  `;

  db.query(
    queryGetIndexAndQty,
    [shoeSize, shoeSize, productId],
    (err, result) => {
      if (err) {
        console.error("Error fetching index and current quantity:", err);
        return;
      }

      const indexPath = result[0]?.ind;
      const currentQty = parseInt(result[0]?.currentQty, 10);

      if (indexPath && !isNaN(currentQty)) {
        // Extract the actual index number from the path
        const indexMatch = indexPath.match(/\[(\d+)\]$/);
        const index = indexMatch ? indexMatch[1] : null;

        if (index !== null) {
          // Calculate the new quantity by subtracting qtyToDecrease
          const newQty = currentQty - qtyToDecrease;
          console.log("newQty are you want to updated:", String(newQty));
          if (newQty >= 0) {
            // Update the quantity for the specific shoe size
            const queryUpdateQty = `
            UPDATE produit
  SET qty = JSON_SET(qty, ?, CAST(? AS CHAR))
            WHERE id = ?
          `;

            db.query(
              queryUpdateQty,
              [`$[${index}]`, String(newQty), productId],
              (err, result) => {
                if (err) {
                  console.error("Error updating quantity:", err);
                  return;
                }
                console.log("Product quantity updated successfully.");
              }
            );
          } else {
            console.log("Cannot decrease quantity below zero.");
          }
        } else {
          console.log("Failed to extract index from path:", indexPath);
        }
      } else {
        console.log("Shoe size not found or current quantity is invalid.");
      }
    }
  );
}

function increaseProductQuantity(productId, shoeSize, qtyToDecrease) {
  // Get the index of the shoeSize in nemuro_shoes array
  const queryGetIndexAndQty = `
    SELECT 
      JSON_UNQUOTE(JSON_SEARCH(nemuro_shoes, 'one', ?)) as ind,
      JSON_UNQUOTE(JSON_EXTRACT(qty, JSON_UNQUOTE(JSON_SEARCH(nemuro_shoes, 'one', ?)))) as currentQty
    FROM produit 
    WHERE id = ?
  `;

  db.query(
    queryGetIndexAndQty,
    [shoeSize, shoeSize, productId],
    (err, result) => {
      if (err) {
        console.error("Error fetching index and current quantity:", err);
        return;
      }

      const indexPath = result[0]?.ind;
      const currentQty = parseInt(result[0]?.currentQty, 10);

      if (indexPath && !isNaN(currentQty)) {
        // Extract the actual index number from the path
        const indexMatch = indexPath.match(/\[(\d+)\]$/);
        const index = indexMatch ? indexMatch[1] : null;

        if (index !== null) {
          // Calculate the new quantity by subtracting qtyToDecrease
          const newQty = currentQty + qtyToDecrease;
          console.log("newQty are you want to updated:", String(newQty));
          if (newQty >= 0) {
            // Update the quantity for the specific shoe size
            const queryUpdateQty = `
            UPDATE produit
  SET qty = JSON_SET(qty, ?, CAST(? AS CHAR))
            WHERE id = ?
          `;

            db.query(
              queryUpdateQty,
              [`$[${index}]`, String(newQty), productId],
              (err, result) => {
                if (err) {
                  console.error("Error updating quantity:", err);
                  return;
                }
                console.log("Product quantity updated successfully.");
              }
            );
          } else {
            console.log("Cannot decrease quantity below zero.");
          }
        } else {
          console.log("Failed to extract index from path:", indexPath);
        }
      } else {
        console.log("Shoe size not found or current quantity is invalid.");
      }
    }
  );
}
module.exports = {
  createOrder: (data, callBack) => {
    const now = new Date();
    const date_order = formatDate(now);

    const queries = data.items.map(
      (item) =>
        new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO orders(nom_client,telephone,adresse,ville,code_postal,email,prod_id,custom_id,date_order,qty,order_status,total_price,size,payment_status,delivery_status,order_num,coins_payed) 
             VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              data.nom_client,
              data.telephone,
              data.adresse,
              data.ville,
              data.code_postal,
              data.email,
              item.productId,
              data.customer_id,
              date_order,
              1,
              "open",
              item.productPrice,
              item.productSize,
              data.payment_status,
              "OPEN",
              data.order_num,
              data.coins_paid,
            ],
            (error, results) => {
              if (error) {
                return reject(error);
              }
              resolve(results);
            }
          );
        })
    );

    Promise.all(queries)
      .then(async (results) => {
        try {
          // Update product quantities if infos is provided
          if (data.items && Array.isArray(data.items)) {
            data.items.forEach((item) => {
              updateProductQuantity(item.productId, item.productSize, 1);
            });
          }

          await sendOrderEmail(data);
          await decreaseBalanceCoins({
            customer_id: data.customer_id,
            coins_paid: data.coins_paid,
          });
          callBack(null, results);
        } catch (error) {
          callBack(error);
        }
      })
      .catch((error) => {
        callBack(error);
      });
  },
  createOrderFromDash: (data, callBack) => {
    const now = new Date();
    const date_order = formatDate(now);
    console.log(data);
    db.query(
      `INSERT INTO orders(nom_client,telephone,adresse,ville,code_postal,email,prod_id,custom_id,date_order,qty,order_status,total_price,size,payment_status,delivery_status,order_num) 
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.nom_client,
        data.telephone,
        data.adresse,
        data.ville,
        data.code_postal,
        data.email,
        data.prod_id,
        data.custom_id,
        date_order,
        1,
        "open",
        data.total_price,
        data.size,
        data.payment_status,
        "OPEN",
        data.order_num,
      ],

      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          sendOrderEmail(data).catch((err) => {
            console.error("Error in sendOrderEmail: ", err);
          });
        }
        console.log("Order emitted to Socket.IO:", data);
        // io.emit("newOrder", data);

        return callBack(null, results);
      }
    );
  },

  getOrders: (callBack) => {
    db.query(
      `SELECT
      nom_client,
      custom_id,
      ville,
      telephone,
      email,
      adresse,
      code_postal,
      order_status,
      payment_status,
      delivery_status,
      date_order,
      order_num,
      coins_payed,
      SUM(total_price) AS total_price_sum,
      SUM(orders.qty) AS sum_qty
    FROM
      orders
    GROUP BY
      nom_client,
      custom_id,
      ville,
      telephone,
      email,
      adresse,
      code_postal,
      order_status,
      payment_status,
      delivery_status,
      date_order,
      order_num,
      coins_payed
    ORDER BY
      order_num DESC;`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  // Orders In Page statistics Dashboard:
  getOrdersStatistics: (callBack) => {
    db.query(
      `SELECT
            nom_client,
            custom_id,
            ville,
            telephone,
            email,
            adresse,
            code_postal,
            order_status,
            payment_status,
            delivery_status,
            date_order,
            order_num,
            SUM(total_price) AS total_price_sum,
            SUM(qty) AS sum_qty,
            COUNT(*) AS order_count
        FROM
            orders
        GROUP BY
            nom_client,
            custom_id,
            ville,
            telephone,
            email,
            adresse,
            code_postal,
            order_status,
            payment_status,
            delivery_status,
            date_order,
            order_num
        ;`,
      [],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        // Aggregate statistics
        const totalOrders = results.length;
        const openOrders = results.filter(
          (order) => order.order_status === "open"
        ).length;
        const closedOrders = results.filter(
          (order) => order.order_status === "closed"
        ).length;
        const totalPriceSum = results.reduce(
          (sum, order) => sum + parseFloat(order.total_price_sum),
          0
        );

        callBack(null, {
          totalOrders,
          openOrders,
          closedOrders,
          totalPriceSum, // Include total price sum in the callback result
          orders: results,
        });
      }
    );
  },

  getDailyOrders: () => {},
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
  getOrdersByOrderId: (order_id, callBack) => {
    db.query(
      `SELECT prod_id,custom_id,orders.qty as items,orders.size as size,total_price,nom_client,email,telephone,adresse,ville,code_postal,date_order,orders.total_price as total_price,orders.order_num as order_num,name,image,produit.qty from orders JOIN 
    produit ON orders.prod_id = produit.id where order_num=?;`,
      [order_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getMaxNumOrder: (callBack) => {
    db.query(
      `SELECT MAX(order_num) as max_num_order from orders`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  discountAmount: (data, callBack) => {
    const { order_num, prod_id, custom_id, discount } = data;
    const query = `
    UPDATE orders
    SET total_price = total_price - ?
    WHERE order_num = ? AND prod_id = ? AND custom_id = ?
  `;

    db.query(
      query,
      [discount, order_num, prod_id, custom_id],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result);
      }
    );
  },
  addQtyToOrder: (data, callBack) => {
    const { order_num, prod_id, custom_id, qty } = data;
    const query = `
    UPDATE orders
    SET qty= qty + ?
    WHERE order_num = ? AND prod_id = ? AND custom_id = ?
  `;

    db.query(query, [qty, order_num, prod_id, custom_id], (err, result) => {
      if (err) {
        return callBack(err);
      }
      return callBack(null, result);
    });
  },
  deliveryStatus: (data, callBack) => {
    const { order_num, prod_id, custom_id, delivery_status } = data;
    const query = `
    UPDATE orders
    SET delivery_status = ?
    WHERE order_num = ? AND prod_id = ? AND custom_id = ?
  `;

    db.query(
      query,
      [delivery_status, order_num, prod_id, custom_id],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result);
      }
    );
  },
  // Update Order's Customer Information
  customerInformation: (data, callBack) => {
    const {
      nom_client,
      telephone,
      adresse,
      ville,
      code_postal,
      email,
      order_num,
      prod_id,
      custom_id,
    } = data;
    const query = `
    UPDATE orders
    SET nom_client = ?, telephone = ?, adresse = ?, ville = ?, code_postal = ?, email = ?
    WHERE order_num = ? AND prod_id = ? AND custom_id = ?
  `;

    db.query(
      query,
      [
        nom_client,
        telephone,
        adresse,
        ville,
        code_postal,
        email,
        order_num,
        prod_id,
        custom_id,
      ],
      (err, result) => {
        if (err) {
          return callBack(err);
        }
        return callBack(null, result);
      }
    );
  },

  makeAsPaid: async (data, callBack) => {
    console.log(data);
    const query = `
    UPDATE orders
    SET payment_status = ?
    WHERE order_num = ?
  `;

    await db.query(query, ["PAID", data.order_num], (err, result) => {
      if (err) {
        return callBack(err);
      }
      console.log(result);
      sendOrderEmailToCustomer(data);
      createCoins(data);
      // decreaseBalanceCoins({
      //   customer_id: data.custom_id,
      //   coins_paid: data.coins_payed,
      // });
      return callBack(null, result);
    });
  },
  annulerOrder: async (data, callBack) => {
    try {
      console.log(data);
      await sendCanceledOrderToCustomer(data);

      if (data.infos && Array.isArray(data.infos)) {
        // Update delivery status to "CANCEL" in the database
        const updateQuery = `UPDATE orders SET delivery_status = 'CANCEL' WHERE order_num = ?`;

        // Assuming `data.orderId` contains the order ID to update
        await db.query(updateQuery, [data.order_num]);
        console.log("I am increasing quantity!!");
        data.infos.forEach((item) => {
          increaseProductQuantity(item.productId, item.productSize, 1);
        });
      }
      callBack(null, { status: 200, message: "Order cancelled successfully" });
    } catch (error) {
      callBack(error);
    }
  },

  deleteOrder: (id, callBack) => {
    console.log(id);

    db.query(
      `delete from orders where order_num = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  removeItemFromOrder: (data, callBack) => {
    db.query(
      `delete from orders where prod_id = ? AND custom_id = ? AND  order_num = ?`,
      [data.prod_id, data.custom_id, data.order_num],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};
