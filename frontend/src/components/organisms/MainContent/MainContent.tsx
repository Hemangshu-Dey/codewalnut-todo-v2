import { useState, useEffect } from "react";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import useStore from "../../../utils/store";
import { toast } from "sonner";
import axios from "axios";
import AddTaskModal from "../../molecules/AddTaskModal/AddTaskModal";
import TaskCard from "../../molecules/TaskCard/TaskCard";
import { getNewAccessToken } from "../../../utils/getNewAccessToken";
import { useNavigate } from "react-router-dom";

interface Todo {
  createdAt: Date;
  deadline: Date;
  description: string;
  isComplete: boolean;
  title: string;
  todoCategoryId: string;
  updatedAt: Date;
  __v: number;
  _id: string;
}

const MainContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [loading, setLoading] = useState(true);
  const [isDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const activeCategory = useStore((state) => state.activeCategory);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const todoRender = useStore((state) => state.todoReRender);

  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  useEffect(() => {
    if (!activeCategory) return;

    const getToDos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/todo/getToDo?categoryId=${activeCategory}`,
          {
            withCredentials: true,
          }
        );
        setTodos(response.data.data || []);
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
            toast.success("All tasks are deleted");
          }
        } else {
          toast.error("An unknown error occurred");
        }
      }
      setLoading(false);
    };
    getToDos();
  }, [todoRender, activeCategory, navigate, setCurrentUser]);

  return (
    <div className="flex flex-col h-screen w-full p-4 bg-white">
      {/* Search and Add Task */}
      <div className="flex items-center justify-between mt-4 mb-4 w-full">
        <Button
          onClick={() => setShowModal(true)}
          disabled={isDisabled}
          className="mr-2 w-3xs"
        >
          Add Task
        </Button>
        <AddTaskModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
        />
        <Input
          id="search"
          name="search"
          value={searchQuery}
          onChange={handleSearchChange}
          type="text"
          placeholder="Search tasks..."
          className="w-full px-4 py-2 rounded-lg"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        /* Task List */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {todos
            .filter(
              (todo) => todo.title.toLowerCase().includes(searchQuery)
            )
            .map((todo) => (
              <TaskCard key={todo._id} todos={todo} />
            ))}
        </div>
      )}
    </div>
  );
};

export default MainContent;
