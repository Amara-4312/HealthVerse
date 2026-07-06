import os

try:
    from google.adk.agents import Agent
    ADK_AVAILABLE = True
except ImportError:
    ADK_AVAILABLE = False

# Import MCP manager
from ..mcp.mcp_manager import MCPClientManager, record_call

class InsightAgent:
    """
    Insight Agent - Health Education & Symptom Explorer
    --------------------------------------------------
    Personality: Clinical but accessible, educational, objective.
    Responsibilities: Explains how organ systems and symptoms connect, improves
    health literacy, translates complex terminology. Never diagnoses.
    """
    def __init__(self):
        self.name = "Insight"
        self.instruction = (
            "You are Insight, the Health Education & Symptom Explorer agent of HealthVerse. "
            "Your responsibility is to provide clear, educational explanations of symptoms and "
            "organ systems. Clarify medical terminology (e.g., blood pressure, tachycardia) and explain "
            "the physiological processes involved. Do NOT diagnose disease, estimate risk factors, "
            "or recommend specific drugs/treatments."
        )
        self.adk_agent = None
        # Initialize MCP client manager for web searches and medical references
        self.mcp_client = MCPClientManager()

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
        """Simulated response with optional live MCP data.

        The agent first checks for queries where up‑to‑date information is valuable
        (sleep/hygiene, headaches, or specific medical terminology). It uses the
        MCPClientManager's `web_search` or `medical_reference` methods, which record
        the call automatically via `record_call`. If the MCP call fails or returns
        an empty string, the method falls back to a static educational response.
        """
        msg_lower = message.lower()
        # Live web‑search for sleep or headache queries
        if "sleep" in msg_lower or "headache" in msg_lower:
            try:
                query = "sleep hygiene and headache"
                result = self.mcp_client.web_search(query)
                if result:
                    return f"[Insight] According to recent health resources: {result}"
            except Exception:
                # Recorded inside MCP manager; fall back to static response
                pass
        # Medical reference lookup for specific terms
        medical_terms = ["blood pressure", "tachycardia", "cholesterol", "glucose", "insulin"]
        for term in medical_terms:
            if term in msg_lower:
                try:
                    result = self.mcp_client.medical_reference(term)
                    if result:
                        return f"[Insight] Reference for {term}: {result}"
                except Exception:
                    pass
        # Fallback static educational content (same as original stub)
        if "heart" in msg_lower or "cardio" in msg_lower or "bp" in msg_lower or "pulse" in msg_lower:
            return (
                "[Insight] The heart is the muscular pump driving the cardiovascular constellation. "
                "During physical exertion, cells demand rapid oxygen delivery. This triggers an autonomic "
                "response increasing cardiac output (both stroke volume and heart rate) to transport oxygenated "
                "hemoglobin from the lungs to active skeletal muscle groups."
        )
        elif "sleep" in msg_lower or "recover" in msg_lower or "rest" in msg_lower:
            return (
                "[Insight] Sleep is regulated by homeostatic sleep drive and the circadian rhythm. "
                "During deep sleep (non-REM stage 3), the body enters an anabolic state, releasing growth "
                "hormone to repair micro‑tears in muscle fibers and clearing metabolic waste from brain tissues "
                "via the glymphatic system."
        )
        elif "diet" in msg_lower or "eat" in msg_lower or "nutrition" in msg_lower or "food" in msg_lower:
            return (
                "[Insight] Nutrition is fuel for the cellular machinery. Macronutrients (carbohydrates, proteins, fats) "
                "are broken down to yield adenosine triphosphate (ATP) via aerobic and anaerobic pathways, supporting "
                "metabolic maintenance, tissue regeneration, and muscular contraction."
            )
        return (
            "[Insight] To help understand your health, it is useful to explore the body as an interconnected system. "
            "Each symptom or physical response has a physiological purpose, typically aiming to maintain homeostatic balance "
            "under changing physical loads or environment."
        )

