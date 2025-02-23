/**
 * Form.jsx - A reusable form component for user login and registration.
 *
 * @file Handles authentication form submission: login & register
 * @author Carina Jose
 * @author Amreet Dhillon
 * @author Genki Asahi 
 * @author Yap Wen Xing
 * @version 1.1.0
 * @since 23-02-2025
 */

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import styles from "../styles/Form.module.css";

/**
 * Form Component
 * 
 * This component renders a form for user authentication (Login or Register).
 * 
 * @component
 * @param {string} route - API endpoint for form submission.
 * @param {string} method - Specifies whether the form is for "login" or "register".
 * @returns {JSX.Element} A form for user authentication.
 */

function Form({ route, method }) {
    // State for storing the input username
    const [username, setUsername] = useState("");

    // State for storing the password input
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // State to indicate if a request is loading
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    /**
     * Handles form submission.
     *
     * - Prevents default form behavior.
     * - Sends a POST request to authenticate/register the user.
     * - If login is successful, stores tokens in local storage and navigates to homepage.
     * - If user just registered, redirects user to login page.
     * - Alerts the user in case of an error.
     *
     * @param {Event} e - Form submission event.
     */

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        // Password confirmation validation for registration
        if (method === "register" && password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            setLoading(false);
            return;
        } else {
            setPasswordError("");
        }

        try {
            const res = await api.post(route, { username, password });

            if (method === "login") {
                // Store the authentication tokens
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/home");
            } else {
                // Redirect user to login page after registration
                navigate("/login");
            }
        } catch (error) {
            alert(error); // Display error alert
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.main_form}>
    
            {/* Header section */}
            <div className={styles.header}>
                <h1 className={styles.logo}>888</h1>
                <h1 className={styles.heading}>cliMate</h1>
                <a className={styles.header_btn_login}>Login</a>
                <a className={styles.header_btn_sign}>Sign Up</a>
            </div>
    
            <div className={styles.login}>
                <div className={styles.login_container}>
                    {/* Display form title based on method (Login/Register) */}
                    <h2>{name}</h2>
    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            {/* Username input field */}
                            <input type="text" className={`form-control ${styles.field}`} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username/Email" required />
    
                            {/* Password input field */}
                            <input type="password" className={`form-control ${styles.field}`} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
    
                            {/* Confirm Password input field */}
                            {method === "register" && (
                                <>
                                    <input type="password" className={`form-control ${styles.field}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
                                    
                                    {/* Display password mismatch error */}
                                    {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                                </>
                            )}
                        </div>
    
                        {/* Submit button */}
                        <button type="submit" className={styles.login_btn} disabled={loading}>
                            {loading ? "Processing..." : name}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
                            }
    
    export default Form;