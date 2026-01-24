# 🏆 Contest Hub - A Competitive Platform for Creators & Participants

<div align="center">

[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?logo=firebase)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-Backend-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)](https://www.mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?logo=stripe)](https://stripe.com)

**Contest Hub** is a modern full-stack web application that revolutionizes how contests are created, discovered, and managed. It connects contest creators with passionate participants through a seamless platform featuring robust dashboards, secure payment processing, and sophisticated role-based access control.

[Live Demo](#-live-demo) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Project Structure](#-project-structure)

</div>

---

## 🚀 Live Demo

| Resource | Link |
|----------|------|
| 🌐 **Live Website** | [https://contesthub-a21c5.web.app/](https://contesthub-a21c5.web.app/) |
| 🔌 **API Server** | [https://contesthub-server-dun.vercel.app/](https://contesthub-server-dun.vercel.app/) |
| 📱 **Client Repository** | [GitHub - Client](https://github.com/Zihan231/Contest-Hub-Client) |
| 🖥️ **Server Repository** | [GitHub - Server](https://github.com/Zihan231/Contest-Hub-Server) |

---

## ✨ Features

### 👤 **User (Participant)**
- 🔍 **Contest Discovery** - Search and filter contests by multiple categories (Business, Design, Coding, Photography, etc.)
- 💳 **Secure Payments** - Integrated Stripe gateway for safe and reliable contest entry fee payments
- 📊 **Participation Dashboard** - Track all participated contests, monitor payment status, and submit contest tasks
- 🏆 **Winning History** - View personal achievements and winning contests at a glance
- ⭐ **Leaderboard** - Compete on global leaderboards and track rankings
- 👤 **Profile Management** - Customize personal information and track contest statistics

### 🎨 **Contest Creator**
- ➕ **Contest Creation** - Launch new contests with rich details (images, pricing, deadlines, instructions, rules)
- 📈 **Contest Analytics** - Monitor participation counts, track submissions, and analyze engagement metrics
- 🗂️ **Contest Management** - Edit, update, or archive your contests with ease
- 👥 **Submission Review** - Review all task submissions from participants
- 🏅 **Winner Selection** - Declare winners and manage contest outcomes
- 📝 **Contest Templates** - Create contests quickly using pre-built templates

### 🛡️ **Admin Dashboard**
- 👨‍💼 **User Management** - Comprehensive user table with role management (promote/demote users to Admin/Creator)
- 🎯 **Contest Moderation** - Approve, reject, delete, or edit contests to maintain platform quality
- 📊 **Platform Statistics** - View real-time metrics including total users, total payments, active contests
- 🔐 **Access Control** - Manage user permissions and role-based access across the platform
- 🔍 **Audit Logs** - Track platform activities and user actions for security
- 💰 **Payment Overview** - Monitor all transactions and payment statuses

---

## 🛠️ Technology Stack

### **Frontend Architecture**
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React.js 19.2.0 | Modern UI component library with hooks |
| **Build Tool** | Vite 7.2.4 | Ultra-fast development and production builds |
| **Styling** | Tailwind CSS 4.1.17 + DaisyUI 5.5.11 | Utility-first CSS with pre-built components |
| **State Management** | TanStack Query 5.90.12 + Context API | Server state and app-wide state management |
| **Routing** | React Router 7.10.1 | Client-side navigation with nested routes |
| **Forms** | React Hook Form 7.68.0 | Efficient form validation and submission |
| **Animations** | Framer Motion 12.23.26 | Smooth and interactive animations |
| **Date Picker** | React DatePicker 9.0.0 | Intuitive date selection interface |
| **Icons** | React Icons 5.5.0 | Comprehensive icon library |
| **Loading** | React Spinners 0.17.0 | Professional loading animations |
| **Alerts** | SweetAlert2 11.26.4 | Beautiful modal alerts and notifications |
| **HTTP Client** | Axios 1.13.2 | Promise-based HTTP requests |
| **Authentication** | Firebase 12.6.0 | User auth, hosting, and real-time database |

### **Backend Architecture**
| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime for server |
| **Framework** | Express.js | Minimal and flexible web application framework |
| **Database** | MongoDB | NoSQL document database with aggregation pipelines |
| **Authentication** | Firebase Auth + JWT | Secure user authentication and session management |
| **Payments** | Stripe API | Industry-standard payment processing |
| **API Communication** | REST API | RESTful endpoints for data communication |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn installed
- Firebase account and project configured
- Stripe account for payment processing
- MongoDB database (local or cloud)
- Git for version control

### Step 1: Clone the Repositories

```bash
# Clone the client repository
git clone https://github.com/Zihan231/Contest-Hub-Client.git
cd contest-hub

# Clone the server repository (in a separate directory)
git clone https://github.com/Zihan231/Contest-Hub-Server.git
cd contest-hub-server
```

### Step 2: Install Dependencies

```bash
# Install client dependencies
cd contest-hub
npm install

# Install server dependencies
cd ../contest-hub-server
npm install
```

### Step 3: Configure Environment Variables

**Client Configuration** - Create `.env.local` in the client root:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_API_URL=http://localhost:5000
```

**Server Configuration** - Create `.env` in the server root:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FIREBASE_ADMIN_SDK_KEY=your_firebase_admin_key
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Step 4: Run the Application

```bash
# Start the development server (client)
npm run dev

# Start the backend server (in another terminal)
cd ../contest-hub-server
npm run dev

# The client will run on http://localhost:5173
# The server will run on http://localhost:5000
```

### Step 5: Build for Production

```bash
# Build client
npm run build

# Build output will be in 'dist' folder
npm run preview  # Preview production build locally
```

---

## 📁 Project Structure

```
contest-hub/
├── public/                          # Static assets
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── Banner/                  # Landing page banner
│   │   ├── ContestDetails/          # Contest detail view
│   │   ├── DashboardSidebar/        # Dashboard navigation
│   │   ├── ErrorPage/               # Error handling page
│   │   ├── Footer/                  # Footer component
│   │   ├── Forbidden/               # 403 access denied page
│   │   ├── Loading/                 # Loading spinner component
│   │   ├── NavBar/                  # Navigation bar
│   │   ├── PaymentFail/             # Payment failure page
│   │   ├── PaymentSuccess/          # Payment success page
│   │   ├── PopularContests/         # Popular contests showcase
│   │   └── WinnerSection/           # Winners display
│   ├── context/                     # React Context API
│   │   ├── AuthContext/             # Authentication context
│   │   └── AuthProvider/            # Auth provider wrapper
│   ├── firebase/                    # Firebase configuration
│   │   └── firebase.config.js       # Firebase initialization
│   ├── hooks/                       # Custom React hooks
│   │   ├── axios/                   # HTTP request hook
│   │   ├── axiosSecure/             # Secure HTTP with JWT
│   │   └── role/                    # User role hook
│   ├── layouts/                     # Page layouts
│   │   ├── DashboardLayout/         # Dashboard layout wrapper
│   │   └── HomeLayout/              # Home page layout wrapper
│   ├── pages/                       # Page components
│   │   ├── AboutUs/                 # About page
│   │   ├── All-Contests/            # Browse all contests
│   │   ├── ContactUs/               # Contact page
│   │   ├── CreateContest/           # Contest creation form
│   │   ├── Home/                    # Landing page
│   │   ├── Leaderboard/             # Global leaderboard
│   │   ├── Login/                   # User login
│   │   ├── ManageContests/          # Admin contest management
│   │   ├── ManageUsers/             # Admin user management
│   │   ├── MyCreatedContests/       # Creator's contests
│   │   ├── MyParticipatedContests/  # User's participated contests
│   │   ├── MyProfile/               # User profile page
│   │   ├── MyWinningContests/       # User's winning contests
│   │   ├── OverView/                # Dashboard overview
│   │   ├── PrivacyPolicy/           # Privacy policy page
│   │   ├── Register/                # User registration
│   │   └── TaskSubmissions/         # Task submission management
│   ├── router/                      # Routing configuration
│   │   ├── Router.jsx               # Main router setup
│   │   ├── adminRoute/              # Admin-only route protection
│   │   ├── CreatorRoute/            # Creator-only route protection
│   │   ├── PrivateRoute/            # Authenticated user protection
│   │   └── UserRoute/               # User-only route protection
│   ├── Test/                        # Testing components
│   │   └── TestAnimation/           # Animation testing
│   ├── App.jsx                      # Root app component
│   ├── App.css                      # Global styles
│   ├── index.css                    # Base styles
│   └── main.jsx                     # Application entry point
├── .eslintrc.cjs                    # ESLint configuration
├── eslint.config.js                 # ESLint rules
├── tailwind.config.js               # Tailwind CSS config
├── vite.config.js                   # Vite build config
├── firebase.json                    # Firebase deployment config
├── package.json                     # Project dependencies
├── index.html                       # HTML template
└── README.md                        # This file
```

---

## 🔐 Authentication & Authorization

### Role-Based Access Control (RBAC)

```
┌─────────────┐
│   Regular   │──────┐
│    User     │      │
└─────────────┘      │
                     ├──────────────────┐
┌─────────────┐      │                  │
│  Contest    │──────┤ → Authentication │
│  Creator    │      │    & JWT Token   │
└─────────────┘      │                  │
                     ├──────────────────┘
┌─────────────┐      │
│   Admin     │──────┘
└─────────────┘
```

**Protected Routes:**
- `/dashboard/*` - User dashboard (private)
- `/creator/*` - Creator-only pages (creator route)
- `/admin/*` - Admin dashboard (admin route)
- `/contest/*/pay` - Requires payment (private)

---

## 💳 Payment Integration

### Stripe Integration Flow

1. **User joins contest** → Payment required
2. **Stripe checkout page** → Secure payment details
3. **Payment processing** → Backend validates with Stripe
4. **Success/Failure** → User redirected accordingly
5. **Database update** → Payment status recorded

```javascript
// Payment endpoints
POST /api/payment/create-intent      // Create payment intent
POST /api/payment/confirm            // Confirm payment
GET  /api/payment/history/:userId    // User payment history
```

---

## 🎯 Key API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Contests
- `GET /api/contests` - Get all contests
- `GET /api/contests/:id` - Get contest details
- `POST /api/contests` - Create contest (creator)
- `PUT /api/contests/:id` - Update contest (creator/admin)
- `DELETE /api/contests/:id` - Delete contest (admin)

### Users
- `GET /api/users` - Get all users (admin)
- `PUT /api/users/:id/role` - Update user role (admin)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Leaderboard
- `GET /api/leaderboard` - Get global rankings
- `GET /api/leaderboard/:contestId` - Contest-specific rankings

---

## 🚀 Performance Optimizations

- ✅ **Code Splitting** - Lazy loading of routes with React Router
- ✅ **Image Optimization** - Responsive images and lazy loading
- ✅ **Caching Strategy** - TanStack Query for intelligent caching
- ✅ **Bundle Optimization** - Vite's fast build and minification
- ✅ **CSS Purging** - Tailwind removes unused CSS in production
- ✅ **API Optimization** - Axios request/response interceptors

---

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Firebase auth not working | Verify Firebase config keys in `.env.local` |
| Stripe payments failing | Check Stripe API keys and test mode settings |
| Database connection error | Ensure MongoDB URI is correct and accessible |
| Port already in use | Change port in `.env` or kill existing process |
| CORS errors | Verify backend CORS configuration |
| Module not found errors | Run `npm install` and clear node_modules if needed |

---

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Supported |
| Firefox | Latest | ✅ Supported |
| Safari | Latest | ✅ Supported |
| Edge | Latest | ✅ Supported |
| Mobile Safari | iOS 12+ | ✅ Supported |
| Chrome Mobile | Latest | ✅ Supported |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Use meaningful commit messages
- Write descriptive PR titles
- Test your changes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Developer

<p align="center">
  <img src="https://github.com/Zihan231.png" alt="Zihan231" width="120" style="border-radius:50%"/>
</p>

<p align="center">
  <b>ContestHub</b> was created with ❤️ by <a href="https://github.com/Zihan231">Zihan231</a>
</p>

<p align="center">
  <a href="https://facebook.com/Zihan231" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="30px" alt="Facebook"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://www.linkedin.com/in/zihan231" target="_blank">
  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="30px" alt="LinkedIn"/>
</a>
  &nbsp;&nbsp;
  <a href="https://instagram.com/zihan_islam_19" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="30px" alt="Instagram"/>
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Zihan231" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" width="30px" alt="GitHub"/>
  </a>
</p>

<p align="center">
  🧠 <i>This website is a demo showcase project created for learning purposes.</i>
</p>
---

## 🙏 Acknowledgments

- [React.js](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - Styling framework
- [Firebase](https://firebase.google.com) - Backend services
- [Stripe](https://stripe.com) - Payment processing
- [MongoDB](https://www.mongodb.com) - Database
- All contributors and testers

---

## 📞 Support

If you have any questions or issues, please:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search existing [GitHub Issues](https://github.com/Zihan231/Contest-Hub-Client/issues)
3. Open a new issue with detailed information
4. Contact the developer directly

---

<div align="center">

**Made with ❤️ for the competitive community**

⭐ If this project helped you, please give it a star!

</div>
