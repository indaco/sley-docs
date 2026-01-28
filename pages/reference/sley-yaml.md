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

| Option       | Type   | Default    | Description                      |
| ------------ | ------ | ---------- | -------------------------------- |
| `path`       | string | `.version` | Path to the .version file        |
| `workspace`  | object | `{}`       | Workspace/monorepo configuration |
| `plugins`    | object | `{}`       | Plugin configuration             |
| `extensions` | array  | `[]`       | Extension configuration          |

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

## Workspace Configuration

For monorepos with multiple `.version` files. See [Monorepo Support](/guide/monorepo/) for a complete guide.

```yaml
workspace:
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

::: info Workspace vs dependency-check
These configurations serve different purposes:

- **`workspace`** - Manages multiple **`.version` files** as independent version sources (independent versioning)
- **`dependency-check`** - Syncs files TO a `.version` file (manifest files and, in coordinated versioning, submodule `.version` files)

**Important:** The role of `.version` files depends on your versioning model:
- **Independent versioning** (workspace): Each `.version` file is a source of truth
- **Coordinated versioning**: Submodule `.version` files sync TO the root `.version` file
- **Single-root**: Only one `.version` file exists (always a source)

See [Understanding Versioning Models](/guide/monorepo/#understanding-versioning-models) for detailed guidance.
:::

### When to Use Workspace Configuration

| Scenario                                   | Use Workspace? | Recommended Model                          |
| ------------------------------------------ | -------------- | ------------------------------------------ |
| Multiple independently-versioned modules   | Yes            | Independent versioning (workspace)         |
| Monorepo with packages released separately | Yes            | Independent versioning (workspace)         |
| Multiple `.version` files, same version    | No             | Coordinated versioning (`dependency-check`)|
| Single module with multiple manifest files | No             | Single-root (`dependency-check`)           |
| All files share the same version           | No             | Single-root or coordinated versioning      |

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

In monorepos, each module can have its own `.sley.yaml` that overrides workspace settings:

```yaml
# services/api/.sley.yaml
path: .version
plugins:
  commit-parser: false # Disable for this module
  tag-manager:
    enabled: true
    prefix: "api-v" # Module-specific prefix
```

## See Also

- [Configuration Overview](/config/) - Configuration methods and precedence
- [Environment Variables](/config/env-vars) - Environment variable configuration
- [CLI Reference](/reference/cli) - Command-line options
- [Plugin System](/plugins/) - Detailed plugin configuration
- [Extension System](/extensions/) - Extension configuration and hooks
- [Monorepo Support](/guide/monorepo/) - Multi-module setup guide
- [Troubleshooting](/guide/troubleshooting/) - Common configuration issues
