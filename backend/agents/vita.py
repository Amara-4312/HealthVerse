import os
import sys

try:
    from google.adk.agents import Agent
    ADK_AVAILABLE = True
except ImportError:
    ADK_AVAILABLE = False

class VitaAgent:
    """
    Vita Agent - Lifestyle & Wellness Coach
    --------------------------------------
    Personality: Optimistic, supportive, motivational, friendly.
    Responsibilities: Guides users on sleep hygiene, physical training, nutrition,
    hydration, stress reduction, and building incremental daily wellness habits.
    """
    def __init__(self):
        self.name = "Vita"
        self.instruction = (
            "You are Vita, the Lifestyle & Wellness Coach of HealthVerse. "
            "You focus on empowering the user. Provide highly motivational, positive, and practical "
            "coaching on daily habits, including: hydration tips, diet/macros guidance, sleep routines, "
            "exercise progressions, and breathing/mindfulness exercises. Be encouraging and friendly!"
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
        if "heart" in msg_lower or "cardio" in msg_lower or "run" in msg_lower or "exercise" in msg_lower:
            return (
                "[Vita] Running is an amazing way to strengthen your cardiovascular system and boost mood! "
                "For great results, try integrating 2-3 structured runs a week, beginning with a dynamic warm-up. "
                "Always pair your runs with deep, steady hydration (about 250ml water 30 mins before) and ensure "
                "you listen to your body if it asks for a rest day. You're doing great!"
            )
        elif "sleep" in msg_lower or "recover" in msg_lower or "rest" in msg_lower:
            return (
                "[Vita] Quality recovery is where the magic happens! To optimize sleep, aim for a consistent wind-down "
                "routine: dim the screens 1 hour before bed, keep your sleeping space cool and dark, and try 5 minutes "
                "of light diaphragmatic breathing. Waking up refreshed starts with a positive bedtime ritual!"
            )
        elif "diet" in msg_lower or "eat" in msg_lower or "nutrition" in msg_lower or "food" in msg_lower:
            return (
                "[Vita] Fueling your body is all about balance and nourishment! Try focusing on whole, colorful foods. "
                "Incorporate a good protein source after your activities to support muscle synthesis, and don't forget "
                "electrolytes (like potassium and magnesium) from leafy greens and bananas. Small steps create big results!"
            )
        return (
            "[Vita] Every day is a fresh opportunity to build healthy, active habits! Focus on small, sustainable "
            "changes like taking a 10-minute walk after lunch, drinking an extra glass of water, or pausing for "
            "three deep breaths when stress rises. You've got this!"
        )
