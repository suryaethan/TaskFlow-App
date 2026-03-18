# 📝 TaskFlow-App

**Full-Stack Task Management Application** — Modern, production-ready web app built with React, FastAPI, and PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10+-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-teal.svg)

## ✨ Features

- 🔐 **User Authentication** — JWT-based secure login & registration
- ✅ **Task Management** — Create, read, update, delete tasks (CRUD)
- 🎯 **Priority Levels** — Low, Medium, High task priorities
- 📊 **Status Tracking** — Todo, In Progress, Done task statuses
- 🌙 **Dark Mode** — Beautiful UI with light/dark theme toggle
- 📱 **Responsive Design** — Works seamlessly on all devices
- 🚀 **RESTful API** — Clean, documented backend API
- 🔒 **Secure** — Password hashing with bcrypt, token-based auth

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **PostgreSQL** - Robust relational database
- **SQLAlchemy** - Python SQL toolkit & ORM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Secure password hashing
- **Pydantic** - Data validation

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **CSS3** - Custom responsive styling
- **Fetch API** - HTTP requests

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
# Clone repository
git clone https://github.com/suryaethan/TaskFlow-App.git
cd TaskFlow-App/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

## 📚 API Documentation

Once backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Authentication
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
```

#### Tasks
```
GET    /api/tasks          - Get all user tasks
POST   /api/tasks          - Create new task
PUT    /api/tasks/{id}     - Update task
DELETE /api/tasks/{id}     - Delete task
```

## 📁 Project Structure

```
TaskFlow-App/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   └── App.css          # Styling
│   └── package.json         # Node dependencies
├── README.md
└── LICENSE
```

## 👥 Usage

1. **Register** a new account
2. **Login** with credentials
3. **Create tasks** with title, description, priority
4. **Track progress** by updating task status
5. **Delete** completed tasks
6. **Toggle dark mode** for comfortable viewing

## 🔧 Configuration

### Database Setup (Production)

Replace in-memory storage in `backend/main.py` with PostgreSQL:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/taskflow"
engine = create_engine(DATABASE_URL)
```

### Environment Variables

Create `.env` file:
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost/taskflow
CORS_ORIGINS=http://localhost:3000
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend (Render/Heroku)
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend (Vercel/Netlify)
```bash
npm run build
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👤 Author

**Surya Ethan** - [@suryaethan](https://github.com/suryaethan)

## 🔗 Links

- [Live Demo](#) _(Coming soon)_
- [Report Bug](https://github.com/suryaethan/TaskFlow-App/issues)
- [Request Feature](https://github.com/suryaethan/TaskFlow-App/issues)

## ⭐ Support

If you found this project helpful, please give it a ⭐!

---

**Built with ❤️ by Surya Ethan**
