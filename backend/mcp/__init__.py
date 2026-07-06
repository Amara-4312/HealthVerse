# MCP package initialization
from .mcp_manager import MCPClientManager, MCPClientManager as MCPManager, record_call, reset_calls, get_last_calls

__all__ = ["MCPClientManager", "record_call", "reset_calls", "get_last_calls"]
