const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require('morgan')

const DATABASEurl =
  "mongodb+srv://rathorshalini299:shalini123456@cluster0.mzvuk0b.mongodb.net/myproject?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
const User = require("./db/users");
require("dotenv").config();
const Product_schema = require("./db/products");
const Jwt = require("jsonwebtoken");
const jwtKey = "e-com";
const products = require("./db/products");


app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post("/login", async (req, res) => {
  console.log("body", req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");

    if (user) {
      let token = Jwt.sign({ user },jwtKey,{ expiresIn: "2h" });
      console.log("token=>",token);
      if(!token){
         res.send({ status: false, result: "unauthenticated" });
         return
      }
      res.send({ status: true, user: user,auth: token  });
    }

  } else {
    res.send({ status: false, result: "no user found" });
  }

  //  let user= await User.findOne({name:req.body.name})
});

app.post("/addproduct", async (req, res) => {
  console.log("req.body", req.body);
  let create = new Product_schema(req.body);
  result = await create.save();
  res.send(result);
});

app.get("/listProduct", async (req, res) => {
  let listProduct = await Product_schema.find({}).sort({ createdAt: -1 });
  console.log("listProduct=>", listProduct);
  if (products.length > 0) {
    res.send(listProduct);
  } else {
    res.send(result, "no result found");
  }
});

app.delete("/deleteProduct/:id", async (req, res) => {
  const id = req.params.id;
  console.log(req.params);
  const result = await products.findByIdAndDelete(id);
  res.send(result);
});

app.patch("/update/product/:id", async (req, res) => {
  const id = req.params.id;
  console.log(req.params);
  console.log("req.body====>>", req.body);
  const result = await products.findByIdAndUpdate(id, { ...req.body });
  res.send(result);
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  console.log(req.params);
  const result = await products.findById(id);
  if (result) {
    res.send(result);
  } else {
    // ({result:"no reault found"})
    res.send("no reault found");
  }
});

app.get("/search/:id", async (req, res) => {
  console.log(req.params);
  const searchValue = req.params.id;
  const searchRegex = new RegExp(searchValue, "i");
  // let result= products.find({
  //     '$or':
  //     [
  //         {productName:{$regex:searchValue}}
  //     ]
  // })
  let result = await Product_schema.find({
    productName: { $regex: searchRegex },
  });
  if (!result?.length) {
    result = await Product_schema.find({ category: { $regex: searchRegex } });
  }

  res.send(result);
});

app.get("/", (req, res) => {
  res.send("app is running now...");
});

app.listen(process.env.port, () => {
  console.log(`server listen on${process.env.port}`);
  mongoose
    .connect(process.env.DATABASEurl)
    .then(() => {
      console.log("mongodb connected");
    })
    .catch((err) => console.log(err, "not connected"));
});
