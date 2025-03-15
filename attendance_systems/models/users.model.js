const database = require("../db");
const generateTimestamp = require("./generate-timestamp");
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  auth: {
    user: "djorgerayne@gmail.com",
    pass: "oeghkkmnpzskruuh",
  },
});

function sendMail(to, subject, message) {
  transporter.sendMail({ to, subject, html: message }, (err, info) => {
    if (err) {
      console.error("Email Error:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function _sanitizeId(id) {
  return Number.isInteger(Number(id)) ? Number(id) : null;
}

async function getIdentity(id) {
  const freshIdentity = _sanitizeId(id);
  console.log("LOG NEW:", freshIdentity);

  const fetchUserData = `
    SELECT u.*, s.section_name, s.grade_level, s.strand
    FROM users_data u
    LEFT JOIN section s ON u.section_id = s.id
    WHERE u.username = ?`;

  try {
    const [data] = await database.query(fetchUserData, [freshIdentity]);

    if (data.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "User not found.",
      };
    }

    console.log("Full User Data:", data[0]);

    return {
      statusCode: 200,
      success: true,
      message: "User found.",
      data: data[0],
    };
  } catch (error) {
    console.error("Database Query Error:", error);
    return {
      statusCode: 500,
      success: false,
      message: "Internal server error.",
    };
  }
}

async function getIdentityByNFC(id) {
  try {
    const freshIdentity = _sanitizeId(id);
    console.log("LOG NEW:", freshIdentity, "Type:", typeof freshIdentity);

    const fetchIdentityNFC = `
      SELECT u.*, s.section_name, s.grade_level, s.strand
      FROM users_data u
      LEFT JOIN section s ON u.section_id = s.id
      WHERE u.nfc_id = ?`;

    const [nfcData] = await database.query(fetchIdentityNFC, [freshIdentity]);

    if (!nfcData || nfcData.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "NFC not found.",
      };
    }

    console.log("Full User Data from NFC Scan:", nfcData[0]);

    const userId = nfcData[0].user_id;
    const guardianEmail = nfcData[0].guardianEmail;
    const studentName = `${nfcData[0].fname} ${nfcData[0].lname}`;
    const guardianName = nfcData[0].guardian;
    const currentTime = generateTimestamp();


    const checkExistingAttendanceSQL = `
      SELECT check_in, check_out 
      FROM attendance 
      WHERE user_id = ? 
      ORDER BY check_in DESC 
      LIMIT 1`;

    const [existingAttendance] = await database.query(checkExistingAttendanceSQL, [userId]);

    if (existingAttendance.length > 0) {
      const lastAttendance = existingAttendance[0];

      if (!lastAttendance.check_out) {
        const updateAttendanceSQL = `
          UPDATE attendance 
          SET check_out = ? 
          WHERE user_id = ? 
          AND check_out IS NULL 
          ORDER BY check_in DESC 
          LIMIT 1`;

        await database.query(updateAttendanceSQL, [currentTime, userId]);

        const checkoutMessage = `
          <p>Dear Mr/Ms. ${guardianName},</p>
          <p>Your child, <strong>${studentName}</strong>, has <strong>left school</strong> on <strong>${currentTime}</strong>.</p>
          <p>Best regards,<br>School Attendance System</p>`;

        sendMail(guardianEmail, `Exit Notification for ${studentName}`, checkoutMessage);

        return {
          statusCode: 200,
          success: true,
          message: "GOODBYE, THANK YOU.",
          user: { 
            ...nfcData[0], 
            check_in: lastAttendance.check_in, 
            check_out: currentTime 
          },
        };
      }
    }

    const insertAttendanceSQL = `
      INSERT INTO attendance (user_id, check_in)
      VALUES (?, ?)`;

    await database.query(insertAttendanceSQL, [userId, currentTime]);

    const checkinMessage = `
      <p>Dear Mr/Ms. ${guardianName},</p>
      <p>Your child, <strong>${studentName}</strong>, has <strong>checked in</strong> to school on <strong>${currentTime}</strong>.</p>
      <p>Best regards,<br>School Attendance System</p>`;

    sendMail(guardianEmail, `Attendance Notification for ${studentName}`, checkinMessage);

    return {
      statusCode: 200,
      success: true,
      message: "YOU'RE IN.",
      user: { 
        ...nfcData[0], 
        check_in: currentTime, 
        check_out: null 
      },
    };
  } catch (error) {
    console.error("Database Query Error:", error);
    return {
      statusCode: 500,
      success: false,
      message: "Internal server error.",
    };
  }
}

module.exports = {
  getIdentity,
  getIdentityByNFC,
};
