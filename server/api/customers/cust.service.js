const db = require("../../config/database");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

module.exports = {
  createCustomer: (data, callBack) => {
    console.log(data);

    // Step 1: Generate OTP
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const otpExpiration = new Date(Date.now() + 40 * 60 * 1000); // OTP expires in 15 minutes

    // Step 2: Insert customer data into the database
    db.query(
      `INSERT INTO customer (firstName, lastName, email, password, otp, otpExpiration) 
     VALUES (?, ?, ?, ?,?,?)`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        otp,
        otpExpiration,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }

        // Step 3: Configure Nodemailer to send the OTP email
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "nabilmouami353@gmail.com", // Replace with your email
            pass: "ujrj njvo atqw tsml", // Replace with your email password
          },
        });

        const mailOptions = {
          from: "your-email@gmail.com", // Replace with your email
          to: data.email,
          subject: "OTP Verification",
          text: `Your OTP code is ${otp}. It will expire in 40 minutes.`,
        };

        // Step 4: Send OTP email
        transporter.sendMail(mailOptions, (emailError, info) => {
          if (emailError) {
            return callBack(emailError);
          }

          // Step 5: Return success callback after sending email
          console.log("Email sent: " + info.response);
          return callBack(null, results);
        });
      }
    );
  },
  verifyOtp: (data, callBack) => {
    const { email, otp } = data;

    // Query the database to get the user's OTP and expiration time
    db.query(
      `SELECT otp, otpExpiration, isVerified FROM customer WHERE email = ?`,
      [email],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        if (results.length === 0) {
          // No user found with the provided email
          return callBack("User not found.");
        }

        const user = results[0];

        // Check if the user is already verified
        if (user.isVerified === 1) {
          // Assuming isVerified is an integer
          return callBack("User is already verified.");
        }

        // Check if the OTP matches
        if (user.otp !== otp) {
          return callBack("Invalid OTP.");
        }

        // Check if the OTP is expired
        const currentTime = new Date();
        if (currentTime > user.otpExpiration) {
          // Compare with the DATETIME from MySQL
          return callBack("OTP has expired.");
        }

        // OTP is correct and not expired, update the user as verified
        db.query(
          `UPDATE customer SET isVerified = 1, otp = NULL, otpExpiration = NULL WHERE email = ?`,
          [email],
          (updateError, updateResults) => {
            if (updateError) {
              return callBack(updateError);
            }
            return callBack(null, "Email verified successfully.");
          }
        );
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
  getTotalCoinsCustomer: (customer_id, callBack) => {
    db.query(
      `select balance,coins_pending from coins where customer_id = ?`,
      [customer_id],
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
  getOrdersCustomer: (customerId, callBack) => {
    db.query(
      `SELECT
      o.nom_client,
      o.custom_id,
      o.size,
      o.ville,
      o.telephone,
      o.email,
      o.adresse,
      o.code_postal,
      o.order_status,
      o.payment_status,
      o.delivery_status,
      o.date_order,
      o.order_num,
      SUM(o.total_price) AS total_price_sum,
      SUM(o.qty) AS sum_qty,
      o.coins_payed,
      c.balance,
      c.expiration_date,
      c.created_at,
      p.name AS product_name,
      p.image AS product_image
    FROM
      orders o
    LEFT JOIN coins c ON o.custom_id = c.customer_id
    LEFT JOIN produit p ON o.prod_id = p.id
    WHERE
      o.custom_id = ?
    GROUP BY
      o.nom_client,
      o.custom_id,
      o.size,
      o.ville,
      o.telephone,
      o.email,
      o.adresse,
      o.code_postal,
      o.order_status,
      o.payment_status,
      o.delivery_status,
      o.date_order,
      o.order_num,
      o.coins_payed,

      c.balance,
      c.expiration_date,
      c.created_at,
      p.name,
      p.image;`,
      [customerId],
      (error, results) => {
        if (error) {
          return callBack(error);
        }

        // Assuming all rows belong to the same client
        if (results.length > 0) {
          const clientInfo = {
            nom_client: results[0].nom_client,
            ville: results[0].ville,
            telephone: results[0].telephone,
            email: results[0].email,
            adresse: results[0].adresse,
            data: results.map((order) => ({
              custom_id: order.custom_id,
              size: order.size,
              ville: order.ville,
              adresse: order.adresse,
              telephone: order.telephone,
              order_status: order.order_status,
              payment_status: order.payment_status,
              delivery_status: order.delivery_status,
              date_order: order.date_order,
              order_num: order.order_num,
              total_price_sum: order.total_price_sum,
              sum_qty: order.sum_qty,
              balance: order.balance,
              coins_payed: order.coins_payed,
              expiration_date: order.expiration_date,
              created_at: order.created_at,
              product_name: order.product_name,
              product_image: order.product_image,
            })),
          };

          return callBack(null, clientInfo);
        } else {
          return callBack(null, {});
        }
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
