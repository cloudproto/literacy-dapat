import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { HeadingLarge } from "baseui/typography";
import { loginUser } from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            if (!response || !response.data || !response.data.role) {
                throw new Error("Role not found in response");
            }
    
            localStorage.setItem("user", JSON.stringify({
                token: response.data.token,
                role: response.data.role || "guest",
                email: response.data.email
            }));            
    
            if (response.data.role === "admin") {
                navigate("/statistics");
            } 
            else if (response.data.role === "mngt") {
                navigate("/statistics");
            }
            else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            alert("Login failed! Check console for details.");
        }
    };
    
    


    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8f5fc" }}>
            <div style={{ width: "400px", padding: "20px", textAlign: "center", background: "white", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <HeadingLarge>Brigada Pagbasa Literacy Diagnostic and Proficiency Assessment Tool (DAPAT)</HeadingLarge>
                <form onSubmit={handleLogin}>
                    <Input 
                        placeholder="Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <Input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        overrides={{ Root: { style: { marginTop: "10px" } } }}
                    />
                    <Button 
                        type="submit"
                        overrides={{ BaseButton: { style: { width: "100%", marginTop: "20px" } } }}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;
