import { useEffect, useState } from "react"
import api from "../api"
import AdminTaskForm from "../components/AdminTaskForm"
import AdminChanceForm from "../components/AdminChanceForm"
import styles from "../styles/Admin.module.css"

export default function Admin() {
    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState(null)
    const [chances, setChances] = useState([])
    const [selectedChance, setSelectedChance] = useState(null)

    const fetchTasks = async () => {
        const tasks = (await api.get("/tasks/")).data
        setTasks(tasks)
    }

    const fetchChances = async () => {
        const chances = (await api.get("/chances/")).data
        setChances(chances)
    }

    useEffect(() => {
        fetchTasks()
        fetchChances()
    }, [])

    const onDeleteTask = async id => {
        try {
            if (id === selectedTask?.id) {
                setSelectedTask(null)
            }
            await api.delete(`/tasks/${id}/`)
            fetchTasks() // Refresh list after delete
        } catch (error) {
            console.error("Error deleting record", error)
        }
    }

    const onDeleteChance = async id => {
        try {
            if (id === selectedChance?.id) {
                setSelectedChance(null)
            }
            await api.delete(`/chances/${id}/`)
            fetchChances() // Refresh list after delete
        } catch (error) {
            console.error("Error deleting record", error)
        }
    }

    return (
        <div className={styles.admin_page} >
            <h1 className={styles.heading}>Admin Dashboard</h1>

            {/* Sidebar navigation */}
            <nav>
                <div className={styles.sidebar} style={{marginLeft: "20px"}}>
                    <div className={styles.logoContainer}>
                        <h2 className={styles.logoText}>cliMate</h2>
                    </div>
                    <a href="home"><i className="bi bi-house-door-fill"  ></i></a>
                    <a href="board"><i className="bi bi-dice-3-fill"  ></i></a>
                    <a href="map"><i className="bi bi-map-fill"  ></i></a>
                    <a href="profile"><i className="bi bi-person-circle"  ></i></a>
                    <a href="logout"><i className="bi bi-box-arrow-right"  ></i></a>
                    {/* <a href="{% url 'password_change' %}">Password Change</a> */}
                </div>
                
            </nav>

            <h2 className={styles.user_heading}>Manage Users</h2>
            <div className={styles.user_panel}>
                
                {/* Form for editing selected Task */}
                

            </div>
            
            
            
            <h2 className={styles.game_heading}>Manage Game</h2>
            <div className={styles.game_manager}>

            <div className={styles.task_panel}>
                <h2 className={styles.task_heading}>ADD TASK</h2>
                {/* Form for editing selected Task */}
                <AdminTaskForm
                    selectedTask={selectedTask}
                    onSuccess={() => {
                        setSelectedTask(null)
                        fetchTasks()
                    }}
                />

                {/* List of Tasks */}
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>
                            <button onClick={() => {setSelectedTask(task)}}>Edit</button>
                            <button onClick={() => onDeleteTask(task.id)}>Delete</button>
                            {task.description}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.chance_panel}>
                <h2 className={styles.chance_heading}>ADD CHANCE</h2>
                {/* Form for editing selected Chance */}
                <AdminChanceForm
                    selectedChance={selectedChance}
                    onSuccess={() => {
                        setSelectedChance(null)
                        fetchChances()
                    }}
                />

                {/* List of Chances */}
                <ul>
                    {chances.map(chance => (
                        <li key={chance.id}>
                            <button onClick={() => setSelectedChance(chance)}>Edit</button>
                            <button onClick={() => onDeleteChance(chance.id)}>Delete</button>
                            {chance.description}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.chance_panel}>
                <h2 className={styles.chance_heading}>ADD LOCATION</h2>
                {/* Form for editing selected Chance */}
                <AdminChanceForm
                    selectedChance={selectedChance}
                    onSuccess={() => {
                        setSelectedChance(null)
                        fetchChances()
                    }}
                />

                {/* List of Chances */}
                <ul>
                    {chances.map(chance => (
                        <li key={chance.id}>
                            <button onClick={() => setSelectedChance(chance)}>Edit</button>
                            <button onClick={() => onDeleteChance(chance.id)}>Delete</button>
                            {chance.description}
                        </li>
                    ))}
                </ul>
            </div>
            </div>
        </div>
    )
}
