const users = require("../models/users.model");

exports.getIdentification = async function (req, res) {
  const { id } = req.params;
  
  const response = await users.getIdentity(id);
  return res.status(response.statusCode).json({
    statusCode: response.statusCode,
    message: response.message,
    success: response.success,
    user: response.user ? response.user : undefined,
  });
};

exports.getIdentificationByNFC = async function (req, res) {
  const { nfc_id } = req.body;
  console.log(nfc_id);

  console.log(typeof id);

  const response = await users.getIdentityByNFC(nfc_id);
  return res.status(response.statusCode).json({
    statusCode: response.statusCode,
    message: response.message,
    success: response.success,
    user: response.user ? response.user : undefined,
  });
};
