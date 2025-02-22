import { useState } from "react";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import useStore from "../../../utils/store";

interface FormData {
  identifier: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const goToRegister = () => {
    navigate("/register");
  };
  const setCurrentUserState = useStore((state) => state.setCurrentUser);
  const navigate = useNavigate();

  const clearFormData = () => {
    setFormData({
      identifier: "",
      password: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    for (const key in formData) {
      if (!formData[key as keyof FormData]) {
        setIsLoading(false);
        toast.error("Please fill in all fields");
        return;
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          identifier: formData.identifier,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      setCurrentUserState({
        userid: response.data.data.id,
        username: response.data.data.username,
      });
      toast.success("Login successful!");
      navigate("/home");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Invalid credentials");
      setIsLoading(false);
    }
    clearFormData();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-blue-100">
      <div className="bg-white/10 shadow-2xl p-6 sm:p-8 rounded-3xl max-w-sm sm:max-w-md w-full space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-600">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            id="identifier"
            name="identifier"
            label="Username or Email"
            type="text"
            placeholder="Enter username or email..."
            value={formData.identifier}
            onChange={handleChange}
            required
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password..."
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            onClick={handleLogin}
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <span
          className={`text-center block mt-4 text-sm sm:text-base ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={isLoading}
        >
          <span className="text-black"> Don't have an account?</span>
          <span
            onClick={goToRegister}
            className="cursor-pointer text-blue-600 hover:underline ml-1"
          >
            Register here.
          </span>
        </span>
      </div>
    </div>
  );
};

export default Login;
