import type { HeadersFunction, LoaderFunctionArgs } from 'react-router';
import { Outlet, useLoaderData, useRouteError } from 'react-router';
import { boundary } from '@shopify/shopify-app-react-router/server';
import { AppProvider } from '@shopify/shopify-app-react-router/react';
import { AppProvider as PolarisAppProvider } from '@shopify/polaris';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import enTranslations from '@shopify/polaris/locales/en.json';
import { isLocalDevelopment } from '../config';

import { authenticate } from '../shopify.server';

export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || '' };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  if (isLocalDevelopment) {
    return (
      <AppProvider embedded apiKey={apiKey}>
        <PolarisAppProvider i18n={enTranslations}>
          <s-app-nav>
            <s-link href="/app">Home</s-link>
            <s-link href="/app/additional">Additional page</s-link>
            <s-link href="/app/get-product">Get product</s-link>
            <s-link href="/app/walmart-channel-details">
              Walmart channel details
            </s-link>
            <s-link href="/app/onboarding">Onboarding</s-link>
            <s-link href="/app/sync-catalog">Sync catalog</s-link>
          </s-app-nav>
          <Outlet />
        </PolarisAppProvider>
      </AppProvider>
    );
  }

  return (
    <AppProvider embedded apiKey={apiKey}>
      <PolarisAppProvider i18n={enTranslations}>
        <s-app-nav>
          <s-link href="/app">Home</s-link>
          <s-link href="/app/additional">Additional page</s-link>
          <s-link href="/app/sync-catalog">Sync catalog</s-link>
          <s-link href="/app/get-product">Get product</s-link>
          <s-link href="/app/walmart-channel-details">
            Walmart channel details
          </s-link>
          <s-link href="/app/onboarding">Onboarding</s-link>
        </s-app-nav>
        <Outlet />
      </PolarisAppProvider>
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
