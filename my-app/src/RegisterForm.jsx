import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterForm.css";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    usertype: "admin", // Default usertype to "admin"
  });

  const [user, setUser] = useState(false);

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
        "http://localhost:5000/register",
        formData
      );
      console.log(response.data); // You can handle the response as needed
      console.log(response.status);

      toast.success("User Register Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setUser(true);
      // Redirect to login or another page if needed
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );

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
    }
  };

  return (
    <div>
      <Sidebar/>
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
      {user && <Navigate to="/login" />}

      <section class="vh-100 gradient-custom">
        <div class="container py-5 h-100">
          <div class="row justify-content-center align-items-center h-100">
            <div class="col-12 col-lg-9 col-xl-7">
              <div
                class="card bg-secondary card-registration"
                style={{ "border-radius": "15px;" }}
              >
                <div class="card-body p-4 p-md-5">
                  <h3 class="mb-4 pb-2 pb-md-0 mb-md-5 text-center">
                    Registration Form
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div class="row">
                      <div class="col-md-6 mb-4">
                        <div class="form-outline">
                          <input
                            type="text"
                            id="UserName"
                            class="form-control form-control-lg"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                          />
                          <label class="form-label" for="UserName">
                            UserName
                          </label>
                        </div>
                      </div>
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
                    </div>

                    <div class="row">
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
                      <div class="col-md-6 mb-4">
                        <h6 class="mb-2 pb-1">User-Type: </h6>

                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="radio"
                            id="femaleGender"
                            name="usertype"
                            value="admin"
                            checked={formData.usertype === "admin"}
                            onChange={handleChange}
                          />
                          <label class="form-check-label" for="femaleGender">
                            Admin
                          </label>
                        </div>

                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="radio"
                            id="maleGender"
                            name="usertype"
                            value="manager"
                            checked={formData.usertype === "manager"}
                            onChange={handleChange}
                          />
                          <label class="form-check-label" for="maleGender">
                            Manager
                          </label>
                        </div>

                        <div class="form-check form-check-inline">
                          <input
                            class="form-check-input"
                            type="radio"
                            id="otherGender"
                            name="usertype"
                            value="student"
                            checked={formData.usertype === "student"}
                            onChange={handleChange}
                          />
                          <label class="form-check-label" for="otherGender">
                            Student
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 pt-2">
                      <input
                        class="btn btn-primary btn-lg w-100"
                        type="submit"
                        value="Submit"
                      />
                    </div>
                    <hr className="my-4" />

                    {/* "Not have an account" message and "Create Account" button */}
                    <div className="text-center text-light">
                      <p className="mb-3">Already have an account?</p>
                      <button className="btn btn-info btn-lg w-100">
                        <Link to="/login" className="nav-link">
                          Login Here
                        </Link>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
