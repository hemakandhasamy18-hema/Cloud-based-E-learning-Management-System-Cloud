import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { BookOpen, Search, Filter, Play, CheckCircle, Clock, Calendar, Award, CheckSquare, Sparkles, User, UserCheck, Bookmark, Heart, Send } from "lucide-react";
import CertificateTemplate from "../components/CertificateTemplate";

export default function StudentDashboard({ activeTab, onSelectCourse }) {
  const { user } = useAuth();
  const { 
    courses, enrollments, enrollInCourse, submissions, results, notifications, bookmarks, toggleBookmark, certificates 
  } = useData();

  // Search & Categories
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  // Selected certificate for viewing
  const [viewingCert, setViewingCert] = useState(null);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileSaved, setProfileSaved] = useState(false);

  // AI Roadmap Analyzer State
  const [aiGoalQuery, setAiGoalQuery] = useState("");
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Get categories dynamically
  const categories = ["All", ...new Set(courses.map(c => c.category))];

  // Filters
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesBookmark = !showBookmarkedOnly || (bookmarks && bookmarks.includes(c.id));
    return matchesSearch && matchesCategory && matchesBookmark;
  });

  const getEnrollmentForCourse = (courseId) => {
    return enrollments.find(e => e.courseId === courseId && e.studentId === user.id);
  };

  const handleEnroll = async (courseId) => {
    await enrollInCourse(courseId);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
    user.name = profileName;
  };

  // AI Roadmap Generator - Client-side NLP keyword-matching simulation
  const handleGenerateAiRoadmap = (e) => {
    e.preventDefault();
    if (!aiGoalQuery.trim()) return;
    setAiLoading(true);
    
    setTimeout(() => {
      const queryLower = aiGoalQuery.toLowerCase();
      const scored = courses.map(course => {
        let score = 20; // base relevance
        let reasons = [];

        const matches = [
          { word: "cloud", points: 25, reason: "AWS/GCP Public Cloud reference" },
          { word: "virtualization", points: 30, reason: "Virtual Machines and Hypervisors" },
          { word: "hypervisor", points: 30, reason: "Bare-metal Virtualization Layer" },
          { word: "docker", points: 35, reason: "Docker Containerization container runtime" },
          { word: "kubernetes", points: 35, reason: "K8s Microservice Pod Orchestration" },
          { word: "devops", points: 30, reason: "Automated Build CI/CD Pipeline tools" },
          { word: "security", points: 30, reason: "VPC IAM Security Constraints" },
          { word: "network", points: 25, reason: "Virtual Private Networks" },
          { word: "aws", points: 25, reason: "Amazon Web Services" },
          { word: "scale", points: 25, reason: "Auto-scaling Load balancing" }
        ];

        matches.forEach(m => {
          if (queryLower.includes(m.word)) {
            score += m.points;
            reasons.push(m.reason);
          }
        });

        if (course.title.toLowerCase().includes(queryLower)) {
          score += 40;
          reasons.push("Direct Title Keyword Match");
        }
        if (course.description.toLowerCase().includes(queryLower)) {
          score += 20;
          reasons.push("Topic Description Alignment");
        }

        const finalScore = Math.min(99, score);
        return { course, score: finalScore, reasons };
      });

      // Filter matching roadmaps and sort
      const resultsRoadmap = scored
        .filter(s => s.score > 25)
        .sort((a, b) => b.score - a.score);

      setAiRoadmap(resultsRoadmap);
      setAiLoading(false);
    }, 1500);
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 rounded-3xl p-6 md:p-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-800 dark:text-white flex items-center">
            Welcome back, {user?.name}! <Sparkles className="text-amber-500 ml-2 animate-bounce" size={24} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            You are enrolled in {enrollments.length} courses. Let's make progress today.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 px-4 py-2.5 rounded-2xl shadow-sm backdrop-blur">
          <span className="text-xl">🏆</span>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completed Quizzes</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{results.length} taken</p>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE TAB VIEW */}
      
      {/* 1. BROWSE COURSES TAB */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search courses by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
              />
            </div>
            {/* Filters */}
            <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  showBookmarkedOnly
                    ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-650/15"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Heart size={12} className={showBookmarkedOnly ? "fill-current" : ""} />
                <span>Bookmarked Only</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
              const enrollment = getEnrollmentForCourse(course.id);
              const isBookmarked = bookmarks && bookmarks.includes(course.id);
              
              return (
                <div 
                  key={course.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {course.category}
                      </span>
                      
                      {/* Heart Bookmark Button */}
                      <button
                        type="button"
                        onClick={() => toggleBookmark(course.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/80 shadow-md hover:scale-110 active:scale-95 transition-all text-rose-500"
                        title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                      >
                        <Heart size={14} className={isBookmarked ? "fill-rose-500 stroke-rose-500" : "stroke-rose-500"} />
                      </button>
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-5 space-y-3">
                      <p className="text-[11px] text-slate-400">Instructor: {course.instructorName}</p>
                      <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 border-t border-slate-50 dark:border-slate-800/40 mt-3 flex items-center justify-between">
                    {enrollment ? (
                      <div className="w-full space-y-3 pt-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Progress</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${enrollment.progress}%` }} />
                        </div>
                        <button
                          onClick={() => onSelectCourse(course.id)}
                          className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-350 text-xs font-bold py-2.5 rounded-xl transition-all"
                        >
                          <Play size={12} />
                          <span>Resume Learning</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                      >
                        <BookOpen size={12} />
                        <span>Enroll Now</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MY LEARNINGS TAB */}
      {activeTab === "my-learnings" && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-200">Enrolled Courses</h2>
          {enrollments.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <span className="text-4xl">📚</span>
              <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 mt-4">No enrollments yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Browse our available catalog to select and enroll in cloud computer modules.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map(enroll => {
                const course = courses.find(c => c.id === enroll.courseId);
                if (!course) return null;
                
                return (
                  <div key={enroll.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-indigo-500 tracking-wider bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                          {course.category}
                        </span>
                        <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 line-clamp-1">{course.title}</h3>
                        <p className="text-[11px] text-slate-400">Enrolled: {new Date(enroll.enrolledAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mt-6">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Module Completion</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{enroll.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full" style={{ width: `${enroll.progress}%` }} />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => onSelectCourse(course.id)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                        >
                          <Play size={12} />
                          <span>{enroll.progress === 100 ? "Review Lectures" : "Resume Studies"}</span>
                        </button>
                        
                        {enroll.progress === 100 && (
                          <button
                            onClick={() => {
                              setViewingCert({
                                id: `verify-${enroll.id}`,
                                studentName: user.name,
                                courseTitle: course.title,
                                issuedAt: enroll.completedAt || new Date().toISOString()
                              });
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-xl transition-all"
                            title="View Certificate"
                          >
                            <Award size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. ASSIGNMENTS TAB */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-200">Assignments & Assessments</h2>
          {enrollments.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <p className="text-sm text-slate-400">Enroll in courses to see outstanding assignments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map(enroll => {
                const course = courses.find(c => c.id === enroll.courseId);
                if (!course) return null;
                
                // Get course assignments
                // For simulation, we'll fetch assignments matching courseId
                // We'll filter them and check submission state
                return (
                  <div key={enroll.id} className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase">{course.title}</h3>
                    {/* In a real project, we fetch course assignments. For mock representation, we render cards. */}
                    {/* We will let students complete assignments inside the specific CourseView. */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">Lab Assignment 1: Virtualization Configuration</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                          <span className="flex items-center"><Calendar size={12} className="mr-1" /> Due: Next Friday</span>
                          <span className="flex items-center"><Clock size={12} className="mr-1" /> Estimated Time: 3 hours</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onSelectCourse(course.id)}
                        className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                      >
                        Navigate to Classroom
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. QUIZ RESULTS TAB */}
      {activeTab === "results" && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-200">Quiz Analytics</h2>
          {results.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <span className="text-4xl">📝</span>
              <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 mt-4">No quiz scores recorded</h3>
              <p className="text-xs text-slate-400 mt-1">Complete quizzes inside active courses to log grades.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Quiz Title</th>
                      <th className="py-3 px-4">Correct Answers</th>
                      <th className="py-3 px-4">Percentage Score</th>
                      <th className="py-3 px-4">Date Completed</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-350">
                    {results.map((res, i) => (
                      <tr key={i}>
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">Basics of Virtualization & Hypervisors</td>
                        <td className="py-4 px-4">{res.score} / {res.totalQuestions}</td>
                        <td className="py-4 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                          {Math.round((res.score / res.totalQuestions) * 100)}%
                        </td>
                        <td className="py-4 px-4">{new Date(res.takenAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">Passed</span>
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

      {/* 5. CERTIFICATES TAB */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-200">My Certificates</h2>
          
          {/* Certificates Grid */}
          {enrollments.filter(e => e.progress === 100).length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <span className="text-4xl">🎓</span>
              <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 mt-4">No certificates issued</h3>
              <p className="text-xs text-slate-400 mt-1">Complete a course 100% (watch all video lectures) to trigger certification.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.filter(e => e.progress === 100).map(enroll => {
                const course = courses.find(c => c.id === enroll.courseId);
                if (!course) return null;

                return (
                  <div key={enroll.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                        <Award size={20} />
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-850 dark:text-slate-100">{course.title}</h3>
                      <p className="text-xs text-slate-400">Dean Signature Verified</p>
                    </div>

                    <div className="mt-6 flex justify-between items-center border-t border-slate-50 dark:border-slate-800/40 pt-4">
                      <span className="text-xs font-semibold text-slate-500">ID: verify-{enroll.id}</span>
                      <button
                        onClick={() => {
                          setViewingCert({
                            id: `verify-${enroll.id}`,
                            studentName: user.name,
                            courseTitle: course.title,
                            issuedAt: enroll.completedAt || new Date().toISOString()
                          });
                        }}
                        className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-xs font-bold"
                      >
                        <span>View & Print</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5.5 AI RECOMMENDATIONS TAB */}
      {activeTab === "ai-recommendations" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-3xl p-6 md:p-8 gap-4">
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-xl md:text-2xl text-slate-800 dark:text-white flex items-center">
                <Sparkles className="text-indigo-500 mr-2 animate-pulse" size={24} />
                Cognitive AI Pathway Advisor
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-400 max-w-xl leading-relaxed">
                Describe your research interests, career milestones, or specific technologies you want to study. Our local NLP classifier will index our cloud curriculum library to formulate an optimized sequence roadmap.
              </p>
            </div>
            <span className="hidden sm:block text-5xl">🤖</span>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleGenerateAiRoadmap} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                What are your study goals?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={aiGoalQuery}
                  onChange={(e) => setAiGoalQuery(e.target.value)}
                  placeholder="e.g. I want to build microservices, manage Docker containers, and host them securely on AWS..."
                  className="flex-1 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {aiLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Analyze</span>
                      <Send size={12} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Recommendations / Roadmap Output */}
          {aiRoadmap && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Personalized AI Recommendation Pathway ({aiRoadmap.length} Modules Recommended)
              </h3>
              
              {aiRoadmap.length === 0 ? (
                <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                  <p className="text-xs text-slate-450">No high-confidence modules found matching that query. Try terms like 'docker', 'devops', 'kubernetes', 'security', or 'virtualization'.</p>
                </div>
              ) : (
                <div className="relative border-l-2 border-indigo-500/30 dark:border-indigo-500/20 ml-4 pl-6 space-y-8">
                  {aiRoadmap.map((item, idx) => {
                    const isEnrolled = getEnrollmentForCourse(item.course.id);
                    
                    return (
                      <div key={item.course.id} className="relative animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                        {/* Timeline node */}
                        <div className="absolute -left-[35px] top-1.5 h-6 w-6 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-950 flex items-center justify-center text-[10px] text-white font-bold shadow">
                          {idx + 1}
                        </div>

                        {/* Recommendation Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-indigo-500/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                {item.course.category}
                              </span>
                              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                {item.score}% Compatibility Match
                              </span>
                            </div>
                            <h4 className="font-display font-bold text-base text-slate-850 dark:text-slate-100">
                              {item.course.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.course.description}
                            </p>
                            
                            {item.reasons.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {item.reasons.map((r, i) => (
                                  <span key={i} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md italic">
                                    ✓ {r}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            {isEnrolled ? (
                              <button
                                onClick={() => onSelectCourse(item.course.id)}
                                className="bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap"
                              >
                                Resume Studies
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEnroll(item.course.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow whitespace-nowrap"
                              >
                                Enroll Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. PROFILE MANAGEMENT TAB */}
      {activeTab === "profile" && (
        <div className="max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-200 mb-6 flex items-center">
            <User className="mr-2 text-indigo-600" size={20} /> Profile Information
          </h2>
          
          {profileSaved && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl flex items-center space-x-3 text-emerald-800 dark:text-emerald-350 text-xs font-bold">
              <UserCheck size={16} />
              <span>Display profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Registered Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cloud Credentials Role</label>
              <span className="inline-block bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-1 px-3 rounded-lg capitalize border border-indigo-200/50 dark:border-indigo-800/40">
                {user?.role} Access Mode
              </span>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10"
            >
              Save Profile Changes
            </button>
          </form>
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
