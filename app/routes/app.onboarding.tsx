import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import WalmartAccountCard from "../pages/onboarding/components/walmart-account/WalmartAccountCard";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function OnboardingPage() {
  return (
    <s-page heading="Onboarding">
        <WalmartAccountCard />
    </s-page>
  );
}
