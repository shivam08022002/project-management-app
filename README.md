# Proxima - Premium Project Management System

Proxima is a sophisticated, full-stack project management application designed for teams that require a high-performance, visually stunning, and intuitive workspace. Built with a modern tech stack and focusing on a premium user experience, Proxima offers a seamless Kanban-style workflow, real-time activity tracking, and project-based collaboration.

---

## 🚀 Key Features

- **Dynamic Kanban Board**: Drag-and-drop task management with consistent, high-end styling.
- **Advanced Project Management**: Create multiple projects, each with its own isolated boards and members.
- **Real-time Notifications**: Invitation system for users to join projects, with responsive accept/decline workflows.
- **Intelligent Search & Filtering**: Debounced task search and multi-criteria filters (Status, Priority, Assignee, Due Date).
- **Premium UI/UX**: Dark-themed workspace with custom animations, glassmorphism elements, and a centralized brand identity.
- **Secure Authentication**: JWT-based login, registration, and protected routes.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit (Slices/Thunks)
- **Styling**: Vanilla CSS (Custom Variable-based Design System)
- **Icons**: Lucide React
- **DnD**: @hello-pangea/dnd (Modern Fork of React-Beautiful-DnD)
- **Notices**: React-Toastify

### Backend
- **Framework**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JSON Web Tokens (JWT) & BcryptJS
- **Validation**: Express-Validator
- **Monitoring**: Morgan (logging)

---

## 🖥️ How to Run

### Prerequisites
- **Node.js** (v16.x or later)
- **MongoDB** (Local instance or Atlas URI)
- **npm** (or yarn)

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root and add your configuration:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Check the local API URL in `src/services/ApiServices.js` (defaults to `http://localhost:5000/api`).
4. Start the application:
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture Decisions

### **Frontend: Centralized Service Layer**
- **Decision**: Logic for API interactions is segregated into a dedicated `services/` directory.
- **Why**: This ensures that Redux Slices (Thunks) remained clean and focused purely on state orchestration, making the API layer easier to test and maintain.

### **Backend: MVC-Style Controller Pattern**
- **Decision**: Separated routes, controllers, and models.
- **Why**: Encourages a modular architecture where business logic is isolated from the HTTP handling, facilitating future scalability.

### **State: Debounced Thunks**
- **Decision**: Implemented debouncing (300ms) for task search.
- **Why**: Prevents API hammering and ensures a fluid UI experience while filtering through large datasets.

### **Schema: Relational MongoDB**
- **Decision**: Using Mongoose `ObjectId` references for projects, boards, and tasks.
- **Why**: Enables efficient population of nested data (e.g., getting project members alongside task assignees) while maintaining a flexible NoSQL structure.

---

## 📜 API Documentation (REST)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Authenticate & get token |
| **GET** | `/api/projects` | List projects (paginated) |
| **POST** | `/api/projects/:id/invite` | Send project invitation |
| **GET** | `/api/users/notifications` | Get pending invitations |
| **POST** | `/api/tasks` | Create a new task |
| **PUT** | `/api/tasks/:id` | Update task (inc. status/column) |

---

## 💾 Database Schema

### User
- `name`, `email`, `password` (hashed)

### Project
- `name`, `description`, `owner` (ref), `members` (ref Array)

### Board
- `name`, `project` (ref)

### Task
- `title`, `description`, `status`, `priority`, `dueDate`, `assignedTo` (ref), `board` (ref)

### Invitation
- `project`, `inviter`, `invitee`, `status` (pending/accepted/declined)

---

## 🌓 Design Decisions
Proxima uses a **Dark Mode First** approach. The design system is built on CSS variables which allow for rapid theme switching and consistent spacing (using a 4px/8px baseline grid). All interactive elements feature smooth transitions and micro-animations to improve the perceived performance of the app.
