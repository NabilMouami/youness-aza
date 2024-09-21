const db = require("../../config/database");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key"; // Use a strong secret key
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
            SET qty = JSON_SET(qty, ?, ?)
            WHERE id = ?
          `;

            db.query(
              queryUpdateQty,
              [`$[${index}]`, newQty, productId],
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

// // Example usage
// updateProductQuantity(33, "42", "5");

module.exports = {
  createCoins: (data, callBack = () => {}) => {
    console.log(data);
    const { custom_id, amountSpent, infos } = data; // Ensure infos is destructured here
    console.log(amountSpent);
    let coinsEarned = amountSpent / 2.5;
    let coinsPending = amountSpent / 2.5;

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const spendableFrom = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const createdAt = new Date();

    // Check if the custom_id already exists in the coins table
    db.query(
      `SELECT * FROM coins WHERE customer_id = ?`,
      [custom_id],
      (error, results) => {
        if (error) {
          console.error("Error checking coins in database:", error);
          return callBack(error);
        }

        if (results.length > 0) {
          const existingCoin = results[0];
          const deliveryDate = new Date(existingCoin.delivery_date);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

          if (deliveryDate && deliveryDate <= oneMonthAgo) {
            // If delivery_date is more than a month ago, add coins_pending to balance and reset coins_pending
            coinsEarned = existingCoin.balance + existingCoin.coins_pending;
            db.query(
              `UPDATE coins SET balance = ?, expiration_date = ?, coins_pending = ?,delivery_date = ? WHERE customer_id = ?`,
              [coinsEarned, expirationDate, coinsPending, createdAt, custom_id],
              (updateError, updateResults) => {
                if (updateError) {
                  console.error(
                    "Error updating coins in database:",
                    updateError
                  );
                  return callBack(updateError);
                }

                console.log("Coins successfully updated in DB:", updateResults);

                // Update product quantities if infos is provided
                // if (infos && Array.isArray(infos)) {
                //   infos.forEach((item) => {
                //     updateProductQuantity(
                //       item.productId,
                //       item.productSize,
                //       item.qty
                //     );
                //   });
                // }

                // Return the update results via the callback
                return callBack(null, { updateResults });
              }
            );
          } else {
            // Normal update if delivery_date is not older than a month
            db.query(
              `UPDATE coins SET balance = balance + ?, expiration_date = ?, coins_pending = ?, delivery_date = ? WHERE customer_id = ?`,
              [coinsEarned, expirationDate, coinsEarned, createdAt, custom_id],
              (updateError, updateResults) => {
                if (updateError) {
                  console.error(
                    "Error updating coins in database:",
                    updateError
                  );
                  return callBack(updateError);
                }

                console.log("Coins successfully updated in DB:", updateResults);

                // Update product quantities if infos is provided
                // if (infos && Array.isArray(infos)) {
                //   infos.forEach((item) => {
                //     updateProductQuantity(
                //       item.productId,
                //       item.productSize,
                //       item.qty
                //     );
                //   });
                // }

                // Return the update results via the callback
                return callBack(null, { updateResults });
              }
            );
          }
        } else {
          // If custom_id does not exist, insert a new record
          db.query(
            `INSERT INTO coins (customer_id, balance, expiration_date, created_at, coins_pending, delivery_date) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              custom_id,
              coinsEarned,
              expirationDate,
              createdAt,
              coinsEarned,
              createdAt,
            ],
            (insertError, insertResults) => {
              if (insertError) {
                console.error(
                  "Error inserting coins into database:",
                  insertError
                );
                return callBack(insertError);
              }

              console.log(
                "Coins successfully created and stored in DB:",
                insertResults
              );

              // Update product quantities if infos is provided
              if (infos && Array.isArray(infos)) {
                infos.forEach((item) => {
                  updateProductQuantity(
                    item.productId,
                    item.productSize,
                    item.qty
                  );
                });
              }

              // Return the insert results via the callback
              return callBack(null, { insertResults });
            }
          );
        }
      }
    );
  },

  getCoinsTotalBalanceByCust: (customer_id, callBack) => {
    db.query(
      `        
SELECT
    customer_id,
    SUM(balance) AS total_balance
FROM
    coins
WHERE
    customer_id = ?
GROUP BY
    customer_id;  
    `,
      [customer_id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  decreaseBalanceCoins: (data) => {
    const { customer_id, coins_paid } = data;
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE coins 
       SET balance = balance - ? 
       WHERE customer_id = ?;`,
        [coins_paid, customer_id], // Correct order of parameters
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  },
};
