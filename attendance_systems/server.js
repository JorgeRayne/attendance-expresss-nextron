const express = require("express");
const database = require("./db");
const routes = require("./routes/master");
const cors = require("cors");
const app = express();
const port = 5070;

app.use(express.json());
routes(app);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(
    "\x1b[32m%s\x1b[0m",
    "  ▲",
    `[ SERVER ] is running at http://localhost:${port}`
  );
});
