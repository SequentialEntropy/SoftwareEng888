/**
 * Form.jsx - A reusable form component for user login and registration.
 *
 * @file Handles authentication form submission: login & register
 * @author Carina Jose
 * @author Amreet Dhillon
 * @version 1.1.0
 * @since 15-02-2025
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

        try {
            const res = await api.post(route, { username, password });

            if (method === "login") {
                // Store the authentication tokens
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
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
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Display form title based on method (Login/Register) */}
            <h2>{name}</h2>

            {/* Username input field */}
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>

            {/* Password input field */}
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>

            {/* Submit button */}
            <button type="submit" disabled={loading}>
                {loading ? "Processing..." : name}
            </button>
        </form>
    );
}

export default Form;
