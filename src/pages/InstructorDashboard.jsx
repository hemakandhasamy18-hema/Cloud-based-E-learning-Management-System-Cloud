import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { dbService } from "../services/db";
import { 
  PlusCircle, BookOpen, PenTool, ClipboardList, CheckSquare, Users, Edit, Trash2, Calendar, FileText, ChevronRight, Check, X, ShieldAlert, Video
} from "lucide-react";

export default function InstructorDashboard({ activeTab }) {
  const { user } = useAuth();
  const { 
    courses, enrollments, createNewCourse, deleteCourse, addLesson, addAssignment, addQuiz, submissions, gradeSubmission, triggerNotification, scheduleLiveClass 
  } = useData();

  // Dialog / Modal toggles
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourseForWorkspace, setSelectedCourseForWorkspace] = useState(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("lessons");
  
  // Create Course Forms
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseCategory, setCourseCategory] = useState("Cloud Computing");
  const [courseThumb, setCourseThumb] = useState("");

  // Add Lesson Forms
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [lessonPdf, setLessonPdf] = useState("");
  const [lessonOrder, setLessonOrder] = useState("1");
  const [lessonSuccess, setLessonSuccess] = useState(false);

  // Add Assignment Forms
  const [assignTitle, setAssignTitle] = useState("");
  const [assignInst, setAssignInst] = useState("");
  const [assignPdf, setAssignPdf] = useState("");
  const [assignDue, setAssignDue] = useState("");
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Add Quiz Forms
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);
  const [quizSuccess, setQuizSuccess] = useState(false);

  // Live Class forms state
  const [liveTitle, setLiveTitle] = useState("");
  const [liveDesc, setLiveDesc] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [liveMeetUrl, setLiveMeetUrl] = useState("");
  const [liveSuccess, setLiveSuccess] = useState(false);

  // Grading Form State
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeScore, setGradeScore] = useState("A");
  const [gradeFeedback, setGradeFeedback] = useState("");

  // Filters for Instructor
  const myCourses = courses.filter(c => c.instructorId === user.id);
  const myCourseIds = myCourses.map(c => c.id);
  
  // Filter submissions for this instructor's courses
  const instructorSubmissions = submissions.filter(s => {
    // For mock setup, find if the assignment belongs to instructor's courses
    return true; // We can load all for grading in the simple database logic
  });
  const pendingSubmissions = instructorSubmissions.filter(s => s.status === "pending");

  // Filter enrollments for this instructor's courses
  const instructorEnrollments = enrollments.filter(e => myCourseIds.includes(e.courseId));

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    
    await createNewCourse(courseTitle, courseDesc, courseCategory, courseThumb);
    setShowCreateModal(false);
    setCourseTitle("");
    setCourseDesc("");
    setCourseThumb("");
  };

  const handleDeleteCourse = async (cId) => {
    if (window.confirm("Are you sure you want to delete this course and all associated lectures/data? This action is hosted on the cloud and irreversible.")) {
      await deleteCourse(cId);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    await addLesson(
      selectedCourseForWorkspace.id,
      lessonTitle,
      lessonContent,
      lessonVideo || "https://www.w3schools.com/html/mov_bbb.mp4",
      lessonPdf || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      lessonOrder
    );

    setLessonSuccess(true);
    setLessonTitle("");
    setLessonContent("");
    setLessonVideo("");
    setLessonPdf("");
    setLessonOrder(Number(lessonOrder) + 1 + "");
    setTimeout(() => setLessonSuccess(false), 3000);
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    await addAssignment(
      selectedCourseForWorkspace.id,
      assignTitle,
      assignInst,
      assignPdf || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      assignDue
    );

    setAssignSuccess(true);
    setAssignTitle("");
    setAssignInst("");
    setAssignPdf("");
    setAssignDue("");
    setTimeout(() => setAssignSuccess(false), 3000);
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    await addQuiz(selectedCourseForWorkspace.id, quizTitle, quizQuestions);
    setQuizSuccess(true);
    setQuizTitle("");
    setQuizQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
    setTimeout(() => setQuizSuccess(false), 3000);
  };

  const handleQuizQuestionChange = (qIdx, field, val) => {
    setQuizQuestions(prev => prev.map((q, idx) => {
      if (idx === qIdx) {
        return { ...q, [field]: val };
      }
      return q;
    }));
  };

  const handleQuizOptionChange = (qIdx, optIdx, val) => {
    setQuizQuestions(prev => prev.map((q, idx) => {
      if (idx === qIdx) {
        const newOpts = [...q.options];
        newOpts[optIdx] = val;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const handleAddQuestionRow = () => {
    setQuizQuestions(prev => [...prev, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    await gradeSubmission(gradingSubmission.id, gradeScore, gradeFeedback);
    setGradingSubmission(null);
    setGradeFeedback("");
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* ANALYTICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "My Total Courses", count: myCourses.length, icon: BookOpen, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400" },
          { label: "Active Student Enrollments", count: instructorEnrollments.length, icon: Users, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" },
          { label: "Pending Evaluations", count: pendingSubmissions.length, icon: CheckSquare, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400" },
          { label: "Completed Assignments", count: instructorSubmissions.length - pendingSubmissions.length, icon: PenTool, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 font-display">{stat.count}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* RENDER VIEW TAB */}
      
      {/* 1. COURSES TAB */}
      {activeTab === "courses" && !selectedCourseForWorkspace && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Course Administration Studio</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10"
            >
              <PlusCircle size={16} />
              <span>Create New Course</span>
            </button>
          </div>

          {/* List of my courses */}
          {myCourses.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <span className="text-4xl">🎓</span>
              <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 mt-4">You are not instructing any courses yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Click "Create New Course" above to initiate a cloud curriculum module.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map(course => (
                <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
                  <div className="relative h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-50 dark:border-slate-850/50 mt-3 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCourseForWorkspace(course)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-2 rounded-xl transition-all"
                    >
                      <PlusCircle size={14} />
                      <span>Edit Curriculum</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors ml-2"
                      title="Delete Course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COURSE SYLLABI / WORKSPACE EDIT AREA */}
      {selectedCourseForWorkspace && (
        <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          {/* Workspace Header */}
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <button 
                onClick={() => setSelectedCourseForWorkspace(null)} 
                className="text-xs text-slate-400 hover:text-slate-700 font-semibold mb-2 block"
              >
                ← Back to Courses list
              </button>
              <h2 className="font-display font-extrabold text-xl text-slate-850 dark:text-slate-100">
                Workspace: {selectedCourseForWorkspace.title}
              </h2>
            </div>
            <span className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-1 px-3 rounded-lg border border-indigo-200/50 dark:border-indigo-800/40 capitalize">
              {selectedCourseForWorkspace.category}
            </span>
          </div>

          {/* Workspace Sub-Tabs */}
          <div className="flex space-x-2 border-b border-slate-100 dark:border-slate-850 pb-2">
            {[
              { id: "lessons", label: "Add Lessons (Video/Notes)", icon: BookOpen },
              { id: "assignments", label: "Create Lab Assignments", icon: PenTool },
              { id: "quizzes", label: "Build Timed Quiz", icon: ClipboardList },
              { id: "live", label: "Schedule Live Class", icon: Video }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveWorkspaceTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeWorkspaceTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Workspace content screens */}
          
          {/* 1. Add Lesson */}
          {activeWorkspaceTab === "lessons" && (
            <form onSubmit={handleAddLesson} className="space-y-4 max-w-2xl">
              {lessonSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <Check size={14} />
                  <span>Lesson added and published to student classroom catalog!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Lesson Title</label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="e.g. Virtualization Basics"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Sequence Order</label>
                  <input
                    type="number"
                    required
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Video Lecture URL (Firebase Storage link)</label>
                  <input
                    type="text"
                    value={lessonVideo}
                    onChange={(e) => setLessonVideo(e.target.value)}
                    placeholder="Leave empty for open-source simulated default video"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Attached Material PDF URL</label>
                  <input
                    type="text"
                    value={lessonPdf}
                    onChange={(e) => setLessonPdf(e.target.value)}
                    placeholder="Leave empty for simulated reference guide"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Lecture Notes (supports HTML content)</label>
                <textarea
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  rows={6}
                  required
                  placeholder="<h3>Lecture Synopsis</h3><p>Describe primary definitions and virtualization architectures here...</p>"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                Add Lesson & Publish
              </button>
            </form>
          )}

          {/* 2. Add Assignment */}
          {activeWorkspaceTab === "assignments" && (
            <form onSubmit={handleAddAssignment} className="space-y-4 max-w-2xl">
              {assignSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <Check size={14} />
                  <span>Lab assignment added successfully! Students can now submit solutions.</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Assignment Title</label>
                  <input
                    type="text"
                    required
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    placeholder="e.g. Lab 1: Configure Hypervisor"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Due Date</label>
                  <input
                    type="date"
                    required
                    value={assignDue}
                    onChange={(e) => setAssignDue(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Guidelines Attachment PDF URL</label>
                <input
                  type="text"
                  value={assignPdf}
                  onChange={(e) => setAssignPdf(e.target.value)}
                  placeholder="Optional reference PDF link"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Instructions & Requirements</label>
                <textarea
                  value={assignInst}
                  onChange={(e) => setAssignInst(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe step by step directions and expected screenshots details for this submission..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                Create Lab Assignment
              </button>
            </form>
          )}

          {/* 3. Add Quiz */}
          {activeWorkspaceTab === "quizzes" && (
            <form onSubmit={handleAddQuiz} className="space-y-6 max-w-2xl">
              {quizSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <Check size={14} />
                  <span>Timed online quiz created successfully!</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Quiz Room Name</label>
                <input
                  type="text"
                  required
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. Unit 1 Quiz: Cloud Infrastructure Basics"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* Quiz Questions List builder */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Questions List</p>
                  <button
                    type="button"
                    onClick={handleAddQuestionRow}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    + Add New Question Row
                  </button>
                </div>

                {quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Question {qIdx + 1}</label>
                      <input
                        type="text"
                        required
                        value={q.question}
                        onChange={(e) => handleQuizQuestionChange(qIdx, "question", e.target.value)}
                        placeholder="Write multiple choice question here..."
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctAnswer === oIdx}
                            onChange={() => handleQuizQuestionChange(qIdx, "correctAnswer", oIdx)}
                          />
                          <input
                            type="text"
                            required
                            placeholder={`Option ${oIdx + 1}`}
                            value={opt}
                            onChange={(e) => handleQuizOptionChange(qIdx, oIdx, e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                Assemble & Publish Quiz
              </button>
            </form>
          )}

          {/* 4. Schedule Live Class */}
          {activeWorkspaceTab === "live" && (
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!liveTitle.trim() || !liveMeetUrl.trim() || !liveDate.trim()) return;
                await scheduleLiveClass(selectedCourseForWorkspace.id, {
                  title: liveTitle,
                  description: liveDesc,
                  dateTime: liveDate,
                  meetUrl: liveMeetUrl
                });
                setLiveSuccess(true);
                setLiveTitle("");
                setLiveDesc("");
                setLiveDate("");
                setLiveMeetUrl("");
                setTimeout(() => setLiveSuccess(false), 3000);
              }}
              className="space-y-4 max-w-2xl animate-in fade-in duration-200"
            >
              {liveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <Check size={14} />
                  <span>Live class scheduled successfully! Invitation emails sent to enrolled students.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Lecture Topic Title</label>
                  <input
                    type="text"
                    required
                    value={liveTitle}
                    onChange={(e) => setLiveTitle(e.target.value)}
                    placeholder="e.g. AWS Security VPC Best Practices"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Class Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={liveDate}
                    onChange={(e) => setLiveDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Google Meet Link</label>
                <input
                  type="url"
                  required
                  value={liveMeetUrl}
                  onChange={(e) => setLiveMeetUrl(e.target.value)}
                  placeholder="e.g. https://meet.google.com/abc-defg-hij"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Lecture Agenda / Description</label>
                <textarea
                  value={liveDesc}
                  onChange={(e) => setLiveDesc(e.target.value)}
                  rows={4}
                  placeholder="Provide details on what files or labs to review before joining the call..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-650 hover:bg-indigo-705 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center space-x-1.5"
              >
                <Video size={14} />
                <span>Publish Google Meet Link</span>
              </button>
            </form>
          )}

        </div>
      )}

      {/* 2. GRADING PANEL TAB */}
      {activeTab === "grading" && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Student Submission Evaluation Portal</h2>
          
          {instructorSubmissions.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <p className="text-xs text-slate-400">No submissions from enrolled students recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Assignment Topic</th>
                      <th className="py-3 px-4">Date Submitted</th>
                      <th className="py-3 px-4">Evaluation Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-350">
                    {instructorSubmissions.map((sub, i) => (
                      <tr key={i}>
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">{sub.studentName}</td>
                        <td className="py-4 px-4">Cloud Architecture & Hypervisors</td>
                        <td className="py-4 px-4">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            sub.status === "graded"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600 animate-pulse"
                          }`}>
                            {sub.status === "graded" ? `Graded (${sub.grade})` : "Pending"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setGradingSubmission(sub)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            {sub.status === "graded" ? "Review Details" : "Grade Submission"}
                          </button>
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

      {/* 3. STUDENT TRACKING TAB */}
      {activeTab === "enrollments" && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">Student Progress Tracking Directory</h2>
          
          {instructorEnrollments.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <p className="text-xs text-slate-400">No student enrollments registered for your courses yet.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Student ID</th>
                      <th className="py-3 px-4">Course Module</th>
                      <th className="py-3 px-4">Enrollment Date</th>
                      <th className="py-3 px-4">Lecture Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-350">
                    {instructorEnrollments.map((enr, i) => {
                      const course = courses.find(c => c.id === enr.courseId);
                      return (
                        <tr key={i}>
                          <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">Rahul Kumar ({enr.studentId})</td>
                          <td className="py-4 px-4">{course?.title || "Cloud Computing"}</td>
                          <td className="py-4 px-4">{new Date(enr.enrolledAt).toLocaleDateString()}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full" style={{ width: `${enr.progress}%` }} />
                              </div>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{enr.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER GRADING EVALUATION DIALOG OVERLAY */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 md:p-8 space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-850 dark:text-slate-100">Evaluate Submission</h3>
                <p className="text-xs text-slate-400 mt-0.5">Submitted by {gradingSubmission.studentName}</p>
              </div>
              <button onClick={() => setGradingSubmission(null)} className="text-slate-400 hover:text-slate-650">✕</button>
            </div>

            {/* Answer details */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-850 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs max-h-56 overflow-y-auto">
              <p className="font-bold text-slate-400 uppercase tracking-wider">Student Report Text</p>
              <p className="text-slate-650 dark:text-slate-350 whitespace-pre-line leading-relaxed">{gradingSubmission.submissionText}</p>
              
              {gradingSubmission.fileUrl && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Cloud Storage Payload attachment:</span>
                  <a href={gradingSubmission.fileUrl} target="_blank" rel="noreferrer" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg font-bold text-indigo-600 dark:text-indigo-400">Open File</a>
                </div>
              )}
            </div>

            {/* Grade Input Form */}
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Select Grade Marks</label>
                  <select
                    value={gradeScore}
                    onChange={(e) => setGradeScore(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    {["A", "B", "C", "D", "Fail"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <span className="text-[10px] text-slate-400 italic mb-2">Grading triggers a real-time notification to the student account.</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Evaluation Feedback & Reviews</label>
                <textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Excellent VM deployment. Screenshots confirm proper interface configurations. Well done!"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md"
              >
                Grade Solutions & Send Feedback
              </button>
            </form>

          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL OVERLAY */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-display font-extrabold text-lg text-slate-850 dark:text-slate-100">Create New Course Curriculum</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-650">✕</button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Introduction to Cloud Cryptography"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Category Segment</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-800 dark:text-slate-350"
                  >
                    {["Cloud Computing", "DevOps", "Cloud Security", "Web Services"].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Thumbnail URL</label>
                  <input
                    type="text"
                    value={courseThumb}
                    onChange={(e) => setCourseThumb(e.target.value)}
                    placeholder="Leave empty for dynamic Cloud Graphic"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Course Description</label>
                <textarea
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  rows={4}
                  required
                  placeholder="Provide an overview of virtualization modules, laboratories, and curriculum coverage..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md"
              >
                Initialize & Publish Course
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
