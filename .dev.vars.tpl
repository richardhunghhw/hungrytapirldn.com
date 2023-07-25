## Variables set in this file are loaded into HTAppLoadContext on runtime

# Base
NODE_ENV="DEV"
HOST_URL="http://localhost:8788" # URL Path including protocol

SESSION_SECRET="SESSION_SECRET"
ENCRYPTION_SECRET="ENCRYPTION_SECRET"

# Basic Auth
BASIC_AUTH_USERNAME="op://HT-TEST/HT Basic/username"
BASIC_AUTH_PASSWORD="op://HT-TEST/HT Basic/credential"

# Stripe
STRIPE_PUBLIC_KEY="op://HT-TEST/Stripe API Key/username"
STRIPE_SECRET_KEY="op://HT-TEST/Stripe API Key/credential"

# Notion 
NOTION_API_SECRET="op://HT-TEST/Notion API Secret - Store/credential"

NOTION_API_DB_GENERAL="op://HT-TEST/Notion API Secret - Store/Databases/General"
NOTION_API_DB_BLOG="op://HT-TEST/Notion API Secret - Store/Databases/Blog"
NOTION_API_DB_FAQ="op://HT-TEST/Notion API Secret - Store/Databases/FAQ"
NOTION_API_DB_PRODUCT="op://HT-TEST/Notion API Secret - Store/Databases/Product"

CACHE_TTL_DAYS=14