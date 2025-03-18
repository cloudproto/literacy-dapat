import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { HeadingLarge } from "baseui/typography";
import { getAssessments, getAssessmentById, updateAssessment, getUserProfile } from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
    const [assessments, setAssessments] = useState([]);
    const [dialog, setDialog] = useState({ show: false, assessment: null });
    const [profileComplete, setProfileComplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const data = await getAssessments(token);
                setAssessments(data.sort((a, b) => a.id - b.id));
            } catch (error) {
                console.error("Error fetching assessments:", error);
            }
        };

        const checkProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const profile = await getUserProfile(token);
                const requiredFields = ["full_name", "phone_number", "skills", "location", "bio"];
                setProfileComplete(requiredFields.every(field => profile[field] && profile[field].trim() !== ""));
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchData();
        checkProfile();
    }, []);

    const handleAssessmentClick = async (assessment) => {
        if (assessment.status === "Completed") {
            try {
                const token = localStorage.getItem("token");
                const data = await getAssessmentById(token, assessment.id);
                setDialog({ show: true, assessment: data });
            } catch (error) {
                console.error("Error fetching assessment details:", error);
            }
            return;
        }

        if (assessment.status === "Not Started") {
            setDialog({ show: true, assessment });
        } else {
            navigate(`/assessments/${assessment.id}`);
        }
    };

    const confirmStartAssessment = async () => {
        if (!dialog.assessment) return;

        try {
            const token = localStorage.getItem("token");
            await updateAssessment(dialog.assessment.id, { status: "Started" }, token);
            setAssessments(prev => prev.map(a => (a.id === dialog.assessment.id ? { ...a, status: "Started" } : a)));
            navigate(`/assessments/${dialog.assessment.id}`);
        } catch (error) {
            console.error("Error updating assessment:", error);
        }

        setDialog({ show: false, assessment: null });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Not Started": return "#f0f0f0";
            case "Started": return "#cce5ff";
            case "Completed": return "#d4edda";
            default: return "#e0e0e0";
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "20px", background: "#f8f5fc", position: "relative" }}>
                <HeadingLarge>Volunteer</HeadingLarge>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <HeadingLarge>Assessments</HeadingLarge>
                    <button 
                        onClick={() => profileComplete ? navigate("/assessments") : alert("Complete your profile to proceed.")}
                        style={{
                            background: profileComplete ? "#f48fb1" : "#ccc",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            fontSize: "24px",
                            cursor: profileComplete ? "pointer" : "not-allowed"
                        }}
                        disabled={!profileComplete}
                    >
                        +
                    </button>
                </div>
                {assessments.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                        {assessments.map((assessment) => (
                            <div 
                                key={assessment.id} 
                                style={{ 
                                    background: getStatusColor(assessment.status),
                                    padding: "20px", 
                                    borderRadius: "10px", 
                                    cursor: "pointer"
                                }}
                                onClick={() => handleAssessmentClick(assessment)}
                            >
                                <HeadingLarge style={{ textAlign: "center", fontSize: "20px", marginTop:"-10px"}}>
                                    Assessment #{assessment.id}
                                </HeadingLarge>
                                <strong>Level:</strong> {assessment.level} <br />
                                <strong>Status:</strong> {assessment.status} <br />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", fontSize: "18px", color: "#888" }}>
                        No current assessments. Create one using the [+] icon at the top right! Complete your Profile to start creaeting assessments.
                    </div>
                )}
            </div>

            {dialog.show && dialog.assessment && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                    width: "400px",
                    zIndex: 1000
                }}>
                    {dialog.assessment.status === "Completed" ? (
                        <>
                            <h2 style={{ marginBottom: "10px", textAlign: "center" }}>Assessment Details</h2>
                            <div style={{ fontSize: "16px", lineHeight: "1.5" }}>
                                <p><strong>Age:</strong> {dialog.assessment.student_age}</p>
                                <p><strong>Gender:</strong> {dialog.assessment.student_gender}</p>
                                <p><strong>Grade Level:</strong> {dialog.assessment.student_grade_level}</p>
                                <p><strong>City:</strong> {dialog.assessment.student_city}</p>
                                <p><strong>School:</strong> {dialog.assessment.student_school}</p>
                                <p><strong>Barangay:</strong> {dialog.assessment.student_barangay}</p>
                                <p><strong>Region:</strong> {dialog.assessment.student_region}</p>
                            </div>
                            <button
                                onClick={() => setDialog({ show: false, assessment: null })}
                                style={{
                                    marginTop: "15px",
                                    padding: "8px 15px",
                                    background: "#ff4d4d",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: "5px",
                                    width: "100%"
                                }}
                            >
                                Close
                            </button>
                        </>
                    ) : (
                        <>
                            <p style={{ textAlign: "center", fontSize: "18px", marginBottom: "15px" }}>
                                Do you want to start this assessment?
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <button onClick={confirmStartAssessment} style={{
                                    flex: 1, padding: "8px", background: "#4CAF50",
                                    color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px"
                                }}>
                                    Yes
                                </button>
                                <button onClick={() => setDialog({ show: false, assessment: null })} style={{
                                    flex: 1, padding: "8px", background: "#ff4d4d",
                                    color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
                                }}>
                                    No
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
