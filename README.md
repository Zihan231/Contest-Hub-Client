# 🏆 Contest Hub - Platform for Creative Challenges

**Contest Hub** is a full-stack web application that connects contest creators with participants. It features a robust dashboard for managing contests, secure payment integration via Stripe, and role-based access control for Admins, Creators, and Users.

---

## 🔗 **Live Links**

- **🚀 Live Website:** [https://contesthub-a21c5.web.app/](https://contesthub-a21c5.web.app/)
- **📂 Server API:** [https://contesthub-server-dun.vercel.app/](https://contesthub-server-dun.vercel.app/)
- **💻 Client Repo:** [GitHub - Client](https://github.com/Zihan231/Contest-Hub-Client)
- **⚙️ Server Repo:** [GitHub - Server](https://github.com/Zihan231/Contest-Hub-Server)

---

## 🌟 **Key Features**

### 👤 **User (Participant)**
* **Contest Browsing:** Search and filter contests by tags (Business, Design, Coding, etc.).
* **Secure Payment:** Integrated **Stripe** gateway to pay entry fees securely.
* **Dashboard:** View participated contests, check payment status, and submit tasks.
* **Profile:** Manage personal information and view winning history.

### 🎨 **Contest Creator**
* **Add Contest:** Create contests with details like image, price, deadline, and instructions.
* **My Contests:** Track participation counts and manage created contests.
* **Select Winners:** Review submissions and declare winners for contests.

### 🛡️ **Admin**
* **User Management:** detailed table to manage user roles (promote to Admin/Creator).
* **Contest Management:** Approve, delete, or edit contests to ensure quality.
* **Stats:** View platform-wide statistics (Total Users, Total Payments, etc.).

---

## 🛠️ **Technology Stack**

### **Frontend**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS, DaisyUI
* **Animations:** Framer Motion
* **State Management:** TanStack Query (React Query), Context API
* **Forms:** React Hook Form
* **Alerts:** SweetAlert2
* **Visualization:** Recharts

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (CRUD operations, Aggregation)
* **Authentication:** Firebase Auth (JWT implementation)
* **Payment:** Stripe API

---

## 📦 **Dependencies (NPM Packages)**

* `@stripe/react-stripe-js` & `@stripe/stripe-js`: For payment processing.
* `axios`: For secure HTTP requests.
* `firebase`: For authentication and hosting.
* `react-router`: For seamless navigation.
* `react-icons`: For UI icons.
* `react-datepicker`: For deadline selection.

---

## 🚀 **Run Locally**

Follow these steps to run the project on your local machine.

### 1. Clone the Repositories
```bash
# Clone Client
git clone [https://github.com/Zihan231/Contest-Hub-Client.git](https://github.com/Zihan231/Contest-Hub-Client.git)

# Clone Server
git clone [https://github.com/Zihan231/Contest-Hub-Server.git](https://github.com/Zihan231/Contest-Hub-Server.git)
