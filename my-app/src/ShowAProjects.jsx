import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateProject from "./UpdateProject";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

const ShowAProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [userinfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }
    setUserInfo(Cookies.get("usertype"));
    const fetchProjects = async () => {
      try {
        // console.log(process.env)
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${Cookies.get("usertype")}/projects`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setProjects(response.data);
      } catch (error) {
        console.error(
          "Error fetching projects:",
          error.response ? error.response.data : error.message
        );

        if (error.response && error.response.status === 404) {
          setErr(true);
          setErrMsg(error.response.data.message);
        }
      }
    };

    fetchProjects();
  }, [selectedProject, navigate]);

  const handleCloseModal = () => {
    // Close the modal by resetting the selected project
    setSelectedProject(null);
  };

  const handleUpdateProjectClick = (projectId) => {
    // Set the selected project for updating
    setSelectedProject(projectId);
  };

  const handleDeleteProjectClick = async (projectId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/projects/${projectId}`, {
        withCredentials: true,
      });

      // Update the state by removing the deleted project
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );

      toast.success("Project Deleted Successfully!", {
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
        "Error deleting project:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <Sidebar />
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
          <h2 className="text-center my-5 bg-info">Project List</h2>
          <table className="table table-striped table-secondary table-hover table-bordered text-center">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Admin</th>
                <th scope="col">Manager</th>
                <th scope="col">Total Task</th>
                {userinfo === "admin" && <th scope="col">Action</th>}
                {(userinfo === "manager" || userinfo === "student") && (
                  <th>Due Date</th>
                )}
              </tr>
            </thead>
            <tbody>
              {console.log(projects)}
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.projectDetails.title}</td>
                  <td>{project.projectDetails.description}</td>
                  <td>{project.adminDetails[0].username}</td>
                  <td>{project.assignedManagerDetails[0].username}</td>
                  <td>{project.totalTasks}</td>

                  {userinfo === "admin" ? (
                    <td>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="red"
                        class="bi bi-trash"
                        viewBox="0 0 22 22"
                        onClick={() => handleDeleteProjectClick(project._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="blue"
                        class="bi bi-pencil-square"
                        viewBox="0 0 22 22"
                        onClick={() => handleUpdateProjectClick(project._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fill-rule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>
                    </td>
                  ) : (
                    <td>{moment(project.dueDate).format("DD-MM-YYYY")}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for updating projects */}
          {selectedProject && (
            <div
              className="modal"
              style={{ display: "block" }}
              tabIndex="-1"
              role="dialog"
            >
              <div
                className="modal-dialog"
                style={{ maxWidth: "900px" }}
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Project</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={handleCloseModal}
                      style={{color:"white"}}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <UpdateProject
                      projectId={selectedProject}
                      onClose={handleCloseModal}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowAProjects;
