
/**
 * Home.jsx -  A React component for rendering the main dashboard. 
 * 
 * @file Handles user dashboard display, including user details, leaderboard, and navigation
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.1.0
 * @since 15-02-2025
 */

import { useState, useEffect } from "react"
import api from "../api"
import styles from "../styles/Dashboard.module.css"

/**
 * Home Component 
 * 
 * This component represents the user dashboard.
 * It fetches user profiles and details and displays navigation options, leaderboard, and progress. 
 * 
 * @component 
 * @returns {JSX.Element} The user dashboard UI
 */

function Home() {
    // State to store user profiles
    const [userProfiles, setUserProfiles] = useState([])

    // State to store the current user 
    const [user, setUser] = useState({
        username: null
    })

    // State for storing content and title 
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    /**
     * Fetches user details and profiles when the component initialises 
     */

    useEffect(() => {
        document.title = "Dashboard"
        getUserProfiles()
        getUserDetails()
    }, [])

    /**
     * Fetches logged-in user details from the API 
     */

    const getUserDetails = () => {
        api
            .get("/accounts/me/")
            .then(res => res.data)
            .then(data => {setUser(data); console.log(data)})
            .catch(err => alert(err))
    }

    /**
     * Fetches user profiles from the API 
     */

    const getUserProfiles = () => {
        api
            .get("/accounts/profiles/")
            .then(res => res.data)
            .then(data => {setUserProfiles(data)})
            .catch(err => alert(err))
    }

    return <div className={styles.main_dashboard}>
        {/* Welcome message */}
        <h1 className={styles.heading}>Welcome back {user.username}</h1>

        {/* Sidebar navigation */}
        <nav>
            <div className={styles.sidebar} style={{marginLeft: "20px"}}>
                <div className={styles.logoContainer}>
                    <h2 className={styles.logoText}>cliMate</h2>
                </div>
                <a href="/"><i className="bi bi-house-door-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="board"><i className="bi bi-dice-3-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="dashboard"><i className="bi bi-map-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="profile"><i className="bi bi-person-circle" style={{fontSize: "48px"}} ></i></a>
                <a href="logout"><i className="bi bi-box-arrow-right" style={{fontSize: "48px"}} ></i></a>
                {/* <a href="{% url 'password_change' %}">Password Change</a> */}
            </div>
            
        </nav>

        {/* Dashboard grid layout */}
        <div className={styles.grid}>
            <div className={styles.item}>
                <h1>Level 1</h1>
                <h2>Innovation Centre</h2>
            </div>

            {/* Leaderboard section */}
            <div className={styles.item}>
                <h1>Leaderboard</h1>
                <div className={styles.profileItem}style={{backgroundColor: "#EA526F"}}>
                    <div className={styles.profileIcon}>
                        <a href="profile"><i className="bi bi-person-circle" style={{fontSize: "48px"}} ></i></a>
                    </div>
                    <div className={styles.profileName}>Username1</div>
                </div>
                <div className={styles.profileItem} style={{backgroundColor: "#7F95D1"}}>
                    <div className={styles.profileIcon}>
                        <a href="profile"><i className="bi bi-person-circle" style={{fontSize: "48px"}} ></i></a>
                    </div>
                    <div className={styles.profileName}>Username2</div>
                </div>
                <div className={styles.profileItem} style={{backgroundColor:"#558564"}}>
                    <div className={styles.profileIcon}>
                        <a href="profile"><i className="bi bi-person-circle" style={{fontSize: "48px"}} ></i></a>
                    </div>
                    <div className={styles.profileName}>Username3</div>
                </div>
                <h3>You are at: Position #12</h3>
            </div>

            {/* Progress bar */}
            <div className={styles.item}>
                <progress value="50" max="100" className={styles.progressBar}></progress>
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