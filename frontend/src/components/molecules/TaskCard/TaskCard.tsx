import { useState, useEffect } from "react";
import Button from "../../atoms/Button/Button";
import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-lg p-4 flex flex-col border-gray-100 min-h-[200px]"
    >
      <div>
        <h3
          className={`text-lg font-semibold mb-2 ${
            isCompleted ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {todos.title}
        </h3>
        <p className="text-gray-600 mb-2">{todos.description}</p>
        <p className={`text-sm ${deadlineColor} mt-10 mb-5`}>
          Deadline: {date}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="primary"
          className="flex items-center space-x-2"
          onClick={() => setIsCompleted(!isCompleted)}
        >
          <Check className="w-4" />
          <span>{isCompleted ? "Undo" : "Done"}</span>
        </Button>

        <Button variant="primary" className="p-2">
          <Trash2 className="w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
