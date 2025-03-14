import { useState, useEffect } from "react"
import api from "../api"
import NavBar from "../components/Navbar";
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
        <NavBar />

        <div className={styles.profile_container}>
            <div className={styles.profile_header}>
                <i className="bi bi-person-circle" style={{fontSize: "90px", top:"0"}} ></i>
                <h1 className={styles.profile_name}>{user.username}</h1>
            </div>

            
             <div className={styles.profile_info}>

                <form>

                    <div className={styles.info_row}>
{/*                         <label for="email">Email</label> */}
                        <input type="text" class="form-control" id="email" placeholder={user.username}></input>
                        <button className={styles.edit}>EDIT</button>
                    </div>
                    <hr className={styles.line} />

                    <div className={styles.info_row}>
{/*                         <label for="username">Username</label> */}
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
