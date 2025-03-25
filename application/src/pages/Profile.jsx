/**
 * Profile.jsx - A React component for the profile.
 * 
 * @file allows users to change their username and email to comply with GDPR.
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @author Yap Wen Xing
 * @version 1.1.2
 * @since 14-03-2025
 * 
 */

import { useState, useEffect } from "react";
import api from "../api";
import NavBar from "../components/Navbar";
import styles from "../styles/Profile.module.css";
import { Link } from "react-router-dom";

/**
 * Profile Component 
 * 
 * This component represents the profile page.
 * 
 * @component
 * @returns {JSX.Element} A react component representing the profile page.
 */

function Profile() {
    const [user, setUser] = useState({ username: "", email: "" });
    const [editMode, setEditMode] = useState({ username: false, email: false });
    const [tempUser, setTempUser] = useState({ username: "", email: "" });
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        document.title = "Profile";
        getUserDetails();
    }, []);

    /**
     * Fetches user details from the API and updates the states
     */
    const getUserDetails = () => {
        api.get("/accounts/me/")
            .then(res => {
                setUser(res.data);
                setTempUser(res.data);
            })
            .catch(err => alert("Error fetching user details: " + err));
    };

    /**
     * Toggles editing mode in the corresponding field
     */
    const handleEdit = (field) => {
        setEditMode(prev => ({ ...prev, [field]: true }));
    };

    /**
     * Handles changes in fields and updates the state
     */
    const handleChange = (e) => {
        const { id, value } = e.target;
        setTempUser(prev => ({ ...prev, [id]: value }));
    };

    /**
     * Handles field saves and propagates it to the API
     */
    const handleSave = async field => {
        const data = { [field]: tempUser[field] }
        try {
            await api.put("/accounts/me/", data)
            setUser(prev => ({ ...prev, [field]: tempUser[field] }));
            setEditMode(prev => ({ ...prev, [field]: false }));
            setErrorMessages([])
        } catch (err) {
            setErrorMessages(err.response.data)
        }
    };
    const handleDeleteAccount = async () => {
        try {
            await api.delete("accounts/delete-account/")
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            window.location.href = "/login"  // force redirect to login
        } catch (err) {
            alert("Error deleting account.")
            console.error(err)
        }
    }
    

    return (
        <div className={styles.main_profile}>
            <NavBar />
            <div className={styles.profile_container}>
                <div className={styles.profile_header}>
                    <i className="bi bi-person-circle" style={{ fontSize: "90px" }}></i>
                    <h1 className={styles.profile_name}>{user.username}</h1>
                </div>
                <div className={styles.profile_info}>
                    <form>
                        <div className={styles.info_row}>
                            <input 
                                type="text" 
                                id="email" 
                                className="form-control" 
                                value={editMode.email ? tempUser.email : user.email} 
                                onChange={handleChange} 
                                disabled={!editMode.email} 
                            />
                            {editMode.email ? (
                                <button type="button" className={styles.edit} onClick={() => handleSave("email")}>
                                    SAVE
                                </button>
                            ) : (
                                <button type="button" className={styles.edit} onClick={() => handleEdit("email")}>
                                    EDIT
                                </button>
                            )}
                        </div>
                        <hr className={styles.line} />
                        <div className={styles.info_row}>
                            <input 
                                type="text" 
                                id="username" 
                                className="form-control" 
                                value={editMode.username ? tempUser.username : user.username} 
                                onChange={handleChange} 
                                disabled={!editMode.username} 
                            />
                            {editMode.username ? (
                                <button type="button" className={styles.edit} onClick={() => handleSave("username")}>
                                    SAVE
                                </button>
                            ) : (
                                <button type="button" className={styles.edit} onClick={() => handleEdit("username")}>
                                    EDIT
                                </button>
                            )}
                        </div>
                        <hr className={styles.line} />
                    </form>
                </div>
                {Object.entries(errorMessages).map(([field, message]) => (
                    <p key={field}>{message}</p>
                ))}
                <Link to="/reset-password">Reset Password</Link>
                <Link to="/logout" className={styles.logout_btn}>Log Out</Link>
                <button onClick={handleDeleteAccount} className={styles.deleteAccount_btn}>
                Delete Account
                </button>
            </div>
        </div>
    );
}

export default Profile;
