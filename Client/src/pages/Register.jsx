import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      alert("Registration Successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{
      backgroundColor: "#0b0f19",
      color: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#111827",
        border: "1px solid #1f2937",
        padding: "40px",
        borderRadius: "12px",
        width: "400px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", fontSize: "22px", fontWeight: "700" }}>
          HRM Portal Register
        </h2>

        {error && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "15px", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#9ca3af" }}>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                color: "white",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#9ca3af" }}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                color: "white",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#9ca3af" }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                color: "white",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#9ca3af" }}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                color: "white",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="Employee">Employee</option>
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "11px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)"
            }}
          >
            Register
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#9ca3af" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;