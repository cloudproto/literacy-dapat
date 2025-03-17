import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeadingLarge } from "baseui/typography";
import Sidebar from "../components/Sidebar";
import { createAdmin } from "../services/api"; // Create API call to create admin
import "../styles/Profile.css";

function CreateAdmin() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!name || !email || !password) {
            alert("All fields are required.");
            return;
        }

        setCreating(true);
        const token = localStorage.getItem("token"); // Ensure token is included

        try {
            const response = await createAdmin(token, { full_name: name, email, password });
            alert(`Admin created successfully! Role: Admin`);
            navigate("/createAdmin"); // Redirect to the volunteers page after creation
        } catch (error) {
            console.error("Error creating admin:", error);
            alert("Failed to create admin. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div className="profile-container">
                <HeadingLarge style={{ textAlign: "center", fontSize: "40px" }}>
                    Create Admin
                </HeadingLarge>
                <div className="profile-card">
                    <div className="profile-fields">
                        {[
                            { label: "Full Name", value: name, setter: setName, field: "name", placeholder: "Enter full name" },
                            { label: "Email", value: email, setter: setEmail, field: "email", placeholder: "Enter email" },
                            { label: "Password", value: password, setter: setPassword, field: "password", placeholder: "Enter password", type: "password" }
                        ].map(({ label, value, setter, field, placeholder, type = "text" }) => (
                            <div className="field-group" key={field}>
                                <label htmlFor={field}>{label}</label>
                                <input 
                                    id={field}
                                    type={type} 
                                    value={value} 
                                    placeholder={placeholder}
                                    onChange={(e) => setter(e.target.value)} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="profile-buttons">
                    <button className="cancel-button" onClick={() => navigate("/admin-dashboard")}>Cancel</button>
                    <button className="save-button" onClick={handleCreate} disabled={creating}>
                        {creating ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateAdmin;
