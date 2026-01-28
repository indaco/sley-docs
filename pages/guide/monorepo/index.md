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

::: tip What You'll Learn
This guide helps you choose the right versioning strategy for your project:

- **Single-Root**: One version for a single app/library with multiple manifests
- **Coordinated Versioning**: One version across multiple modules that release together
- **Independent Versioning**: Different versions for modules that release independently

By the end, you'll know which model fits your needs and how to get started.
:::

::: info Terminology

- **Module**: A directory with its own `.version` file - the unit of independent versioning
- **Single-root**: One `.version` file at root; all manifests sync to this single source
- **Coordinated versioning**: Multiple `.version` files that sync to root `.version` (one version everywhere)
- **Independent versioning** (workspace): Multiple `.version` files, each versioned independently
- **Monorepo**: A repository containing multiple projects - versioning strategy depends on your needs

:::

## Overview

`sley` supports **three versioning models** for managing versions in projects with multiple modules:

| Model                      | `.version` Files       | Version Strategy                         | Use Case                                        |
| -------------------------- | ---------------------- | ---------------------------------------- | ----------------------------------------------- |
| **Single-Root**            | One (at root)          | One version for everything               | Single app/library with multiple manifest files |
| **Coordinated Versioning** | Multiple (synced)      | One version everywhere (submodules sync) | Multiple modules that always release together   |
| **Independent Versioning** | Multiple (independent) | Each module has its own version          | Monorepo with modules released independently    |

::: tip Quick Check
Run `sley discover` in your project root. If multiple `.version` files are found, you'll be prompted to choose your versioning strategy:

- **Coordinated versioning** - Keep one version, sync all `.version` files to root
- **Independent versioning** - Each module versions independently (workspace mode)
- **Single root** - Keep only root `.version`, ignore submodule ones
  :::

## Choosing Your Versioning Model

Use this decision tree to choose the right model:

```text
Do you have multiple .version files?
│
├─ NO → Use Single-Root
│        ├─ One .version at root
│        └─ dependency-check syncs manifests
│
└─ YES → Do modules need independent versions?
         │
         ├─ NO → Use Coordinated Versioning
         │        ├─ Root .version is source of truth
         │        ├─ Submodule .version files sync to root
         │        └─ All modules always have same version
         │
         └─ YES → Use Independent Versioning (Workspace)
                  ├─ Each .version is independent source
                  ├─ Modules can have different versions
                  └─ workspace configuration required
```

### Decision Guide

| Question                                     | Answer | Recommended Model          |
| -------------------------------------------- | ------ | -------------------------- |
| Do you have multiple `.version` files?       | No     | **Single-Root**            |
| All modules always release together?         | Yes    | **Coordinated Versioning** |
| Modules released independently?              | Yes    | **Independent Versioning** |
| Need `.version` files for technical reasons? | Yes    | **Coordinated Versioning** |
| (e.g., Go embed, Vite plugins)               |        |                            |

## Quick Start Commands

Once you've chosen your model, here are the key commands:

```bash
# Bump all modules (independent versioning)
sley bump patch --all

# Show versions for all modules
sley show --all

# Bump specific module by name
sley bump patch --module api

# Bump pre-release for specific module
sley bump pre --module web

# Bump pre-release for all modules
sley bump pre --all

# Interactive selection (without flags)
sley bump patch

# Coordinated versioning (just bump root)
sley bump patch  # Syncs automatically via dependency-check
```

## Learn More

::: tip Explore Further

**Ready to implement?** Jump to configuration and workflows:

- [Configuration Examples](/guide/monorepo/configuration) - Complete setup for each model
- [Practical Workflows](/guide/monorepo/workflows) - Real-world usage examples

**Want to understand deeply?** Start with concepts:

- [Versioning Models Deep Dive](/guide/monorepo/versioning-models) - How each model works internally

**Need specific help?**

- [CLI Reference](/reference/cli#bump) - Complete command documentation
- [Troubleshooting](/guide/troubleshooting/) - Common issues and solutions
  :::

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

## Interactive Mode

Without `--all` or `--module`, you get an interactive prompt to select modules. Use `--yes` to auto-select all modules.

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

All commands support multiple output formats for integration with scripts and CI/CD:

```bash
# Text format (default, human-readable)
sley show --all
# Output:
#   ✓ root (.version): 1.0.0
#   ✓ web (apps/web/.version): 0.5.0-beta.1
#   ✓ core (packages/core/.version): 3.2.1

# JSON format (machine-readable)
sley show --all --format json
# [
#   {"name":"root","path":".version","version":"1.0.0"},
#   {"name":"web","path":"apps/web/.version","version":"0.5.0-beta.1"},
#   {"name":"core","path":"packages/core/.version","version":"3.2.1"}
# ]

# Table format (structured view)
sley show --all --format table
# ┌──────┬─────────────────────┬──────────────┐
# │ Name │ Path                │ Version      │
# ├──────┼─────────────────────┼──────────────┤
# │ root │ .version            │ 1.0.0        │
# │ web  │ apps/web/.version   │ 0.5.0-beta.1 │
# │ core │ packages/core/...   │ 3.2.1        │
# └──────┴─────────────────────┴──────────────┘
```

## Discovery Command

```bash
sley discover                  # Discover all version sources and auto-configure
sley discover --format json    # JSON output for CI/CD
```

The `discover` command scans for `.version` files and manifest files. When multiple `.version` files are found, it prompts you to choose a versioning model and automatically creates `.sley.yaml` with the appropriate configuration.

For complete documentation and all flags, see [CLI Reference](/reference/cli#discover).

## Troubleshooting

Common issues like module discovery errors, interactive mode problems in CI/CD, and sync failures are covered in the [Troubleshooting Guide](/guide/troubleshooting/).

## Common Questions

**Multiple `.version` files with same version?** Use [coordinated versioning](/guide/monorepo/versioning-models#model-2-coordinated-versioning) to sync all files to root.

**Multiple packages, one version?** Use [single-root](/guide/monorepo/versioning-models#model-1-single-root) if you have one `.version` file, or [coordinated versioning](/guide/monorepo/versioning-models#model-2-coordinated-versioning) if you need multiple `.version` files.

**Independent module versions?** Use [independent versioning](/guide/monorepo/versioning-models#model-3-independent-versioning-workspace) (workspace mode).

For more Q&A, see [Versioning Models](/guide/monorepo/versioning-models) or [Troubleshooting](/guide/troubleshooting/).
