const express = require("express");

const cors = require("cors");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const dotenv = require("dotenv");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Endpoint } = require("@aws-sdk/types");
const { v4: uuidv4 } = require("uuid");

const nodemailer = require("nodemailer");
const { checkToken } = require("./auth/token_validation");
const multer = require("multer");

const app = express();
dotenv.config();

const db = require("./config/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const userRouter = require("./api/users/user.router");
const groupRouter = require("./api/group/group.router");
const orderRouter = require("./api/orders/order.router");
const coinRouter = require("./api/coins/coin.router");
const saleRouter = require("./api/sales/sale.router");
const customerRouter = require("./api/customers/cust.router");

app.use(cors("*"));

const s3 = new S3Client({
  endpoint: "https://ams3.digitaloceanspaces.com", // DigitalOcean Spaces endpoint
  region: process.env.DO_SPACE_REGION, // or the region closest to your server
  credentials: {
    accessKeyId: process.env.DO_SPACE_KEY,
    secretAccessKey: process.env.DO_SPACE_SECRET,
  },
});

const uploadImage = async (file, folder) => {
  if (!file.buffer) {
    throw new Error("File buffer is empty.");
  }

  const fileName = `${folder}/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: process.env.DO_SPACE_BUCKET,
    Key: fileName, // Ensure unique file names
    Body: file.buffer,
    ACL: "public-read", // Make the file publicly readable
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command); // Upload the file

    // Return the permanent public URL
    const publicUrl = `${process.env.DO_SPACE_ENDPOINT}/${fileName}`;
    return publicUrl;
  } catch (err) {
    throw new Error(`Error uploading image: ${err.message}`);
  }
};

const storage = multer.memoryStorage(); // Use memory storage for S3
const upload = multer({ storage }); // Configuring multer with memory storage
const port = process.env.PORT || 5000;
app.use("/api/users", userRouter);
app.use("/api/groupes", groupRouter);
app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/coins", coinRouter);
app.use("/api/sales", saleRouter);

app.post(
  "/api/create-prod",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]), // Multer middleware for image uploads
  async (req, res) => {
    console.log("Files:", req.files);

    const {
      genre,
      type,
      status,
      size_shoes,
      meta_image,
      nom,
      productSlug,
      category,
      prix,
      prix_promo,
      size_quantity: qty,
      categories: rawCategories,
      description,
    } = req.body;

    const imageFile = req.files?.image?.[0]; // Single image
    const imagesFiles = req.files?.images || []; // Multiple images

    const categories = Array.isArray(rawCategories)
      ? rawCategories
      : JSON.parse(rawCategories || "[]");

    const finalPrixPromo = prix_promo === "" ? 0 : prix_promo;

    try {
      // Upload single image if available
      const imageUrl = imageFile
        ? await uploadImage(imageFile, "images")
        : null;

      // Upload multiple images
      const imageUrls = await Promise.all(
        imagesFiles.map((file) => uploadImage(file, "images"))
      );

      const firstTableString = JSON.stringify(imageUrls);

      // Insert into the database
      db.query(
        `INSERT INTO produit(name, category, price, price_promo, description, nemuro_shoes, image, meta_image, out_stock, hiden, images, meta_images, qty, genre, status_model, name_by_filtered, type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nom,
          category,
          prix,
          finalPrixPromo,
          description,
          size_shoes,
          imageUrl,
          meta_image,
          1, // out_stock
          0, // hiden
          firstTableString,
          firstTableString,
          qty,
          genre,
          status,
          productSlug,
          type,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting product:", err);
            return res.status(500).send(err);
          }

          const PrID = result.insertId;

          // Insert into product collections
          if (categories.length > 0) {
            categories.forEach((cat) => {
              db.query(
                "INSERT INTO produit_collection(prd_id, collection_id) VALUES (?, ?)",
                [PrID, cat?.id],
                (err) => {
                  if (err) console.log("Error inserting into collection:", err);
                }
              );
            });
          }

          res.send("Product and images inserted successfully.");
        }
      );
    } catch (err) {
      console.error("Error in processing:", err);
      res.status(500).send(err.message);
    }
  }
);
app.post("/api/produit/size_qty/:product_id", (req, res) => {
  const { product_id } = req.params;
  const { nemuro_shoes, qty } = req.body;
  const sql = "UPDATE produit SET nemuro_shoes = ?, qty = ? WHERE id = ?";
  db.query(sql, [nemuro_shoes, qty, product_id], (err, result) => {
    if (err) throw err;
    res.send("Data updated");
  });
});

function updateProductQuantity(productId, shoeSize, qtyToUpdate) {
  return new Promise((resolve, reject) => {
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
          return reject(err);
        }

        const indexPath = result[0]?.ind;
        const currentQty = parseInt(result[0]?.currentQty, 10);

        if (indexPath && !isNaN(currentQty)) {
          const indexMatch = indexPath.match(/\[(\d+)\]$/);
          const index = indexMatch ? indexMatch[1] : null;

          if (index !== null) {
            const newQty = qtyToUpdate;
            if (newQty >= 0) {
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
                    return reject(err);
                  }
                  resolve();
                }
              );
            } else {
              reject(new Error("Cannot decrease quantity below zero."));
            }
          } else {
            reject(new Error("Failed to extract index from path."));
          }
        } else {
          reject(
            new Error("Shoe size not found or current quantity is invalid.")
          );
        }
      }
    );
  });
}

app.post("/api/update-quantity", async (req, res) => {
  const { productId, shoeSize, qtyToUpdate } = req.body;

  try {
    await updateProductQuantity(productId, shoeSize, qtyToUpdate);
    res.status(200).send("Quantity updated successfully");
  } catch (err) {
    res.status(500).send("Error updating quantity: " + err.message);
  }
});
app.put(
  "/api/update-prod/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const upload_image = req.body.upload_image;
      const oldimage = req.body.oldimage;

      const status = req.body.status;
      const type = req.body.type;
      const genre = req.body.genre;
      const affected_categories = req.body.affected_categories;
      const changed_category = req.body.changed_category;
      const changed_groupe = req.body.changed_groupe;
      const groupe_id = req.body.groupe_id;
      const nom = req.body.nom;
      const productSlug = req.body.productSlug;
      const prix = req.body.prix;
      const prix_promo = req.body.prix_promo;
      const description = req.body.description;
      const out_of_stock = parseInt(req.body.out_of_stock);

      // Update main product data
      await new Promise((resolve, reject) => {
        db.query(
          `UPDATE produit SET name = ?, name_by_filtered = ?, price = ?, price_promo = ?, description = ?, status_model = ?, type = ?, genre = ?, out_stock = ? WHERE id = ?`,
          [
            nom,
            productSlug,
            prix,
            prix_promo,
            description,
            status,
            type,
            genre,
            out_of_stock,
            id,
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      // Handle category update if needed
      if (changed_category === "true" && Array.isArray(affected_categories)) {
        const categoryPromises = affected_categories.map(
          (categoryId) =>
            new Promise((resolve, reject) => {
              db.query(
                "INSERT INTO produit_collection(prd_id, collection_id) VALUES (?, ?)",
                [id, categoryId],
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                }
              );
            })
        );
        await Promise.all(categoryPromises);
      }

      // Handle group update if needed
      if (changed_groupe === "true") {
        await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO product_group (product_id, group_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE product_id = product_id",
            [id, groupe_id],
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });
      }

      // Handle image upload and deletion if needed
      if (upload_image === "true") {
        const imageFile = req.files?.image?.[0]; // Single image

        if (imageFile) {
          const imageUrl = await uploadImage(imageFile, "images");
          const key = oldimage.split(process.env.DO_SPACE_ENDPOINT + "/")[1];

          // Delete old image from S3
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.DO_SPACE_BUCKET,
              Key: key,
            })
          );

          // Update the new image in the database
          await new Promise((resolve, reject) => {
            db.query(
              `UPDATE produit SET image = ? WHERE id = ?`,
              [imageUrl, id],
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            );
          });
        }
      }

      // Send final response after all operations are complete
      res.status(200).json({ message: "Product updated successfully." });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//Out Of Stock
app.put("/api/out_of_stock/:id", (req, res) => {
  const id = req.params.id;
  const out_of_stock = req.body.out_of_stock;

  db.query(
    `update produit set out_stock = ? WHERE id = ?`,
    [out_of_stock, id],
    (err, result, fields) => {
      if (err) {
        console.log(err);
      } else {
        res.send("data inserted");
      }
    }
  );
});
app.put("/api/out_of_stock", (req, res) => {
  const out_of_stock = req.body.out_of_stock;
  for (let i = 0; i < out_of_stock.length; i++) {
    db.query(
      `update produit set out_stock = ? WHERE id = ?`,
      [0, out_of_stock[i]],
      (err, result, fields) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  res.send("Out Of Stock");
});

app.put("/api/in_stock", (req, res) => {
  const in_stock = req.body.in_stock;
  for (let i = 0; i < in_stock.length; i++) {
    db.query(
      `update produit set out_stock = ? WHERE id = ?`,
      [1, in_stock[i]],
      (err, result, fields) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  res.send("In Stock");
});
//Alls Products By Priority and Not Hiden
app.get("/api/products", (req, res) => {
  db.query(
    "SELECT produit.id AS id, produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names FROM produit JOIN produit_collection ON produit.id = produit_collection.prd_id JOIN collection ON produit_collection.collection_id = collection.id WHERE produit.hiden = '0' GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error fetching products");
      } else {
        const processedResult = result.map((product) => {
          // Parse the qty field
          let qtyArray;
          try {
            qtyArray = JSON.parse(product.qty);
          } catch (e) {
            console.error(`Failed to parse qty for product ${product.id}:`, e);
            qtyArray = [];
          }

          if (Array.isArray(qtyArray) && qtyArray.every((qty) => qty === "0")) {
            return { ...product, status: "Sold out" };
          } else {
            return { ...product };
          }
        });

        res.send(processedResult);
      }
    }
  );
});

//Alls Products By Priority and Not Hiden
app.get("/api/interface/products", (req, res) => {
  db.query(
    "SELECT produit.id AS id, produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names FROM produit JOIN produit_collection ON produit.id = produit_collection.prd_id JOIN collection ON produit_collection.categorie_id = collection.id WHERE produit.hiden = '0' GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error fetching products");
      } else {
        const processedResult = result.map((product) => {
          // Parse the qty field
          let qtyArray;
          try {
            qtyArray = JSON.parse(product.qty);
          } catch (e) {
            console.error(`Failed to parse qty for product ${product.id}:`, e);
            qtyArray = [];
          }

          if (Array.isArray(qtyArray) && qtyArray.every((qty) => qty === "0")) {
            return { ...product, status: "Sold out" };
          } else {
            return { ...product };
          }
        });

        res.send(processedResult);
      }
    }
  );
}); //Alls Products By Priority and Not Hiden AND Promotion (collection/on-sale page in Next js)
app.get("/api/products/promotion", (req, res) => {
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_collection ON produit.id = produit_collection.prd_id JOIN collection ON produit_collection.collection_id = collection.id WHERE  produit.hiden = '0'  AND produit.price_promo != 0  GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const processedResult = result.map((product) => {
          // Parse the qty field
          let qtyArray;
          try {
            qtyArray = JSON.parse(product.qty);
          } catch (e) {
            console.error(`Failed to parse qty for product ${product.id}:`, e);
            qtyArray = [];
          }

          if (Array.isArray(qtyArray) && qtyArray.every((qty) => qty === "0")) {
            return { ...product, status: "Sold out" };
          } else {
            return { ...product };
          }
        });

        res.send(processedResult);
      }
    }
  );
});
//Alls Products By Status_Model is Release and Not Hiden  (FirstPage Home Body in Next js)

app.get("/api/products/release", (req, res) => {
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_collection ON produit.id = produit_collection.prd_id JOIN collection ON produit_collection.collection_id = collection.id WHERE  produit.hiden = '0'  AND produit.status_model = 'release'  GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/api/products/top-products", (req, res) => {
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_collection ON produit.id = produit_collection.prd_id JOIN collection ON produit_collection.collection_id = collection.id WHERE  produit.hiden = '0'  AND produit.status_model = 'top-product'  GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
//Alls Products By Status_Model is Release and Not Hiden  (collection/nouveaux in Next js)

app.get("/api/products/nouveaux", (req, res) => {
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_collection ON produit.id = produit_collection.prd_id JOIN collection ON produit_collection.collection_id = collection.id WHERE  produit.hiden = '0'  AND produit.status_model = 'new'  GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const processedResult = result.map((product) => {
          // Parse the qty field
          let qtyArray;
          try {
            qtyArray = JSON.parse(product.qty);
          } catch (e) {
            console.error(`Failed to parse qty for product ${product.id}:`, e);
            qtyArray = [];
          }

          if (Array.isArray(qtyArray) && qtyArray.every((qty) => qty === "0")) {
            return { ...product, status: "Sold out" };
          } else {
            return { ...product };
          }
        });

        res.send(processedResult);
      }
    }
  );
});
// statistics in Dashboard of categories of All Product
app.get("/api/products/categories/statistics", (req, res) => {
  db.query(
    ` 
    SELECT category as name, COUNT(category) AS value
FROM produit
GROUP BY category;`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/api/interface/products/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_collection ON produit.id = produit_collection.produit_id JOIN collection ON produit_collection.collection_id = collection.id WHERE  produit.hiden = '0' and produit.out_stock = '1' and produit.id = ? GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const processedResult = result.map((product) => {
          // Parse the qty field
          let qtyArray;
          try {
            qtyArray = JSON.parse(product.qty);
          } catch (e) {
            console.error(`Failed to parse qty for product ${product.id}:`, e);
            qtyArray = [];
          }

          if (Array.isArray(qtyArray) && qtyArray.every((qty) => qty === "0")) {
            return { ...product, status: "Sold out" };
          } else {
            return { ...product };
          }
        });

        res.send(processedResult);
      }
    }
  );
});

app.get("/api/interface/products/filtered/:name", (req, res) => {
  const name = req.params.name;
  console.log(name);
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_collection ON produit.id = produit_collection.prd_id JOIN collection ON produit_collection.collection_id = collection.id WHERE  produit.hiden = '0' and produit.out_stock = '1' and produit.name_by_filtered = ? GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    [name],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const processedResult = result.map((product) => {
          // Parse the qty field
          let qtyArray;
          try {
            qtyArray = JSON.parse(product.qty);
          } catch (e) {
            console.error(`Failed to parse qty for product ${product.id}:`, e);
            qtyArray = [];
          }

          if (Array.isArray(qtyArray) && qtyArray.every((qty) => qty === "0")) {
            return { ...product, status: "Sold out" };
          } else {
            return { ...product };
          }
        });

        res.send(processedResult);
      }
    }
  );
});
//Alls Products By Priority and Not Hiden
app.get("/api/product_group/:id", (req, res) => {
  const prod_id = req.params.id;

  db.query(
    `SELECT produit.id AS id, produit.*, GROUP_CONCAT(collection.name ORDER BY collection.name ASC SEPARATOR ', ') AS category_names
     FROM produit
     JOIN produit_collection ON produit.id = produit_collection.prd_id
     JOIN collection ON produit_collection.collection_id = collection.id
     JOIN product_group ON produit.id = product_group.product_id
     WHERE produit.hiden = '0' AND produit.out_stock = '1'
       AND produit.id IN (
         SELECT product_id 
         FROM product_group 
         WHERE group_id = (
           SELECT group_id 
           FROM product_group 
           WHERE product_id = ?
           LIMIT 1
         ) 
         AND product_id <> ?
       )
     GROUP BY produit.id, produit.name, produit.price, produit.qty;`,
    [prod_id, prod_id], // Use the product ID from the URL
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred.");
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/api/product_group", (req, res) => {
  db.query(
    `SELECT groupes.id AS group_id, groupes.name AS group_name, 
            GROUP_CONCAT(DISTINCT CONCAT(produit.id, '|', produit.name) ORDER BY produit.id ASC SEPARATOR ',') AS product_info
     FROM groupes
     LEFT JOIN product_group ON groupes.id = product_group.group_id
     LEFT JOIN produit ON product_group.product_id = produit.id AND produit.hiden = '0' AND produit.out_stock = '1'
     GROUP BY groupes.id, groupes.name
     ORDER BY groupes.name ASC;`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred.");
      } else {
        // Convert the concatenated product_info into separate arrays
        const processedResult = result.map((group) => {
          if (group.product_info) {
            const productDetails = group.product_info
              .split(",")
              .map((item) => item.split("|"));
            return {
              ...group,
              product_ids: productDetails.map(([id]) => id),
              product_names: productDetails.map(([, name]) => name),
            };
          } else {
            return {
              ...group,
              product_ids: [],
              product_names: [],
            };
          }
        });
        res.send(processedResult);
      }
    }
  );
});

// DELETE route to remove the relationship between a groupe and a product
app.delete("/api/groupe/:groupeId/:productId", (req, res) => {
  const { groupeId, productId } = req.params;

  // SQL query to delete the relationship between a groupe and a product
  const query = `
    DELETE FROM product_group 
    WHERE group_id = ? AND product_id = ?
  `;

  db.query(query, [groupeId, productId], (err, result) => {
    if (err) {
      console.error("Error deleting relation:", err);
      res.status(500).json({ message: "Error deleting relation" });
    } else if (result.affectedRows > 0) {
      res.status(200).json({ message: "Relation successfully deleted" });
    } else {
      res.status(404).json({ message: "No relation found" });
    }
  });
});
//delete a product
app.post("/api/product/:id", (req, res) => {
  const id = req.params.id;
  const { image, images } = req.body;
  console.log(req.body);
  const key_image = image.split(process.env.DO_SPACE_ENDPOINT + "/")[1];
  console.log("image:", image, "key:", key_image);

  s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET,
      Key: key_image,
    })
  );

  const array_images = JSON.parse(images);
  console.log(array_images);

  db.query("DELETE FROM produit WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });

  for (i = 0; i < array_images.length; i++) {
    const key_images = array_images[i].split(
      process.env.DO_SPACE_ENDPOINT + "/"
    )[1];
    console.log("key_images:" + key_images);

    s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.DO_SPACE_BUCKET,
        Key: key_images,
      })
    );
  }
});
// delete image from file and change array in database table produit to another array sended

app.put("/api/images/:id", (req, res) => {
  const id = req.params.id;
  const image_name = req.body.image_name;
  const images = req.body.images;
  const key = image_name.split(process.env.DO_SPACE_ENDPOINT + "/")[1];

  console.log("image:", image_name, "images:", images, "key:", key);
  const params = {
    Bucket: process.env.DO_SPACE_BUCKET,
    Key: key,
  };
  s3.send(new DeleteObjectCommand(params));

  db.query(
    `update produit set images = ? WHERE id = ?`,
    [images, id],
    (err, result, fields) => {
      if (err) {
        console.log(err);
      } else {
        res.send("data inserted");
      }
    }
  );
});

//add image in array in mysql database produit and in file public/images

app.put(
  "/api/image/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const id = req.params.id;
    const imageFile = req.files?.image?.[0]; // Single image
    const imageUrl = imageFile ? await uploadImage(imageFile, "images") : null;

    const array = JSON.parse(req.body.images);
    array.push(imageUrl);
    const images = JSON.stringify(array);
    console.log(images);
    db.query(
      `update produit set images = ? WHERE id = ?`,
      [images, id],
      (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          res.send("data inserted");
          console.log(result);
        }
      }
    );
  }
);

//Out Of Stock
app.patch("/api/hiden_in_stock/:id", (req, res) => {
  const id = req.params.id;
  const hiden = req.body.hiden_in_stock;
  db.query(
    `update produit set hiden = ? WHERE id = ?`,
    [hiden, id],
    (err, result, fields) => {
      if (err) {
        console.log(err);
      } else {
        res.send("data inserted");
      }
    }
  );
});
//Alls Products By Priority and Hiden
app.get("/api/hiden_in_stock", (req, res) => {
  db.query(
    "SELECT * FROM produit where out_stock = '1' and hiden = '1' ORDER BY priority",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
//categories Crud:
app.get("/api/categories", (req, res) => {
  const query = `
    SELECT 
      c.id as id,
      c.name AS name, 
      c.image AS image, 
      c.meta_image AS meta_image, 
      c.meta_description AS meta_description, 
      col.name AS collection_name ,
      c.collect_id as collect_id
    FROM 
      categorie c 
    JOIN 
      collection col 
    ON 
      c.collect_id = col.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err); // Send error response
    } else {
      res.send(results); // Send the result set
    }
  });
});

app.post(
  "/api/create-category",
  upload.single("image_category"),
  async (req, res) => {
    const imageFile = req.file || null;
    console.log(req.body);

    const meta_image = req.body.meta_image_category;
    const meta_description = req.body.meta_image_descrition;
    const name_category = req.body.name_category;
    const collectionId = req.body.collection_id;
    const image = imageFile
      ? await uploadImage(imageFile, "collections")
      : null;

    db.query(
      `insert into categorie(name,image,meta_image,meta_description,collect_id) values(?,?,?,?,?)`,
      [name_category, image, meta_image, meta_description, collectionId],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send(err); // Send error response
        } else {
          // Construct the custom object with the inserted ID
          const responseObject = {
            id: result.insertId, // Add the inserted ID here
            name: name_category,
            image: image, // Adjust the path as needed
            meta_image: meta_image,
            meta_description: meta_description,
          };
          res.send(responseObject); // Send the custom object
        }
      }
    );
  }
);

app.put(
  "/api/update-categorie/:id",
  upload.single("image_category"),
  async (req, res) => {
    const id = req.params.id; // Category ID from params
    const {
      upload_image,
      oldimage,
      name,
      meta_image,
      meta_description,
      collection_id,
    } = req.body; // Destructure request body

    // Update the category fields in the database
    db.query(
      `UPDATE categorie SET name = ?, meta_image = ?, meta_description = ?, collect_id = ? WHERE id = ?`,
      [name, meta_image, meta_description, collection_id, id],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error updating category");
        }

        // If an image is being updated
        if (upload_image === "true" && req.file) {
          try {
            const imageUrl = await uploadImage(req.file, "collections");

            // Delete the old image if it exists
            if (oldimage) {
              const key = oldimage.split(
                `${process.env.DO_SPACE_ENDPOINT}/`
              )[1];
              await s3.send(
                new DeleteObjectCommand({
                  Bucket: process.env.DO_SPACE_BUCKET,
                  Key: key,
                })
              );
            }

            // Update the image field in the database
            db.query(
              `UPDATE categorie SET image = ? WHERE id = ?`,
              [imageUrl, id],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send("Error updating category image");
                }

                // Fetch and return the updated category
                db.query(
                  `SELECT 
                      c.id as id,
                      c.name AS name, 
                      c.image AS image, 
                      c.meta_image AS meta_image, 
                      c.meta_description AS meta_description, 
                      col.name AS collection_name,
                      c.collect_id as collect_id
                    FROM 
                      categorie c 
                    JOIN 
                      collection col 
                    ON 
                      c.collect_id = col.id 
                    WHERE c.id= ?`,
                  [id],
                  (err, updatedCategory) => {
                    if (err) {
                      console.log(err);
                      return res
                        .status(500)
                        .send("Error fetching updated category");
                    }
                    res.status(200).send(updatedCategory[0]); // Send the updated category
                  }
                );
              }
            );
          } catch (uploadErr) {
            console.log(uploadErr);
            return res
              .status(500)
              .send(`Error uploading image: ${uploadErr.message}`);
          }
        } else {
          // No image update, just return the updated category
          db.query(
            `SELECT 
                c.id as id,
                c.name AS name, 
                c.image AS image, 
                c.meta_image AS meta_image, 
                c.meta_description AS meta_description, 
                col.name AS collection_name,
                c.collect_id as collect_id
              FROM 
                categorie c 
              JOIN 
                collection col 
              ON 
                c.collect_id = col.id 
              WHERE c.id= ?`,
            [id],
            (err, updatedCategory) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Error fetching updated category");
              }
              res.status(200).send(updatedCategory[0]); // Send the updated category
            }
          );
        }
      }
    );
  }
);

app.put(
  "/api/update-collection/:id",
  upload.single("image_category"),
  async (req, res) => {
    const id = req.params.id;
    const upload_image = req.body.upload_image;
    const oldimage = req.body.oldimage;
    const name = req.body.name;
    const meta_image = req.body.meta_image;
    const meta_description = req.body.meta_description;

    try {
      // Update the collection fields in the database
      await db.query(
        `UPDATE collection SET name = ?, meta_image = ?, meta_description = ? WHERE id = ?`,
        [name, meta_image, meta_description, id]
      );

      // If an image is being updated
      if (upload_image === "true" && req.file) {
        const imageFile = req.file; // Single image
        const imageUrl = await uploadImage(imageFile, "collections");
        const key = oldimage.split(process.env.DO_SPACE_ENDPOINT + "/")[1];

        const params = {
          Bucket: process.env.DO_SPACE_BUCKET,
          Key: key,
        };

        // Delete the old image
        await s3.deleteObject(params).promise();

        // Update the image field in the database
        await db.query(`UPDATE collection SET image = ? WHERE id = ?`, [
          imageUrl,
          id,
        ]);
      }

      // Respond with the updated collection data
      const updatedCollection = await db.query(
        `SELECT * FROM collection WHERE id = ?`,
        [id]
      );

      // Ensure the result is an array and send the first item
      if (Array.isArray(updatedCollection) && updatedCollection.length > 0) {
        res.status(200).send(updatedCollection[0]); // Send the updated collection
      } else {
        res.status(404).send("Collection not found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating collection");
    }
  }
);

//delete a category
app.post("/api/categorie_collection/:id", async (req, res) => {
  const id = req.params.id;
  const { image } = req.body;
  console.log(id);

  db.query("DELETE FROM categorie WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
  const key = image.split(process.env.DO_SPACE_ENDPOINT + "/")[1];

  // Delete old image from S3
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET,
      Key: key,
    })
  );
});
// Assuming you have a connection to your MySQL database (e.g., using `mysql2` or `sequelize`)

// Express.js Route
app.get("/api/interface/category/:name", async (req, res) => {
  const categoryName = req.params.name;
  const query = `
    SELECT c.*,c.image as category_image, p.*
    FROM collection c
    INNER JOIN produit_collection pc ON c.id = pc.collection_id
    INNER JOIN produit p ON pc.prd_id = p.id
    WHERE c.name = ?
  `;

  db.query(query, [categoryName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    } else {
      const processedResult = results.map((product) => {
        // Parse the qty field
        let qtyArray;
        try {
          qtyArray = JSON.parse(product.qty);
        } catch (e) {
          console.error(`Failed to parse qty for product ${product.id}:`, e);
          qtyArray = [];
        }

        if (Array.isArray(qtyArray) && qtyArray.every((qty) => qty === "0")) {
          return { ...product, status: "Sold out" };
        } else {
          return { ...product };
        }
      });

      res.send(processedResult);
    }
  });
});
// Get Genre By: homme,femme,enfant of Products
// Route to get products by genre
app.get("/api/interface/genre/:genre", (req, res) => {
  const genre = req.params.genre;
  // SQL query to fetch products by genre
  const query = `
    SELECT * FROM produit
    WHERE genre LIKE ? OR genre LIKE ?;
  `;

  // Reverse the genre in case of different order (e.g., 'homme, femme' or 'femme, homme')
  const genresReversed = genre.split(", ").reverse().join(", ");

  // Execute the query
  db.query(query, [`%${genre}%`, `%${genresReversed}%`], (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching products by genre");
    } else {
      const processedResult = results.map((product) => {
        // Parse the qty field
        let qtyArray;
        try {
          qtyArray = JSON.parse(product.qty);
        } catch (e) {
          console.error(`Failed to parse qty for product ${product.id}:`, e);
          qtyArray = [];
        }

        if (Array.isArray(qtyArray) && qtyArray.every((qty) => qty === "0")) {
          return { ...product, status: "Sold out" };
        } else {
          return { ...product };
        }
      });

      res.send(processedResult);
    }
  });
});
app.delete("/api/categorie/:produit_id/:categoryName", (req, res) => {
  const { produit_id, categoryName } = req.params;

  // First, get the category information from the 'categorie' table by categoryName
  db.query(
    "SELECT id FROM collection WHERE name = ?",
    [categoryName],
    (err, categoryResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error fetching category information");
      }

      if (categoryResult.length > 0) {
        const categorie_id = categoryResult[0].id;

        // If category is found, proceed with deleting the entry from 'produit_categorie'
        db.query(
          "DELETE FROM produit_collection WHERE prd_id = ? AND collection_id = ?",
          [produit_id, categorie_id],
          (deleteErr, deleteResult) => {
            if (deleteErr) {
              console.log(deleteErr);
              return res.status(500).send("Error deleting category");
            }
            res.send({ message: "Category deleted", result: deleteResult });
          }
        );
      } else {
        res.status(404).send("Category not found");
      }
    }
  );
});

//collections Crud:
app.get("/api/collections", (req, res) => {
  db.query("SELECT * FROM collection ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.post(
  "/api/create-collection",
  upload.single("image_category"),
  async (req, res) => {
    const imageFile = req.file; // Single image

    console.log(req.body);
    // Upload single image if available
    const imageUrl = imageFile
      ? await uploadImage(imageFile, "collections")
      : null;
    const meta_image = req.body.meta_image_category;
    const meta_description = req.body.meta_image_description;
    const name_category = req.body.name_category;

    db.query(
      `INSERT INTO collection(name, image, meta_image, meta_description) VALUES (?, ?, ?, ?)`,
      [name_category, imageUrl, meta_image, meta_description],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send(err); // Send error response
        } else {
          res.send(result);
        }
      }
    );
  }
);

app.put(
  "/api/update-colection/:id",
  upload.single("image_category"),
  async (req, res) => {
    const id = req.params.id;
    const upload_image = req.body.upload_image;
    const oldimage = req.body.oldimage;
    const name = req.body.name;
    const meta_image = req.body.meta_image;
    const meta_description = req.body.meta_description;

    db.query(
      `UPDATE collection SET name = ?, meta_image = ?,meta_description = ? WHERE id = ?`,
      [name, meta_image, meta_description, id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        // Handle image upload if necessary
        const uploadImageBoolean = upload_image === "true";
        if (uploadImageBoolean) {
          console.log("hamiiiiiiiid");

          console.log(req.file); // Access the uploaded file

          if (req.file) {
            const imageFile = req.file; // Single image

            const imageUrl = imageFile
              ? uploadImage(imageFile, "collections")
              : null;
            const key = oldimage.split(process.env.DO_SPACE_ENDPOINT + "/")[1];

            console.log("image:", oldimage, "key:", key);
            const params = {
              Bucket: process.env.DO_SPACE_BUCKET,
              Key: key,
            };

            s3.deleteObject(params, (err, data) => {
              if (err) {
                return res.status(500).send(err);
              }
            });

            db.query(
              `UPDATE collection SET image = ? WHERE id = ?`,
              [imageUrl, id],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send(err);
                }
                res.send(result);
              }
            );
          } else {
            console.log("File not found in request");
            return res.status(400).send("File not found in request");
          }
        } else {
          res.send(result);
        }
      }
    );
  }
);
app.post("/api/add-products-to-collections", async (req, res) => {
  const { prd_ids, collection_ids } = req.body;
  console.log(req.body);
  if (!prd_ids || !collection_ids) {
    return res
      .status(400)
      .json({ message: "Product and Collection IDs are required" });
  }

  try {
    // Insert each combination of product and collection into the product_collection table
    for (const prd_id of prd_ids) {
      for (const collection_id of collection_ids) {
        await db.query(
          "INSERT INTO produit_collection (prd_id, collection_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE prd_id = prd_id",
          [prd_id, collection_id]
        );
      }
    }

    res
      .status(200)
      .json({ message: "Products added to collections successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
//delete a category
app.post("/api/collection/:id", (req, res) => {
  const id = req.params.id;
  const { image } = req.body;
  console.log(req.body);

  const imagePath = path.join(__dirname, "public/categories");

  db.query("DELETE FROM collection WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
  const imagePathToDelete = path.join(imagePath, image);
  console.log(imagePathToDelete);
  // Check if the file exists
  fs.access(imagePathToDelete, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist
      console.log("error image deleted !!");
    }

    // Delete the file
    fs.unlink(imagePathToDelete, () => {
      console.log("deleted Image!!");
    });
  });
});
app.get("/api/interface/collection/:name", async (req, res) => {
  const categoryName = req.params.name;
  const query = `
    SELECT c.*,c.image as category_image, p.*
    FROM collection c
    INNER JOIN produit_collection pc ON c.id = pc.collection_id
    INNER JOIN produit p ON pc.prd_id = p.id
    WHERE c.name = ?
  `;

  db.query(query, [categoryName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Send the results as the response
    res.json(results);
  });
});

app.delete("/api/collection/:produit_id/:categoryName", (req, res) => {
  const { produit_id, categoryName } = req.params;

  // First, get the category information from the 'categorie' table by categoryName
  db.query(
    "SELECT id FROM collection WHERE name = ?",
    [categoryName],
    (err, categoryResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error fetching collection information");
      }

      if (categoryResult.length > 0) {
        const categorie_id = categoryResult[0].id;

        // If category is found, proceed with deleting the entry from 'produit_categorie'
        db.query(
          "DELETE FROM produit_collection WHERE prd_id = ? AND collection_id = ?",
          [produit_id, categorie_id],
          (deleteErr, deleteResult) => {
            if (deleteErr) {
              console.log(deleteErr);
              return res.status(500).send("Error deleting category");
            }
            res.send({ message: "Collection deleted", result: deleteResult });
          }
        );
      } else {
        res.status(404).send("Collection not found");
      }
    }
  );
});

//blog Crud:
app.get("/api/blogs", (req, res) => {
  const query = `
    SELECT blog.*, collection.name 
    FROM blog
    JOIN collection ON blog.categorie_blog_id = collection.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});
app.post("/api/create-blog", upload.single("image_blog"), async (req, res) => {
  const imageFile = req.file;
  const { meta_image_blog, title, description, categoryId, date_creation } =
    req.body;
  const imageUrl = imageFile ? await uploadImage(imageFile, "blogs") : null;

  db.query(
    `insert into blog(title,image,description,meta_image,date_created,categorie_blog_id) values(?,?,?,?,?,?)`,
    [title, imageUrl, description, meta_image_blog, date_creation, categoryId],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send(err); // Send error response
      } else {
        res.send(result);
      }
    }
  );
});
app.put("/api/update-blog/:id", upload.single("image_blog"), (req, res) => {
  const imagePath = path.join(__dirname, "public/blog");
  const id = req.params.id;
  const {
    upload_image,
    oldimage,
    title,
    description,
    meta_image,
    collection_id,
    date_created,
  } = req.body;

  // First, update the blog data (excluding the image)
  db.query(
    `UPDATE blog SET title = ?, description = ?, meta_image = ?, date_created = ?, categorie_blog_id = ? WHERE id = ?`,
    [title, description, meta_image, date_created, collection_id, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      // If the image needs to be updated
      //   if (upload_image === "true" && req.file) {
      //     const image = req.file.filename;
      //     const imagePathToDelete = path.join(imagePath, oldimage);

      //     // Delete the old image
      //     fs.access(imagePathToDelete, fs.constants.F_OK, (err) => {
      //       if (!err) {
      //         fs.unlink(imagePathToDelete, () => {
      //           console.log("Deleted old image");
      //         });
      //       }
      //     });

      //     // Update the blog image
      //     db.query(
      //       `UPDATE blog SET image = ? WHERE id = ?`,
      //       [image, id],
      //       (err, result) => {
      //         if (err) {
      //           console.log(err);
      //           return res.status(500).send(err);
      //         }

      //         // After updating the image, fetch the updated blog to return it
      //         db.query(
      //           `SELECT blog.*, collection.name
      // FROM blog
      // JOIN collection ON blog.categorie_blog_id = collection.id where blog.id = ?`,
      //           [id],
      //           (err, updatedBlog) => {
      //             if (err) {
      //               console.log(err);
      //               return res.status(500).send(err);
      //             }
      //             res.json(updatedBlog[0]); // Return the updated blog data
      //           }
      //         );
      //       }
      //     );
      //   }
      if (req.file) {
        const imageFile = req.file; // Single image

        const imageUrl = imageFile ? uploadImage(imageFile, "blogs") : null;
        const key = oldimage.split(process.env.DO_SPACE_ENDPOINT + "/")[1];

        console.log("image:", oldimage, "key:", key);
        const params = {
          Bucket: process.env.DO_SPACE_BUCKET,
          Key: key,
        };

        s3.deleteObject(params, (err, data) => {
          if (err) {
            return res.status(500).send(err);
          }
        });

        db.query(
          `UPDATE blog SET image = ? WHERE id = ?`,
          [imageUrl, id],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            }
            // After updating the image, fetch the updated blog to return it
            db.query(
              `SELECT blog.*, collection.name
            FROM blog
            JOIN collection ON blog.categorie_blog_id = collection.id where blog.id = ?`,
              [id],
              (err, updatedBlog) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send(err);
                }
                res.json(updatedBlog[0]); // Return the updated blog data
              }
            );
          }
        );
      } else {
        // If no image update is needed, return the updated blog directly
        db.query(
          ` SELECT blog.*, collection.name 
    FROM blog
    JOIN collection ON blog.categorie_blog_id = collection.id where blog.id = ?`,
          [id],
          (err, updatedBlog) => {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            }
            res.json(updatedBlog[0]); // Return the updated blog data
          }
        );
      }
    }
  );
});

//delete a blog
app.post("/api/blog/:id", async (req, res) => {
  const id = req.params.id;
  const { image } = req.body;
  console.log(req.body);

  db.query("DELETE FROM blog WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
  const key = image.split(process.env.DO_SPACE_ENDPOINT + "/")[1];

  // Delete old image from S3
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.DO_SPACE_BUCKET,
      Key: key,
    })
  );
});

app.listen(port, () => {
  console.log("server is running ...");
});
