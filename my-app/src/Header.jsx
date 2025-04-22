import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header() {
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
  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-secondary text-light navbar-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href={`/${Cookies.get("usertype")}`}>
            {Cookies.get("usertype").toUpperCase()}
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="collapse navbar-collapse justify-content-end"
            id="navbarNavAltMarkup"
          >
            <div class="navbar-nav">
              <Link class="nav-link" aria-current="page" to="/profile">
                My Profile
              </Link>
              <Link class="nav-link" to={`/${Cookies.get("usertype")}`}>
                Home
              </Link>
              <a
                class="nav-link"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
