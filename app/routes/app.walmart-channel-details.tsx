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
            'eyJraWQiOiIyNGE5MDc5YS01YzcyLTQwYjAtOWQyMi1kYzg3ZDAzNWQxM2MiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..DciCs3hAf_zTcunX.uJKudN92a2BDAVXBs0UEFEAxkI1YuqyK_1cgskxMRLfdRBYl3zdZYcV9Bs_9h3BhdIOQBLiEUs735nb_pL6UK97B_emUMadLavmPdKHd6V8yxyEt5nICnRH0yHh3GXjTqsZAm2ouSafUOEWY4JAxAgJ7s7tpoXB3jn5clzmGGwA4-nMbFZgaA4juVJzbRKGyfXN9aZirBmDaLvYhwWYwQPsQbUiG_79JYmJHE7NkoqhkoROVf7Y2rX-JcA_ROFwezJ3sSpoWd1LflE9HE6lDcEkfvopa0qBVH61slOD1pBbP49J2bP_avoxQlWYlNlaicbPH1SvUPif2L4vHBp7XZ8nni7gnV0G9Uo7zyfxiHp_RV-dhReElauG-DEk8oMSxivwUK7dovWjJ-O3Tm4i0vHPdo34du7AU7LqaVaIyobD-xwOTYiTjRyv__RH9NGsdHlvD8zr0hIR6tkoHTLUxuIkzC7GQanLgEfQ9_P4DZeB4p4pQ9PCCh7Bx2Joca26UJesVwOpHC0M--07F_UULesmY-vk9zrBMIMelk71eRD4qZKmguLbMekwFxvsKJI3BfZDTXTKKRSK59LzdPkDltOs182C5xdGAkNl_C5_zBapC9uA_tsH1_Heq2xSm8_0a9lGtY2cAJb0yiaT6kWiYy0dA-q6LXJT760Mk25GKgssSR8jhhq8Ox6lQgh8X.D-BNeY9sbxUaw5FdLR1UUQ',
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
              'eyJraWQiOiIyNGE5MDc5YS01YzcyLTQwYjAtOWQyMi1kYzg3ZDAzNWQxM2MiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..DciCs3hAf_zTcunX.uJKudN92a2BDAVXBs0UEFEAxkI1YuqyK_1cgskxMRLfdRBYl3zdZYcV9Bs_9h3BhdIOQBLiEUs735nb_pL6UK97B_emUMadLavmPdKHd6V8yxyEt5nICnRH0yHh3GXjTqsZAm2ouSafUOEWY4JAxAgJ7s7tpoXB3jn5clzmGGwA4-nMbFZgaA4juVJzbRKGyfXN9aZirBmDaLvYhwWYwQPsQbUiG_79JYmJHE7NkoqhkoROVf7Y2rX-JcA_ROFwezJ3sSpoWd1LflE9HE6lDcEkfvopa0qBVH61slOD1pBbP49J2bP_avoxQlWYlNlaicbPH1SvUPif2L4vHBp7XZ8nni7gnV0G9Uo7zyfxiHp_RV-dhReElauG-DEk8oMSxivwUK7dovWjJ-O3Tm4i0vHPdo34du7AU7LqaVaIyobD-xwOTYiTjRyv__RH9NGsdHlvD8zr0hIR6tkoHTLUxuIkzC7GQanLgEfQ9_P4DZeB4p4pQ9PCCh7Bx2Joca26UJesVwOpHC0M--07F_UULesmY-vk9zrBMIMelk71eRD4qZKmguLbMekwFxvsKJI3BfZDTXTKKRSK59LzdPkDltOs182C5xdGAkNl_C5_zBapC9uA_tsH1_Heq2xSm8_0a9lGtY2cAJb0yiaT6kWiYy0dA-q6LXJT760Mk25GKgssSR8jhhq8Ox6lQgh8X.D-BNeY9sbxUaw5FdLR1UUQ',
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
