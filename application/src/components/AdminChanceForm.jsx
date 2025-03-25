/**
 * AdminChanceForm.jsx - A component for admins to edit any selected chance card
 *
 * @file Represents the Chance editor
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
import styles from "../styles/Admin.module.css"

const placeholder = {
    description: "",
    score_to_award: "",
}

/**
 * AdminChanceForm Component 
 * 
 * This component handles creation and editing of Chance cards in the game.
 * 
 * @component
 * @returns {JSX.Element} A react component with a form to edit Chance fields.
 */

export default function AdminChanceForm({ selectedChance, onSuccess }) {
    const [formData, setFormData] = useState(placeholder)

    useEffect(() => {
        if (selectedChance) {
            setFormData(selectedChance) // Prefill form when editing
        }
    }, [selectedChance])

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = async e => {
        e.preventDefault()
        try {
            if (selectedChance) {
                // Edit existing chance
                await api.put(`/chances/${selectedChance.id}/`, formData)
            } else {
                // Create new chance
                await api.post("/chances/", formData)
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
            <button type="submit">{selectedChance ? "Save Chance" : "Create Chance"}</button>
        </form>
    )
}