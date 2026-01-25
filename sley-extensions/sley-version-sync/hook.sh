#!/bin/sh

# Read JSON input from sley
read -r input

# Get project root from input
project_root=$(echo "$input" | grep -o '"project_root":"[^"]*"' | cut -d'"' -f4)

# Fetch latest release tag from GitHub API
echo "Fetching latest sley release from GitHub..." >&2
latest_release=$(curl -s "https://api.github.com/repos/indaco/sley/releases/latest" | grep -o '"tag_name": *"[^"]*"' | cut -d'"' -f4)

if [ -z "$latest_release" ]; then
    echo '{"success": false, "message": "Failed to fetch latest sley release from GitHub"}'
    exit 1
fi

# Remove 'v' prefix if present (e.g., v0.8.2 -> 0.8.2)
version=$(echo "$latest_release" | sed 's/^v//')

echo "Latest sley version: $version" >&2

# Update .version file
version_file="${project_root}/.version"
echo "$version" > "$version_file"

if [ $? -eq 0 ]; then
    echo "Updated $version_file to $version" >&2
    echo "{\"success\": true, \"message\": \"Synced to sley release $version\", \"data\": {\"version\": \"$version\"}}"
    exit 0
else
    echo '{"success": false, "message": "Failed to write .version file"}'
    exit 1
fi
