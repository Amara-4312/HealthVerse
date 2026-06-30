export interface CollaborationStep {
  agent: string;
  action: string;
  status: string;
}

export interface ChatResponse {
  response: string;
  agents_consulted: string[];
  collaboration_logs: CollaborationStep[];
  disclaimer: string;
}

export interface ChatRequest {
  user_id: string;
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function sendChatMessage(userId: string, message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      message: message,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
