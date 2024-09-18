import React, { useState, ChangeEvent, FormEvent } from "react";
import Action from "../../utility/generalServices"; // Assuming this is where axios is configured
import { toast, ToastContainer } from "react-toastify";
import { getLocalStorage, setLocalStorage } from "../../utility/helper";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { AxiosError } from "axios"; // Import AxiosError for more precise error typing

// Define the shape of the form data
interface FormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber: string;
  university: string;
  bio: string;
}

const ProfileCreation: React.FC = () => {
  // State to store form data with typed structure
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    phoneNumber: "",
    university: "",
    bio: "",
  });

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      // Get the token from local storage or cookie
      const token = getLocalStorage('token');
      // Set up headers with Authorization token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Correctly formatted header
          'Content-Type': 'application/json', // Ensure content type is set
        },
      };

      // Send the request to update profile
      const response = await Action.put("/api/user/profile", formData, config);
      setLocalStorage("user", JSON.stringify(response.data));
      toast.success("Profile updated successfully!"); // Show success toast 

      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        birthDate: "",
        phoneNumber: "",
        university: "",
        bio: "",
      });

      // Redirect to the home page after successful profile creation
      navigate("/");

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
      <div className="auth_con profilecreation">
        <header>
          <div className="tag">
            Tell us about <br />
            <span>yourself</span>
          </div>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="yr_in">
            <div className="name in_ly">
              <input
                type="text"
                className="fn"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                className="ln"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bd_pn in_ly">
              <input
                type="date"
                className="bd"
                placeholder="Birth Date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                className="pn"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              className="un_in"
              placeholder="University or Institute"
              name="university"
              value={formData.university}
              onChange={handleChange}
              style={{ maxWidth: "100%" }}
              required
            />
            <textarea
              className="bio"
              placeholder="About yourself"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={{ height: "100px", maxWidth: "100%" }}
              required
            ></textarea>
          </div>
          <button className="sub" type="submit">
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfileCreation;
