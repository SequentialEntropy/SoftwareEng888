
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
    // State to store the current user 
    const [currentUser, setCurrentUser] = useState({
        username: null,
        usergamestats: {
            current_square: 0,
            score: 0,
        }
    })

    const [rankedUsers, setRankedUsers] = useState([])

    const leaderboardColors = [
        "#EA526F",
        "#7F95D1",
        "#558564"
    ]

    /**
     * Fetches user details and profiles when the component initialises 
     */
    useEffect(() => {
        document.title = "Dashboard"
        getUserDetails()
        getRankedUsers()
    }, [])

    /**
     * Fetches logged-in user details from the API 
     */
    const getUserDetails = () => {
        api
            .get("/accounts/me/")
            .then(res => res.data)
            .then(data => {setCurrentUser(data); console.log(data)})
            .catch(err => alert(err))
    }

    const getRankedUsers = () => {
        api
            .get("/accounts/ranked-users/")
            .then(res => res.data)
            .then(data => {setRankedUsers(data)})
            .catch(err => alert(err))
    }

    const leaderScore = rankedUsers.length > 0 ? rankedUsers[0].usergamestats?.score || 0 : 0;
    const userScore = currentUser.usergamestats?.score || 0;

    const progress = leaderScore > 0 ? (userScore / leaderScore) * 100 : 0;

    return <div className={styles.main_dashboard}>
        {/* Welcome message */}
        <h1 className={styles.heading}>Welcome back {currentUser.username}</h1>

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

        {/* Dashboard grid layout */}
        <div className={styles.grid}>
            <div className={styles.item}>
                <a href="board">Level 1</a>
                <h2>Innovation Centre</h2>
            </div>

            {/* Leaderboard section */}
            <div className={styles.item}>
                <h1 style={{marginTop: "20px"}}>Leaderboard</h1>

                { /* Get the top 3 users */
                rankedUsers.slice(0, 3).map((user, index) => (
                    <div key={user.id} className={styles.profileItem} style={{backgroundColor: leaderboardColors[index]}}>
                        <div className={styles.profileIcon}>
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className={styles.profileName}>{user.username} - {user.usergamestats?.score}</div>
                    </div>
                ))}

                <h3>You are at: Position #{rankedUsers.findIndex(user => user.id === currentUser.id) + 1}</h3>
            </div>

            {/* Progress bar */}
            <div className={styles.item}>
                <progress value={Math.min(progress,100)} max="100" className={styles.progressBar}></progress>
            </div>
            <div className={styles.item}>
                <a href="map">Map</a>
            </div>

            {/* Points section */}
            <div className={styles.item}>
                <h1>Your points</h1>
                <div className={styles.points_container}>
                    <div className={styles.pointsItem} style={{alignItems:"center"}}>
                        <div className={styles.pointsIcon}>
                            <i className="bi bi-tree-fill" style={{textAlign:"center"}} ></i>
                        </div>
                        <h2>{currentUser.usergamestats.score}</h2>
                    </div>
                </div>
            
            </div>
        </div>
    </div>
}

export default Home
