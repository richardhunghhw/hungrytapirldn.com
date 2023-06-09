# Base
NODE_ENV="DEV"
SESSION_SECRET="SESSION_SECRET"
ENCRYPTION_SECRET="ENCRYPTION_SECRET"

# Feature Toggles
CONTENT_STORE_CACHE_ENABLED=false # Set false to true to bypass content-store KV cache and query Notion API on each request

# Host
HOST_URL="http://localhost:8788" # URL Path including protocol

# Stripe
STRIPE_PUBLIC_KEY="op://HT-TEST/Stripe API Key/username"
STRIPE_SECRET_KEY="op://HT-TEST/Stripe API Key/credential"

# Notion NOTION_API_DB_BLOG
NOTION_API_SECRET="op://HT-TEST/Notion API Secret - Store/credential"

NOTION_API_DB_BLOG="op://HT-TEST/Notion API Secret - Store/Databases/Blog"
NOTION_API_DB_FAQ="op://HT-TEST/Notion API Secret - Store/Databases/FAQ"
NOTION_API_DB_PRODUCT="op://HT-TEST/Notion API Secret - Store/Databases/Product"
