import { useState, ChangeEvent, FormEvent } from "react";
import Action from "../../utility/generalServices";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { authenticate, getLocalStorage, setLocalStorage } from "../../utility/helper";
import { AxiosError } from "axios"; // Import AxiosError for precise error typing

// Define the shape of the form data
interface FormData {
  usernameOrEmail: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    usernameOrEmail: '',
    password: ""
  });
  const [loading, setLoading] = useState<boolean>(false); // Optional: To show loading state
  const navigate = useNavigate(); // Hook for programmatic navigation

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
    setLoading(true); // Set loading state

    try {
      const response = await Action.post("/api/auth/login", formData);
      authenticate(response); // Store token and user data
      toast.success("Logged in successfully!"); // Show success toast
      
      const token = getLocalStorage('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Correctly formatted header
          'Content-Type': 'application/json', // Ensure content type is set
        },
      };

      // Attempt to fetch the user's profile
      try {
        const profileResponse = await Action.get("/api/user/profile", config);
        if (profileResponse.data) {
          // Profile exists, navigate to the home page
          setLocalStorage('user', JSON.stringify(profileResponse.data));
          navigate("/");
        }
        console.log(profileResponse);
      } catch (profileError) {
        const axiosProfileError = profileError as AxiosError;
        if (axiosProfileError.response && axiosProfileError.response.status === 404) {
          // Profile not found, navigate to create profile page
          navigate("/user/createmyprofile");
        } else {
          // If any other error, show a toast
          toast.error("An error occurred while fetching the profile.");
        }
      }

    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        toast.error(axiosError.response.data as string); // Ensure the data is a string
      } else {
        toast.error("An error occurred. Please try again."); // Show general error toast
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="authenticate">
      <div className="auth_con">
        <header>
          <div className="tag tag_login">
            Welcome <span>Back</span>
          </div>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="yr_in">
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Email or Username"
              value={formData.usernameOrEmail}
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
          <button className="sub" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
        <div className="switch">
          <div className="tag">
            Don’t have an account? <Link to="/authenticate/register" className="to_ot_au">Sign Up</Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
