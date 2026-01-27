---
title: "CLI Reference"
description: "Complete command-line reference for all sley commands, options, and flags including init, bump, set, show, validate, tag, and changelog"
head:
  - - meta
    - name: keywords
      content: sley, CLI, command-line, reference, commands, options, flags, documentation, API reference
---

# {{ $frontmatter.title }}

Complete reference for all sley commands and options.

::: tip
For configuration file options, see [Configuration](/config/). For environment variables, see [Environment Variables](/config/env-vars).
:::

## Usage

```bash
sley [global options] [command [command options]]
```

## Global Options

| Option                       | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| `--path`, `-p` `<string>`    | Path to .version file (default: `.version`)                    |
| `--strict`, `--no-auto-init` | Fail if .version file is missing (disable auto-initialization) |
| `--no-color`                 | Disable colored output                                         |
| `--help`, `-h`               | Show help                                                      |
| `--version`, `-v`            | Print the version                                              |

## Commands

### `init`

Initialize `.version` file and `.sley.yaml` configuration.

```bash
sley init [options]
```

| Option        | Description                                               |
| ------------- | --------------------------------------------------------- |
| `--yes`, `-y` | Use defaults without prompts (commit-parser, tag-manager) |
| `--template`  | Use a pre-configured template                             |
| `--enable`    | Comma-separated list of plugins to enable                 |
| `--workspace` | Initialize as monorepo with workspace configuration       |
| `--migrate`   | Detect version from existing files (package.json, etc.)   |
| `--force`     | Overwrite existing .sley.yaml                             |

### `discover` / `scan`

Scan the project tree for version sources and suggest configuration.

```bash
sley discover [options]
```

Recursively scans the project tree for:

- `.version` files (sley modules in subdirectories)
- Manifest files (package.json, Cargo.toml, pyproject.toml, Chart.yaml, etc.)

The command now performs a deep scan of the entire project structure up to the specified depth limit, making it ideal for discovering all version sources in complex monorepos.

| Option             | Description                                        |
| ------------------ | -------------------------------------------------- |
| `--depth`, `-d`    | Maximum directory depth for discovery (default: 3) |
| `--format`, `-f`   | Output format: text, json, table                   |
| `--quiet`, `-q`    | Only show summary                                  |
| `--no-interactive` | Skip interactive prompts                           |

**Examples**:

```bash
# Discover all version sources (searches up to 3 levels deep by default)
sley discover

# Increase search depth for deeply nested structures
sley discover --depth 5

# JSON output for CI/CD
sley discover --format json

# Non-interactive mode
sley discover --no-interactive
```

**Auto-Initialization Workflow**:

When no `.sley.yaml` exists, `discover` offers to initialize your project automatically:

1. Creates `.sley.yaml` with sensible defaults
2. Enables `commit-parser` and `tag-manager` plugins
3. If manifest files or module `.version` files are found, also enables `dependency-check` plugin pre-configured with discovered files
4. Creates `.version` file if it doesn't exist

This streamlined workflow eliminates the need to run `sley init` separately after discovery.

### `show`

Display the current version.

```bash
sley show [options]
```

| Option           | Description                              |
| ---------------- | ---------------------------------------- |
| `--strict`       | Fail if .version file is missing         |
| `--all`, `-a`    | Show versions for all discovered modules |
| `--module`, `-m` | Show version for specific module by name |
| `--format`       | Output format: text, json, table         |

**Examples:**

```bash
# Single-root: Display current version
sley show
# => 1.0.0

# Coordinated versioning: Show all synced modules
sley show --all
# Output:
# Version Summary
#   ✓ coordinated-versioning (.version): 2.0.0
#   ✓ api (services/api/.version): 2.0.0
#   ✓ web (services/web/.version): 2.0.0

# Independent versioning: Show all module versions
sley show --all
# Output:
#   ✓ root (.version): 1.0.0
#   ✓ web (apps/web/.version): 0.5.0-beta.1
#   ✓ core (packages/core/.version): 3.2.1
#   ✓ utils (packages/utils/.version): 2.0.0

# Show specific module version
sley show --module core
# => 3.2.1

# JSON output for CI/CD
sley show --all --format json
# => [{"name":"root","path":".version","version":"1.0.0"},...]

# Table format
sley show --all --format table
# Output:
# ┌──────┬─────────────────────┬──────────┐
# │ Name │ Path                │ Version  │
# ├──────┼─────────────────────┼──────────┤
# │ root │ .version            │ 1.0.0    │
# │ web  │ apps/web/.version   │ 0.5.0    │
# └──────┴─────────────────────┴──────────┘
```

### `set`

Set the version manually.

```bash
sley set <version> [options]
```

| Option           | Description                              |
| ---------------- | ---------------------------------------- |
| `--pre`          | Set pre-release label (e.g., beta.1)     |
| `--meta`         | Set build metadata (e.g., ci.001)        |
| `--all`, `-a`    | Set version for all discovered modules   |
| `--module`, `-m` | Set version for specific module by name  |

**Examples:**

```bash
# Single-root: Set version
sley set 2.0.0
# => .version is now 2.0.0

# Coordinated versioning: Set all modules to same version
sley set 2.1.0 --all
# Output:
# Set version to 2.1.0
#   ✓ coordinated-versioning (.version): 2.0.0 -> 2.1.0
#   ✓ api (services/api/.version): 2.0.0 -> 2.1.0
#   ✓ web (services/web/.version): 2.0.0 -> 2.1.0

# Independent versioning: Set specific module version
sley set 4.0.0 --module core
# Output:
#   ✓ core (packages/core/.version): 3.2.1 -> 4.0.0

# Set all modules to same version (rare in independent versioning)
sley set 1.0.0 --all
# Output:
#   ✓ root (.version): 1.0.0 -> 1.0.0
#   ✓ web (apps/web/.version): 0.5.0-beta.1 -> 1.0.0
#   ✓ core (packages/core/.version): 3.2.1 -> 1.0.0
#   ✓ utils (packages/utils/.version): 2.0.0 -> 1.0.0

# Set with pre-release label
sley set 2.0.0 --pre beta.1
# => 2.0.0-beta.1

# Set with build metadata
sley set 2.0.0 --meta ci.001
# => 2.0.0+ci.001
```

### `bump`

Bump semantic version.

```bash
sley bump <patch|minor|major|pre|auto|release> [options]
```

| Option                | Description                                   |
| --------------------- | --------------------------------------------- |
| `--pre`               | Set pre-release label after bump              |
| `--meta`              | Set build metadata after bump                 |
| `--preserve-meta`     | Keep existing build metadata                  |
| `--label`             | Override bump type (for `auto` subcommand)    |
| `--skip-hooks`        | Skip pre-release hooks and extensions         |
| `--all`, `-a`         | Operate on all discovered modules             |
| `--module`, `-m`      | Operate on specific module by name            |
| `--modules`           | Operate on multiple modules (comma-separated) |
| `--pattern`           | Operate on modules matching glob pattern      |
| `--yes`, `-y`         | Auto-select all modules without prompting     |
| `--non-interactive`   | Disable interactive prompts                   |
| `--parallel`          | Execute operations in parallel                |
| `--fail-fast`         | Stop on first error (default)                 |
| `--continue-on-error` | Continue even if some modules fail            |
| `--quiet`, `-q`       | Suppress per-module output                    |

**Subcommands:**

- `patch` - Bump patch version (0.0.X)
- `minor` - Bump minor version (0.X.0)
- `major` - Bump major version (X.0.0)
- `pre` - Bump pre-release version
- `auto` - Auto-detect bump type from commit messages
- `release` - Remove pre-release label

**Examples:**

```bash
# Single-module project
sley bump patch
sley bump pre

# Multi-module projects (independent versioning)
sley bump patch --all              # Bump all modules
sley bump patch --module api       # Bump specific module
sley bump pre --all                # Bump pre-release for all modules
sley bump pre --module web         # Bump pre-release for specific module
sley bump pre --all --label beta   # Bump pre-release for all modules with beta label

# Coordinated versioning (automatic sync)
sley bump patch                    # Syncs to all configured files via dependency-check
sley bump pre                      # Syncs pre-release to all configured files
```

### `pre`

Set or increment pre-release label.

```bash
sley pre <label> [options]
```

| Option            | Description                                       |
| ----------------- | ------------------------------------------------- |
| `--label`, `-l`   | Pre-release label (e.g., alpha, beta, rc)         |
| `--inc`           | Auto-increment numeric suffix                     |
| `--all`, `-a`     | Apply to all discovered modules                   |
| `--module`, `-m`  | Apply to specific module by name                  |

When `dependency-check` plugin is configured with `auto-sync: true`, the `pre` command automatically syncs the pre-release version to all configured files (useful for coordinated versioning scenarios).

**Examples:**

```bash
# Set pre-release label (replaces existing label if present)
sley pre alpha
# => 1.2.3-alpha

# Auto-increment numeric suffix
sley pre alpha --inc
# => 1.2.3-alpha.1 (or increments existing number)

# Multi-module projects
sley pre beta --all                # Apply to all modules
sley pre rc --module api           # Apply to specific module
```

### `validate` / `doctor`

Validate `.version` file(s) and configuration.

```bash
sley validate [options]
sley doctor [options]
```

| Option           | Description                              |
| ---------------- | ---------------------------------------- |
| `--all`, `-a`    | Validate all discovered modules          |
| `--module`, `-m` | Validate specific module by name         |

**Examples:**

```bash
# Single-root: Validate version file and configuration
sley doctor
# Output:
# Configuration Validation:
#   ✓ [PASS] YAML Syntax
#   ✓ [PASS] Plugin Configuration
#
# Version File Validation:
#   ✓ [PASS] .version exists and is valid (1.0.0)

# Multi-module: Validate all modules
sley doctor --all
# Output:
# Configuration Validation:
#   ✓ [PASS] YAML Syntax
#   ✓ [PASS] Plugin Configuration
#
# Validation Summary
#   ✓ root (.version): 1.0.0
#   ✓ web (apps/web/.version): 0.5.0-beta.1
#   ✓ core (packages/core/.version): 3.2.1
#   ✓ utils (packages/utils/.version): 2.0.0

# Validate specific module
sley doctor --module web
# Output:
# Configuration Validation:
#   ✓ [PASS] YAML Syntax
#   ✓ [PASS] Plugin Configuration
#
# Version File Validation:
#   ✓ web (apps/web/.version): 0.5.0-beta.1

# Use validate alias
sley validate --all
# => Same output as doctor --all
```

### `tag`

Manage git tags for versions.

```bash
sley tag <subcommand> [options]
```

| Subcommand          | Description                    |
| ------------------- | ------------------------------ |
| `create`            | Create tag for current version |
| `create --push`     | Create and push tag            |
| `list`              | List version tags              |
| `push [tag-name]`   | Push tag to remote             |
| `delete <tag-name>` | Delete a tag                   |

### `changelog`

Manage changelog files.

```bash
sley changelog <subcommand> [options]
```

| Subcommand | Description                     |
| ---------- | ------------------------------- |
| `merge`    | Merge versioned changelog files |

| Option              | Description                 |
| ------------------- | --------------------------- |
| `--changes-dir`     | Path to changes directory   |
| `--output`          | Output file path            |
| `--header-template` | Custom header template file |

### `extension`

Manage extensions for sley.

```bash
sley extension <subcommand>
```

### `help`

Shows a list of commands or help for one command.

```bash
sley help [command]
sley -h
```

## See Also

- [Usage Guide](/guide/usage) - Detailed command examples and workflows
- [.sley.yaml Reference](/reference/sley-yaml) - Configuration file options
- [Environment Variables](/config/env-vars) - Configure via environment
- [Plugin System](/plugins/) - Plugin configuration and usage
- [Monorepo Support](/guide/monorepo) - Multi-module workflows and discovery
- [Troubleshooting](/guide/troubleshooting/) - Common command issues
