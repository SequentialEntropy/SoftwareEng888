import styles from "../styles/Navbar.module.css"


function NavBar(){
    return (
        <div>
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
        </div>
    )
}

export default NavBar