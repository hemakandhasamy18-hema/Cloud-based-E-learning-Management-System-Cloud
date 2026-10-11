# Entity Relationship (ER) Diagram

This document contains the Entity Relationship diagram of the Cloud-Based E-Learning Management System, modeled for NoSQL Cloud Firestore collection mapping.

```mermaid
erDiagram
    USERS ||--o{ COURSES : creates
    USERS ||--o{ ENROLLMENTS : registers
    USERS ||--o{ SUBMISSIONS : submits
    USERS ||--o{ RESULTS : attempts
    USERS ||--o{ CERTIFICATES : receives
    
    COURSES ||--|{ LESSONS : contains
    COURSES ||--o{ ENROLLMENTS : manages
    COURSES ||--o{ ASSIGNMENTS : tasks
    COURSES ||--o{ QUIZZES : templates
    
    ASSIGNMENTS ||--o{ SUBMISSIONS : receives
    QUIZZES ||--o{ RESULTS : scores
    
    COURSES ||--o{ CERTIFICATES : issues

    USERS {
        string id PK "User ID / Auth UID"
        string name "Full Name"
        string email "Email Address"
        string role "student | instructor | admin"
        timestamp createdAt "Timestamp"
    }

    COURSES {
        string id PK "Course ID"
        string title "Course Title"
        string description "Overview"
        string category "DevOps | Cloud Computing..."
        string thumbnail "Storage bucket URL"
        string instructorId FK "Instructor ID"
        string instructorName "Instructor Name"
        timestamp createdAt "Timestamp"
    }

    LESSONS {
        string id PK "Lesson ID"
        string courseId FK "Course ID"
        string title "Lecture Title"
        string content "Rich HTML Notes"
        string videoUrl "Cloud Storage CDN link"
        string pdfUrl "Attached reading notes"
        number order "Sequence Index"
    }

    ENROLLMENTS {
        string id PK "Enrollment ID"
        string studentId FK "Student User ID"
        string courseId FK "Course ID"
        number progress "Percentage 0-100"
        array completedLessons "Array of completed Lesson IDs"
        timestamp enrolledAt "Timestamp"
        timestamp completedAt "Timestamp or NULL"
    }

    ASSIGNMENTS {
        string id PK "Assignment ID"
        string courseId FK "Course ID"
        string title "Lab Task Name"
        string instructions "Detail description"
        string fileUrl "Template document link"
        string dueDate "ISO Date string"
    }

    SUBMISSIONS {
        string id PK "Submission ID"
        string assignmentId FK "Assignment ID"
        string studentId FK "Student ID"
        string studentName "Student Name"
        string submissionText "Report report payload"
        string fileUrl "Cloud Storage submission link"
        string status "pending | graded"
        string grade "A | B | C | D | Fail"
        string feedback "Instructor assessment comments"
        timestamp submittedAt "Timestamp"
    }

    QUIZZES {
        string id PK "Quiz ID"
        string courseId FK "Course ID"
        string title "Quiz Title"
        array questions "MCQ Array { question, options, correctAnswer }"
    }

    RESULTS {
        string id PK "Result ID"
        string quizId FK "Quiz ID"
        string studentId FK "Student ID"
        number score "Correct Answer Count"
        number totalQuestions "Total Questions Count"
        timestamp takenAt "Timestamp"
    }

    CERTIFICATES {
        string id PK "Certificate ID"
        string studentId FK "Student ID"
        string courseId FK "Course ID"
        string studentName "Student Name"
        string courseTitle "Course Title"
        timestamp issuedAt "Timestamp"
    }
```

## Relational Schema Mapping Description

1. **Users to Contexts:** Users are partitioned by the `role` attribute. The application routes dashboard layouts according to this permission matrix.
2. **Courses to Syllabus (Lessons/Assignments/Quizzes):** A single Course is a parent container mapping many lessons, assignments, and quizzes. In Firestore, these can be mapped either as sub-collections or as discrete collections filtered by the `courseId` reference.
3. **Submissions and Results:** These entities record interactive checkpoints. Submissions reference both the assignment key and student key; Results reference both the quiz key and student key.
4. **Certificates:** Instantiated only when the student's progress reaches `100%`.
