// const database = require("../db");
// const generateTimestamp = require("./generate-timestamp");
// const nodeMailer = require("nodemailer");

// const transporter = nodeMailer.createTransport({
//   secure: true,
//   host: "smtp.gmail.com",
//   auth: {
//     user: "djorgerayne@gmail.com",
//     pass: "oeghkkmnpzskruuh",
//   },
// });

// function sendMail(to, subject, message) {
//   transporter.sendMail({ to, subject, html: message }, (err, info) => {
//     if (err) {
//       console.error("Email Error:", err);
//     } else {
//       console.log("Email sent:", info.response);
//     }
//   });
// }

// function _sanitizeId(id) {
//   return Number.isInteger(Number(id)) ? Number(id) : null;
// }

// async function getIdentity(id) {
//   const freshIdentity = _sanitizeId(id);
//   console.log("LOG NEW:", freshIdentity);

//   const fetchUserData = `
//     SELECT u.*, s.section_name, s.grade_level, s.strand
//     FROM users_data u
//     LEFT JOIN section s ON u.section_id = s.id
//     WHERE u.username = ?`;

//   try {
//     const [data] = await database.query(fetchUserData, [freshIdentity]);

//     if (data.length === 0) {
//       return {
//         statusCode: 204,
//         success: false,
//         message: "User not found.",
//         user: data[0]
//       };
//     }

//     console.log("Full User Data:", data[0]);

//     return {
//       statusCode: 200,
//       success: true,
//       message: "User found.",
//       data: data[0],
//     };
//   } catch (error) {
//     console.error("Database Query Error:", error);
//     return {
//       statusCode: 500,
//       success: false,
//       message: "Internal server error.",
//     };
//   }
// }

// async function getIdentityByNFC(id) {
//   try {
//     const freshIdentity = _sanitizeId(id);
//     console.log("LOG NEW:", freshIdentity, "Type:", typeof freshIdentity);

//     const fetchIdentityNFC = `
//       SELECT u.user_id, u.nfc_id, u.section_id, u.username, 
//              u.fname, u.mname, u.lname, u.stud_status, u.card_status, 
//              s.section_name, s.grade_level, s.strand, 
//              u.guardianEmail, u.guardian
//       FROM users_data u
//       LEFT JOIN section s ON u.section_id = s.id
//       WHERE u.nfc_id = ?`;

//     const [nfcData] = await database.query(fetchIdentityNFC, [freshIdentity]);

//     if (!nfcData || nfcData.length === 0) {
//       return {
//         statusCode: 404,
//         success: false,
//         message: "NFC not found.",
//       };
//     }

//     console.log("Full User Data from NFC Scan:", nfcData[0]);

//     const user = {
//       user_id: nfcData[0].user_id,
//       nfc_id: nfcData[0].nfc_id,
//       section_id: nfcData[0].section_id,
//       username: nfcData[0].username,
//       name: `${nfcData[0].fname}${nfcData[0].mname ? nfcData[0].mname : ""}`,
//       lname: nfcData[0].lname,
//       fname: nfcData[0].fname,
//       mname: nfcData[0].mname,
//       stud_status: nfcData[0].stud_status,
//       card_status: nfcData[0].card_status,
//       section_name: nfcData[0].section_name,
//       grade_level: nfcData[0].grade_level,
//       strand: nfcData[0].strand,
//     };

//     const userId = user.user_id;
//     const guardianEmail = nfcData[0].guardianEmail;
//     const guardianName = nfcData[0].guardian;
//     const currentTime = new Date();
//     const formatDateForMySQL = (date) => {
//       const pad = (num) => (num < 10 ? "0" + num : num);
//       return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
//              `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
//     };
    
//     const currentTimestamp = formatDateForMySQL(new Date());
    

//     const checkExistingAttendanceSQL = `
//     SELECT 
//       DATE_FORMAT(check_in, '%Y-%m-%d %H:%i:%s') AS check_in, 
//       DATE_FORMAT(check_out, '%Y-%m-%d %H:%i:%s') AS check_out
//     FROM attendance 
//     WHERE user_id = ? 
//     ORDER BY check_in DESC 
//     LIMIT 1`;


//     const [existingAttendance] = await database.query(checkExistingAttendanceSQL, [userId]);

//     if (existingAttendance.length > 0) {
//       const lastAttendance = existingAttendance[0];
//       const lastCheckInTime = new Date(lastAttendance.check_in);
//       const timeDifference = (currentTime - lastCheckInTime) / 1000;

//       if (!lastAttendance.check_out) {
//         if (timeDifference < 10) {
//           return {
//             statusCode: 200,
//             success: true,
//             message: "YOU'RE STILL IN.",
//             user: { 
//               ...user, 
//               check_in: lastAttendance.check_in, 
//               check_out: null 
//             },
//           };
//         }

//         const updateAttendanceSQL = `
//           UPDATE attendance 
//           SET check_out = ? 
//           WHERE user_id = ? 
//           AND check_out IS NULL 
//           ORDER BY check_in DESC 
//           LIMIT 1`;

//         await database.query(updateAttendanceSQL, [currentTimestamp, userId]);

//         const checkoutMessage = `
//           <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//           <h2 style="color: #0056b3;">CMI ADMINISTRATION</h2>
//           <p>Dear <strong>${guardianName}</strong>,</p>
          
//           <div style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9;">
//               <p>I am writing to inform you that your child, ${user.fname} ${user.lname}, has exited the school premises today,${currentTimestamp}. Please let us know if you need any further details.</p>
//           </div>
//           <p style="color: #0056b3;"><strong>COLLEGE OF MARY IMMACULATE</strong></p>
//           <hr />
//           <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
//         </div>`;

//         sendMail(guardianEmail, ` Attendance Confirmation for ${user.fname} ${user.lname}`, checkoutMessage);

//         return {
//           statusCode: 200,
//           success: true,
//           message: "GOODBYE, THANK YOU.",
//           user: { 
//             ...user, 
//             check_in: lastAttendance.check_in, 
//             check_out: currentTimestamp 
//           },
//         };
//       }
//     }

//     const insertAttendanceSQL = `
//       INSERT INTO attendance (user_id, check_in)
//       VALUES (?, ?)`;

//     await database.query(insertAttendanceSQL, [userId, currentTimestamp]);

//     const checkinMessage = `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//           <h2 style="color: #0056b3;">CMI ADMINISTRATION</h2>
//           <p>Dear <strong>${guardianName}</strong>,</p>
          
//           <div style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9;">
//               <p>I hope this email finds you well. I am reaching out to confirm that your child, ${user.fname} ${user.lname}, is currently present at school today, ${currentTimestamp}. If you have any questions or need further information, please feel free to contact us.</p>
//           </div>
//           <p style="color: #0056b3;"><strong>COLLEGE OF MARY IMMACULATE</strong></p>
//           <hr />
//           <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
//         </div>`;

//     sendMail(guardianEmail, `Attendance Notification for ${user.fname} ${user.lname}`, checkinMessage);

//     return {
//       statusCode: 200,
//       success: true,
//       message: "YOU'RE IN.",
//       user: { 
//         ...user, 
//         check_in: currentTimestamp, 
//         check_out: null 
//       },
//     };
//   } catch (error) {
//     console.error("Database Query Error:", error);
//     return {
//       statusCode: 500,
//       success: false,
//       message: "Internal server error.",
//     };
//   }
// }

// module.exports = {
//   getIdentity,
//   getIdentityByNFC,
// };

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
        statusCode: 204,
        success: false,
        message: "User not found.",
        user: data[0]
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
        SELECT u.user_id, u.nfc_id, u.section_id, u.username, 
               u.fname, u.mname, u.lname, u.stud_status, u.card_status, 
               s.section_name, s.grade_level, s.strand, 
               u.guardianEmail, u.guardian
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
  
      const user = {
        user_id: nfcData[0].user_id,
        nfc_id: nfcData[0].nfc_id,
        section_id: nfcData[0].section_id,
        username: nfcData[0].username,
        name: `${nfcData[0].fname}${nfcData[0].mname ? nfcData[0].mname : ""}`,
        lname: nfcData[0].lname,
        fname: nfcData[0].fname,
        mname: nfcData[0].mname,
        stud_status: nfcData[0].stud_status,
        card_status: nfcData[0].card_status,
        section_name: nfcData[0].section_name,
        grade_level: nfcData[0].grade_level,
        strand: nfcData[0].strand,
      };
  
      const userId = user.user_id;
      const guardianEmail = nfcData[0].guardianEmail;
      const guardianName = nfcData[0].guardian;
      const currentTime = new Date();
      const formatDateForMySQL = (date) => {
        const pad = (num) => (num < 10 ? "0" + num : num);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };
      
      const currentTimestamp = formatDateForMySQL(new Date());
      
  
      const checkExistingAttendanceSQL = `
      SELECT 
        DATE_FORMAT(check_in, '%Y-%m-%d %H:%i:%s') AS check_in, 
        DATE_FORMAT(check_out, '%Y-%m-%d %H:%i:%s') AS check_out
      FROM attendance 
      WHERE user_id = ? 
      ORDER BY check_in DESC 
      LIMIT 1`;
  
  
      const [existingAttendance] = await database.query(checkExistingAttendanceSQL, [userId]);
  
      if (existingAttendance.length > 0) {
        const lastAttendance = existingAttendance[0];
        const lastCheckInTime = new Date(lastAttendance.check_in);
        const timeDifference = (currentTime - lastCheckInTime) / 1000;
  
        // Check if the last check-in was on the same date as the current check-out
        const isSameDate = lastCheckInTime.toDateString() === currentTime.toDateString();
  
        if (!lastAttendance.check_out && isSameDate) {
          if (timeDifference < 10) {
            return {
              statusCode: 200,
              success: true,
              message: "YOU'RE STILL IN.",
              user: { 
                ...user, 
                check_in: lastAttendance.check_in, 
                check_out: null 
              },
            };
          }
  
          const updateAttendanceSQL = `
            UPDATE attendance 
            SET check_out = ? 
            WHERE user_id = ? 
            AND check_out IS NULL
            ORDER BY check_in DESC 
            LIMIT 1`;
  
          await database.query(updateAttendanceSQL, [currentTimestamp, userId]);
  
          const checkoutMessage = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #0056b3;">CMI ADMINISTRATION</h2>
            <p>Dear <strong>${guardianName}</strong>,</p>
            
            <div style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9;">
                <p>I am writing to inform you that your child, ${user.fname} ${user.lname}, has exited the school premises today,${currentTimestamp}. Please let us know if you need any further details.</p>
            </div>
            <p style="color: #0056b3;"><strong>COLLEGE OF MARY IMMACULATE</strong></p>
            <hr />
            <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
          </div>`;
  
          sendMail(guardianEmail, ` Attendance Confirmation for ${user.fname} ${user.lname}`, checkoutMessage);
  
          return {
            statusCode: 200,
            success: true,
            message: "GOODBYE, THANK YOU.",
            user: { 
              ...user, 
              check_in: lastAttendance.check_in, 
              check_out: currentTimestamp 
            },
          };
        } else if (!isSameDate) { 
          const insertAttendanceSQL = `
        INSERT INTO attendance (user_id, check_in)
        VALUES (?, ?)`;
  
      await database.query(insertAttendanceSQL, [userId, currentTimestamp]);
  
      const checkinMessage = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #0056b3;">CMI ADMINISTRATION</h2>
            <p>Dear <strong>${guardianName}</strong>,</p>
            
            <div style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9;">
                <p>I hope this email finds you well. I am reaching out to confirm that your child, ${user.fname} ${user.lname}, is currently present at school today, ${currentTimestamp}. If you have any questions or need further information, please feel free to contact us.</p>
            </div>
            <p style="color: #0056b3;"><strong>COLLEGE OF MARY IMMACULATE</strong></p>
            <hr />
            <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
          </div>`;
  
      sendMail(guardianEmail, `Attendance Notification for ${user.fname} ${user.lname}`, checkinMessage);
  
      return {
            statusCode: 200,
            success: true,
            message: "YOU'RE IN",
            user: { 
              ...user, 
              check_in: lastAttendance.check_in, 
              check_out: null 
            },
          };
        }
      }
  
      const insertAttendanceSQL = `
        INSERT INTO attendance (user_id, check_in)
        VALUES (?, ?)`;
  
      await database.query(insertAttendanceSQL, [userId, currentTimestamp]);
  
      const checkinMessage = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #0056b3;">CMI ADMINISTRATION</h2>
            <p>Dear <strong>${guardianName}</strong>,</p>
            
            <div style="border: 1px solid #ddd; padding: 10px; background: #f9f9f9;">
                <p>I hope this email finds you well. I am reaching out to confirm that your child, ${user.fname} ${user.lname}, is currently present at school today, ${currentTimestamp}. If you have any questions or need further information, please feel free to contact us.</p>
            </div>
            <p style="color: #0056b3;"><strong>COLLEGE OF MARY IMMACULATE</strong></p>
            <hr />
            <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
          </div>`;
  
      sendMail(guardianEmail, `Attendance Notification for ${user.fname} ${user.lname}`, checkinMessage);
  
      return {
        statusCode: 200,
        success: true,
        message: "YOU'RE IN.",
        user: { 
          ...user, 
          check_in: currentTimestamp, 
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
