import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api";

function Dashboard({ onLogout }) {
  const [theme, setTheme] = useState("yellow");

  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Low");
  const [date, setDate] = useState("");
  const [editTaskObj, setEditTaskObj] = useState(null);

  const [tasks, setTasks] = useState([]);

  const themes = {
    yellow: "bg-yellow-100",
    orange: "bg-orange-100",
    green: "bg-green-100",
    pink: "bg-pink-100",
  };

  // Load tasks once
  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  /* ---------- ADD / UPDATE TASK ---------- */
  async function addOrUpdateTask() {
    if (!taskText || !date) return;

    // UPDATE
    if (editTaskObj) {
      await updateTask(editTaskObj.task_id, {
        ...editTaskObj,
        title: taskText,
        priority,
        due_date: date,
      });
      setEditTaskObj(null);
    } 
    // ADD NEW
    else {
      await createTask({
        user_id: 1,
        title: taskText,
        priority,
        due_date: date,
        is_completed: 0,
      });
    }

    setTaskText("");
    setPriority("Low");
    setDate("");

    loadTasks();
  }

  /* ---------- EDIT ---------- */
  function editTask(task) {
    setTaskText(task.title);
    setPriority(task.priority);
    setDate(task.due_date);
    setEditTaskObj(task);
  }

  /* ---------- DELETE ---------- */
  async function deleteTaskById(id) {
    await deleteTask(id);
    loadTasks();
  }

  /* ---------- CHECKBOX ---------- */
  async function toggleDone(task) {
    await updateTask(task.task_id, {
      ...task,
      is_completed: task.is_completed ? 0 : 1,
    });
    loadTasks();
  }

  return (
    <div className={`min-h-screen ${themes[theme]}`}>
      {/* Header */}
      <div className="bg-orange-500 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">ToDo App</h1>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* Theme Selector */}
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

      {/* Add / Edit Task */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
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

      {/* Tasks List */}
      <div className="max-w-4xl mx-auto bg-white mt-6 p-6 rounded shadow">
        <h2 className="text-orange-600 font-semibold mb-4">Tasks</h2>

        {tasks.map((task) => (
          <div
            key={task.task_id}
            className="flex justify-between items-center border-b py-3"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.is_completed === 1}
                onChange={() => toggleDone(task)}
              />

              <div>
                <p className={task.is_completed ? "line-through text-gray-500" : ""}>
                  {task.title}
                </p>

                <p className="text-sm text-gray-500">
                  Priority: {task.priority} | Due: {task.due_date}
                </p>

                <p
                  className={`text-sm font-semibold ${
                    task.is_completed ? "text-green-600" : "text-orange-600"
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
