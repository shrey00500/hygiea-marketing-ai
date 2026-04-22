// /api/shopify.js
export default async function handler(req, res) {
  try {
    let domain = process.env.VITE_SHOPIFY_DOMAIN || process.env.SHOPIFY_STORE_URL;
    const token = process.env.SHOPIFY_API_TOKEN;

    if (!domain || !token) {
      return res.status(200).json({ 
        error: `Missing Config: Domain=${!!domain}, Token=${!!token}`,
        revenue: "Error",
        orders: "Missing Keys",
        products: []
      });
    }

    // Clean domain
    domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!domain.includes('.')) domain = `${domain}.myshopify.com`;

    // Detect Token Type
    const isAdminToken = token.startsWith('shpat_');
    const endpoint = isAdminToken 
      ? `https://${domain}/admin/api/2024-04/graphql.json`
      : `https://${domain}/api/2024-04/graphql.json`;
    
    const authHeader = isAdminToken ? 'X-Shopify-Access-Token' : 'X-Shopify-Storefront-Access-Token';

    const query = `{
      products(first: 5) {
        edges {
          node {
            id
            title
            variants(first: 1) {
              edges {
                node {
                  price { amount }
                }
              }
            }
          }
        }
      }
    }`;

    console.log(`Detecting ${isAdminToken ? 'Admin' : 'Storefront'} Token. Fetching from: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [authHeader]: token,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(200).json({ 
        error: `Shopify HTTP ${response.status}: ${errorText.substring(0, 100)}`,
        revenue: "Check Token",
        orders: "Failed",
        products: []
      });
    }

    const result = await response.json();
    
    if (result.errors) {
      return res.status(200).json({ 
        error: `GraphQL Error: ${result.errors[0].message}`,
        revenue: "Fix Query",
        orders: "Failed",
        products: []
      });
    }

    const products = result.data?.products?.edges || [];
    const liveProducts = products.map(p => {
      const variant = p.node.variants?.edges[0]?.node;
      return {
        name: p.node.title || "Unknown Product",
        revenue: variant?.price?.amount ? `₹${variant.price.amount}` : "N/A",
        sold: 'Live Sync'
      };
    });

    return res.status(200).json({
      revenue: "Syncing...", 
      orders: "Connected",   
      products: liveProducts
    });

  } catch (err) {
    console.error('CRITICAL BACKEND ERROR:', err);
    return res.status(200).json({ 
      error: `System Error: ${err.message}`,
      revenue: "Crashed",
      orders: "Failed",
      products: []
    });
  }
}