import { Link } from "react-router-dom";
import styles from "../styles/Landing.module.css";
import MediaQuery from 'react-responsive';

function Landing() {
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