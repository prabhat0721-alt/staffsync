import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ManagerDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Leave Applications");
  const [leaves, setLeaves] = useState([]);
  const [trainings, setTrainings] = useState([
    {
      _id: "1",
      title: "MongoDB CRUD",
      description: "This Training Session is based on the MongoDB CRUD Operation.",
      date: "2025-11-05",
      trainer: "Adnan Saif",
      assignedTo: "N/A"
    }
  ]);
  const navigate = useNavigate();

  // Training Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [trainer, setTrainer] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(userInfo);
      if (parsedUser.role !== "Manager" && parsedUser.role !== "HR" && parsedUser.role !== "Admin") {
        navigate("/dashboard");
      }
      setUser(parsedUser);
      fetchLeaves();
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

  const handleCreateTraining = (e) => {
    e.preventDefault();
    const newTraining = {
      _id: Date.now().toString(),
      title,
      description,
      date,
      trainer,
      assignedTo: assignedTo || "N/A"
    };
    setTrainings([newTraining, ...trainings]);
    alert("Training created successfully!");
    setTitle("");
    setDate("");
    setDescription("");
    setTrainer("");
    setAssignedTo("");
  };

  const handleDeleteTraining = (id) => {
    if (window.confirm("Are you sure you want to delete this training?")) {
      setTrainings(trainings.filter((t) => t._id !== id));
    }
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
        <h1 style={{ fontSize: "20px", fontWeight: "700" }}>Manager Dashboard</h1>
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

      {/* Main Content Area */}
      <main style={{ padding: "40px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", textAlign: "center", marginBottom: "30px", color: "#f3f4f6" }}>
          Welcome Back, Manager
        </h2>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
          {["Leave Applications", "Training & Development"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: activeTab === tab ? "#2563eb" : "#1f2937",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: activeTab === tab ? "0 4px 12px rgba(37, 99, 235, 0.3)" : "none"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Leave Applications" && (
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "#f3f4f6" }}>Leave Applications</h3>
            {leaves.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No leave applications found.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {leaves.map((l) => {
                  const empName = l.employee?.user?.name || "Pravanshu Samadhiya";
                  const empEmail = l.employee?.user?.email || "Pravanshu@gmail.com";
                  const formattedStart = l.startDate ? new Date(l.startDate).toLocaleDateString('en-GB') : "11/5/2025";
                  const formattedEnd = l.endDate ? new Date(l.endDate).toLocaleDateString('en-GB') : "11/6/2025";
                  const isApproved = l.status === "Approved";

                  return (
                    <div key={l._id} style={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "10px", padding: "20px", fontSize: "14px" }}>
                      <p style={{ marginBottom: "6px", color: "#f3f4f6" }}><strong>Employee:</strong> {empName}</p>
                      <p style={{ marginBottom: "12px", color: "#9ca3af", fontSize: "13px" }}>({empEmail})</p>
                      <p style={{ marginBottom: "6px", color: "#9ca3af" }}><strong>From:</strong> {formattedStart}</p>
                      <p style={{ marginBottom: "6px", color: "#9ca3af" }}><strong>To:</strong> {formattedEnd}</p>
                      <p style={{ marginBottom: "12px", color: "#9ca3af" }}><strong>Reason:</strong> {l.reason}</p>
                      <p style={{ marginBottom: "6px", color: "#f3f4f6" }}>
                        <strong>Status:</strong> <span style={{ color: isApproved ? "#34d399" : "#fca5a5" }}>{l.status}</span>
                      </p>
                      <p style={{ color: "#9ca3af", fontSize: "13px" }}><strong>Approved/Rejected By:</strong> HR</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "Training & Development" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* Create Training Card */}
            <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "30px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "#f3f4f6" }}>Training & Development</h3>
              <form onSubmit={handleCreateTraining}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Training Title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <textarea 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", height: "90px", fontSize: "14px", outline: "none", resize: "none" }} 
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Trainer Name" 
                      value={trainer} 
                      onChange={(e) => setTrainer(e.target.value)} 
                      required 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Assign To (Employee ID)" 
                      value={assignedTo} 
                      onChange={(e) => setAssignedTo(e.target.value)} 
                      style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "6px", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  style={{ width: "100%", backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "600", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
                >
                  Create Training
                </button>
              </form>
            </div>

            {/* Training Cards List */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {trainings.map((t) => {
                const formattedDate = t.date ? new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "5/11/2025";
                return (
                  <div key={t._id} style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#f3f4f6", marginBottom: "10px" }}>{t.title}</h4>
                    <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "16px", lineHeight: "1.4" }}>{t.description}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>
                      <p><strong style={{ color: "#f3f4f6" }}>Date:</strong> {formattedDate}</p>
                      <p><strong style={{ color: "#f3f4f6" }}>Trainer:</strong> {t.trainer}</p>
                      <p><strong style={{ color: "#f3f4f6" }}>Assigned To:</strong> {t.assignedTo}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button 
                        onClick={() => alert("Edit training feature coming soon!")}
                        style={{ backgroundColor: "#f59e0b", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTraining(t._id)}
                        style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;