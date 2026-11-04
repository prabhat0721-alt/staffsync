import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Announcements");
  const navigate = useNavigate();

  // Attendance states
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Leave states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userInfo));
      fetchLeaves();
      fetchAttendance();
    }
  }, [navigate]);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/leaves");
      setLeaves(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await API.get("/attendance");
      setAttendanceRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    setAttendanceLoading(true);
    try {
      await API.post("/attendance/check-in");
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setAttendanceLoading(true);
    try {
      await API.put("/attendance/check-out");
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await API.post("/leaves", { leaveType: "Casual Leave", startDate, endDate, reason });
      alert("Leave applied successfully!");
      setReason("");
      setStartDate("");
      setEndDate("");
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply leave");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Check if today checked out or checked in
  const todayStr = new Date().toDateString();
  const todayRecord = attendanceRecords.find(
    (att) => new Date(att.date).toDateString() === todayStr
  );
  const isCheckedOut = todayRecord && todayRecord.checkOutTime;

  return (
    <div style={{
      backgroundColor: "#0b0f19",
      color: "#ffffff",
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #1f2937"
      }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700" }}>Employee Portal</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e11d48",
            color: "white",
            border: "none",
            padding: "8px 18px",
            borderRadius: "6px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(225, 29, 72, 0.3)"
          }}
        >
          Logout
        </button>
      </header>

      {/* Navigation Tabs */}
      <div style={{ padding: "0 40px", borderBottom: "1px solid #1f2937", display: "flex", gap: "30px" }}>
        {["Announcements", "Leaves", "Attendance", "Profile"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              color: activeTab === tab ? "#ffffff" : "#9ca3af",
              padding: "16px 0",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              borderBottom: activeTab === tab ? "2px solid #e11d48" : "2px solid transparent",
              transition: "0.2s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main style={{ padding: "40px" }}>
        {activeTab === "Announcements" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px", minHeight: "200px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#f3f4f6" }}>Announcements</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No announcements available.</p>
            </div>
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px", minHeight: "200px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#f3f4f6" }}>Trainings</h3>
              <div style={{ backgroundColor: "#1f2937", padding: "16px", borderRadius: "8px", border: "1px solid #374151" }}>
                <h4 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", color: "#f3f4f6" }}>MongoDB CRUD</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "12px" }}>This Training Session is based on the MongoDB CRUD Operation.</p>
                <div style={{ fontSize: "12px", color: "#9ca3af", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <p>Trainer: Adnan Saif</p>
                  <p>Date: 05 Nov 2025</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Leaves" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
            {/* Apply for Leave Card */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px", color: "#f3f4f6" }}>Apply for Leave</h3>
              <form onSubmit={handleApplyLeave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", color: "#9ca3af", marginBottom: "8px" }}>Start Date</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", color: "#9ca3af", marginBottom: "8px" }}>End Date</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#9ca3af", marginBottom: "8px" }}>Reason</label>
                  <textarea 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    required 
                    placeholder="Reason for leave" 
                    style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", height: "90px", fontSize: "14px", outline: "none", resize: "none" }} 
                  />
                </div>
                <button 
                  type="submit" 
                  style={{ width: "100%", backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "600", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
                >
                  Apply Leave
                </button>
              </form>
            </div>

            {/* My Leaves Card */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px", color: "#f3f4f6" }}>My Leaves</h3>
              {leaves.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>No leave requests found.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {leaves.map((l) => {
                    const formattedStart = new Date(l.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    const formattedEnd = new Date(l.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    const isApproved = l.status === "Approved";
                    const isRejected = l.status === "Rejected";

                    return (
                      <div key={l._id} style={{ backgroundColor: "#1f2937", border: "1px solid #374151", padding: "16px 20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#f3f4f6", marginBottom: "4px" }}>
                            {formattedStart} → {formattedEnd}
                          </h4>
                          <p style={{ color: "#9ca3af", fontSize: "13px" }}>{l.reason}</p>
                        </div>
                        <div>
                          <span style={{ 
                            backgroundColor: isApproved ? "#064e3b" : isRejected ? "#7f1d1d" : "#78350f", 
                            color: isApproved ? "#34d399" : isRejected ? "#fca5a5" : "#fcd34d", 
                            padding: "6px 14px", 
                            borderRadius: "20px", 
                            fontSize: "12px", 
                            fontWeight: "600" 
                          }}>
                            {l.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Attendance" && (
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px", maxWidth: "900px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#f3f4f6" }}>Attendance</h3>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {!todayRecord ? (
                  <button 
                    onClick={handleCheckIn} 
                    disabled={attendanceLoading} 
                    style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                  >
                    Check In
                  </button>
                ) : !isCheckedOut ? (
                  <button 
                    onClick={handleCheckOut} 
                    disabled={attendanceLoading} 
                    style={{ backgroundColor: "#e11d48", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                  >
                    Check Out
                  </button>
                ) : (
                  <span style={{ backgroundColor: "#064e3b", color: "#34d399", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    Checked Out
                  </span>
                )}
              </div>
            </div>

            {attendanceRecords.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No attendance records found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {attendanceRecords.map((att) => {
                  const formattedDate = new Date(att.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  return (
                    <div key={att._id} style={{ backgroundColor: "#1f2937", border: "1px solid #374151", padding: "16px 20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#f3f4f6", marginBottom: "4px" }}>
                          {formattedDate}
                        </h4>
                        <p style={{ color: "#9ca3af", fontSize: "13px" }}>
                          In: {att.checkInTime || "N/A"} {att.checkOutTime ? `| Out: ${att.checkOutTime}` : ""}
                        </p>
                      </div>
                      <div>
                        <span style={{ backgroundColor: "#064e3b", color: "#34d399", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                          {att.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "Profile" && user && (
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "32px", maxWidth: "600px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "#f3f4f6" }}>My Profile</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
              <p style={{ color: "#9ca3af" }}><strong style={{ color: "#f3f4f6" }}>Name:</strong> {user.name}</p>
              <p style={{ color: "#9ca3af" }}><strong style={{ color: "#f3f4f6" }}>Email:</strong> {user.email}</p>
              <p style={{ color: "#9ca3af" }}><strong style={{ color: "#f3f4f6" }}>Role:</strong> {user.role}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;