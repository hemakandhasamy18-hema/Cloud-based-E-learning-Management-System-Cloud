import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogIn, Key, Mail, UserPlus, ShieldAlert, BookOpen } from "lucide-react";

export default function Login() {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name.trim()) throw new Error("Name is required.");
        await register(email, password, name, role);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Fast pre-fill credentials for examiners
  const handlePreFill = (userType) => {
    if (userType === "student") {
      setEmail("student@example.com");
      setPassword("password");
      setIsRegistering(false);
    } else if (userType === "instructor") {
      setEmail("instructor@example.com");
      setPassword("password");
      setIsRegistering(false);
    } else if (userType === "admin") {
      setEmail("admin@example.com");
      setPassword("password");
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Aesthetics Side panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-violet-900 via-indigo-950 to-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Header */}
        <div className="flex items-center space-x-2 relative z-10 select-none">
          <span className="text-3xl">☁️</span>
          <span className="font-display font-extrabold text-2xl tracking-tight">CloudLMS</span>
        </div>

        {/* Pitch text */}
        <div className="space-y-6 relative z-10 my-auto">
          <h1 className="text-4xl font-extrabold font-display leading-tight tracking-tight">
            Next-Generation Cloud-Based E-Learning Architecture.
          </h1>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Fulfill your B.Tech Cloud Computing curriculum constraints. Run secure sign-ins with Firebase Authentication, fetch responsive models from Cloud Firestore, and distribute lectures via Cloud Storage buckets.
          </p>

          <div className="pt-6 space-y-3">
            <div className="flex items-center space-x-3 text-xs bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md">
              <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">Storage</span>
              <span className="text-slate-300">Stateless video streaming using Firebase CDN</span>
            </div>
            <div className="flex items-center space-x-3 text-xs bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md">
              <span className="bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase">Database</span>
              <span className="text-slate-300">NoSQL document schemas for atomic transaction safety</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500 flex justify-between items-center">
          <span>B.Tech CSE Project (Cloud Computing)</span>
          <span>© 2026</span>
        </div>
      </div>

      {/* Action / Credentials Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 shadow-2xl relative transition-all duration-300 glass-card">
          
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 items-center justify-center mb-3">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {isRegistering ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isRegistering ? "Get access to courses & materials" : "Log in to track your learning milestones"}
            </p>
          </div>

          {/* Quick Demo Pre-fills */}
          {!isRegistering && (
            <div className="mb-6 bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center">Project Testing Presets</p>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => handlePreFill("student")}
                  className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold py-1.5 px-2 rounded-xl transition-all"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handlePreFill("instructor")}
                  className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold py-1.5 px-2 rounded-xl transition-all"
                >
                  Instructor
                </button>
                <button
                  type="button"
                  onClick={() => handlePreFill("admin")}
                  className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold py-1.5 px-2 rounded-xl transition-all"
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 rounded-r-xl flex items-start space-x-3 text-rose-800 dark:text-rose-350 text-xs">
              <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">👤</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="block w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.com"
                  className="block w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Account Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {["student", "instructor", "admin"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-3 text-xs font-bold capitalize rounded-xl border transition-all ${
                        role === r
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                          : "border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all mt-6 disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : isRegistering ? (
                <>
                  <UserPlus size={18} />
                  <span>Register Account</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Log In Securely</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              {isRegistering
                ? "Already have an account? Sign in instead"
                : "New to the platform? Register here"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
