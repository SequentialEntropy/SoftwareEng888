
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
import NavBar from "../components/Navbar";
import styles from "../styles/Dashboard.module.css"
import { Link } from "react-router-dom";
import { squares } from "../constants";

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

    /**
     * Fetches users from the API based on highest ranking order
     */
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
        <NavBar />

        {/* Dashboard grid layout */}
        <div className={styles.grid}>
            <div className={styles.item}>
                <Link to="/board">You are at</Link>
                <h2>{squares[currentUser.usergamestats.current_square].name}</h2>
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
                <Link to="/map">Map</Link>
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
