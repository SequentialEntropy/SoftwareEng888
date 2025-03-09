/**
 * Map.jsx - A React component for the map page
 * 
 * @file renders the map component
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.0.0 
 * @since 24-02-2025
 * 
 */

import React, { useState } from "react";
import styles from "../styles/Map.module.css";

function Map() {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <div className={styles.game}>
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
                    
                </div>

            </nav>
            

            <div className={styles.map_taskbar}>
                <div className={styles.task_icon}>
                    <i class="bi bi-exclamation-circle-fill"></i>
                </div>
                <div className={styles.task_text}>
                    <h3>Innovation Centre</h3>
                    <h6>Recycle an item</h6>
                </div>
                
            </div>

            <div className={styles.map_container}>

                <iframe className={styles.map} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2525.0015029580495!2d-3.535803808064932!3d50.73846099854676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486da4436e4494cb%3A0x1c62c9fa168f33ac!2sInnovation%20Centre%2C%20Rennes%20Dr%2C%20Exeter%20EX4%204RN!5e0!3m2!1sen!2suk!4v1740407713049!5m2!1sen!2suk" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>

        

        </div>

    )
}
export default Map