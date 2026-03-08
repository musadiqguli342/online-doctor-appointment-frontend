"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AppointmentData {
  patientName: string;
  doctorName: string;
  specialization?: string;
  dateTime: string;
}

export default function ThankYouPage() {
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("appointmentConfirmation");

    if (stored) {
      setAppointment(JSON.parse(stored));
    }

    setLoading(false);
  }, []);

  const formattedDate =
    appointment?.dateTime &&
    !isNaN(new Date(appointment.dateTime).getTime())
      ? new Date(appointment.dateTime).toLocaleString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
   <div className="container py-5" style={{ marginTop: "100px" }}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0 rounded-4 p-5 text-center">
            <h2 className="mb-4 text-success">🎉 Appointment Confirmed!</h2>

            {loading ? (
              <p className="text-muted">Loading appointment details...</p>
            ) : appointment && formattedDate ? (
              <p className="mb-4">
                Thank you, <strong>{appointment.patientName}</strong>! Your
                appointment with{" "}
                <strong>{appointment.doctorName}</strong>
                {appointment.specialization &&
                  ` (${appointment.specialization})`}{" "}
                has been scheduled on <strong>{formattedDate}</strong>.
              </p>
            ) : (
              <p className="text-danger">
                Appointment details not found.
              </p>
            )}

            <button
              className="btn btn-primary btn-lg rounded-pill px-5"
              onClick={() => {
                localStorage.removeItem("appointmentConfirmation");
                router.push("/");
              }}
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
