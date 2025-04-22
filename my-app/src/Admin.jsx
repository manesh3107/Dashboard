// AdminPage.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Admin = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }
    if (Cookies.get("usertype") === "admin") {
      setUser(true);
    }
  }, []);

  const adminLinks = [
    { to: "/admin/users", label: "Show Users" },
    { to: "/admin/createProject", label: "Create Project" },
    { to: "/admin/projects", label: "Update Project" },
    { to: "/admin/tasks", label: "Show Tasks" },
    { to: "/admin/assigntask", label: "Add Task" },
  ];

  return (
    <>
      <Sidebar links={adminLinks} />
      <div className="container-fluid">
        {user ? (
          <>
            <h2 className="text-center mb-5">Welcome to the Admin Page</h2>

            {/* Navigation Links */}
            <div className="d-flex justify-content-center">
              {adminLinks.map((link) => (
                <Link key={link.to} to={link.to} className="btn btn-primary mx-2">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Content specific to the Admin Page */}
            {/* Add admin-specific content here */}
          </>
        ) : (
          <div className="text-center mt-5">
            <p className="text-danger">Access Denied</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
