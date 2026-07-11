import type { ChatThread } from "@/types"

export const sampleThreads: ChatThread[] = [
  {
    id: "sample-1",
    title: "API Authentication Setup",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    messages: [
      {
        id: "m1",
        role: "user",
        content: "How do I authenticate with the Reon Capital API?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "m2",
        role: "assistant",
        content: "To authenticate with the Reon Capital API, you'll need an API key. Here's how to get started:\\n\\n1. Get your API key from the dashboard\\n2. Include it in the Authorization header: `Authorization: Bearer YOUR_API_KEY`\\n3. Use our SDKs for automatic token management\\n\\nWould you like me to show you a code example for your preferred language?",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
  },
  {
    id: "sample-2",
    title: "Rate Limiting Best Practices",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      {
        id: "m3",
        role: "user",
        content: "What are the rate limits for the API and how should I handle them?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: "m4",
        role: "assistant",
        content: "Rate limits vary by plan:\\n- Standard: 1000 requests/hour\\n- Premium: 5000 requests/hour\\n- Enterprise: Unlimited\\n\\nBest practices:\\n- Implement exponential backoff\\n- Check rate limit headers\\n- Cache responses when possible\\n- Use webhooks instead of polling\\n\\nOur SDKs handle this automatically!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  },
  {
    id: "sample-3",
    title: "JavaScript SDK Integration",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    messages: [
      {
        id: "m5",
        role: "user",
        content: "Can you show me how to integrate the JavaScript SDK into my React app?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
      {
        id: "m6",
        role: "assistant",
        content: "Sure! Here's a complete example:\\n\\nFirst, install the SDK:\\n```bash\\nnpm install @reon-capital/sdk\\n```\\n\\nThen use it in your React component:\\n```javascript\\nimport { ReonCapital } from '@reon-capital/sdk';\\n\\nconst client = new ReonCapital({\\n  apiKey: process.env.REACT_APP_REON_API_KEY\\n});\\n\\n// In your component\\nconst [users, setUsers] = useState([]);\\n\\nuseEffect(() => {\\n  const fetchUsers = async () => {\\n    try {\\n      const response = await client.users.list();\\n      setUsers(response.data);\\n    } catch (error) {\\n      console.error('Failed to fetch users:', error);\\n    }\\n  };\\n  fetchUsers();\\n}, []);\\n```",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
    ],
  },
]
