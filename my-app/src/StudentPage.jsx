// ManagerPage.js
import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const StudentPage = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }
    if (Cookies.get("usertype") === "student") {
      setUser(true);
    }
  }, []);
  return (
    <div>
      <Sidebar/>
      {user ? (
        <>
          {/* <Header /> */}
          <h2 className="text-center">Welcome to the Student Page</h2>
          {/* Add manager-specific content here */} 

          <div className="d-flex justify-content-center mt-5">
            <Link to="/student/users" className="btn btn-primary mx-2">
              Show Users
            </Link>

            <Link to="/student/tasks" className="btn btn-primary mx-2">
              Show My Tasks
            </Link>
          </div>
        </>
      ) : (
        "Access Denind"
      )}
    </div>
  );
};

export default StudentPage;
