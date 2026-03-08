"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Slot {
  start: Date;
  end: Date;
  duration?: number;
  type?: "weekly" | "daily" | "monthly" | "date";
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  date?: string;
}

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string | number;
  specialization: string;
  image: string;
  experience?: string;
  education?: string;
  certifications?: string;
  languages?: string;
  hospital?: string;
  rating?: number;
  availabilitySlots: Slot[];
}

interface Appointment {
  start: string;
  end: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function DoctorProfilePage() {
  const { doctorId } = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotStart, setSelectedSlotStart] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slotsByDate, setSlotsByDate] = useState<Record<string, Slot[]>>({});

  useEffect(() => {
    if (!doctorId) return;
    fetchDoctor();
    fetchAppointments();
    fetchReviews();
  }, [doctorId]);

  useEffect(() => {
    if (doctor) fetchAvailableSlots();
  }, [doctor, currentMonth]);

  const fetchDoctor = async () => {
    const res = await fetch(`${BASE_URL}/api/doctors/${doctorId}`);
    const data = await res.json();
    setDoctor(data);
  };

  useEffect(() => {
    if (!selectedDate && Object.keys(slotsByDate).length > 0) {
      const firstKey = Object.keys(slotsByDate)[0];
      const [y, m, d] = firstKey.split("-").map(Number);
      setSelectedDate(new Date(y, m - 1, d));
    }
  }, [slotsByDate]);

  const fetchAppointments = async () => {
    const res = await fetch(`${BASE_URL}/api/appointments/doctor/${doctorId}`);
    const data = await res.json();
    setAppointments(data);
  };

  const fetchReviews = async () => {
    const res = await fetch(`${BASE_URL}/api/reviews/${doctorId}`);
    const data = await res.json();
    setReviews(data);
  };

  const getMonthYearLabel = () =>
    currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return {
      firstDay: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate(),
    };
  };

  const getDateKey = (date: Date | string) => {
    if (typeof date === "string") return date.split("T")[0];
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
  };

  const changeMonth = (dir: "prev" | "next") => {
    setSelectedDate(null);
    setSelectedSlotStart(null);
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + (dir === "next" ? 1 : -1),
        1,
      ),
    );
  };

  const groupSlotsByDate = (slots: Slot[]) => {
    const map: Record<string, Slot[]> = {};
    slots.forEach((slot) => {
      let key = "";
      if (slot.type === "date" && slot.date) key = getDateKey(slot.date);
      else if (slot.start) key = getDateKey(slot.start);
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    });
    return map;
  };

  const getSlotsForDate = (date: Date) => {
    if (!date) return [];
    const key = getDateKey(date);
    return slotsByDate[key] || [];
  };

  const isBooked = (slot: Slot) =>
    appointments.some((a) => {
      const slotStart = slot.start.getTime();
      const slotEnd = slot.end.getTime();
      const appStart = new Date(a.start).getTime();
      const appEnd = new Date(a.end).getTime();
      return slotStart < appEnd && slotEnd > appStart;
    });

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedSlotStart) {
      alert("Please select a time slot");
      return;
    }
    const slot = getSlotsForDate(selectedDate).find(
      (s) => s.start.getTime() === selectedSlotStart.getTime(),
    );
    if (!slot) {
      alert("Invalid slot selected");
      return;
    }
    localStorage.setItem(
      "selectedSlot",
      JSON.stringify({
        doctorId,
        start: slot.start,
        end: slot.end,
      }),
    );
    router.push(`/book-appointment?doctorId=${doctorId}`);
  };

  const fetchAvailableSlots = async () => {
    if (!doctor) return;

    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    );

    const res = await fetch(
      `${BASE_URL}/api/appointments/${doctor._id}/availability?from=${monthStart.toISOString()}&to=${monthEnd.toISOString()}`,
    );

    const data: Slot[] = await res.json();

    const slotsWithDates: Slot[] = [];

    data.forEach((slot) => {
      if (
        slot.type === "weekly" &&
        slot.startTime &&
        slot.endTime &&
        slot.dayOfWeek !== undefined
      ) {
        // weekly logic (optional)
      } else if (
        slot.type === "date" &&
        slot.date &&
        slot.startTime &&
        slot.endTime
      ) {
        const [startH, startM] = slot.startTime.split(":").map(Number);
        const [endH, endM] = slot.endTime.split(":").map(Number);
        const [y, m, d] = slot.date.split("-").map(Number);

        const start = new Date(y, m - 1, d, startH, startM, 0, 0);
        const end = new Date(y, m - 1, d, endH, endM, 0, 0);

        slotsWithDates.push({
          ...slot,
          start, // now a Date
          end, // now a Date
        });
      } else {
        // If slot.start/end are strings, convert them
        slotsWithDates.push({
          ...slot,
          start: new Date(slot.start as any),
          end: new Date(slot.end as any),
        });
      }
    });

    setSlotsByDate(groupSlotsByDate(slotsWithDates));

    if (!selectedDate) {
      const firstKey = Object.keys(groupSlotsByDate(slotsWithDates))[0];
      if (firstKey) {
        const [y, m, d] = firstKey.split("-").map(Number);
        setSelectedDate(new Date(y, m - 1, d));
      }
    }
  };

  if (!doctor) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container flex-grow-1 py-3">
        {/* Doctor Info */}
        <div className="row mb-4 " style={{ marginTop: 55 }}>
          <div className="col-md-4 text-center">
            <img
              src={doctor.image}
              className="rounded-circle"
              style={{ width: 200, height: 200, objectFit: "cover" }}
              alt={doctor.name}
            />
            <h3>{doctor.name}</h3>
          </div>
          <div className="col-md-8">
            <p>
              <b>Specialization:</b> {doctor.specialization}
            </p>
            <p>
              <b>Email:</b> {doctor.email}
            </p>
            <p>
              <b>Phone:</b> {doctor.phone}
            </p>
            <p>
              <b>Experience:</b> {doctor.experience || "-"}
            </p>
            <p>
              <b>Education:</b> {doctor.education || "-"}
            </p>
            <p>
              <b>Certifications:</b> {doctor.certifications || "-"}
            </p>
            <p>
              <b>Languages:</b> {doctor.languages || "-"}
            </p>
            <p>
              <b>Hospital:</b> {doctor.hospital || "-"}
            </p>
          </div>
        </div>
      </main>

      {/* Available Slots */}
      <div className="container mb-4">
        <div className="card p-4">
          <h3 className="mb-3 text-center">Available Slots</h3>
          <div className="row">
            {/* Calendar */}
            {/* Calendar */}
            <div className="col-md-6 border-end text-center">
              <div className="d-flex justify-content-between mb-2">
                <button onClick={() => changeMonth("prev")}>◀</button>
                <b>{getMonthYearLabel()}</b>
                <button onClick={() => changeMonth("next")}>▶</button>
              </div>

              <div
                className="d-grid"
                style={{ gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}
              >
                {/* Weekday headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd) => (
                  <div key={wd} className="text-center fw-bold mb-1">
                    {wd}
                  </div>
                ))}

                {/* Empty cells for first day offset */}
                {Array.from({ length: getDaysInMonth().firstDay }).map(
                  (_, i) => (
                    <div key={`empty-${i}`} />
                  ),
                )}

                {/* Calendar dates */}
                {Array.from({ length: getDaysInMonth().daysInMonth }).map(
                  (_, i) => {
                    const date = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      i + 1,
                    );
                    const key = getDateKey(date);
                    const hasSlots = !!slotsByDate[key];

                    return (
                      <button
                        key={i}
                        className={`btn btn-sm d-flex flex-column align-items-center ${
                          selectedDate?.toDateString() === date.toDateString()
                            ? "btn-primary"
                            : hasSlots
                              ? "btn-outline-primary"
                              : "btn-light text-muted"
                        }`}
                        disabled={!hasSlots}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedSlotStart(null);
                        }}
                      >
                        <small className="text-muted">
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </small>
                        <span>{i + 1}</span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Time Slots */}
            <div className="col-md-6">
              <h6>Select Time</h6>
              <div className="d-flex flex-wrap gap-2">
                {selectedDate &&
                  getSlotsForDate(selectedDate).map((slot, i) => {
                    const booked = isBooked(slot);
                    const isSelected =
                      selectedSlotStart?.getTime() === slot.start.getTime();
                    return (
                      <button
                        key={i}
                        disabled={booked}
                        className={`btn ${
                          booked
                            ? "btn-danger text-white"
                            : isSelected
                              ? "btn-primary"
                              : "btn-outline-primary"
                        }`}
                        title={
                          booked
                            ? "Already booked"
                            : `${slot.duration || 30} min`
                        }
                        onClick={() => setSelectedSlotStart(slot.start)}
                      >
                        {slot.start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {booked && " (Booked)"}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={handleBookAppointment}>
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
