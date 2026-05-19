#!/bin/bash

# fix-imports.sh
# Diagnostic script to find and report legacy Vite-style environment variable access.

echo "🔍 Searching for import.meta.env across the project..."
echo "--------------------------------------------------------"

# Find all files with import.meta.env
files=$(grep -rIl "import.meta.env" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist)

if [ -z "$files" ]; then
  echo "✅ No files found using import.meta.env correctly."
else
  echo "⚠️  Found potential issues in the following files:"
  echo "$files"
  echo "--------------------------------------------------------"
  
  for file in $files; do
    echo "FILE: $file"
    grep -n "import.meta.env" "$file"
    echo ""
  done
  
  echo "RECOMMENDED ACTION:"
  echo "Replace 'import.meta.env.VITE_VARIABLE' with 'process.env.NEXT_PUBLIC_VARIABLE'"
fi

echo "--------------------------------------------------------"
echo "Done."
