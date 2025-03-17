import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem("token", response.data.token);
        return response;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};


export const getUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const saveUserProfile = async (token, profileData) => {
    try {
        const response = await axios.put(`${API_URL}/user/profile`, profileData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Save Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAssessments = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/assessments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const createAssessment = async (token, formData) => {
    try {
        const response = await axios.post(`${API_URL}/assessments`, formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAssessmentById = async (token, id) => {
    try {
        const response = await axios.get(`${API_URL}/assessments/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteAssessments = async (assessmentIds, token) => {
    try {
        const response = await fetch("http://localhost:5000/api/assessments/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids: assessmentIds }),
        });
        if (!response.ok) {
            throw new Error("Failed to delete assessments");
        }
    } catch (error) {
        console.error("Error deleting assessments:", error);
    }
};


export const updateAssessment = async (id, data, token) => {
    try {
        const response = await axios.put(`${API_URL}/assessments/${id}/status`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateAssessmentLevel = async (id, level, token) => {
    try {
        console.log("Sending update request for level:", { id, level });

        const response = await axios.put(`${API_URL}/assessments/${id}/level`, { level }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Response from server:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getStatistics = async (token, filters) => {
    try {
        console.log("Token being sent:", token); // Debugging
        if (typeof token !== "string") {
            console.error("Invalid token type:", token);
            return;
        }

        let formattedFilters = { ...filters };

        if (filters.age) {
            if (filters.age.includes("-")) {
                formattedFilters.age = filters.age;
            } else if (filters.age.includes(",")) {
                formattedFilters.age = filters.age.replace(/\s+/g, "");
            } else {
                formattedFilters.age = parseInt(filters.age, 10) || "";
            }
        }

        const query = new URLSearchParams(formattedFilters).toString();
        console.log("Final Query:", query);

        const response = await axios.get(`${API_URL}/statistics?${query}`, {
            headers: { Authorization: `Bearer ${token.trim()}` },
        });

        return response.data;
    } catch (error) {
        console.error("Failed to fetch statistics:", error.response?.data || error.message);
        throw error;
    }
};

export const getLevels = async (token, filters = {}) => {
    try {
        console.log("Fetching levels with filters:", filters);

        let formattedFilters = {};

        if (filters.age) {
            const ageRange = filters.age.split("-").map(num => num.trim());
            formattedFilters.age = ageRange.length === 2 
                ? ageRange.map(num => parseInt(num, 10)).join(",") 
                : parseInt(ageRange[0], 10);
        }

        const query = new URLSearchParams(formattedFilters).toString();
        console.log("Final Query:", query);

        const response = await axios.get(`${API_URL}/api/levels?${query}`, {
            headers: { Authorization: `Bearer ${token.trim()}` },
        });

        console.log("Response from server:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch levels:", error.response?.data || error.message);
        throw error;
    }
};

export const createVolunteer = async (token, data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const createAdmin = async (token, data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { ...data, role: "admin" }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};


export const fetchUsers = async (token) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users.");
    }

    return await response.json();
};

export const changePassword = async (token, currentPassword, newPassword) => {
    try {
        const response = await axios.post(
            `${API_URL}/user/profile/change-password`, 
            { 
                currentPassword, // Change to camelCase
                newPassword      // Change to camelCase
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; 
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};
