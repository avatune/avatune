# Avatune Cloudflare Worker

API endpoint for generating avatar SVGs on-demand.

## Setup

### 1. Create KV Namespace

```bash
cd apps/cloudflare-worker
npx wrangler kv:namespace create RATE_LIMIT
```

Copy the ID from the output and update `wrangler.jsonc`:

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "RATE_LIMIT",
      "id": "YOUR_KV_NAMESPACE_ID_HERE"
    }
  ]
}
```

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` - Create at https://dash.cloudflare.com/profile/api-tokens
  - Permissions: Account.Workers Scripts (Edit), Account.Workers KV Storage (Edit)
- `CLOUDFLARE_ACCOUNT_ID` - Find at https://dash.cloudflare.com → Workers → Overview

### 3. Deploy

Push to main branch to trigger automatic deployment via GitHub Actions.

Or deploy manually:

```bash
bun run deploy
```

## Rate Limiting

The worker enforces rate limits per IP + User-Agent:

- **100 requests per hour**
- **1000 requests per day**

Limits reset automatically via KV TTL expiration.

Exceeded requests return:
- Status: `429 Too Many Requests`
- Header: `Retry-After: 3600`

## API Usage

```
GET /?theme=yanliu&size=200&seed=123
```

### Parameters

- `theme` - Theme name (yanliu, nevmstas, miniavs, micah)
- `size` - Avatar size in pixels (default: theme default)
- `seed` - Random seed for avatar generation
- Plus any theme-specific parameters (hair, eyes, backgroundColor, etc.)

### Response

- Success: SVG image with `Cache-Control: public, max-age=31536000, immutable`
- Rate limited: JSON with error details

## Local Development

```bash
bun run dev
```

Opens worker at http://localhost:8787
