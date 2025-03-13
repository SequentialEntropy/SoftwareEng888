import { useState, useEffect } from "react"
import api from "../api"

const placeholder = {
    description: "",
    score_to_award: "",
}

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
        <form onSubmit={onSubmit}>
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
            <button type="submit">{selectedChance ? "Save Chance" : "Add Chance"}</button>
        </form>
    )
}