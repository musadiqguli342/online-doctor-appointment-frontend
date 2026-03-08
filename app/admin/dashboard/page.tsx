"use client";

import { useEffect, useState, useRef } from "react";
import AdminNavbar from "@/components/AdminSidebar"; 
import Chart from "chart.js/auto";

export default function AdminDashboard() {
  // State variables for cards
  const [totalDoctors, setTotalDoctors] = useState<number | string>("--");
  const [totalPatients, setTotalPatients] = useState<number | string>("--");
  const [appointmentsToday, setAppointmentsToday] = useState<number | string>("--");
  const [totalAppointments, setTotalAppointments] = useState<number | string>("--");

  // Refs for Chart.js
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`);
        const data = await res.json();

        if (!data.success) return;

        const stats = data.stats;
        setTotalDoctors(stats.totalDoctors || 0);
        setTotalPatients(stats.totalPatients || 0);
        setAppointmentsToday(stats.appointmentsToday || 0);
        setTotalAppointments(stats.totalAppointments || 0);

        if (!chartRef.current || !stats.trends?.length) return;

        if (chartInstance.current) chartInstance.current.destroy();

        chartInstance.current = new Chart(chartRef.current, {
          type: "line",
          data: {
            labels: stats.trends.map((t: any) => t.date),
            datasets: [
              {
                label: "Appointments",
                data: stats.trends.map((t: any) => Number(t.count)),
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13,110,253,0.2)",
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: "#0d6efd",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
              },
            },
            plugins: {
              legend: { display: true },
            },
          },
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div className="d-flex">
      {/* Fixed Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <div className="flex-grow-1" style={{ minHeight: "100vh" }}>
        <main className="py-4 px-4" style={{ marginLeft: "73px" }}>
          <h2 className="mb-4 text-center fw-bold">📊 Admin Dashboard</h2>

          {/* Cards */}
          <div className="row g-4 justify-content-center text-center" style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="col-md-3">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">🧑‍⚕️ Total Doctors</h6>
                  <h3>{totalDoctors}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">👥 Total Patients</h6>
                  <h3>{totalPatients}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">📅 Today's Appointments</h6>
                  <h3>{appointmentsToday}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="text-muted">📋 Total Appointments</h6>
                  <h3>{totalAppointments}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-5" style={{ maxWidth: "1200px", height: "400px", margin: "0 auto" }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </main>

        
      </div>
    </div>
  );
}