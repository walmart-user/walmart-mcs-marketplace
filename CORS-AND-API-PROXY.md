# CORS and API Proxy Pattern for Shopify Admin Block Extensions

## Table of Contents

1. [Problem Overview](#problem-overview)
2. [Understanding CORS](#understanding-cors)
3. [Why React Router Doesn't Work](#why-react-router-doesnt-work)
4. [Solution: Vercel Serverless Functions](#solution-vercel-serverless-functions)
5. [API Proxy Pattern](#api-proxy-pattern)
6. [Implementation Examples](#implementation-examples)
7. [Deployment Considerations](#deployment-considerations)

---

## Problem Overview

When a Shopify Admin Block Extension (running in the browser on `https://extensions.shopifycdn.com`) tries to call an external API, it encounters CORS (Cross-Origin Resource Sharing) errors.

### The Error

```
Access to fetch at 'https://your-app.vercel.app/api/hello'
from origin 'https://extensions.shopifycdn.com' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## Understanding CORS

### What is CORS?

CORS is a **browser security policy** that restricts web pages from making requests to a different domain than the one serving the web page.

### Key Concepts

1. **Cross-Origin Request**: Browser → Different Domain API
   - ❌ Requires CORS headers from the API
   - Browser enforces the restriction
2. **Server-to-Server Request**: Your Server → Any API
   - ✅ No CORS restrictions
   - No browser involved

### CORS Preflight (OPTIONS Request)

For requests with custom headers (like `Authorization`), browsers send a "preflight" OPTIONS request first:

```
1. Browser sends OPTIONS request
   ↓
2. Server must respond with CORS headers
   ↓
3. If successful (204), browser sends actual GET/POST
   ↓
4. Server responds with data + CORS headers
```

**Required CORS Headers:**

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

---

## Why React Router Doesn't Work

### The Problem

React Router (used in this Shopify app) **rejects OPTIONS requests** before your code runs:

```
Error: Invalid request method "OPTIONS"
  at getInternalRouterError
  at Object.query
  at handleDocumentRequest
```

### What We Tried (Didn't Work)

```typescript
// app/routes/api.hello/route.tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // This code NEVER runs for OPTIONS requests!
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  // ...
};
```

React Router throws an error **before** the loader executes, making it impossible to handle OPTIONS.

---

## Solution: Vercel Serverless Functions

### Why Serverless Functions Work

Vercel serverless functions bypass React Router entirely and give you full control over HTTP methods.

### File Structure

```
/api/hello.ts              ← Vercel serverless function (handles CORS properly)
/api/walmart-proxy.ts      ← Vercel serverless function (proxy to external APIs)
/app/routes/app.*.tsx      ← React Router (for Shopify embedded pages with auth)
```

### Example: Simple API with CORS

```typescript
// /api/hello.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[/api/hello] Request received:', req.method);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With',
  };

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Handle GET
  if (req.method === 'GET') {
    return res.status(200).send('hello world');
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
```

### How Vercel Routes Requests

Vercel automatically detects files in `/api/*.ts` and deploys them as separate serverless functions:

```
https://your-app.vercel.app/api/hello → /api/hello.ts
https://your-app.vercel.app/app       → React Router
```

---

## API Proxy Pattern

### The Problem

Admin Block extensions need to call external APIs (e.g., Walmart APIs) that don't support CORS.

### Two Approaches

#### ❌ Direct Call (Fails with CORS)

```
Admin Block (browser)
  ↓ fetch('https://walmart-api.com/...')
  ❌ CORS Error: No 'Access-Control-Allow-Origin' header
```

#### ✅ Proxy Pattern (Works!)

```
Admin Block (browser)
  ↓ fetch('https://your-app.vercel.app/api/walmart-proxy') with CORS ✅
Your Proxy Function (Node.js server)
  ↓ fetch('https://walmart-api.com/...') server-to-server ✅
Walmart API
  ↓ response
Your Proxy (adds CORS headers)
  ↓ response with CORS ✅
Admin Block receives data ✅
```

### Benefits of Proxy Pattern

1. **No CORS Issues**: Server-to-server calls bypass browser CORS
2. **Security**: Hide API keys/tokens on server-side
3. **Control**: Add logging, rate limiting, caching, transformation
4. **Flexibility**: External API doesn't need CORS support

### Drawbacks

1. **Extra Hop**: Slightly slower (additional network call)
2. **Server Resources**: Uses serverless execution time/bandwidth

---

## Implementation Examples

### Example 1: Simple Proxy to External API

```typescript
// /api/walmart-proxy.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[/api/walmart-proxy] Request received');

  // CORS headers for Admin Block
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With',
  };

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Server-to-server call to Walmart API (no CORS!)
  try {
    const walmartRes = await fetch(
      'https://marketplace.walmartapis.com/v3/fulfillment/orders-fulfillments/channel-details',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'WM_SEC.ACCESS_TOKEN': process.env.WALMART_API_TOKEN || '',
          // ... other headers
        },
      },
    );

    const data = await walmartRes.json();
    return res.status(walmartRes.status).json(data);
  } catch (error) {
    console.error('[/api/walmart-proxy] Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Request failed',
    });
  }
}
```

### Example 2: Admin Block Calling the Proxy

```jsx
// extensions/hello-world-test/src/BlockExtension.jsx
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function Extension() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        // Call YOUR proxy API (with CORS support)
        const res = await fetch(
          'https://your-app.vercel.app/api/walmart-proxy',
        );
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Request failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <s-admin-block heading="Walmart Integration">
      <s-stack direction="block">
        {loading && <s-text>Loading...</s-text>}
        {error && <s-text tone="critical">Error: {error}</s-text>}
        {data && <s-text>Data: {JSON.stringify(data)}</s-text>}
      </s-stack>
    </s-admin-block>
  );
}
```

### Example 3: Comparison - Server vs Client Calls

```typescript
// app/routes/app.walmart-channel-details.tsx

// ✅ Method 1: Server-side (NO CORS issues)
export const action = async ({ request }: ActionFunctionArgs) => {
  // This runs on your Node.js server
  const res = await fetch('https://marketplace.walmartapis.com/...');
  // Server-to-server = NO CORS restrictions
  return { data: await res.json() };
};

// ❌ Method 2: Client-side (CORS error)
const handleClientCall = async () => {
  // This runs in the user's browser
  const res = await fetch('https://marketplace.walmartapis.com/...');
  // Browser → Walmart API = CORS required, will fail!
};
```

---

## Deployment Considerations

### For Vercel (POC/Testing)

1. Create `/api/*.ts` files
2. Install dependencies: `npm install --save-dev @vercel/node`
3. Deploy: `git push` (Vercel auto-deploys)
4. Vercel automatically routes `/api/*` to serverless functions

### For Walmart Infrastructure (Production)

The same pattern works, just different hosting:

```
Admin Block (Shopify CDN)
  ↓ CORS-enabled fetch
Your App (Walmart's Node.js servers)
  ↓ /api/walmart-proxy endpoint
Walmart Internal APIs (internal network, no CORS needed)
```

**Key Points:**

- Server-to-server calls on internal network are even faster
- Still need CORS headers on responses to Admin Block (browser)
- Same code, different deployment target

### When to Use Each Approach

| Use Case                    | Approach                                 | Why                             |
| --------------------------- | ---------------------------------------- | ------------------------------- |
| Admin Block → Your API      | Vercel Serverless Function (`/api/*.ts`) | Handles CORS properly           |
| Admin Block → External API  | Proxy Pattern (`/api/proxy.ts`)          | Bypass CORS, hide credentials   |
| Embedded Page → Shopify API | React Router (`/app/routes/`)            | Built-in Shopify auth           |
| Server → Any API            | Either (prefer serverless for APIs)      | No CORS issues server-to-server |

---

## Summary

### The Core Problem

- **CORS is a browser policy**, not a server restriction
- Admin Blocks run in the browser and are subject to CORS
- React Router rejects OPTIONS requests before your code runs

### The Solution

- Use **Vercel serverless functions** (`/api/*.ts`) for CORS-enabled APIs
- Use the **proxy pattern** to call external APIs without CORS support
- Keep React Router routes for Shopify-authenticated embedded pages

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Shopify Admin Block (Browser)                              │
│  extensions/hello-world-test/src/BlockExtension.jsx         │
└─────────────────────┬───────────────────────────────────────┘
                      │ fetch with CORS
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  Your App (Vercel/Walmart Servers)                          │
│                                                              │
│  /api/hello.ts          ← Direct API (CORS enabled)         │
│  /api/walmart-proxy.ts  ← Proxy to external APIs            │
│                                                              │
│  /app/routes/app.*.tsx  ← React Router (embedded pages)     │
└─────────────────────┬───────────────────────────────────────┘
                      │ server-to-server (no CORS)
                      ↓
┌─────────────────────────────────────────────────────────────┐
│  External APIs (Walmart, etc.)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## References

- [MDN: Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Shopify Admin Block Extensions](https://shopify.dev/docs/apps/admin/extensions)
