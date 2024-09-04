const express = require("express");
const cors = require("cors");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const nodemailer = require("nodemailer");
const { checkToken } = require("./auth/token_validation");

const multer = require("multer");

const app = express();

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
// storage for images
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     const originalName = file.originalname;
//     const extension = originalName.split(".").pop(); // Extract extension
//     cb(null, `${Date.now()}.${extension}`);
//   },
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file.fieldname);
    if (file.fieldname === "image_blog") {
      cb(null, "public/blogs");
    } else if (file.fieldname === "image_category") {
      cb(null, "public/categories");
    } else cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop(); // Extract extension
    cb(null, `${Date.now()}.${extension}`);
  },
});
const upload = multer({
  storage: storage,
});

const port = process.env.PORT || 5000;
app.use("/api/users", userRouter);
app.use("/api/groupes", groupRouter);
app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/coins", coinRouter);
app.use("/api/sales", saleRouter);

// Endpoint to handle order creation
app.post("/create-order", (req, res) => {
  const orderData = req.body;

  // Send email
  sendOrderEmail(orderData)
    .then(() => {
      res.status(200).send("Order created and email sent successfully!");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error creating order or sending email.");
    });
});

async function sendOrderEmail(orderData) {
  console.log("hamiiiiid");
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
    from: "nabilmouami353@gmail.com", // Replace with your email
    to: "bill.mou33@gmail.com", // Replace with recipient email
    subject: "New Order Created",
    text: `New order details:\n\n${JSON.stringify(orderData, null, 2)}`,
  };

  await transporter.sendMail(mailOptions);
}

app.post("/send-order-email", (req, res) => {
  const { customerName, orderId, totalPrice } = req.body;
  console.log("hamiiiiid");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "nabilmouami353@gmail.com", // Replace with your email
      pass: "ujrj njvo atqw tsml", // Replace with your email password
    },
  });
  const templatePath = path.join(
    __dirname,
    "emailTemplate",
    "orderEmailTemplate.hbs"
  );

  fs.readFile(templatePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error reading template file" });
    }

    // Compile the template with Handlebars
    const template = handlebars.compile(data);
    const html = template({ customerName, orderId, totalPrice });

    // Set up email options
    const mailOptions = {
      from: "nabilmouami353@gmail.com", // Replace with your email
      to: "bill.mou33@gmail.com", // Replace with recipient email
      subject: "New Order Created",
      html: html,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ message: "Error sending email", error });
      }
      res.status(200).send({ message: "Email sent successfully", info });
    });
  });
});

app.post(
  "/api/create-prod",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  (req, res) => {
    const image = req.files?.image?.[0]?.filename || null;
    const genre = req.body.genre;
    const status_model = req.body.status;
    const size_shoes = req.body.size_shoes;
    const meta_image = req.body.meta_image;
    const nom = req.body.nom;
    const category = req.body.category;
    const prix = req.body.prix;
    let prix_promo = req.body.prix_promo;
    const qty = req.body.size_quantity;
    let categories = req.body.categories;
    // Convert prix_promo to null if it's an empty string
    prix_promo = prix_promo === "" ? 0 : prix_promo;

    const description = req.body.description;
    const images = (req.files.images || [])
      .filter((file) => file && file.filename)
      .map((item) => item.filename);
    const firstTableString = JSON.stringify(images);

    // Log the entire request body to inspect it
    console.log("Request Body:", req.body);

    // Check if categories is an array
    if (!Array.isArray(categories)) {
      try {
        categories = JSON.parse(categories);
      } catch (e) {
        console.log("Failed to parse categories:", categories);
        categories = [];
      }
    }

    db.query(
      `insert into produit(name,category,price,price_promo,description,nemuro_shoes,image,meta_image,out_stock,hiden,images,meta_images,qty,genre,status_model) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        nom,
        category,
        prix,
        prix_promo,
        description,
        size_shoes,
        image,
        meta_image,
        1,
        0,
        firstTableString,
        firstTableString,
        qty,
        genre,
        status_model,
      ],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send(err); // Send error response
        } else {
          const PrID = result.insertId;
          if (categories.length > 0) {
            console.log("Categories:", categories);
            for (i = 0; i < categories.length; i++) {
              db.query(
                "INSERT INTO  produit_categorie(produit_id,categorie_id) VALUES (?,?)",
                [PrID, categories[i]?.id],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }
            res.send("Values Inserted");
          } else {
            console.log("id", PrID, "categories are empty or undefined");
          }
        }
      }
    );
  }
);

app.put(
  "/api/update-prod/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  (req, res) => {
    const imagePath = path.join(__dirname, "public/images");

    const id = req.params.id;
    const upload_image = req.body.upload_image;
    const oldimage = req.body.oldimage;

    const category = req.body.category;
    const category_produit = req.body.category.join(", ");
    const changed_category = req.body.changed_category;
    const nom = req.body.nom;
    const prix = req.body.prix;
    const prix_promo = req.body.prix_promo;
    const description = req.body.description;
    const out_of_stock = parseInt(req.body.out_of_stock);
    db.query(
      `update produit set name = ?,price = ?,price_promo = ?,category = ?,description = ?,out_stock = ? WHERE id = ?`,
      [nom, prix, prix_promo, category_produit, description, out_of_stock, id],
      (err, result, fields) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
    // if changed image principal of product;
    const uploadImageBoolean = upload_image === "true";
    if (uploadImageBoolean) {
      console.log("hamiiiiiiiid");
      const image = req?.files?.image[0]?.filename;
      const imagePathToDelete = path.join(imagePath, oldimage);
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
      db.query(
        `update produit set image = ? WHERE id = ?`,
        [image, id],
        (err, result, fields) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        }
      );
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
    "SELECT produit.id AS id, produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id WHERE produit.hiden = '0' GROUP BY produit.id, produit.name, produit.price, produit.qty;",
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
    "SELECT produit.id AS id, produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id WHERE produit.hiden = '0' GROUP BY produit.id, produit.name, produit.price, produit.qty;",
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
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id WHERE  produit.hiden = '0'  AND produit.price_promo != 0  GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
//Alls Products By Status_Model is Release and Not Hiden  (FirstPage Home Body in Next js)

app.get("/api/products/release", (req, res) => {
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id WHERE  produit.hiden = '0'  AND produit.status_model = 'release'  GROUP BY produit.id, produit.name, produit.price, produit.qty;",
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
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id WHERE  produit.hiden = '0'  AND produit.status_model = 'new'  GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
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
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id WHERE  produit.hiden = '0' and produit.out_stock = '1' and produit.id = ? GROUP BY produit.id, produit.name, produit.price, produit.qty;",
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
//Alls Products By Priority and Not Hiden
app.get("/api/product_group/:id", (req, res) => {
  const prod_id = req.params.id;
  db.query(
    `SELECT produit.id AS id, produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names  
   FROM produit 
   JOIN produit_categorie ON produit.id = produit_categorie.produit_id 
   JOIN categorie ON produit_categorie.categorie_id = categorie.id 
   JOIN product_group ON produit.id = product_group.product_id 
   WHERE produit.hiden = '0' AND produit.out_stock = '1' 
     AND produit.id IN (
       SELECT product_id
       FROM product_group
       WHERE group_id = (
         SELECT group_id
         FROM product_group
         WHERE product_id = ?
       )
       AND product_id <> ?
     )
   GROUP BY produit.id, produit.name, produit.price, produit.qty;`,
    [prod_id, prod_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//delete a product
app.post("/api/product/:id", (req, res) => {
  const id = req.params.id;
  const { image, images } = req.body;
  console.log(req.body);

  const array_images = JSON.parse(images);

  const imagePath = path.join(__dirname, "public/images");

  db.query("DELETE FROM produit WHERE id = ?", [id], (err, result) => {
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
  for (i = 0; i < array_images.length; i++) {
    const imagePathToDelete = path.join(imagePath, array_images[i]);
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
  }
});
// delete image from file and change array in database table produit to another array sended

app.put("/api/images/:id", (req, res) => {
  const id = req.params.id;
  const image_name = req.body.image_name;
  const images = req.body.images;

  const imagePath = path.join(__dirname, "public/images");

  const imagePathToDelete = path.join(imagePath, image_name);
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
  (req, res) => {
    const id = req.params.id;

    const image = req?.files?.image[0]?.filename;
    const array = JSON.parse(req.body.images);
    array.push(image);
    const images = JSON.stringify(array);
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
  db.query("SELECT * FROM categorie ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.post(
  "/api/create-category",
  upload.single("image_category"),
  (req, res) => {
    const image = req.file?.filename || null;
    console.log(req.body);
    console.log(image);

    const meta_image = req.body.meta_image_category;
    const name_category = req.body.name_category;

    db.query(
      `insert into categorie(name,image,meta_image) values(?,?,?)`,
      [name_category, image, meta_image],
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
  "/api/update-categorie/:id",
  upload.single("image_category"),
  (req, res) => {
    const imagePath = path.join(__dirname, "public/categories");

    const id = req.params.id;
    const upload_image = req.body.upload_image;
    const oldimage = req.body.oldimage;
    const name = req.body.name;
    const meta_image = req.body.meta_image;

    db.query(
      `UPDATE categorie SET name = ?, meta_image = ? WHERE id = ?`,
      [name, meta_image, id],
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
            const image = req.file.filename;
            const imagePathToDelete = path.join(imagePath, oldimage);

            console.log(imagePathToDelete);
            // Check if the file exists and delete it
            fs.access(imagePathToDelete, fs.constants.F_OK, (err) => {
              if (err) {
                console.log("error image deleted !!");
              } else {
                fs.unlink(imagePathToDelete, () => {
                  console.log("deleted Image!!");
                });
              }
            });

            db.query(
              `UPDATE categorie SET image = ? WHERE id = ?`,
              [image, id],
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

//delete a category
app.post("/api/categorie/:id", (req, res) => {
  const id = req.params.id;
  const { image } = req.body;
  console.log(req.body);

  const imagePath = path.join(__dirname, "public/categories");

  db.query("DELETE FROM categorie WHERE id = ?", [id], (err, result) => {
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

app.delete("/api/categorie/:produit_id/:categoryName", (req, res) => {
  const { produit_id, categoryName } = req.params;

  // First, get the category information from the 'categorie' table by categoryName
  db.query(
    "SELECT id FROM categorie WHERE name = ?",
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
          "DELETE FROM produit_categorie WHERE produit_id = ? AND categorie_id = ?",
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

//blog Crud:
app.get("/api/blogs", (req, res) => {
  db.query("SELECT * FROM blog ", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.post("/api/create-blog", upload.single("image_blog"), (req, res) => {
  const image = req.file?.filename || null;
  console.log(image);
  const { meta_image_blog, title, description, categoryId, date_creation } =
    req.body;

  db.query(
    `insert into blog(title,image,description,meta_image,date_created,categorie_blog_id) values(?,?,?,?,?,?)`,
    [title, image, description, meta_image_blog, date_creation, categoryId],
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
app.put(
  "/api/update-categorie/:id",
  upload.single("image_blog"),
  (req, res) => {
    const imagePath = path.join(__dirname, "public/blog");

    const id = req.params.id;
    const upload_image = req.body.upload_image;
    const oldimage = req.body.oldimage;
    const name = req.body.name;
    const meta_image = req.body.meta_image;

    db.query(
      `UPDATE blog SET title = ?, meta_image = ? WHERE id = ?`,
      [name, meta_image, id],
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
            const image = req.file.filename;
            const imagePathToDelete = path.join(imagePath, oldimage);

            console.log(imagePathToDelete);
            // Check if the file exists and delete it
            fs.access(imagePathToDelete, fs.constants.F_OK, (err) => {
              if (err) {
                console.log("error image deleted !!");
              } else {
                fs.unlink(imagePathToDelete, () => {
                  console.log("deleted Image!!");
                });
              }
            });

            db.query(
              `UPDATE blog SET image = ? WHERE id = ?`,
              [image, id],
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

//delete a blog
app.post("/api/blog/:id", (req, res) => {
  const id = req.params.id;
  const { image } = req.body;
  console.log(req.body);

  const imagePath = path.join(__dirname, "public/blogs");

  db.query("DELETE FROM blog WHERE id = ?", [id], (err, result) => {
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

app.listen(port, () => {
  console.log("server is running ...");
});
