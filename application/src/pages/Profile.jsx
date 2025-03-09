import { useState, useEffect } from "react"
import api from "../api"
import styles from "../styles/Profile.module.css";

function Board() {

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

    const [showPopup, setShowPopup] = useState(false);

    return <div className={styles.main_profile}>
        <nav>
            <div className={styles.sidebar} style={{marginLeft: "20px"}}>
                <div className={styles.logoContainer}>
                    <h2 className={styles.logoText}>cliMate</h2>
                </div>
                <a href="home"><i className="bi bi-house-door-fill" ></i></a>
                <a href="board"><i className="bi bi-dice-3-fill"  ></i></a>
                <a href="map"><i className="bi bi-map-fill" ></i></a>
                <a href="profile"><i className="bi bi-person-circle" ></i></a>
                <a href="logout"><i className="bi bi-box-arrow-right" ></i></a>
                
            </div>

        </nav>

        <div className={styles.profile_container}>
            <div className={styles.profile_header}>
                <i className="bi bi-person-circle" style={{fontSize: "90px", top:"0"}} ></i>
                <h1 className={styles.profile_name}>{user.username}</h1>
            </div>
    
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
            
            <a href="{% url 'password_change' %}" class="reset_password">Reset Password</a>

            <button className={styles.logout_btn}>Log Out</button>
        </div>
     
        </div>
    
}

export default Board;