#!/bin/bash

# find-broken-cj.sh
# Searches for hardcoded CJ Dropshipping URLs and connection logic

echo "🔍 STARTING CJ CONNECTION AUDIT..."
echo "=================================="

# 1. Search for hardcoded URL patterns
echo -e "\n[1] Checking for hardcoded CJ URLs (potential 404 sources):"
grep -rnE "https?://(api|app|www)\.cjdropshipping\.com|https?://cjdropshipping\.com/api" . --exclude-dir=node_modules --exclude-dir=dist

# 2. Search for fetch calls likely targeting CJ
echo -e "\n[2] Checking for fetch() calls with hardcoded strings:"
grep -rn "fetch(" . --exclude-dir=node_modules --exclude-dir=dist | grep -v "process.env" | grep -Ei "cj|dropshipping"

# 3. Search for UI Labels
echo -e "\n[3] Locating UI Panel Components:"
grep -rnE "Master Supplier|Establish Connection|Get Credentials" . --exclude-dir=node_modules --exclude-dir=dist

# 4. Search for specific wrong endpoints seen in issues
echo -e "\n[4] Checking for outdated /api2.0 paths (without /v1):"
grep -rn "/api2.0/[^v]" . --exclude-dir=node_modules --exclude-dir=dist

echo -e "\n=================================="
echo "✅ AUDIT COMPLETE"
