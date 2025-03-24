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
    const [selectedPage, setSelectedPage] = useState("Users")

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

            <div>
                <button className={styles.page_selector} onClick={() => setSelectedPage("Users")}>
                    Users
                </button>
                <button className={styles.page_selector} onClick={() => setSelectedPage("Tasks")}>
                    Tasks
                </button>
                <button className={styles.page_selector} onClick={() => setSelectedPage("Chances")}>
                    Chances
                </button>
            </div>

            <div className={styles.game_manager}>
                <div className={styles.panel}>
                    <h2 className={styles.panel_heading}>CREATE AND EDIT</h2>

                    {selectedPage === "Users" && (
                        <AdminUserForm
                            selectedUser={selectedUser}
                            tasks={tasks}
                            onSuccess={() => {
                                setSelectedUser(null)
                                fetchUsers()
                            }}
                        />
                    )}

                    {selectedPage === "Tasks" && (
                        <AdminTaskForm
                            selectedTask={selectedTask}
                            onSuccess={() => {
                                setSelectedTask(null)
                                fetchTasks()
                            }}
                        />
                    )}

                    {selectedPage === "Chances" && (
                        <AdminChanceForm
                            selectedChance={selectedChance}
                            onSuccess={() => {
                                setSelectedChance(null)
                                fetchChances()
                            }}
                        />
                    )}

                </div>

                <div className={styles.panel}>
                    <h2 className={styles.panel_heading}>ENTRIES</h2>

                    {selectedPage === "Users" && (
                        <ul className={styles.entries}>
                            {users.map(user => (
                                <li key={user.id} className={styles.entry}>
                                    <button onClick={() => {setSelectedUser(user)}}>Edit</button>
                                    <button onClick={() => onDeleteUser(user.id)}>Delete</button>
                                    <p>{user.username}</p>
                                </li>
                            ))}
                        </ul>
                    )}

                    {selectedPage === "Tasks" && (
                        <ul className={styles.entries}>
                            {tasks.map(task => (
                                <li key={task.id} className={styles.entry}>
                                    <button onClick={() => {setSelectedTask(task)}}>Edit</button>
                                    <button onClick={() => onDeleteTask(task.id)}>Delete</button>
                                    <p>{task.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}

                    {selectedPage === "Chances" && (
                        <ul className={styles.entries}>
                            {chances.map(chance => (
                                <li key={chance.id} className={styles.entry}>
                                    <button onClick={() => setSelectedChance(chance)}>Edit</button>
                                    <button onClick={() => onDeleteChance(chance.id)}>Delete</button>
                                    <p>{chance.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            </div>
        </div>
    )
}
