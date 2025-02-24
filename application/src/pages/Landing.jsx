import styles from "../styles/Landing.module.css";

function Landing() {
    return <div className={styles.landing_page}>
        <div className={styles.landing_header}>
            <a className={styles.logo} href="/">888</a>
            <a className={styles.login_btn} href="login">Login</a>
            <a className={styles.signup_btn} href="Register">Sign Up</a>
        </div>
        <div className={styles.landing_main}>
            <h1 className={styles.title}>cliMate</h1>
            <h2 className={styles.slogan}>play for good</h2>
            <a className={styles.start_btn} href="login">Get Started</a>

        </div>
    </div>
}

export default Landing