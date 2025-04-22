import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    comments: "",
    managerId: "",
    studentIds: [],
  });
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  // const [students, setStudents] = useState([]);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }
    const fetchManagersAndStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/users`, {
          withCredentials: true,
        });
        console.log("==============================================")
        setManagers(response.data[1]?.manager || []);
        // setStudents(response.data[2]?.student || []);
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchManagersAndStudents();
  }, [navigate]);

  const handleApiError = (error) => {
    if (error.response) {
      setErr(true);
      setErrMsg(error.response.data.message);
    }
    console.error(
      "Error fetching managers and students:",
      error.response ? error.response.data : error.message
    );
  };

  const handleAddManager = (e) => {
    setFormData({ ...formData, managerId: e.target.value });
  };

  // const handleAddStudent = (e) => {
  //   const selectedStudentId = e.target.value;

  //   if (!formData.studentIds.includes(selectedStudentId)) {
  //     setFormData({
  //       ...formData,
  //       studentIds: [...formData.studentIds, selectedStudentId],
  //     });
  //   }
  // };

  // const handleRemoveStudent = (studentId) => {
  //   setFormData({
  //     ...formData,
  //     studentIds: formData.studentIds.filter((id) => id !== studentId),
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/projects`, formData, {
        withCredentials: true,
      });

      toast.success("Project Created Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error || "Error creating project", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      if (error.response && error.response.status === 404) {
        setErr(true);
        setErrMsg(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Sidebar />
      {/* <Header /> */}
      <div className="container mt-5">
        {err && <h1>{errMsg}</h1>}
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
        {!err && (
          <>
            <h2>Create Project</h2>
            <form onSubmit={handleSubmit}>
              {/* Project details inputs */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description:
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">
                  Due Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="comments" className="form-label">
                  Comments:
                </label>
                <textarea
                  className="form-control"
                  id="comments"
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label htmlFor="manager" className="form-label">
                  Select Manager:
                </label>
                <select
                  className="form-control"
                  id="manager"
                  value={formData.managerId}
                  onChange={handleAddManager}
                  required
                >
                  <option value="" disabled>
                    Select a manager
                  </option>
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.username}
                    </option>
                  ))}
                </select>
                {formData.managerId && (
                  <div>
                    <strong>Selected Manager:</strong>{" "}
                    {
                      managers.find(
                        (manager) => manager._id === formData.managerId
                      )?.username
                    }
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary mb-5">
                Create Project
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default CreateProject;
