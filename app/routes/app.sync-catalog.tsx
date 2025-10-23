import { useEffect } from 'react';
import {
  Page,
  Banner,
  Card,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Badge,
  ButtonGroup,
  Box,
  IndexTable,
  useIndexResourceState,
} from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { LoaderFunctionArgs } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function SyncCatalogPage() {
  const items = mockRows.map((r, i) => ({ id: String(i + 1), ...r }));
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(items);

  // Show Save Bar when selection changes
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shopify: any = (window as unknown as { shopify?: unknown }).shopify;
    shopify?.saveBar?.show?.({
      onSave: () => shopify?.saveBar?.hide?.(),
      onDiscard: () => shopify?.saveBar?.hide?.(),
    });
  }, [selectedResources]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Saving catalog changes...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shopify: any = (window as unknown as { shopify?: unknown }).shopify;
    shopify?.toast?.show?.('Catalog saved successfully');
  };

  const rowMarkup = items.map(({ id, item, gtin, walmartSku }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      position={index}
      selected={selectedResources.includes(id)}
    >
      <IndexTable.Cell>
        <Text as="span">{item}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{gtin}</IndexTable.Cell>
      <IndexTable.Cell>{walmartSku}</IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack align="center" gap="200">
          <Badge tone="success">Mapped</Badge>
          <Button variant="secondary">Add +</Button>
          <Button variant="tertiary">Other SKU</Button>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page title="Sync your catalog">
      <BlockStack gap="400">
        <Banner tone="info">
          Items on draft status are going to be saved. Check the following{' '}
          <a href="#">MCS article</a> if you have any questions about syncing
          your catalog.
        </Banner>

        <form data-save-bar onSubmit={handleFormSubmit}>
          <BlockStack gap="400">
            <Box overflowX="scroll">
              <InlineStack align="space-between">
                <ButtonGroup>
                  <Button pressed>All</Button>
                  <Button>Mapped</Button>
                  <Button>Unmapped</Button>
                </ButtonGroup>
                <InlineStack gap="200">
                  <Button variant="primary" submit>
                    Save
                  </Button>
                  <Button variant="secondary" aria-label="More actions">
                    ⋯
                  </Button>
                </InlineStack>
              </InlineStack>
              <Card>
                <IndexTable
                  resourceName={{ singular: 'item', plural: 'items' }}
                  itemCount={items.length}
                  selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  headings={[
                    { title: 'Item name' },
                    { title: 'GTIN' },
                    { title: 'Walmart SKU' },
                    { title: 'Shopify SKU' },
                  ]}
                >
                  {rowMarkup}
                </IndexTable>
              </Card>
            </Box>

            <InlineStack gap="200">
              <Button variant="primary" submit>
                Save
              </Button>
              <Button variant="secondary">Discard</Button>
            </InlineStack>
          </BlockStack>
        </form>
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
