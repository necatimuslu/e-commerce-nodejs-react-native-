const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
dotenv = require("dotenv/config");
const app = express();

const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/errorHandler");

const db = process.env.DB;

app.use(authJwt());
app.use(errorHandler);

app.use(cors());
app.options("*", cors());

app.use(morgan("tiny"));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");

app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);

mongoose
  .connect(db, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB ye başarılı şekilde bağlanıldı"));

app.listen(process.env.PORT, () =>
  console.log(
    `nodejs server ${process.env.PORT} portundan başarılı şekilde ayaklandı`
  )
);
