const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

// `USE THIS FOR DEPLOYMENT AND TESTING BACKEND`

const mydb = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.PORT,
});

console.log("\x1b[32m%s\x1b[0m", "  ▲", "[ DATABASE ] Connected!");
// const mydb = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "attendance_cashless",
// });

module.exports = mydb;
