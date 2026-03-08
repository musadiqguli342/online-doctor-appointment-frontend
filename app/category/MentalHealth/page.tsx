"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  image: string;
}

export default function MentalHealthDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchMentalHealthDoctors();
  }, []);

  async function fetchMentalHealthDoctors() {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors`);
      const data = await res.json();

      console.log("All doctors from backend:", data);

      const mentalDoctors = data.filter((doc: Doctor) =>
        doc.specialization?.toLowerCase().includes("mental health"),
      );

      console.log("Filtered mental health doctors:", mentalDoctors);

      setDoctors(mentalDoctors);
    } catch (error) {
      console.error("Error fetching mental health doctors:", error);
    }
  }

  return (
    <>
      <Navbar />

      <main className="container mt-5 pt-5">
        <h2 className="mb-4">Mental Health Doctors</h2>

        <div className="row">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div key={doctor._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="rounded-circle mx-auto d-block mt-3"
                    style={{
                      width: "250px",
                      height: "250px",
                      objectFit: "cover",
                      border: "2px solid #dee2e6",
                    }}
                  />

                  <div className="card-body text-center">
                    <h5 className="card-title">{doctor.name}</h5>
                    <p className="mb-1">
                      <strong>Specialization:</strong> {doctor.specialization}
                    </p>
                    <p className="mb-1">{doctor.email}</p>
                    <p>{doctor.phone}</p>

                    <a
                      href={`/doctor-profile/${doctor._id}`}
                      className="btn btn-outline-primary w-100 rounded-pill mt-2"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted col-12">
              No mental health doctors found.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
