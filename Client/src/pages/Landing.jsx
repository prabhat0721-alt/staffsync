import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: "#0b0f19",
      color: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      fontFamily: "Inter, sans-serif",
      padding: "0 40px"
    }}>
      {/* Navbar */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 0",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#3b82f6", letterSpacing: "0.5px" }}>
          StaffSync <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "normal" }}>HRM Portal</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 22px",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
          }}
        >
          Login / Register
        </button>
      </header>

      {/* Hero Section */}
      <main style={{ textAlign: "center", padding: "40px 0 60px 0", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "800", lineHeight: "1.2", marginBottom: "20px" }}>
          Empower Your Workforce with <span style={{ color: "#3b82f6" }}>StaffSync</span>
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "16px", lineHeight: "1.5", maxWidth: "650px", margin: "0 auto 35px auto" }}>
          A smart Human Resource Management platform designed to simplify attendance tracking, leave management, employee records, and communication across teams.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 28px",
            borderRadius: "6px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            marginBottom: "60px",
            boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)"
          }}
        >
          Get Started
        </button>

        {/* Feature Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "20px",
          textAlign: "left"
        }}>
          {/* Card 1 */}
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "10px", padding: "24px" }}>
            <div style={{ color: "#3b82f6", fontSize: "22px", marginBottom: "12px" }}>👥</div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#f3f4f6" }}>Employee Management</h3>
            <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.4" }}>Manage employee records, roles, and information efficiently.</p>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "10px", padding: "24px" }}>
            <div style={{ color: "#10b981", fontSize: "22px", marginBottom: "12px" }}>📅</div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#f3f4f6" }}>Attendance & Leave</h3>
            <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.4" }}>Track attendance and handle leave approvals easily.</p>
          </div>

          {/* Card 3 */}
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "10px", padding: "24px" }}>
            <div style={{ color: "#f59e0b", fontSize: "22px", marginBottom: "12px" }}>💼</div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#f3f4f6" }}>HR & Manager Tools</h3>
            <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.4" }}>Handle team announcements, performance, and training modules.</p>
          </div>

          {/* Card 4 */}
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "10px", padding: "24px" }}>
            <div style={{ color: "#ec4899", fontSize: "22px", marginBottom: "12px" }}>🏅</div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "#f3f4f6" }}>Employee Growth</h3>
            <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.4" }}>Monitor performance and assign development trainings.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "20px 0",
        color: "#6b7280",
        fontSize: "13px",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        © 2026 StaffSync — Empowering Teams, Simplifying Workflows.
      </footer>
    </div>
  );
};

export default Landing;