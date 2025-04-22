import Cookies from "js-cookie";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const userType = Cookies.get("usertype");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      //   setIsLogout(true)
      Cookies.remove("usertype");
      navigate("/");
    } catch (error) {
      console.log(error.response);
    }
  };

  const getLinksForUserType = () => {
    switch (userType) {
      case "admin":
        return [
          { to: "/admin", label: "Home", icon: "bx-layer" },
          { to: "/admin/users", label: "Users", icon: "bx-user" },
          {
            to: "/admin/createProject",
            label: "Create Project",
            icon: "bx-add-to-queue",
          },
          { to: "/admin/projects", label: "Update Project", icon: "bx-edit" },
          { to: "/admin/tasks", label: "Show Tasks", icon: "bx-task" },
          { to: "/admin/assigntask", label: "Add Task", icon: "bx-plus" },
        ];
      case "manager":
        return [
          { to: "/manager", label: "Home", icon: "bx-layer" },
          { to: "/manager/users", label: "Show Users", icon: "bx-user" },
          {
            to: "/manager/projects",
            label: "Show Projects",
            icon: "bx-add-to-queue",
          },
          { to: "/manager/assigntask", label: "Add Task", icon: "bx-edit" },
          { to: "/manager/alltasks", label: "Show Tasks", icon: "bx-task" },
          { to: "/manager/task/taskdetails", label: "Task Details", icon: "bx-chart" },
        ];
      case "student":
        return [
          { to: "/student", label: "Home", icon: "bx-layer" },
          { to: "/student/users", label: "Show Users", icon: "bx-user" },
          { to: "/student/tasks", label: "Show My Tasks", icon: "bx-task" },
        ];
      default:
        return [];
    }
  };

  const userLinks = getLinksForUserType();

  return (
    <div>
      <div id="body-pd" className="">
        <header className="header" id="header">
          <div className="header_toggle">
            <i className="bx bx-menu" id="header-toggle"></i>
          </div>
          <div className="header_img">
            <Link to="/profile">
              <img src="https://api.dicebear.com/7.x/fun-emoji/svg" alt="" />
            </Link>
          </div>
        </header>
        <div className="l-navbar" id="nav-bar">
          <nav className="nav">
            <div>
              {userLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav_link ${
                    location.pathname.startsWith(link.to) ? "active" : ""
                  }`}
                >
                  <i className={`bx ${link.icon} nav_icon`}></i>
                  <span className="nav_name">{link.label}</span>
                </Link>
              ))}
            </div>
            <a
              onClick={handleLogout}
              className="nav_link"
              style={{ cursor: "pointer" }}
            >
              <i className="bx bx-log-out nav_icon"></i>
              <span className="nav_name">SignOut</span>
            </a>
          </nav>
        </div>
        <div className="bg-light text-center text-lg">
          {/* <h4>
            {location.pathname.split("/").pop().charAt(0).toUpperCase() +
              location.pathname.split("/").pop().slice(1)}
          </h4> */}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
