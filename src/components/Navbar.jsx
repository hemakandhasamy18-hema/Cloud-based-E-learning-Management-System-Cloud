import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Sun, Moon, Bell, LogOut, BookOpen, User, Check } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Initialize Dark Mode on mount
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <nav className="glass-navbar sticky top-0 z-40 w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 select-none">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-xl">
              ☁️
            </div>
            <div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                CloudLMS
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-2 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
                B.Tech Project
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Notifications (Student only) */}
            {user && user.role === "student" && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-semibold text-sm">Notifications</span>
                      {unreadNotifications.length > 0 && (
                        <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                          {unreadNotifications.length} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-xs">No alerts yet</div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`p-3 border-b border-slate-100 dark:border-slate-800/55 flex justify-between items-start transition-colors ${
                              !notif.read ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                            }`}
                          >
                            <div className="pr-2">
                              <p className="font-medium text-xs text-slate-800 dark:text-slate-200">{notif.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                            </div>
                            {!notif.read && (
                              <button
                                onClick={() => markNotificationRead(notif.id)}
                                className="p-1 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Mark as read"
                              >
                                <Check size={12} />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile greeting & Role indicator */}
            {user && (
              <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 capitalize tracking-wider">
                    {user.role}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <User size={18} />
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
