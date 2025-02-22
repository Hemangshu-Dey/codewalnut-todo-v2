import { useEffect } from "react";
import axios from "axios";
import useStore from "../../../utils/store";
import { getNewAccessToken } from "../../../utils/getNewAccessToken";
import { useNavigate, Outlet } from "react-router-dom";

const AuthWrapper = () => {
  const { currentUser, setCurrentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const validation = async () => {
      if (currentUser?.username) return;
      try {
        const response = await axios.get(
          `
        ${import.meta.env.VITE_BACKEND_URL}/api/auth/validation`,
          {
            withCredentials: true,
          }
        );
        setCurrentUser({
          userid: response.data.data.id,
          username: response.data.data.username,
        });

        navigate("/home");
      } catch (error) {
        console.log("Error reached");
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 401) {
            const res = await getNewAccessToken();
            if (!res || res?.status === 401) navigate("/register");
            else {
              setCurrentUser({
                userid: res.data?.data?.id,
                username: res.data?.data?.username,
              });
              navigate("/home");
            }
          } else {
            navigate("/register");
          }
        } else {
          navigate("/register");
        }
      }
    };

    validation();
  }, [currentUser, navigate, setCurrentUser]);

  return <Outlet />;
};

export default AuthWrapper;
