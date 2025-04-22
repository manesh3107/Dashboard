import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const TaskUpdatesPage = () => {
  const [groupedUpdates, setGroupedUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskUpdates = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/manager/task/taskDetails`,
          { withCredentials: true }
        );
        const data = response.data;

        setGroupedUpdates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task updates:", error);
        setLoading(false);
      }
    };

    fetchTaskUpdates();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/manager/tasks/${taskId}`,
        { status: "completed" },
        { withCredentials: true }
      );    
      alert("Mark As Completed")
      console.log(response.data); // Log the response if needed
      // You can also update the state to reflect the completed status without making an additional API call
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <div>
        <Sidebar/>
      <h1 className="mb-4 text-center">Task Updates</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        groupedUpdates.map((group) => (
          <div key={group.task._id} className="card m-4">
            <div className="card-header">
              <h2 className="mb-0">{group.task.title}</h2>
            </div>
            <div className="card-body">
              {group.updates.map((dailyUpdates) => (
                <div key={dailyUpdates.studentId._id} className="card mb-3">
                  <div className="card-header">
                    <h3 className="mb-0">{dailyUpdates.studentId.username}</h3>
                  </div>
                  <div className="card-body">
                    <ul className="list-group">
                      {dailyUpdates.dailyUpdates.map((update) => (
                        <li key={update._id} className="list-group-item">
                          <p className="mb-0">{update.content}</p>
                          {/* Add more information as needed */}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary"
                onClick={() => handleCompleteTask(group.task._id)}
                disabled={
                  group.updates.length < 3
                  //   group.updates.some((update) => update.content.trim() === "")
                }
              >
                Complete Task
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskUpdatesPage;
