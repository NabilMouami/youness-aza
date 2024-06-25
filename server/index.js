const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const multer = require("multer");

const app = express();

const db = require("./config/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const userRouter = require("./api/users/user.router");
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
  destination: (req, file, cb) => {
    console.log(req.body.folder);
    if (req.body.folder === "images") {
      cb(null, path.join(null, "public/images"));
    } else if (req.body.folder === "categories") {
      cb(null, path.join(null, "public/categories"));
    } else {
      cb(new Error("Invalid folder specified"));
    }
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
app.use("/api/customers", customerRouter);

app.post(
  "/api/product",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  (req, res) => {
    console.log(req.body); // Other fields
    console.log(req.files.image); // Uploaded files
    console.log(req.files.images); // Uploaded files

    res.send("Files uploaded successfully");
  }
);
app.post(
  "/api/create-prod",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  (req, res) => {
    const image = req.files?.image?.[0]?.filename || null;
    const category = req.body.category;
    const status = req.body.status;
    const size_shoes = req.body.size_shoes;
    const meta_image = req.body.meta_image;
    const nom = req.body.nom;
    const prix = req.body.prix;
    let prix_promo = req.body.prix_promo;
    const qty = req.body.qty;

    // Convert prix_promo to null if it's an empty string
    prix_promo = prix_promo === "" ? 0 : prix_promo;

    const description = req.body.description;
    const images = (req.files.images || [])
      .filter((file) => file && file.filename)
      .map((item) => item.filename);
    const firstTableString = JSON.stringify(images);

    db.query(
      `insert into produit(name,price,price_promo,category,status,description,nemuro_shoes,image,meta_image,out_stock,hiden,images,meta_images,qty) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        nom,
        prix,
        prix_promo,
        category,
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
      ],
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
  db.query("SELECT * FROM produit where   hiden = '0'", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Alls Products By Priority and Not Hiden
app.get("/api/interface/products", (req, res) => {
  db.query(
    "SELECT * FROM produit where out_stock = '1' and hiden = '0'",
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

app.post(
  "/api/create-category",
  upload.fields([{ name: "image", maxCount: 1 }]),
  (req, res) => {
    const image = req.files?.image?.[0]?.filename || null;
    console.log(req.files.image);
    const meta_image = req.body.meta_image;
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
