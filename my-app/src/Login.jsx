// Login.js
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
import "./RegisterForm.css";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login`,
        formData,
        { withCredentials: true }
      );
      const { token, userinfo } = response.data;
      setUser(userinfo.usertype);
      Cookies.set("token", token);
      Cookies.set("usertype", userinfo.usertype);

      // You can handle the token and userinfo as needed, e.g., save them to localStorage, etc.
      // console.log("Token:", token);
      // console.log("User Info:", userinfo);
      console.log(response);
      if (response.status === 200) {
        toast.success("Login Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      // alert(error.response.data.message)
      // alert(error.response.data.error);
      toast.error(error.response.data.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
    <Sidebar/>
      {user === "admin" && <Navigate to="/admin" />}
      {user === "manager" && <Navigate to="/manager" />}
      {user === "student" && <Navigate to="/student" />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-12 col-lg-9 col-xl-7">
              <div
                className="card bg-secondary card-registration"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body p-4 p-md-5">
                  <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 text-center text-dark">
                    Login Form
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div class="row">
                      <div class="col-md-6 mb-4">
                        <div class="form-outline">
                          <input
                            type="email"
                            id="email"
                            class="form-control form-control-lg"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          <label class="form-label" for="email">
                            Email
                          </label>
                        </div>
                      </div>

                      <div class="col-md-6 mb-4 d-flex align-items-center">
                        <div class="form-outline datepicker w-100">
                          <input
                            type="password"
                            class="form-control form-control-lg"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                          <label for="password" class="form-label">
                            Password
                          </label>
                        </div>
                      </div>
                    </div>
                    

                    <div class="pt-2">
                      <Link to='/forgot-password' className="nav-link text-center text-light">Forgot Password?</Link>
                    </div>
                    <div class="mt-4 pt-2">
                      <input
                        class="btn btn-primary btn-lg w-100"
                        type="submit"
                        value="Submit"
                      />
                    </div>
                  </form>

                  {/* Horizontal Line */}
                  <hr className="my-4" />

                  {/* "Not have an account" message and "Create Account" button */}
                  <div className="text-center text-light">
                    <p className="mb-3">Not have an account?</p>
                    <button className="btn btn-info btn-lg w-100">
                      <Link to="/register" className="nav-link">Create Account</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
