---
title: "Monorepo Support"
description: "Manage multiple .version files across monorepos with automatic discovery, module selection, and bulk operations"
head:
  - - meta
    - name: keywords
      content: sley, monorepo, multi-module, workspace, version management, module discovery, bulk operations
---

# {{ $frontmatter.title }}

Manage multiple `.version` files across a monorepo or multi-module project. Choose one of three versioning models based on how your modules release.

::: info Terminology

- **Module**: A directory with its own `.version` file - the unit of independent versioning
- **Single-root**: One `.version` file at root; all manifests sync to this single source
- **Coordinated versioning**: Multiple `.version` files that sync to root `.version` (one version everywhere)
- **Independent versioning** (workspace): Multiple `.version` files, each versioned independently

:::

## Models at a Glance

| Model           | `.version` Files       | Version Strategy                | Use Case                                           |
| --------------- | ---------------------- | ------------------------------- | -------------------------------------------------- |
| **Single-Root** | One (at root)          | One version for everything      | Single app or library with multiple manifest files |
| **Coordinated** | Multiple (synced)      | One version everywhere          | Modules that always release together               |
| **Independent** | Multiple (independent) | Each module versions separately | Monorepo with independent release cycles           |

## Choosing Your Model

```text
Do you have multiple .version files?
│
├─ NO  → Single-Root
│         One .version at root; dependency-check syncs manifests
│
└─ YES → Do modules need independent versions?
          │
          ├─ NO  → Coordinated Versioning
          │         Root .version is source of truth;
          │         submodule .version files sync to root
          │
          └─ YES → Independent Versioning (Workspace)
                    Each .version is its own source of truth;
                    workspace configuration required
```

## Quick Start Commands

```bash
# Initialize a workspace (creates .sley.yaml + .version files per module)
sley init --yes --workspace

# Discover modules and auto-configure
sley discover

# Show versions for all modules
sley show --all

# Bump all modules
sley bump patch --all

# Tag all modules from workspace root
sley tag create --all

# Bump then tag
sley bump patch --all
sley tag create --all

# Bump a specific module
sley bump patch --module api

# Interactive selection (no flags)
sley bump patch
```

## Module Discovery

`sley` recursively searches for `.version` files starting from the working directory:

```text
my-monorepo/
  services/
    api/.version        # Discovered as "api"
    auth/.version       # Discovered as "auth"
  packages/
    shared/.version     # Discovered as "shared"
```

The module name is derived from the directory containing the `.version` file.

### Exclude Patterns

Exclude directories from discovery using `workspace.discovery.exclude` in `.sley.yaml`:

```yaml
workspace:
  discovery:
    exclude:
      - "testdata"
      - "examples"
      - "fixtures"
```

Or create a `.sleyignore` file (gitignore-style syntax):

```text
# .sleyignore
vendor/
node_modules/
testdata/
**/fixtures/
```

Default excluded patterns: `node_modules`, `.git`, `vendor`, `tmp`, `build`, `dist`, `.cache`, `__pycache__`

## Interactive vs Non-Interactive

Without `--all` or `--module`, commands prompt you to select modules interactively. Use `--yes` to auto-select all, or `--all` / `--module <name>` for CI/CD.

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

All multi-module commands support `--format text|json|table`:

```bash
# JSON output for CI/CD
sley show --all --format json
# [{"name":"root","path":".version","version":"1.0.0"},...]

# Table format
sley show --all --format table
```

## Learn More

- [Configuration](/guide/monorepo/configuration) - Complete setup for each model
- [Versioning Models](/guide/monorepo/versioning-models) - How each model works
- [Workflows](/guide/monorepo/workflows) - Real-world command workflows
- [CLI Reference](/reference/cli#bump) - All flags and options
- [Troubleshooting](/guide/troubleshooting/monorepo) - Common monorepo issues
