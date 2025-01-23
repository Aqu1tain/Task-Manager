<div align="center">

# ════ ACADEMIC PROJECT ════

###  TASK MANAGER 😁👍

**⟦** <a href="https://www.supdevinci.fr/" target="_blank">SUP DE VINCI</a> **⟧**

*Bachelor's Degree*

▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔

</div>

## 📋 Project Overview

A modern task management application built with Express.js and JSON Server, featuring both basic CRUD operations and advanced task management capabilities.

## 🚀 Features

- **Task Management**
    - Create, read, update, and delete tasks
    - Mark tasks as complete/incomplete
    - Set due dates for tasks
    - Add descriptions to tasks

- **Advanced Features**
    - Search tasks by title or description
    - View tasks due soon
    - Get comprehensive task statistics
    - Bulk actions (complete all/reset all)
    - Real-time statistics updates

## 🛠 Technology Stack

- **Backend**
    - Express.js
    - JSON Server
    - Axios
    - CORS

- **Frontend**
    - Vanilla JavaScript
    - HTML5
    - CSS3

## 🏗 Project Structure

```
task-manager/
├── backend/
│   ├── routes/
│   │   └── advancedTaskRoutes.js   (Advanced Express routes)
│   ├── db.json                     (JSON Server database)
│   └── server.js                   (Express server entry point)
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── package.json
└── README.md
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aqu1tain/Task-Manager.git
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm ci
   ```

3. **Start the servers**
   ```bash
   # Start JSON Server (Port 3030)
   cd ..
   npx json-server --watch db.json --port 3030

   # Start Express Server (Port 4000)
   node backend/server.js # You can use nodemon for auto-reloading, if you want to make changes
   ```

4. **Access the application**
    - Open `http://localhost:4000` in your browser

## 📡 API Endpoints

### JSON Server Endpoints (Port 3030)
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Advanced Express Endpoints (Port 4000)
- `GET /api/advanced/tasks/stats` - Get task statistics
- `GET /api/advanced/tasks/dueSoon` - Get tasks due soon
- `GET /api/advanced/tasks/search?query=<term>` - Search tasks
- `POST /api/advanced/tasks/completeAll` - Mark all tasks as complete
- `POST /api/advanced/tasks/resetAll` - Mark all tasks as incomplete
- `POST /api/advanced/tasks/complete` - Toggle task completion status

## 🎨 User Interface

The application features a clean, modern-brutalist interface with:
- Search functionality
- Task filtering options
- Statistics dashboard
- Responsive design
- Intuitive task management controls

## 📝 License

This project is part of academic coursework at SUP DE VINCI.

Made with 🤎 by [Aqu1tain](https://github.com/Aqu1tain)