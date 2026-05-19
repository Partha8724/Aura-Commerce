#!/bin/bash

# cj-audit.sh
# Comprehensive audit of CJ Dropshipping integration

echo "🔍 AUDITING CJ DROPSHIPPING INTEGRATION"
echo "======================================="

echo -e "\n[1] HARCODED URLS (Searching for cjdropshipping.com):"
grep -rn "cjdropshipping.com" . --exclude-dir=node_modules --exclude-dir=dist --exclude=cj-audit.sh

echo -e "\n[2] PROXY & GATEWAY USAGE:"
grep -rnE "proxy|gateway|cj-proxy|Aura Proxy" . --exclude-dir=node_modules --exclude-dir=dist --exclude=cj-audit.sh

echo -e "\n[3] UI BUTTONS & LABELS:"
grep -rnE "Establish Connection|Master Supplier|Get Credentials" . --exclude-dir=node_modules --exclude-dir=dist --exclude=cj-audit.sh

echo -e "\n[4] FETCH CALLS (potential raw calls):"
grep -rn "fetch(" src --exclude-dir=node_modules --exclude-dir=dist | grep -v "process.env"

echo -e "\n[5] ENVIRONMENT VARIABLE USAGE (CJ_):"
grep -rn "CJ_" . --exclude-dir=node_modules --exclude-dir=dist --exclude=cj-audit.sh

echo -e "\n======================================="
echo "✅ AUDIT COMPLETE"
