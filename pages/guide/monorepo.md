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

- **Module**: A directory with its own `.version` file - the unit of independent versioning
- **Single-root**: One `.version` file at root; all manifests sync to this single source
- **Coordinated versioning**: Multiple `.version` files that sync to root `.version` (one version everywhere)
- **Independent versioning** (workspace): Multiple `.version` files, each versioned independently
- **Monorepo**: A repository containing multiple projects - versioning strategy depends on your needs

:::

## Overview

`sley` supports **three versioning models** for managing versions in projects with multiple modules:

| Model                        | `.version` Files      | Version Strategy                           | Use Case                                           |
| ---------------------------- | --------------------- | ------------------------------------------ | -------------------------------------------------- |
| **Single-Root**              | One (at root)         | One version for everything                 | Single app/library with multiple manifest files    |
| **Coordinated Versioning**   | Multiple (synced)     | One version everywhere (submodules sync)   | Multiple modules that always release together      |
| **Independent Versioning**   | Multiple (independent)| Each module has its own version            | Monorepo with modules released independently       |

::: tip Quick Check
Run `sley discover` in your project root. If multiple `.version` files are found, you'll be prompted to choose your versioning strategy:
- **Coordinated versioning** - Keep one version, sync all `.version` files to root
- **Independent versioning** - Each module versions independently (workspace mode)
- **Single root** - Keep only root `.version`, ignore submodule ones
:::

## Understanding Versioning Models

`sley` supports three distinct versioning models, each designed for different project structures:

### Model 1: Single-Root

A project with ONE `.version` file that serves as the single source of truth:

```text
my-project/
├── .version           # Source of truth (1.2.3)
├── package.json       # Syncs TO .version
├── Cargo.toml         # Syncs TO .version
└── Chart.yaml         # Syncs TO .version
```

**How it works:**

- The `.version` file is the authoritative source
- Manifest files (package.json, Cargo.toml, etc.) are sync targets
- Use the `dependency-check` plugin to keep manifests synchronized with `.version`
- When you bump `.version` to 1.2.4, all manifest files update automatically

**Use case:** A single application or library (Node.js app, Rust crate, Go module, etc.)

### Model 2: Coordinated Versioning

Multiple `.version` files exist for technical reasons (Go embed, Vite plugins), but you want ONE version everywhere:

```text
my-project/
├── .version           # Source of truth (1.2.3)
├── package.json       # Syncs TO root .version
├── services/
│   ├── api/
│   │   ├── .version   # Syncs TO root .version
│   │   └── main.go    # Embeds api/.version (for Go)
│   └── web/
│       ├── .version   # Syncs TO root .version
│       └── vite.config.js  # Reads web/.version
└── packages/
    └── shared/
        ├── .version   # Syncs TO root .version
        └── package.json  # Syncs TO root .version
```

**How it works:**

- Root `.version` is the single source of truth
- Submodule `.version` files sync TO root `.version` via `dependency-check`
- Manifest files also sync TO root `.version`
- Bumping root `.version` propagates to all files
- All components always have the same version

**Use case:** Multi-module projects where all components release together with the same version number, but technical constraints require multiple `.version` files (e.g., Go embed, Vite plugins)

### Model 3: Independent Versioning (Workspace)

A project with MULTIPLE `.version` files, each versioned independently:

```text
my-monorepo/
├── services/
│   ├── api/
│   │   ├── .version       # Independent source (2.1.0)
│   │   └── Cargo.toml     # Syncs TO api/.version
│   └── auth/
│       ├── .version       # Independent source (1.5.3)
│       └── package.json   # Syncs TO auth/.version
└── packages/
    └── shared/
        ├── .version       # Independent source (3.0.1)
        └── package.json   # Syncs TO shared/.version
```

**How it works:**

- Each module has its own `.version` file as its independent source of truth
- Each module can have its own manifest files that sync to ITS `.version`
- Use `workspace` configuration to manage multiple modules
- Each module can have its own `dependency-check` configuration
- Modules are versioned and released independently

**Use case:** Microservices architecture, multi-package monorepo with independent release cycles

### Key Distinctions

Understanding sync direction is critical:

**Single-Root:**
```text
package.json ──┐
Cargo.toml   ──┼──▶ .version (SOURCE)
Chart.yaml   ──┘
```

**Coordinated Versioning:**
```text
                     ┌──▶ api/.version (TARGET)
                     │
.version (SOURCE) ───┼──▶ web/.version (TARGET)
                     │
                     └──▶ shared/.version (TARGET)
```

**Independent Versioning:**
```text
api/.version (SOURCE) ◀── api/package.json
web/.version (SOURCE) ◀── web/package.json
shared/.version (SOURCE) ◀── shared/package.json
```

**Important:** In **coordinated versioning**, submodule `.version` files ARE sync targets (this is the exception). In **independent versioning**, each `.version` file is a source of truth.

## Detection and Mode Selection

```text
1. --path flag provided       -> Single-root mode (explicit path)
2. SLEY_PATH env set          -> Single-root mode (env path)
3. .version in current dir    -> Single-root mode (current dir)
4. Multiple .version found    -> Prompt for versioning model:
                                 - Coordinated versioning
                                 - Independent versioning (workspace)
                                 - Single root (ignore submodules)
5. No .version file found     -> Error
```

When multiple `.version` files are detected, `sley discover` prompts you to choose your versioning strategy. Your choice determines the configuration that gets generated in `.sley.yaml`.

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

| Question                                       | Answer       | Recommended Model          |
| ---------------------------------------------- | ------------ | -------------------------- |
| Do you have multiple `.version` files?         | No           | **Single-Root**            |
| All modules always release together?           | Yes          | **Coordinated Versioning** |
| Modules released independently?                | Yes          | **Independent Versioning** |
| Need `.version` files for technical reasons?   | Yes          | **Coordinated Versioning** |
| (e.g., Go embed, Vite plugins)                 |              |                            |

## Quick Start

Now that you understand the versioning models, here are the key commands:

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

## Command Examples by Versioning Model

Understanding how `show`, `set`, and `doctor` commands work across different versioning models:

### Single-Root Commands

In single-root projects, commands operate on the single `.version` file:

```bash
# Show current version
$ sley show
1.0.0

# Set version manually
$ sley set 2.0.0

# Validate version file and configuration
$ sley doctor
Configuration Validation:
  ✓ [PASS] YAML Syntax
  ✓ [PASS] Plugin Configuration

Version File Validation:
  ✓ [PASS] .version exists and is valid (2.0.0)
```

### Coordinated Versioning Commands

In coordinated versioning, use `--all` to view all synced modules (all have the same version):

```bash
# Show all synced modules
$ sley show --all
Version Summary
  ✓ coordinated-versioning (.version): 2.0.0
  ✓ api (services/api/.version): 2.0.0
  ✓ web (services/web/.version): 2.0.0

# Set all modules to new version
$ sley set 2.1.0 --all
Set version to 2.1.0
  ✓ coordinated-versioning (.version): 2.0.0 -> 2.1.0
  ✓ api (services/api/.version): 2.0.0 -> 2.1.0
  ✓ web (services/web/.version): 2.0.0 -> 2.1.0

# Validate all modules
$ sley doctor --all
Configuration Validation:
  ✓ [PASS] YAML Syntax
  ✓ [PASS] Plugin Configuration

Validation Summary
  ✓ coordinated-versioning (.version): 2.1.0
  ✓ api (services/api/.version): 2.1.0
  ✓ web (services/web/.version): 2.1.0
```

### Independent Versioning Commands

In independent versioning, each module has its own version:

```bash
# Show all module versions
$ sley show --all
  ✓ root (.version): 1.0.0
  ✓ web (apps/web/.version): 0.5.0-beta.1
  ✓ core (packages/core/.version): 3.2.1
  ✓ utils (packages/utils/.version): 2.0.0

# Show specific module version
$ sley show --module core
3.2.1

# Set specific module version
$ sley set 4.0.0 --module core
  ✓ core (packages/core/.version): 3.2.1 -> 4.0.0

# Set all modules to same version (rare use case)
$ sley set 1.0.0 --all
  ✓ root (.version): 1.0.0 -> 1.0.0
  ✓ web (apps/web/.version): 0.5.0-beta.1 -> 1.0.0
  ✓ core (packages/core/.version): 4.0.0 -> 1.0.0
  ✓ utils (packages/utils/.version): 2.0.0 -> 1.0.0

# Validate all modules
$ sley doctor --all
Configuration Validation:
  ✓ [PASS] YAML Syntax
  ✓ [PASS] Plugin Configuration

Validation Summary
  ✓ root (.version): 1.0.0
  ✓ web (apps/web/.version): 1.0.0
  ✓ core (packages/core/.version): 1.0.0
  ✓ utils (packages/utils/.version): 1.0.0

# Validate specific module
$ sley doctor --module web
Configuration Validation:
  ✓ [PASS] YAML Syntax
  ✓ [PASS] Plugin Configuration

Version File Validation:
  ✓ web (apps/web/.version): 1.0.0
```

### Output Formats

All commands support multiple output formats for integration with scripts and CI/CD:

```bash
# Text format (default, human-readable)
$ sley show --all
  ✓ root (.version): 1.0.0
  ✓ web (apps/web/.version): 0.5.0-beta.1
  ✓ core (packages/core/.version): 3.2.1

# JSON format (machine-readable)
$ sley show --all --format json
[
  {"name":"root","path":".version","version":"1.0.0"},
  {"name":"web","path":"apps/web/.version","version":"0.5.0-beta.1"},
  {"name":"core","path":"packages/core/.version","version":"3.2.1"}
]

# Table format (structured view)
$ sley show --all --format table
┌──────┬─────────────────────┬──────────────┐
│ Name │ Path                │ Version      │
├──────┼─────────────────────┼──────────────┤
│ root │ .version            │ 1.0.0        │
│ web  │ apps/web/.version   │ 0.5.0-beta.1 │
│ core │ packages/core/...   │ 3.2.1        │
└──────┴─────────────────────┴──────────────┘
```

## Configuration

Configuration depends on your chosen versioning model:

### Single-Root Configuration

```yaml
# .sley.yaml
path: .version

plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
      - path: Cargo.toml
        field: package.version
        format: toml
```

### Coordinated Versioning Configuration

```yaml
# .sley.yaml (root)
path: .version

plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      # Sync manifest files to root
      - path: package.json
        field: version
        format: json

      # Sync submodule .version files to root
      - path: services/api/.version
        format: raw
      - path: services/web/.version
        format: raw
      - path: packages/shared/.version
        format: raw
```

With this configuration, bumping the root `.version` automatically updates all submodule `.version` files and manifest files.

### Coordinated Versioning Workflow

Once configured, coordinated versioning is completely automatic. Simply bump the root version without any flags:

```bash
# Bump root version - automatically syncs all configured files
$ sley bump patch

Sync dependencies
  ✓ api (services/api/.version): 2.0.1
  ✓ web (services/web/.version): 2.0.1
  ✓ package.json (package.json): 2.0.1
  ✓ web/package.json (services/web/package.json): 2.0.1

Success: Version bumped to 2.0.1 and synced to 4 file(s)

# Bump pre-release - also syncs automatically
$ sley bump pre --label beta

Sync dependencies
  ✓ api (services/api/.version): 2.0.1-beta.1
  ✓ web (services/web/.version): 2.0.1-beta.1
  ✓ package.json (package.json): 2.0.1-beta.1
  ✓ web/package.json (services/web/package.json): 2.0.1-beta.1

Success: Version bumped to 2.0.1-beta.1 and synced to 4 file(s)

# Set pre-release label with standalone pre command
$ sley pre rc

Sync dependencies
  ✓ api (services/api/.version): 2.0.1-rc
  ✓ web (services/web/.version): 2.0.1-rc
  ✓ package.json (package.json): 2.0.1-rc
  ✓ web/package.json (services/web/package.json): 2.0.1-rc

Success: Pre-release set to 2.0.1-rc and synced to 4 file(s)
```

**Key points:**

- No need for `--all` flag - the dependency-check plugin handles syncing automatically
- All configured files (both `.version` files and manifest files) update in one operation
- The root `.version` remains the single source of truth
- Pre-release versions sync automatically with both `bump pre` and the standalone `pre` command (see [Pre-release Versions](/guide/pre-release#multi-module-projects))

### Independent Versioning Configuration (Workspace)

```yaml
# .sley.yaml (root)
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

### Config Inheritance (Independent Versioning)

Module-specific `.sley.yaml` files can override workspace settings:

```yaml
# services/api/.sley.yaml
path: .version
plugins:
  commit-parser: false
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
```

## Migrating Between Models

You can switch versioning models at any time by updating your `.sley.yaml` configuration.

### From Single-Root to Coordinated Versioning

1. Create `.version` files in submodules where needed
2. Copy the version from root `.version` to all submodule `.version` files
3. Update `.sley.yaml` to add submodule `.version` files to `dependency-check`:

```yaml
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      # Add submodule .version files
      - path: services/api/.version
        format: raw
      - path: services/web/.version
        format: raw
```

### From Coordinated to Independent Versioning

1. Remove submodule `.version` files from `dependency-check` configuration
2. Add `workspace` configuration:

```yaml
workspace:
  discovery:
    enabled: true
    recursive: true
```

3. Create module-specific `.sley.yaml` files if needed
4. Update submodule versions independently using `sley bump --module <name>`

### From Independent to Coordinated Versioning

1. Decide which version will be the canonical version (usually the highest)
2. Update all submodule `.version` files to match
3. Remove `workspace` configuration
4. Add all submodule `.version` files to root `dependency-check`:

```yaml
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: services/api/.version
        format: raw
      - path: services/web/.version
        format: raw
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

1. Detecting all `.version` files and manifest files in your project
2. If multiple `.version` files found, prompting you to choose a versioning model
3. Creating `.sley.yaml` with the appropriate configuration based on your choice:
   - **Coordinated versioning**: Enables `dependency-check` with submodule `.version` files as sync targets
   - **Independent versioning**: Enables `workspace` configuration for independent module management
   - **Single root**: Ignores submodule `.version` files, treats root as single source
4. Enabling default plugins (`commit-parser`, `tag-manager`)
5. Creating root `.version` file if it doesn't exist

This eliminates the need to run `sley init` separately after discovery.

For complete flag documentation, see [CLI Reference](/reference/cli#discover).

## Practical Examples

### Example 1: Go Backend + SvelteKit Frontend

```text
my-app/
├── .version              # 1.0.0
├── backend/
│   ├── .version          # Need for //go:embed
│   └── main.go
└── frontend/
    ├── .version          # Need for Vite plugin
    ├── package.json
    └── vite.config.js
```

**Best choice:** Coordinated versioning

**Why:** You want one version for the entire app, but need separate `.version` files for technical reasons (Go embed, Vite plugin).

**Configuration:**
```yaml
# .sley.yaml
path: .version

plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: backend/.version
        format: raw
      - path: frontend/.version
        format: raw
      - path: frontend/package.json
        field: version
        format: json
```

**Usage:**
```bash
# Bump root version - automatically syncs to all configured files
$ sley bump minor

Sync dependencies
  ✓ backend (.version): 1.1.0
  ✓ frontend (.version): 1.1.0
  ✓ frontend/package.json: 1.1.0

Success: Version bumped to 1.1.0 and synced to 3 file(s)
```

### Example 2: Microservices with Independent Releases

```text
services/
├── api/
│   ├── .version          # 2.1.0
│   └── Cargo.toml
├── auth/
│   ├── .version          # 1.5.3
│   └── package.json
└── notifications/
    ├── .version          # 3.0.0
    └── pyproject.toml
```

**Best choice:** Independent versioning (workspace)

**Why:** Each service releases independently with its own version.

**Configuration:**
```yaml
# .sley.yaml (root)
workspace:
  discovery:
    enabled: true
    recursive: true
```

**Usage:**
```bash
# Bump all services at once
$ sley bump patch --all

Bump patch
  ✓ api (services/api/.version): 2.1.0 -> 2.1.1
  ✓ auth (services/auth/.version): 1.5.3 -> 1.5.4
  ✓ notifications (services/notifications/.version): 3.0.0 -> 3.0.1

Success: 3 modules updated

# Bump specific service
$ sley bump minor --module auth

Bump minor
  ✓ auth (services/auth/.version): 1.5.4 -> 1.6.0

Success: 1 module updated
```

### Example 3: Library with Multiple Build Targets

```text
my-lib/
├── .version              # 1.2.3
├── package.json
├── Cargo.toml
├── Chart.yaml
└── VERSION
```

**Best choice:** Single-root

**Why:** One library, one version, multiple manifest files.

**Configuration:**
```yaml
# .sley.yaml
path: .version

plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
      - path: Cargo.toml
        field: package.version
        format: toml
      - path: Chart.yaml
        field: version
        format: yaml
      - path: VERSION
        format: raw
```

**Usage:**
```bash
# Bump version - syncs to all manifest files
$ sley bump patch

Sync dependencies
  ✓ package.json: 1.2.4
  ✓ Cargo.toml: 1.2.4
  ✓ Chart.yaml: 1.2.4
  ✓ VERSION: 1.2.4

Success: Version bumped to 1.2.4 and synced to 4 file(s)
```

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

## Common Misconceptions

**Q: I have multiple `.version` files but want them all to have the same version. Which model do I use?**

A: Use **coordinated versioning**. Configure `dependency-check` to sync all submodule `.version` files TO the root `.version`. This ensures one version everywhere while maintaining multiple `.version` files for technical requirements.

**Q: Can I use dependency-check to sync .version files?**

A: Yes, but only in **coordinated versioning** mode. In this model, submodule `.version` files are sync targets that sync TO the root `.version`. In **independent versioning** mode, each `.version` file is a source of truth.

**Q: I have multiple packages but want them all to share the same version. Do I need workspace?**

A: No. If you only have one `.version` file at the root, use **single-root** mode with `dependency-check` to sync manifest files. If you have multiple `.version` files that need to stay synchronized, use **coordinated versioning**.

**Q: Can workspace and dependency-check work together?**

A: Yes!
- In **coordinated versioning**: `dependency-check` syncs both submodule `.version` files AND manifest files to root
- In **independent versioning** (workspace): Each module can have its own `dependency-check` to sync that module's manifest files to its `.version`

**Q: Why does discover show "mismatches" in my monorepo?**

A: The discover command compares all versions to the root `.version`. If you see mismatches:
- For **coordinated versioning**: These are real issues - enable `dependency-check` to keep them synced
- For **independent versioning**: These are expected - configure workspace mode to manage independent versions

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
