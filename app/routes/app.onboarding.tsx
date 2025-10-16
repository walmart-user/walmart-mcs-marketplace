import type { LoaderFunctionArgs } from 'react-router';
import { authenticate } from '../shopify.server';
import WalmartAccountCard from '../pages/onboarding/components/walmart-account/WalmartAccountCard';
import { Page, Box } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function OnboardingPage() {
  return (
    <Page title="Onboarding">
      <Box paddingBlockStart="300">
        <WalmartAccountCard />
      </Box>
    </Page>
  );
}
