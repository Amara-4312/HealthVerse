# HealthVerse

### An Interactive Multi-Agent AI Health Companion

**Google Agent Development Kit • FastAPI • Python • Next.js • TypeScript • Tailwind CSS**

[Live Application](https://health-verse-eosin.vercel.app/) | [GitHub Repository](https://github.com/Amara-4312/HealthVerse)

## Overview

HealthVerse is an experimental multi-agent AI health companion designed to explore how conversational artificial intelligence, interactive interfaces and specialised agents can support health education and wellness awareness.

Developed for the **Agent for Good hackathon track**, the project combines an interactive human-body experience with a multi-agent architecture intended to help users explore health-related topics through a more accessible digital environment.

Rather than presenting health information solely through conventional text-based interfaces, HealthVerse explores an immersive approach to navigating educational health content.

The project integrates AI agent orchestration, backend services and modern frontend technologies into a digital health prototype.

**Status:** Experimental digital health application. Not a clinical decision-support system or medically validated diagnostic tool.

## Project Objectives

HealthVerse was developed to explore several questions:

- How can specialised AI agents be coordinated within a health-focused application?
- How can conversational interaction make complex health information more approachable?
- How can interactive visual experiences support health education?
- How can AI-assisted wellness applications communicate their limitations responsibly?
- How can a modular architecture support future development of digital health tools?

## Core Concept

HealthVerse is structured around an interactive health companion experience.

Its intended areas of interaction include:

**Interactive body exploration:** An interface concept through which users can engage with health-related topics using the human body as a navigation framework.

**Educational health insights:** AI-assisted explanations intended to support understanding of health and wellness concepts.

**Health awareness:** Exploration of health-related factors and preventive-health concepts without replacing clinical assessment.

**Wellness guidance:** General educational support for healthier decision-making.

These describe the project's intended experience. Individual features should be assessed against the implementation before being described as fully functional.

## Multi-Agent Architecture

HealthVerse uses the **Google Agent Development Kit (ADK)** as part of its multi-agent orchestration architecture.

The project defines five named agents:

| Agent | Architecture component |
|---|---|
| Nova | Specialised AI agent |
| Insight | Specialised AI agent |
| Pulse | Specialised AI agent |
| Vita | Specialised AI agent |
| Guardian | Specialised AI agent |

The specific responsibilities, tools and interactions of each agent are defined by the backend implementation and should be documented from their actual configurations.

The multi-agent approach is intended to provide a modular foundation for organising different health-assistance functions.

### High-Level Architecture

```text
                USER
                 |
                 v
       Next.js Web Interface
       TypeScript + Tailwind
                 |
                 v
          FastAPI Backend
                 |
                 v
       Google Agent Development Kit
                 |
      +----------+----------+
      |          |          |
    Nova      Insight     Pulse
      |          |          |
      +-----+----+----------+
            |    |
           Vita  Guardian
                 |
                 v
       Application Responses
```

*Conceptual architecture only; this diagram does not establish the actual agent routing sequence.*

## Technical Architecture

### Frontend

The frontend is built with:

- Next.js
- React
- TypeScript
- Tailwind CSS

It uses a digital health-themed visual system featuring deep navy backgrounds, electric-cyan accents, translucent panels and interactive interface elements.

The frontend is organised using the Next.js App Router architecture.

### Backend

The backend is developed using Python and FastAPI.

It serves as the application's API layer and provides the integration point for the AI agent architecture.

The repository also identifies supporting backend components for agent orchestration, memory systems and Model Context Protocol (MCP) configurations.

The detailed behaviour of these systems should be verified from the source code before making claims about persistence, external tool access or autonomous execution.

## Product and Design Documentation

The project includes documentation created to support its development.

| Document | Purpose |
|---|---|
| `PRD.md` | Product requirements |
| `MVP.md` | Minimum viable product definition |
| `context_engineering.md` | Context and agent-design documentation |
| `experience_architecture.md` | User-experience architecture |

These documents provide additional context for the application's intended functionality, design decisions and development process.

## Repository Structure

```text
HealthVerse/
├── backend/
│   └── FastAPI and AI-agent services
├── frontend/
│   └── Next.js application
├── PRD.md
├── MVP.md
├── context_engineering.md
├── experience_architecture.md
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js 18 or later
- npm

Additional API credentials or environment variables may be required depending on the agent configuration.

### 1. Clone the Repository

```bash
git clone https://github.com/Amara-4312/HealthVerse.git
cd HealthVerse
```

### 2. Start the Backend

Navigate to the backend directory.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv .venv
```

Activate the environment on Windows:

```bash
.venv\Scripts\activate
```

Or macOS/Linux:

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload --port 8000
```

The backend should be available at:

`http://localhost:8000`

Interactive API documentation:

`http://localhost:8000/docs`

### 3. Start the Frontend

From a separate terminal, navigate to the frontend directory.

```bash
cd frontend
npm install
npm run dev
```

Open:

`http://localhost:3000`

**Configuration note:** The application may require additional environment configuration, including AI-provider credentials and frontend/backend connection settings. Consult the backend and frontend configuration files before deployment.

## Live Application

A frontend deployment is available at:

https://health-verse-eosin.vercel.app/

Availability of the deployment does not independently establish that all backend agent services or intended features are operational.

## Technologies and Development Areas

| Technology | Application |
|---|---|
| Python | Backend development |
| FastAPI | API service architecture |
| Google ADK | AI agent orchestration |
| Next.js | Web application development |
| React | Component-based interfaces |
| TypeScript | Type-safe frontend development |
| Tailwind CSS | Interface styling |
| MCP configurations | Agent-tool integration architecture |
| Git and GitHub | Source control and collaboration workflow |

## Responsible AI and Health Information

HealthVerse explores AI-supported access to educational health information.

Because health-related AI systems can generate incomplete, inaccurate or inappropriate responses, responsible implementation requires explicit boundaries around the use of generated content.

Important considerations include:

- Distinguishing general health education from diagnosis and treatment.
- Avoiding unsupported claims of medical accuracy.
- Clearly communicating the limits of AI-generated responses.
- Considering privacy and the handling of personal health information.
- Evaluating agent behaviour and potentially unsafe outputs.
- Providing appropriate escalation guidance when interactions involve urgent health concerns.

These are design and evaluation requirements, not claims that every safeguard has already been implemented.

## Limitations

HealthVerse is an experimental application.

Its present documentation does not establish:

- Clinical validation of AI-generated health content.
- Reliability across diverse medical questions.
- Comprehensive safety testing of every agent.
- Independent evaluation of agent performance.
- Clinical-grade privacy, security or regulatory compliance.

The project should therefore be viewed as an exploration of multi-agent application development and user-centred digital health interfaces.

## Future Development

Potential areas for improvement include:

- Systematic evaluation of individual agents.
- Clear documentation of agent responsibilities and routing.
- Improved retrieval and grounding of health information.
- Structured testing of safety-critical conversations.
- Accessibility and usability testing.
- More comprehensive backend and deployment documentation.
- Evaluation of privacy and data-governance requirements.
- Further integration of evidence-based health education.

## Research and Technical Significance

HealthVerse demonstrates an interdisciplinary approach to digital health application development.

The project connects biomedical interests with AI agent architectures, API development, interactive web technologies and user-experience design.

It also provides an opportunity to investigate how AI-supported health applications can be designed for accessibility, transparency and responsible communication.

## Author

**Amarachi Nnanyelu**

Applied Biochemistry graduate interested in computational biology, biomedical AI, health data science and interdisciplinary healthcare innovation.

[GitHub](https://github.com/Amara-4312)

---

**Disclaimer:** HealthVerse is an educational and experimental digital health application. It does not provide medical diagnoses or replace professional healthcare advice.
