---
title: "Monorepo Support"
description: "Manage multiple .version files across monorepos with automatic discovery, interactive selection, and bulk operations for multi-module projects"
head:
  - - meta
    - name: keywords
      content: sley, monorepo, multi-module, workspace, version management, module discovery, bulk operations, parallel execution
---

# {{ $frontmatter.title }}

Manage multiple `.version` files across a monorepo or multi-module project.

::: info Terminology
This documentation uses "monorepo" and "multi-module" interchangeably. A **monorepo** is a repository containing multiple projects/services. A **module** in sley refers to any directory with its own `.version` file.
:::

## Overview

When multiple services, packages, or modules exist in a single repository, each with its own `.version` file, `sley` can detect and operate on all of them automatically.

**Key features:**

- Automatic discovery of `.version` files in subdirectories
- Interactive TUI for selecting which modules to operate on
- Non-interactive flags for CI/CD pipelines
- Parallel execution for faster operations
- Multiple output formats (text, JSON, table)

## Quick Start

```bash
# Bump all modules
sley bump patch --all

# Show versions for all modules
sley show --all

# Bump specific module by name
sley bump patch --module api

# Interactive selection (without flags)
sley bump patch
```

### Discover Modules

The `discover` command recursively scans your project tree to find all `.version` files and manifest files:

```bash
sley discover
# Discovery Results
# Project Type: Multi Module
#
# Version Files (.version):
#   - api (1.2.3) - services/api/.version
#   - web (2.0.0) - apps/web/.version
#   - shared (0.5.1) - packages/shared/.version
#
# Manifest Files:
#   - package.json (2.0.0)
#   - services/api/Cargo.toml (1.2.3)
```

By default, discovery searches up to 3 levels deep for manifest files. For deeply nested structures, increase the search depth:

```bash
sley discover --depth 5
```

## Detection Hierarchy

```text
1. --path flag provided       -> Single-module mode (explicit path)
2. SLEY_PATH env set          -> Single-module mode (env path)
3. .version in current dir    -> Single-module mode (current dir)
4. Multiple .version found    -> Multi-module mode (discovery)
5. No .version file found     -> Error
```

## Module Discovery

### Automatic Discovery

`sley` recursively searches for `.version` files:

```text
my-monorepo/
  services/
    api/.version        # Discovered as "api"
    auth/.version       # Discovered as "auth"
  packages/
    shared/.version     # Discovered as "shared"
```

The module name is derived from the parent directory name.

### Exclude Patterns

Create a `.sleyignore` file to exclude directories:

```text
# .sleyignore
vendor/
node_modules/
testdata/
**/fixtures/
```

Default excluded patterns: `node_modules`, `.git`, `vendor`, `tmp`, `build`, `dist`, `.cache`, `__pycache__`

## Configuration

Configure discovery and modules in `.sley.yaml`:

```yaml
workspace:
  discovery:
    enabled: true
    recursive: true
    module_max_depth: 10 # Max depth for .version file discovery
    manifest_max_depth: 3 # Max depth for manifest file discovery
    exclude:
      - "testdata"
      - "examples"

  # Optional: explicit module definitions (overrides auto-discovery)
  modules:
    - name: api
      path: ./services/api/.version
      enabled: true
    - name: legacy
      path: ./legacy/.version
      enabled: false # Skip this module
```

### Config Inheritance

Module-specific `.sley.yaml` files can override workspace settings:

```yaml
# services/api/.sley.yaml
path: VERSION
plugins:
  commit-parser: false
```

## Interactive Mode

Without `--all` or `--module`, you get an interactive prompt:

```text
Found 3 modules with .version files:
  - api (1.2.3)
  - web (2.0.0)
  - shared (0.5.1)

? How would you like to proceed?
  > Apply to all modules
    Select specific modules...
    Cancel
```

Use `--yes` to auto-select all modules: `sley bump patch --yes`

## Non-Interactive Mode (CI/CD)

```bash
# Operate on all modules
sley bump patch --all

# Operate on specific module by name
sley bump patch --module api

# Operate on multiple modules by name
sley bump patch --modules api,web,shared

# Operate on modules matching a pattern
sley bump patch --pattern "services/*"

# Execution control
sley bump patch --all --parallel          # Run in parallel
sley bump patch --all --continue-on-error # Don't stop on failures
sley bump patch --all --quiet             # Summary only
```

## Output Formats

```bash
sley show --all                  # Text (default)
sley show --all --format json    # JSON array
sley show --all --format table   # ASCII table
```

## CI/CD Integration

`sley` auto-detects CI environments and disables interactive prompts. Use `--all`, `--module`, or `--modules` flags for non-interactive operation.

See [CI/CD Integration](/guide/ci-cd) for full examples with GitHub Actions and GitLab CI.

## Discovery Command

```bash
sley discover                  # Discover all version sources (searches 3 levels deep)
sley discover --depth 5        # Increase search depth for deeply nested projects
sley discover --format json    # JSON output for CI/CD
sley discover --quiet          # Summary only
sley discover --no-interactive # Skip prompts
```

The `discover` command recursively scans the entire project tree for both `.version` files and manifest files (package.json, Cargo.toml, etc.). By default, it searches up to 3 directory levels for manifest files, which is suitable for most projects.

**Auto-Initialization:**

When no `.sley.yaml` exists, `discover` streamlines project setup by:

1. Creating `.sley.yaml` with default plugins (`commit-parser`, `tag-manager`)
2. If sync candidates are found (manifests or module `.version` files), also enabling `dependency-check` plugin with pre-configured file paths
3. Creating `.version` file if it doesn't exist

This eliminates the need to run `sley init` separately after discovery.

For complete flag documentation, see [CLI Reference](/reference/cli#discover).

## Common errors

### `Error: no modules found with .version files`

**Cause:** Module discovery didn't find any `.version` files in the repository.
**Solution:** Ensure `.version` files exist in module directories or check exclusion patterns.

```bash
# Check if .version files exist
find . -name ".version" -type f

# Run discovery to see what sley detects
sley discover

# If files exist but not detected, check .sleyignore
cat .sleyignore

# Verify discovery is enabled in .sley.yaml
workspace:
  discovery:
    enabled: true
    recursive: true
```

### `Error: module "api" not detected`

**Cause:** Specific module is excluded by patterns or discovery settings.
**Solution:** Check exclude patterns and ensure the module path is correct.

```yaml
# In .sley.yaml, verify exclude patterns:
workspace:
  discovery:
    exclude:
      - "testdata"
      - "examples"
      # Remove patterns that might match your module

# Or explicitly define the module:
workspace:
  modules:
    - name: api
      path: ./services/api/.version
      enabled: true
```

### `Error: interactive mode not working in CI/CD`

**Cause:** Interactive prompts are disabled in CI/CD environments.
**Solution:** Use `--all`, `--module`, or `--modules` flags for non-interactive operation.

```bash
# In CI/CD pipelines, use explicit flags:
sley bump patch --all              # All modules
sley bump patch --module api       # Specific module
sley bump patch --modules api,web  # Multiple modules

# Or set CI environment variable
CI=true sley bump patch --all
```

For more troubleshooting help, see the [Troubleshooting Guide](/guide/troubleshooting/).

## Troubleshooting

| Issue                        | Solution                                                              |
| ---------------------------- | --------------------------------------------------------------------- |
| No modules found             | Run `sley discover` to check detection, ensure `.version` files exist |
| Module not detected          | Check `.sleyignore` and exclude patterns                              |
| Interactive mode not working | Use `--all` or `--module` flags in CI/CD                              |
| Permission denied            | Ensure `.version` files are writable (`chmod 644`)                    |

## What's Next?

Choose your path based on your needs:

**Setting up automation?**

- [CI/CD Integration](/guide/ci-cd) - Automate multi-module version bumps
- [Plugin System](/plugins/) - Configure plugins for monorepo workflows
- [Tag Manager](/plugins/tag-manager) - Tag multiple modules

**Advanced configuration?**

- [.sley.yaml Reference](/reference/sley-yaml#workspace-configuration) - Complete workspace configuration
- [Environment Variables](/config/env-vars) - Configure via environment
- [Dependency Check](/plugins/dependency-check) - Sync versions across modules

**Need help?**

- [CLI Reference](/reference/cli#bump) - Multi-module command flags
- [Troubleshooting](/guide/troubleshooting/) - Common issues and solutions
