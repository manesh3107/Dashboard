import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./Sidebar";
const ShowUsers = () => {
  const [users, setUsers] = useState({
    admins: [],
    managers: [],
    students: [],
  });

  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [userinfo, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }

    setUser(Cookies.get("usertype"));
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${Cookies.get("usertype")}/users`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data)
        setUsers({
          admins: response.data[0]?.admin || [],
          managers: response.data[1]?.manager || [],
          students: response.data[2]?.student || [],
        });
        console.log(response);
      } catch (error) {
        if (error.response.status === 404) {
          setErr(true);
          setErrMsg(error.response.data.message);
        }
        console.error(
          "Error fetching users:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchUsers();
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

  const handleDelete = async (userId, userType) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/users/${userId}`, {
        withCredentials: true,
      });

      // Update the state by removing the deleted user from the specific user type
      setUsers((prevUsers) => ({
        ...prevUsers,
        [userType]:
          prevUsers[userType]?.filter((user) => user._id !== userId) || [],
      }));

      toast.success("User Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
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
      {/* <Header /> */}
      {err && <h1>{errMsg}</h1>}
      {!err && (
        <div className="container">
          <h2 className="text-center my-3">Show Users</h2>
          <hr className="my-4" />

          {/* Admins Table */}
          {users.admins.length > 0 && (
            <>
              <h3 className="text-center bg-primary my-5">Admins</h3>
              <table class="table table-striped table-success text-center table-bordered">
                <thead>
                  <tr>
                    <th scope="col">UserName</th>
                    <th scope="col">UserType</th>
                    {userinfo === "admin" && <th scope="col">Action</th>}
                    {(userinfo === "manager" || userinfo === "student") && (
                      <th>Email</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.admins?.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.usertype}</td>
                      {userinfo === "admin" ? (
                        <td>
                          {user.isDeleted ? (
                            "Deleted"
                          ) : (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(user._id, "admins")}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      ) : (
                        <td>{user.email}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {/* Managers Table */}
          {users.managers.length > 0 && (
            <>
              <h3 className="text-center bg-primary my-5">Managers</h3>
              <table class="table table-striped table-success text-center table-bordered">
                <thead>
                  <tr>
                    <th scope="col">UserName</th>
                    <th scope="col">UserType</th>
                    {userinfo === "admin" && <th scope="col">Action</th>}
                    {(userinfo === "manager" || userinfo === "student") && (
                      <th>Email</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                {users.managers?.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.usertype}</td>
                      {userinfo === "admin" ? (
                        <td>
                          {user.isDeleted ? (
                            "Deleted"
                          ) : (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(user._id, "managers")}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      ) : (
                        <td>{user.email}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Students Table */}
          {users.students.length > 0 && (
            <>
              <h3 className="text-center bg-primary my-5">Students</h3>
              <table className="table table-striped table-success text-center table-bordered">
                <thead>
                  <tr>
                    <th scope="col">UserName</th>
                    <th scope="col">UserType</th>
                    {userinfo === "admin" && <th scope="col">Action</th>}
                    {(userinfo === "manager" || userinfo === "student") && (
                      <th>Email</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                {users.students?.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.usertype}</td>
                      {userinfo === "admin" ? (
                        <td>
                          {user.isDeleted ? (
                            "Deleted"
                          ) : (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(user._id, "students")}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      ) : (
                        <td>{user.email}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowUsers;
