/**
 * Profile.jsx - User profile page component 
 * 
 * @file Displays user details, profile settings, interactive elements
 * @author Carina Jose 
 * @author Amreet Dhillon
 * @version 1.0.0 
 * @since 23-02-2025
 */

import { useState, useEffect } from "react"
import api from "../api"
import styles from "../styles/Profile.module.css";

/**
 * Profile Component
 * 
 * This component represents the user profile page which displays user information
 * This component also allows interactions like editing details and logging out 
 * 
 * @component
 * @returns {JSX.Element} The profile page UI
 */

function Profile() {

    // State for user profiles
    const [userProfiles, setUserProfiles] = useState([])

    // State for storing the current user 
    const [user, setUser] = useState({
        username: null
    })

    // States for managing the content and title 
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    /**
     * Fetches user details and profiles when the component loads
     */

    useEffect(() => {
        document.title = "Dashboard"
        getUserProfiles()
        getUserDetails()
    }, [])

    /**
     * Fetches logged in user details from the API
     */

    const getUserDetails = () => {
        api
            .get("/accounts/me/")
            .then(res => res.data)
            .then(data => {setUser(data); console.log(data)})
            .catch(err => alert(err))
    }

    /**
     * Fetches all user profiles from the API 
     */

    const getUserProfiles = () => {
        api
            .get("/accounts/profiles/")
            .then(res => res.data)
            .then(data => {setUserProfiles(data)})
            .catch(err => alert(err))
    }

    // State for managing visibility of the How-To-Play popup 
    const [showPopup, setShowPopup] = useState(false);

    return <div className={styles.main_profile}>
        {/* Sidebar Navigation */}
        <nav>
            <div className={styles.sidebar} style={{marginLeft: "20px"}}>
                <div className={styles.logoContainer}>
                    <h2 className={styles.logoText}>cliMate</h2>
                </div>
                <a href="home"><i className="bi bi-house-door-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="board"><i className="bi bi-dice-3-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="dashboard"><i className="bi bi-map-fill" style={{fontSize: "48px"}} ></i></a>
                <a href="profile"><i className="bi bi-person-circle" style={{fontSize: "48px"}} ></i></a>
                <a href="logout"><i className="bi bi-box-arrow-right" style={{fontSize: "48px"}} ></i></a>
                {/* <a href="{% url 'password_change' %}">Password Change</a> */}
            </div>
            
        </nav>

        {/* Profile Section */}
        <div className={styles.profile_container}>
            <div className={styles.profile_header}>
                <i className="bi bi-person-circle" style={{fontSize: "90px", top:"0"}} ></i>
                <h1 className={styles.profile_name}>{user.username}</h1>
            </div>
    
            {/* Profile Information */}
            <div className={styles.profile_info}>
                <div className={styles.info_row}>
                    <span className={styles.label}>Email Address</span>
                    <span className={styles.edit}>EDIT</span>
                </div>
                <hr className={styles.line} />

                <div className={styles.info_row}>
                    <span className={styles.label}>Username</span>
                    <span className={styles.edit}>EDIT</span>
                </div>
                <hr className={styles.line} />
            </div>
            
            {/* Password reset and logout button */}
            <a href="{% url 'password_change' %}" class="reset_password">Reset Password</a>
            <button className={styles.logout_btn}>Log Out</button>
        </div>

        {/* How to Play popup */}
        <div>
            <button className={styles.how_to_play_btn} onClick={() => setShowPopup(true)}>?</button>

            {showPopup && (
                <div className={styles.overlay}>
                    <div className={styles.how_to_play_container2}>
                        <div className={styles.how_to_play_container3}>
                            <h2 className={styles.how_to_play_title}>How to Play</h2>
                        </div>
                        <p className={styles.how_to_play_instructions}>1. Spin the wheel <br></br>2. Do task at specified location <br></br>3. Scan QR to verify completion <br></br> 4. Get trees</p>
                        <button
                        className={styles.exit_btn}
                        onClick={() => setShowPopup(false)}>x
                        </button>
                    </div>
                    </div>
                )}
            </div>
        </div>
    
}

export default Board;