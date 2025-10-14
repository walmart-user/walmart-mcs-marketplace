import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Log request headers
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Clone and log the raw request body
    const requestClone = request.clone();
    const bodyText = await requestClone.text();
    console.log('Request body:', bodyText);
    
    // Process the webhook with Shopify authentication
    const { payload, topic, shop } = await authenticate.webhook(request);
    
    // Log authenticated data
    console.log('Webhook data:', { topic, shop, payload });
    
    // Handle different types of fulfillment notifications
    const { kind } = payload as { kind: string };
    
    switch (kind) {
      case 'FULFILLMENT_REQUEST':
        // TODO: Handle fulfillment request logic
        break;
        
      case 'CANCELLATION_REQUEST':
        // TODO: Handle cancellation request logic
        break;
        
      default:
        console.log(`Unknown notification kind: ${kind}`);
    }
    
    return new Response(JSON.stringify({ 
      status: 'success',
      kind: kind,
      timestamp: new Date().toISOString()
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Fulfillment notification error:', error);
    
    return new Response(JSON.stringify({ 
      status: 'error', 
      error: error instanceof Error ? error.message : String(error)
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
