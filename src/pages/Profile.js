import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeadingLarge } from "baseui/typography";
import Sidebar from "../components/Sidebar";
import { getUserProfile, saveUserProfile, changePassword } from "../services/api"; // Assuming `changePassword` is implemented
import "../styles/Profile.css";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [volunteerName, setVolunteerName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [skills, setSkills] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const defaultAvatar = "https://via.placeholder.com/100";
    const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState({
        volunteerName: false,
        phoneNumber: false,
        skills: false,
        location: false,
        bio: false,
        password: false // Added for password editing
    });

    // Password related state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.token) {
            navigate("/");
            return;
        }
        fetchProfile(storedUser);
    }, [navigate]);

    const fetchProfile = async (storedUser) => {
        try {
            const profile = await getUserProfile(storedUser.token);
            setUser({ ...storedUser, ...profile });
            setVolunteerName(profile.full_name || "");
            setEmail(profile.email || "");
            setPhoneNumber(profile.phone_number || "");
            setSkills(profile.skills || "");
            setLocation(profile.location || "");
            setBio(profile.bio || "");
            setAvatarPreview(profile.avatar_url || defaultAvatar);
            localStorage.setItem("user", JSON.stringify({ ...storedUser, ...profile }));
        } catch (error) {
            console.error("Error fetching profile:", error);
            alert("Failed to load profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const toggleEdit = (field) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        setSaving(true);
        const formData = new FormData();
        formData.append("full_name", volunteerName);
        formData.append("bio", bio);
        formData.append("phone_number", phoneNumber);
        formData.append("skills", skills);
        formData.append("location", location);
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        try {
            await saveUserProfile(user.token, formData, true);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        try {
            await changePassword(user.token, currentPassword, newPassword);
            alert("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError("");
            setEditMode(prev => ({ ...prev, password: false })); 
        } catch (error) {
            console.error("Password change error:", error);
            alert("Failed to change password. Please try again.");
        }
    };

    if (loading) return <p className="loading">Loading profile...</p>;

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div className="profile-container">
                <HeadingLarge style={{ textAlign: "center", fontSize: "40px" }}>
                    Edit Profile
                </HeadingLarge>
                <div className="profile-card">
                    <div className="profile-avatar-container" onClick={() => document.getElementById("avatarInput").click()}>
                        <img src={avatarPreview} alt="Profile" className="profile-avatar" />
                        <input id="avatarInput" type="file" accept="image/*" onChange={handleAvatarChange} />
                    </div>
                    <div className="profile-fields">
                        {[ 
                            { label: "Full Name", value: volunteerName, setter: setVolunteerName, field: "volunteerName", placeholder: "Enter your full name" },
                            { label: "Phone Number", value: phoneNumber, setter: setPhoneNumber, field: "phoneNumber", placeholder: "Enter your phone number" },
                            { label: "Skills", value: skills, setter: setSkills, field: "skills", placeholder: "Enter your skills" },
                            { label: "Location", value: location, setter: setLocation, field: "location", placeholder: "Enter your location" },
                            { label: "Bio", value: bio, setter: setBio, field: "bio", placeholder: "Enter your bio" }
                        ].map(({ label, value, setter, field, placeholder }) => (
                            <div className="field-group" key={field}>
                                <label htmlFor={field}>{label}</label>
                                <input 
                                    id={field}
                                    type="text" 
                                    value={value} 
                                    placeholder={placeholder}
                                    onChange={(e) => setter(e.target.value)} 
                                    disabled={!editMode[field]} 
                                />
                                <button className="edit-button" onClick={() => toggleEdit(field)}>
                                    {editMode[field] ? "Save" : "Edit"}
                                </button>
                            </div>
                        ))}
                        <div className="field-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" value={email} disabled id="email" />
                        </div>

                        {/* Password edit section */}
                        {editMode.password && (
                            <>
                                <div className="field-group">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        id="currentPassword"
                                        placeholder="Enter your current password"
                                    />
                                </div>
                                <div className="field-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        id="newPassword"
                                        placeholder="Enter your new password"
                                    />
                                </div>
                                <div className="field-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        id="confirmPassword"
                                        placeholder="Confirm your new password"
                                    />
                                </div>
                            </>
                        )}
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>
                </div>
                <div className="profile-buttons">
                    <button className="cancel-button" onClick={() => navigate("/dashboard")}>Cancel</button>
                    <button className="save-button" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="edit-button" onClick={() => toggleEdit("password")}>
                        {editMode.password ? "Cancel" : "Edit Password"}
                    </button>
                    {editMode.password && (
                        <button className="save-button" onClick={handleChangePassword}>
                            Change Password
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
