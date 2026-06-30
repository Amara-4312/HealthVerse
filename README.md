# HealthVerse

HealthVerse is an immersive, multi-agent AI Health Companion built for the Agent for Good hackathon track. It leverages the Google Agent Development Kit (ADK) for orchestrating specialized agents (Nova, Insight, Pulse, Vita, Guardian) and exposes this logic via a FastAPI backend. The frontend is a Next.js (TypeScript/Tailwind CSS) web app adopting a premium digital health universe design.

## Repository Structure

- **/backend**: Python FastAPI service with Google ADK agents, memory systems, and MCP configurations.
- **/frontend**: Next.js App Router project styled with a premium deep navy/midnight theme, electric cyan accents, glassmorphic panels, and glowing details.

---

## Getting Started

### 1. Running the Backend

Ensure you have Python 3.10+ installed.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The backend server will run at `http://localhost:8000`. The interactive API documentation is available at `http://localhost:8000/docs`.

### 2. Running the Frontend

Ensure you have Node.js 18+ installed.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will run at `http://localhost:3000`. Open [http://localhost:3000](http://localhost:3000) in your browser.
