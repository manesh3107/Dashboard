// ViewProject.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

const ViewProject = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    content: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/student/tasks`,
          {
            withCredentials: true,
          }
        );
        setTasks(response.data);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 404) {
          setErr(true);
          setErrMsg(error.response.data.message);
        } else {
          toast.error("Error fetching tasks", {
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
        console.error("Error fetching tasks:", error.response || error.message);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdateTaskClick = (taskId) => {
    setSelectedTask(taskId);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleDailyUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/student/tasks/${selectedTask}`,
        formData,
        { withCredentials: true }
      );

      toast.success("Daily Task Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // Close the modal
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data.error || "Error updating project", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.error("Error updating project:", error.response || error.message);
    }
  };

  return (
    <div>
      <Sidebar />
      {/* <Header /> */}
      {err && <h1>{errMsg}</h1>}
      {!err && (
        <div className="container mt-4">
          <h2>View Tasks</h2>
          <hr className="my-4" />
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {tasks.map((task) => (
              <div key={task._id} className="col">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{task.projectId.title}</h5>
                    <p className="card-text">Task: {task.title}</p>
                    <p className="card-text">Description: {task.description}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdateTaskClick(task._id)}
                    >
                      Update Daily Task
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedTask && (
            <div
              className="modal"
              style={{ display: "block" }}
              tabIndex="-1"
              role="dialog"
            >
              <div
                className="modal-dialog"
                role="document"
                style={{ maxWidth: "800px" }}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Today's Work</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={handleCloseModal}
                      style={{color:"white"}}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleDailyUpdate}>
                      <div className="mb-3">
                        <label htmlFor="content" className="form-label">
                          Update Here
                        </label>
                        <textarea
                          className="form-control"
                          id="content"
                          value={formData.content}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button type="submit" className="btn btn-primary mb-3">
                        Work Done
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
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
        </div>
      )}
    </div>
  );
};

export default ViewProject;
