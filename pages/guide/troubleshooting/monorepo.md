---
title: "Troubleshooting: Monorepo Issues"
description: "Solutions for monorepo and multi-module errors including no modules found, module not detected, interactive mode, and parallel execution issues"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, monorepo, multi-module, errors, module discovery
---

# {{ $frontmatter.title }}

This page covers common issues when working with monorepos and multi-module projects.

## `Error: no modules found`

**Cause**: No `.version` files exist in subdirectories, or discovery is misconfigured.

**Solutions**:

```bash
# Check for .version files
find . -name ".version"

# Initialize modules
cd packages/api && sley init
cd packages/web && sley init

# Check discovery configuration in .sley.yaml
workspace:
  discovery:
    enabled: true
    recursive: true
    max_depth: 10

# Test discovery
sley modules discover
sley modules list
```

## `Error: module not detected`

**Cause**: Module is excluded by `.sleyignore` or default exclusion patterns.

**Solutions**:

```bash
# Check .sleyignore file
cat .sleyignore

# Default excluded patterns:
# - node_modules
# - .git
# - vendor
# - tmp
# - build
# - dist
# - .cache
# - __pycache__

# Create/edit .sleyignore to un-exclude
!packages/legacy/  # Explicitly include an otherwise excluded path
```

## `Error: interactive mode not working in monorepo`

**Cause**: Running in CI/CD environment or non-interactive terminal.

**Solutions**:

```bash
# For CI/CD, use explicit flags
sley bump patch --all                    # All modules
sley bump patch --module api             # Specific module
sley bump patch --modules api,web        # Multiple modules
sley bump patch --pattern "services/*"   # Pattern match

# For local interactive mode, ensure you have a TTY
# If using Docker:
docker run -it yourimage sley bump patch
```

## `Error: Parallel execution fails for some modules`

**Cause**: Modules have dependencies or conflicts when run simultaneously.

**Solutions**:

```bash
# Option 1: Disable parallel execution
sley bump patch --all  # Runs sequentially by default

# Option 2: Use continue-on-error
sley bump patch --all --continue-on-error

# Option 3: Process modules individually
sley bump patch --module api
sley bump patch --module web

# Option 4: Check for file conflicts
# Ensure modules don't share .version files or modify same files
sley modules list --verbose
```

## `Error: module versions out of sync`

**Cause**: Different modules have drifted to inconsistent versions.

**Solutions**:

```bash
# Check current versions
sley show --all

# Synchronize all modules to the same version
sley set 1.0.0 --all

# Or bump all modules together
sley bump patch --all
```

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [Monorepo Support](/guide/monorepo) - Monorepo configuration guide
- [CI/CD Issues](./ci-cd) - CI/CD-specific issues
