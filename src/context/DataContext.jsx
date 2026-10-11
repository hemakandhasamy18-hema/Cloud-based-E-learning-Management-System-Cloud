import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { dbService } from "../services/db";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulated email logs
  const [emails, setEmails] = useState(() => {
    const local = localStorage.getItem("lms_emails");
    return local ? JSON.parse(local) : [
      {
        id: "email-1",
        to: "student@example.com",
        subject: "Welcome to CloudLMS!",
        body: "Your B.Tech Cloud Computing workspace profile has been verified successfully.",
        sentAt: new Date(Date.now() - 3600 * 1000).toISOString()
      }
    ];
  });

  // Global visual toast
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  const triggerToast = useCallback((message, type = "info") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "info" }), 4000);
  }, []);

  const sendMockEmail = useCallback((to, subject, body) => {
    const newEmail = {
      id: `email-${Date.now()}`,
      to,
      subject,
      body,
      sentAt: new Date().toISOString()
    };
    setEmails(prev => {
      const updated = [newEmail, ...prev];
      localStorage.setItem("lms_emails", JSON.stringify(updated));
      return updated;
    });
    triggerToast(`📧 Email alert sent to ${to}`, "email");
  }, [triggerToast]);

  const fetchAllData = useCallback(async () => {
    if (!user) {
      setCourses([]);
      setEnrollments([]);
      setSubmissions([]);
      setResults([]);
      setNotifications([]);
      setBookmarks([]);
      setCertificates([]);
      return;
    }

    setLoading(true);
    try {
      const allCourses = await dbService.getCourses();
      setCourses(allCourses);

      if (user.role === "student") {
        const studEnrol = await dbService.getEnrollments(user.id);
        const studSubs = await dbService.getSubmissions(user.id);
        const studResults = await dbService.getResults(user.id);
        const studNotifs = await dbService.getNotifications(user.id);
        const studBookmarks = await dbService.getBookmarks(user.id);
        const studCerts = await dbService.getCertificates(user.id);

        setEnrollments(studEnrol);
        setSubmissions(studSubs);
        setResults(studResults);
        setNotifications(studNotifs);
        setBookmarks(studBookmarks.map(b => b.courseId));
        setCertificates(studCerts);
      } else if (user.role === "instructor") {
        const allEnrol = await dbService.getAllEnrollments();
        const allSubs = await dbService.getAllSubmissions();
        const allResults = await dbService.getAllResults();
        const allCerts = await dbService.getAllCertificates();

        const instCourses = allCourses.filter(c => c.instructorId === user.id);
        const instCourseIds = instCourses.map(c => c.id);

        setEnrollments(allEnrol.filter(e => instCourseIds.includes(e.courseId)));
        setSubmissions(allSubs);
        setResults(allResults);
        setCertificates(allCerts);
        setNotifications([]);
      } else if (user.role === "admin") {
        const allEnrol = await dbService.getAllEnrollments();
        const allSubs = await dbService.getAllSubmissions();
        const allResults = await dbService.getAllResults();
        const allCerts = await dbService.getAllCertificates();

        setEnrollments(allEnrol);
        setSubmissions(allSubs);
        setResults(allResults);
        setCertificates(allCerts);
        setNotifications([]);
      }
    } catch (e) {
      console.error("Error fetching application data:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllData();
  }, [user, fetchAllData]);

  // --- STUDENT ACTIONS ---
  const enrollInCourse = async (courseId) => {
    if (!user || user.role !== "student") return;
    try {
      const newEnroll = await dbService.enrollStudent(user.id, courseId);
      setEnrollments(prev => [...prev, newEnroll]);
      
      const course = courses.find(c => c.id === courseId);
      
      // Real-time notification
      await triggerNotification(
        user.id,
        "Enrolled Successfully!",
        `You have enrolled in "${course?.title || 'a new course'}". Happy learning!`
      );

      // Email dispatch
      sendMockEmail(
        user.email,
        `Welcome to Course: ${course?.title || 'Cloud Curriculum'}`,
        `Dear ${user.name},\n\nThis confirmation verifies that you enrolled in "${course?.title}" successfully.\n\nYou can access lectures and assignments at any time via your Student Dashboard.\n\nHappy Learning!\nCloudLMS Administration`
      );

      triggerToast(`📚 Enrolled in ${course?.title}`, "success");
      return newEnroll;
    } catch (e) {
      console.error("Enrollment failed:", e);
    }
  };

  const updateLessonProgress = async (courseId, lessonId, isCompleted) => {
    if (!user) return;
    const enrollment = enrollments.find(e => e.courseId === courseId && e.studentId === user.id);
    if (!enrollment) return;

    let completedLessons = [...enrollment.completedLessons];
    if (isCompleted) {
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }
    } else {
      completedLessons = completedLessons.filter(id => id !== lessonId);
    }

    const lessons = await dbService.getLessons(courseId);
    const total = lessons.length;
    const progress = total > 0 ? Math.round((completedLessons.length / total) * 100) : 0;

    try {
      await dbService.updateProgress(enrollment.id, completedLessons, progress);
      
      setEnrollments(prev => prev.map(e => {
        if (e.id === enrollment.id) {
          return { ...e, completedLessons, progress, completedAt: progress === 100 ? new Date().toISOString() : null };
        }
        return e;
      }));

      // Issue certificate
      if (progress === 100 && !enrollment.completedAt) {
        const course = courses.find(c => c.id === courseId);
        const certData = {
          studentId: user.id,
          studentName: user.name,
          courseId,
          courseTitle: course?.title || "Cloud Computing Specialization",
          issuedAt: new Date().toISOString()
        };
        const newCert = await dbService.issueCertificate(certData);
        setCertificates(prev => [...prev, newCert]);

        await triggerNotification(
          user.id,
          "🎓 Course Completed!",
          `Congratulations! You completed "${course?.title}" and generated a certificate.`
        );

        sendMockEmail(
          user.email,
          `🎓 Degree Earned: ${course?.title}`,
          `Dear ${user.name},\n\nCongratulations! You have completed 100% of the lectures in "${course?.title}".\n\nYour formal verification certificate has been signed by the Dean and is now ready for printing inside your profile tab.\n\nVerification ID: cert-${Date.now()}\n\nBest Regards,\nCloud Academic Board`
        );
        triggerToast("🎓 Course completed! Certificate issued.", "success");
      }
    } catch (e) {
      console.error("Progress update failed:", e);
    }
  };

  const submitAssignment = async (assignmentId, text, fileUrl) => {
    if (!user) return;
    const submissionData = {
      assignmentId,
      studentId: user.id,
      studentName: user.name,
      submissionText: text,
      fileUrl: fileUrl || "",
      status: "pending",
      grade: "",
      feedback: "",
      submittedAt: new Date().toISOString()
    };

    try {
      const newSub = await dbService.submitAssignment(submissionData);
      setSubmissions(prev => [...prev, newSub]);

      // Email alert to instructor
      sendMockEmail(
        "instructor@example.com",
        `[Submission Alert] ${user.name} submitted assignment`,
        `Dr. Amit Sharma,\n\nStudent "${user.name}" has uploaded a lab report for evaluation.\n\nSubmission Text:\n"${text.substring(0, 100)}..."\nAttachment: ${fileUrl || 'None'}\n\nPlease audit and grade this report via the Evaluation dashboard.`
      );
      triggerToast("📝 Assignment uploaded successfully!", "success");
      return newSub;
    } catch (e) {
      console.error("Assignment submission failed:", e);
    }
  };

  const submitQuiz = async (quizId, score, totalQuestions) => {
    if (!user) return;
    const resultData = {
      quizId,
      studentId: user.id,
      score,
      totalQuestions,
      takenAt: new Date().toISOString()
    };

    try {
      const newResult = await dbService.submitQuizResult(resultData);
      setResults(prev => [...prev, newResult]);

      sendMockEmail(
        user.email,
        `[Quiz Score Summary] Score: ${score}/${totalQuestions}`,
        `Hi ${user.name},\n\nYou attempted the quiz room assessment successfully.\n\nScore: ${score} correct out of ${totalQuestions} questions.\nPercentage: ${Math.round((score / totalQuestions) * 100)}%\n\nKeep up the great work!`
      );
      triggerToast(`📝 Quiz graded: ${score}/${totalQuestions}`, "success");
      return newResult;
    } catch (e) {
      console.error("Quiz submission failed:", e);
    }
  };

  // --- BOOKMARKS ---
  const toggleBookmark = async (courseId) => {
    if (!user) return;
    try {
      const res = await dbService.toggleBookmark(user.id, courseId);
      if (res.action === "added") {
        setBookmarks(prev => [...prev, courseId]);
        triggerToast("⭐ Course bookmarked!", "success");
      } else {
        setBookmarks(prev => prev.filter(id => id !== courseId));
        triggerToast("Removed bookmark", "info");
      }
    } catch (e) {
      console.error("Bookmarking failed:", e);
    }
  };

  // --- DISCUSSION FORUM ACTIONS ---
  const createDiscussionThread = async (courseId, title, content) => {
    if (!user) return;
    const threadData = {
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      title,
      content
    };
    try {
      const created = await dbService.createDiscussionThread(courseId, threadData);
      triggerToast("💬 New thread posted!", "success");
      return created;
    } catch (e) {
      console.error("Forum thread creation failed:", e);
    }
  };

  const addDiscussionReply = async (courseId, threadId, content) => {
    if (!user) return;
    const replyData = {
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content
    };
    try {
      const updatedThread = await dbService.addDiscussionReply(courseId, threadId, replyData);
      
      // Notify thread creator if it's not the replier
      if (updatedThread.userId !== user.id) {
        await triggerNotification(
          updatedThread.userId,
          "💬 Discussion Reply",
          `${user.name} commented on your thread "${updatedThread.title}".`
        );
      }
      triggerToast("💬 Reply added to thread", "success");
      return updatedThread;
    } catch (e) {
      console.error("Adding forum reply failed:", e);
    }
  };

  // --- VIRTUAL LIVE CLASSES ---
  const scheduleLiveClass = async (courseId, classData) => {
    if (!user) return;
    try {
      const scheduled = await dbService.scheduleLiveClass({
        courseId,
        ...classData,
        instructorName: user.name
      });

      // Send simulated emails to students enrolled in this course
      const course = courses.find(c => c.id === courseId);
      const allEnrolls = await dbService.getAllEnrollments();
      const courseEnrolls = allEnrolls.filter(e => e.courseId === courseId);
      
      courseEnrolls.forEach(enr => {
        // Find enrolled student's email, fallback to a test address
        sendMockEmail(
          "student@example.com",
          `📅 Live Class Invitation: ${classData.title}`,
          `Hi,\n\nDr. Amit Sharma has scheduled a virtual lecture for "${course?.title || 'Cloud Computing'}".\n\nTopic: ${classData.title}\nDate/Time: ${classData.dateTime}\nGoogle Meet link: ${classData.meetUrl}\n\nPlease click the link to join when class begins.`
        );
      });

      triggerToast("📅 Live Lecture published!", "success");
      return scheduled;
    } catch (e) {
      console.error("Scheduling live class failed:", e);
    }
  };

  // --- INSTRUCTOR ACTIONS ---
  const createNewCourse = async (title, description, category, thumbnail) => {
    if (!user) return;
    const courseData = {
      title,
      description,
      category,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
      instructorId: user.id,
      instructorName: user.name,
      createdAt: new Date().toISOString()
    };
    try {
      const created = await dbService.createCourse(courseData);
      setCourses(prev => [...prev, created]);
      triggerToast("📚 Course initialized successfully!", "success");
      return created;
    } catch (e) {
      console.error("Course creation failed:", e);
    }
  };

  const updateCourse = async (courseId, updates) => {
    try {
      await dbService.updateCourse(courseId, updates);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
      triggerToast("Course details updated", "success");
    } catch (e) {
      console.error("Course update failed:", e);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await dbService.deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      triggerToast("Course deleted from catalog", "info");
    } catch (e) {
      console.error("Course deletion failed:", e);
    }
  };

  const addLesson = async (courseId, title, content, videoUrl, pdfUrl, order) => {
    const lessonData = { courseId, title, content, videoUrl, pdfUrl, order: Number(order) };
    try {
      const res = await dbService.createLesson(lessonData);
      triggerToast("📖 New lesson published", "success");
      return res;
    } catch (e) {
      console.error("Adding lesson failed:", e);
    }
  };

  const addAssignment = async (courseId, title, instructions, fileUrl, dueDate) => {
    const assignmentData = { courseId, title, instructions, fileUrl, dueDate };
    try {
      const res = await dbService.createAssignment(assignmentData);
      triggerToast("📝 Lab Assignment issued", "success");
      return res;
    } catch (e) {
      console.error("Adding assignment failed:", e);
    }
  };

  const addQuiz = async (courseId, title, questions) => {
    const quizData = { courseId, title, questions };
    try {
      const res = await dbService.createQuiz(quizData);
      triggerToast("📝 Timed Quiz assembled", "success");
      return res;
    } catch (e) {
      console.error("Adding quiz failed:", e);
    }
  };

  const gradeSubmission = async (submissionId, grade, feedback) => {
    try {
      await dbService.gradeSubmission(submissionId, grade, feedback);
      
      setSubmissions(prev => prev.map(s => {
        if (s.id === submissionId) {
          return { ...s, grade, feedback, status: "graded" };
        }
        return s;
      }));

      const sub = submissions.find(s => s.id === submissionId);
      if (sub) {
        await triggerNotification(
          sub.studentId,
          "📝 Assignment Graded",
          `Your submission has been evaluated. Grade: ${grade}.`
        );

        sendMockEmail(
          "student@example.com", // In mock mode student@example.com
          `[Grading Report] Assignment: Grade ${grade}`,
          `Hi Rahul Kumar,\n\nYour laboratory report submission has been graded by Dr. Amit Sharma.\n\nGrade: ${grade}\nFeedback Comments: "${feedback}"\n\nPlease log in to review your results sheet.`
        );
      }
      triggerToast("📝 Grade submitted successfully!", "success");
    } catch (e) {
      console.error("Grading submission failed:", e);
    }
  };

  // --- ADMIN ACCOUNTS MANAGEMENT ACTIONS ---
  const createUser = async (userData) => {
    try {
      const created = await dbService.createUser(userData);
      sendMockEmail(
        userData.email,
        "Welcome to CloudLMS Profile Room",
        `Hello ${userData.name},\n\nYour profile has been created by the system administrator.\n\nEmail: ${userData.email}\nSecurity Access: ${userData.role}\nCreated At: ${userData.createdAt}\n\nYou can log in with your assigned password.\n\nBest Regards,\nCloudLMS Operations`
      );
      triggerToast(`👤 User ${userData.name} created!`, "success");
      await fetchAllData();
      return created;
    } catch (e) {
      console.error("Admin user creation failed:", e);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await dbService.deleteUser(userId);
      triggerToast("Account purged from database", "info");
      await fetchAllData();
    } catch (e) {
      console.error("Admin user purging failed:", e);
    }
  };

  const triggerNotification = async (userId, title, message) => {
    const notif = { userId, title, message, read: false, createdAt: new Date().toISOString() };
    try {
      await dbService.createNotification(notif);
      if (user && user.id === userId) {
        setNotifications(prev => [{ ...notif, id: `notif-${Date.now()}` }, ...prev]);
      }
    } catch (e) {
      console.error("Failed to trigger notification:", e);
    }
  };

  const markNotificationRead = async (notifId) => {
    try {
      await dbService.markNotificationRead(notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (e) {
      console.error("Failed to mark notification read:", e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        courses,
        enrollments,
        submissions,
        results,
        notifications,
        bookmarks,
        certificates,
        emails,
        toast,
        loading,
        refetch: fetchAllData,
        enrollInCourse,
        updateLessonProgress,
        submitAssignment,
        submitQuiz,
        toggleBookmark,
        createDiscussionThread,
        addDiscussionReply,
        scheduleLiveClass,
        createNewCourse,
        updateCourse,
        deleteCourse,
        addLesson,
        addAssignment,
        addQuiz,
        gradeSubmission,
        createUser,
        deleteUser,
        triggerNotification,
        markNotificationRead,
        triggerToast,
        sendMockEmail
      }}
    >
      {children}
      
      {/* Visual Email Log Transient Overlay / Toast */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce flex items-center bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/50 space-x-3 text-xs max-w-sm">
          <span className="text-xl">
            {toast.type === "success" ? "✅" : toast.type === "email" ? "✉️" : "ℹ️"}
          </span>
          <div>
            <p className="font-bold">{toast.type === "email" ? "Outbox Dispatch" : "System Alert"}</p>
            <p className="text-slate-400 mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}
    </DataContext.Provider>
  );
};


export const useData = () => useContext(DataContext);
