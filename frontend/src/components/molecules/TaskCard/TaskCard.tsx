import { useState, useEffect } from "react";
import Button from "../../atoms/Button/Button";
import { motion } from "framer-motion";
import { Check, Trash2, RefreshCcw } from "lucide-react";
import useStore from "../../../utils/store";
import axios from "axios";
import { toast } from "sonner";
import { getNewAccessToken } from "../../../utils/getNewAccessToken";
import { useNavigate } from "react-router-dom";
interface todoProps {
  todos: {
    createdAt: Date;
    deadline: Date;
    description: string;
    isComplete: boolean;
    title: string;
    todoCategoryId: string;
    updatedAt: Date;
    __v: number;
    _id: string;
  };
}

const TaskCard: React.FC<todoProps> = ({ todos }) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(todos.isComplete);
  const [deadlineColor, setDeadlineColor] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
   const navigate = useNavigate();

  const todoRender = useStore((state) => state.todoReRender);
  const setTodoRender = useStore((state) => state.setTodoReRender);
  const setCurrentUserState = useStore((state) => state.setCurrentUser);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const dateObj = new Date(todos.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    setDate(
      dateObj.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    if (dateObj < today) {
      setDeadlineColor("text-red-500");
    } else if (dateObj.getTime() === today.getTime()) {
      setDeadlineColor("text-amber-500");
    } else {
      setDeadlineColor("text-green-500");
    }
  }, [todos.deadline]);

  const handleTodoDelete = async () => {
    setIsDisabled(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/deleteToDo?id=${
          todos._id
        }`,
        {
          withCredentials: true,
        }
      );
      toast.success(`${todos.title} task deleted.`);
      setTodoRender(!todoRender);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Failed to delete category. Try again.");
          setCurrentUserState({
            userid: "",
            username: "",
          });
        } else {
          toast.error(`${error.response?.data.message}.`);
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    }
    setIsDisabled(false);
  };

 const toggleTodo = async () => {
   try {
     await axios.get(
       `${import.meta.env.VITE_BACKEND_URL}/api/todo/toggleToDo?todoId=${
         todos._id
       }`,
       {
         withCredentials: true,
       }
     );
     setIsCompleted(!isCompleted);
     setTodoRender(!todoRender);
   } catch (error) {
     if (axios.isAxiosError(error)) {
       if (error.response?.status === 401) {
         const res = await getNewAccessToken();
         if (!res || res?.status === 401) {
           navigate("/register");
         } else if (res.data?.data) {
           setCurrentUser({
             userid: res.data.data.id,
             username: res.data.data.username,
           });
         }
       } else {
         toast.error("Error updating task status.");
       }
     } else {
       toast.error("An unknown error occurred.");
     }
   }
 };

 const handleToggle = async () => {
   await toggleTodo();
 };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-lg p-4 flex flex-col border-gray-100 min-h-[200px]"
    >
      <div>
        <h3
          className={`text-2xl font-bold mb-2 ${
            isCompleted ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {todos.title}
        </h3>
        <p
          className={`font-bold mb-2 break-words whitespace-normal ${
            isCompleted ? "line-through text-gray-400" : "text-gray-600"
          }`}
        >
          {todos.description}
        </p>
        <p
          className={`text-sm ${
            isCompleted ? "line-through text-gray-400" : deadlineColor
          } font-bold mt-10 mb-5`}
        >
          Deadline: {date}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="primary"
          className="flex items-center space-x-2"
          onClick={handleToggle}
        >
          {isCompleted ? (
            <RefreshCcw className="w-4" />
          ) : (
            <Check className="w-4" />
          )}
          <span>{isCompleted ? "Undo" : "Done"}</span>
        </Button>
        <Button
          variant="primary"
          className="p-2"
          onClick={handleTodoDelete}
          disabled={isDisabled}
        >
          <Trash2 className="w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
