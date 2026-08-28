import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Used to detect the active page route
  
  // State to handle explicit click tracking (pinning the sidebar open)
  const [isPinned, setIsPinned] = useState(false);
  // State to handle hover tracking
  const [isHovered, setIsHovered] = useState(false);

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Sidebar is "open" if it's either explicitly clicked/pinned OR hovered over
  const isOpen = isPinned || isHovered;

  // Helper function to check if a route link is active
  const isActive = (path) => location.pathname === path;

  // Base styling for standard nav links vs active glowing states
  const linkClasses = (path) => `
    flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-semibold tracking-wide transition-all duration-200 group/item outline-none
    ${isActive(path) 
      ? "bg-cyan-500/10 !text-cyan-400 border-l-4 border-cyan-500 shadow-lg shadow-cyan-500/5 pl-2" 
      : "!text-slate-400 hover:bg-slate-800/50 hover:!text-slate-100 border-l-4 border-transparent"
    }
  `;

  const roleStyles = {
    admin: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    teacher: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
    parent: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-50 h-screen border-r border-slate-800/80 !bg-[#111827]/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col justify-between py-5 px-3
        ${isOpen ? "w-64" : "w-20"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Section: Brand & Navigation */}
      <div className="flex flex-col gap-8">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-md shadow-indigo-500/10">
              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className={`text-base font-black tracking-tight !text-white transition-all duration-200 whitespace-nowrap ${isOpen ? "opacity-100 inline-block" : "opacity-0 hidden"}`}>
              Student Tracking
            </span>
          </div>

          <button 
            onClick={() => setIsPinned(!isPinned)}
            className={`h-6 w-6 items-center justify-center rounded-md border border-slate-700 !bg-slate-800/50 !text-slate-400 hover:!text-white hover:border-slate-500 transition-all 
              ${isOpen ? "hidden sm:flex" : "hidden"} 
              ${isPinned ? "rotate-180 !text-cyan-400 !border-cyan-500/40" : ""}
            `}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Links Navigation Matrix */}
        <nav className="flex flex-col gap-1">
          
          {/* Dashboard Link */}
          <Link to="/dashboard" className={linkClasses("/dashboard")}>
            <svg className="h-5 w-5 shrink-0 transition-transform group-hover/item:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Dashboard</span>
          </Link>

          {/* Admin Exclusive: Teachers Roster */}
          {user.role === "admin" && (
            <Link to="/teachers" className={linkClasses("/teachers")}>
              <svg className="h-5 w-5 shrink-0 transition-transform group-hover/item:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Teachers</span>
            </Link>
          )}

          {/* Admin & Teacher Restricted Sub-Links */}
          {(user.role === "admin" || user.role === "teacher") && (
            <>
              <Link to="/students" className={linkClasses("/students")}>
                <svg className="h-5 w-5 shrink-0 transition-transform group-hover/item:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Students</span>
              </Link>

              <Link to="/attendance" className={linkClasses("/attendance")}>
                <svg className="h-5 w-5 shrink-0 transition-transform group-hover/item:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Attendance</span>
              </Link>

              <Link to="/grades" className={linkClasses("/grades")}>
                <svg className="h-5 w-5 shrink-0 transition-transform group-hover/item:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Grades</span>
              </Link>
            </>
          )}

          {/* Parent Restricted Route */}
          {user.role === "parent" && (
            <Link to="/grades" className={linkClasses("/grades")}>
              <svg className="h-5 w-5 shrink-0 transition-transform group-hover/item:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>My Child</span>
            </Link>
          )}

          {/* Events Link */}
          <Link to="/events" className={linkClasses("/events")}>
            <svg className="h-5 w-5 shrink-0 transition-transform group-hover/item:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Events</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Section: User Profile & Logout Action */}
      <div className="flex flex-col gap-4 border-t border-slate-800/80 pt-4">
        
        {/* Profile Card Fragment */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 font-bold !text-slate-200 border border-slate-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={`flex flex-col min-w-0 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>
            <span className="truncate text-xs font-bold text-slate-200">{user.name}</span>
            <span className={`mt-0.5 w-fit rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${roleStyles[user.role] || "border-slate-700 text-slate-400"}`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Retractable Logout Action Button */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-4 rounded-xl border border-slate-800 !bg-slate-950/40 px-3 py-3 text-sm font-bold tracking-wide !text-slate-400 transition-all duration-200 hover:border-red-900/40 hover:!bg-red-950/10 hover:!text-red-400 active:scale-[0.98]"
        >
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Log out</span>
        </button>

      </div>
    </aside>
  );
}