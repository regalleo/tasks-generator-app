# Quick Start Guide

Get the Tasks Generator running in 5 minutes!

## Option 1: Docker (Recommended) 🐳

### Prerequisites
- Docker and Docker Compose installed
- Anthropic API key

### Steps

1. **Clone or download the project**
```bash
cd tasks-generator-app
```

2. **Set up environment**
```bash
# Create .env file in the root directory
echo "ANTHROPIC_API_KEY=your_actual_api_key_here" > .env
```

3. **Start with Docker Compose**
```bash
docker-compose up --build
```

4. **Open your browser**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

That's it! 🎉

---

## Option 2: Manual Setup (Development) 💻

### Prerequisites
- Python 3.11+
- Node.js 18+
- Anthropic API key

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 6. Run the server
python main.py
```

Backend will be running at http://localhost:8000

### Frontend Setup

```bash
# 1. Open new terminal and navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file (optional)
cp .env.example .env

# 4. Start dev server
npm run dev
```

Frontend will be running at http://localhost:3000

---

## Getting Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy it to your `.env` file

---

## First Run

1. Open http://localhost:3000 (or http://localhost if using Docker)
2. Fill out the form:
   - **Feature Goal**: "Build a user authentication system"
   - **Target Users**: "Web application users"
   - **Constraints**: "Must support OAuth and 2FA"
   - **Template**: Select "web"
3. Click **GENERATE TASKS**
4. Wait a few seconds for AI to generate tasks
5. Explore the generated tasks, edit them, reorder them
6. Export as Markdown or copy to clipboard

---

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use: `lsof -i :8000` (Mac/Linux)
- Make sure you have the correct ANTHROPIC_API_KEY in `.env`
- Check Python version: `python --version` (should be 3.11+)

### Frontend won't start
- Check if port 3000 is already in use
- Make sure Node.js is installed: `node --version`
- Try deleting `node_modules` and running `npm install` again

### "Failed to generate tasks" error
- Verify your ANTHROPIC_API_KEY is correct
- Check if backend is running (http://localhost:8000/health should return OK)
- Check browser console for error messages

### Docker issues
- Make sure Docker is running
- Try: `docker-compose down && docker-compose up --build`
- Check logs: `docker-compose logs`

---

## What to Try

### Test Features
1. ✅ Generate tasks for different templates (web/mobile/internal-tool)
2. ✅ Edit task descriptions by clicking on them
3. ✅ Drag and drop to reorder tasks
4. ✅ Delete tasks you don't need
5. ✅ Export to Markdown (copy or download)
6. ✅ Check History page to see past specs
7. ✅ View System Status page

### Example Feature Ideas
- "Build a real-time chat application with WebSocket"
- "Create a dashboard for monitoring server metrics"
- "Implement a payment system with Stripe integration"
- "Build a mobile app for tracking fitness goals"
- "Create an internal tool for managing customer support tickets"

---

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [AI_NOTES.md](AI_NOTES.md) to understand how AI was used
- Review [PROMPTS_USED.md](PROMPTS_USED.md) to see development prompts
- Customize [ABOUTME.md](ABOUTME.md) with your information

---

## Need Help?

If you run into issues:
1. Check the logs (backend terminal or `docker-compose logs`)
2. Verify your API key is set correctly
3. Make sure all prerequisites are installed
4. Try the manual setup if Docker isn't working

---

**Happy Task Generating! 🚀**
