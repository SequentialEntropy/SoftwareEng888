/**
 * Form.jsx - A reusable form component for user login and registration.
 *
 * @file Handles authentication form submission: login & register
 * @author Carina Jose
 * @author Amreet Dhillon
 * @author Genki Asahi 
 * @author Yap Wen Xing
 * @author Dany Kelzi
 * @version 1.1.2
 * @since 17-03-2025
 */

import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import styles from "../styles/Form.module.css";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessages, setErrorMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const name = method === "login" ? "Login" : "Register";

    // Forgot password state
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [resetUsername, setResetUsername] = useState("");
    const [resetStatus, setResetStatus] = useState("");

    const openPopup = (e) => {
        e.preventDefault();
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

    const [errorMessages, setErrorMessages] = useState([]); // New state for errors

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (method === "register" && password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            setLoading(false);
            return;
        } else {
            setPasswordError("");
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
        if (method === "register" && !passwordRegex.test(password)) {
            setPasswordError("Password must be at least 8 characters, with a number and special character.");
            setLoading(false);
            return;
        } else {
            setPasswordError("");
        }

        try {
            let data = method === "login"
                ? { username, password }
                : { username, password, email };

            const res = await api.post(route, data);

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/home");
            } else {
                navigate("/login");
            }
        } catch (error) {
            setErrorMessages(error.response.data)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.main_form}>
            <div className={styles.header}>
                <Link className={styles.logo} to="/">888</Link>
                <Link className={styles.logo} to="/">888</Link>
                <h1 className={styles.heading}>cliMate</h1>
                <Link className={styles.header_btn_login} to="/login">Login</Link>
                <Link className={styles.header_btn_sign} to="/register">Sign Up</Link>
            </div>

            <div className={styles.login}>
                <div className={styles.login_container}>
                    <h2>{name}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            {method === "login" && (
                                <>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.login_field}`}
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Username"
                                        required
                                    />
                                    <input
                                        type="password"
                                        className={`form-control ${styles.login_field}`}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                    />
                                    <button
                                        className={styles.forgot_password_btn}
                                        onClick={e => {
                                            e.preventDefault();
                                            setIsForgotPasswordOpen(true);
                                        }}
                                    >
                                        Forgot Password?
                                    </button>
                                </>
                            )}

                            {method === "register" && (
                                <>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.field}`}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Email"
                                        required
                                    />
                                    <input
                                        type="text"
                                        className={`form-control ${styles.field}`}
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Username"
                                        required
                                    />
                                    <input
                                        type="password"
                                        className={`form-control ${styles.field}`}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                    />
                                    <input
                                        type="password"
                                        className={`form-control ${styles.field}`}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        required
                                    />
                                    {/* Checkbox with Privacy Policy Link */}
                                    <label className={styles.signup_label}>
                                        <input type="checkbox" required />
                                        By signing up you agree to our{" "}
                                        <a href="#" onClick={openPopup}>privacy policy</a> and terms and conditions.
                                    </label>

                                    {isOpen && (
                                        <div>
                                            <div style={{
                                                position: "fixed",
                                                top: 0, left: 0,
                                                width: "100%",
                                                height: "100%",
                                                background: "rgba(0, 0, 0, 0.5)",
                                                zIndex: 999
                                            }} onClick={closePopup}></div>

                                            <div style={{
                                                position: "fixed",
                                                top: "50%", left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                backgroundColor: "#D9D9D9",
                                                padding: "20px",
                                                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
                                                borderRadius: "25px",
                                                zIndex: 1000,
                                                width: "40vw", height: "70%",
                                                overflowY: "scroll"
                                            }}>
                                                <span style={{
                                                    cursor: "pointer", color: "black",
                                                    fontWeight: "bold", float: "right"
                                                }} onClick={closePopup}>X</span>
                                                <h1 style={{ color: "black" }}>Welcome to cliMate!</h1>
                                                <p style={{ color: "black" }}>
                                                    By accessing or playing the game, you agree to comply with and be bound by these Terms and Conditions.
                                                </p>
                                                <h3 style={{ color: "black" }}>1. Use of the Website</h3>
                                                <p style={{ color: "black" }}>
                                                    a) You must be at least 16 years old to use this site.<br />
                                                    b) You agree to use the website for lawful purposes only and not to engage in any activities that may harm the website or its users.
                                                </p>
                                                <h3 style={{ color: "black" }}>2. User Accounts</h3>
                                                <p style={{ color: "black" }}>
                                                    a) If you create an account, you are responsible for maintaining its confidentiality. <br />
                                                    b) We reserve the right to suspend or terminate accounts that violate these terms.
                                                </p>
                                                <h3 style={{ color: "black" }}>3. Location Tracking</h3>
                                                <p style={{ color: "black" }}>
                                                    a) Our application may collect and use location data to enhance user experience and provide location-based services.<br />
                                                    b) Location tracking is only active while the application is in use and is not collected in the background.
                                                </p>
                                                <h3 style={{ color: "black" }}>4. Changes to terms</h3>
                                                <p style={{ color: "black" }}>
                                                    We reserve the right to update these Terms and Conditions at any time. Your continued use of the website signifies your acceptance of any changes.
                                                </p>
                                                <h3 style={{ color: "black" }}>Contact us</h3>
                                                <p style={{ color: "black" }}>
                                                    If you have any questions about these Terms and Conditions, don't hesitate to contact us.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                                </>
                            )}
                        </div>

                        {Object.entries(errorMessages).map(([field, message]) => (
                            <p key={field} style={{ color: "red", textAlign: "center" }}>{message}</p>
                        ))}

                        <button type="submit" className={styles.login_btn} disabled={loading}>
                            {loading ? "Processing..." : name}
                        </button>
                    </form>
                </div>
            </div>

            {/* Forgot Password Popup */}
            {isForgotPasswordOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.5)", zIndex: 999
                }} onClick={() => setIsForgotPasswordOpen(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        backgroundColor: "white", width: "90%", maxWidth: "400px", margin: "10% auto",
                        padding: "2rem", borderRadius: "15px", textAlign: "center"
                    }}>
                        <h3>Reset Your Password</h3>
                        <p>Enter your username to receive a reset link.</p>
                        <input
                            type="text"
                            placeholder="Username"
                            value={resetUsername}
                            onChange={e => setResetUsername(e.target.value)}
                            style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
                        />
                        <button onClick={async () => {
                            try {
                                await api.post("/accounts/forgot-password-request/", { username: resetUsername });
                                setResetStatus("If your username exists, a reset link has been sent.");
                            } catch (err) {
                                setResetStatus("Something went wrong. Try again later.");
                            }
                        }} style={{ padding: "0.5rem 1rem", marginBottom: "1rem" }}>
                            Send Reset Link
                        </button>
                        <p>{resetStatus}</p>
                        <button onClick={() => setIsForgotPasswordOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Form;
