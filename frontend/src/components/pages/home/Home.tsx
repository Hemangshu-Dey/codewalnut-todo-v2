import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../organisms/Navbar/Navbar";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import useStore from "../../../utils/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getNewAccessToken } from "../../../utils/getNewAccessToken";
interface CategoryName {
  categoryName: string;
  _id: string;
  createdAt: Date;
  todos: Array<string>;
  updatedAt: Date;
  __v: number;
}
const Home = () => {
  const [categoryNames, setCategoryNames] = useState<Array<CategoryName>>([]);
  const categoryRender = useStore((state) => state.categoryReRender);
  const setActiveCategory = useStore((state) => state.setActiveCategory);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const getToDoCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/todo/getToDoCategory`,
          {
            withCredentials: true,
          }
        );
        setCategoryNames(response.data.data);
        setActiveCategory(response.data.data[0]?._id);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 401) {
            const res = await getNewAccessToken();
            if (!res || res?.status === 401) navigate("/register");
            else {
              setCurrentUser({
                userid: res.data.data.id,
                username: res.data.data.username,
              });
            }
          } else {
            toast.error("Error fetching data");
          }
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };
    getToDoCategories();
  }, [categoryRender, navigate, setActiveCategory, setCurrentUser]);
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar categoryNames={categoryNames} />
        </div>
      </div>
    </>
  );
};

export default Home;
