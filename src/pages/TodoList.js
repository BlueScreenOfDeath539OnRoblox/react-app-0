import { useState } from 'react';
import './TodoList.css';

function TodoList() {
    const [tasks, setTasks] = useState([]); // State to manage tasks
    const [input, setInput] = useState(""); // State to manage input field

    // Function to add a new task
    const addTask = () => {
        if (input.trim()) {
            setTasks([...tasks, input]);
            setInput(""); // Clear input field
        }
    };

    // Function to remove a task
    const removeTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1 style={{ color: "white" }}>To-Do List</h1>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a task"
                style={{ padding: "5px", marginRight: "10px" }}
            />
            <button onClick={addTask} style={{ padding: "5px 10px" }}>
                Add Task
            </button>
            <ul style={{ marginTop: "20px" }}>
                {tasks.map((task, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                        {task}{" "}
                        <button
                            onClick={() => removeTask(index)}
                            style={{
                                marginLeft: "10px",
                                padding: "2px 5px",
                                color: "white",
                                backgroundColor: "red",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
