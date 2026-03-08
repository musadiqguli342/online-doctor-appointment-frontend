// "use client";

// import { useRouter } from "next/navigation";

// export default function AdminNavbar() {
//   const router = useRouter();

//   const logout = () => {
//     // Clear admin session/localStorage
//     localStorage.removeItem("role");
//     localStorage.removeItem("token"); // if using token
//     router.push("/"); // redirect to admin login
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
//       <div className="container">
//         <a className="navbar-brand" href="/">DocAppoint</a>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#adminNavbar"
//           aria-controls="adminNavbar"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="adminNavbar">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//               <a className="nav-link" href="/admin/add-doctor">Add Doctor</a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" href="/admin/all-appointments">All Appointments</a>
//             </li>
            
//             <li className="nav-item">
//               <a className="nav-link" href="/admin/dashboard">Dashboard</a>
//             </li>
//           </ul>

        
//           <button
//             className="btn btn-light rounded-pill shadow-sm px-4 fw-semibold"
//             onClick={logout}
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }




"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    router.push("/");
  };

  const isActive = (path: string) =>
    pathname === path ? "active bg-primary text-white" : "text-dark";

  return (
    <div
      className="bg-white border-end shadow-sm position-fixed d-flex flex-column"
      style={{
        width: "260px",
        height: "100vh",
        top: 0,
        left: 0,
      }}
    >
      {/* Logo */}
      <div className="p-4 border-bottom">
        <h4 className="fw-bold text-primary">DocAppoint</h4>
        <small className="text-muted">Admin Panel</small>
      </div>

      {/* Menu */}
      <div className="p-3 flex-grow-1">

        <h6 className="text-muted fw-bold mb-3">MENU</h6>

        <ul className="nav flex-column gap-2">

<li>
            <Link
              href="/admin/add-doctor"
              className={`nav-link rounded-pill px-3 ${isActive(
                "/admin/add-doctor"
              )}`}
            >
              👨‍⚕️ Add Doctor
            </Link>
          </li>


          <li>
            <Link
              href="/admin/all-appointments"
              className={`nav-link rounded-pill px-3 ${isActive(
                "/admin/all-appointments"
              )}`}
            >
              📅 Appointments
            </Link>
          </li>

           <li>
            <Link
              href="/admin/dashboard"
              className={`nav-link rounded-pill px-3 ${isActive(
                "/admin/dashboard"
              )}`}
            >
              📊 Dashboard
            </Link>
          </li>


        </ul>
      </div>

      {/* Logout */}
      <div className="p-3 border-top">
        <button
          onClick={logout}
          className="btn btn-outline-danger w-100 rounded-pill"
        >
          Logout
        </button>
      </div>
    </div>
  );
}