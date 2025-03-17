import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { fetchUsers } from "../services/api"; // Create an API call to fetch users data
import "../styles/Accounts.css";

function Accounts() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]); // Holds the users list
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.token) {
            navigate("/");
            return;
        }
        setUser(storedUser);
        fetchUsersData(storedUser.token); // Fetch users data once the user is validated
    }, [navigate]);

    const fetchUsersData = async (token) => {
        try {
            const usersData = await fetchUsers(token); // Assuming fetchUsers is a function to fetch users
            setUsers(usersData);
            setLoading(false);
        } catch (error) {
            alert(error.message || "Failed to fetch users.");
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div className="accounts-container">
                <div className="accounts-card">
                    <h1 className="accounts-title">User Accounts</h1>
                    <div className="accounts-table-container">
                        <table className="accounts-table">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.full_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">No accounts found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Accounts;
