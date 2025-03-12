import { useState, useEffect } from "react"
import api from "../api"
import styles from "../styles/Profile.module.css";

function Board() {
    const [user, setUser] = useState({
        username: null
    })
    useEffect(() => {
        document.title = "Dashboard"
        getUserDetails()
    }, [])

    const getUserDetails = () => {
        api
            .get("/accounts/me/")
            .then(res => res.data)
            .then(data => {setUser(data); console.log(data)})
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

                <form>

                    <div className={styles.info_row}>
                        <label for="email">Email</label>
                        <input type="text" class="form-control" id="email" placeholder={user.username}></input>
                        <button className={styles.edit}>EDIT</button>
                    </div>
                    <hr className={styles.line} />

                    <div className={styles.info_row}>
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" placeholder={user.username}></input>
                        <button className={styles.edit}>EDIT</button>
                    </div>
                    <hr className={styles.line} />
                </form>

                
            </div>

            
            <a href="reset-password">Reset Password</a>

            <a href="logout" className={styles.logout_btn}>Log Out</a>
        </div>
     
        </div>
    
}

export default Board;