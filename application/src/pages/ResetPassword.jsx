import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Import API helper

function ResetPassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group"> 
                    <label htmlFor="old-password">Old Password</label>
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

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}

                <button type="submit" disabled={!oldPassword || !newPassword}>
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
