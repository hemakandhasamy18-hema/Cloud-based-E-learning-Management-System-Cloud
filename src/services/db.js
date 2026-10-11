import { db, isValidConfig } from "../firebase";
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, setDoc 
} from "firebase/firestore";
import * as mock from "../utils/mockData";

// Helper: Get local storage data or initialize it
const getLocalData = (key, initial) => {
  const data = localStorage.getItem(`lms_${key}`);
  if (!data) {
    localStorage.setItem(`lms_${key}`, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const setLocalData = (key, data) => {
  localStorage.setItem(`lms_${key}`, JSON.stringify(data));
};

export const dbService = {
  // --- USERS ---
  async getUsers() {
    if (isValidConfig && db) {
      const snap = await getDocs(collection(db, "users"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return getLocalData("users", mock.initialUsers);
    }
  },

  async createUserProfile(userId, profileData) {
    if (isValidConfig && db) {
      await setDoc(doc(db, "users", userId), profileData);
      return { id: userId, ...profileData };
    } else {
      const users = getLocalData("users", mock.initialUsers);
      const newUser = { id: userId, ...profileData, createdAt: new Date().toISOString() };
      users.push(newUser);
      setLocalData("users", users);
      return newUser;
    }
  },

  async updateUserRole(userId, role) {
    if (isValidConfig && db) {
      await updateDoc(doc(db, "users", userId), { role });
    } else {
      const users = getLocalData("users", mock.initialUsers);
      const index = users.findIndex(u => u.id === userId || u.email === userId);
      if (index !== -1) {
        users[index].role = role;
        setLocalData("users", users);
      }
    }
  },

  // --- COURSES ---
  async getCourses() {
    if (isValidConfig && db) {
      const snap = await getDocs(collection(db, "courses"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return getLocalData("courses", mock.initialCourses);
    }
  },

  async createCourse(courseData) {
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "courses"), courseData);
      return { id: docRef.id, ...courseData };
    } else {
      const courses = getLocalData("courses", mock.initialCourses);
      const newCourse = { id: `course-${Date.now()}`, ...courseData, createdAt: new Date().toISOString() };
      courses.push(newCourse);
      setLocalData("courses", courses);
      return newCourse;
    }
  },

  async updateCourse(courseId, courseData) {
    if (isValidConfig && db) {
      await updateDoc(doc(db, "courses", courseId), courseData);
    } else {
      const courses = getLocalData("courses", mock.initialCourses);
      const index = courses.findIndex(c => c.id === courseId);
      if (index !== -1) {
        courses[index] = { ...courses[index], ...courseData };
        setLocalData("courses", courses);
      }
    }
  },

  async deleteCourse(courseId) {
    if (isValidConfig && db) {
      await deleteDoc(doc(db, "courses", courseId));
    } else {
      const courses = getLocalData("courses", mock.initialCourses);
      const filtered = courses.filter(c => c.id !== courseId);
      setLocalData("courses", filtered);
      
      // Also delete related lessons, assignments, enrollments
      const lessons = getLocalData("lessons", mock.initialLessons);
      setLocalData("lessons", lessons.filter(l => l.courseId !== courseId));
      
      const enrolls = getLocalData("enrollments", mock.initialEnrollments);
      setLocalData("enrollments", enrolls.filter(e => e.courseId !== courseId));
    }
  },

  // --- LESSONS ---
  async getLessons(courseId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "lessons"), where("courseId", "==", courseId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => a.order - b.order);
    } else {
      const lessons = getLocalData("lessons", mock.initialLessons);
      return lessons.filter(l => l.courseId === courseId).sort((a,b) => a.order - b.order);
    }
  },

  async createLesson(lessonData) {
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "lessons"), lessonData);
      return { id: docRef.id, ...lessonData };
    } else {
      const lessons = getLocalData("lessons", mock.initialLessons);
      const newLesson = { id: `lesson-${Date.now()}`, ...lessonData };
      lessons.push(newLesson);
      setLocalData("lessons", lessons);
      return newLesson;
    }
  },

  // --- ENROLLMENTS ---
  async getEnrollments(studentId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "enrollments"), where("studentId", "==", studentId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      const enrollments = getLocalData("enrollments", mock.initialEnrollments);
      return enrollments.filter(e => e.studentId === studentId);
    }
  },

  async getAllEnrollments() {
    if (isValidConfig && db) {
      const snap = await getDocs(collection(db, "enrollments"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return getLocalData("enrollments", mock.initialEnrollments);
    }
  },

  async enrollStudent(studentId, courseId) {
    const enrollmentData = {
      studentId,
      courseId,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date().toISOString(),
      completedAt: null
    };

    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "enrollments"), enrollmentData);
      return { id: docRef.id, ...enrollmentData };
    } else {
      const enrolls = getLocalData("enrollments", mock.initialEnrollments);
      const newEnroll = { id: `enrollment-${Date.now()}`, ...enrollmentData };
      enrolls.push(newEnroll);
      setLocalData("enrollments", enrolls);
      return newEnroll;
    }
  },

  async updateProgress(enrollmentId, completedLessons, progress) {
    const completedAt = progress === 100 ? new Date().toISOString() : null;
    const updates = { completedLessons, progress, completedAt };

    if (isValidConfig && db) {
      await updateDoc(doc(db, "enrollments", enrollmentId), updates);
    } else {
      const enrolls = getLocalData("enrollments", mock.initialEnrollments);
      const index = enrolls.findIndex(e => e.id === enrollmentId);
      if (index !== -1) {
        enrolls[index] = { ...enrolls[index], ...updates };
        setLocalData("enrollments", enrolls);
      }
    }
  },

  // --- ASSIGNMENTS ---
  async getAssignments(courseId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "assignments"), where("courseId", "==", courseId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      const assignments = getLocalData("assignments", mock.initialAssignments);
      return assignments.filter(a => a.courseId === courseId);
    }
  },

  async createAssignment(assignmentData) {
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "assignments"), assignmentData);
      return { id: docRef.id, ...assignmentData };
    } else {
      const assignments = getLocalData("assignments", mock.initialAssignments);
      const newAssign = { id: `assignment-${Date.now()}`, ...assignmentData };
      assignments.push(newAssign);
      setLocalData("assignments", assignments);
      return newAssign;
    }
  },

  // --- SUBMISSIONS ---
  async getSubmissions(studentId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "submissions"), where("studentId", "==", studentId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      const subs = getLocalData("submissions", mock.initialSubmissions);
      return subs.filter(s => s.studentId === studentId);
    }
  },

  async getAllSubmissions() {
    if (isValidConfig && db) {
      const snap = await getDocs(collection(db, "submissions"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return getLocalData("submissions", mock.initialSubmissions);
    }
  },

  async submitAssignment(submissionData) {
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "submissions"), submissionData);
      return { id: docRef.id, ...submissionData };
    } else {
      const subs = getLocalData("submissions", mock.initialSubmissions);
      const newSub = { id: `submission-${Date.now()}`, ...submissionData, submittedAt: new Date().toISOString() };
      subs.push(newSub);
      setLocalData("submissions", subs);
      return newSub;
    }
  },

  async gradeSubmission(submissionId, grade, feedback) {
    const updates = { grade, feedback, status: "graded" };
    if (isValidConfig && db) {
      await updateDoc(doc(db, "submissions", submissionId), updates);
    } else {
      const subs = getLocalData("submissions", mock.initialSubmissions);
      const index = subs.findIndex(s => s.id === submissionId);
      if (index !== -1) {
        subs[index] = { ...subs[index], ...updates };
        setLocalData("submissions", subs);
      }
    }
  },

  // --- QUIZZES ---
  async getQuizzes(courseId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "quizzes"), where("courseId", "==", courseId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      const quizzes = getLocalData("quizzes", mock.initialQuizzes);
      return quizzes.filter(q => q.courseId === courseId);
    }
  },

  async createQuiz(quizData) {
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "quizzes"), quizData);
      return { id: docRef.id, ...quizData };
    } else {
      const quizzes = getLocalData("quizzes", mock.initialQuizzes);
      const newQuiz = { id: `quiz-${Date.now()}`, ...quizData };
      quizzes.push(newQuiz);
      setLocalData("quizzes", quizzes);
      return newQuiz;
    }
  },

  // --- RESULTS ---
  async getResults(studentId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "results"), where("studentId", "==", studentId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      const results = getLocalData("results", mock.initialResults);
      return results.filter(r => r.studentId === studentId);
    }
  },

  async getAllResults() {
    if (isValidConfig && db) {
      const snap = await getDocs(collection(db, "results"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return getLocalData("results", mock.initialResults);
    }
  },

  async submitQuizResult(resultData) {
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "results"), resultData);
      return { id: docRef.id, ...resultData };
    } else {
      const results = getLocalData("results", mock.initialResults);
      const newResult = { id: `result-${Date.now()}`, ...resultData, takenAt: new Date().toISOString() };
      results.push(newResult);
      setLocalData("results", results);
      return newResult;
    }
  },

  // --- CERTIFICATES ---
  async getCertificates(studentId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "certificates"), where("studentId", "==", studentId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      const certs = getLocalData("certificates", mock.initialCertificates);
      return certs.filter(c => c.studentId === studentId);
    }
  },

  async issueCertificate(certData) {
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "certificates"), certData);
      return { id: docRef.id, ...certData };
    } else {
      const certs = getLocalData("certificates", mock.initialCertificates);
      const newCert = { id: `cert-${Date.now()}`, ...certData, issuedAt: new Date().toISOString() };
      certs.push(newCert);
      setLocalData("certificates", certs);
      return newCert;
    }
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "notifications"), where("userId", "==", userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      const notifications = getLocalData("notifications", mock.initialNotifications);
      return notifications.filter(n => n.userId === userId);
    }
  },

  async createNotification(notifData) {
    if (isValidConfig && db) {
      await addDoc(collection(db, "notifications"), notifData);
    } else {
      const notifications = getLocalData("notifications", mock.initialNotifications);
      const newNotif = { id: `notif-${Date.now()}`, ...notifData, read: false, createdAt: new Date().toISOString() };
      notifications.push(newNotif);
      setLocalData("notifications", notifications);
    }
  },

  async markNotificationRead(notifId) {
    if (isValidConfig && db) {
      await updateDoc(doc(db, "notifications", notifId), { read: true });
    } else {
      const notifications = getLocalData("notifications", mock.initialNotifications);
      const index = notifications.findIndex(n => n.id === notifId);
      if (index !== -1) {
        notifications[index].read = true;
        setLocalData("notifications", notifications);
      }
    }
  },

  // --- BOOKMARKS ---
  async getBookmarks(studentId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "bookmarks"), where("studentId", "==", studentId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return getLocalData("bookmarks", []);
    }
  },

  async toggleBookmark(studentId, courseId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "bookmarks"), where("studentId", "==", studentId), where("courseId", "==", courseId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await deleteDoc(doc(db, "bookmarks", snap.docs[0].id));
        return { action: "removed", courseId };
      } else {
        const docRef = await addDoc(collection(db, "bookmarks"), { studentId, courseId, createdAt: new Date().toISOString() });
        return { action: "added", id: docRef.id, studentId, courseId };
      }
    } else {
      const bookmarks = getLocalData("bookmarks", []);
      const index = bookmarks.findIndex(b => b.studentId === studentId && b.courseId === courseId);
      if (index !== -1) {
        bookmarks.splice(index, 1);
        setLocalData("bookmarks", bookmarks);
        return { action: "removed", courseId };
      } else {
        const newBookmark = { id: `bookmark-${Date.now()}`, studentId, courseId, createdAt: new Date().toISOString() };
        bookmarks.push(newBookmark);
        setLocalData("bookmarks", bookmarks);
        return { action: "added", ...newBookmark };
      }
    }
  },

  // --- DISCUSSIONS (FORUM) ---
  async getDiscussions(courseId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "discussions"), where("courseId", "==", courseId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      const defaultThreads = [
        {
          id: "thread-default-1",
          courseId: "course-1",
          userId: "student-1",
          userName: "Rahul Kumar",
          userRole: "student",
          title: "Struggling with VM Ubuntu configuration",
          content: "Hi everyone, does anyone know why my VM is complaining about virtualization hardware acceleration (VT-x/AMD-V) disabled in BIOS? Any help would be appreciated!",
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          replies: [
            {
              id: "reply-1",
              userId: "instructor-1",
              userName: "Dr. Amit Sharma",
              userRole: "instructor",
              content: "You need to reboot your host machine, enter your system BIOS (usually by pressing F2/F10/Del), navigate to processor settings, enable 'Intel Virtualization Technology' or 'AMD SVM', save and exit.",
              createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
            }
          ]
        }
      ];
      const discussions = getLocalData("discussions", defaultThreads);
      return discussions.filter(d => d.courseId === courseId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async createDiscussionThread(courseId, threadData) {
    const thread = {
      courseId,
      ...threadData,
      replies: [],
      createdAt: new Date().toISOString()
    };
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "discussions"), thread);
      return { id: docRef.id, ...thread };
    } else {
      const discussions = getLocalData("discussions", []);
      const newThread = { id: `thread-${Date.now()}`, ...thread };
      discussions.push(newThread);
      setLocalData("discussions", discussions);
      return newThread;
    }
  },

  async addDiscussionReply(courseId, threadId, replyData) {
    const reply = {
      id: `reply-${Date.now()}`,
      ...replyData,
      createdAt: new Date().toISOString()
    };
    if (isValidConfig && db) {
      const docRef = doc(db, "discussions", threadId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        const replies = [...(data.replies || []), reply];
        await updateDoc(docRef, { replies });
        return { ...data, id: snap.id, replies };
      }
      throw new Error("Thread does not exist");
    } else {
      const discussions = getLocalData("discussions", []);
      const index = discussions.findIndex(d => d.id === threadId);
      if (index !== -1) {
        discussions[index].replies = [...(discussions[index].replies || []), reply];
        setLocalData("discussions", discussions);
        return discussions[index];
      }
      throw new Error("Thread does not exist");
    }
  },

  // --- LIVE CLASSES ---
  async getLiveClasses(courseId) {
    if (isValidConfig && db) {
      const q = query(collection(db, "live_classes"), where("courseId", "==", courseId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    } else {
      const defaultClasses = [
        {
          id: "live-default-1",
          courseId: "course-1",
          title: "Interactive Q&A Session - Virtualization",
          description: "Let's align on common issues setting up virtualization clusters and AWS instances.",
          dateTime: new Date(Date.now() + 2 * 24 * 365 * 1000).toISOString(), // far future or mock schedule
          meetUrl: "https://meet.google.com/abc-defg-hij",
          instructorName: "Dr. Amit Sharma"
        }
      ];
      const liveClasses = getLocalData("live_classes", defaultClasses);
      return liveClasses.filter(c => c.courseId === courseId).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    }
  },

  async scheduleLiveClass(classData) {
    if (isValidConfig && db) {
      const docRef = await addDoc(collection(db, "live_classes"), classData);
      return { id: docRef.id, ...classData };
    } else {
      const liveClasses = getLocalData("live_classes", []);
      const newClass = { id: `live-${Date.now()}`, ...classData };
      liveClasses.push(newClass);
      setLocalData("live_classes", liveClasses);
      return newClass;
    }
  },

  // --- ADMIN DIRECTORY ACCOUNTS ---
  async deleteUser(userId) {
    if (isValidConfig && db) {
      await deleteDoc(doc(db, "users", userId));
    } else {
      const users = getLocalData("users", mock.initialUsers);
      const filtered = users.filter(u => u.id !== userId && u.email !== userId);
      setLocalData("users", filtered);
    }
  },

  async createUser(userData) {
    if (isValidConfig && db) {
      await setDoc(doc(db, "users", userData.id), userData);
      return userData;
    } else {
      const users = getLocalData("users", mock.initialUsers);
      users.push(userData);
      setLocalData("users", users);
      return userData;
    }
  },

  // --- GLOBAL CERTIFICATES AUDIT ---
  async getAllCertificates() {
    if (isValidConfig && db) {
      const snap = await getDocs(collection(db, "certificates"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return getLocalData("certificates", []);
    }
  }
};

