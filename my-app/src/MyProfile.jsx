import axios from "axios";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!Cookies.get("token")) {
        navigate("/");
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/myProfile`, {
          withCredentials: true,
        }); // Replace with your actual API endpoint
        console.log(response);
        if (response) {
          setUserData(response.data);
        } else {
          setError(response.error || "Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Internal Server Error");
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
    <Sidebar/>
      {/* <Header /> */}
      <div className="container mt-4">
        <h2 className="mb-4">My Profile</h2>

        <div className="card">
          <div className="card-body">
            {error && <p className="text-danger">{error}</p>}

            {userData && (
              <div>
                <p className="mb-2">ID: {userData.email}</p>
                <p className="mb-2">Name: {userData.username}</p>
                {/* Add more fields as needed */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
