# Lumina AI Code Reviewer

Lumina is a premium, full-stack AI-powered code reviewer application built using **React**, **Node.js + Express**, and **Gemini API**. It helps developers scan code for syntax errors, functional bugs, performance optimizations, security vulnerabilities, and style violations. Additionally, it generates a fully-refactored, optimized version of the submitted code.

---

## 🌟 Key Features

*   **Multi-Language Support**: Choose from JavaScript, Python, Java, C++, or SQL.
*   **Intelligent Code Review**: Detects bug severities, assesses code efficiency, conducts a comprehensive security audit, and recommends best practices.
*   **Refactored Code Viewer**: Displays optimized code side-by-side with copy utilities.
*   **Premium Workspace UI**: Interactive charts/metrics, tabbed navigation, loading shimmer states, and fluid responsive design.
*   **Dual Styling (Dark/Light Modes)**: Native light and dark themes with persistent storage.
*   **Markdown Export**: One-click formatting of the complete code review report for developers.

---

## 📂 Project Structure

```text
F:\ai code reviewer\
  ├── backend\               # Node.js + Express server
  │   ├── services\          # Gemini integration logic
  │   ├── server.js          # API Server entry point
  │   └── .env               # Environment configuration (API Key)
  ├── frontend\              # React frontend (Vite)
  │   ├── src\
  │   │   ├── components\    # Custom UI controls
  │   │   ├── App.jsx        # Root Layout & State Manager
  │   │   └── index.css      # Tailwind v4 configuration
  │   └── index.html         # Main Web entry point
  └── package.json           # Workspace runner configurations
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Set Up Gemini API Key
Create a `.env` file in the `backend` folder (or copy from `.env.example`):
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` and replace `your_gemini_api_key_here` with your actual Google AI Studio API Key. Get your key from [Google AI Studio](https://aistudio.google.com/).

### 3. Install Dependencies
Run the workspace installer script from the root folder:
```bash
npm run install-all
```

### 4. Launch Development Servers
Run the dev servers for both frontend and backend concurrently:
```bash
npm run dev
```

The application will run locally:
*   **Frontend**: `http://localhost:5173/` (Vite dev server)
*   **Backend**: `http://localhost:5000/` (Express API server)

---

## 🧪 Testing Connectivity
You can test backend connectivity to Gemini standalone without running the client:
```bash
cd backend
node testGemini.js
```
This script will test a mock Javascript code review and verify that Gemini outputs valid structured JSON.
