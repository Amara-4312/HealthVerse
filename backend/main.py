# backend/main.py
"""FastAPI entry point for HealthVerse backend.

Provides a single POST /chat endpoint that receives a user_id and message,
interfaces with the Nova coordinator (now fully integrated), and returns a response
including which agents were activated and any MCP calls made during the request.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

# Import Nova agent and MCP utilities
from backend.agents.nova import NovaAgent
from backend.mcp.mcp_manager import reset_calls, get_last_calls

app = FastAPI(title="HealthVerse Backend")

# Allow all origins for the hackathon demo; tighten in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_id: str = Field(..., description="Identifier for the user/session")
    message: str = Field(..., description="User's message/question")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Nova's synthesized response")
    activated_agents: list[str] = Field(..., description="List of agents that participated in this turn")
    mcp_calls: list[dict] = Field(..., description="MCP tool calls made during processing")
    collaboration_logs: list[dict] = Field(default_factory=list, description="Collaboration logs/steps between agents")

# Instantiate a single Nova agent for the lifetime of the app
nova = NovaAgent()

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Process a chat message via the Nova coordinator.

    The flow:
    1. Reset MCP call log for this request.
    2. Invoke Nova's coordinate method with the user message.
    3. Collect response, activated agents, and MCP call history.
    """
    # Reset MCP call tracking for this request
    reset_calls()

    result = await nova.coordinate(request.message)

    # Gather MCP calls made during this request
    mcp_calls = get_last_calls()

    return ChatResponse(
        reply=result.get("response", ""),
        activated_agents=result.get("activated_agents", []),
        mcp_calls=mcp_calls,
        collaboration_logs=result.get("collaboration_logs", []),
    )

