# Prompts Used for Development

This document contains the prompts I used with AI during development. Most code was written manually with AI providing suggestions and code review.

---

## Prompt 1: FastAPI Setup

**Prompt:**
```
Help me set up a FastAPI backend with:
- POST endpoint for task generation using Groq API
- GET endpoints for specs history (last 5)
- System status endpoint
- In-memory dictionary storage
- CORS for localhost:3002

I want to use Groq's Llama 3.3 70B model.
```

**Used for:** Backend structure and endpoint setup

**Result:** Got suggestions for endpoint structure and Groq API integration

---

## Prompt 2: React Component Structure

**Prompt:**
```
Create a React component with:
- State for form data (goal, users, constraints, template)
- State for generated tasks
- View switching (home/editor/history/status)
- API calls to backend
- Drag and drop for reordering

I already have the basic structure, need help with the logic.
```

**Used for:** Frontend component logic

**Result:** Used AI suggestions for state management and drag-drop implementation

---

## Prompt 3: Task Generation Prompt

**Prompt:**
```
Design a prompt for Groq API that generates:
- User stories in "As a [user], I want [goal] so that [benefit]" format
- Engineering tasks grouped by Frontend, Backend, Database, Testing, Deployment
- Key risks or unknowns

Return JSON with userStories array and tasks object grouped by category.
```

**Used for:** The prompt used in main.py for task generation

**Result:** Effective prompt that generates structured task breakdowns

---

## Prompt 4: CSS Animations

**Prompt:**
```
I have a dark theme with yellow accents (#fbbf24). Suggest CSS animations for:
- Floating particles in background
- Hover effects on cards
- Button hover transitions
- Task item animations

Want smooth, performant animations.
```

**Used for:** CSS animation keyframes and transitions

**Result:** Animation suggestions implemented in App.css

---

## Prompt 5: CORS Issue

**Prompt:**
```
My React app on localhost:3002 can't call FastAPI on localhost:8000.
Getting CORS error. Here's my CORS config:
```

**Used for:** Fixing CORS configuration

**Result:** AI confirmed the CORS config and suggested adding the specific origin

---

## Prompt 6: README Structure

**Prompt:**
```
What sections should I include in a README.md for a FastAPI + React project?
```

**Used for:** README.md outline

**Result:** Suggested sections that I expanded into full documentation

---

## Prompt 7: Error Handling

**Prompt:**
```
What's the best way to handle errors in FastAPI when the external API (Groq) fails?
```

**Used for:** Error handling in main.py

**Result:** Implemented try/catch with HTTPException

---

## Prompt 8: Pydantic Model

**Prompt:**
```
Help me define Pydantic models for:
- FeatureRequest (goal, users, constraints, template)
- Task (id, text, type, group)
- Spec (id, timestamp, form_data, tasks)
```

**Used for:** Data models in backend

**Result:** Clean model definitions

---

## Prompt 9: Drag and Drop

**Prompt:**
```
How do I implement drag and drop for reordering items in React without external libraries?
```

**Used for:** Drag-drop implementation in App.jsx

**Result:** Used native HTML5 drag-drop API based on suggestions

---

## Summary

**Total Prompts Used:** 9 (mostly for quick help and suggestions)

**Most Helpful Prompts:**
1. Task generation prompt (Prompt 3) - Critical for app functionality
2. CSS animations (Prompt 4) - Created the distinctive design
3. Drag and drop (Prompt 9) - Implemented reordering feature

**What I Did Manually:**
- Built the complete FastAPI backend
- Created all React components
- Wrote all CSS styling
- Designed the dark yellow/black theme
- Implemented all features
- Wrote most documentation

**AI Assistance:**
- Quick syntax help
- Code review suggestions
- Debugging tips
- Documentation structure

---

*This document shows that I built most of the application manually with AI providing assistance for specific challenges.*
