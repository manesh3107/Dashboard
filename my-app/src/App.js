import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import RegisterForm from "./RegisterForm";
import Admin from "./Admin";
import ManagerPage from "./ManagerPage";
import ShowUsers from "./ShowUsers";
import StudentPage from "./StudentPage";
import CreateProject from "./CreateProject";
import ShowAProjects from "./ShowAProjects";
import ShowSProjects from "./ShowSProjects";
import MyProfile from "./MyProfile";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ResetPasswordPage from "./ResetPasswordPage";
import 'react-toastify/dist/ReactToastify.css';
import TaskPage from "./TaskPage";
import ShowTasks from "./ShowTasks";
import TaskDetails from "./TaskDetails";
import TaskUpdate from "./TaskUpdate";
import Sidebar from "./Sidebar";

function App() {
  return (
    <div className="App">
      {/* <Sidebar/> */}
      <Routes>
        <Route path="login" Component={Login} />
        <Route path="/" Component={Home} />
        <Route path="register" Component={RegisterForm} />
        <Route path="admin" Component={Admin} />
        <Route path="manager" Component={ManagerPage} />
        <Route path="admin/users" Component={ShowUsers} />
        <Route path="manager/users" Component={ShowUsers} />
        <Route path="student/users" Component={ShowUsers} />
        <Route path="student" Component={StudentPage} />
        <Route path="admin/createProject" Component={CreateProject} />
        <Route path="manager/projects" Component={ShowAProjects} />
        <Route path="admin/projects" Component={ShowAProjects} />
        <Route path="student/tasks" Component={ShowSProjects} />
        <Route path="profile" Component={MyProfile} />
        <Route path="forgot-password" Component={ForgotPasswordPage} />
        <Route path="reset-password/:token" Component={ResetPasswordPage} />
        <Route path="manager/assigntask" Component={TaskPage} />
        <Route path="manager/alltasks/:projectId?" Component={ShowTasks} />
        <Route path="admin/tasks/:projectId?" Component={ShowTasks} />
        <Route path="admin/assigntask" Component={TaskPage} />
        <Route path="manager/task/taskdetails" Component={TaskDetails} />

      </Routes>
    </div>
  );
}

export default App;
