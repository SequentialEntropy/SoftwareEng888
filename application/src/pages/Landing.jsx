/**
 * Landing.jsx - Landing page component 
 * 
 * @file Displays the landing page with branding, login, and signup options
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.0.0 
 * @since 23-02-2025
 */

import styles from "../styles/Landing.module.css";

/**
 * Landing Component 
 * 
 * This component represents the landing page, which features our brand elements and navigation to login or singup.
 * 
 * @component
 * @returns {JSX.Element} The landing page UI
 */

function Landing() {
    return <div className={styles.landing_page}>
        {/* Header section */}
        <div className={styles.landing_header}>
            <h1 className={styles.logo}>888</h1>
            <a className={styles.login_btn}>Login</a>
            <a className={styles.signup_btn}>Sign Up</a>
        </div>

        {/* Main content */}
        <div className={styles.landing_main}>
            <h1 className={styles.title}>cliMate</h1>
            <h2 className={styles.slogan}>play for good</h2>
            <a className={styles.start_btn} href="login">Get Started</a>

        </div>
    </div>
}

export default Landing