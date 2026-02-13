import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Download, Copy, Check, Activity, Database, Zap, Clock, AlertCircle, FileText } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [formData, setFormData] = useState({
    goal: '',
    users: '',
    constraints: '',
    template: 'web'
  });
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSpecs, setSavedSpecs] = useState([]);
  const [currentSpecId, setCurrentSpecId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [copied, setCopied] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [systemStatus, setSystemStatus] = useState({
    backend: 'checking',
    database: 'checking',
    llm: 'checking'
  });

  useEffect(() => {
    loadSavedSpecs();
    checkSystemStatus();
  }, []);

  const loadSavedSpecs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/specs`);
      if (response.ok) {
        const specs = await response.json();
        setSavedSpecs(specs);
      }
    } catch (error) {
      console.error('Failed to load specs:', error);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/status`);
      if (response.ok) {
        const status = await response.json();
        setSystemStatus(status);
      }
    } catch (error) {
      setSystemStatus({
        backend: 'error',
        database: 'error',
        llm: 'error'
      });
    }
  };

  const generateTasks = async () => {
    if (!formData.goal.trim()) {
      alert('Please enter a feature goal');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate tasks');
      }

      const spec = await response.json();
      setGeneratedTasks(spec.tasks);
      setCurrentSpecId(spec.id);
      await loadSavedSpecs();
      setCurrentView('editor');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate tasks. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSpec = async (specId) => {
    try {
      const response = await fetch(`${API_URL}/api/specs/${specId}`);
      if (response.ok) {
        const spec = await response.json();
        setFormData(spec.form_data);
        setGeneratedTasks(spec.tasks);
        setCurrentSpecId(spec.id);
        setCurrentView('editor');
      }
    } catch (error) {
      console.error('Failed to load spec');
    }
  };

  const deleteTask = (id) => {
    setGeneratedTasks(generatedTasks.filter(t => t.id !== id));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    setGeneratedTasks(generatedTasks.map(t => 
      t.id === id ? { ...t, text: editingText } : t
    ));
    setEditingTaskId(null);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.id === targetTask.id) return;

    const draggedIndex = generatedTasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = generatedTasks.findIndex(t => t.id === targetTask.id);
    
    const newTasks = [...generatedTasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    
    setGeneratedTasks(newTasks);
    setDraggedTask(null);
  };

  const exportMarkdown = () => {
    let markdown = `# ${formData.goal}\n\n`;
    markdown += `**Users:** ${formData.users || 'General users'}\n`;
    markdown += `**Constraints:** ${formData.constraints || 'None'}\n`;
    markdown += `**Template:** ${formData.template}\n\n`;

    const grouped = generatedTasks.reduce((acc, task) => {
      if (!acc[task.group]) acc[task.group] = [];
      acc[task.group].push(task);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([group, tasks]) => {
      markdown += `## ${group}\n\n`;
      tasks.forEach(task => {
        markdown += `- ${task.text}\n`;
      });
      markdown += '\n';
    });

    return markdown;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const markdown = exportMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.goal.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
  };

  const groupedTasks = generatedTasks.reduce((acc, task) => {
    if (!acc[task.group]) acc[task.group] = [];
    acc[task.group].push(task);
    return acc;
  }, {});

  return (
    <div className="app">
      <div className="animated-bg" />

      <header className="header">
        <div className="header-content">
          <h1 className="logo">⚡ TASKS_GEN</h1>
          <nav className="nav">
            {['home', 'history', 'status'].map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`nav-button ${currentView === view ? 'active' : ''}`}
              >
                {view}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'home' && (
          <div className="view-container">
            <div className="form-card">
              <h2 className="form-title">Generate Engineering Tasks</h2>
              <p className="form-description">
                Transform feature ideas into actionable user stories and engineering tasks.
                Fill out the form below and let AI break down your project.
              </p>

              <div className="form">
                <div className="form-group">
                  <label className="form-label">Project Template</label>
                  <div className="template-buttons">
                    {['web', 'mobile', 'internal-tool'].map(template => (
                      <button
                        key={template}
                        onClick={() => setFormData({ ...formData, template })}
                        className={`template-button ${formData.template === template ? 'active' : ''}`}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Feature Goal *</label>
                  <textarea
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="E.g., Build a user authentication system with OAuth"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Users</label>
                  <input
                    value={formData.users}
                    onChange={(e) => setFormData({ ...formData, users: e.target.value })}
                    placeholder="E.g., Mobile app users, enterprise admins"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Constraints</label>
                  <input
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    placeholder="E.g., Must work offline, GDPR compliant"
                    className="form-input"
                  />
                </div>

                <button
                  onClick={generateTasks}
                  disabled={isGenerating || !formData.goal.trim()}
                  className="generate-button"
                >
                  {isGenerating ? 'GENERATING...' : 'GENERATE TASKS'}
                </button>
              </div>
            </div>

            <div className="info-card">
              <h3 className="info-title">HOW IT WORKS</h3>
              <ol className="info-list">
                <li>Fill out the form with your feature details</li>
                <li>AI generates user stories and engineering tasks</li>
                <li>Edit, reorder, and organize tasks as needed</li>
                <li>Export as markdown or copy to clipboard</li>
                <li>Access your last 5 specs anytime from history</li>
              </ol>
            </div>
          </div>
        )}

        {currentView === 'editor' && generatedTasks.length > 0 && (
          <div className="view-container">
            <div className="editor-header">
              <h2 className="editor-title">{formData.goal}</h2>
              <div className="export-buttons">
                <button onClick={copyToClipboard} className="export-button">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
                <button onClick={downloadMarkdown} className="export-button">
                  <Download size={18} />
                  DOWNLOAD
                </button>
              </div>
            </div>

            {Object.entries(groupedTasks).map(([group, tasks]) => (
              <div key={group} className="task-group">
                <h3 className="task-group-title">{group}</h3>
                <div className="task-list">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="task-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, task)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <GripVertical size={20} className="drag-icon" />
                      {editingTaskId === task.id ? (
                        <input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onBlur={() => saveEdit(task.id)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                          autoFocus
                          className="task-input"
                        />
                      ) : (
                        <div onClick={() => startEditing(task)} className="task-text">
                          {task.text}
                        </div>
                      )}
                      <span className={`task-badge ${task.type.toLowerCase().replace(' ', '-')}`}>
                        {task.type}
                      </span>
                      <button onClick={() => deleteTask(task.id)} className="delete-button">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === 'history' && (
          <div className="view-container">
            <h2 className="page-title">Recent Specs</h2>
            {savedSpecs.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} className="empty-icon" />
                <p className="empty-text">No specs generated yet</p>
              </div>
            ) : (
              <div className="specs-list">
                {savedSpecs.map((spec, index) => (
                  <div
                    key={spec.id}
                    onClick={() => loadSpec(spec.id)}
                    className="spec-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="spec-content">
                      <h3 className="spec-title">{spec.form_data.goal}</h3>
                      <div className="spec-meta">
                        <span className="spec-template">{spec.form_data.template}</span>
                        <span className="spec-count">{spec.tasks.length} tasks</span>
                      </div>
                    </div>
                    <div className="spec-date">
                      <Clock size={16} />
                      {new Date(spec.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'status' && (
          <div className="view-container">
            <h2 className="page-title">System Status</h2>
            <div className="status-list">
              {Object.entries(systemStatus).map(([system, status], index) => (
                <div key={system} className="status-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="status-info">
                    {system === 'backend' && <Activity size={32} className="status-icon" />}
                    {system === 'database' && <Database size={32} className="status-icon" />}
                    {system === 'llm' && <Zap size={32} className="status-icon" />}
                    <div>
                      <h3 className="status-name">{system}</h3>
                      <p className="status-description">
                        {system === 'backend' && 'FastAPI Server Status'}
                        {system === 'database' && 'In-Memory Storage (Backend)'}
                        {system === 'llm' && 'Groq Llama 3.3 70B via Groq API'}
                      </p>
                    </div>
                  </div>
                  <div className={`status-badge ${status}`}>
                    {status}
                  </div>
                </div>
              ))}
            </div>

            <div className="status-note">
              <AlertCircle size={24} />
              <div>
                <p className="note-title">Note</p>
                <p className="note-text">
                  This app uses a Python FastAPI backend with in-memory storage and the Anthropic API for task generation.
                  For production, replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
