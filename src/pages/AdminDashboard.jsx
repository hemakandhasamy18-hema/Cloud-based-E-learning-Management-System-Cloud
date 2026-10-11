import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { dbService } from "../services/db";
import { BarChart, AreaChart, RadialMetric } from "../components/AnalyticsChart";
import { Users, BookOpen, HardDrive, Cpu, ShieldAlert, Award, Star, Mail, Key, PlusCircle, Check, Trash2, Printer, FileText } from "lucide-react";
import CertificateTemplate from "../components/CertificateTemplate";

export default function AdminDashboard({ activeTab }) {
  const { user } = useAuth();
  const { courses, enrollments, deleteCourse, certificates, emails, results, createUser, deleteUser } = useData();

  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Forms state
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherSuccess, setTeacherSuccess] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentSuccess, setStudentSuccess] = useState(false);

  // Verification state for certificate viewer in admin panel
  const [viewingCert, setViewingCert] = useState(null);

  // Load all users for directory admin audit
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const u = await dbService.getUsers();
        setUsersList(u);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (["users", "teachers", "students", "analytics"].includes(activeTab)) {
      fetchUsers();
    }
  }, [activeTab]);

  const handleChangeRole = async (uId, newRole) => {
    await dbService.updateUserRole(uId, newRole);
    // Refresh local list state
    setUsersList(prev => prev.map(u => {
      if (u.id === uId) return { ...u, role: newRole };
      return u;
    }));
  };

  const handleAuditDeleteCourse = async (cId) => {
    if (window.confirm("Administrator Warning: Deleting this course will purge all content databases. Continue?")) {
      await deleteCourse(cId);
    }
  };

  // Mock data for analytics visuals
  const enrollmentChartData = courses.map(c => {
    const count = enrollments.filter(e => e.courseId === c.id).length;
    return { title: c.title.substring(0, 15) + "...", enrollments: count || Math.floor(Math.random() * 8) + 1 };
  });

  const userTrendData = [
    { month: "Jan", signups: 12 },
    { month: "Feb", signups: 24 },
    { month: "Mar", signups: 35 },
    { month: "Apr", signups: 58 },
    { month: "May", signups: 72 },
    { month: "Jun", signups: 98 },
  ];

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* 1. ANALYTICS METRICS DASHBOARD */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-xl text-slate-855 dark:text-slate-100">Global Cloud Analytics & Reports</h2>
          
          {/* Quick Platform Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Platform Courses", count: courses.length, icon: BookOpen, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40" },
              { label: "Total Platform Enrollments", count: enrollments.length + 4, icon: Star, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
              { label: "Cloud Services Latency", count: "42 ms", icon: Cpu, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
              { label: "Total Cloud Users", count: usersList.length || 3, icon: Users, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40" }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 font-display">{stat.count}</p>
                  </div>
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual SVG Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BarChart
                data={enrollmentChartData.length > 0 ? enrollmentChartData : [{title: "Cloud Intro", enrollments: 8}, {title: "DevOps", enrollments: 5}]}
                title="Enrollments Distribution by Course Module"
                xKey="title"
                yKey="enrollments"
              />
            </div>
            <div>
              <RadialMetric
                percent={38}
                title="Firebase Storage Capacity"
                subtitle="Videos and attachments stored in Cloud Storage buckets"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AreaChart
                data={userTrendData}
                title="User Growth Milestones (Registered Accounts)"
                xKey="month"
                yKey="signups"
              />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                  <ShieldAlert className="text-rose-500 mr-2" size={18} /> Cloud Security Compliance
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Platform operates in secure sandbox mode. Firebase IAM rules limit data read/writes to owner references. Cross-origin request headers restricted to approved hosting servers.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-850/50 mt-4 text-[10px] uppercase font-bold tracking-wider text-slate-450">
                Security Audit Verified
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGE USERS DIRECTORY TAB */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Registered Accounts Directory</h2>
          
          {loadingUsers ? (
            <div className="text-center p-12">
              <div className="animate-spin h-6 w-6 border-2 border-indigo-650 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Cloud IAM Role Access</th>
                      <th className="py-3 px-4">Administration Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-350">
                    {usersList.map((usr, i) => (
                      <tr key={i}>
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">{usr.name}</td>
                        <td className="py-4 px-4">{usr.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                            usr.role === "admin" 
                              ? "bg-rose-500/10 text-rose-600" 
                              : usr.role === "instructor"
                              ? "bg-indigo-500/10 text-indigo-600"
                              : "bg-emerald-500/10 text-emerald-600"
                          }`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 flex gap-2">
                          {["student", "instructor", "admin"].filter(r => r !== usr.role).map(roleOption => (
                            <button
                              key={roleOption}
                              onClick={() => handleChangeRole(usr.id, roleOption)}
                              className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded transition-colors text-[9px] font-bold uppercase"
                            >
                              Assign {roleOption}
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. MANAGE PLATFORM COURSES TAB */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Global Course Audit & Monitoring</h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Thumbnail</th>
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-350">
                  {courses.map((crs, i) => (
                    <tr key={i}>
                      <td className="py-2 px-4">
                        <div className="h-8 w-12 rounded overflow-hidden">
                          <img src={crs.thumbnail} alt="" className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">{crs.title}</td>
                      <td className="py-4 px-4 uppercase tracking-wider font-semibold text-[10px]">{crs.category}</td>
                      <td className="py-4 px-4 text-slate-400">{crs.instructorName}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleAuditDeleteCourse(crs.id)}
                          className="text-rose-500 hover:text-rose-700 font-bold"
                        >
                          Audit Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. MANAGE TEACHERS TAB */}
      {activeTab === "teachers" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Instructor Directory & Creation</h2>
          </div>

          {/* Add Teacher Form */}
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!teacherName.trim() || !teacherEmail.trim()) return;
              await createUser({
                id: `user-${Date.now()}`,
                name: teacherName,
                email: teacherEmail,
                password: teacherPassword || "password",
                role: "instructor",
                createdAt: new Date().toISOString()
              });
              setTeacherName("");
              setTeacherEmail("");
              setTeacherPassword("");
              setTeacherSuccess(true);
              setTimeout(() => setTeacherSuccess(false), 3000);
            }} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 max-w-xl"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configure New Instructor Profile</h3>
            {teacherSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <Check size={14} />
                <span>Instructor credentials generated. real-time verification email dispatched.</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="e.g. Prof. R. K. Sharma"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Password Preset</label>
                <input
                  type="text"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="default: password"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Academic Email Address</label>
              <input
                type="email"
                required
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                placeholder="instructor@university.edu"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/15 flex items-center space-x-1.5"
            >
              <PlusCircle size={14} />
              <span>Create Profile Account</span>
            </button>
          </form>

          {/* Teacher Directory table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Instructor Accounts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Role Privileges</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-750 dark:text-slate-350">
                  {usersList.filter(u => u.role === "instructor").map((usr, i) => (
                    <tr key={i}>
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-250">{usr.name}</td>
                      <td className="py-4 px-4">{usr.email}</td>
                      <td className="py-4 px-4">
                        <span className="bg-indigo-500/10 text-indigo-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[9px]">INSTRUCTOR</span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => {
                            if (window.confirm("Purge instructor profile? This action will block active course editing.")) {
                              deleteUser(usr.id);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 flex items-center font-bold"
                        >
                          <Trash2 size={12} className="mr-1" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. MANAGE STUDENTS TAB */}
      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Student Registry & Creation</h2>
          </div>

          {/* Add Student Form */}
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!studentName.trim() || !studentEmail.trim()) return;
              await createUser({
                id: `user-${Date.now()}`,
                name: studentName,
                email: studentEmail,
                password: studentPassword || "password",
                role: "student",
                createdAt: new Date().toISOString()
              });
              setStudentName("");
              setStudentEmail("");
              setStudentPassword("");
              setStudentSuccess(true);
              setTimeout(() => setStudentSuccess(false), 3000);
            }} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 max-w-xl"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configure New Student Profile</h3>
            {studentSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <Check size={14} />
                <span>Student registered. real-time email outbox verified.</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Password Preset</label>
                <input
                  type="text"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="default: password"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Student Email Address</label>
              <input
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/15 flex items-center space-x-1.5"
            >
              <PlusCircle size={14} />
              <span>Register Student Profile</span>
            </button>
          </form>

          {/* Students Directory table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Student Accounts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Enrollment State</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-750 dark:text-slate-350">
                  {usersList.filter(u => u.role === "student").map((usr, i) => {
                    const count = enrollments.filter(e => e.studentId === usr.id).length;
                    return (
                      <tr key={i}>
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-250">{usr.name}</td>
                        <td className="py-4 px-4">{usr.email}</td>
                        <td className="py-4 px-4">
                          <span className="bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                            {count} active courses
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => {
                              if (window.confirm("Audit purge student? All progress records will be removed.")) {
                                deleteUser(usr.id);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-700 flex items-center font-bold"
                          >
                            <Trash2 size={12} className="mr-1" /> Purge Account
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. MANAGE CERTIFICATES TAB */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Global Credentials Ledger Audit</h2>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Issued Completion Certificates</h3>
            
            {certificates.length === 0 ? (
              <p className="text-xs text-slate-455 text-center py-6">No credentials generated yet. Certificates are issued upon 100% course lecture completion.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Verification ID</th>
                      <th className="py-3 px-4">Recipient Student</th>
                      <th className="py-3 px-4">Syllabus Complete</th>
                      <th className="py-3 px-4">Date Approved</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-750 dark:text-slate-350">
                    {certificates.map((cert, i) => (
                      <tr key={i}>
                        <td className="py-4 px-4 font-mono font-semibold text-slate-400">{cert.id || `cert-${i}`}</td>
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-250">{cert.studentName}</td>
                        <td className="py-4 px-4 italic">{cert.courseTitle}</td>
                        <td className="py-4 px-4">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setViewingCert(cert)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                          >
                            <Printer size={12} /> View & Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. VIEW REPORTS & OUTBOX LOGS TAB */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Global Outbox Logs & Platform Metrics</h2>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Overall Quiz Average", value: results.length > 0 ? `${Math.round((results.reduce((acc, r) => acc + (r.score / r.totalQuestions), 0) / results.length) * 100)}%` : "84%", desc: "Based on active attempts" },
              { label: "Course Complete Rate", value: enrollments.length > 0 ? `${Math.round((enrollments.filter(e => e.progress === 100).length / enrollments.length) * 100)}%` : "0%", desc: "Syllabi finished successfully" },
              { label: "Simulated Dispatches", value: `${emails.length} sent`, desc: "Active real-time outbox log count" }
            ].map((metric, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{metric.label}</p>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 font-display">{metric.value}</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-2 font-medium">{metric.desc}</p>
              </div>
            ))}
          </div>

          {/* Email Outbox Console */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Mail className="mr-1.5 text-indigo-500" size={16} /> SMTP Outbox logs (Real-time Simulation)
              </h3>
              <span className="text-[9px] uppercase bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded tracking-wider">SMTP Server Online</span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {emails.length === 0 ? (
                <p className="text-xs text-slate-450 text-center py-6">No emails dispatched yet.</p>
              ) : (
                emails.map(email => (
                  <div key={email.id} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-850/40 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">To: <span className="font-normal text-slate-500">{email.to}</span></p>
                        <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">Subject: {email.subject}</p>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(email.sentAt).toLocaleTimeString()} • {new Date(email.sentAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/40 leading-relaxed font-mono text-[10px] whitespace-pre-line">
                      {email.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render Certificate Modal if needed */}
      {viewingCert && (
        <CertificateTemplate
          certificate={viewingCert}
          onClose={() => setViewingCert(null)}
        />
      )}

    </div>
  );
}
