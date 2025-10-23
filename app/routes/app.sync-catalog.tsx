import { useCallback, useState } from 'react';
import {
  Page,
  Banner,
  Card,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Badge,
  DataTable,
  ButtonGroup,
  Box,
} from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { LoaderFunctionArgs } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function SyncCatalogPage() {
  // Programmatic Save Bar control
  const showSaveBar = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shopify: any = (window as unknown as { shopify?: unknown }).shopify;
    shopify?.saveBar?.show?.({
      onSave: () => shopify?.saveBar?.hide?.(),
      onDiscard: () => shopify?.saveBar?.hide?.(),
    });
  }, []);

  const [selected, setSelected] = useState<boolean[]>(() =>
    mockRows.map(() => false),
  );

  const toggleRow = (rowIndex: number, checked: boolean) => {
    setSelected((prev) => {
      const next = [...prev];
      next[rowIndex] = checked;
      return next;
    });
    showSaveBar();
  };

  const rows = mockRows.map((r, idx) => [
    <input
      key={`cb-${idx}`}
      type="checkbox"
      checked={selected[idx]}
      onChange={(e) => toggleRow(idx, e.currentTarget.checked)}
    />,
    <Text key={`item-${idx}`} as="span">
      {r.item}
    </Text>,
    r.gtin,
    r.walmartSku,
    <InlineStack key={`actions-${idx}`} align="center" gap="200">
      <Badge tone="success">Mapped</Badge>
      <Button variant="secondary" onClick={showSaveBar}>
        Add +
      </Button>
      <Button variant="tertiary">Other SKU</Button>
    </InlineStack>,
  ]);

  return (
    <Page title="Sync your catalog">
      <BlockStack gap="400">
        <Banner tone="info">
          Items on draft status are going to be saved. Check the following{' '}
          <a href="#">MCS article</a> if you have any questions about syncing
          your catalog.
        </Banner>

        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <ButtonGroup>
                <Button pressed>All</Button>
                <Button>Mapped</Button>
                <Button>Unmapped</Button>
              </ButtonGroup>
              <InlineStack gap="200">
                <Button variant="primary" onClick={showSaveBar}>
                  Save
                </Button>
                <Button variant="secondary" aria-label="More actions">
                  ⋯
                </Button>
              </InlineStack>
            </InlineStack>

            <Box overflowX="scroll">
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text', 'text']}
                headings={[
                  '',
                  'Item name',
                  'GTIN',
                  'Walmart SKU',
                  'Shopify SKU',
                ]}
                rows={rows}
              />
            </Box>

            <InlineStack gap="200">
              <Button variant="primary" onClick={showSaveBar}>
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const shopify: any = (
                    window as unknown as { shopify?: unknown }
                  ).shopify;
                  shopify?.saveBar?.hide?.();
                }}
              >
                Discard
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

const mockRows = [
  {
    item: 'Gadget Pro 3000',
    gtin: '0123456789012',
    walmartSku: 'Gadget Pro 3000 - Shopify SKU',
  },
  {
    item: 'Widget Xtreme',
    gtin: '2345678901234',
    walmartSku: 'Widget Xtreme - Shopify SKU',
  },
  {
    item: 'ToolMaster 500',
    gtin: '3456789012345',
    walmartSku: 'ToolMaster 500 - Shopify SKU',
  },
  {
    item: 'Gizmo 2.0',
    gtin: '4567890123456',
    walmartSku: 'Gizmo 2.0 - Shopify SKU',
  },
  {
    item: 'Device Alpha',
    gtin: '5678901234567',
    walmartSku: 'Device Alpha - Shopify SKU',
  },
  {
    item: 'Gadgetron 9000',
    gtin: '6789012345678',
    walmartSku: 'Gadgetron 9000 - Shopify SKU',
  },
  {
    item: 'Widgetizer 4.5',
    gtin: '7890123456789',
    walmartSku: 'Widgetizer 4.5 - Shopify SKU',
  },
  {
    item: 'ToolBox Deluxe',
    gtin: '8901234567890',
    walmartSku: 'ToolBox Deluxe - Shopify SKU',
  },
  {
    item: 'Gizmo Pro Max',
    gtin: '9012345678901',
    walmartSku: 'Gizmo Pro Max - Shopify SKU',
  },
  {
    item: 'Device Beta',
    gtin: '0123456789012',
    walmartSku: 'Device Beta - Shopify SKU',
  },
];
