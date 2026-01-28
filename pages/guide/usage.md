---
title: "Usage Guide"
description: "Complete guide to using sley commands - init, bump, set, show, validate, and manage versions with pre-release support and git tag management"
head:
  - - meta
    - name: keywords
      content: sley, usage, commands, bump version, semantic versioning, git tags, pre-release, version management, CLI
---

# {{ $frontmatter.title }}

## Quick Reference

| Command             | Purpose                          | Example                        |
| ------------------- | -------------------------------- | ------------------------------ |
| `sley init`         | Initialize project with .version | `sley init --migrate`          |
| `sley discover`     | Auto-discover version sources    | `sley discover --format json`  |
| `sley show`         | Display current version          | `sley show --all`              |
| `sley set`          | Set version manually             | `sley set 2.0.0 --pre beta`    |
| `sley bump`         | Increment version                | `sley bump patch`              |
| `sley bump pre`     | Increment pre-release            | `sley bump pre --label beta`   |
| `sley bump auto`    | Smart version bump               | `sley bump auto`               |
| `sley bump release` | Remove pre-release               | `sley bump release`            |
| `sley pre`          | Set pre-release label            | `sley pre --label alpha --inc` |
| `sley validate`     | Validate .version file           | `sley validate --strict`       |
| `sley doctor`       | Validate config and version      | `sley doctor --all`            |
| `sley tag`          | Manage git tags                  | `sley tag create --push`       |
| `sley changelog`    | Manage changelogs                | `sley changelog merge`         |

## Project Setup

### Initialize Project

#### Interactive Mode

Run `sley init` without flags to launch the interactive TUI where you can select which plugins to enable:

```bash
sley init
```

![Interactive plugin selection](/screenshots/sley_init_tui.png)

Use the keyboard to navigate and select plugins:

- **Space** / **x**: Toggle selection
- **Arrow keys**: Navigate up/down
- **/**: Filter plugins
- **Enter**: Confirm selection
- **a**: Select all
- **n**: Select none
- **Esc**: Cancel

#### Non-Interactive Mode

For CI/CD pipelines or scripted setups, use the `--yes` flag to skip prompts:

```bash
# Use sensible defaults (commit-parser, tag-manager)
sley init --yes
# Output:
#   Created .version with version 0.1.0
#   Created .sley.yaml with default plugins (commit-parser, tag-manager)

# Use a pre-configured template
sley init --template automation

# Enable specific plugins
sley init --enable commit-parser,tag-manager,changelog-generator

# Initialize as monorepo with workspace configuration
sley init --workspace --yes

# Force overwrite existing configuration
sley init --yes --force
```

#### Migrate from Existing Version

If your project already has a version defined in `package.json`, `Cargo.toml`, or similar files, use `--migrate` to detect and import it:

```bash
sley init --migrate
```

![Version migration dialog](/screenshots/sley_init_migrate.png)

The migration feature will scan for version sources and prompt you to confirm before creating the `.version` file.

```bash
# Skip confirmation prompt
sley init --migrate --yes
```

#### Available Flags

| Flag           | Description                                               |
| -------------- | --------------------------------------------------------- |
| `--yes`, `-y`  | Use defaults without prompts (commit-parser, tag-manager) |
| `--template`   | Use a pre-configured template                             |
| `--enable`     | Comma-separated list of plugins to enable                 |
| `--workspace`  | Initialize as monorepo with workspace configuration       |
| `--migrate`    | Detect version from existing files (package.json, etc.)   |
| `--force`      | Overwrite existing .sley.yaml                             |
| `--path`, `-p` | Custom path for .version file                             |

#### Available Templates

| Template     | Plugins Enabled                                             |
| ------------ | ----------------------------------------------------------- |
| `basic`      | commit-parser                                               |
| `git`        | commit-parser, tag-manager                                  |
| `automation` | commit-parser, tag-manager, changelog-generator             |
| `strict`     | commit-parser, tag-manager, version-validator, release-gate |
| `full`       | All plugins enabled                                         |

### Auto-Discover Version Sources

If your project already has versions in manifest files (package.json, Cargo.toml, pyproject.toml, etc.), `discover` provides an interactive workflow to scan and initialize:

```bash
sley discover
```

The command will:

1. Scan for `.version` files and manifest files in your project tree
2. Display what it found
3. Ask if you want to initialize
4. Let you select which files to keep in sync
5. Create `.version` and `.sley.yaml` with `dependency-check` pre-configured

Useful for migrating existing projects or setting up monorepos with multiple version sources.

See [CLI Reference: discover](/reference/cli#discover-scan) for all options.

## Version Operations

### Display Current Version

```bash
# Single-root: Display current version
sley show
# Output: 1.2.3

# Fail if .version is missing (strict mode)
sley show --strict
# Output: Error: version file not found at .version
```

#### Multi-Module Projects

```bash
# Show all module versions
sley show --all
# Output:
#   ✓ root (.version): 1.0.0
#   ✓ web (apps/web/.version): 0.5.0-beta.1
#   ✓ core (packages/core/.version): 3.2.1
#   ✓ utils (packages/utils/.version): 2.0.0

# Show specific module version
sley show --module core
# Output: 3.2.1

# JSON output for CI/CD
sley show --all --format json
# Output: [{"name":"root","path":".version","version":"1.0.0"},...]

# Table format
sley show --all --format table
# ┌──────┬─────────────────────┬──────────┐
# │ Name │ Path                │ Version  │
# ├──────┼─────────────────────┼──────────┤
# │ root │ .version            │ 1.0.0    │
# │ web  │ apps/web/.version   │ 0.5.0    │
# └──────┴─────────────────────┴──────────┘
```

See [Monorepo Support](/guide/monorepo/#command-examples-by-versioning-model) for detailed examples across different versioning models.

### Set Version Manually

```bash
# Single-root: Set version
sley set 2.1.0
# Output: .version is now 2.1.0

# Set pre-release version
sley set 2.1.0 --pre beta.1
# Output: .version is now 2.1.0-beta.1

# Attach build metadata
sley set 1.0.0 --meta ci.001
# Output: .version is now 1.0.0+ci.001

# Combine pre-release and metadata
sley set 1.0.0 --pre alpha --meta build.42
# Output: .version is now 1.0.0-alpha+build.42
```

#### Multi-Module Projects

```bash
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
```

See [Monorepo Support](/guide/monorepo/#command-examples-by-versioning-model) for detailed examples across different versioning models.

### Bump Version

```bash
# Current: 1.2.3

sley bump patch
# Output: 1.2.4

sley bump minor
# Output: 1.3.0

sley bump major
# Output: 2.0.0

# Remove pre-release and metadata
# Current: 1.3.0-alpha.1+build.123
sley bump release
# Output: 1.3.0
```

### Increment Pre-release

Increment only the pre-release portion without bumping the version number:

```bash
# Current: 1.0.0-rc.1
sley bump pre
# Output: 1.0.0-rc.2

# Current: 1.0.0-rc1
sley bump pre
# Output: 1.0.0-rc2

# Switch to a different pre-release label
# Current: 1.0.0-alpha.3
sley bump pre --label beta
# Output: 1.0.0-beta.1
```

#### Multi-Module Pre-release Bumps

The `bump pre` command supports multi-module operations:

```bash
# Bump pre-release for all modules
sley bump pre --all
sley bump pre --all --label beta

# Bump pre-release for specific module
sley bump pre --module api
sley bump pre --module web --label rc
```

You can also pass `--pre` and/or `--meta` flags to any bump:

```bash
sley bump patch --pre beta.1
# Output: 1.2.4-beta.1

sley bump minor --meta ci.123
# Output: 1.3.0+ci.123

sley bump major --pre rc.1 --meta build.7
# Output: 2.0.0-rc.1+build.7

# Skip pre-release hooks and extensions during bump
sley bump patch --skip-hooks
# Output: 1.2.4 (no hooks executed)
```

::: tip
By default, any existing build metadata (the part after `+`) is **cleared** when bumping the version.
:::

To **preserve** existing metadata, pass the `--preserve-meta` flag:

```bash
# Current: 1.2.3+build.789
sley bump patch --preserve-meta
# Output: 1.2.4+build.789

# Current: 1.2.3+build.789
sley bump patch --meta new.build
# Output: 1.2.4+new.build (overrides existing metadata)
```

### Smart Bump Logic

Automatically determine the next version:

```bash
# Current: 1.2.3-alpha.1
sley bump auto
# Output: 1.2.3

# Current: 1.2.3
sley bump auto
# Output: 1.2.4
```

Override bump with `--label`:

```bash
sley bump auto --label minor
# Output: 1.3.0

sley bump auto --label major --meta ci.9
# Output: 2.0.0+ci.9

sley bump auto --label patch --preserve-meta
# Output: bumps patch and keeps build metadata
```

Valid `--label` values: `patch`, `minor`, `major`.

### Set Pre-release Label

The `pre` command provides explicit control over pre-release labels:

```bash
# Current: 1.2.3
sley pre --label alpha
# Output: 1.2.4-alpha (bumps patch first)

# Current: 1.2.3
sley pre --label alpha --inc
# Output: 1.2.3-alpha.1 (no patch bump, adds numeric suffix)

# Current: 1.2.3-alpha.1
sley pre --label alpha --inc
# Output: 1.2.3-alpha.2 (increments counter)

# Switch labels
# Current: 1.2.3-alpha.5
sley pre --label beta --inc
# Output: 1.2.3-beta.1 (new label, counter starts at 1)
```

See [Pre-release Versions](/guide/pre-release) for complete guide on pre-release workflows.

## Validation

### Validate Version File

Check whether the `.version` file exists and contains a valid semantic version:

```bash
# Single-root: Validate version file and configuration
sley validate
# Output: Valid version file at ./<path>/.version

# Use doctor alias (validates config and version file)
sley doctor
# Output:
# Configuration Validation:
#   ✓ [PASS] YAML Syntax
#   ✓ [PASS] Plugin Configuration
#
# Version File Validation:
#   ✓ [PASS] .version exists and is valid (1.2.3)

# If the file is missing or contains an invalid value
sley validate
# Output: Error: invalid version format: ...
```

#### Multi-Module Projects

```bash
# Validate all modules
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
```

See [Monorepo Support](/guide/monorepo/#command-examples-by-versioning-model) for detailed examples across different versioning models.

## Git Integration

### Manage Git Tags

```bash
sley tag create             # Create tag for current version
sley tag create --push      # Create and push
sley tag list               # List version tags
```

See [Tag Manager](/plugins/tag-manager) for automatic tagging, GPG signing, and configuration options.

### Manage Changelogs

```bash
sley changelog merge        # Merge versioned changelogs into CHANGELOG.md
```

See [Changelog Generator](/plugins/changelog-generator) for automatic changelog generation from commits.

## Advanced Operations

### Rolling Back a Version Change

If you need to undo a version bump:

```bash
# Manual method - set back to previous version
sley set 1.2.3

# Git method (if changes were committed)
git revert HEAD
# Or reset if not pushed yet
git reset --hard HEAD^

# If using tag-manager plugin, also delete the tag
git tag -d v1.2.4
# If tag was pushed to remote
git push origin :refs/tags/v1.2.4
```

::: warning
Automated rollback is not built into sley. Always track version changes in git for easy reversion.
:::

## What's Next?

Choose your path based on your needs:

**Ready to automate?**

- [CI/CD Integration](/guide/ci-cd) - Automate version bumps in pipelines
- [Plugin System](/plugins/) - Enable git tagging, changelogs, and more
- [Tag Manager](/plugins/tag-manager) - Automatic git tags and releases

**Working with pre-releases?**

- [Pre-release Versions](/guide/pre-release) - Alpha, beta, RC workflows
- [Changelog Generator](/plugins/changelog-generator) - Generate changelogs from commits

**Syncing versions across files?**

- [Understanding Versioning Models](/guide/monorepo/#understanding-versioning-models) - Choose the right approach for your project
- [dependency-check Plugin](/plugins/dependency-check) - Keep package.json, Cargo.toml, etc. in sync with `.version`

**Managing multiple modules?**

- [Monorepo Support](/guide/monorepo/) - Multi-module version management
- [Workspace Configuration](/reference/sley-yaml#workspace-configuration) - Configure module discovery

**Need more details?**

- [CLI Reference](/reference/cli) - Complete command and flag reference
- [Troubleshooting](/guide/troubleshooting/) - Common issues and solutions
