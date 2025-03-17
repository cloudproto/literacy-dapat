import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { createAssessment } from "../services/api";
import "../styles/Assessments.css";

const regionData = {
    "NCR": {
        "Manila": {
            barangays: ["Barangay 649 (Baseco)", "Barangay 650", "Barangay 651", "Barangay 652", "Barangay 653"],
            schools: ["Manila High School", "Araullo High School", "Tondo High School"]
        },
        "Quezon City": {
            barangays: ["Bagbag", "Batasan Hills", "Pasong Tamo"],
            schools: ["Quezon City Science High School", "Commonwealth High School", "New Era University"]
        }
    },
    "Region IV-A": {
        "Cavite City": {
            barangays: ["Barangay 10", "Barangay 11", "Barangay 12"],
            schools: ["Cavite National High School", "St. Joseph College", "San Sebastian College"]
        },
        "Tagaytay": {
            barangays: ["Maharlika East", "Maitim 2nd", "Silang Junction"],
            schools: ["Tagaytay City Science High School", "Mater Dei Academy", "Olivarez College"]
        }
    }
};

function Assessments() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        studentAge: "",
        studentGender: "",
        studentGradeLevel: "",
        studentRegion: "",
        studentCity: "",
        studentBarangay: "",
        studentSchool: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.token) {
            navigate("/");
            return;
        }
        setUser(storedUser);
        setLoading(false);
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegionChange = (e) => {
        setFormData({
            ...formData,
            studentRegion: e.target.value,
            studentCity: "",
            studentBarangay: "",
            studentSchool: ""
        });
    };

    const handleCityChange = (e) => {
        setFormData({
            ...formData,
            studentCity: e.target.value,
            studentBarangay: "",
            studentSchool: ""
        });
    };

    const handleBarangayChange = (e) => {
        setFormData({
            ...formData,
            studentBarangay: e.target.value,
            studentSchool: ""
        });
    };

    const handleCreateAssessment = async () => {
        if (!user) return;

        const requiredFields = ["studentAge", "studentGender", "studentGradeLevel", "studentRegion", "studentCity", "studentBarangay", "studentSchool"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                alert(`Please fill in the ${field.replace("student", "").replace(/([A-Z])/g, " $1")}.`);
                return;
            }
        }

        const formattedData = {
            student_age: parseInt(formData.studentAge, 10),
            student_gender: formData.studentGender,
            student_grade_level: formData.studentGradeLevel,
            student_region: formData.studentRegion,
            student_city: formData.studentCity,
            student_barangay: formData.studentBarangay,
            student_school: formData.studentSchool
        };

        setSaving(true);
        try {
            await createAssessment(user.token, formattedData);
            alert("Assessment created successfully!");
            navigate("/dashboard");
        } catch (error) {
            alert(error.message || "Failed to create assessment.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div className="assessment-container">
                <div className="assessment-card">
                    <h1 className="assessment-title">Create Assessment</h1>
                    <div className="assessment-fields">
                        <label>Age:</label>
                        <input type="number" name="studentAge" value={formData.studentAge} onChange={handleChange} />

                        <label>Gender:</label>
                        <select name="studentGender" value={formData.studentGender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-Binary">Non-Binary</option>
                            <option value="Other">Other</option>
                        </select>

                        <label>Grade Level:</label>
                        <input type="text" name="studentGradeLevel" value={formData.studentGradeLevel} onChange={handleChange} />

                        <label>Region:</label>
                        <select name="studentRegion" value={formData.studentRegion} onChange={handleRegionChange}>
                            <option value="">Select Region</option>
                            {Object.keys(regionData).map((region) => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>

                        <label>City:</label>
                        <select name="studentCity" value={formData.studentCity} onChange={handleCityChange} disabled={!formData.studentRegion}>
                            <option value="">Select City</option>
                            {formData.studentRegion &&
                                Object.keys(regionData[formData.studentRegion]).map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                        </select>

                        <label>Barangay:</label>
                        <select name="studentBarangay" value={formData.studentBarangay} onChange={handleBarangayChange} disabled={!formData.studentCity}>
                            <option value="">Select Barangay</option>
                            {formData.studentCity &&
                                regionData[formData.studentRegion][formData.studentCity].barangays.map((barangay) => (
                                    <option key={barangay} value={barangay}>{barangay}</option>
                                ))}
                        </select>

                        <label>School:</label>
                        <select name="studentSchool" value={formData.studentSchool} onChange={handleChange} disabled={!formData.studentBarangay}>
                            <option value="">Select School</option>
                            {formData.studentCity &&
                                regionData[formData.studentRegion][formData.studentCity].schools.map((school) => (
                                    <option key={school} value={school}>{school}</option>
                                ))}
                        </select>
                    </div>

                    <div className="assessment-buttons">
                        <button className="cancel-button" onClick={() => navigate("/dashboard")}>Cancel</button>
                        <button className="save-button" onClick={handleCreateAssessment} disabled={saving}>
                            {saving ? "Saving..." : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Assessments;
