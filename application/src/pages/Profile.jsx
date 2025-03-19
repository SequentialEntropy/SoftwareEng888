import { useState, useEffect } from "react";
import api from "../api";
import NavBar from "../components/Navbar";
import styles from "../styles/Profile.module.css";
import { Link } from "react-router-dom";

function Board() {
    const [user, setUser] = useState({ username: "", email: "" });
    const [editMode, setEditMode] = useState({ username: false, email: false });
    const [tempUser, setTempUser] = useState({ username: "", email: "" });
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        document.title = "Dashboard";
        getUserDetails();
    }, []);

    const getUserDetails = () => {
        api.get("/accounts/me/")
            .then(res => {
                setUser(res.data);
                setTempUser(res.data);
            })
            .catch(err => alert("Error fetching user details: " + err));
    };

    const handleEdit = (field) => {
        setEditMode(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setTempUser(prev => ({ ...prev, [id]: value }));
    };

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
            </div>
        </div>
    );
}

export default Board;
