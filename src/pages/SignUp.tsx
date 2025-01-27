import { useState } from "react";
import Input from "../components/Input"; // Reusable input component
import Button from "../components/Button"; // Reusable button component
import Card from "../components/Card"; // Reusable card component
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  // State variables for email, password, and name
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent form from reloading the page
    try {
      const res = await axios.post(`${backendUrl}/signup`, {
        name,
        email,
        password,
      });
      console.log(res.data);
      if (res.status === 200) {
        // Redirect to the dashboard if signup is successful
        navigate("/dashboard/home");
      }
    } catch (error:any) {
      console.error(
        "Error during sign-up:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-gray-900 dark:to-black">
      <Card>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center animate__animated animate__fadeIn animate__delay-1s">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Input Field */}
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mb-4"
          />

          {/* Email Input Field */}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mb-4"
          />

          {/* Password Input Field */}
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mb-6"
          />

          <div className="text-center">
            <Button
              type="submit"
              className=" w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-full mt-4 transition transform hover:scale-105"
            >
              Sign Up
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <button
              className="text-green-600 hover:text-green-700 hover:underline"
              onClick={() => console.log("Switch to Sign In")}
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
