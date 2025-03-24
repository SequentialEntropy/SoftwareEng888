import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import api from "../api"
import styles from "../styles/ForgotPassword.module.css"

<<<<<<< refs/remotes/origin/forgot-password

function ForgotPassword(){
    return <div className={styles.forgot_password_container}>
        <h1 className={styles.heading}>Forgot Password </h1>
        <form className={styles.password_form}>
            <input type="password" placeholder="Enter new password"></input>
            <input type="password" placeholder="Confirm new password"></input>
            <button className={styles.submit_btn} type="submit">Submit</button>
        </form>
    </div>
=======
function ForgotPassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const userId = searchParams.get("user_id")
    const token = searchParams.get("token")

    useEffect(() => {
        document.title = "Forgot Password"
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            await api.post("/reset-password/", {
                user_id: userId,
                token: token,
                new_password: password
            })

            setSuccess("✅ Password reset successful. Redirecting to login...")
            setTimeout(() => {
                navigate("/login")
            }, 2000)
        } catch (err) {
            setError("Something went wrong. Please try again.")
            console.error(err)
        }
    }

    return (
        <div className={styles.forgot_password_container}>
            <h1 className={styles.heading}>Reset Your Password</h1>
>>>>>>> local

            <form className={styles.password_form} onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className={styles.input_error}>{error}</p>}
                {success && <p className={styles.input_success}>{success}</p>}

                <button className={styles.submit_btn} type="submit">Submit</button>
            </form>
        </div>
    )
}

<<<<<<< refs/remotes/origin/forgot-password

export default ForgotPassword;
=======
export default ForgotPassword
>>>>>>> local
