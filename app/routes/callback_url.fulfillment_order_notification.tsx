import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { payload, topic, shop } = await authenticate.webhook(request);
    console.log(`Received fulfillment notification from ${shop}`);
    
    // Handle different types of fulfillment notifications
    const { kind } = payload as { kind: string };
    
    switch (kind) {
      case 'FULFILLMENT_REQUEST':
        console.log(`Processing fulfillment request for ${shop}`);
        // TODO: Handle fulfillment request logic
        break;
        
      case 'CANCELLATION_REQUEST':
        console.log(`Processing cancellation request for ${shop}`);
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
