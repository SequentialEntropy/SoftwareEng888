/**
 * AdminTaskForm.jsx - A component for admins to edit any selected task card
 *
 * @file Represents the Task editor
 * @author Carina Jose
 * @author Amreet Dhillon
 * @author Genki Asahi 
 * @author Yap Wen Xing
 * @author Dany Kelzi
 * @version 1.1.2
 * @since 17-03-2025
 */

import { useState, useEffect } from "react"
import api from "../api"
import { squares } from "../constants"
import styles from "../styles/Admin.module.css"

const placeholder = {
    description: "",
    applicable_squares: [],
    score_to_award: "",
}

/**
 * AdminTaskForm Component 
 * 
 * This component handles creation and editing of Task cards in the game.
 * 
 * @component
 * @returns {JSX.Element} A react component with a form to edit Task fields.
 */

export default function AdminTaskForm({ selectedTask, onSuccess }) {
    const [formData, setFormData] = useState(placeholder)

    useEffect(() => {
        if (selectedTask) {
            setFormData(selectedTask) // Prefill form when editing
        }
    }, [selectedTask])

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onCheckboxChange = e => {
        let newApplicableSquares = formData.applicable_squares.filter(
            square_id => square_id !== parseInt(e.target.id)
        )

        if (e.target.checked) {
            newApplicableSquares.push(parseInt(e.target.id))
        }

        setFormData({
            ...formData,
            applicable_squares: newApplicableSquares
        })
    }

    const onSubmit = async e => {
        e.preventDefault()
        try {
            if (selectedTask) {
                // Edit existing task
                await api.put(`/tasks/${selectedTask.id}/`, formData)
            } else {
                // Create new task
                await api.post("/tasks/", formData)
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
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Enter description"
                required
            />
            <input
                type="number"
                name="score_to_award"
                value={formData.score_to_award}
                onChange={onChange}
                placeholder="Enter score to award"
                required
            />

            {squares.map(square => (
                <div key={square.id} className={styles.form_group}>
                    <input
                        type="checkbox"
                        id={square.id}
                        onChange={onCheckboxChange}
                        checked={formData.applicable_squares.includes(square.id)}
                    />
                    <label htmlFor={square.id}>
                        {square.name}
                    </label>
                </div>
            ))}

            <button type="submit">{selectedTask ? "Save Task" : "Create Task"}</button>
        </form>
    )
}