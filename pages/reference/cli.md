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
| `--theme` `<string>`         | TUI theme for interactive prompts (default: `sley`)            |
| `--strict`, `--no-auto-init` | Fail if .version file is missing (disable auto-initialization) |
| `--no-color`                 | Disable colored output                                         |
| `--help`, `-h`               | Show help                                                      |
| `--version`, `-v`            | Print the version                                              |

**Available themes**: `sley` (default), `base`, `base16`, `catppuccin`, `charm`, `dracula` - see [Theme Configuration](/reference/sley-yaml#theme-configuration) for details.

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

The command performs a deep scan of the entire project structure up to the specified depth limit.

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

| Option                | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `--all`, `-a`         | Show versions for all discovered modules                  |
| `--module`, `-m`      | Show version for specific module by name                  |
| `--modules`           | Show versions for multiple modules (comma-separated)      |
| `--pattern`           | Show versions for modules matching glob pattern           |
| `--yes`, `-y`         | Auto-select all modules without prompting (implies --all) |
| `--non-interactive`   | Disable interactive prompts (CI mode)                     |
| `--parallel`          | Execute operations in parallel across modules             |
| `--fail-fast`         | Stop execution on first error (default: true)             |
| `--continue-on-error` | Continue execution even if some modules fail              |
| `--quiet`, `-q`       | Suppress module-level output, show summary only           |
| `--format`            | Output format: text, json, table (default: "text")        |

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

| Option                | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `--pre`               | Set pre-release label (e.g., beta.1)                      |
| `--meta`              | Set build metadata (e.g., ci.001)                         |
| `--all`, `-a`         | Set version for all discovered modules                    |
| `--module`, `-m`      | Set version for specific module by name                   |
| `--modules`           | Set version for multiple modules (comma-separated)        |
| `--pattern`           | Set version for modules matching glob pattern             |
| `--yes`, `-y`         | Auto-select all modules without prompting (implies --all) |
| `--non-interactive`   | Disable interactive prompts (CI mode)                     |
| `--parallel`          | Execute operations in parallel across modules             |
| `--fail-fast`         | Stop execution on first error (default: true)             |
| `--continue-on-error` | Continue execution even if some modules fail              |
| `--quiet`, `-q`       | Suppress module-level output, show summary only           |
| `--format`            | Output format: text, json, table (default: "text")        |

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

| Option                | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `--pre`               | Set pre-release label after bump (for patch/minor/major)  |
| `--meta`              | Set build metadata after bump                             |
| `--preserve-meta`     | Keep existing build metadata                              |
| `--all`, `-a`         | Operate on all discovered modules                         |
| `--module`, `-m`      | Operate on specific module by name                        |
| `--modules`           | Operate on multiple modules (comma-separated)             |
| `--pattern`           | Operate on modules matching glob pattern                  |
| `--yes`, `-y`         | Auto-select all modules without prompting (implies --all) |
| `--non-interactive`   | Disable interactive prompts (CI mode)                     |
| `--parallel`          | Execute operations in parallel                            |
| `--fail-fast`         | Stop on first error (default)                             |
| `--continue-on-error` | Continue even if some modules fail                        |
| `--quiet`, `-q`       | Suppress per-module output                                |
| `--format`            | Output format: text, json, table (default: "text")        |

**Subcommands:**

#### `bump patch`

Increment patch version (0.0.X).

```bash
sley bump patch [options]
```

| Option         | Description            |
| -------------- | ---------------------- |
| `--skip-hooks` | Skip pre-release hooks |

All multi-module flags (see parent command) are also supported.

#### `bump minor`

Increment minor version (0.X.0) and reset patch.

```bash
sley bump minor [options]
```

| Option         | Description            |
| -------------- | ---------------------- |
| `--skip-hooks` | Skip pre-release hooks |

All multi-module flags (see parent command) are also supported.

#### `bump major`

Increment major version (X.0.0) and reset minor and patch.

```bash
sley bump major [options]
```

| Option         | Description            |
| -------------- | ---------------------- |
| `--skip-hooks` | Skip pre-release hooks |

All multi-module flags (see parent command) are also supported.

#### `bump pre`

Increment pre-release version (e.g., rc.1 → rc.2) or set a new pre-release label.

```bash
sley bump pre [options]
```

Note: This is different from the standalone `pre` command. The `bump pre` subcommand increments the pre-release while potentially bumping the patch version, whereas the standalone `pre` command only modifies the pre-release label without changing the version numbers.

All multi-module flags (see parent command) are also supported.

#### `bump auto` / `bump next`

Smart bump logic with automatic detection from commit messages or changelog.

```bash
sley bump auto [options]
```

| Option            | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `--label`         | Override bump type (patch, minor, major)                           |
| `--meta`          | Set build metadata (e.g., 'ci.123')                                |
| `--preserve-meta` | Preserve existing build metadata instead of clearing it            |
| `--since`         | Start commit/tag for bump inference (default: last tag or HEAD~10) |
| `--until`         | End commit/tag for bump inference (default: HEAD)                  |
| `--no-infer`      | Disable bump inference from commit messages (overrides config)     |
| `--hook-only`     | Only run pre-release hooks, do not modify the version              |
| `--skip-hooks`    | Skip pre-release hooks                                             |

By default, sley tries to infer the bump type from recent commit messages using the built-in commit-parser plugin. You can override this behavior with the `--label` flag, disable it explicitly with `--no-infer`, or disable the plugin via the config file (.sley.yaml).

All multi-module flags (see parent command) are also supported.

#### `bump release`

Promote pre-release to final version (e.g., 1.2.3-alpha → 1.2.3).

```bash
sley bump release [options]
```

| Option         | Description            |
| -------------- | ---------------------- |
| `--skip-hooks` | Skip pre-release hooks |

All multi-module flags (see parent command) are also supported.

**Examples:**

```bash
# Single-module project
sley bump patch                    # 1.0.0 -> 1.0.1
sley bump minor                    # 1.0.0 -> 1.1.0
sley bump major                    # 1.0.0 -> 2.0.0

# Bump with pre-release label
sley bump minor --pre beta.1       # 1.0.0 -> 1.1.0-beta.1
sley bump patch --pre alpha        # 1.0.0 -> 1.0.1-alpha

# Bump with build metadata
sley bump patch --meta ci.123      # 1.0.0 -> 1.0.1+ci.123
sley bump minor --preserve-meta    # Keeps existing metadata

# Auto bump with inference
sley bump auto                     # Infers from commits (feat: -> minor, fix: -> patch)
sley bump auto --label minor       # Override inference
sley bump auto --no-infer          # Disable inference, use default logic

# Promote pre-release to stable
sley bump release                  # 1.0.0-beta.1 -> 1.0.0

# Skip pre-release hooks
sley bump patch --skip-hooks       # Bypass configured hooks

# Multi-module projects (independent versioning)
sley bump patch --all              # Bump all modules
sley bump patch --module api       # Bump specific module
sley bump minor --modules api,web  # Bump multiple specific modules
sley bump major --pattern "services/*"  # Bump modules matching pattern

# Coordinated versioning (automatic sync)
sley bump patch                    # Syncs to all configured files via dependency-check
```

### `pre`

Set or increment pre-release label without bumping the version.

```bash
sley pre --label <label> [options]
```

| Option                | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `--label` `<string>`  | Pre-release label to set (e.g., alpha, beta, rc) **[Required]** |
| `--inc`               | Auto-increment numeric suffix if it exists or add '.1'          |
| `--all`, `-a`         | Operate on all discovered modules                               |
| `--module`, `-m`      | Operate on specific module by name                              |
| `--modules`           | Operate on multiple modules (comma-separated)                   |
| `--pattern`           | Operate on modules matching glob pattern (e.g., 'services/\*')  |
| `--yes`, `-y`         | Auto-select all modules without prompting (implies --all)       |
| `--non-interactive`   | Disable interactive prompts (CI mode)                           |
| `--parallel`          | Execute operations in parallel across modules                   |
| `--fail-fast`         | Stop execution on first error (default)                         |
| `--continue-on-error` | Continue execution even if some modules fail                    |
| `--quiet`, `-q`       | Suppress module-level output, show summary only                 |
| `--format`            | Output format: text, json, table (default: "text")              |

When `dependency-check` plugin is configured with `auto-sync: true`, the `pre` command automatically syncs the pre-release version to all configured files (useful for coordinated versioning scenarios).

**Examples:**

```bash
# Set pre-release label (replaces existing label if present)
sley pre --label alpha
# => 1.2.3-alpha

# Auto-increment numeric suffix
sley pre --label alpha --inc
# => 1.2.3-alpha.1 (or increments existing number)

# Multi-module projects
sley pre --label beta --all        # Apply to all modules
sley pre --label rc --module api   # Apply to specific module
```

### `doctor` / `validate`

Validate `.version` file(s) and configuration.

```bash
sley doctor [options]
sley validate [options]
```

| Option                | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `--all`, `-a`         | Validate all discovered modules                           |
| `--module`, `-m`      | Validate specific module by name                          |
| `--modules`           | Validate multiple modules (comma-separated)               |
| `--pattern`           | Validate modules matching glob pattern                    |
| `--yes`, `-y`         | Auto-select all modules without prompting (implies --all) |
| `--non-interactive`   | Disable interactive prompts (CI mode)                     |
| `--parallel`          | Execute operations in parallel across modules             |
| `--fail-fast`         | Stop execution on first error (default: true)             |
| `--continue-on-error` | Continue execution even if some modules fail              |
| `--quiet`, `-q`       | Suppress module-level output, show summary only           |
| `--format`            | Output format: text, json, table (default: "text")        |

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

#### `tag create`

Create a git tag for the current version (aliases: `c`, `new`).

```bash
sley tag create [options]
```

| Option            | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `--push`          | Push the tag to remote after creation                |
| `--message`, `-m` | Override the tag message (for annotated/signed tags) |

The tag name and format are determined by the tag-manager plugin configuration. If the plugin is not enabled, default settings are used (prefix: `v`, lightweight tag).

#### `tag list`

List existing version tags (aliases: `l`, `ls`).

```bash
sley tag list [options]
```

| Option          | Description                    |
| --------------- | ------------------------------ |
| `--limit`, `-n` | Limit the number of tags shown |

Tags are sorted by semantic version in descending order (newest first).

#### `tag push`

Push a tag to remote (alias: `p`).

```bash
sley tag push [tag-name]
```

If no tag name is provided, pushes the tag corresponding to the current version in .version file.

#### `tag delete`

Delete a git tag (aliases: `d`, `rm`).

```bash
sley tag delete <tag-name> [options]
```

| Option     | Description                     |
| ---------- | ------------------------------- |
| `--remote` | Also delete the tag from remote |

### `changelog`

Manage changelog files.

```bash
sley changelog <subcommand> [options]
```

#### `changelog merge`

Merge versioned changelog files into unified CHANGELOG.md.

```bash
sley changelog merge [options]
```

| Option              | Description                                                          |
| ------------------- | -------------------------------------------------------------------- |
| `--changes-dir`     | Directory containing versioned changelog files (default: ".changes") |
| `--output`          | Output path for unified changelog (default: "CHANGELOG.md")          |
| `--header-template` | Path to custom header template file                                  |

This command combines all versioned changelog files (.changes/v\*.md) into a single CHANGELOG.md file, sorted by version (newest first). It prepends a default header or uses a custom header template if specified.

**Examples:**

```bash
# Merge with defaults
sley changelog merge

# Custom paths
sley changelog merge --changes-dir .changes --output CHANGELOG.md

# With custom header
sley changelog merge --header-template .changes/header.md
```

### `extension`

Manage extensions for sley.

```bash
sley extension <subcommand> [options]
```

#### `extension install`

Install an extension from a remote repository or local path.

```bash
sley extension install [options]
```

| Option            | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `--url`           | Git repository URL with optional subdirectory (GitHub, GitLab)   |
| `--path`          | Local filesystem path (absolute or relative)                     |
| `--extension-dir` | Directory to store extensions in (default: `~/.sley-extensions`) |

::: warning
`--url` and `--path` are mutually exclusive. One must be provided. Passing a URL to `--path` will result in an error.
:::

**Supported URL formats:**

The `--url` flag now supports subdirectories within repositories:

- `https://github.com/user/repo` - Repository root
- `https://github.com/user/repo/path/to/extension` - Subdirectory in repository
- `github.com/user/repo` - Shorthand for repository root
- `github.com/user/repo/path/to/extension` - Shorthand with subdirectory
- `gitlab.com/user/repo` or `gitlab.com/user/repo/sub/dir` - GitLab support

**Examples:**

```bash
# Install from local path (relative)
sley extension install --path ./my-extension

# Install from local path (absolute)
sley extension install --path /home/user/extensions/my-extension

# Install from GitHub repository root
sley extension install --url https://github.com/user/sley-ext-changelog

# Install from subdirectory in repository (shorthand)
sley extension install --url github.com/indaco/sley/contrib/extensions/commit-validator

# Install docker-tag-sync from sley repository subdirectory
sley extension install --url github.com/indaco/sley/contrib/extensions/docker-tag-sync
```

::: tip Subdirectory Support
The subdirectory feature is perfect for:

- Monorepos containing multiple extensions
- Projects with extensions in a `contrib/` or `extensions/` directory
- Sharing extensions without creating separate repositories
  :::

#### `extension list`

List installed extensions.

```bash
sley extension list
```

Displays all registered extensions with their name, version, enabled status, and description.

#### `extension uninstall`

Uninstall a registered extension (alias: `remove`).

```bash
sley extension uninstall [options]
```

| Option            | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `--name`          | Name of the extension to uninstall (required)               |
| `--delete-folder` | Delete the extension directory from .sley-extensions folder |

By default, the extension is removed from `.sley.yaml` but its files are preserved. Use `--delete-folder` to completely remove it.

::: tip Alias
The `remove` command is available as an alias for `uninstall` for backward compatibility.
:::

**Examples:**

```bash
# Remove extension from config (keep files)
sley extension uninstall --name my-extension

# Completely remove extension
sley extension uninstall --name my-extension --delete-folder

# Using the alias
sley extension remove --name my-extension
```

#### `extension enable`

Enable a previously disabled extension.

```bash
sley extension enable --name <extension-name>
```

| Option   | Description                                |
| -------- | ------------------------------------------ |
| `--name` | Name of the extension to enable (required) |

Sets `enabled: true` in `.sley.yaml` for the specified extension. The extension entry and directory remain untouched. Use this to reactivate an extension that was previously disabled without needing to reinstall it.

**Examples:**

```bash
# Enable a disabled extension
sley extension enable --name commit-validator

# Enable docker-tag-sync
sley extension enable --name docker-tag-sync
```

#### `extension disable`

Disable an extension without uninstalling it.

```bash
sley extension disable --name <extension-name>
```

| Option   | Description                                 |
| -------- | ------------------------------------------- |
| `--name` | Name of the extension to disable (required) |

Sets `enabled: false` in `.sley.yaml` for the specified extension. The extension entry and directory remain untouched. This is useful for temporarily turning off an extension without losing its configuration or removing it entirely.

**Examples:**

```bash
# Disable an extension temporarily
sley extension disable --name commit-validator

# Disable docker-tag-sync
sley extension disable --name docker-tag-sync
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
- [Monorepo Support](/guide/monorepo/) - Multi-module workflows and discovery
- [Troubleshooting](/guide/troubleshooting/) - Common command issues
