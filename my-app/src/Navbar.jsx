import "./App.css"; // You can create this CSS file for styling
import { Link } from "react-router-dom";
import './RegisterForm.css'

const App = () => {
  return (
    <>
      <section class="vh-100 gradient-custom">
        <div class="container py-5 h-100">
          <div class="row justify-content-center align-items-center h-100">
            <div class="col-12 col-lg-9 col-xl-7">
              <div
                class="card bg-secondary card-registration"
                style={{"border-radius": "15px;"}}
              >
                <div class="card-body p-4 p-md-5">
                  <form>
                    <div class="row">
                      <div class="mt-4 pt-2 col-md-6 mb-4">
                        <button
                          class="btn btn-lg w-100 bg-info"
                          type="submit"
                          value="Submit"
                        >
                          <Link className="nav-link fs-5 navbtn" to="/login">
                            Login
                          </Link>
                        </button>
                      </div>

                      <div class="mt-4 pt-2 col-md-6 mb-4">
                        <button
                          class="btn btn-lg w-100 bg-info"
                          type="submit"
                          value="Submit"
                        >
                          <Link className="nav-link fs-5" to="/register">
                            Register
                          </Link>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default App;
