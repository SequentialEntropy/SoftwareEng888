<<<<<<< refs/remotes/origin/forgot-password
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

=======
>>>>>>> local
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
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

<<<<<<< refs/remotes/origin/forgot-password
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

=======
>>>>>>> local
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
<<<<<<< refs/remotes/origin/forgot-password
    
        try {
            const res = await api.post(route, { username, password });
    
=======

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

>>>>>>> local
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/home");
            } else {
                navigate("/login");
            }
        } catch (error) {
<<<<<<< refs/remotes/origin/forgot-password
            if (error.response && error.response.data) {
                // Check if the error is about the username being taken
                if (error.response.data.username) {
                    setErrorMessage(error.response.data.username);
                } else {
                    setErrorMessage(error.response.data.error || "An error occurred. Please try again.");
                }
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
=======
            setErrorMessages(error.response?.data || { error: "Something went wrong." });
>>>>>>> local
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.main_form}>
            <div className={styles.header}>
                <a className={styles.logo} href="/">888</a>
                <h1 className={styles.heading}>cliMate</h1>
<<<<<<< refs/remotes/origin/forgot-password
                <a className={styles.header_btn_login} href="login">Login</a>
                <a className={styles.header_btn_sign} href="Register">Sign Up</a>
                
=======
                <Link className={styles.header_btn_login} to="/login">Login</Link>
                <Link className={styles.header_btn_sign} to="/register">Sign Up</Link>
>>>>>>> local
            </div>

            <div className={styles.login}>
                <div className={styles.login_container}>
                    <h2>{name}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            {method === "login" && (
                                <>
<<<<<<< refs/remotes/origin/forgot-password
                                <input type="text" className={`form-control ${styles.field}`} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                                <input type="password" className={`form-control ${styles.field}`} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                                <button className={styles.forgot_password_btn}>Forgot Password</button>
=======
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
>>>>>>> local
                                </>
                            )}

                            {method === "register" && (
                                <>
<<<<<<< refs/remotes/origin/forgot-password
                                    <input type="text" className={`form-control ${styles.field}`} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                                    <input type="text" className={`form-control ${styles.field}`} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                                    <input type="password" className={`form-control ${styles.field}`} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                                    <input type="password" className={`form-control ${styles.field}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
                                    <div>
                                        {/* Checkbox with Privacy Policy Link */}
                                        <label>
                                            <input type="checkbox" />
                                            By signing up you agree to our{" "}
                                            <a href="#" onClick={openPopup}>privacy policy</a> and terms and conditions.
                                        </label>

                                        {/* Popup and Overlay */}
=======
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
                                    <label style={{ width: "100%" }}>
                                        <input type="checkbox" required />
                                        By signing up you agree to our{" "}
                                        <a href="#" onClick={openPopup}>privacy policy</a> and terms and conditions.
                                    </label>

>>>>>>> local
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
<<<<<<< refs/remotes/origin/forgot-password
                        {/* Display error message after signup forms*/}
                        {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
=======

                        {Object.entries(errorMessages).map(([field, message]) => (
                            <p key={field} style={{ color: "red", textAlign: "center" }}>{message}</p>
                        ))}
>>>>>>> local

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
