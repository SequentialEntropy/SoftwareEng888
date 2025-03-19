import { useState, useEffect } from "react"
import api from "../api"
import styles from "../styles/ForgotPassword.module.css"

function ForgotPassword(){
    useEffect(() => {
        document.title = "Forgot Password"
    }, [])

    return <div className={styles.forgot_password_container}>
        <h1 className={styles.heading}>Forgot Password </h1>
        <form className={styles.password_form}>
            <input type="password" placeholder="Enter new password"></input>
            <input type="password" placeholder="Confirm new password"></input>
            <button className={styles.submit_btn} type="submit">Submit</button>
        </form>
    </div>



}

export default ForgotPassword;