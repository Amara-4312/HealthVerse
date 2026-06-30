import os
import sys

# Attempt Google ADK imports
try:
    # pyrefly: ignore [missing-import]
    from google.adk.agents import Agent
    ADK_AVAILABLE = True
except ImportError:
    ADK_AVAILABLE = False

class GuardianAgent:
    """
    Guardian Agent - Safety Supervisor
    ---------------------------------
    Personality: Silent, strict, safety-focused.
    Responsibilities: Silently scans the conversation for high-risk clinical symptoms or emergencies
    (e.g., chest pain, respiratory distress, suicidal ideation, anaphylaxis, severe bleeding) and
    forces a redirect to professional emergency care when triggered.
    """
    def __init__(self):
        self.name = "Guardian"
        self.instruction = (
            "You are Guardian, the safety supervisor of HealthVerse. "
            "You inspect the user conversation for urgent medical emergency warning signs "
            "(e.g., chest pain, severe breathing difficulty, loss of consciousness, stroke, suicidal ideation, "
            "severe allergic reaction, uncontrolled bleeding). "
            "If an emergency warning sign is present, output: 'EMERGENCY: <brief reason>'. "
            "If no warning signs are present, output: 'SAFE'."
        )
        self.adk_agent = None
        
        # Initialize Google ADK agent if credentials are available
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
        """
        Runs the safety check on the user message.
        Returns 'SAFE' or 'EMERGENCY: <details>'
        """
        if self.adk_agent:
            try:
                response = await self.adk_agent.run(message)
                return getattr(response, "text", str(response)).strip()
            except Exception:
                # Fall back to simulated parsing if API fails
                return self._simulate(message)
        else:
            return self._simulate(message)

    def _simulate(self, message: str) -> str:
        """High-fidelity local rule-based safety parser."""
        msg_lower = message.lower()
        emergencies = {
            "chest pain": "severe cardiovascular symptom (chest pain)",
            "heart attack": "suspected cardiac event",
            "shortness of breath": "respiratory distress (shortness of breath)",
            "cannot breathe": "severe respiratory failure",
            "stroke": "suspected neurological stroke emergency",
            "numbness": "neurological distress indicator",
            "suicid": "mental health crisis / suicidal ideation",
            "kill myself": "mental health emergency",
            "allergic": "anaphylaxis / severe allergic reaction risk",
            "bleeding": "severe uncontrolled hemorrhage risk",
            "unconscious": "loss of consciousness"
        }
        for trigger, reason in emergencies.items():
            if trigger in msg_lower:
                return f"EMERGENCY: {reason} detected."
        return "SAFE"
