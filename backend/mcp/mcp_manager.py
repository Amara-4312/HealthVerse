# backend/mcp/mcp_manager.py
"""MCP Manager
Provides stub implementations for external MCP services used by agents.
The real implementation would invoke actual MCP server tools via the MCP protocol.
For the demo we simulate calls with simple HTTP requests and graceful fallback.
"""
import json
import logging
from typing import List, Dict

import requests

_logger = logging.getLogger(__name__)

# Simple in‑memory log of MCP calls for the current request.
# The FastAPI endpoint will reset this after each request.
_last_calls: List[Dict[str, str]] = []


def record_call(tool: str, query: str) -> None:
    """Record a call made to an MCP tool.
    Args:
        tool: Name of the MCP tool (e.g., "web_search").
        query: The query string sent to the tool.
    """
    _last_calls.append({"tool": tool, "query": query})


def get_last_calls() -> List[Dict[str, str]]:
    """Return a copy of the calls made during the current request."""
    return list(_last_calls)


def reset_calls() -> None:
    """Clear the call log – to be invoked at the start of each request."""
    _last_calls.clear()


class MCPClientManager:
    """High‑level client used by agents to fetch live information.

    The methods encapsulate the concrete MCP calls. In this scaffold we use
    public HTTP APIs as stand‑ins, but the signatures mirror what a real MCP
    server would expose.
    """

    def __init__(self, timeout: int = 5):
        self.timeout = timeout
        self.session = requests.Session()
        # Typical user‑agent header – some services reject default Python UA.
        self.session.headers.update({"User-Agent": "HealthVerse/0.1"})

    # ---------------------------------------------------------------------
    # Web‑search style lookup – used by Insight and Pulse for up‑to‑date health
    # education content.
    # ---------------------------------------------------------------------
    def web_search(self, query: str) -> str:
        """Perform a lightweight web‑search.

        For the prototype we call the Wikipedia REST search endpoint because it
        returns concise, citation‑ready snippets without requiring a commercial
        API key. The function returns the first paragraph of the most relevant
        article or a fallback message.
        """
        record_call("web_search", query)
        try:
            resp = self.session.get(
                "https://en.wikipedia.org/api/rest_v1/page/summary/" + requests.utils.quote(query),
                timeout=self.timeout,
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("extract", "No summary available.")
        except Exception as exc:
            _logger.warning("Web‑search MCP call failed: %s", exc)
            return ""

    # ---------------------------------------------------------------------
    # Medical reference lookup – used by Insight for terminology and by Vita for
    # evidence‑based guidance.
    # ---------------------------------------------------------------------
    def medical_reference(self, query: str) -> str:
        """Retrieve a concise medical reference.

        The demo uses the NIH MedlinePlus API (open and free). If the request
        fails, we return an empty string.
        """
        record_call("medical_reference", query)
        try:
            resp = self.session.get(
                "https://rxnav.nlm.nih.gov/REST/InteractionSearch/clinical?searchTerm=" + requests.utils.quote(query),
                timeout=self.timeout,
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("interactionTypeGroup", [{}])[0].get("interactionType", [{}])[0].get(
                "description", ""
            )
        except Exception as exc:
            _logger.warning("Medical reference MCP call failed: %s", exc)
            return ""
