const {
  createCustomer,
  getCustomerByCustomerEmail,
  getCustomerByCustomerId,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  updateCustomerWithoutPassword,
  getOrdersCustomer,
  getTotalCoinsCustomer,
  verifyOtp,
} = require("./cust.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = {
  createCust: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    createCustomer(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
    getCustomerByCustomerEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          data: "Error retrieving customer",
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }

      getTotalCoinsCustomer(results.id, (error, balanceResults) => {
        if (error) {
          console.log(error);
          return res.json({
            success: 0,
            data: "Error retrieving balance",
          });
        }

        // Check if balanceResults is defined and has a balance property
        if (!balanceResults || typeof balanceResults.balance === "undefined") {
          console.log("Balance is undefined");
          // Set a default value for balance if it's undefined
          balanceResults = { balance: 0 }; // You can adjust this default as needed
        }

        const balance = balanceResults.balance;
        const coinsPending = balanceResults.coins_pending;

        console.log("Balance:" + balance + ",Coins Pending:", coinsPending);

        const result = compareSync(body.password, results.password);
        if (result) {
          results.password = undefined;
          results.balance = balance;
          results.coins_pending = coinsPending;
          const jsontoken = sign({ result: results }, "customeryazasneackers", {
            expiresIn: "8h",
          });
          broadcast({ event: "USER_REGISTERED", body });

          return res.json({
            results: results,
            token: jsontoken,
            balance: balance, // Include balance in response if needed
            coins_pending: coinsPending,
          });
        } else {
          return res.json({
            success: 0,
            data: "Invalid email or password",
          });
        }
      });
    });
  },

  verifyOtpCust: (req, res) => {
    const body = req.body;
    verifyOtp(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getCustByCustId: (req, res) => {
    const id = req.params.id;
    getCustomerByCustomerId(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      results.password = undefined;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getAllOrdersCustomer: (req, res) => {
    const id = req.params.id;
    getOrdersCustomer(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      results.password = undefined;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getCusts: (req, res) => {
    getCustomers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json(results);
    });
  },
  updateCusts: (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log(body);
    const salt = genSaltSync(10);
    if (req.body.password === "") {
      updateCustomerWithoutPassword(id, body, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        return res.json({
          success: 1,
          message: "updated successfully",
        });
      });
    } else {
      body.password = hashSync(body.password, salt);
      updateCustomer(id, body, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        return res.json({
          success: 1,
          message: "updated successfully",
        });
      });
    }
  },
  deleteCust: (req, res) => {
    const id = req.params.id;
    deleteCustomer(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record Not Found",
        });
      }
      return res.json({
        success: 1,
        message: "user deleted successfully",
      });
    });
  },
};
