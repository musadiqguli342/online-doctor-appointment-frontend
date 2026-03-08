"use client"; 
import { useEffect, useState, FormEvent } from "react";
import AdminNavbar from "@/components/AdminSidebar";
import { showToast } from "@/utils/toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Appointment {
  _id: string;
  patientName: string;
  doctor: {
    _id: string;
    name: string;
    specialization?: string;
  };
  date: string;
  time: string;
  status: string;
}

export default function ViewAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInfo, setSearchInfo] = useState("");

  /* Admin Guard */
  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      alert("❌ Access denied. Admins only.");
      window.location.href = "/login";
    } else {
      loadAppointments();
    }
  }, []);

  /*  Load appointments */
  async function loadAppointments() {
    try {
      const res = await fetch(`${BASE_URL}/api/appointments`);
      const data: { success: boolean; appointments: Appointment[] } = await res.json();
      if (data.success) setAppointments(data.appointments.reverse());
    } catch (err) {
      console.error("Error loading appointments:", err);
      showToast("Failed to load appointments", "error");
    }
  }

  /* Confirm appointment */
  async function confirmAppointment(id: string) {
    if (!confirm("Are you sure you want to confirm this appointment?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/appointments/${id}/confirm`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        showToast("Appointment confirmed successfully", "success");
        setAppointments(prev => prev.map(appt => appt._id === id ? { ...appt, status: "confirmed" } : appt));
      } else showToast(data.message || "Failed to confirm", "error");
    } catch {
      showToast("Error confirming appointment", "error");
    }
  }

  /* 🗑 Delete appointment */
  async function deleteAppointment(id: string) {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/appointments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Appointment deleted successfully", "success");
        setAppointments(prev => prev.filter(appt => appt._id !== id));
      } else showToast(data.message || "Failed to delete", "error");
    } catch {
      showToast("Error deleting appointment", "error");
    }
  }

  /* 🔍 Search appointments */
  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    setSearchInfo("");
    if (!query) return setSearchInfo("Please enter a name to search.");

    try {
      const res = await fetch(`${BASE_URL}/api/appointments`);
      const data: { success: boolean; appointments: Appointment[] } = await res.json();
      if (!data.success) return setSearchInfo("No appointments available to search.");

     const filtered = data.appointments.filter(a =>
  a.patientName?.toLowerCase().includes(query) ||
  a.doctor?.name?.toLowerCase().includes(query) ||
  a.doctor?.specialization?.toLowerCase().includes(query)
);

      

      setAppointments(filtered);
      setSearchInfo(filtered.length
        ? `Showing results for "${query}"`
        : `No results found for "${query}"`);
      showToast(`Found ${filtered.length} matching appointment(s)`, "success");
    } catch {
      setSearchInfo("Search failed due to server error.");
      showToast("Search failed", "error");
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light pt-5">
      <AdminNavbar />

      <main className="container mt-5 flex-grow-1">
        <h2 className="mb-4 fw-bold">Appointments</h2>

        {/* 🔍 Search */}
       <form className="mb-4 d-flex gap-2">
  <input
    type="text"
    className="form-control shadow-sm"
    placeholder="Search by patient or doctor..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

  <button
    type="submit"
    className="btn btn-primary shadow-sm"
    onClick={handleSearch}
  >
    Search
  </button>

  <button
    type="button"
    className="btn btn-outline-secondary shadow-sm"
    onClick={() => {
      setSearchQuery("");
      setSearchInfo("");
      loadAppointments();
    }}
  >
    Reset
  </button>
</form>


      {searchInfo && (
  <div className="alert alert-info shadow-sm border-0 d-flex justify-content-between align-items-center">
    <span>{searchInfo}</span>

    {appointments.length > 0 && (
      <span className="badge bg-primary rounded-pill">
        {appointments.length} Result(s)
      </span>
    )}
  </div>
)}


        {/* Appointments Grid */}
        <div className="row g-3">
          {appointments.length === 0 ? (
           <div className="text-center py-5">
  <h5 className="text-muted">No Appointments Found</h5>
  <p className="text-muted small">
    Try searching with a different name
  </p>
</div>

          ) : appointments.map(appt => (
            <div key={appt._id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1">{appt.patientName}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{appt.doctor?.name}</h6>
                  <p className="mb-1"><strong>Specialization:</strong> {appt.doctor?.specialization || "N/A"}</p>
                  <p className="mb-1"><strong>Date:</strong> {appt.date} <strong>Time:</strong> {appt.time}</p>
                  <span className={`badge mb-3 rounded-pill ${appt.status === "confirmed" ? "bg-success" : "bg-warning text-dark"}`}>
                    {appt.status}
                  </span>

                  {/* Actions */}
                  <div className="mt-auto d-flex gap-2">
                    {appt.status !== "confirmed" && (
                      <button
                        className="btn btn-sm btn-success flex-grow-1"
                        onClick={() => confirmAppointment(appt._id)}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-danger flex-grow-1"
                      onClick={() => deleteAppointment(appt._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div id="customToastContainer" style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}></div>

      {/* Custom styles */}
      <style jsx>{`
        .card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .badge {
          font-size: 0.85rem;
          padding: 0.5em 0.75em;
        }
      `}</style>
    </div>
  );
}