import { useState } from "react";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import { useNavigate } from "react-router-dom";
import { passwordRegEx, emailRegEx } from "../../../constants/regEx";
import { toast } from "sonner";
import axios from "axios";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const goToLogin = () => {
    navigate("/login");
  };

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const clearFormData = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = e.target.name;
    const value: string = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    for (const key in formData) {
      if (!formData[key as keyof FormData]) {
        setIsLoading(false);
        toast.error("Please fill in all fields.");
        return;
      }
    }

    if (!emailRegEx.test(formData.email)) {
      setIsLoading(false);
      toast.error("Enter a valid email.");
      return;
    }
    if (!passwordRegEx.test(formData.password)) {
      setIsLoading(false);
      toast.error(
        `Enter a strong password:
    • At least 8 characters long
    • Contains a lowercase letter
    • Contains an uppercase letter
    • Contains a number
    • Contains a special character`
      );
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      toast.success("User registered successfully.");
      navigate("/login");
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          toast.error("User already exists.");
        } else {
          toast.error("Error registering user.");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    }

    clearFormData();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-blue-100">
      <div className="bg-white/10 shadow-2xl p-6 sm:p-8 rounded-3xl max-w-sm sm:max-w-md w-full space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-600">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <Input
            id="username"
            name="username"
            label="Username"
            type="text"
            placeholder="Enter username..."
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email..."
            value={formData.email}
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
            variant="primary"
            onClick={handleRegister}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>

        <span
          className={`text-center block mt-4 text-sm sm:text-base ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={isLoading}
        >
          <span className="text-black">Already have an account?</span>
          <span
            onClick={goToLogin}
            className="cursor-pointer text-blue-600 hover:underline ml-1"
          >
            Login here.
          </span>
        </span>
      </div>
    </div>
  );
};

export default Register;
