import { useState, useEffect, useRef } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api";
import { toast } from "react-toastify";

function Dashboard({ onLogout }) {
  const [theme, setTheme] = useState("yellow");
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Low");
  const [date, setDate] = useState("");
  const [editTaskObj, setEditTaskObj] = useState(null);
  const formRef = useRef(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState("soonest");

  const themes = {
    yellow: "bg-yellow-100",
    orange: "bg-orange-100",
    green: "bg-green-100",
    pink: "bg-pink-100",
  };

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border border-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Low":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border";
    }
  };

  const isOverdue = (task) => {
    const today = new Date();
    const due = new Date(task.due_date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return task.is_completed === 0 && due < today;
  };

  /* ---------- FILTER + SORT ---------- */
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "Pending") return task.is_completed === 0;
    if (statusFilter === "Completed") return task.is_completed === 1;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const d1 = new Date(a.due_date);
    const d2 = new Date(b.due_date);
    return sortOrder === "soonest" ? d1 - d2 : d2 - d1;
  });

  /* ---------- LOAD TASKS ---------- */
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  /* ---------- ADD / UPDATE ---------- */
  async function addOrUpdateTask() {
    if (!taskText || !date) {
      toast.error("Please enter task and date");
      return;
    }

    try {
      if (editTaskObj) {
        await updateTask(editTaskObj.task_id, {
          ...editTaskObj,
          title: taskText,
          priority,
          due_date: date,
        });
        toast.info("Task updated");
        setEditTaskObj(null);
      } else {
        await createTask({
          user_id: 1,
          title: taskText,
          priority,
          due_date: date,
          is_completed: 0,
        });
        toast.success("Task created");
      }

      setTaskText("");
      setPriority("Low");
      setDate("");
      loadTasks();
    } catch {
      toast.error("Something went wrong");
    }
  }

  /* ---------- EDIT ---------- */
  function editTask(task) {
    setEditTaskObj(task);
    setTaskText(task.title);
    setPriority(task.priority);
    setDate(task.due_date);

    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- DELETE ---------- */
  async function deleteTaskById(id) {
    await deleteTask(id);
    toast.warn("Task deleted");
    loadTasks();
  }

  /* ---------- TOGGLE COMPLETE ---------- */
  async function toggleDone(task) {
    await updateTask(task.task_id, {
      ...task,
      is_completed: task.is_completed ? 0 : 1,
    });

    toast.success(
      task.is_completed ? "Marked Pending" : "Marked Completed"
    );

    loadTasks();
  }

  return (
    <div className={`min-h-screen ${themes[theme]}`}>

      {/* HEADER */}
      <div className="bg-orange-500 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">ToDo App</h1>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* THEME DROPDOWN */}
      <div className="p-6">
        <select
          onChange={(e) => setTheme(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="yellow">Default</option>
          <option value="orange">Orange</option>
          <option value="green">Green</option>
          <option value="pink">Pink</option>
        </select>
      </div>

      {/* ADD / EDIT CARD */}
      <div
        ref={formRef}
        className="max-w-4xl mx-auto bg-white p-6 rounded shadow"
      >
        <h2 className="text-orange-600 font-semibold mb-4">
          Add / Edit Task
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            placeholder="Task details"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            className="p-2 border rounded"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <button
          onClick={addOrUpdateTask}
          className="mt-4 bg-orange-500 text-white px-6 py-2 rounded"
        >
          {editTaskObj ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* TASK LIST CARD */}
      <div className="max-w-4xl mx-auto bg-white mt-6 p-6 rounded shadow">

        <h2 className="text-orange-600 font-semibold mb-4">Tasks</h2>

        {/* FILTER + SORT */}
        <div className="flex gap-3 mb-4">

          <button
            onClick={() => setStatusFilter("All")}
            className={`px-3 py-1 rounded border ${
              statusFilter === "All" ? "bg-orange-500 text-white" : ""
            }`}
          >
            All
          </button>

          <button
            onClick={() => setStatusFilter("Pending")}
            className={`px-3 py-1 rounded border ${
              statusFilter === "Pending" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setStatusFilter("Completed")}
            className={`px-3 py-1 rounded border ${
              statusFilter === "Completed" ? "bg-orange-500 text-white" : ""
            }`}
          >
            Completed
          </button>

          <button
            onClick={() =>
              setSortOrder(sortOrder === "soonest" ? "latest" : "soonest")
            }
            className="px-3 py-1 border rounded bg-gray-100"
          >
            Sort: {sortOrder === "soonest" ? "Soonest First" : "Latest First"}
          </button>
        </div>

        {/* TASK ROWS */}
        {sortedTasks.map((task) => (
          <div
            key={task.task_id}
            className={`flex justify-between items-center border-b py-3 rounded 
              ${
                isOverdue(task)
                  ? "bg-red-50 border-red-300"
                  : "bg-white border-gray-200"
              }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.is_completed === 1}
                onChange={() => toggleDone(task)}
              />

              <div>
                <p
                  className={
                    task.is_completed ? "line-through text-gray-500" : ""
                  }
                >
                  {task.title}
                </p>

                <p className="text-sm text-gray-500 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getPriorityClasses(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  | Due: {task.due_date}
                </p>

                <p
                  className={`text-sm font-semibold ${
                    task.is_completed
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {task.is_completed ? "Completed" : "Pending"}
                </p>
              </div>
            </div>

            <div className="space-x-4">
              <button
                onClick={() => editTask(task)}
                className="text-blue-500"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTaskById(task.task_id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Dashboard;
