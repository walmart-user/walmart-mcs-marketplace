import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { authenticate } from 'app/shopify.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With',
  };

  // Short-circuit CORS preflight before any auth logic
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow GET on this endpoint for now
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: corsHeaders });
  }

  await authenticate.admin(request);

  return new Response('hello world', {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      ...corsHeaders,
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  return new Response(null, { status: 405, headers: corsHeaders });
};

export default function HelloEndpoint() {
  return null;
}
