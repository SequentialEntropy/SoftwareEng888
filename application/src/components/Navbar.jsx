/**
 * Navbar.jsx - A reusable navbar component for all login-protected routes.
 *
 * @file Handles navigations to other pages
 * @author Carina Jose
 * @author Amreet Dhillon
 * @author Genki Asahi 
 * @author Yap Wen Xing
 * @author Dany Kelzi
 * @version 1.1.2
 * @since 17-03-2025
 */

import { Link } from "react-router-dom"
import styles from "../styles/Navbar.module.css"
import { useEffect, useState } from "react"
import api from "../api"

/**
 * NavBar Component 
 * 
 * This component represents the navigation bar.
 * 
 * @component
 * @returns {JSX.Element} A react component representing the navbar.
 */

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
