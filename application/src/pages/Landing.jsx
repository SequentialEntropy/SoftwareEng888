/**
 * Landing.jsx - A React component for displaying the main page when a user first lands on the website.
 * 
 * @file Handles rendering of the page.
 * @author Carina Jose
 * @author Amreet Dhillon
 * @version 1.1.0 
 * @since 19-02-2025
 */
import { Link } from "react-router-dom";
import styles from "../styles/Landing.module.css";
import MediaQuery from 'react-responsive';
import { useEffect } from "react";

/**
 * Landing Component 
 * 
 * This component represents the landing page - the main page of the website.
 * It fetches includes links to the signup and login pages.
 * 
 * @component 
 * @returns {JSX.Element} The landing page UI.
 */

function Landing() {
    useEffect(() => {
        document.title = "cliMate"
    }, [])

    return <div className={styles.landing_page}>
        <div className={styles.landing_header}>
            <Link className={styles.logo} to="/">888</Link>
            <Link className={styles.login_btn} to="/login">Login</Link>
            <Link className={styles.signup_btn} to="/register">Sign Up</Link>
        </div>
        <div className={styles.landing_main}>
            <h1 className={styles.title}>cliMate</h1>
            <h2 className={styles.slogan}>play for good</h2>
            <Link className={styles.start_btn} to="/login">Get Started</Link>
        </div>
    </div>
}

export default Landing