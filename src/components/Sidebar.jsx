import React from "react";
import { 
  BookOpen, ClipboardList, Award, Users, BarChart3, User, BookOpenCheck, CheckSquare, PlusCircle, PenTool, Sparkles
} from "lucide-react";

export default function Sidebar({ role, activeTab, setActiveTab }) {
  
  // Dynamic lists of menu items based on role
  const getMenuItems = () => {
    switch (role) {
      case "student":
        return [
          { id: "courses", label: "Browse Courses", icon: BookOpen },
          { id: "my-learnings", label: "My Learnings", icon: BookOpenCheck },
          { id: "ai-recommendations", label: "AI Recommendations", icon: Sparkles },
          { id: "assignments", label: "Assignments", icon: ClipboardList },
          { id: "results", label: "Quiz Scores", icon: CheckSquare },
          { id: "certificates", label: "Certificates", icon: Award },
          { id: "profile", label: "My Profile", icon: User },
        ];
      case "instructor":
        return [
          { id: "courses", label: "Manage Courses", icon: BookOpen },
          { id: "assignments", label: "Assignments", icon: PenTool },
          { id: "quizzes", label: "Quizzes", icon: ClipboardList },
          { id: "grading", label: "Submissions", icon: CheckSquare },
          { id: "enrollments", label: "Student Tracking", icon: Users },
        ];
      case "admin":
        return [
          { id: "analytics", label: "Analytics", icon: BarChart3 },
          { id: "users", label: "Manage Users", icon: Users },
          { id: "teachers", label: "Manage Teachers", icon: Users },
          { id: "students", label: "Manage Students", icon: Users },
          { id: "courses", label: "Manage Courses", icon: BookOpen },
          { id: "certificates", label: "Manage Certificates", icon: Award },
          { id: "reports", label: "Email & Audit Reports", icon: FileText },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 md:min-h-[calc(100vh-4rem)] flex-shrink-0 transition-colors duration-200">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 hidden md:block">
        <p className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Navigation Menu</p>
      </div>
      <nav className="p-2 md:p-4 space-y-1 flex md:flex-col flex-wrap md:flex-nowrap gap-1 md:gap-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 w-auto md:w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
              <span className="md:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
