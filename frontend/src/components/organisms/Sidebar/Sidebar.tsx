import { useState } from "react";
import { Menu, X, Trash } from "lucide-react";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import axios from "axios";
import { toast } from "sonner";
import useStore from "../../../utils/store";

interface categoryName {
  categoryName: string;
  _id: string;
  createdAt: Date;
  todos: Array<string>;
  updatedAt: Date;
  __v: number;
}

interface SidebarProps {
  categoryNames: Array<categoryName>;
}

const Sidebar: React.FC<SidebarProps> = ({ categoryNames }) => {
  const [isOpen, setIsOpen] = useState(true);

  const [categoryValue, setCategoryValue] = useState<string>("");
  const categoryRender = useStore((state) => state.categoryReRender);
  const setCategoryRender = useStore((state) => state.setCategoryReRender);

  const activeCategory = useStore((state) => state.activeCategory);
  const setActiveCategory = useStore((state) => state.setActiveCategory);

  const setCurrentUserState = useStore((state) => state.setCurrentUser);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const changeActiveCategory = (item: categoryName) => {
    if (item._id) setActiveCategory(item._id);
  };

  const handleCategoryValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryValue(e.target.value);
  };

  const handleCategoryDelete = async (
    e: React.MouseEvent,
    item: categoryName
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDisabled(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/deleteToDoCategory?id=${
          item._id
        }`,
        {
          withCredentials: true,
        }
      );
      toast.success(`${item.categoryName} category deleted.`);
      setCategoryRender(!categoryRender);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        if (error.response?.status == 401) {
          toast.error(`Failed to delete category. Try again.`);
          setCurrentUserState({
            userid: "",
            username: "",
          });
        } else {
          toast.error(`${error.response?.data.message}.`);
        }
      } else {
        toast.error(`An unknown error occurred.`);
      }
    }

    setIsDisabled(false);
  };

  const handleAddCategory = async () => {
    setIsDisabled(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/createToDoCategory`,
        {
          categoryName: categoryValue,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(`${categoryValue} category added.`);
      setCategoryRender(!categoryRender);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 401) {
          toast.error(`Unable to add category. Try again.`);
          setCurrentUserState({
            userid: "",
            username: "",
          });
        } else {
          toast.error(`${error.response?.data.message}.`);
        }
      } else {
        toast.error(`An unknown error occurred.`);
      }
    }
    setCategoryValue("");
    setIsDisabled(false);
  };

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 p-2 rounded-lg bg-white shadow-lg md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-lg transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 z-0`}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold mt-4">Add Todo Categories</h2>
            <X onClick={() => setIsOpen(false)}  className="md:hidden"/>
          </div>

          {/* Category Name input */}
          <div className="relative">
            <Input
              id="search"
              name="search"
              label=""
              value={categoryValue}
              onChange={handleCategoryValueChange}
              type="text"
              placeholder="Enter Category name..."
              className="w-full px-4 py-2 rounded-lg"
            />
          </div>

          {/* Action button */}
          <Button
            className="w-full"
            onClick={handleAddCategory}
            disabled={isDisabled}
          >
            Add category
          </Button>

          {/* Category Names List */}
          <hr></hr>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Todo Categories</h2>
          </div>
          <div className="mt-4">
            <ul className="space-y-2">
              {categoryNames.map((item) => (
                <li key={item?._id}>
                  <button
                    onClick={() => {
                      changeActiveCategory(item);
                    }}
                    className={`w-full flex items-center space-x-3 p-2 rounded-md transition-colors ${
                      activeCategory === item._id
                        ? "bg-blue-300 text-white"
                        : "text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex items-center space-x-2">
                        {/* <Clipboard className="w-5 h-5" /> */}
                        <span>{item?.categoryName}</span>
                      </div>
                      <button
                        onClick={(e) => handleCategoryDelete(e, item)}
                        disabled={isDisabled}
                        className="hover:scale-110"
                      >
                        <Trash className="w-5 h-5 hover:text-red-400" />
                      </button>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
