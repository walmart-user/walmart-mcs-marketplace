import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[/api/hello] Request received:', req.method, req.url);

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
  //   if (req.method === 'OPTIONS') {
  //     return res.status(204).end();
  //   }

  // Handle GET
  if (req.method === 'GET') {
    return res.status(200).send('hello world');
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
