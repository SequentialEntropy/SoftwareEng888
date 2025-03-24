import { useState, useEffect } from "react"
import api from "../api"
import styles from "../styles/Admin.module.css"
import { squares } from "../constants"

const placeholder = {
    username: "",
    email: "",
    is_staff: "",
    usergamestats: {
        current_square: 0,
        current_task: -1,
        score: "",
        task_completed: false
    }
}

export default function AdminUserForm({ selectedUser, tasks, onSuccess }) {
    const [formData, setFormData] = useState(placeholder)

    useEffect(() => {
        if (selectedUser) {
            setFormData(selectedUser) // Prefill form when editing
        }
    }, [selectedUser])

    const onChange = e => {
        const { name, value, type, checked } = e.target
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
    }

    const onGameStatsChange = e => {
        let { name, value, type, checked } = e.target
        switch (type) {
            case "select-one":
                value = parseInt(value)
                break
            case "checkbox":
                value = checked
        }
        setFormData((prev) => ({
            ...prev,
            usergamestats: {
                ...prev.usergamestats,
                [name]: value,
            },
        }))
    }

    const onSubmit = async e => {
        e.preventDefault()
        try {
            if (selectedUser) {
                // Edit existing task
                await api.put(`/admin/users/${selectedUser.id}/`, formData)
            } else {
                // Create new task
                await api.post("/admin/users/", formData)
            }
            setFormData(placeholder)
            onSuccess() // Refresh the parent component
        } catch (error) {
            console.error("Error submitting form", error)
        }
    }

    return (
        <form className={styles.task_form} onSubmit={onSubmit}>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={onChange}
                placeholder="Enter username"
                required
            />
            <input
                type="text"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Enter email"
                required
            />
            <input
                type="checkbox"
                name="is_staff"
                checked={formData.is_staff}
                onChange={onChange}
            />
            <h3>Game Stats</h3>
            <select
                name="current_square"
                value={formData.usergamestats.current_square}
                onChange={onGameStatsChange}
            >
                {squares.map(square => (
                    <option key={square.id} value={square.id}>
                        {square.name}
                    </option>
                ))}
            </select>
            <select
                onChange={onGameStatsChange}
                value={formData.usergamestats.current_task}
                name="current_task"
            >
                <option value="-1">
                    Not Selected
                </option>
                {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                        {task.description}
                    </option>
                ))}
            </select>
            <input
                type="checkbox"
                name="task_completed"
                checked={formData.usergamestats.task_completed}
                onChange={onGameStatsChange}
            />
            <input
                type="number"
                name="score"
                value={formData.usergamestats.score}
                onChange={onGameStatsChange}
                placeholder="Score"
                required
            />
            <button type="submit">{selectedUser ? "Save User" : "Add User"}</button>
        </form>
    )
}