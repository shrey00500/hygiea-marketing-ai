// /api/shopify.js
export default async function handler(req, res) {
  let domain = process.env.VITE_SHOPIFY_DOMAIN || process.env.SHOPIFY_STORE_URL;
  const token = process.env.SHOPIFY_API_TOKEN;

  if (!domain && !token) {
    return res.status(400).json({ error: 'Missing BOTH Shopify Domain and Token in Vercel Environment Variables.' });
  }
  if (!domain) {
    return res.status(400).json({ error: 'Missing Shopify Domain (VITE_SHOPIFY_DOMAIN or SHOPIFY_STORE_URL) in Vercel.' });
  }
  if (!token) {
    return res.status(400).json({ error: 'Missing Shopify API Token (SHOPIFY_API_TOKEN) in Vercel.' });
  }

  // Clean the domain: remove https:// and append .myshopify.com if it's just a slug
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!domain.includes('.')) {
    domain = `${domain}.myshopify.com`;
  }

  // Use a stable Storefront API endpoint
  const endpoint = `https://${domain}/api/2024-04/graphql.json`;

  const query = `
    {
      products(first: 5) {
        edges {
          node {
            id
            title
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

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
      console.error('Shopify GraphQL Errors:', result.errors);
      return res.status(500).json({ error: result.errors[0].message });
    }

    if (!result.data || !result.data.products) {
      console.error('No data returned from Shopify:', result);
      return res.status(500).json({ error: 'No product data found. Check token permissions.' });
    }

    const liveProducts = result.data.products.edges.map(p => {
      const variant = p.node.variants?.edges[0]?.node;
      const priceAmount = variant?.price?.amount || '0';
      
      return {
        name: p.node.title,
        revenue: `₹${priceAmount}`,
        sold: 'Live Sync'
      };
    });

    return res.status(200).json({
      revenue: "Syncing...", 
      orders: "Connected",   
      products: liveProducts
    });
  } catch (error) {
    console.error('Shopify Backend Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch live data' });
  }
}