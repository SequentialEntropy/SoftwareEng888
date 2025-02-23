import styles from "../styles/Landing.module.css";

function Landing() {
    return <div className={styles.landing_page}>
        <div className={styles.landing_header}>
            <h1 className={styles.logo}>888</h1>
            <a className={styles.login_btn}>Login</a>
            <a className={styles.signup_btn}>Sign Up</a>
        </div>
        <div className={styles.landing_main}>
            <h1 className={styles.title}>cliMate</h1>
            <h2 className={styles.slogan}>play for good</h2>
            <a className={styles.start_btn} href="login">Get Started</a>

        </div>
    </div>
}

export default Landing