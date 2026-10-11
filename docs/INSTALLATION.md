# Project Installation and Configuration Guide

This guide explains how to set up, run, and configure the Cloud-Based E-Learning Management System (LMS) locally and deploy it online using Firebase Hosting.

---

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **NPM** (packaged with Node.js)
- A **Firebase Account** (free/Spark tier is sufficient)

---

## Step 1: Clone and Install Dependencies
1. Open your terminal or Command Prompt inside the project workspace directory (`kiddo`).
2. Run the command to install all React and Tailwind CSS packages:
   ```bash
   npm install
   ```

---

## Step 2: Running Locally (Local Mock Mode)
By default, the application is designed to run in **Mock Mode** if no Firebase credentials are provided. This allows immediate testing of all student, instructor, and admin flows.
1. Run the local development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to the printed URL (typically `http://localhost:5173`).
3. Use the **Project Testing Presets** on the login page to sign in immediately with pre-filled test accounts:
   - **Student:** `student@example.com` / `password`
   - **Instructor:** `instructor@example.com` / `password`
   - **Admin:** `admin@example.com` / `password`

---

## Step 3: Setting Up Firebase Cloud Services
To connect the application to a real Firebase back-end:

### A. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it (e.g., `cloud-lms-project`).
3. Click continue (Google Analytics can be disabled for simplicity).

### B. Register a Web App
1. Inside the project dashboard, click the **Web icon (`</>`)** to register an app.
2. Enter an app nickname and click **Register app**.
3. Copy the `firebaseConfig` object keys shown on screen.

### C. Create Environment Configuration File
1. In the root directory of the project, create a file named `.env`.
2. Add the copied credentials in the following format:
   ```text
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
3. Restart your development server (`npm run dev`) so Vite loads the new environment variables.

### D. Configure Cloud Firestore Database
1. In the Firebase console sidebar, click **Build > Firestore Database**.
2. Click **Create database**.
3. Select your location and choose **Start in test mode** (allows read/writes during initial development), then click create.

### E. Configure Cloud Storage (for Video and PDF uploads)
1. In the sidebar, click **Build > Storage**.
2. Click **Get Started**, choose **Start in test mode**, select location, and click create.

---

## Step 4: Deploying to Firebase Hosting
1. Install the Firebase Command Line Interface globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Authenticate the CLI with your Google Account:
   ```bash
   firebase login
   ```
3. Initialize hosting in your project root:
   ```bash
   firebase init
   ```
   - Select **Hosting: Configure files for Firebase Hosting**.
   - Select **Use an existing project** and choose your created project.
   - Set the public directory to `dist` (Vite's build output folder).
   - Configure as a single-page app: Choose **Yes** (`y`).
   - Overwrite index.html: Choose **No** (`n`).
4. Build the production application bundle:
   ```bash
   npm run build
   ```
5. Deploy the application online:
   ```bash
   firebase deploy
   ```
6. The CLI will output your unique public hosting URL (e.g., `https://your-project.web.app`). Open it in any browser to verify online deployment!
