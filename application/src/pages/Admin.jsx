import { useEffect, useState } from "react"
import api from "../api"
import AdminTaskForm from "../components/AdminTaskForm"
import AdminChanceForm from "../components/AdminChanceForm"
import NavBar from "../components/Navbar";
import styles from "../styles/Admin.module.css"
import AdminUserForm from "../components/AdminUserForm";

export default function Admin() {
    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState(null)
    const [chances, setChances] = useState([])
    const [selectedChance, setSelectedChance] = useState(null)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)

    const fetchTasks = async () => {
        const tasks = (await api.get("/tasks/")).data
        setTasks(tasks)
    }

    const fetchChances = async () => {
        const chances = (await api.get("/chances/")).data
        setChances(chances)
    }

    const fetchUsers = async () => {
        const users = (await api.get("/admin/users/")).data
        setUsers(users)
    }

    useEffect(() => {
        document.title = "Admin"
        fetchTasks()
        fetchChances()
        fetchUsers()
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

    const onDeleteUser = async id => {
        try {
            if (id === selectedUser?.id) {
                setSelectedUser(null)
            }
            await api.delete(`/admin/users/${id}/`)
            fetchUsers() // Refresh list after delete
        } catch (error) {
            console.error("Error deleting record", error)
        }
    }

    return (
        <div className={styles.admin_page} >
            <h1 className={styles.heading}>Admin Dashboard</h1>

            {/* Sidebar navigation */}
            <NavBar />

            <h2 className={styles.user_heading}>Manage Users</h2>
            <div className={styles.user_panel}>
                <h2 className={styles.task_heading}>ADD TASK</h2>
                {/* Form for editing selected User */}
                <AdminUserForm
                    selectedUser={selectedUser}
                    tasks={tasks}
                    onSuccess={() => {
                        setSelectedUser(null)
                        fetchUsers()
                    }}
                />

                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <button onClick={() => {setSelectedUser(user)}}>Edit</button>
                            <button onClick={() => onDeleteUser(user.id)}>Delete</button>
                            {user.username}
                        </li>
                    ))}
                </ul>
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
