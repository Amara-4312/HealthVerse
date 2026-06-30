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
    # Optionally, include collaboration logs for debugging (not required by UI)
    # collaboration_logs: list[dict] = Field(default_factory=list)

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
        # collaboration_logs=result.get("collaboration_logs", []),
    )

"""FastAPI entry point for HealthVerse backend.

Provides a single POST /chat endpoint that receives a user_id and message,
interfaces with the Nova coordinator (stub for now), and returns a placeholder
response.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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
    user_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    # In a full implementation, this could include a log of which agents were invoked.

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Placeholder chat endpoint.

    In a complete version, this would route the request to the Nova agent,
    which would coordinate specialist agents and formulate a response.
    """
    # TODO: Integrate with Nova agent from backend/agents/nova.py
    placeholder_reply = (
        "Hello! I'm Nova, your HealthVerse companion. "
        "I’m currently a stub, but will soon synthesize insights from my specialist agents."
    )
    return ChatResponse(reply=placeholder_reply)
