import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      // error is handled inside AuthContext
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center !bg-[#0b0f19] p-4 font-sans selection:bg-cyan-500 selection:text-slate-900 sm:p-6 md:p-8">
      {/* Container sizing - Responsive widths across break points */}
      <div className="relative w-full max-w-md sm:max-w-[440px]">
        
        {/* Sleek multi-layered ambient neon glow effect */}
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-20 blur-2xl transition duration-1000 group-hover:opacity-30"></div>
        
        {/* Main Card Element */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111827]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            
            {/* Header / Logo section */}
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-indigo-500/20">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Student Tracking
              </h1>
              <p className="mt-1.5 text-xs font-medium text-slate-400 sm:text-sm">
                Secure Portal Access • Please sign in
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-xs font-medium text-red-400 backdrop-blur-sm sm:text-sm animate-[shake_0.4s_ease-in-out]">
                <svg className="h-5 w-5 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Input Wrapper */}
            <div className="flex flex-col gap-4">
              
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[11px] font-bold tracking-widest uppercase !text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@school.test"
                    className="w-full rounded-xl border !border-slate-800 !bg-slate-900/60 py-3 pl-10 pr-4 text-sm !text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:!border-cyan-500/80 focus:!bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[11px] font-bold tracking-widest uppercase !text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border !border-slate-800 !bg-slate-900/60 py-3 pl-10 pr-4 text-sm !text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:!border-cyan-500/80 focus:!bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Custom Interactive Cyberpunk Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-xl !bg-gradient-to-r !from-cyan-500 !to-indigo-600 py-3.5 text-sm font-bold tracking-wider !text-white shadow-lg shadow-cyan-500/10 transition-all duration-200 hover:opacity-95 hover:shadow-cyan-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:!from-slate-800 disabled:!to-slate-800 disabled:!text-slate-500 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin !text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authentication active...
                </span>
              ) : (
                "SIGN IN SYSTEM"
              )}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}