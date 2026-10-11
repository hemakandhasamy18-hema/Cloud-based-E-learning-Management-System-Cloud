import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider, useData } from "./context/DataContext";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CourseView from "./pages/CourseView";

function MainAppLayout() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("");
  const [currentCourseId, setCurrentCourseId] = useState(null);

  // Set default tabs based on user role when user changes
  useEffect(() => {
    if (user) {
      if (user.role === "student") {
        setActiveTab("courses");
      } else if (user.role === "instructor") {
        setActiveTab("courses");
      } else if (user.role === "admin") {
        setActiveTab("analytics");
      }
      setCurrentCourseId(null);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Loading Cloud LMS Container...
        </p>
      </div>
    );
  }

  // Auth Guard
  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      
      {/* Top Glass Navigation */}
      <Navbar />

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Navigation bar */}
        <Sidebar 
          role={user.role} 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCurrentCourseId(null); // return to dashboard tabs
          }} 
        />

        {/* Dynamic Main view switcher */}
        <main className="flex-1 flex flex-col min-w-0">
          {user.role === "student" && (
            currentCourseId ? (
              <CourseView 
                courseId={currentCourseId} 
                onClose={() => setCurrentCourseId(null)} 
              />
            ) : (
              <StudentDashboard 
                activeTab={activeTab} 
                onSelectCourse={(courseId) => setCurrentCourseId(courseId)} 
              />
            )
          )}

          {user.role === "instructor" && (
            <InstructorDashboard activeTab={activeTab} />
          )}

          {user.role === "admin" && (
            <AdminDashboard activeTab={activeTab} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppLayout />
      </DataProvider>
    </AuthProvider>
  );
}
