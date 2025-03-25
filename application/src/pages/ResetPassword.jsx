/**
 * ResetPassword.jsx - A React component for password resets
 * 
 * @file renders the reset password form
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @author Dany Kelzi
 * @version 1.0.0 
 * @since 15-02-2025
 * 
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Import API helper
import NavBar from "../components/Navbar";
import styles from "../styles/ResetPassword.module.css";

/**
 * ResetPassword Component 
 * 
 * This component represents the password reset page.
 * 
 * @component
 * @returns {JSX.Element} A react component representing the password reset page.
 */

function ResetPassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Reset Password"
    }, [])

    /**
     * Handles password resets and propagates it to the API.
     * If any errors occur, all error messages will be shown.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }
    
        try {
            const response = await api.post("/accounts/change-password/", {
                old_password: oldPassword,
                new_password: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Include auth token
                }
            });
    
            setSuccess("Password changed successfully!");
            setError("");
            setTimeout(() => {
                localStorage.clear();
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to change password");
        }
    };
    
    return (
        <div className={styles.main_resetPassword}>
            <NavBar />
            <div className={styles.password_container}>
                <h1>Change Password</h1>
                <br></br>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"> 
                        <input 
                            type="password" 
                            id="old-password" 
                            className="form-control"
                            placeholder="Enter old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
    
                    <div className="form-group"> 
                        <br></br>
                        <label htmlFor="new-password">New Password</label>
                        <input 
                            type="password" 
                            id="new-password" 
                            className="form-control"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
    
                    <div className="form-group"> 
                        <br></br>
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirm-password" 
                            className="form-control"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
    
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
    
                    <button type="submit" disabled={!oldPassword || !newPassword || !confirmPassword} className={styles["reset_btn"]}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
