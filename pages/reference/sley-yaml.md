---
title: ".sley.yaml Configuration Reference"
description: "Complete configuration reference for .sley.yaml including plugins, extensions, workspace settings, and all configuration options"
head:
  - - meta
    - name: keywords
      content: sley, configuration, .sley.yaml, config file, plugins, extensions, workspace, monorepo, settings, reference
---

# {{ $frontmatter.title }}

Complete reference for the `.sley.yaml` configuration file.

::: tip
For an overview of configuration methods and precedence, see [Configuration](/config/).
:::

## Basic Structure

```yaml
# Path to .version file
path: .version

# TUI theme (optional)
theme: sley

# Workspace configuration (monorepos only)
workspace:
  discovery:
    enabled: true

# Plugin configuration
plugins:
  commit-parser: true
  tag-manager:
    enabled: true
    # ... plugin options

# Extension configuration (optional)
extensions:
  - name: my-extension
    path: /path/to/extension
    enabled: true
```

## Top-Level Options

| Option              | Type   | Default    | Description                            |
| ------------------- | ------ | ---------- | -------------------------------------- |
| `path`              | string | `.version` | Path to the .version file              |
| `theme`             | string | `sley`     | TUI theme for interactive prompts      |
| `workspace`         | object | `{}`       | Workspace/monorepo configuration       |
| `plugins`           | object | `{}`       | Plugin configuration                   |
| `extensions`        | array  | `[]`       | Extension configuration                |
| `pre-release-hooks` | array  | `[]`       | Pre-release hook scripts (run on bump) |

## Path Configuration

The `path` option specifies the location of the `.version` file:

```yaml
# Default (recommended)
path: .version

# Custom filename
path: VERSION

# Custom location
path: ./config/.version
```

| Value                | Description                           |
| -------------------- | ------------------------------------- |
| `.version`           | Default. Version file in project root |
| `VERSION`            | Alternative filename (no dot prefix)  |
| `./path/to/.version` | Custom path relative to project root  |

::: tip
Most projects use the default `.version` in the project root. Custom paths are useful when integrating with existing version file conventions.
:::

## Theme Configuration

The `theme` option customizes the appearance of interactive TUI elements:

```yaml
theme: sley      # default
theme: catppuccin
theme: dracula
```

**Available themes**: `sley` (default), `base`, `base16`, `catppuccin`, `charm`, `dracula`

All themes except `sley` are provided by [charmbracelet/huh](https://github.com/charmbracelet/huh).

::: tip Configuration Priority
The theme can be configured in multiple ways with the following priority order:

1. **CLI flag** (highest): `--theme <name>`
2. **Environment variable**: `SLEY_THEME=<name>`
3. **Config file**: `theme: <name>` in `.sley.yaml`
4. **Default** (lowest): `sley`

Example:

```bash
# Override config file theme for a single command
sley --theme dracula bump minor

# Set theme for current session
export SLEY_THEME=catppuccin
sley bump patch
```

:::

## Workspace Configuration

For monorepos with multiple `.version` files. See [Monorepo Support](/guide/monorepo/) for a complete guide.

```yaml
workspace:
  versioning: independent
  discovery:
    enabled: true
    recursive: true
    module_max_depth: 10
    manifest_max_depth: 3
    exclude:
      - "testdata"
      - "examples"
      - "node_modules"

  # Optional: explicit module definitions
  modules:
    - name: api
      path: ./services/api/.version
      enabled: true
    - name: legacy
      path: ./legacy/.version
      enabled: false
```

### Versioning Mode

| Option       | Type   | Default       | Description                                     |
| ------------ | ------ | ------------- | ----------------------------------------------- |
| `versioning` | string | `coordinated` | Versioning mode: `independent` or `coordinated` |

- **`coordinated`** (default): `sley discover` warns on version mismatches between modules
- **`independent`**: Mismatch warnings suppressed - expected for independently versioned modules

::: info Workspace vs dependency-check

- **`workspace`** manages multiple `.version` files as independent version sources
- **`dependency-check`** syncs files TO a `.version` file (manifests and, in coordinated mode, submodule `.version` files)

See [Versioning Models](/guide/monorepo/versioning-models) for details.
:::

### Discovery Options

| Option               | Type     | Default | Description                                         |
| -------------------- | -------- | ------- | --------------------------------------------------- |
| `enabled`            | bool     | true    | Enable automatic discovery                          |
| `recursive`          | bool     | true    | Search subdirectories recursively                   |
| `module_max_depth`   | int      | 10      | Maximum directory depth for module `.version` files |
| `manifest_max_depth` | int      | 3       | Maximum directory depth for manifest files          |
| `exclude`            | []string | []      | Patterns to exclude from discovery                  |

### Module Definition

| Field     | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `name`    | string | yes      | Module name                    |
| `path`    | string | yes      | Path to .version file          |
| `enabled` | bool   | no       | Enable/disable (default: true) |

## Plugin Configuration

Plugins can be enabled with a simple boolean or with detailed configuration:

```yaml
plugins:
  # Simple enable
  commit-parser: true

  # Simple disable
  commit-parser: false

  # Detailed configuration
  tag-manager:
    enabled: true
    prefix: "v"
    annotate: true
    push: false
```

### Available Plugins

| Plugin                | Default  | Description                       |
| --------------------- | -------- | --------------------------------- |
| `commit-parser`       | enabled  | Analyze conventional commits      |
| `tag-manager`         | disabled | Git tag automation                |
| `version-validator`   | disabled | Version policy enforcement        |
| `dependency-check`    | disabled | Cross-file version sync           |
| `changelog-parser`    | disabled | Infer bump type from CHANGELOG.md |
| `changelog-generator` | disabled | Generate changelogs from commits  |
| `release-gate`        | disabled | Pre-bump quality gates            |
| `audit-log`           | disabled | Version history tracking          |

See [Plugin System](/plugins/) for detailed plugin configuration.

## Extension Configuration

```yaml
extensions:
  - name: docker-tag-sync
    path: /Users/username/.sley-extensions/docker-tag-sync
    enabled: true
    hooks:
      - post-bump
```

| Field     | Type     | Required | Description                    |
| --------- | -------- | -------- | ------------------------------ |
| `name`    | string   | yes      | Extension name                 |
| `path`    | string   | yes      | Path to extension directory    |
| `enabled` | bool     | no       | Enable/disable (default: true) |
| `hooks`   | []string | no       | Hooks to run (default: all)    |

## Complete Example

::: tip More Examples
Find individual plugin configuration examples in the [sley repository examples directory](https://github.com/indaco/sley/tree/main/docs/plugins/examples).
:::

```yaml
# .sley.yaml - Full configuration example
# All plugins working together

path: .version
theme: sley

plugins:
  # Commit Parser (enabled by default)
  commit-parser: true

  # Release Gate
  release-gate:
    enabled: true
    require-clean-worktree: true
    blocked-on-wip-commits: true
    require-ci-pass: false
    allowed-branches:
      - "main"
      - "release/*"
    blocked-branches:
      - "experimental/*"

  # Version Validator
  version-validator:
    enabled: true
    rules:
      - type: pre-release-format
        pattern: "^(alpha|beta|rc)(\\.[0-9]+)?$"
      - type: major-version-max
        value: 10
      - type: max-prerelease-iterations
        value: 10
      - type: require-even-minor
        enabled: false
      - type: branch-constraint
        branch: "release/*"
        allowed: ["patch"]
      - type: branch-constraint
        branch: "main"
        allowed: ["minor", "patch"]

  # Dependency Check
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
      - path: Chart.yaml
        field: version
        format: yaml
      - path: pyproject.toml
        field: tool.poetry.version
        format: toml
      - path: VERSION
        format: raw
      - path: src/version.go
        format: regex
        pattern: 'const Version = "(.*?)"'

  # Changelog Parser
  changelog-parser:
    enabled: true
    path: CHANGELOG.md
    require-unreleased-section: true
    infer-bump-type: true
    priority: commits

  # Changelog Generator
  changelog-generator:
    enabled: true
    mode: "both"
    format: "grouped"
    changes-dir: ".changes"
    changelog-path: "CHANGELOG.md"
    repository:
      auto-detect: true
    use-default-icons: true
    exclude-patterns:
      - "^Merge"
      - "^WIP"
      - "^fixup!"
      - "^squash!"
    include-non-conventional: false
    contributors:
      enabled: true
      show-new-contributors: true

  # Tag Manager
  tag-manager:
    enabled: true
    auto-create: true
    prefix: v
    annotate: true
    push: false
    tag-prereleases: false
    sign: false
    signing-key: ""
    message-template: "Release {version}"

  # Audit Log
  audit-log:
    enabled: true
    path: ".version-history.json"
    format: "json"
    include-author: true
    include-timestamp: true
    include-commit-sha: true
    include-branch: true

# Monorepo configuration
workspace:
  discovery:
    enabled: true
    recursive: true
    module_max_depth: 5
    manifest_max_depth: 3
    exclude:
      - "testdata"
      - "examples"
```

## Module-specific Configuration

In monorepos, each module can have its own `.sley.yaml` that overrides workspace settings. Use `{module_path}` in the root config, or per-module `.sley.yaml` files, or both.

### Using `{module_path}` Template Variable

A single root config with `{module_path}` in the tag prefix produces path-scoped tags for each module:

```yaml
# .sley.yaml (root) - single config for all modules
workspace:
  versioning: independent
  discovery:
    enabled: true
plugins:
  tag-manager:
    enabled: true
    prefix: "{module_path}/v"
```

- Root module → `v1.0.0` (`{module_path}` is empty, leading `/` trimmed)
- `cobra/` module → `cobra/v0.3.0`
- `services/api/` module → `services/api/v2.1.0`

See the [Tag Manager plugin](/plugins/tag-manager#monorepo-tag-formats-with-module-path) for details.

### Per-Module `.sley.yaml` Override

```yaml
# services/api/.sley.yaml
plugins:
  commit-parser: false
  tag-manager:
    enabled: true
    prefix: "api-v"
```

### Config Merge Behavior

When a module has its own `.sley.yaml`, sley merges it with the root config:

| Field                                                                              | Merge behavior                                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Plugin pointer fields** (tag-manager, version-validator, dependency-check, etc.) | Module non-nil value wins; otherwise root applies             |
| **`commit-parser`**                                                                | Root wins (workspace-level setting)                           |
| **`extensions`**                                                                   | Additive merge, deduplicated by name; module wins on conflict |
| **`pre-release-hooks`**                                                            | Additive merge; root hooks run first                          |
| **`path`, `theme`, `workspace`**                                                   | Root values only - not overridden by module                   |

## See Also

- [Configuration Overview](/config/) - Configuration methods and precedence
- [Environment Variables](/config/env-vars) - Environment variable configuration
- [CLI Reference](/reference/cli) - Command-line options
- [Plugin System](/plugins/) - Detailed plugin configuration
- [Extension System](/extensions/) - Extension configuration and hooks
- [Monorepo Support](/guide/monorepo/) - Multi-module setup guide
- [Troubleshooting](/guide/troubleshooting/) - Common configuration issues
