import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskUpdate from "./TaskUpdate";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

function ShowTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [userinfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }
    setUserInfo(Cookies.get("usertype"));
    const fetchProjects = async () => {
      try {
        const apiUrl = projectId
          ? `/${Cookies.get("usertype")}/alltasks/${projectId}`
          : `/${Cookies.get("usertype")}/alltasks`;
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}`+`${apiUrl}`, {
          withCredentials: true,
        });
        console.log(response.data);
        setTasks(response.data);
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
  }, [selectedTask]);

  const handleCloseModal = () => {
    // Close the modal by resetting the selected project
    setSelectedTask(null);
  };

  const handleUpdateProjectClick = (taskId) => {
    // Set the selected project for updating
    setSelectedTask(taskId);
  };

  const handleDeleteTaskClick = async (taskId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/manager/tasks/${taskId}`, {
        withCredentials: true,
      });

      // Update the state by removing the deleted project
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      toast.success("Task Deleted Successfully!", {
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
          <h2 className="text-center my-5 bg-info">Task List</h2>
          <table className="table table-striped table-secondary table-hover table-bordered text-center">
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Task</th>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
                <th scope="col">DueDate</th>
                <th scope="col">Manager</th>
                <th scope="col">Students</th>
                <th scope="col">Action</th>
                {/* {userinfo === "manager" ||
                  (userinfo === "admin" && <th scope="col">Action</th>)} */}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.projectId.title}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td
                    style={{
                      color:
                        task.status === "inprogress"
                          ? "blue"
                          : task.status === "pending"
                          ? "red"
                          : "green",
                    }}
                  >
                    {task.status}
                  </td>
                  <td>{moment(task.dueDate).format("DD-MM-YYYY")}</td>
                  <td>{task.assignedManager.username}</td>
                  <td>
                    {task.assignedStudents.map((student) => {
                      return (
                        <>
                          {student.username}
                          {","}
                        </>
                      );
                    })}
                  </td>

                  {userinfo === "manager" || userinfo === "admin" ? (
                    <td>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="blue"
                        class="bi bi-pencil-square"
                        viewBox="0 0 22 22"
                        onClick={() => handleUpdateProjectClick(task._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fill-rule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="red"
                        class="bi bi-trash"
                        viewBox="0 0 22 22"
                        onClick={() => handleDeleteTaskClick(task._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </td>
                  ) : (
                    <td>{moment(task.dueDate).format("DD-MM-YYYY")}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for updating projects */}
          {selectedTask && (
            <div
              className="modal"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
            >
              <div
                className="modal-dialog"
                style={{ maxWidth: "900px" }}
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Task</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={handleCloseModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <TaskUpdate
                      taskId={selectedTask}
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
}

export default ShowTasks;
