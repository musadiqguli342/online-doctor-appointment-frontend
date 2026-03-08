"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "../../utils/toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Review {
  user?: { name: string };
  rating: number;
  comment: string;
  createdAt?: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  image: string;
  verified?: boolean;
  reviews?: Review[];
}

export default function DoctorsHomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openReviewId = searchParams.get("openReview");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!openReviewId || doctors.length === 0) return;
    const doctor = doctors.find((d) => d._id === openReviewId);
    if (doctor) {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem("redirectAction", "review");
        localStorage.setItem("redirectDoctorId", doctor._id);
        router.push("/login");
        return;
      }
      setSelectedDoctor(doctor);
      fetchDoctorReviews(doctor._id);
      const url = new URL(window.location.href);
      url.searchParams.delete("openReview");
      window.history.replaceState({}, "", url.toString());
    }
  }, [openReviewId, doctors]);

  async function fetchDoctors() {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors`);
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  }

  const fetchDoctorReviews = async (doctorId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/${doctorId}`);
      const data = await res.json();
      setSelectedDoctor((prev) => (prev ? { ...prev, reviews: data } : null));
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/doctors/search?q=${query}`);
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async () => {
    if (!selectedDoctor) return;
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAction", "review");
      localStorage.setItem("redirectDoctorId", selectedDoctor._id);
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor: selectedDoctor._id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.setItem("redirectAction", "review");
        localStorage.setItem("redirectDoctorId", selectedDoctor._id);
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to submit review");
      setNewReview({ rating: 0, comment: "" });
      fetchDoctorReviews(selectedDoctor._id);
       fetchDoctors();
      showToast("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to submit review. Please try again.");
    }
  };

  const getAverageRating = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className="text-warning">
        {i < rating ? "★" : "☆"}
      </span>
    ));
  };

  const specialties = [
    { name: "Cardiology", icon: "❤️" },
    { name: "Mental Health", icon: "🧠" },
    { name: "Neurology", icon: "🧬" },
    { name: "Skin Care", icon: "🧴" },
    { name: "Pediatrics", icon: "👶" },
    { name: "Orthopedics", icon: "🦴" },
  ];

  return (
    <>
      <main>
        {/* HERO SECTION */}
        <section
          className="text-white py-5"
          style={{ background: "linear-gradient(135deg, #4f46e5, #3b82f6)" }}
        >
          <div className="container text-center">
            <h1 className="fw-bold mb-3 display-5">
              Book Appointments with Top Doctors
            </h1>
            <p className="mb-4 lead">
              Search by specialty, doctor name, or condition
            </p>
            <div
              className="d-flex flex-column flex-md-row justify-content-center gap-2 mx-auto bg-white rounded-pill shadow-sm p-2"
              style={{ maxWidth: "600px" }}
            >
              <input
                className="form-control border-0 px-3"
                placeholder="Specialty or Doctor name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search doctors by name or specialty"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button
                className="btn btn-primary rounded-pill d-flex align-items-center gap-2 px-4 transition hover:scale-105"
                onClick={handleSearch}
                aria-label="Search"
              >
                <Search size={18} /> Search
              </button>
            </div>
          </div>
        </section>

        {/* SPECIALTIES */}
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center fw-bold mb-4">Popular Specialties</h2>
            <div className="row g-4 justify-content-center">
              {specialties.map((s) => (
                <div key={s.name} className="col-6 col-md-3">
                  <div className="card text-center shadow-sm border-0 h-100 hover-shadow rounded-4 p-4 transition hover:scale-105">
                    <div className="fs-1 mb-2">{s.icon}</div>
                    <h5 className="fw-semibold">{s.name}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DOCTORS */}
        <section className="py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-4">Top Rated Doctors</h2>
            <div className="row g-4">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div key={doctor._id} className="col-md-4">
                    <div className="card h-100 text-center shadow-sm border-0 rounded-4 hover-shadow p-3 transition hover:shadow-lg hover:scale-105">
                      <div className="position-relative">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="rounded-circle mx-auto d-block mt-3 border border-2"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderColor: "#dee2e6",
                          }}
                        />
                        {doctor.verified && (
                          <span
                            className="position-absolute top-0 start-100 translate-middle bg-success text-white rounded-circle p-1"
                            title="Verified Doctor"
                          >
                            ✔
                          </span>
                        )}
                      </div>
                      <h5 className="fw-bold mt-3">{doctor.name}</h5>
                      <p className="text-muted">{doctor.specialization}</p>
                      {doctor.reviews && doctor.reviews.length > 0 ? (
                        <div className="mb-2">
                          {renderStars(
                            Math.round(getAverageRating(doctor.reviews)),
                          )}{" "}
                          <span className="text-muted">
                            • {doctor.reviews.length} review
                            {doctor.reviews.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      ) : (
                        <p className="text-muted mb-2">No reviews yet</p>
                      )}
                      <p className="text-muted mb-1">
                        <strong>Email:</strong> {doctor.email}
                      </p>
                      <p className="text-muted">
                        <strong>Phone:</strong> {doctor.phone}
                      </p>
                      <div className="d-grid gap-2">
                        <a
                          href={`/doctor-profile/${doctor._id}`}
                          className="btn btn-outline-primary rounded-pill shadow-sm"
                        >
                          View Profile
                        </a>
                        <button
                          className="btn btn-outline-primary rounded-pill shadow-sm"
                          onClick={() => {
                            const token = localStorage.getItem("token");
                            if (!token) {
                              localStorage.setItem("redirectAction", "review");
                              localStorage.setItem(
                                "redirectDoctorId",
                                doctor._id,
                              );
                              router.push("/login");
                              return;
                            }
                            setSelectedDoctor(doctor);
                            fetchDoctorReviews(doctor._id);
                          }}
                        >
                          Reviews
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p className="text-muted">No doctors found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* REVIEW MODAL */}
        {selectedDoctor && (
          <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setSelectedDoctor(null)}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content rounded-4 border-0 shadow-lg p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">{selectedDoctor.name}</h4>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedDoctor(null)}
                  />
                </div>
                {selectedDoctor.reviews &&
                  selectedDoctor.reviews.length > 0 && (
                    <div className="mb-4 text-center">
                      <div className="display-6 fw-bold text-primary">
                        {getAverageRating(selectedDoctor.reviews).toFixed(1)} /
                        5
                      </div>
                      <div className="text-warning fs-4">
                        {renderStars(
                          Math.round(getAverageRating(selectedDoctor.reviews)),
                        )}
                      </div>
                      <small className="text-muted">
                        Based on {selectedDoctor.reviews.length} review
                        {selectedDoctor.reviews.length > 1 ? "s" : ""}
                      </small>
                    </div>
                  )}
                <hr />
                <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {selectedDoctor.reviews &&
                  selectedDoctor.reviews.length > 0 ? (
                    selectedDoctor.reviews.map((review, idx) => (
                      <div key={idx} className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between">
                          <strong>{review.user?.name || "Anonymous"}</strong>
                          <span className="text-warning">
                            {renderStars(review.rating)}
                          </span>
                        </div>
                        <p className="mb-1 text-muted">{review.comment}</p>
                        {review.createdAt && (
                          <small className="text-secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center">No reviews yet.</p>
                  )}
                </div>
                <hr className="my-4" />
                <h5 className="fw-semibold mb-3">Write a Review</h5>
                <div className="mb-3 text-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{ cursor: "pointer", fontSize: "28px" }}
                      className={
                        star <= (hoverRating || newReview.rating)
                          ? "text-warning"
                          : "text-secondary"
                      }
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control rounded-3"
                    rows={3}
                    placeholder="Share your experience..."
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                  />
                </div>
                <button
                  className="btn btn-primary w-100 rounded-pill"
                  disabled={loading}
                  onClick={async () => {
                    if (newReview.rating === 0) {
                      showToast("Please select a rating");
                      return;
                    }
                    if (!newReview.comment.trim()) {
                      showToast("Please write a comment");
                      return;
                    }
                    setLoading(true);
                    await submitReview();
                    setLoading(false);
                  }}
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
