import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTachometerAlt, FaUserEdit, FaList, FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const menuItems = [
        ...(user && user.role === "user" ? [
            { title: "Dashboard", path: "/dashboard", icon: <FaList /> },
            { title: "Profile", path: "/profile", icon: <FaUserEdit /> },
        ] : []),
        ...(user && user.role === "admin" ? [
            { title: "Student Statistics", path: "/statistics", icon: <FaTachometerAlt /> },
            { title: "View Assessments", path: "/admin-dashboard", icon: <FaList /> },
            { title: "Add Volunteer", path: "/createvolunteer", icon: <FaUserEdit /> },
            { title: "Profile", path: "/profile", icon: <FaUserEdit /> },
        ] : []),
        ...(user && user.role === "mngt" ? [
            { title: "Student Statistics", path: "/statistics", icon: <FaTachometerAlt /> },
            { title: "View Assessments", path: "/admin-dashboard", icon: <FaList /> },
            { title: "View Accounts", path: "/accounts", icon: <FaList /> },
            { title: "Add Volunteer", path: "/createvolunteer", icon: <FaUserEdit /> },
            { title: "Add Admin", path: "/createadmin", icon: <FaUserEdit /> },
            { title: "Profile", path: "/profile", icon: <FaUserEdit /> },
        ] : []),
        { title: "Logout", path: "/logout", icon: <FaSignOutAlt /> }
    ];

    return (
        <div style={{
            width: collapsed ? "60px" : "250px",
            height: "100vh",
            background: "#1e1e1e",
            color: "#fff",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily: "'Poppins', sans-serif",
            transition: "width 0.3s ease-in-out",
            overflow: "hidden"
        }}>
            <div>
                <button 
                    style={{
                        background: "none",
                        border: "none",
                        color: "#fff",
                        fontSize: "20px",
                        cursor: "pointer",
                        marginBottom: "20px",
                        width: "100%",
                        textAlign: "center"
                    }}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FaBars />
                </button>

                <ul style={{ listStyle: "none", padding: 0 }}>
                    {menuItems.map((item, index) => (
                        <li key={index} style={{
                            padding: "12px",
                            cursor: "pointer",
                            transition: "0.3s",
                            fontSize: "16px",
                            borderRadius: "5px",
                            marginBottom: "8px",
                            textAlign: collapsed ? "center" : "left",
                            backgroundColor: item.path === "/logout" ? "#444" : (location.pathname === item.path ? "#fff" : "transparent"),
                            color: item.path === "/logout" ? "#fff" : (location.pathname === item.path ? "#000" : "#fff"),
                            fontWeight: location.pathname === item.path ? "bold" : "normal",
                            fontFamily: "'Poppins', sans-serif",
                            display: "flex",
                            alignItems: "center",
                            gap: collapsed ? "0" : "10px",
                            justifyContent: collapsed ? "center" : "flex-start"
                        }} onClick={() => {
                            if (item.path === "/logout") {
                                localStorage.removeItem("user");
                                navigate("/");
                            } else {
                                navigate(item.path);
                            }
                        }} onMouseEnter={(e) => {
                            e.target.style.backgroundColor = item.path === "/logout" ? "#555" : "#333";
                        }} onMouseLeave={(e) => {
                            e.target.style.backgroundColor = item.path === "/logout" ? "#444" : (location.pathname === item.path ? "#fff" : "transparent");
                        }}>
                            <span style={{ fontSize: "18px" }}>{item.icon}</span>
                            {!collapsed && <span>{item.title}</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
