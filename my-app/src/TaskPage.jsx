import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const TaskPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [students, setStudents] = useState([]);
  const [managers, setManagers] = useState([]);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [taskName,setTaskName]=useState(null);
  const [taskFormData, setTaskFormData] = useState({
    projectId: "",
    title: "",
    managerId: "",
    assignedStudents: [],
    description: "",
    status: "",
    dueDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/");
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${Cookies.get("usertype")}/projects`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchManagersAndStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${Cookies.get("usertype")}/users`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setManagers(response.data[1]?.manager || []);
        console.log(managers);
        setStudents(response.data[2]?.student || []);
      } catch (error) {
        if (error.response) {
          setErr(true);
          setErrMsg(error.response.data.message);
        }
        console.error(
          "Error fetching managers and students:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchManagersAndStudents();
    fetchProjects();
  }, []);

  const handleAddManager = (e) => {
    // Handle selecting manager only if the user is not an admin
    if (Cookies.get("usertype") === "admin") {
      setTaskFormData({ ...taskFormData, managerId: e.target.value });
    }
  };

  const handleAddStudent = (e) => {
    const selectedStudentId = e.target.value;

    if (!taskFormData.assignedStudents.includes(selectedStudentId)) {
      setTaskFormData({
        ...taskFormData,
        assignedStudents: [...taskFormData.assignedStudents, selectedStudentId],
      });
    }
  };

  const handleRemoveStudent = (studentId) => {
    setTaskFormData({
      ...taskFormData,
      assignedStudents: taskFormData.assignedStudents.filter(
        (id) => id !== studentId
      ),
    });
  };

  const handleProjectButtonClick = (projectId,title) => {
    setSelectedProject(projectId);
    setShowModal(true);
    setTaskName(title)
    setTaskFormData({
      ...taskFormData,
      projectId: projectId,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null); // Reset selectedProject when the modal is closed
    // Optionally reset form data or perform other actions on modal close
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({
      ...taskFormData,
      [name]: value,
    });
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${Cookies.get("usertype")}/assigntask`,
        taskFormData,
        { withCredentials: true }
      );
      toast.success("Task Created Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      if (Cookies.get("usertype") === "manager") {
        setTimeout(() => {
          navigate("/manager/assigntask");
        }, 2000);
      } else if (Cookies.get("usertype") === "admin") {
        setTimeout(() => {
          navigate("/admin/assigntask");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <>
    <Sidebar/>
      {/* <Header /> */}
      <div className="container mt-5">
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

        <h1 className="mb-4">Task Management</h1>

        <div className="row">
          {projects.map((project) => (
            <div key={project._id} className="col-md-4 mb-4">
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">{project.projectDetails.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Total Tasks: {project.totalTasks}
                  </h6>
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={() => handleProjectButtonClick(project._id,project.title)}
                  >
                    Add Task
                  </button>
                  <Link
                    className="btn btn-primary mx-2 mt-3"
                    to={`/manager/alltasks/${project._id}`}
                  >
                    Show Tasks
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div
            className="modal"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Task to {taskName}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Task Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={taskFormData.title}
                        onChange={handleInputChange}
                        placeholder="Enter Task Title"
                      />
                    </div>

                    {Cookies.get("usertype") === "admin" && (
                      <div className="mb-3">
                        <label htmlFor="manager" className="form-label">
                          Select Manager:
                        </label>
                        <select
                          className="form-control"
                          id="manager"
                          value={taskFormData.managerId}
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
                        {taskFormData.managerId && (
                          <div>
                            <strong>Selected Manager:</strong>{" "}
                            {
                              managers.find(
                                (manager) =>
                                  manager._id === taskFormData.managerId
                              )?.username
                            }
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add other form fields here */}
                    {/* For example, if 'assignedStudents' is an array of student IDs, you can use a multi-select dropdown */}
                    <div className="mb-3">
                      <label htmlFor="students" className="form-label">
                        Select Students:
                      </label>
                      <select
                        multiple
                        className="form-control"
                        id="students"
                        value={taskFormData.assignedStudents}
                        onChange={handleAddStudent}
                        required
                      >
                        {students.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.username}
                          </option>
                        ))}
                      </select>
                      {taskFormData.assignedStudents.length > 0 && (
                        <div>
                          <strong>Selected Students:</strong>
                          <ul>
                            {taskFormData.assignedStudents.map((studentId) => (
                              <li key={studentId}>
                                {
                                  students.find(
                                    (student) => student._id === studentId
                                  )?.username
                                }
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm ms-2"
                                  onClick={() => handleRemoveStudent(studentId)}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={taskFormData.description}
                        onChange={handleInputChange}
                        placeholder="Enter Task Description"
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        className="form-select"
                        id="status"
                        name="status"
                        value={taskFormData.status}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Status</option>
                        <option value="inprogress">In Progress</option>
                        {/* <option value="pending">Pending</option> */}
                        <option value="complete">Complete</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="dueDate" className="form-label">
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="dueDate"
                        name="dueDate"
                        value={taskFormData.dueDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddTask}
                    >
                      Add Task
                    </button>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddTask}
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskPage;

