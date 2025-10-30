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
            'eyJraWQiOiIyNGE5MDc5YS01YzcyLTQwYjAtOWQyMi1kYzg3ZDAzNWQxM2MiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..8A3xOE2uGWuvKg_O.OZOF8PGSqvA1IsdgHuixLgmit0caUg5PO7GF1RrjFhMQyvUf-ouQb0QbWrmflK5BZTkrz38zZCEKhZI8D-jUsBy9PeddPCNRkVE-JBVJw0BowUGYvAkt-5GqoZXxRV4Er5iJoo7Tv3Ydmsh4UZ8L6Xf_j4ofTDagmux4GWC2UfUKgdriQeIxro17FtG5_c9xPDy_3sRNhICUqyz_JVPkB7LqXFzV-YbI90T1OqnWP9eHAMNVJXBDUrYEgRk7XT-kjGqBnoHj_HBUxXD8oLi9pV2dq16DVYmzsOrcwnZ_ODdqA_9295_jAqF7Tpznr5c484h7UlQhZiM_yb68n2LhNO5tuhRGfw7QRZalJGCLLhLHJcRvNraCwNhhnaV_yJN_4vmclexkqFafFml_VY-h_ZvVDsGs2F1TlFeVixFzq6fnsP7NBQbm81lNtlx0sP5kWfk_flQH3km6403wzuzAl0kSPSFhZL6mIeNEgvT2hT7CoAFidyrvwNxDHncSHGFd9VXPU5V8ImIl0ABUaMzAWFdNUKlTxDdsoki-itk1j1Gd4_XBEUIgmDAUfbiLVnfqmEkMNGjnxAeGR5mh0BSr5Qo8mYHWqJsQFZROKUZD6zbvRY8KEi9uOoXsv1Uw84kJP3SDkbmKjr3ICCxtPqCztTKYfWmKgE2l11f34S8e2nGEUj90irpODV1XYy3N.4kOmV21pnoLGO_B7V0whMQ',
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
              'eyJraWQiOiIyNGE5MDc5YS01YzcyLTQwYjAtOWQyMi1kYzg3ZDAzNWQxM2MiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..8A3xOE2uGWuvKg_O.OZOF8PGSqvA1IsdgHuixLgmit0caUg5PO7GF1RrjFhMQyvUf-ouQb0QbWrmflK5BZTkrz38zZCEKhZI8D-jUsBy9PeddPCNRkVE-JBVJw0BowUGYvAkt-5GqoZXxRV4Er5iJoo7Tv3Ydmsh4UZ8L6Xf_j4ofTDagmux4GWC2UfUKgdriQeIxro17FtG5_c9xPDy_3sRNhICUqyz_JVPkB7LqXFzV-YbI90T1OqnWP9eHAMNVJXBDUrYEgRk7XT-kjGqBnoHj_HBUxXD8oLi9pV2dq16DVYmzsOrcwnZ_ODdqA_9295_jAqF7Tpznr5c484h7UlQhZiM_yb68n2LhNO5tuhRGfw7QRZalJGCLLhLHJcRvNraCwNhhnaV_yJN_4vmclexkqFafFml_VY-h_ZvVDsGs2F1TlFeVixFzq6fnsP7NBQbm81lNtlx0sP5kWfk_flQH3km6403wzuzAl0kSPSFhZL6mIeNEgvT2hT7CoAFidyrvwNxDHncSHGFd9VXPU5V8ImIl0ABUaMzAWFdNUKlTxDdsoki-itk1j1Gd4_XBEUIgmDAUfbiLVnfqmEkMNGjnxAeGR5mh0BSr5Qo8mYHWqJsQFZROKUZD6zbvRY8KEi9uOoXsv1Uw84kJP3SDkbmKjr3ICCxtPqCztTKYfWmKgE2l11f34S8e2nGEUj90irpODV1XYy3N.4kOmV21pnoLGO_B7V0whMQ',
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
