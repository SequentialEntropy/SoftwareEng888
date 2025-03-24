import { Link } from "react-router-dom"
import styles from "../styles/Navbar.module.css"
import { useEffect, useState } from "react"
import api from "../api"



function NavBar(){
    const [isAdmin, setIsAdmin] = useState(false)

    const adminCheck = async () => {
        const accountDetails = await api.get("/accounts/me/")
        if (accountDetails.data.is_staff) {
            setIsAdmin(true)
        }
    }

    useEffect(() => {
        adminCheck()
    }, [])
    return (
        <div>
            {/* Sidebar navigation */}
            <nav>
                <div className={styles.sidebar} style={{marginLeft: "20px"}}>
                    <div className={styles.logoContainer}>
                        <h2 className={styles.logoText}>cliMate</h2>
                    </div>
                    <Link to="/home"><i className="bi bi-house-door-fill"  ></i></Link>
                    <Link to="/board"><i className="bi bi-dice-3-fill"  ></i></Link>
                    <Link to="/map"><i className="bi bi-map-fill"  ></i></Link>
                    <Link to="/profile"><i className="bi bi-person-circle"  ></i></Link>
                    {isAdmin && (
                        <Link to="/admin"><i className="bi bi-person-fill-lock"  ></i></Link>
                    )}
                    <Link to="/logout"><i className="bi bi-box-arrow-right"  ></i></Link>
                </div>
            </nav>
        </div>
    )
}

export default NavBar
