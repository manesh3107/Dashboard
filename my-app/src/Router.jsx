import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function Router() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      //   setIsLogout(true)
      Cookies.remove("usertype");
      navigate("/");
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <div>
      <nav className="navbar navbar-light bg-dark">
        <div className="container-fluid">
          <form className="d-flex">
            <button className="btn btn-primary mx-2">
              <Link to="/profile" className="nav-link">
                My Profile
              </Link>
            </button>
            <button className="btn btn-primary mx-2">
              <Link to={`/${Cookies.get("usertype")}`} className="nav-link">
                Home
              </Link>
            </button>
            <button
              className="btn btn-outline-light"
              type="submit"
              onClick={handleLogout}
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}

export default Router;
