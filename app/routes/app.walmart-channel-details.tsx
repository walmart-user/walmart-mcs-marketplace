import { useFetcher } from 'react-router';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { Page, Card, Button, BlockStack, Box, Text } from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { useCallback, useState } from 'react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);

  try {
    const res = await fetch(
      'https://marketplace.walmartapis.com/v3/fulfillment/orders-fulfillments/channel-details',
      {
        method: 'GET',
        headers: {
          loggedInUser: 'Harsh',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          martId: '202',
          'WM_SEC.ACCESS_TOKEN':
            'eyJraWQiOiIyNGE5MDc5YS01YzcyLTQwYjAtOWQyMi1kYzg3ZDAzNWQxM2MiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..LyF9ggl95uhn-ryM.3mr4wIMMJWU-cO-nN0NsYS6a0IyVKnwc3gIJQN66qXdhqbgm2lczZRL14da5bO0mqyDhA6uF8bKsEwPhzoCaH1Z2ozm8AqUPSQXU5Os_Aqav5mtVG6i6AicvTkXNfrky7RWkgGNCFOFNygfSM1a_siAcUgCjHKaUSf7gxCZXfrO4jvJo9arAsfTaXPp1JzrlVG6eOo6JXaIOvBaPJlwZqJr0XHSpsZSAxlInL6iY8hY96_Idn9iRenrQMxR_pQHLQG0Nib5hO1qmsjlyOZzxhSZNudbraOP2JxByWUtR8WbjmlpqVSYHKJdDJYV_Mbpna3GjJQak8mwOJyH5QK-OALBmPq_s2qyQ0AFqusmv9-XJzqbElJ19KhHN_9I4zJ3XI9kDKQMIn1S_ZatgSTqnlaRJVU-bzYRY2Vk395YHWSy7NRAEOGMpOYi2ds2UPTrLFhCrDI9oynnAQBmfIiNvFpGQ6A7kXNcITmFwkLjm7FBvyuut500wnVpQQvPDt7l-IkEVijbFi47DszSP-G-dE5lC0aOQMFElHYFBQF2LJ2eOpxNbdNdQGUA1bO90UXRcE39ZwibWLptV-UVJASXmTbC0uGkenp84YbjRlwA9n6SAiN2gl70fI8_bn9WynHUSp8tWAK_CGdWm93aC6vhXwMrqyR9cyhWKl4mMP_oP7MqNCmUJqpCyPBogrQWO.81zzPsrs4X0Ao1J-EcZADQ',
          'WM_QOS.CORRELATION_ID': 'Test Update Channel',
          'WM_SVC.NAME': 'Walmart Marketplace',
          wm_mart_id: '202',
        },
      },
    );

    const contentType = res.headers.get('content-type') || '';
    const body = contentType.includes('application/json')
      ? await res.json()
      : await res.text();

    // Server-side logging of the full body
    console.log('[walmart:channel-details]', {
      ok: res.ok,
      status: res.status,
      body,
    });

    return { ok: res.ok, status: res.status, body };
  } catch (error) {
    console.log('[walmart:channel-details:error]', error);
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export default function WalmartChannelDetailsPage() {
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.state === 'submitting';

  const [clientLoading, setClientLoading] = useState(false);
  const [clientData, setClientData] = useState<unknown>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleClientCall = useCallback(async () => {
    setClientLoading(true);
    setClientError(null);
    setClientData(null);
    try {
      const res = await fetch(
        'https://marketplace.walmartapis.com/v3/fulfillment/orders-fulfillments/channel-details',
        {
          method: 'GET',
          headers: {
            loggedInUser: 'Harsh',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            martId: '202',
            'WM_SEC.ACCESS_TOKEN':
              'eyJraWQiOiIyNGE5MDc5YS01YzcyLTQwYjAtOWQyMi1kYzg3ZDAzNWQxM2MiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..LyF9ggl95uhn-ryM.3mr4wIMMJWU-cO-nN0NsYS6a0IyVKnwc3gIJQN66qXdhqbgm2lczZRL14da5bO0mqyDhA6uF8bKsEwPhzoCaH1Z2ozm8AqUPSQXU5Os_Aqav5mtVG6i6AicvTkXNfrky7RWkgGNCFOFNygfSM1a_siAcUgCjHKaUSf7gxCZXfrO4jvJo9arAsfTaXPp1JzrlVG6eOo6JXaIOvBaPJlwZqJr0XHSpsZSAxlInL6iY8hY96_Idn9iRenrQMxR_pQHLQG0Nib5hO1qmsjlyOZzxhSZNudbraOP2JxByWUtR8WbjmlpqVSYHKJdDJYV_Mbpna3GjJQak8mwOJyH5QK-OALBmPq_s2qyQ0AFqusmv9-XJzqbElJ19KhHN_9I4zJ3XI9kDKQMIn1S_ZatgSTqnlaRJVU-bzYRY2Vk395YHWSy7NRAEOGMpOYi2ds2UPTrLFhCrDI9oynnAQBmfIiNvFpGQ6A7kXNcITmFwkLjm7FBvyuut500wnVpQQvPDt7l-IkEVijbFi47DszSP-G-dE5lC0aOQMFElHYFBQF2LJ2eOpxNbdNdQGUA1bO90UXRcE39ZwibWLptV-UVJASXmTbC0uGkenp84YbjRlwA9n6SAiN2gl70fI8_bn9WynHUSp8tWAK_CGdWm93aC6vhXwMrqyR9cyhWKl4mMP_oP7MqNCmUJqpCyPBogrQWO.81zzPsrs4X0Ao1J-EcZADQ',
            'WM_QOS.CORRELATION_ID': 'Test Update Channel',
            'WM_SVC.NAME': 'Walmart Marketplace',
            wm_mart_id: '202',
          },
        },
      );

      const contentType = res.headers.get('content-type') || '';
      const body = contentType.includes('application/json')
        ? await res.json()
        : await res.text();

      setClientData({ ok: res.ok, status: res.status, body });
    } catch (error) {
      setClientError(error instanceof Error ? error.message : String(error));
    } finally {
      setClientLoading(false);
    }
  }, []);

  return (
    <Page title="Walmart channel details">
      <Card>
        <BlockStack gap="400">
          <Text as="p">
            Calls Walmart channel-details endpoint on the server with hardcoded
            headers and logs a minimal summary.
          </Text>

          <fetcher.Form method="post">
            <Button submit loading={isSubmitting} variant="primary">
              Run Walmart call
            </Button>
          </fetcher.Form>

          {fetcher.data && (
            <Box
              padding="400"
              background="bg-surface-active"
              borderWidth="025"
              borderRadius="200"
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                <code>{JSON.stringify(fetcher.data, null, 2)}</code>
              </pre>
            </Box>
          )}

          <Button
            onClick={handleClientCall}
            loading={clientLoading}
            variant="secondary"
          >
            Run Walmart call (client)
          </Button>

          {(clientData || clientError) && (
            <Box
              padding="400"
              background="bg-surface-active"
              borderWidth="025"
              borderRadius="200"
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                <code>
                  {JSON.stringify(
                    clientData ?? { error: clientError },
                    null,
                    2,
                  )}
                </code>
              </pre>
            </Box>
          )}
        </BlockStack>
      </Card>
    </Page>
  );
}
