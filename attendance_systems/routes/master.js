const express = require("express");
const router = express.Router();
const cors = require("cors");

// const main = require("./main.route");
const usersRoute = require("./users.route");

const corsSetting = {
  credentials: true,
  origin: "*",
};

const v = "v1";

const registeredRoute = (app) => {
  app.use(cors(corsSetting));
  // app.use("/", main);
  app.use("/attendance", usersRoute);
};

module.exports = registeredRoute;
