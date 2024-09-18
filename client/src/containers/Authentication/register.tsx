import React, { useState, ChangeEvent, FormEvent } from "react";
import Action from "../../utility/generalServices";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios"; // Import AxiosError for precise error typing

// Define the shape of the form data
interface FormData {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Initialize state with typed form data
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: ""
  });

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const response = await Action.post("/api/auth/register", formData);
      toast.success(response.data); // Show success toast
      navigate("/authenticate/login");
      setFormData({ username: "", email: "", password: "" }); // Reset form
    } catch (error) {
      // Check if error is an AxiosError
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Handle known error responses
        toast.error(axiosError.response.data as string); // Ensure the data is a string
      } else {
        // Handle unknown or network errors
        toast.error("An error occurred. Please try again."); // Show general error toast
      }
    }
  };

  return (
    <div className="authenticate">
      <div className="auth_con">
        <header>
          <div className="tag">
            Join Us <br /> To Become a <span>Grandmaster</span>
          </div>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="yr_in">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="sub" type="submit">
            Sign Up
          </button>
        </form>
        <div className="switch">
          <div className="tag">
            Already have an account? <Link to="/authenticate/login" className="to_ot_au">Sign In</Link> 
          </div>
        </div>
        {/* <div className="or">
          <div className="tag">or</div>
        </div> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
