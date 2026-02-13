# Tasks Generator - AI-Powered Project Planning Tool

A full-stack web application that transforms feature ideas into actionable user stories and engineering tasks using AI.

![Tech Stack](https://img.shields.io/badge/Python-FastAPI-green)
![Tech Stack](https://img.shields.io/badge/React-Vite-blue)
![Tech Stack](https://img.shields.io/badge/AI-Groq_Llama_3.3-purple)

## 🚀 Features

### ✅ Completed Features
- **Smart Task Generation**: AI-powered generation of user stories, engineering tasks, and risk assessments
- **Interactive Editor**: Drag-and-drop task reordering, inline editing, and task deletion
- **Template System**: Pre-configured templates for web, mobile, and internal tools
- **Export Options**: Download as Markdown or copy to clipboard
- **History Management**: View and reload your last 5 generated specs
- **System Status**: Real-time health monitoring of backend, database, and LLM connection
- **Modern UI**: Dark yellow/black themed interface with smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 📋 What's Not Done
- ~~Database Persistence~~: Now implemented (PostgreSQL or in-memory)
- **User Authentication**: No login system implemented
- **Team Collaboration**: No multi-user features or sharing
- **Advanced Editing**: No rich text editor or task dependencies
- **Analytics**: No usage statistics or insights dashboard

## 🏗️ Architecture

```
tasks-generator-app/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Main API routes and logic
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile           # Render deployment config
│   └── .env.example       # Environment variables template
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Component styles
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Node dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── vercel.json       # Vercel deployment config
│   └── .env.example      # Environment variables template
└── README.md              # This file
```

## 🛠️ Tech Stack

**Backend:**
- Python 3.11+
- FastAPI - Modern web framework
- Groq API - Llama 3.3 70B for AI generation
- PostgreSQL - Optional persistent storage (or in-memory fallback)
- SQLAlchemy - ORM for database operations
- Uvicorn - ASGI server

**Frontend:**
- React 18
- Vite - Build tool
- Lucide React - Icon library
- Modern CSS with animations

## 📦 Installation

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn
- Groq API key (get one at https://console.groq.com)
- PostgreSQL (optional - for persistent storage)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_actual_api_key_here
PORT=8000
```

6. (Optional) Add PostgreSQL DATABASE_URL for persistent storage:
```
DATABASE_URL=postgresql://user:password@localhost:5432/tasks_generator
```
If DATABASE_URL is not set, the app uses in-memory storage (data resets on restart).

7. Run the backend:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:3002`

## 🚀 Deployment Guide

### Frontend: Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     - `VITE_API_URL` = your Render backend URL (e.g., `https://your-app.onrender.com`)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Backend: Render

1. **Push to GitHub** (if not done already)

2. **Deploy on Render**
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository

3. **Configure Settings**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Root Directory: `backend`

4. **Environment Variables**
   - Add in Render dashboard:
     - `GROQ_API_KEY` = your Groq API key
     - `PORT` = 8000
     - `CORS_ORIGINS` = your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment

### Connecting Frontend to Backend

After deploying:
1. Copy your Render backend URL (e.g., `https://tasks-generator.onrender.com`)
2. Go to Vercel dashboard → Settings → Environment Variables
3. Update `VITE_API_URL` with your backend URL
4. Redeploy frontend

### Free Tier Notes
- **Render**: Free web service sleeps after 15 min of inactivity
- **Vercel**: Generous free tier for static sites
- **Groq API**: Check Groq console for free tier limits

## 🧪 Testing

### Manual Testing Steps

1. **Test Task Generation:**
   - Fill out the form with a feature goal
   - Select a template
   - Click "Generate Tasks"
   - Verify tasks are generated and categorized

2. **Test Editing:**
   - Click on any task text to edit
   - Drag tasks to reorder
   - Delete tasks using the trash icon

3. **Test Export:**
   - Click "Copy" to copy markdown to clipboard
   - Click "Download" to download as .md file

4. **Test History:**
   - Navigate to History page
   - Click on a previous spec to reload it

5. **Test Status:**
   - Navigate to Status page
   - Verify all systems show "healthy"
   - Check if database shows "in-memory" or "healthy" (PostgreSQL)

### API Testing

Test the API directly:
```bash
# Health check
curl http://localhost:8000/health

# System status
curl http://localhost:8000/api/status

# Generate tasks (requires GROQ_API_KEY)
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"goal":"Build a login system","users":"Web users","constraints":"Must be secure","template":"web"}'
```

## 🌐 API Documentation

FastAPI provides automatic API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Main Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api/status` - System status
- `POST /api/generate` - Generate tasks
- `GET /api/specs` - Get last 5 specs
- `GET /api/specs/{spec_id}` - Get specific spec
- `PUT /api/specs/{spec_id}` - Update spec
- `DELETE /api/specs/{spec_id}` - Delete spec

## 🔒 Security Notes

- **Never commit API keys** to version control
- Use `.env` files for sensitive configuration
- The `.env.example` files show required variables without exposing secrets
- In production, use proper secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)

## 🐛 Known Issues

1. ~~In-Memory Storage~~: Fixed! Now supports PostgreSQL
2. **CORS Configuration**: Currently allows specific origins. Update for production.
3. **Error Handling**: Basic error handling implemented. Could be more robust.
4. **Rate Limiting**: No rate limiting on API calls. Add in production.

## 📝 Future Improvements

1. ~~Database Integration~~: PostgreSQL now supported
2. **User Authentication**: JWT-based auth with user accounts
3. **Real-time Collaboration**: WebSocket support for team editing
4. **Task Dependencies**: Visual task relationships and dependencies
5. **Export Formats**: PDF, JIRA, Linear integration
6. **AI Improvements**: Custom prompts, fine-tuning, context memory
7. **Analytics Dashboard**: Usage statistics and insights
8. **Mobile App**: React Native version

## 🤝 Contributing

This is a take-home project submission. Not accepting contributions at this time.

## 📄 License

MIT License - See LICENSE file for details.

## 👤 Author

See ABOUTME.md for developer information.

## 🙏 Acknowledgments

- Groq for the Llama 3.3 API
- FastAPI team for excellent documentation
- React and Vite communities
- Lucide for beautiful icons
