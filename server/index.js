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
    if (file.fieldname === "image_category") {
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
    const status = req.body.status;
    const genre = req.body.genre;
    const size_shoes = req.body.size_shoes;
    const meta_image = req.body.meta_image;
    const nom = req.body.nom;
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
      `insert into produit(name,price,price_promo,status,description,nemuro_shoes,image,meta_image,out_stock,hiden,images,meta_images,qty,genre) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        nom,
        prix,
        prix_promo,
        status,
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
      ],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send(err); // Send error response
        } else {
          const PrID = result.insertId;
          if (categories.length > 0) {
            console.log("id", PrID, "categories", categories[0].id);
            for (i = 0; i < req.body.categories.length - 1; i++) {
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
    const nom = req.body.nom;
    const prix = req.body.prix;
    const prix_promo = req.body.prix_promo;
    const description = req.body.description;
    const out_of_stock = parseInt(req.body.out_of_stock);
    db.query(
      `update produit set name = ?,price = ?,price_promo = ?,category = ?,description = ?,out_stock = ? WHERE id = ?`,
      [nom, prix, prix_promo, category, description, out_of_stock, id],
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
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id WHERE  produit.hiden = '0' GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      //SELECT
      //     product.id AS product_id,
      //     product.name_prod AS product_name,
      //     product.price,
      //     product.quantity,
      //     GROUP_CONCAT(category.name ORDER BY category.name ASC SEPARATOR ', ') AS category_names
      // FROM
      //     product
      // JOIN
      //     product_category ON product.id = product_category.product_id
      // JOIN
      //     category ON product_category.category_id = category.id
      // GROUP BY
      //     product.id, product.name_prod, product.price, product.quantity;
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//Alls Products By Priority and Not Hiden
app.get("/api/interface/products", (req, res) => {
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id JOIN product_group ON produit.id=product_group.product_id WHERE  produit.hiden = '0' and produit.out_stock = '1' GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
//Alls Products By Priority and Not Hiden AND Promotion (collection/on-sale page in Next js)
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

app.get("/api/interface/products/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT produit.id AS id,produit.*, GROUP_CONCAT(categorie.name ORDER BY categorie.name ASC SEPARATOR ', ') AS category_names  FROM produit JOIN produit_categorie ON produit.id = produit_categorie.produit_id JOIN categorie ON produit_categorie.categorie_id = categorie.id WHERE  produit.hiden = '0' and produit.out_stock = '1' and produit.id = ? GROUP BY produit.id, produit.name, produit.price, produit.qty;",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
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
app.listen(port, () => {
  console.log("server is running ...");
});
