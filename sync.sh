#!/usr/bin/env bash

# Load variables from .env if present
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Use defaults if not set
STRAPI_URL="${STRAPI_URL:-http://localhost:1337}"
STRAPI_GITHUB_SYNC_TOKEN="${STRAPI_GITHUB_SYNC_TOKEN:?Missing SYNC_API_TOKEN in .env}"

echo "🔄 Syncing GitHub repos to Strapi at $STRAPI_URL..."

curl -s -o /dev/null -w "%{http_code}\n" \
  -X POST "$STRAPI_URL/api/github/sync" \
  -H "Authorization: Bearer $STRAPI_GITHUB_SYNC_TOKEN" \
  -H "Content-Type: application/json"

echo "✅ Done."
