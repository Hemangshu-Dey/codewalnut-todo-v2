import { useState} from "react";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import DatePicker from "../DatePicker/DatePicker";
import { toast } from "sonner";
import axios from "axios";
import useStore from "../../../utils/store";

type AddTaskProps = {
  isVisible: boolean;
  onClose: () => void;
};

const AddTaskModal: React.FC<AddTaskProps> = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const activeCategoryId = useStore((state) => state.activeCategory);
  const todoRender = useStore((state) => state.todoReRender);
  const setTodoRender = useStore((state) => state.setTodoReRender);
  const setCurrentUserState = useStore((state) => state.setCurrentUser);

  if (!isVisible) return null;

 const handleChange = (
   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
   const name = e.target.name;
   const value = e.target.value;

   setFormData((prev) => ({
     ...prev,
     [name]: value,
   }));
 };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsDisabled(true);

    if (!formData.title || !formData.description || !selectedDate) {
      toast.error("Empty fields found.");
      setIsDisabled(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/createToDo`,
        {
          title: formData.title,
          description: formData.description,
          deadline: selectedDate.toISOString(),
          todoCategoryId: activeCategoryId,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(`${formData.title} task added.`);
      setTodoRender(!todoRender);
      setFormData({ title: "", description: "" });
      setSelectedDate(new Date());
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Unable to add task. Try again.");
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

  return (
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-sm flex justify-center items-center z-50"
      id="wrapper"
    >
      <div className="w-[400px] flex flex-col">
        <div className="bg-white p-4 rounded-xl">
          <h2 className="text-xl mb-4 font-bold">Write your task.</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="text"
                id="title"
                name="title"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                id="description"
                name="description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                required
              />
            </div>
            <div className="mb-4">
              <DatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isDisabled}
              >
                Submit
              </Button>
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
