# Typhoon API Client Implementation

## Overview

This project now uses Typhoon API instead of GPT-4o with the following specifications:

```typescript
typhoon = openai("typhoon-v2.1-12b-instruct", {
  baseURL: "https://api.opentyphoon.ai/v1",
  apiKey: "sk-VL6FVfEvqs8uY4fo5CfiKqnG6Wy2Kf2jwrXC3HQjGEPemPmR",
})
```

## Configuration

The Typhoon client is configured with the following parameters:

- **Base URL**: `https://api.opentyphoon.ai/v1`
- **Model**: `typhoon-v2.1-12b-instruct`
- **API Key**: `sk-VL6FVfEvqs8uY4fo5CfiKqnG6Wy2Kf2jwrXC3HQjGEPemPmR`
- **Temperature**: `0.7`
- **Top P**: `0.9`
- **Max Tokens**: `2048`
- **Repetition Penalty**: `1.1`
- **Request Timeout**: `60` seconds

## Usage

### Basic Usage

```typescript
import { typhoon, isTyphoonConfigured } from "@/lib/typhoon-client"
import { streamText } from "ai"

// Check if Typhoon is configured
if (!isTyphoonConfigured()) {
  console.error("Typhoon API not configured")
  return
}

// Use the client for streaming responses
const result = streamText({
  model: typhoon,
  messages: [
    {
      role: "system",
      content: "You are a helpful AI assistant."
    },
    {
      role: "user",
      content: "Hello, how are you?"
    }
  ],
  temperature: 0.7,
})
```

### Direct API Call

```typescript
import { typhoonChatCompletion } from "@/lib/typhoon-client"

const response = await typhoonChatCompletion([
  {
    role: "system",
    content: "You are a helpful AI assistant."
  },
  {
    role: "user",
    content: "Explain RAG (Retrieval-Augmented Generation)"
  }
], {
  temperature: 0.7,
  maxTokens: 2048
})

console.log(response.choices[0].message.content)
```

## Environment Variables

The Typhoon API key is currently hardcoded in the client, but you can move it to environment variables:

```env
TYPHOON_API_KEY=sk-VL6FVfEvqs8uY4fo5CfiKqnG6Wy2Kf2jwrXC3HQjGEPemPmR
```

## Integration with Chat API

The Typhoon client is integrated into the chat API route (`app/api/chat/route.ts`) and will automatically use Typhoon API when properly configured.

## Error Handling

The implementation includes proper error handling for:
- Missing API keys
- Invalid Typhoon configuration
- Network timeouts
- API rate limits

## Files Modified

1. **`lib/typhoon-client.ts`** - New file containing the Typhoon client implementation
2. **`app/api/chat/route.ts`** - Updated to use the new Typhoon client
3. **`examples/typhoon-usage.ts`** - Example usage patterns
4. **`docs/typhoon-client.md`** - This documentation file

## Testing

To test the Typhoon client:

1. Ensure the API key is valid
2. Run the development server: `npm run dev`
3. Test the chat functionality in the web interface
4. Check console logs for any configuration issues

## Migration from GPT-4o

The system has been completely migrated to use only Typhoon API:
- ✅ Removed all GPT-4o and Azure references
- ✅ Updated client configuration
- ✅ Updated chat API route
- ✅ Updated error handling
- ✅ Created new examples
- ✅ Updated documentation 