// import React, { useState, useEffect } from "react";
// import Head from "next/head";
// import DateTime from "../components/time&date";
// import axios from "axios";

// export default function HomePage() {
//   const [student, setStudent] = useState({
//     student_id: "",
//     stud_pic: "/user/user.svg",
//     lname: "",
//     fname: "",
//     mname: "",
//     strand: "",
//     grade_level: "",
//     section_name: "",
//     message: "",
//     check_in: "",
//     check_out: ""
//   });

//   const [nfc_id, setNfc] = useState("");

//   useEffect(() => {
//     const inputField = document.getElementById("nfcInput");
//     if (inputField) {
//       inputField.focus();
//     }
//   }, []);
  
//   const formatDateTime = (dateTime) => {
//     const date = new Date(dateTime);
//     const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
//     const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
//     return {
//       date: formattedDate, 
//       time: formattedTime 
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log("Submitting NFC ID:", nfc_id);

//     try {
//       const res = await axios.post(
//         "http://localhost:5070/attendance", 
//         { nfc_id }, 
//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("✅ API Response:", res.data)

//       if (res.data.status === "error") {
//         console.log("⚠️ NFC Not Found:", res.data.message);
//         setStudent((prev) => ({
//           ...prev,
//           student_id: "",
//           lname: "",
//           fname: "",
//           mname: "",
//           strand: "",
//           grade_level: "",
//           section_name: "",
//           message: "NFC ID not enrolled",
//           check_in: null,
//           check_out: null,
//         }));
//         setNfc("");
//         return;
//       }

//       setStudent((prev) => ({
//         ...prev,
//         student_id: res.data.user.user_id,
//         lname: res.data.user.last_name || "",
//         fname: res.data.user.name || "",
//         mname: res.data.user.mname || "",
//         strand: res.data.user.strand || "",
//         grade_level: res.data.user.grade_level || "",
//         section_name: res.data.user.section_name || "",
//         message: res.data.user.message || "Attendance recorded",
//         check_in: res.data.user.check_in,
//         check_out: res.data.user.check_out,
//       }));

//       setNfc("");
//     } catch (err) {
//       console.error("❌ Error fetching NFC data:", err);

//       if (err.response && err.response.data) {
//         console.warn("⚠️ Error Response from API:", err.response.data);
//         setStudent((prev) => ({
//           ...prev,
//           student_id: "",
//           lname: "",
//           fname: "",
//           mname: "",
//           strand: "",
//           grade_level: "",
//           section_name: "",
//           message: err.response.data.message || "NFC ID not enrolled",
//           check_in: null,
//           check_out: null,
//         }));
//       } else {
//         setStudent((prev) => ({
//           ...prev,
//           student_id: "",
//           lname: "",
//           fname: "",
//           mname: "",
//           strand: "",
//           grade_level: "",
//           section_name: "",
//           message: "Error connecting to server",
//           check_in: null,
//           check_out: null,
//         }));
//       }
//     }
//   };

//   return (
//     <React.Fragment>
//       <Head>
//         <title>Student Logs</title>
//       </Head>
//       <div className="h-screen w-full bg-[url('../public/images/bg.svg')] bg-cover">
//         <div className="w-full h-[20%] flex flex-row items-center justify-center gap-6 bg-white bg-opacity-50">
//           <img src="/images/logo.svg" alt="logo" className="h-[70%]" />
//           <div className="text-center text-[#002147] font-semibold">
//             <h1 className="uppercase text-3xl">College of Mary Immaculate</h1>
//             <h3 className="text-lg">Poblacion, Pandi, Bulacan</h3>
//           </div>
//         </div>
//         <div className="h-[80%] w-full text-center text-3xl font-extrabold text-[#002147] bg-white bg-opacity-50">
//           <div className="h-[15%]">
//             <DateTime />
//           </div>
//           <div className="h-[85%] w-full flex flex-row">
//             <div className="h-full w-[40%] flex flex-col items-center justify-center p-6 gap-y-4">
//               <img
//                 src={student.stud_pic}
//                 alt="user"
//                 className="bg-white w-[80%] h-[80%]"
//               />
//             </div>
//             <div className="h-full w-[60%] text-[50px] flex flex-col gap-y-8 justify-center items-start uppercase">
//               <form onSubmit={handleSubmit}>
//                 <div className="flex flex-col justify-center items-center gap-y-6">
//                   <input
//                     id="nfcInput"
//                     type="text"
//                     placeholder="Scan NFC ID"
//                     name="nfc_id"
//                     value={nfc_id}
//                     onChange={(e) => setNfc(e.target.value)}
//                     className="opacity- absolute w-0"
//                   />
//                 </div>
//               </form>
//               {/* Display check_in and check_out times */}
//               {student.check_in && (
//                     <>
//                       <h2>Check-In:</h2>
//                       <p>{student.check_in.date} at {student.check_in.time}</p>
//                     </>
//                   )}
//                   {student.check_out && (
//                     <>
//                       <h2>Check-Out:</h2>
//                       <p>{student.check_out.date} at {student.check_out.time}</p>
//                     </>
//                   )}
//               {/* Display updated student details */}
//               {student.lname && (
//                 <>
//                   <h1>Student ID: {student.student_id || "N/A"}</h1>
//                   <h1>
//                     {student.lname}, {student.fname} {student.mname || ""}
//                   </h1>
//                   <h1>
//                     {student.strand || "N/A"} {student.grade_level || "N/A"} - {student.section_name || "N/A"}
//                   </h1>
//                   <h1 className="text-[100px] mt-10 animate-pulse text-green-500">
//                     {student.message || ""}
//                   </h1>

                  
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// }


import React, { useState, useEffect } from "react";
import Head from "next/head";
import DateTime from "../components/time&date";
import axios from "axios";

export default function HomePage() {
  const [student, setStudent] = useState({
    student_id: "",
    stud_pic: "/user/user.svg",
    lname: "",
    fname: "",
    mname: "",
    strand: "",
    grade_level: "",
    section_name: "",
    message: "",
    check_in: null,
    check_out: null,
    email: "",
    guardianEmail: ""
  });

  const [nfc_id, setNfc] = useState("");

  useEffect(() => {
    const inputField = document.getElementById("nfcInput");
    if (inputField) {
      inputField.focus();
    }
  }, []);
  
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} AT ${date.toLocaleTimeString()}`;
  };

  const sendEmailNotification = async (userEmail, guardianEmail, message) => {
    try {
      await axios.post("http://localhost:5070/send-email", {
        to: [userEmail, guardianEmail],
        subject: "Attendance Notification",
        text: message
      });
      console.log("📧 Email sent successfully");
    } catch (error) {
      console.error("❌ Failed to send email", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post("http://localhost:5070/attendance", { nfc_id });
      console.log("✅ API Response:", res.data);

      if (res.data.status === "error") {
        setStudent(prev => ({
          ...prev,
          message: "NFC ID not enrolled",
          check_in: null,
          check_out: null
        }));
        setNfc("");
        return;
      }

      const user = res.data.user;
      setStudent({
        stud_pic: "/user/user.svg",
        student_id:user.username,
        lname: user.lname,
        fname: user.fname,
        mname: user.mname || "",
        strand: user.strand,
        grade_level: user.grade_level,
        section_name: user.section_name,
        message: res.data.message,
        check_in: user.check_in,
        check_out: user.check_out,
        email: user.email,
        guardianEmail: user.guardianEmail
      });

      const attendanceMessage = `${user.fname} ${user.lname} has ${user.check_out ? "checked out" : "checked in"} at ${formatDateTime(user.check_out || user.check_in)}.`;
      sendEmailNotification(user.email, user.guardianEmail, attendanceMessage);
      
      setNfc("");
    } catch (err) {
      console.error("❌ Error fetching NFC data:", err);
      setStudent(prev => ({
        ...prev,
        message: "Error connecting to server",
        check_in: null,
        check_out: null
      }));
    }
  };

  return (
    <React.Fragment>
      <Head>
         <title>Student Logs</title>
       </Head>
       <div className="h-screen w-full bg-[url('../public/images/bg.svg')] bg-cover">
         <div className="w-full h-[20%] flex flex-row items-center justify-center gap-6 bg-white bg-opacity-50">
           <img src="/images/logo.svg" alt="logo" className="h-[70%]" />
           <div className="text-center text-[#002147] font-semibold">
             <h1 className="uppercase text-3xl">College of Mary Immaculate</h1>
             <h3 className="text-lg">Poblacion, Pandi, Bulacan</h3>
           </div>
         </div>
         <div className="h-[80%] w-full text-center text-3xl font-extrabold text-[#002147] bg-white bg-opacity-50">
           <div className="h-[15%]">
             <DateTime />
           </div>
           <div className="h-[85%] w-full flex flex-row">
             <div className="h-full w-[40%] flex flex-col items-center justify-center p-6 gap-y-4">
               <img
                 src={student.stud_pic}
                alt="user"
                className="bg-white w-[80%] h-[80%]"
              />
            </div>
            <div className="h-full w-[60%] text-[50px] flex flex-col gap-y-8 justify-center items-start uppercase">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col justify-center items-center gap-y-6">
                  <input
                    id="nfcInput"
                    type="text"
                    placeholder="Scan NFC ID"
                    name="nfc_id"
                    value={nfc_id}
                    onChange={(e) => setNfc(e.target.value)}
                    className="opacity- absolute w-0"
                  />
                </div>
              </form>
              {/* Display check_in and check_out times */}
              {student.check_in && (
                    <>
                      <h2>Check-In:</h2>
                      <p>{formatDateTime(student.check_in)}</p>
                    </>
                  )}
                  {student.check_out && (
                    <>
                      <h2>Check-Out:</h2>
                      <p>{formatDateTime(student.check_in)}</p>
                    </>
                  )}
              {/* Display updated student details */}
              {student.lname && (
                <>
                  <h1>Student ID: {student.student_id || "N/A"}</h1>
                  <h1>
                    {student.lname}, {student.fname} {student.mname || ""}
                  </h1>
                  <h1>
                    {student.strand || "N/A"} {student.grade_level || "N/A"} - {student.section_name || "N/A"}
                  </h1>
                  <h1 className="text-[100px] mt-10 animate-pulse text-green-500">
                    {student.message || ""}
                  </h1>

                  
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
