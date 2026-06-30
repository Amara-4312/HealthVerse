# backend/agents/pulse.py
"""Pulse Agent – Health Risk Awareness Specialist

Provides risk awareness insights, using live web‑search via MCP when relevant (e.g., sleep or headache queries). Falls back to static responses on errors.
"""
import os
import sys

try:
    from google.adk.agents import Agent
    ADK_AVAILABLE = True
except ImportError:
    ADK_AVAILABLE = False

# Import MCP manager for live data and call logging
from ..mcp.mcp_manager import MCPClientManager, record_call

class PulseAgent:
    """Pulse Agent – Health Risk Awareness Specialist"""

    def __init__(self):
        self.name = "Pulse"
        self.instruction = (
            "You are Pulse, the Health Risk Awareness Specialist of HealthVerse. "
            "Your role is to evaluate input markers (like heart rate, blood pressure estimates, "
            "age, family history, sedentary habits) to flag potential areas that require attention. "
            "Encourage preventive checkups. Never diagnose conditions, predict mortality, or "
            "pronounce users as definitively 'unhealthy' or 'safe'."
        )
        self.adk_agent = None
        self.mcp_client = MCPClientManager()

        if ADK_AVAILABLE and (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")):
            try:
                self.adk_agent = Agent(
                    name=self.name,
                    instruction=self.instruction,
                    model="gemini-2.5-flash",
                )
            except Exception:
                pass

    async def run(self, message: str) -> str:
        if self.adk_agent:
            try:
                response = await self.adk_agent.run(message)
                return getattr(response, "text", str(response)).strip()
            except Exception:
                return self._simulate(message)
        else:
            return self._simulate(message)

    def _simulate(self, message: str) -> str:
        """Simulated response with optional live MCP data.

        For queries about sleep, headaches, or related health risks, the agent attempts a live web‑search via the MCP manager. If the call fails or yields no result, it falls back to the static educational response.
        """
        msg_lower = message.lower()
        # Live web‑search for sleep or headache related risk content
        if "sleep" in msg_lower or "headache" in msg_lower:
            try:
                query = "sleep hygiene health risk"
                result = self.mcp_client.web_search(query)
                if result:
                    return f"[Pulse] Latest health guidance: {result}"
            except Exception:
                # The MCP manager records the call; fallback to static response
                pass
        if "heart" in msg_lower or "cardio" in msg_lower or "bp" in msg_lower or "pulse" in msg_lower:
            return (
                "[Pulse] Cardiovascular risk is heavily influenced by aerobic capacity, resting heart rate, and "
                "blood pressure trends. Working at high heart rates is beneficial for conditioning, but users should "
                "monitor resting heart rate trends. Fluctuations or failure to recover quickly post-exercise can "
                "sometimes signal fatigue, dehydration, or cardiovascular strain."
            )
        elif "sleep" in msg_lower or "recover" in msg_lower or "rest" in msg_lower:
            return (
                "[Pulse] Persistent lack of sleep is associated with increased chronic stress markers, elevated resting "
                "cortisol, and systemic inflammation. Over time, poor recovery cycles can increase the risk of metabolic "
                "irregularities and elevated baseline cardiovascular stress."
            )
        return (
            "[Pulse] From a risk perspective, keeping track of daily physiological baselines is a key preventative measure. "
            "We recommend scheduling routine physicals to track metrics such as lipids, glucose, and blood pressure "
            "to establish personal baselines rather than relying on self-assessment."
        )

"""Pulse Agent – Health Risk Awareness Specialist

Provides risk awareness insights, using live web search via MCP when relevant (e.g., sleep or headache queries). Falls back to static responses on errors.
"""
import os
import sys

try:
    from google.adk.agents import Agent
    ADK_AVAILABLE = True
except ImportError:
    ADK_AVAILABLE = False

# Import MCP manager for live data
from ..mcp.mcp_manager import MCPClientManager

class PulseAgent:
    family history. Flags potential areas for monitoring (e.g., elevated heart rate,
    chronic stress markers, high-sodium impacts) without ever giving a diagnosis.
    """
    def __init__(self):
        self.name = "Pulse"
        self.instruction = (
            "You are Pulse, the Health Risk Awareness Specialist of HealthVerse. "
            "Your role is to evaluate input markers (like heart rate, blood pressure estimates, "
            "age, family history, sedentary habits) to flag potential areas that require attention. "
            "Encourage preventive checkups. Never diagnose conditions, predict mortality, or "
            "pronounce users as definitively 'unhealthy' or 'safe'."
        )
        self.adk_agent = None

        if ADK_AVAILABLE and (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")):
            try:
                self.adk_agent = Agent(
                    name=self.name,
                    instruction=self.instruction,
                    model="gemini-2.5-flash"
                )
            except Exception:
                pass

    async def run(self, message: str) -> str:
        if self.adk_agent:
            try:
                response = await self.adk_agent.run(message)
                return getattr(response, "text", str(response)).strip()
            except Exception:
                return self._simulate(message)
        else:
            return self._simulate(message)

    def _simulate(self, message: str) -> str:
        msg_lower = message.lower()
        if "heart" in msg_lower or "cardio" in msg_lower or "bp" in msg_lower or "pulse" in msg_lower:
            return (
                "[Pulse] Cardiovascular risk is heavily influenced by aerobic capacity, resting heart rate, and "
                "blood pressure trends. Working at high heart rates is beneficial for conditioning, but users should "
                "monitor resting heart rate trends. Fluctuations or failure to recover quickly post-exercise can "
                "sometimes signal fatigue, dehydration, or cardiovascular strain."
            )
        elif "sleep" in msg_lower or "recover" in msg_lower or "rest" in msg_lower:
            return (
                "[Pulse] Persistent lack of sleep is associated with increased chronic stress markers, elevated resting "
                "cortisol, and systemic inflammation. Over time, poor recovery cycles can increase the risk of metabolic "
                "irregularities and elevated baseline cardiovascular stress."
            )
        return (
            "[Pulse] From a risk perspective, keeping track of daily physiological baselines is a key preventative measure. "
            "We recommend scheduling routine physicals to track metrics such as lipids, glucose, and blood pressure "
            "to establish personal baselines rather than relying on self-assessment."
        )
