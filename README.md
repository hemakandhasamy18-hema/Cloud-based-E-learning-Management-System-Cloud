# CloudLMS: Cloud-Based E-Learning Management System

Welcome to **CloudLMS**, a modern, fully-featured serverless E-Learning Management System developed for a B.Tech Cloud Computing mini project. This application is a **100% software-based solution** (no IoT/hardware required) designed to demonstrate core cloud services integration.

The platform provides dedicated, interactive dashboards for three distinct user roles: **Students**, **Instructors**, and **Administrators**.

---

## 🚀 Key Cloud Computing Services Integrated
- **Firebase Authentication:** Secure, JSON Web Token (JWT) backed user session management for logins and sign-ups.
- **Cloud Firestore:** A scalable, real-time NoSQL document database used to manage courses, lessons, enrollments, quiz results, and assignments.
- **Firebase Storage:** Serverless storage buckets for hosting static media assets, download materials, and assignment report uploads.
- **Firebase Hosting:** Global CDN deployment with built-in SSL optimization for static asset routing.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React.js (built with Vite for hot module reloading)
- **Styling Engine:** Tailwind CSS (featuring a smooth Dark Mode toggle and premium glassmorphic UI tokens)
- **Backend Services:** Google Firebase SDK (Auth, Firestore, Storage)
- **Visualizations:** Mermaid.js diagrams for structural and relational models

---

## 📂 Project Architecture and Deliverables
The project contains all deliverables required for your college review board. Click the links below to view the documentation:

1. **[Installation & Deployment Guide](file:///c:/Users/priya/Downloads/kiddo/docs/INSTALLATION.md):** Step-by-step instructions to run locally and deploy to Firebase Hosting.
2. **[Database Schema / ER Diagram](file:///c:/Users/priya/Downloads/kiddo/docs/ER_DIAGRAM.md):** NoSQL database mapping configurations.
3. **[Cloud System Architecture](file:///c:/Users/priya/Downloads/kiddo/docs/ARCHITECTURE.md):** System integration flow sheets.
4. **[PowerPoint Presentation Outline](file:///c:/Users/priya/Downloads/kiddo/docs/PPT_PRESENTATION.md):** Slide guide for project defense.
5. **[Formal Project Report Template](file:///c:/Users/priya/Downloads/kiddo/docs/PROJECT_REPORT.md):** Chapter-by-chapter academic report documentation.

---

## 🔑 Project Testing Presets
When launching the app locally, you can use the quick login buttons or enter the credentials below to test different user roles:

| Role | Test Email | Password | Allowed Capabilities |
|---|---|---|---|
| **Student** | `student@example.com` | `password` | Enroll in courses, watch video lectures, submit assignments, take timed quizzes, view grades, and download certificates. |
| **Instructor** | `instructor@example.com` | `password` | Create/edit courses, upload lessons, create lab assignments, write MCQs, review student submissions, and track enrollment states. |
| **Admin** | `admin@example.com` | `password` | View platform-wide stats (user growth, storage size, latency), audit course catalog, and promote/demote user roles. |

---

## 💻 Quick Start Commands
To launch the application on your computer:
1. Ensure **Node.js** is installed.
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build the application for hosting:
   ```bash
   npm run build
   ```
# cloudeproject1
