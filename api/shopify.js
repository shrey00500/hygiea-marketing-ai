// /api/shopify.js
export default async function handler(req, res) {
  const domain = process.env.VITE_SHOPIFY_DOMAIN;
  const token = process.env.SHOPIFY_API_TOKEN;

  if (!domain || !token) {
    return res.status(200).json({ 
      error: 'Missing Shopify Credentials in Vercel.',
      products: [] 
    });
  }

  // Use the exact version and endpoint requested
  const endpoint = `https://${domain}/api/2026-01/graphql.json`;

  const query = `{
    products(first: 5) {
      edges {
        node {
          id
          title
        }
      }
    }
  }`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return res.status(200).json({ 
        error: result.errors[0].message,
        products: [] 
      });
    }

    const products = result.data?.products?.edges || [];
    const liveProducts = products.map(p => ({
      name: p.node.title,
      revenue: 'Live',
      sold: 'Active'
    }));

    return res.status(200).json({
      revenue: 'Syncing...',
      orders: 'Connected',
      products: liveProducts
    });

  } catch (err) {
    return res.status(200).json({ 
      error: `Fetch Failed: ${err.message}`,
      products: [] 
    });
  }
}