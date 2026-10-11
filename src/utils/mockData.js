// Initial mock dataset for the Cloud-Based E-Learning Management System

export const initialUsers = [
  {
    id: "student-1",
    name: "Rahul Kumar",
    email: "student@example.com",
    password: "password", // In a real app this is handled by Auth, but for local testing we check it
    role: "student",
    createdAt: new Date().toISOString()
  },
  {
    id: "instructor-1",
    name: "Dr. Amit Sharma",
    email: "instructor@example.com",
    password: "password",
    role: "instructor",
    createdAt: new Date().toISOString()
  },
  {
    id: "admin-1",
    name: "System Admin",
    email: "admin@example.com",
    password: "password",
    role: "admin",
    createdAt: new Date().toISOString()
  }
];

export const initialCourses = [
  {
    id: "course-1",
    title: "Introduction to Cloud Computing",
    description: "Learn the core concepts of virtualization, hypervisors, and cloud deployment models (IaaS, PaaS, SaaS). You will explore major public clouds (AWS, GCP, Azure) and run hands-on compute instances.",
    category: "Cloud Computing",
    thumbnail: "/cloud_computing_thumbnail.png",
    instructorId: "instructor-1",
    instructorName: "Dr. Amit Sharma",
    createdAt: new Date().toISOString()
  },
  {
    id: "course-2",
    title: "Advanced DevOps & Containerization",
    description: "Master modern microservice deployment using Docker containers, Kubernetes orchestration, and Jenkins automated CI/CD pipelines. Essential for cloud engineers looking to automate builds.",
    category: "DevOps",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60",
    instructorId: "instructor-1",
    instructorName: "Dr. Amit Sharma",
    createdAt: new Date().toISOString()
  },
  {
    id: "course-3",
    title: "AWS Cloud Architecture & Security",
    description: "Design secure, highly available, and scalable cloud solutions. Learn about VPC networking, IAM security, Auto-Scaling, Load Balancers, and cost optimization techniques on AWS.",
    category: "Cloud Security",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    instructorId: "instructor-1",
    instructorName: "Dr. Amit Sharma",
    createdAt: new Date().toISOString()
  }
];

export const initialLessons = [
  {
    id: "lesson-1-1",
    courseId: "course-1",
    title: "Introduction & Cloud Definition",
    content: "<h3>What is Cloud Computing?</h3><p>Cloud computing is the on-demand delivery of IT resources over the Internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, you can access technology services, such as computing power, storage, and databases, on an as-needed basis from a cloud provider like Amazon Web Services (AWS) or Google Cloud Platform (GCP).</p><h4>Five Essential Characteristics of Cloud:</h4><ul><li>On-demand self-service</li><li>Broad network access</li><li>Resource pooling</li><li>Rapid elasticity</li><li>Measured service</li></ul>",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Open source video
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 1
  },
  {
    id: "lesson-1-2",
    courseId: "course-1",
    title: "Cloud Service Models (IaaS, PaaS, SaaS)",
    content: "<h3>Understanding Cloud Service Models</h3><p>Cloud computing services are categorized into three main models:</p><h4>1. Infrastructure as a Service (IaaS)</h4><p>Contains the basic building blocks for cloud IT. Typically provides access to networking features, computers (virtual or on dedicated hardware), and data storage space. (Example: Amazon EC2, Azure VMs).</p><h4>2. Platform as a Service (PaaS)</h4><p>Removes the need for you to manage the underlying infrastructure (usually hardware and operating systems) and allows you to focus on the deployment and management of your applications. (Example: AWS Elastic Beanstalk, Heroku).</p><h4>3. Software as a Service (SaaS)</h4><p>Provides you with a complete product that is run and managed by the service provider. In most cases, people referring to SaaS are referring to end-user applications (such as web-based email or Salesforce).</p>",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 2
  },
  {
    id: "lesson-1-3",
    courseId: "course-1",
    title: "Virtualization and Hypervisors",
    content: "<h3>The Foundation of Cloud: Virtualization</h3><p>Virtualization uses software to create an abstraction layer over computer hardware that allows the hardware elements of a single computer—processors, memory, storage and more—to be divided into multiple virtual computers, commonly called virtual machines (VMs). Each virtual machine runs its own operating system (OS) and behaves like an independent computer.</p><h4>Hypervisors:</h4><p>A hypervisor is the software layer that creates and runs virtual machines. There are two types:</p><ul><li><strong>Type 1 (Bare Metal):</strong> Runs directly on the host's hardware (e.g., VMware ESXi, KVM).</li><li><strong>Type 2 (Hosted):</strong> Runs on top of an existing operating system (e.g., VirtualBox, VMware Workstation).</li></ul>",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 3
  },
  // Lessons for course 2
  {
    id: "lesson-2-1",
    courseId: "course-2",
    title: "Docker Containerization Fundamentals",
    content: "<h3>Why Containers?</h3><p>Containers provide a lightweight, isolated environment for applications to run. Unlike virtual machines, containers share the host operating system kernel, making them faster to start and require fewer resources.</p>",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 1
  },
  // Lessons for course 3
  {
    id: "lesson-3-1",
    courseId: "course-3",
    title: "AWS Global Infrastructure & IAM Roles",
    content: "<h3>Designing Secure Architectures</h3><p>Learn about AWS Regions, Availability Zones (AZs), Edge Locations, and how to manage access control via Identity and Access Management (IAM).</p>",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    order: 1
  }
];

export const initialEnrollments = [
  {
    id: "enrollment-1",
    studentId: "student-1",
    courseId: "course-1",
    progress: 33,
    completedLessons: ["lesson-1-1"],
    enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null
  }
];

export const initialAssignments = [
  {
    id: "assignment-1-1",
    courseId: "course-1",
    title: "Virtualization & Hypervisor Setup",
    instructions: "Install Oracle VM VirtualBox or VMware Workstation on your local machine. Create a Virtual Machine running Ubuntu Server LTS. Write a 2-page report detailing: (1) System specifications allocated, (2) Screen capturing of successful OS boot, (3) Explanation of the differences you observed between Type 1 and Type 2 hypervisors.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: "assignment-2-1",
    courseId: "course-2",
    title: "Dockerizing a Node.js Application",
    instructions: "Write a Dockerfile for a basic web server. Build the Docker image and push it to Docker Hub. Submit the Dockerfile contents and Docker Hub image link.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];

export const initialSubmissions = [
  {
    id: "submission-1",
    assignmentId: "assignment-1-1",
    studentId: "student-1",
    studentName: "Rahul Kumar",
    submissionText: "Hi Dr. Amit, I have successfully configured the Ubuntu VM on VirtualBox. The hypervisor has been set up with 2GB RAM and 15GB virtual hard drive. Here is my report content.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    status: "pending",
    grade: "",
    feedback: "",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialQuizzes = [
  {
    id: "quiz-1-1",
    courseId: "course-1",
    title: "Cloud Models and Virtualization Quiz",
    questions: [
      {
        question: "Which of the following is NOT one of the five essential characteristics of cloud computing according to NIST?",
        options: [
          "On-demand self-service",
          "Broad network access",
          "High pricing model",
          "Rapid elasticity"
        ],
        correctAnswer: 2
      },
      {
        question: "AWS Elastic Beanstalk and Heroku are examples of which cloud service model?",
        options: [
          "Infrastructure as a Service (IaaS)",
          "Platform as a Service (PaaS)",
          "Software as a Service (SaaS)",
          "Function as a Service (FaaS)"
        ],
        correctAnswer: 1
      },
      {
        question: "A hypervisor that runs directly on the bare metal hardware of a host system is classified as:",
        options: [
          "Type 1 Hypervisor",
          "Type 2 Hypervisor",
          "Hosted Hypervisor",
          "Application Hypervisor"
        ],
        correctAnswer: 0
      }
    ]
  }
];

export const initialResults = [
  {
    id: "result-1",
    quizId: "quiz-1-1",
    studentId: "student-1",
    score: 3,
    totalQuestions: 3,
    takenAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialCertificates = [];
export const initialNotifications = [
  {
    id: "notif-1",
    userId: "student-1",
    title: "Welcome to cloud learning!",
    message: "You have been registered successfully. Explore courses to start learning.",
    read: false,
    createdAt: new Date().toISOString()
  }
];
