import { useState } from "react";
import Button from "../../atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../../utils/store";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { currentUser, setCurrentUser} = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {
          userid: currentUser?.userid,
        },
        {
          withCredentials: true,
        }
      );

      setCurrentUser({
        userid: "",
        username: "",
      });
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      console.log("Error logging out", error);
      if (error instanceof Error) {
        console.log(error);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  return (
    <nav className="bg-white text-blue-600 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">ToDo</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Button onClick={handleLogout} variant="primary">
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col items-center mt-4 space-y-4">
          <Button onClick={handleLogout} variant="primary">
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
