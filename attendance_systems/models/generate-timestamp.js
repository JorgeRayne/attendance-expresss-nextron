const moment = require("moment-timezone");

function generateTimestamp() {
  return moment().tz("Asia/Manila").format("YYYY-MM-DDTHH:mm:ss");
}

console.log(generateTimestamp());

module.exports = generateTimestamp;
