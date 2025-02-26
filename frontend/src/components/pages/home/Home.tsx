import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getNewAccessToken } from "../../../utils/getNewAccessToken";
import useStore from "../../../utils/store";
import Navbar from "../../organisms/Navbar/Navbar";
import Sidebar from "../../organisms/Sidebar/Sidebar";
import MainContent from "../../organisms/MainContent/MainContent";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          if (error.response?.status === 401) {
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
    <div className="min-h-screen overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50">
        <div className="mx-auto">
          <Navbar />
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="flex pt-16">
        {/* SIDEBAR */}
        <Sidebar categoryNames={categoryNames} />

        {/* MAIN CONTENT */}
        <div
          className={`flex-1 transition-margin duration-300 ${
            isSidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center"
            ></button>
            {categoryNames.length > 0 ? (
              <MainContent />
            ) : (
              <div className="flex items-center justify-center text-gray-500 text-lg font-bold mt-50">
                Add category before adding tasks
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
