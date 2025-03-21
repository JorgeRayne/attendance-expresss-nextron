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
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:5070/attendance", { nfc_id }).catch((err) => {
        if (err.response && err.response.status === 404) {
          return err.response;
        }
        throw err;
      });
  
      console.log("API Response:", res.data);
  
      if (res.data.statusCode === 404) {
        setErrorMessage("ID NOT ENROLL");
        setStudent({
          student_id: "",
          stud_pic: "/user/user.svg",
          lname: "",
          fname: "",
          mname: "",
          strand: "",
          grade_level: "",
          section_name: "",
          message: "ID NOT ENROLL",
          check_in: null,
          check_out: null,
          email: "",
          guardianEmail: "",
        });
        setNfc("");
        return;
      }
  
      const user = res.data.user;
      setErrorMessage("");
      setStudent({
        stud_pic: "/user/user.svg",
        student_id: user.username,
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
        guardianEmail: user.guardianEmail,
      });
  
      setNfc("");
    } catch (err) {
      console.error("Error fetching NFC data:", err);
      setErrorMessage("Error processing request.");
      setStudent((prev) => ({
        ...prev,
        message: "Error processing request.",
        check_in: null,
        check_out: null,
      }));
  
      setNfc("");
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
              <img src={student.stud_pic} alt="user" className="bg-white w-[80%] h-[80%]" />
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
                    className="opacity-100 absolute w-50"
                  />
                </div>
              </form>
              {errorMessage && (
                <div className="text-red-600 text-4xl font-bold animate-pulse">
                  <h1 className="text-[100px] mt-10 animate-pulse text-green-500">{errorMessage}</h1>
                </div>
              )}
              {student.check_in && (
                <>
                  <h2>Check-In:</h2>
                  <p>{formatDateTime(student.check_in)}</p>
                </>
              )}
              {student.check_out && (
                <>
                  <h2>Check-Out:</h2>
                  <p>{formatDateTime(student.check_out)}</p>
                </>
              )}
              {student.lname && (
                <>
                  <h1>Student ID: {student.student_id || "N/A"}</h1>
                  <h1>{student.lname}, {student.fname} {student.mname || ""}</h1>
                  <h1>{student.strand || "N/A"} {student.grade_level || "N/A"} - {student.section_name || "N/A"}</h1>
                  <h1 className="text-[100px] mt-10 animate-pulse text-green-500">{student.message || errorMessage}</h1>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
