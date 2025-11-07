import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const {
    i18n,
    data,
    extension: { target },
  } = shopify;
  console.log({ data });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://walmart-mcs-marketplace.vercel.app/api/hello',
        );
        const text = await res.text();
        if (!cancelled) setResult(text);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Request failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <s-admin-block heading="My Block Extension">
      <s-stack direction="block">
        <s-text type="strong">{i18n.translate('welcome', { target })}</s-text>
        {loading && <s-text>Loading…</s-text>}
        {error && <s-text tone="critical">Error: {String(error)}</s-text>}
        {result && <s-text>Response: {result}</s-text>}
      </s-stack>
    </s-admin-block>
  );
}
