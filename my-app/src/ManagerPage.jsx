// ManagerPage.js
import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ManagerPage = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }
    if (Cookies.get("usertype") === "manager") {
      setUser(true);
    }
  }, []);

  return (
    <div>
      <Sidebar/>
      {user ? (
        <>
          {/* <Header /> */}

          <h2 className="text-center">Welcome to the Manager Page</h2>
          {/* Add manager-specific content here */}

          <div className="d-flex justify-content-center mt-5">
            <Link to="/manager/users" className="btn btn-primary mx-2">
              Show Users
            </Link>

            <Link
              to="/manager/projects"
              className="btn btn-primary mx-2"
            >
              Show Projects
            </Link>

            <Link
              to="/manager/assigntask"
              className="btn btn-primary mx-2"
            >
              Add Task
            </Link>
            <Link
              to="/manager/alltasks/"
              className="btn btn-primary mx-2"
            >
              Show Tasks
            </Link>
          </div>
        </>
      ) : (
        "Access Denied"
      )}
    </div>
  );
};

export default ManagerPage;
