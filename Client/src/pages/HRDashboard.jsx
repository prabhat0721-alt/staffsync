import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const HRDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Leave Applications");
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const navigate = useNavigate();

  // Employee Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Announcement Form State
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcementTarget, setAnnouncementTarget] = useState("All");

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(userInfo);
      if (parsedUser.role !== "Admin" && parsedUser.role !== "HR") {
        navigate("/dashboard");
      }
      setUser(parsedUser);
      fetchLeaves();
      fetchEmployees();
      fetchAllAttendance();
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

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/employees");
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllAttendance = async () => {
    try {
      const { data } = await API.get("/attendance/all");
      setAllAttendance(data);
    } catch (err) {
      try {
        const { data } = await API.get("/attendance");
        setAllAttendance(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLeaveStatusUpdate = async (id, status) => {
    try {
      await API.put(`/leaves/${id}`, { status });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update leave status");
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await API.post("/employees", {
        name,
        email,
        department,
        position,
        salary,
        joinDate,
        phone,
        address,
      });
      alert("Employee added successfully!");
      setName("");
      setEmail("");
      setDepartment("");
      setPosition("");
      setSalary("");
      setJoinDate("");
      setPhone("");
      setAddress("");
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add employee");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await API.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete employee");
      }
    }
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    alert("Announcement created successfully!");
    setAnnouncementTitle("");
    setAnnouncementMessage("");
    setAnnouncementTarget("All");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

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
        <h1 style={{ fontSize: "20px", fontWeight: "700" }}>HR Portal</h1>
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

      {/* Main Title & Navigation Tabs */}
      <div style={{ padding: "30px 40px 0 40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px" }}>HR Dashboard</h2>
        <div style={{ borderBottom: "1px solid #1f2937", display: "flex", gap: "30px" }}>
          {["Leave Applications", "Employee Management", "Announcements", "Attendance"].map((tab) => (
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
      </div>

      {/* Content Area */}
      <main style={{ padding: "40px" }}>
        {activeTab === "Leave Applications" && (
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "24px", color: "#f3f4f6" }}>Leave Applications</h3>
            
            {leaves.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No leave applications found.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #374151", color: "#9ca3af" }}>
                      <th style={{ padding: "12px 16px" }}>Employee</th>
                      <th style={{ padding: "12px 16px" }}>Email</th>
                      <th style={{ padding: "12px 16px" }}>Start Date</th>
                      <th style={{ padding: "12px 16px" }}>End Date</th>
                      <th style={{ padding: "12px 16px" }}>Reason</th>
                      <th style={{ padding: "12px 16px" }}>Status</th>
                      <th style={{ padding: "12px 16px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((l) => {
                      const empName = l.employee?.user?.name || "N/A";
                      const empEmail = l.employee?.user?.email || "N/A";
                      const formattedStart = new Date(l.startDate).toLocaleDateString('en-GB');
                      const formattedEnd = new Date(l.endDate).toLocaleDateString('en-GB');

                      return (
                        <tr key={l._id} style={{ borderBottom: "1px solid #1f2937" }}>
                          <td style={{ padding: "16px", fontWeight: "500", color: "#f3f4f6" }}>{empName}</td>
                          <td style={{ padding: "16px", color: "#9ca3af" }}>{empEmail}</td>
                          <td style={{ padding: "16px", color: "#9ca3af" }}>{formattedStart}</td>
                          <td style={{ padding: "16px", color: "#9ca3af" }}>{formattedEnd}</td>
                          <td style={{ padding: "16px", color: "#9ca3af" }}>{l.reason}</td>
                          <td style={{ padding: "16px", color: "#f3f4f6" }}>{l.status}</td>
                          <td style={{ padding: "16px", display: "flex", gap: "10px" }}>
                            <button
                              onClick={() => handleLeaveStatusUpdate(l._id, "Approved")}
                              style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleLeaveStatusUpdate(l._id, "Rejected")}
                              style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "Employee Management" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* Add Employee Form Card */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px", color: "#f3f4f6" }}>Employee Management</h3>
              <form onSubmit={handleAddEmployee}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Department" 
                      value={department} 
                      onChange={(e) => setDepartment(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Position" 
                      value={position} 
                      onChange={(e) => setPosition(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      placeholder="Salary" 
                      value={salary} 
                      onChange={(e) => setSalary(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <input 
                      type="date" 
                      value={joinDate} 
                      onChange={(e) => setJoinDate(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <input 
                      type="text" 
                      placeholder="Address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  style={{ width: "100%", backgroundColor: "#e11d48", color: "white", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "600", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 12px rgba(225, 29, 72, 0.3)" }}
                >
                  Add Employee
                </button>
              </form>
            </div>

            {/* Employee List Table Card */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px" }}>
              {employees.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>No employees found.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #374151", color: "#9ca3af" }}>
                        <th style={{ padding: "12px 16px" }}>Name</th>
                        <th style={{ padding: "12px 16px" }}>Email</th>
                        <th style={{ padding: "12px 16px" }}>Department</th>
                        <th style={{ padding: "12px 16px" }}>Position</th>
                        <th style={{ padding: "12px 16px" }}>Salary</th>
                        <th style={{ padding: "12px 16px" }}>Join Date</th>
                        <th style={{ padding: "12px 16px" }}>Phone</th>
                        <th style={{ padding: "12px 16px" }}>Address</th>
                        <th style={{ padding: "12px 16px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => {
                        const formattedJoinDate = emp.joinDate ? new Date(emp.joinDate).toLocaleDateString('en-GB') : "N/A";
                        return (
                          <tr key={emp._id} style={{ borderBottom: "1px solid #1f2937" }}>
                            <td style={{ padding: "16px", color: "#f3f4f6", fontWeight: "500" }}>{emp.user?.name || emp.name}</td>
                            <td style={{ padding: "16px", color: "#9ca3af" }}>{emp.user?.email || emp.email}</td>
                            <td style={{ padding: "16px", color: "#9ca3af" }}>{emp.department || "N/A"}</td>
                            <td style={{ padding: "16px", color: "#9ca3af" }}>{emp.position || "N/A"}</td>
                            <td style={{ padding: "16px", color: "#9ca3af" }}>₹{emp.salary || "0"}</td>
                            <td style={{ padding: "16px", color: "#9ca3af" }}>{formattedJoinDate}</td>
                            <td style={{ padding: "16px", color: "#9ca3af" }}>{emp.phone || "N/A"}</td>
                            <td style={{ padding: "16px", color: "#9ca3af" }}>{emp.address || "N/A"}</td>
                            <td style={{ padding: "16px", display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => alert("Edit feature coming soon!")}
                                style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(emp._id)}
                                style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Announcements" && (
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px", maxWidth: "800px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px", color: "#f3f4f6" }}>Announcements</h3>
            <form onSubmit={handleCreateAnnouncement}>
              <div style={{ marginBottom: "20px" }}>
                <input 
                  type="text" 
                  placeholder="Title" 
                  value={announcementTitle} 
                  onChange={(e) => setAnnouncementTitle(e.target.value)} 
                  required 
                  style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <textarea 
                  placeholder="Message" 
                  value={announcementMessage} 
                  onChange={(e) => setAnnouncementMessage(e.target.value)} 
                  required 
                  style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", height: "120px", fontSize: "14px", outline: "none", resize: "none" }} 
                />
              </div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <select 
                  value={announcementTarget} 
                  onChange={(e) => setAnnouncementTarget(e.target.value)} 
                  style={{ padding: "10px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none", cursor: "pointer", width: "120px" }}
                >
                  <option value="All">All</option>
                  <option value="HR">HR</option>
                  <option value="Employee">Employee</option>
                </select>
                <button 
                  type="submit" 
                  style={{ backgroundColor: "#e11d48", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 12px rgba(225, 29, 72, 0.3)" }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "Attendance" && (
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "24px", color: "#f3f4f6" }}>Attendance Records</h3>
            {allAttendance.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No attendance records found.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #374151", color: "#9ca3af" }}>
                      <th style={{ padding: "12px 16px" }}>Employee</th>
                      <th style={{ padding: "12px 16px" }}>Date</th>
                      <th style={{ padding: "12px 16px" }}>Check In</th>
                      <th style={{ padding: "12px 16px" }}>Check Out</th>
                      <th style={{ padding: "12px 16px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAttendance.map((att) => {
                      const empName = att.employee?.user?.name || att.employeeName || "N/A";
                      const formattedDate = att.date ? new Date(att.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'numeric', year: 'numeric' }) : "N/A";
                      return (
                        <tr key={att._id} style={{ borderBottom: "1px solid #1f2937" }}>
                          <td style={{ padding: "16px", color: "#f3f4f6", fontWeight: "500" }}>{empName}</td>
                          <td style={{ padding: "16px", color: "#9ca3af" }}>{formattedDate}</td>
                          <td style={{ padding: "16px", color: "#9ca3af" }}>{att.checkInTime || "N/A"}</td>
                          <td style={{ padding: "16px", color: "#9ca3af" }}>{att.checkOutTime || "N/A"}</td>
                          <td style={{ padding: "16px", color: "#f3f4f6" }}>{att.status || "Present"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HRDashboard;