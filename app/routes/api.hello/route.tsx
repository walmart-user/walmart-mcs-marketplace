import type { LoaderFunctionArgs } from 'react-router';
import { authenticate } from 'app/shopify.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return new Response('hello world', {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};

export default function HelloEndpoint() {
  return null;
}
