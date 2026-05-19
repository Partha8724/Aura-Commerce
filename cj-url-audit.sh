#!/bin/bash

# AURA COMMERCE - CJ DROPSHIPPING URL AUDIT SCRIPT
# This script identifies all CJ URLs and potential routing issues.

LOG_FILE="cj-url-audit.txt"
echo "AURA COMMERCE - CJ URL AUDIT LOG" > $LOG_FILE
echo "Generated on: $(date)" >> $LOG_FILE
echo "========================================" >> $LOG_FILE

echo "[+] SEARCHING FOR CJ DROPSHIPPING URLS..."
grep -rn "cjdropshipping.com" . --exclude-dir={node_modules,dist,.next} --exclude="*.log" --exclude="cj-url-audit.txt" >> $LOG_FILE

echo -e "\n[+] HIGHLIGHTING POTENTIAL WRONG URLS (Hardcoded non-api2.0/v1):" >> $LOG_FILE
grep -rnE "https?://(api|app|www|cdn)?\.?cjdropshipping\.com" . --exclude-dir={node_modules,dist,.next} | grep -v "api2.0/v1" >> $LOG_FILE

echo -e "\n[+] SEARCHING FOR PROXY & GATEWAY HANDLERS:" >> $LOG_FILE
grep -rnE "Aura Proxy|Aura Gateway|cj-proxy|gateway" . --exclude-dir={node_modules,dist,.next} >> $LOG_FILE

echo -e "\n[+] SEARCHING FOR UI BUTTON HANDLERS:" >> $LOG_FILE
grep -rnE "Establish Connection|Master Supplier|Get Credentials" . --exclude-dir={node_modules,dist,.next} >> $LOG_FILE

echo -e "\n[+] SEARCHING FOR FETCH() CALLS TO CJ:" >> $LOG_FILE
grep -rn "fetch(" src --exclude-dir={node_modules,dist,.next} | grep -i "cj" >> $LOG_FILE

echo -e "\n========================================" >> $LOG_FILE
echo "[+] AUDIT COMPLETE. RESULTS SAVED TO $LOG_FILE"
echo "View results with: cat $LOG_FILE"
