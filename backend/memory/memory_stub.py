"""
Memory Module - User History & Profile Customization
---------------------------------------------------
Stub implementation for storing user profiles, wellness goals, 
and short-term conversation context to support continuity across sessions.
"""

class HealthMemory:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.history = []
        self.profile = {
            "goals": ["Improve sleep quality", "Active recovery balance"],
            "preferences": {"notifications": True, "exploration_mode": "visual"}
        }

    def save_message(self, role: str, content: str):
        self.history.append({"role": role, "content": content})

    def get_history(self):
        return self.history

    def get_profile(self) -> dict:
        return self.profile
