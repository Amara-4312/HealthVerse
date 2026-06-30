import os
import sys
import asyncio
from typing import Dict, Any, List

# Local imports
try:
    from agents.guardian import GuardianAgent
    from agents.insight import InsightAgent
    from agents.pulse import PulseAgent
    from agents.vita import VitaAgent
except ImportError:
    from backend.agents.guardian import GuardianAgent
    from backend.agents.insight import InsightAgent
    from backend.agents.pulse import PulseAgent
    from backend.agents.vita import VitaAgent

# Attempt Google ADK imports
try:
    from google.adk.agents import Agent
    ADK_AVAILABLE = True
except ImportError:
    ADK_AVAILABLE = False

class NovaAgent:
    """
    Nova Agent - Coordinator & Orchestrator
    --------------------------------------
    Personality: Warm, calm, curious, encouraging, professional.
    Responsibilities: Orchestrates specialist agents, processes user messages,
    coordinates Stage 1-4 pipeline execution, and synthesizes final insights.
    """
    def __init__(self):
        self.name = "Nova"
        self.instruction = (
            "You are Nova, the primary health companion and orchestrator of HealthVerse. "
            "Your role is to coordinate specialist inputs and synthesize them into a single, warm, "
            "supportive, and easy-to-understand response. Never use overly complex medical jargon, "
            "never diagnose or prescribe, and always maintain an encouraging, positive tone. "
            "Ensure the output reads as a single cohesive conversation, not a list of separate reports."
        )
        self.adk_agent = None

        # Instantiate specialist agents
        self.guardian = GuardianAgent()
        self.insight = InsightAgent()
        self.pulse = PulseAgent()
        self.vita = VitaAgent()

        if ADK_AVAILABLE and (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")):
            try:
                self.adk_agent = Agent(
                    name=self.name,
                    instruction=self.instruction,
                    model="gemini-2.5-flash"
                )
            except Exception:
                pass

    async def coordinate(self, message: str) -> Dict[str, Any]:
        """
        Coordinates the multi-agent system through a 4-stage pipeline:
        Stage 1: Silent safety evaluation (Guardian)
        Stage 2: Specialist Routing Selection
        Stage 3: Parallel Execution
        Stage 4: Nova Synthesis
        """
        activated_agents = []
        collaboration_logs = []
        
        # --- STAGE 1: Safety Scan (Guardian) ---
        guardian_status = await self.guardian.run(message)
        is_emergency = guardian_status.startswith("EMERGENCY")
        
        collaboration_logs.append({
            "agent": "Guardian",
            "action": "Silently scanning query for clinical risk & red flags",
            "status": "SUCCESS",
            "output": guardian_status
        })
        activated_agents.append("Guardian")
        
        # If emergency warning detected, halt and prioritize redirection
        if is_emergency:
            collaboration_logs.append({
                "agent": "Nova",
                "action": "Aborting pipeline: safety threshold triggered",
                "status": "SUCCESS",
                "output": "Redirecting user to emergency healthcare options."
            })
            activated_agents.append("Nova")
            
            emergency_message = (
                "Nova: I am hearing some symptoms that could represent an urgent medical issue. "
                "For your safety, please seek immediate medical attention, call 911 (or your local emergency number), "
                "or go to the nearest emergency room. Your health is the highest priority."
            )
            
            return {
                "response": emergency_message,
                "activated_agents": activated_agents,
                "collaboration_logs": collaboration_logs,
                "disclaimer": "Emergency Alert: Please consult professional services immediately."
            }

        # --- STAGE 2: Specialist Routing ---
        selected_specialists = []
        msg_lower = message.lower()

        # Decide which specialists are relevant
        # Heart / Cardiovascular questions -> Pulse + Insight
        if any(word in msg_lower for word in ["heart", "cardio", "pulse", "bp", "blood pressure", "beat", "run", "aerobic"]):
            selected_specialists.append(self.pulse)
            selected_specialists.append(self.insight)
            
        # Sleep / Recovery / Lifestyle questions -> Vita + Insight
        elif any(word in msg_lower for word in ["sleep", "recover", "rest", "stress", "fatigue", "tire"]):
            selected_specialists.append(self.vita)
            selected_specialists.append(self.insight)
            
        # Nutrition / Diet -> Vita only
        elif any(word in msg_lower for word in ["eat", "diet", "food", "nutrition", "macro", "meal"]):
            selected_specialists.append(self.vita)
            
        # General / Symptoms -> Insight
        else:
            selected_specialists.append(self.insight)

        # Log selection decisions
        selected_names = [s.name for s in selected_specialists]
        collaboration_logs.append({
            "agent": "Nova",
            "action": f"Routed query to relevant specialists: {', '.join(selected_names) if selected_names else 'None'}",
            "status": "SUCCESS",
            "output": f"Activating specialist analysis nodes."
        })
        
        # --- STAGE 3: Parallel Execution ---
        tasks = []
        for specialist in selected_specialists:
            tasks.append(specialist.run(message))
            activated_agents.append(specialist.name)

        specialist_results = []
        if tasks:
            # Gather responses concurrently
            results = await asyncio.gather(*tasks)
            for spec, res in zip(selected_specialists, results):
                specialist_results.append((spec.name, res))
                collaboration_logs.append({
                    "agent": spec.name,
                    "action": f"Executed analysis of query for '{spec.name}' domain",
                    "status": "SUCCESS",
                    "output": res
                })

        # --- STAGE 4: Nova Synthesis ---
        activated_agents.append("Nova")
        reports_summary = "\n".join([f"[{name} Report]: {res}" for name, res in specialist_results])
        
        if self.adk_agent:
            try:
                synthesis_prompt = (
                    f"User asked: '{message}'\n\n"
                    f"Here are the findings from our specialized agents:\n{reports_summary}\n\n"
                    f"Please combine these findings into a unified, supportive response that addresses the user "
                    f"directly. Keep the tone warm and friendly. Explain the concepts simply and provide motivational "
                    f"preventative advice. Do not list the reports separately. Ensure safety guidance is maintained."
                )
                response = await self.adk_agent.run(synthesis_prompt)
                synthesized_text = getattr(response, "text", str(response)).strip()
            except Exception:
                synthesized_text = self._simulate_synthesis(message, specialist_results)
        else:
            synthesized_text = self._simulate_synthesis(message, specialist_results)

        collaboration_logs.append({
            "agent": "Nova",
            "action": "Synthesized specialist responses into unified client message",
            "status": "SUCCESS",
            "output": synthesized_text
        })

        return {
            "response": synthesized_text,
            "activated_agents": activated_agents,
            "collaboration_logs": collaboration_logs,
            "disclaimer": "Disclaimer: HealthVerse is an AI-powered educational companion and does not replace professional medical diagnosis."
        }

    def _simulate_synthesis(self, message: str, specialist_results: List[tuple]) -> str:
        """Simulates Nova's synthesis of specialist insights into a warm cohesive response."""
        reports = {name: content for name, content in specialist_results}
        
        # Build synthesis response text based on which specialists were active
        response_parts = []
        
        if "Insight" in reports:
            # Extract educational details
            insight_clean = reports["Insight"].replace("[Insight] ", "")
            response_parts.append(f"To understand what's happening physiologically: {insight_clean}")
            
        if "Pulse" in reports:
            pulse_clean = reports["Pulse"].replace("[Pulse] ", "")
            response_parts.append(f"Regarding vitals and fitness markers: {pulse_clean}")
            
        if "Vita" in reports:
            vita_clean = reports["Vita"].replace("[Vita] ", "")
            response_parts.append(f"To support your lifestyle: {vita_clean}")

        if not response_parts:
            response_parts.append("I've checked our health database and am ready to explore this system with you. Let me know what specific questions you have about your daily habits or wellness goals!")

        combined_insights = "\n\n".join(response_parts)
        
        return (
            f"Nova: Thanks for asking! I've consulted our specialized health agents to map this to your Health Universe. "
            f"Here is what we gathered:\n\n{combined_insights}\n\n"
            f"Remember, small daily changes are the best way to support your body's constellations. Let me know if you would like "
            f"to explore further!"
        )
