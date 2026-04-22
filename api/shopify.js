// Serverless function to fetch secure Shopify data
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Securely access API key from Vercel Environment Variables
  const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
  const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;

  if (!SHOPIFY_API_KEY || !SHOPIFY_STORE_URL) {
    return res.status(500).json({ error: 'Shopify API key or Store URL not configured in backend.' });
  }

  try {
    // Example: Fetching basic shop data via Shopify Admin API
    const response = await fetch(`https://${SHOPIFY_STORE_URL}/admin/api/2024-01/shop.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API responded with status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    return res.status(500).json({ error: 'Failed to securely fetch Shopify data.' });
  }
}
