import { useState, useEffect } from "react"
import api from "../api"
import styles from "../styles/Dashboard.module.css"

function Home() {
    const [userProfiles, setUserProfiles] = useState([])
    const [user, setUser] = useState({
        username: null
    })
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    useEffect(() => {
        document.title = "Dashboard"
        getUserProfiles()
        getUserDetails()
    }, [])

    const getUserDetails = () => {
        api
            .get("/accounts/me/")
            .then(res => res.data)
            .then(data => {setUser(data); console.log(data)})
            .catch(err => alert(err))
    }

    const getUserProfiles = () => {
        api
            .get("/accounts/profiles/")
            .then(res => res.data)
            .then(data => {setUserProfiles(data)})
            .catch(err => alert(err))
    }

    return <div className={styles.main_dashboard}>
        {/* <h1 class="heading">Welcome back {{ user.username }}</h1> */}
        <h1 className={styles.heading}>Welcome back {user.username}</h1>
        <nav>
            <div className={styles.sidebar}>
                <a href="/"><i className="bi bi-house-door-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="board"><i className="bi bi-dice-3-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="dashboard"><i className="bi bi-map-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="dashboard"><i className="bi bi-trophy-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="logout"><i className="bi bi-box-arrow-right" style={{fontSize: "48px"}} ></i></a>
                {/* <a href="{% url 'password_change' %}">Password Change</a> */}
            </div>
            
        </nav>

        <div className={styles.grid}>
            <div className={styles.item}>
                <h1>Level 1</h1>
                <h2>Innovation Centre</h2>
            </div>
            <div className={styles.item}>
                <h1>Leaderboard</h1>
            </div>
            <div className={styles.item}>
                <h1>Progress</h1>
            </div>
            <div className={styles.item}>
                <h1>Map</h1>
            </div>
            <div className={styles.item}>
                <h1>Rewards</h1>
            </div>
        </div>
    </div>
}

export default Home