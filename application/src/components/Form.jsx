/**
 * Form.jsx - A reusable form component for user login and registration.
 *
 * @file Handles authentication form submission: login & register
 * @author Carina Jose
 * @author Amreet Dhillon
 * @author Genki Asahi 
 * @author Yap Wen Xing
 * @author Dany Kelzi
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

    const [isOpen, setIsOpen] = useState(false);

    const openPopup = (e) => {
      e.preventDefault(); // Prevents default anchor behavior
      setIsOpen(true);
    };
  
    const closePopup = () => {
      setIsOpen(false);
    };

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

    const [errorMessage, setErrorMessage] = useState(""); // New state for errors

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
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error || "Invalid credentials. Please try again.");
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        
        <div className={styles.main_form}>
    
            {/* Header section */}
            <div className={styles.header}>
                <a className={styles.logo} href="/">888</a>
                <h1 className={styles.heading}>cliMate</h1>
                <a className={styles.header_btn_login} href="login">Login</a>
                <a className={styles.header_btn_sign} href="Register">Sign Up</a>
                
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
                                    <div>
                                        {/* Checkbox with Privacy Policy Link */}
                                        <label>
                                            <input type="checkbox" />
                                            By signing up you agree to our{" "}
                                            <a href="#" onClick={openPopup}>privacy policy</a> and terms and conditions.
                                        </label>

                                        {/* Popup and Overlay */}
                                    {isOpen && (
                                        <div>
                                        <div 
                                            style={{
                                            position: "fixed",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            background: "rgba(0, 0, 0, 0.5)",
                                            zIndex: 999
                                            }}
                                            onClick={closePopup}
                                        ></div>

                                        <div 
                                            style={{
                                            position: "fixed",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            backgroundColor: "#D9D9D9",
                                            padding: "20px",
                                            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                            borderRadius: "25px",
                                            zIndex: 1000
                                            }}
                                        >
                                            <span 
                                            style={{
                                                cursor: "pointer",
                                                color: "black",
                                                fontWeight: "bold",
                                                float: "right"
                                            }}
                                            onClick={closePopup}
                                            >
                                            X
                                            </span>
                                            <h1 style={{ color: "black" }}>1. Welcome to cliMate! </h1> <p style={{ color: "black" }}>By accessing or playing the game, you agree to comply with and be bound by these Terms and Conditions. <br></br></p>
                                            <h3 style={{ color: "black" }}>2. Use of the Website</h3>

                                            <p style={{ color: "black" }}>a) You must be at least 16 years old to use this site.<br></br>
                                            b) You agree to use the website for lawful purposes only and not to engage in any activities that may harm the website or its users.</p>
                                            <h3 style={{ color: "black" }}>3. User Accounts</h3>
                                            <p style={{ color: "black" }}>a) If you create an account, you are responsible for maintaining its confidentiality. <br></br> 
                                            b) We reserve the right to suspend or terminate accounts that violate these terms. </p>
                                            <h3 style={{ color: "black" }}>4. Location Tracking</h3>
                                            <p style={{ color: "black" }}>a) Our application may collect and use location data to enhance user experience and provide location-based services.<br></br> 
                                            b) Location tracking is only active while the application is in use and is not collected in the background.</p>
                                            <h3 style={{ color: "black" }}>5. Changes to terms</h3>
                                            <p style={{ color: "black" }}>We reserve the right to update these Terms and Conditions at any time. Your continued use of the website signifies your acceptance of any changes.</p>
                                            <h3 style={{ color: "black" }}>6. Contact us</h3>
                                            <p style={{ color: "black" }}>If you have any questions about these Terms and Conditions, don't hesitate to contact us. </p>
                                        </div>
                                        </div>
                                    )}
                                    </div>
                                    
                                    {/* Display password mismatch error */}
                                    {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                                </>
                            )}
                        </div>
                        {/* Display error message after signip forms*/}
                        {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}

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