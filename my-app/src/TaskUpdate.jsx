import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const UpdateProject = ({ taskId, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
    assignedStudents: [],
  });

  // const [managers, setManagers] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    console.log('Task Id================',taskId)
    const fetchProjectDetails = async () => {
      try {
        const taskresponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/manager/tasks/${taskId}`,
          { withCredentials: true }
        );
        const usersResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/${Cookies.get("usertype")}/users`,
          {
            withCredentials: true,
          }
        );

        // setManagers(usersResponse.data[1]?.manager || []);
        setStudents(usersResponse.data[2]?.student || []);

        const taskData = taskresponse.data;
        console.log(taskData)

        setFormData({
          title: taskData.title,
          description: taskData.description,
          dueDate: moment(taskData.dueDate).format("YYYY-MM-DD"),
          status: taskData.status,
          assignedStudents: taskData.assignedStudents,
        });
      } catch (error) {
        console.error(
          "Error fetching project details:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchProjectDetails();
  }, [taskId]);

  const handleTaskUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/manager/tasks/${taskId}`,
        formData,
        { withCredentials: true }
      );

      alert("Project Updated Successfully");
      onClose();
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
      console.error(
        "Error updating project:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // const handleRemoveManager = () => {
  //   setFormData({
  //     ...formData,
  //     assignedManager: "",
  //   });
  // };

  const handleRemoveStudent = (removedStudentId) => {
    setFormData({
      ...formData,
      assignedStudents: formData.assignedStudents.filter(
        (id) => id !== removedStudentId
      ),
    });
  };

  return (
    <>
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
      <>
        <>
          <>
            <>
              <></>
              <></>
            </>
            <>
              <form onSubmit={handleTaskUpdate}>
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
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status:
                  </label>
                  <textarea
                    className="form-control"
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  />
                </div>

                {/* <div className="mb-3">
                  <label htmlFor="assignedManager" className="form-label">
                    Select Manager:
                  </label>
                  <div>
                    {formData.assignedManager && (
                      <div>
                        {
                          managers.find(
                            (manager) =>
                              manager._id === formData.assignedManager
                          )?.username
                        }
                        <button
                          type="button"
                          className="btn btn-danger btn-sm ms-2"
                          onClick={handleRemoveManager}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <select
                    className="form-control"
                    id="assignedManager"
                    value={formData.assignedManager}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedManager: e.target.value,
                      })
                    }
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
                </div> */}

                <div className="mb-3">
                  <label htmlFor="assignedStudents" className="form-label">
                    Select Students:
                  </label>
                  <div>
                    {formData.assignedStudents.map((studentId) => (
                      <div key={studentId} className="mt-2">
                        {
                          students.find((student) => student._id === studentId)
                            ?.username
                        }
                        <button
                          type="button"
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => handleRemoveStudent(studentId)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <select
                    multiple
                    className="form-control"
                    id="assignedStudents"
                    value={formData.assignedStudents}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedStudents: Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        ),
                      })
                    }
                  >
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.username}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary">
                  Update Task
                </button>
              </form>
            </>
          </>
        </>
      </>
    </>
  );
};

export default UpdateProject;
