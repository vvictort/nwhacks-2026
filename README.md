# 🧸 ToyShare

**Give pre-loved toys a second chance. Connect families. Reduce waste.**

ToyShare is a community-driven platform that enables families to donate, browse, and request pre-loved toys. Built for nwHacks 2026, our mission is to reduce toy waste while spreading joy to children and families in need.

---

## 📖 Table of Contents

- [Mission](#-mission)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Available Scripts](#-available-scripts)
- [Authors](#-authors)

---

## 🎯 Mission

Every year, millions of toys end up in landfills. ToyShare aims to:

- **Reduce Waste**: Give toys a second life instead of throwing them away
- **Connect Communities**: Help families share resources and spread joy
- **Make Giving Easy**: Simplify the donation process with AI-powered toy classification and seamless listings

---

## ✨ Features

- 🏠 **Browse Toys** – Explore available toys from generous donors
- 📸 **AI-Powered Donations** – Upload a photo and let Gemini AI classify your toy automatically
- 🔐 **User Authentication** – Secure login/registration with Firebase Auth
- 📊 **Personal Dashboard** – Track your donations and requests
- 🎨 **Modern UI** – Beautiful neumorphic design with smooth animations

---

## 🛠 Tech Stack

### Frontend

| Technology          | Purpose                 |
| ------------------- | ----------------------- |
| **React 19**        | UI library              |
| **Vite**            | Build tool & dev server |
| **TailwindCSS 3**   | Utility-first styling   |
| **Framer Motion**   | Animations              |
| **React Router v7** | Client-side routing     |
| **Firebase SDK**    | Authentication          |

### Backend

| Technology           | Purpose                       |
| -------------------- | ----------------------------- |
| **Express 5**        | REST API framework            |
| **TypeScript**       | Type safety                   |
| **Snowflake**        | Cloud data warehouse          |
| **Firebase Admin**   | Server-side auth verification |
| **Google Gemini AI** | Toy image classification      |
| **Helmet & CORS**    | Security middleware           |

---

## 📁 Project Structure

```
nwhacks-2026/
├── frontend/                  # React + Vite frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── atoms/         # Basic elements (buttons, cards, etc.)
│   │   │   ├── molecules/     # Composed components
│   │   │   ├── organisms/     # Complex sections (Navbar, Footer)
│   │   │   └── templates/     # Page layouts
│   │   ├── pages/             # Route pages (Home, Login, Dashboard, etc.)
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── config/            # Firebase configuration
│   │   ├── utils/             # Helper functions & services
│   │   └── assets/            # Images and static files
│   ├── public/                # Public static assets
│   └── package.json
│
├── backend/                   # Express + TypeScript API server
│   ├── src/
│   │   ├── config/            # Snowflake & Firebase setup
│   │   ├── middleware/        # Rate limiting & auth middleware
│   │   ├── routes/            # API route handlers
│   │   └── types/             # TypeScript type definitions
│   ├── routes/                # Additional route modules
│   ├── server.ts              # Main server entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file based on the existing template. You'll need:
   - Snowflake credentials (account, username, password, warehouse, database, schema)
   - Firebase service account credentials
   - Gemini API key

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3000`

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file with your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

---

## 📜 Available Scripts

### Frontend

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite development server    |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint                       |

### Backend

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server with ts-node |
| `npm run build` | Compile TypeScript to JavaScript      |
| `npm run start` | Run compiled production server        |

---

## 👥 Authors

Built with ❤️ at nwHacks 2026

---

<p align="center">
  <em>Every toy deserves a second chance. Every child deserves to play.</em>
</p>
