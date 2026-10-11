import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { dbService } from "../services/db";
import { storageService } from "../services/storage";
import { 
  Play, CheckCircle, FileText, ChevronLeft, Check, UploadCloud, FileCheck, ArrowRight, Timer, Heart, MessageSquare, Video, Calendar, Send
} from "lucide-react";
import QuizPage from "./QuizPage";

export default function CourseView({ courseId, onClose }) {
  const { user } = useAuth();
  const { 
    courses, enrollments, updateLessonProgress, submitAssignment, submissions, triggerNotification, bookmarks, toggleBookmark, createDiscussionThread, addDiscussionReply 
  } = useData();

  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("content");
  const [loading, setLoading] = useState(true);

  // Forum forms state
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [replyTextMap, setReplyTextMap] = useState({}); // threadId -> text

  // Assignment submissions states
  const [submissionText, setSubmissionText] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Quiz running states
  const [activeQuiz, setActiveQuiz] = useState(null);

  const course = courses.find(c => c.id === courseId);
  const enrollment = enrollments.find(e => e.courseId === courseId && e.studentId === user.id);

  useEffect(() => {
    const loadCourseDetails = async () => {
      setLoading(true);
      try {
        const less = await dbService.getLessons(courseId);
        setLessons(less);
        if (less.length > 0) setSelectedLesson(less[0]);

        const assign = await dbService.getAssignments(courseId);
        setAssignments(assign);

        const quizList = await dbService.getQuizzes(courseId);
        setQuizzes(quizList);

        const discList = await dbService.getDiscussions(courseId);
        setDiscussions(discList);

        const liveList = await dbService.getLiveClasses(courseId);
        setLiveClasses(liveList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const isLessonCompleted = (lessonId) => {
    return enrollment?.completedLessons?.includes(lessonId) || false;
  };

  const handleToggleLessonComplete = async (lessonId) => {
    const isCompleted = isLessonCompleted(lessonId);
    await updateLessonProgress(courseId, lessonId, !isCompleted);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleAssignmentSubmit = async (e, assignmentId) => {
    e.preventDefault();
    if (!submissionText.trim() && !fileToUpload) return;
    setUploading(true);
    try {
      let fileUrl = "";
      if (fileToUpload) {
        // Upload path schema
        const path = `assignments/${assignmentId}/${user.id}_${fileToUpload.name}`;
        fileUrl = await storageService.uploadFile(fileToUpload, path);
      }

      await submitAssignment(assignmentId, submissionText, fileUrl);
      setSubmissionSuccess(true);
      setSubmissionText("");
      setFileToUpload(null);
      
      // Notify instructor (mock representation)
      await triggerNotification(
        "instructor-1", 
        "Assignment Submitted", 
        `${user.name} submitted an assignment for grading.`
      );
      
      setTimeout(() => setSubmissionSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const getSubmissionForAssignment = (assignId) => {
    return submissions.find(s => s.assignmentId === assignId && s.studentId === user.id);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row max-h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Quiz Overlay */}
      {activeQuiz && (
        <QuizPage
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
        />
      )}

      {/* LEFT CONTENT AREA: VIDEO PLAYER AND NOTES */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col justify-between">
        
        <div className="space-y-4">
          {/* Back Action Header */}
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-bold uppercase tracking-wider"
          >
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex justify-between items-center gap-4">
            <h2 className="font-display font-extrabold text-xl md:text-2xl text-slate-800 dark:text-white line-clamp-1">{course?.title}</h2>
            <button
              type="button"
              onClick={() => toggleBookmark(course.id)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:scale-105 active:scale-95 transition-all text-xs font-bold text-slate-650 dark:text-slate-400"
              title={bookmarks && bookmarks.includes(course.id) ? "Remove Bookmark" : "Bookmark this course"}
            >
              <Heart size={14} className={bookmarks && bookmarks.includes(course.id) ? "fill-rose-500 text-rose-500" : "text-rose-500"} />
              <span className="hidden sm:inline">{bookmarks && bookmarks.includes(course.id) ? "Bookmarked" : "Bookmark"}</span>
            </button>
          </div>
        </div>

        {/* Video Screen Layout */}
        {selectedLesson ? (
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative shadow-lg group">
            {/* HTML5 video element */}
            <video 
              key={selectedLesson.id}
              className="w-full h-full object-contain" 
              controls
              onEnded={() => handleToggleLessonComplete(selectedLesson.id)}
            >
              <source src={selectedLesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full pointer-events-none">
              Now Streaming: {selectedLesson.title}
            </div>
          </div>
        ) : (
          <div className="bg-slate-200 dark:bg-slate-900 aspect-video rounded-2xl flex flex-col items-center justify-center text-slate-400">
            <Play size={48} className="stroke-1 mb-2" />
            <span>Select a lesson from playlist to begin.</span>
          </div>
        )}

        {/* Sub-Tabs: Lesson Description, Study Materials, Assignments, Quizzes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm mt-6 flex-1">
          <div className="flex border-b border-slate-100 dark:border-slate-850 pb-2 overflow-x-auto space-x-2">
            {[
              { id: "content", label: "Lecture Notes" },
              { id: "pdf", label: "Download materials" },
              { id: "assignments", label: "Lab Assignments" },
              { id: "quizzes", label: "Quiz Room" },
              { id: "forum", label: "Discussion Forum" },
              { id: "live", label: "Live Lectures" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-855 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-5 space-y-4">
            
            {/* Notes content */}
            {activeSubTab === "content" && selectedLesson && (
              <div 
                className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-350 space-y-3"
                dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
              />
            )}

            {/* PDFs Download */}
            {activeSubTab === "pdf" && selectedLesson && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">Instructor Amit has attached research and documentation resources for this module.</p>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-violet-600" size={24} />
                    <div>
                      <h4 className="font-bold text-xs">Reference Notes & Syllabus.pdf</h4>
                      <p className="text-[10px] text-slate-400">PDF Document • 4.2 MB</p>
                    </div>
                  </div>
                  <a
                    href={selectedLesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            )}

            {/* Assignments View & Submit */}
            {activeSubTab === "assignments" && (
              <div className="space-y-6">
                {assignments.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No lab assignments configured for this course yet.</p>
                ) : (
                  assignments.map(assign => {
                    const sub = getSubmissionForAssignment(assign.id);
                    
                    return (
                      <div key={assign.id} className="border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-slate-850 dark:text-slate-100">{assign.title}</h4>
                            <p className="text-[10px] text-rose-500 font-semibold mt-1">Due: {assign.dueDate}</p>
                          </div>
                          {sub && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              sub.status === "graded" 
                                ? "bg-emerald-500/10 text-emerald-600" 
                                : "bg-amber-500/10 text-amber-600"
                            }`}>
                              {sub.status === "graded" ? `Graded: ${sub.grade}` : "Awaiting Evaluation"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-450 whitespace-pre-line leading-relaxed">{assign.instructions}</p>
                        
                        {/* Instructor Guidelines file */}
                        {assign.fileUrl && (
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-slate-400">Attached guidelines:</span>
                            <a href={assign.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Download file</a>
                          </div>
                        )}

                        {/* Submission State Checker */}
                        {sub ? (
                          <div className="mt-4 bg-white dark:bg-slate-850 p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Submission</p>
                            <p className="text-xs text-slate-600 dark:text-slate-350">{sub.submissionText}</p>
                            {sub.fileUrl && (
                              <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center space-x-1 mt-2">
                                <FileCheck size={12} className="mr-1" /> View Uploaded File
                              </a>
                            )}
                            
                            {/* Grading Feedbacks */}
                            {sub.status === "graded" && (
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <p className="font-bold text-emerald-600">Instructor Feedback:</p>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 italic">"{sub.feedback || "Good job."}"</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleAssignmentSubmit(e, assign.id)} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            {submissionSuccess && (
                              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                                <Check size={14} />
                                <span>Assignment submitted successfully!</span>
                              </div>
                            )}

                            <div>
                              <label className="block text-[10px] font-bold text-slate-450 uppercase mb-2">Write Report / Answer Text</label>
                              <textarea
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                rows={4}
                                required={!fileToUpload}
                                placeholder="Explain your virtualization setup steps or type your answer report here..."
                                className="w-full px-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                              />
                            </div>

                            {/* Upload area */}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <UploadCloud size={24} className="text-slate-400 mb-1" />
                              <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer">
                                <span>{fileToUpload ? fileToUpload.name : "Attach Lab Screenshot or Report File"}</span>
                                <input type="file" onChange={handleFileChange} className="hidden" />
                              </label>
                              <span className="text-[9px] text-slate-400 mt-0.5">Supports PDF, PNG, JPG up to 10MB</span>
                            </div>

                            <button
                              type="submit"
                              disabled={uploading}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center space-x-1.5 disabled:opacity-50"
                            >
                              {uploading ? (
                                <span>Uploading file to Cloud Storage...</span>
                              ) : (
                                <>
                                  <span>Submit Assignment</span>
                                  <ArrowRight size={12} />
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Quiz Engine Trigger */}
            {activeSubTab === "quizzes" && (
              <div className="space-y-4">
                {quizzes.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No online quizzes scheduled for this course yet.</p>
                ) : (
                  quizzes.map(quiz => (
                    <div key={quiz.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 flex justify-between items-center shadow-sm">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm">{quiz.title}</h4>
                        <div className="flex items-center text-xs text-slate-400 space-x-3">
                          <span className="flex items-center"><Timer size={12} className="mr-1" /> 10 minutes</span>
                          <span>{quiz.questions.length} questions</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setActiveQuiz(quiz)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md"
                      >
                        Start Quiz
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Discussion Forum Sub-Tab */}
            {activeSubTab === "forum" && (
              <div className="space-y-6">
                {/* Add thread Form */}
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
                    const newThread = await createDiscussionThread(courseId, newThreadTitle, newThreadContent);
                    if (newThread) {
                      setDiscussions(prev => [newThread, ...prev]);
                      setNewThreadTitle("");
                      setNewThreadContent("");
                    }
                  }} 
                  className="bg-slate-50 dark:bg-slate-850 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start a new discussion thread</h4>
                  <input
                    type="text"
                    required
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    placeholder="Thread Title (e.g., Question about Docker Compose networking)"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none text-slate-900 dark:text-white"
                  />
                  <textarea
                    required
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    rows={3}
                    placeholder="Describe your question or comments in detail..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-all shadow flex items-center space-x-1.5"
                  >
                    <span>Post Question</span>
                    <Send size={10} />
                  </button>
                </form>

                {/* Discussions list */}
                <div className="space-y-4">
                  {discussions.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No threads posted. Be the first to start a conversation!</p>
                  ) : (
                    discussions.map(thread => (
                      <div key={thread.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4 animate-in fade-in duration-255">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-slate-850 dark:text-slate-100">{thread.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Posted by <span className="font-semibold text-slate-600 dark:text-slate-300">{thread.userName}</span> ({thread.userRole}) • {new Date(thread.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-850/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                          {thread.content}
                        </p>

                        {/* Replies Section */}
                        <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-3">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Replies ({thread.replies?.length || 0})</p>
                          
                          {thread.replies && thread.replies.map(reply => (
                            <div key={reply.id} className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 text-xs py-1 space-y-1">
                              <p className="font-semibold text-slate-700 dark:text-slate-250">
                                {reply.userName} <span className="text-[9px] uppercase font-bold text-indigo-500 tracking-wider bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded ml-1.5">{reply.userRole}</span>
                              </p>
                              <p className="text-slate-600 dark:text-slate-350">{reply.content}</p>
                              <p className="text-[9px] text-slate-400">{new Date(reply.createdAt).toLocaleDateString()} at {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                          ))}

                          {/* Write reply */}
                          <form 
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const text = replyTextMap[thread.id] || "";
                              if (!text.trim()) return;
                              const updated = await addDiscussionReply(courseId, thread.id, text);
                              if (updated) {
                                setDiscussions(prev => prev.map(d => d.id === thread.id ? updated : d));
                                setReplyTextMap(prev => ({ ...prev, [thread.id]: "" }));
                              }
                            }}
                            className="flex gap-2 pt-2"
                          >
                            <input
                              type="text"
                              required
                              value={replyTextMap[thread.id] || ""}
                              onChange={(e) => setReplyTextMap(prev => ({ ...prev, [thread.id]: e.target.value }))}
                              placeholder="Write a response..."
                              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none text-slate-900 dark:text-white"
                            />
                            <button
                              type="submit"
                              className="bg-slate-100 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-700 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-700 dark:text-slate-300"
                            >
                              Reply
                            </button>
                          </form>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Live Lectures Schedule display */}
            {activeSubTab === "live" && (
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-850 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center space-x-3">
                  <Video className="text-rose-500 animate-pulse" size={24} />
                  <div>
                    <h4 className="font-bold text-xs">Live Google Meet Integration</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Students can join scheduled video conferences directly from this workspace dashboard.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {liveClasses.length === 0 ? (
                    <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                      <p className="text-xs text-slate-400">No live interactive lectures scheduled for this course yet.</p>
                    </div>
                  ) : (
                    liveClasses.map(cls => (
                      <div key={cls.id} className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm gap-4">
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm text-slate-850 dark:text-slate-100">{cls.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-405">{cls.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-semibold pt-1">
                            <span className="flex items-center"><Calendar size={11} className="mr-1" /> {new Date(cls.dateTime).toLocaleDateString()}</span>
                            <span className="flex items-center"><Timer size={11} className="mr-1" /> {new Date(cls.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span>Instructor: {cls.instructorName}</span>
                          </div>
                        </div>

                        <a
                          href={cls.meetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-rose-600/10 whitespace-nowrap flex items-center space-x-1.5"
                        >
                          <Video size={12} />
                          <span>Join Google Meet</span>
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: LESSONS LIST */}
      <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100">Course Syllabus</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Click a lecture to watch the video</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {lessons.map((less, idx) => {
            const completed = isLessonCompleted(less.id);
            const isSelected = selectedLesson?.id === less.id;
            
            return (
              <div 
                key={less.id} 
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? "bg-indigo-50/70 dark:bg-indigo-950/20 border-l-4 border-indigo-600" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-850"
                }`}
                onClick={() => setSelectedLesson(less)}
              >
                <div className="flex items-center space-x-3 pr-2 min-w-0">
                  {/* Status Index / Play Icon */}
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isSelected 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate ${isSelected ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-800 dark:text-slate-300"}`}>
                      {less.title}
                    </p>
                    <p className="text-[10px] text-slate-400">Lecture • 5 min</p>
                  </div>
                </div>

                {/* Completion Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleLessonComplete(less.id);
                  }}
                  className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                    completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-transparent"
                  }`}
                >
                  {completed && <Check size={12} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
