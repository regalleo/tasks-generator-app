# Project Structure

```
tasks-generator-app/
├── README.md                    # Main documentation
├── QUICKSTART.md               # Quick setup guide
├── AI_NOTES.md                 # AI usage documentation
├── ABOUTME.md                  # Developer information (to be filled)
├── PROMPTS_USED.md            # Development prompts log
├── PROJECT_STRUCTURE.md       # This file
├── .gitignore                 # Git ignore rules
├── docker-compose.yml         # Docker orchestration
│
├── backend/                   # Python FastAPI backend
│   ├── main.py               # Main application file
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment template
│   └── Dockerfile            # Backend container
│
└── frontend/                 # React + Vite frontend
    ├── src/
    │   ├── App.jsx          # Main React component
    │   ├── App.css          # Component styles
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Global styles
    ├── public/              # Static assets
    ├── index.html           # HTML template
    ├── package.json         # Node dependencies
    ├── vite.config.js       # Vite configuration
    ├── nginx.conf           # Nginx config for production
    ├── .env.example         # Environment template
    └── Dockerfile           # Frontend container
```

## File Descriptions

### Root Level

- **README.md**: Comprehensive project documentation including features, setup, deployment
- **QUICKSTART.md**: 5-minute setup guide for quick start
- **AI_NOTES.md**: Transparent documentation of AI usage in development
- **ABOUTME.md**: Template for developer information and resume
- **PROMPTS_USED.md**: All prompts used during AI-assisted development
- **docker-compose.yml**: One-command deployment configuration
- **.gitignore**: Prevents committing sensitive files

### Backend (`/backend`)

#### main.py (500+ lines)
- FastAPI application setup
- CORS middleware configuration
- Pydantic models for validation
- API endpoints:
  - `GET /` - Root endpoint
  - `GET /health` - Health check
  - `GET /api/status` - System status
  - `POST /api/generate` - Generate tasks using Claude API
  - `GET /api/specs` - List last 5 specs
  - `GET /api/specs/{id}` - Get specific spec
  - `PUT /api/specs/{id}` - Update spec
  - `DELETE /api/specs/{id}` - Delete spec
- Anthropic API integration
- In-memory storage (can be replaced with DB)

#### requirements.txt
- fastapi==0.109.0
- uvicorn==0.27.0
- anthropic==0.18.1
- pydantic==2.5.3
- python-dotenv==1.0.0

#### .env.example
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=8000
```

#### Dockerfile
- Python 3.11 slim base image
- Production-ready configuration
- Port 8000 exposed
- Uvicorn ASGI server

### Frontend (`/frontend`)

#### src/App.jsx (600+ lines)
- Main React component with hooks
- Three views: Home, History, Status
- Form handling and validation
- API integration with fetch
- Drag-and-drop task reordering
- Inline task editing
- Markdown export functionality
- Browser storage integration
- Responsive design

#### src/App.css (500+ lines)
- Cyberpunk/terminal aesthetic
- Dark gradient backgrounds
- Animated grid overlay
- Cyan accent colors (#64ffda)
- Smooth transitions and animations
- Responsive breakpoints
- Component-specific styles
- Hover and active states

#### src/main.jsx
- React 18 entry point
- StrictMode wrapper
- DOM mounting

#### src/index.css
- Global styles
- Font imports (Space Mono)
- CSS reset
- Base theme variables

#### package.json
Dependencies:
- react ^18.2.0
- react-dom ^18.2.0
- lucide-react ^0.294.0

Dev Dependencies:
- @vitejs/plugin-react ^4.2.1
- vite ^5.0.8
- eslint (with React plugins)

#### vite.config.js
- React plugin configuration
- Dev server on port 3000
- Proxy to backend API
- Build optimizations

#### nginx.conf
- Production web server config
- Gzip compression
- Static asset caching
- SPA fallback routing

## Architecture

### Request Flow

```
User Browser
    ↓
Frontend (React on :3000 or :80)
    ↓
Backend API (FastAPI on :8000)
    ↓
Anthropic API (Claude Sonnet 4)
    ↓
Response → Frontend → User
```

### Data Flow

1. User fills form
2. Frontend sends POST to `/api/generate`
3. Backend validates request
4. Backend calls Anthropic API with prompt
5. Claude generates structured task breakdown
6. Backend parses JSON response
7. Backend stores spec in memory
8. Backend returns tasks to frontend
9. Frontend displays and allows editing
10. User can export or save

### Storage

**Current**: In-memory dictionary
- Fast for development
- Resets on server restart
- Limited to single instance

**Future**: Database (PostgreSQL/MongoDB)
- Persistent storage
- Multi-user support
- Scalable

## Technology Choices

### Backend: FastAPI
- **Why**: Modern, fast, automatic API docs
- **Alternatives**: Flask, Django REST
- **Pros**: Type safety, async support, great docs
- **Cons**: Younger ecosystem than Django

### Frontend: React + Vite
- **Why**: Fast, modern, great DX
- **Alternatives**: Vue, Svelte, Next.js
- **Pros**: Huge ecosystem, fast refresh, optimized builds
- **Cons**: More complex than Vue for beginners

### AI: Claude Sonnet 4
- **Why**: High quality outputs, good API
- **Alternatives**: GPT-4, GPT-3.5
- **Pros**: Excellent instruction following, reliable JSON
- **Cons**: Newer, smaller community than OpenAI

### Deployment: Docker
- **Why**: Consistent environments, easy deployment
- **Alternatives**: Direct deployment, VM
- **Pros**: Reproducible, isolated, portable
- **Cons**: Overhead, learning curve

## Development Workflow

1. **Local Development**
   - Backend: `python main.py` (with hot reload)
   - Frontend: `npm run dev` (with Vite HMR)
   - Both run simultaneously

2. **Testing**
   - Manual testing in browser
   - API testing with curl or Postman
   - Check browser console for errors

3. **Building**
   - Backend: No build step (Python)
   - Frontend: `npm run build` → static files in `dist/`

4. **Deployment**
   - Option 1: `docker-compose up` (easiest)
   - Option 2: Deploy backend and frontend separately
   - Option 3: Use hosting platforms (Vercel, Railway, etc.)

## Code Statistics

- **Total Files**: 20+
- **Backend Code**: ~500 lines Python
- **Frontend Code**: ~600 lines JSX + ~500 lines CSS
- **Documentation**: ~3000 lines
- **Configuration**: ~200 lines

## Next Steps for Production

1. **Database**: Replace in-memory storage
2. **Authentication**: Add user accounts
3. **Rate Limiting**: Prevent API abuse
4. **Monitoring**: Add logging and metrics
5. **Tests**: Unit and integration tests
6. **CI/CD**: Automated deployments
7. **Scaling**: Load balancing, caching
