# System Architecture Diagram

This document explains the cloud service architecture of the E-Learning Management System, highlighting the interaction between client applications and serverless backend layers.

```mermaid
graph TD
    %% Styling
    classDef client fill:#f5f3ff,stroke:#8b5cf6,stroke-width:2px;
    classDef sdk fill:#eff6ff,stroke:#3b82f6,stroke-width:2px;
    classDef firebase fill:#fff7ed,stroke:#f97316,stroke-width:2px;

    %% Elements
    subgraph Client Layer [Client Application - Browser]
        UI["React.js Frontend (Vite)"]:::client
        CSS["Tailwind CSS Rendering"]:::client
        State["React Context State (Auth/Data)"]:::client
    end

    subgraph Service Abstraction Layer [Unified SDK API]
        FSDK["Firebase Web SDK Client"]:::sdk
        Fallback["Local Storage Mock Layer"]:::sdk
    end

    subgraph Backend Cloud Services [Google Firebase Platform]
        Auth["Firebase Authentication (Secure User Login)"]:::firebase
        DB["Cloud Firestore (NoSQL Real-Time Database)"]:::firebase
        FS["Firebase Storage (Blob Buckets - Videos, PDFs)"]:::firebase
        Host["Firebase Hosting (Fast Global CDN)"]:::firebase
    end

    %% Connections
    UI --> CSS
    UI --> State
    State --> Fallback
    State --> FSDK
    
    %% Hosting entry
    Host -->|Deploys Static Bundle| UI
    
    %% Service endpoints
    FSDK -->|Auth requests| Auth
    FSDK -->|NoSQL transactions| DB
    FSDK -->|Uploads / Streams| FS
```

## Architectural Breakdown

### 1. Presentation Layer (React + Tailwind)
- Renders dashboards (Student, Instructor, Admin) in a responsive viewport.
- Compiled by Vite into a static bundle (HTML, CSS, JS) optimized for low bandwidth loading.

### 2. Service Abstraction (db.js & storage.js)
- Acts as a gateway. Checks whether environment variables are initialized.
- If present, invokes the Firebase Web SDK Client.
- If absent, routes requests to a browser `localStorage` mock database, allowing local execution without configuring Google accounts.

### 3. Serverless Cloud Services (Firebase)
- **Firebase Authentication:** Handles login hash checks and token issuance.
- **Cloud Firestore:** A NoSQL database storing structured JSON documents with automated scaling and socket listeners.
- **Firebase Storage:** Stores raw files (videos, templates, submissions) inside secure Google Cloud storage buckets.
- **Firebase Hosting:** Distributes static files using CDN edge caches with built-in SSL.
