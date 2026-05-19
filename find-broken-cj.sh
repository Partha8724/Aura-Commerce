#!/bin/bash

# find-broken-cj.sh
# Searches for hardcoded CJ Dropshipping URLs and connection logic inconsistencies.

LOG_FILE="cj-url-audit.txt"
echo "AURA COMMERCE - CJ URL AUDIT LOG" > $LOG_FILE
echo "Generated on: $(date)" >> $LOG_FILE
echo "========================================" >> $LOG_FILE

echo "[+] SEARCHING FOR HARDCODED CJ DROPSHIPPING URLS..." >> $LOG_FILE
# Search for patterns like api.cjdropshipping.com or cjdropshipping.com/api (wrong urls)
grep -rnE "https?://(api|app|www|cdn)?\.?cjdropshipping\.com" . \
    --exclude-dir={node_modules,dist,.next} \
    --exclude="*.log" \
    --exclude="src/lib/cj-api.ts" \
    --exclude="cj-url-audit.txt" >> $LOG_FILE

echo -e "\n[+] HIGHLIGHTING WRONG URL PATTERNS (Should be using CJ_BASE_URL):" >> $LOG_FILE
grep -rnE "https?://(api|app|www)\.cjdropshipping\.com" . --exclude-dir={node_modules,dist,.next} >> $LOG_FILE

echo -e "\n[+] SEARCHING FOR UI PANEL KEYS AND LABELS:" >> $LOG_FILE
grep -rnE "Master Supplier|Establish Connection|Get Credentials|Authorization Key" . --exclude-dir={node_modules,dist,.next} >> $LOG_FILE

echo -e "\n[+] CHECKING FOR RAW fetch() CALLS TO CJ:" >> $LOG_FILE
# Find fetch calls that contain 'cj' or 'dropshipping' in the same file
grep -rn "fetch(" . --exclude-dir={node_modules,dist,.next} | grep -Ei "cj|dropshipping" >> $LOG_FILE

echo -e "\n[+] CHECKING ENVIRONMENT VARIABLE USAGE:" >> $LOG_FILE
grep -rnE "CJ_BASE_URL|CJ_API_KEY|CJ_EMAIL" . --exclude-dir={node_modules,dist,.next} >> $LOG_FILE

echo -e "\n========================================" >> $LOG_FILE
echo "[+] AUDIT COMPLETE. RESULTS SAVED TO $LOG_FILE"
