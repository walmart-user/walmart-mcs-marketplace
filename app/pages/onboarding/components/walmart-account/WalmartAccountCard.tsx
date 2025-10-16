import { Card, Text, Badge, Button, InlineStack, BlockStack } from '@shopify/polaris';

export default function WalmartAccountCard() {
  return (
    <Card roundedAbove='xl'>
      <BlockStack gap="200">
        <InlineStack align="space-between">
          <InlineStack gap="200" align="center">
            <Text as="h2" variant='headingLg'>Walmart account</Text>
            <Badge tone="success" size="large">Connected</Badge>
          </InlineStack>
          <Button variant="secondary" size="micro">Change account</Button>
        </InlineStack>
        
        <BlockStack gap="200">
          <Text as="h1">Name: mpcoee2 test</Text>
          <Text as="h2">ID:10001118203</Text>
          <Text as="h2">Email:mpcoee2@gmail.com</Text>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
