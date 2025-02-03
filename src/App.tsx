import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // Correct import for BrowserRouter and Routes
import "./App.css";
import Navbar from "./components/NavBar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp"; // Assuming you have SignUp component
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/DashBoard";
import { AuthProvider } from "./contexts/AuthContext";
import { Room } from "./pages/Room";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
    <Router>
      {/* Navbar is displayed on all routes except SignIn and SignUp */}
      <Navbar />
      {/* Check2 */}
      <Routes>
        {/* Define Routes */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/dahsboard" element={<Navigate to="/dashboard/home" />} />
        <Route path="/dashboard/*" element={<Dashboard/>}/>
        <Route path="/room/:roomId" element={<Room />} />

      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
