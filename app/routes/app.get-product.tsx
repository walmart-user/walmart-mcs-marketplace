import { useFetcher } from 'react-router';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { Page, Card, Button, BlockStack, Box, Text } from '@shopify/polaris';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const query = `#graphql
    query shopifyReactRouterTemplateInventoryItem($id: ID!) {
      inventoryItem(id: $id) {
        id
        inventoryLevels(first: 5) {
          nodes {
            id
            location {
              id
              name
              fulfillmentService { permitsSkuSharing }
            }
            canDeactivate
          }
        }
      }
    }
  `;

  try {
    const resp = await admin.graphql(query, {
      variables: {
        id: 'gid://shopify/InventoryItem/52441303220516',
      },
    });

    const json = await resp.json();

    return { ok: true, status: 200, data: json };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export default function GetProductPage() {
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.state === 'submitting';

  return (
    <Page title="Get product">
      <Card>
        <BlockStack gap="400">
          <Text as="p">
            This page sends a hardcoded Admin GraphQL request to fetch inventory
            levels for a specific InventoryItem.
          </Text>

          <fetcher.Form method="post">
            <Button submit loading={isSubmitting} variant="primary">
              Get product
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
        </BlockStack>
      </Card>
    </Page>
  );
}
