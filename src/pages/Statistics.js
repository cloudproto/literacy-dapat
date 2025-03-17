import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getStatistics } from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../styles/Statistics.css";

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

function Statistics() {
    const [filters, setFilters] = useState({
        region: "",
        city: "",
        barangay: "",
        school: "",
        age: "",
        gender: ""
    });

    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tallies, setTallies] = useState({
        totalAssessments: 0,
        nothingLevel: 0,
        letterLevel: 0,
        wordLevel: 0,
        paragraphLevel: 0,
        comprehensionLevel: 0
    });

    useEffect(() => {
        fetchStatistics();
    }, [filters]);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = storedUser?.token || null;

            if (!token) {
                console.error("Missing token");
                return;
            }

            const response = await getStatistics(token, filters);
            setStatistics(response || []);

            const counts = {
                totalAssessments: response.length || 0,
                nothingLevel: 0,
                letterLevel: 0,
                wordLevel: 0,
                paragraphLevel: 0,
                comprehensionLevel: 0
            };

            response.forEach(item => {
                switch (item.level) {
                    case "Nothing":
                        counts.nothingLevel += 1;
                        break;
                    case "Letter Level":
                        counts.letterLevel += 1;
                        break;
                    case "Word Level":
                        counts.wordLevel += 1;
                        break;
                    case "Paragraph Level":
                        counts.paragraphLevel += 1;
                        break;
                    case "Comprehension Level":
                        counts.comprehensionLevel += 1;
                        break;
                    default:
                        break;
                }
            });

            setTallies(counts);
        } catch (error) {
            console.error("Failed to fetch statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        let { name, value } = e.target;
    
        if (name === "age") {
            value = value.replace(/[^0-9,-]/g, ""); 
        }
    
        setFilters({ ...filters, [name]: value });
    };

    const handleRegionChange = (e) => {
        setFilters({ region: e.target.value, city: "", barangay: "", school: "", age: "", gender: "" });
    };

    const handleCityChange = (e) => {
        setFilters({ ...filters, city: e.target.value, barangay: "", school: "" });
    };

    const handleBarangayChange = (e) => {
        setFilters({ ...filters, barangay: e.target.value, school: "" });
    };

    const getLocationDisplay = () => {
        const { region, city, barangay, school } = filters;
        return [region, city, barangay, school].filter(Boolean).join(", ") || "Philippines";
    };

    const data = [
        { name: "Nothing Level", value: tallies.nothingLevel },
        { name: "Letter Level", value: tallies.letterLevel },
        { name: "Word Level", value: tallies.wordLevel },
        { name: "Paragraph Level", value: tallies.paragraphLevel },
        { name: "Comprehension Level", value: tallies.comprehensionLevel }
    ];

    const COLORS = ['#E6194B', '#3CB44B', '#FFE119', '#4363D8', '#F58231'];

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div className="statistics-container">
                <h1 className="statistics-title">Statistics</h1>
                <div className="filter-bar">
                    <select name="region" value={filters.region} onChange={handleRegionChange}>
                        <option value="">Select Region</option>
                        {Object.keys(regionData).map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>

                    <select name="city" value={filters.city} onChange={handleCityChange} disabled={!filters.region}>
                        <option value="">Select City</option>
                        {filters.region && Object.keys(regionData[filters.region]).map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>

                    <select name="barangay" value={filters.barangay} onChange={handleBarangayChange} disabled={!filters.city}>
                        <option value="">Select Barangay</option>
                        {filters.city && regionData[filters.region][filters.city].barangays.map(barangay => (
                            <option key={barangay} value={barangay}>{barangay}</option>
                        ))}
                    </select>

                    <select name="school" value={filters.school} onChange={handleFilterChange} disabled={!filters.barangay}>
                        <option value="">Select School</option>
                        {filters.city && regionData[filters.region][filters.city].schools.map(school => (
                            <option key={school} value={school}>{school}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="age"
                        value={filters.age}
                        placeholder="Enter Age"
                        onChange={handleFilterChange}
                    />

                    <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <h2 className="location-display">Location: {getLocationDisplay()}</h2>
                <h3>Age: {filters.age || "Not specified"}</h3>
                <h3>Gender: {filters.gender || "Not specified"}</h3>
                <h3>Total Assessments: {tallies.totalAssessments}</h3>

                {loading ? (
                    <p>Loading statistics...</p>
                ) : (
                    <div className="statistics-results">
                        <div className="levels-list">
                            <p><strong>Nothing Level:</strong> {tallies.nothingLevel}</p>
                            <p><strong>Letter Level:</strong> {tallies.letterLevel}</p>
                            <p><strong>Word Level:</strong> {tallies.wordLevel}</p>
                            <p><strong>Paragraph Level:</strong> {tallies.paragraphLevel}</p>
                            <p><strong>Comprehension Level:</strong> {tallies.comprehensionLevel}</p>
                        </div>

                        <div className="pie-chart">
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    label
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Statistics;
