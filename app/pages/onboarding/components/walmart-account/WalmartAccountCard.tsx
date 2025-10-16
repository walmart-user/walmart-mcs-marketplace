import { Card, Text, Badge, Button, InlineStack, BlockStack } from '@shopify/polaris';

export default function WalmartAccountCard() {
  return (
    <Card roundedAbove='xl'>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <InlineStack gap="200" align="center">
            <Text as="h1" variant='headingXl'>Walmart account</Text>
            <Badge tone="success">Connected</Badge>
          </InlineStack>
          <Button variant="secondary">Change account</Button>
        </InlineStack>
        
        <BlockStack gap="200">
          <Text as="h1"><strong>Name:</strong> mpcoee2 test</Text>
          <Text as="h2"><strong>ID:</strong>10001118203</Text>
          <Text as="h2"><strong>Email:</strong>mpcoee2@gmail.com</Text>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
