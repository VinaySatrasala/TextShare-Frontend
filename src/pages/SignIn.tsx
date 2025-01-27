// SignIn.tsx
import { useState } from "react";
import Input from "../components/Input"; // Reusable input component
import Button from "../components/Button"; // Reusable button component
import Card from "../components/Card"; // Reusable card component
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { setIsLoggedIn, setUserName } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try{
      const res = await axios.post(`${backendUrl}/signin`, {
        email,
        password,
      },{
        withCredentials: true,
      });
      console.log(res.data);
      if (res.status === 200) {
        setIsLoggedIn(true);
        setUserName("Hello");
        navigate("/dashboard/home");
      }
    }catch(error:any){
      console.error(
        "Error during sign-in:",
        error.response?.data || error.message
      );
      setIsError(true);
      setError(error.response?.data.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-gray-900 dark:to-black">
      <Card>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center animate__animated animate__fadeIn animate__delay-1s">
          Sign In
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mb-4"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mb-6"
          />
          {isError && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div className="text-center">
            <Button
              type="submit"
              className=" w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-full mt-4 transition transform hover:scale-105"
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <button
              className="text-green-600 hover:text-green-700 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
