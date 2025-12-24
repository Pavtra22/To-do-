import { useState } from "react";

function Dashboard({ onLogout }) {
  // Theme state default bg
  const [theme, setTheme] = useState("yellow");

  // Add / Edit Task state
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Low");
  const [date, setDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Tasks (dummy data)
  const [tasks, setTasks] = useState([
    { title: "Task 1", priority: "High", date: "2025-12-16", done: true },
    { title: "Task 2", priority: "Low", date: "2025-12-26", done: false },
    { title: "Task 3", priority: "Medium", date: "2025-12-29", done: false }
  ]);

  // Theme classes
  const themes = {
    yellow: "bg-yellow-100",
    orange: "bg-orange-100",
    green: "bg-green-100",
    pink: "bg-pink-100",
  };

  /* ---------- ADD / UPDATE TASK ---------- */
  function addOrUpdateTask() {
    if (!taskText || !date) return;

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex] = {
        title: taskText,
        priority,
        date,
        done: false,
      };
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([
        ...tasks,
        { title: taskText, priority, date, done: false },
      ]);
    }

    setTaskText("");
    setPriority("Low");
    setDate("");
  }

  /* ---------- EDIT ---------- */
  function editTask(index) {
    const t = tasks[index];
    setTaskText(t.title);
    setPriority(t.priority);
    setDate(t.date);
    setEditIndex(index);
  }

  /* ---------- DELETE ---------- */
  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }
  

  /* ---------- CHECKBOX ---------- */
  function toggleDone(index) {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
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
          {editIndex !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Tasks List */}
      <div className="max-w-4xl mx-auto bg-white mt-6 p-6 rounded shadow">
        <h2 className="text-orange-600 font-semibold mb-4">
          Tasks
        </h2>

        {/* LIVE PREVIEW */}
        {taskText && (
          <div className="border-b py-3 opacity-60 italic">
            <p>{taskText}</p>
            <p className="text-sm text-gray-500">
              Priority: {priority} | Due: {date || "not set"}
            </p>
            <p className="text-sm font-semibold text-orange-600">
              Pending
            </p>
          </div>
        )}

        {/* TASK ITEMS */}
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-3"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(index)}
              />

              <div>
                <p className={task.done ? "line-through text-gray-500" : ""}>
                  {task.title}
                </p>

                <p className="text-sm text-gray-500">
                  Priority: {task.priority} | Due: {task.date}
                </p>

                {/* ✅ STATUS TEXT */}
                <p
                  className={`text-sm font-semibold ${
                    task.done ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {task.done ? "Completed" : "Pending"}
                </p>
              </div>
            </div>

            <div className="space-x-4">
              <button
                onClick={() => editTask(index)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(index)}
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
