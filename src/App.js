import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider, LightTheme } from "baseui";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Assessments from "./pages/Assessments";
import AssessmentsTest from "./pages/AssessmentsTest";
import Statistics from "./pages/Statistics";
import CreateVolunteer from "./pages/CreateVolunteer";
import CreateAdmin from "./pages/CreateAdmin";
import Accounts from "./pages/Accounts";


const engine = new Styletron();

function ProtectedRoute({ element, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || !user.token || !user.role) {
        return <Navigate to="/" replace />;
    }

    return allowedRoles.includes(user.role) ? element : <Navigate to="/" replace />;
}

function App() {
    return (
        <StyletronProvider value={engine}>
            <BaseProvider theme={LightTheme}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["user", "admin", "mngt"]} />} />
                        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin", "mngt"]} />} />
                        <Route path="/statistics" element={<ProtectedRoute element={<Statistics />} allowedRoles={["admin", "mngt"]} />} />
                        <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={["user", "admin", "mngt"]} />} />
                        <Route path="/assessments" element={<ProtectedRoute element={<Assessments />} allowedRoles={["user"]} />} />
                        <Route path="/assessments/:assessmentId" element={<ProtectedRoute element={<AssessmentsTest />} allowedRoles={["user"]} />} />
                        <Route path="/createVolunteer" element={<ProtectedRoute element={<CreateVolunteer />} allowedRoles={["admin", "mngt"]} />} />
                        <Route path="/createAdmin" element={<ProtectedRoute element={<CreateAdmin />} allowedRoles={["mngt"]} />} />
                        <Route path="/accounts" element={<ProtectedRoute element={<Accounts />} allowedRoles={["mngt"]} />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </BaseProvider>
        </StyletronProvider>
    );
}

export default App;
