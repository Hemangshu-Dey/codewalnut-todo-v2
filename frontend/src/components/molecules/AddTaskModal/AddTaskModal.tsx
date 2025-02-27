import { useState } from "react";
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
  const [titleCharCount, setTitleCharCount] = useState<number>(15);
  const [descCharCount, setDescCharCount] = useState<number>(30);

  const activeCategoryId = useStore((state) => state.activeCategory);
  const todoRender = useStore((state) => state.todoReRender);
  const setTodoRender = useStore((state) => state.setTodoReRender);
  const setCurrentUserState = useStore((state) => state.setCurrentUser);

  if (!isVisible) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title" && value.length > 15) return;
    if (name === "description" && value.length > 30) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "title") {
      setTitleCharCount(15 - value.length);
    }

    if (name === "description") {
      setDescCharCount(30 - value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !selectedDate) {
      toast.error("Empty fields found.");
      return;
    }

    setIsDisabled(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/createToDo`,
        {
          title: formData.title,
          description: formData.description || "No description given",
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
      setTitleCharCount(15);
      setDescCharCount(30);
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

  const handleCancel = () => {
    setFormData({ title: "", description: "" });
    setSelectedDate(new Date());
    setTitleCharCount(15);
    setDescCharCount(30);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/25 backdrop-blur-sm flex justify-center z-50"
      id="wrapper"
    >
      <div className="w-[400px] flex flex-col">
        <div className="bg-white p-4 rounded-xl mt-25">
          <h2 className="text-xl mb-4 font-bold">Write your task.</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="title" className="font-bold text-gray-700">
                Task Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title (Max 15 characters)"
              />
              <p
                className={`text-sm mt-1 ${
                  titleCharCount < 5 ? "text-red-500" : "text-gray-500"
                }`}
              >
                [{titleCharCount}/15]
              </p>
            </div>
            <div className="mb-2">
              <label htmlFor="description" className="font-bold text-gray-700">
                Task Description
              </label>
              <textarea
                id="description"
                name="description"
                className="shadow appearance-none border rounded w-full mt-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description (Max 30 characters)"
              />
              <p
                className={`text-sm mt-1 ${
                  descCharCount < 5 ? "text-red-500" : "text-gray-500"
                }`}
              >
                [{descCharCount}/30]
              </p>
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
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  titleCharCount < 0 || descCharCount < 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={isDisabled || titleCharCount < 0 || descCharCount < 0}
              >
                Submit
              </Button>
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCancel}
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
