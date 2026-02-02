---
title: "Troubleshooting: .version File Issues"
description: "Solutions for .version file errors including file not found, invalid format, permission denied, and empty file issues"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, version file, errors, file not found, invalid format, permission denied
---

# {{ $frontmatter.title }}

This page covers common issues related to the `.version` file.

## `Error: version file not found at .version`

**Cause**: The `.version` file doesn't exist in the expected location.

**Solutions**:

```bash
# Option 1: Initialize sley
sley init

# Option 2: Create the file manually
echo "0.0.0" > .version

# Option 3: Use --path flag to specify custom location
sley show --path ./custom/.version

# Option 4: Set environment variable
export SLEY_PATH=./custom/.version
sley show

# Option 5: Configure in .sley.yaml
echo "path: ./custom/.version" > .sley.yaml
```

## `Error: invalid version format`

**Cause**: The `.version` file contains invalid content (not a valid semantic version).

**Examples of invalid versions**:

- `v1.2.3` (remove the `v` prefix)
- `1.2` (missing patch number)
- `version-1.2.3` (extra text)
- Empty file
- Multiple lines

**Solutions**:

```bash
# Check current content
cat .version

# Fix: Set a valid version
sley set 1.0.0

# Valid semantic version format: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
# Examples:
# 1.2.3
# 1.2.3-alpha.1
# 1.2.3+build.123
# 1.2.3-beta.2+ci.456
```

## `Error: permission denied`

**Cause**: The `.version` file or its directory is not writable.

**Solutions**:

```bash
# Check file permissions
ls -la .version

# Make file writable
chmod 644 .version

# Check directory permissions (needs write access)
ls -la . | grep -E "^d"

# Fix directory permissions if needed
chmod 755 .
```

## `Error: .version file is empty`

**Cause**: The file exists but has no content.

**Solutions**:

```bash
# Set an initial version
sley set 0.0.0

# Or initialize from existing version source
sley init --migrate
```

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [What is sley?](/guide/what-is-sley) - Understanding the `.version` file
- [Configuration](/config/) - Path configuration options
