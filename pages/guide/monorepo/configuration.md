---
title: "Monorepo Configuration"
description: "Configuration reference for single-root, coordinated versioning, and independent versioning models"
head:
  - - meta
    - name: keywords
      content: sley, configuration, monorepo, sley.yaml, dependency-check, workspace, versioning
---

# {{ $frontmatter.title }}

Configuration examples for each versioning model.

## Single-Root Configuration

One `.version` file at the root; manifests sync to it via `dependency-check`.

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
      - path: pyproject.toml
        field: project.version
        format: toml
      - path: VERSION
        format: raw
```

## Coordinated Versioning Configuration

Multiple `.version` files, all synced to root via `dependency-check`.

```yaml
# .sley.yaml (root)
path: .version

plugins:
  commit-parser: true
  tag-manager:
    enabled: true

  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
      - path: backend/.version
        format: raw
      - path: frontend/.version
        format: raw
      - path: frontend/package.json
        field: version
        format: json
```

## Independent Versioning Configuration (Workspace)

Each module has its own version. The `workspace.versioning` field controls behavior:

- **`coordinated`** (default): `sley discover` warns on version mismatches across modules
- **`independent`**: mismatch warnings are suppressed - expected when modules version independently

```yaml
# .sley.yaml (root)
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
      - "fixtures"
```

### Tag Prefix with `{module_path}`

Use `{module_path}` in `plugins.tag-manager.prefix` to produce path-scoped Git tags per module. Works with any monorepo layout - Go, Rust, Node, Python, or mixed.

```yaml
# .sley.yaml (root)
workspace:
  versioning: independent
  discovery:
    enabled: true

plugins:
  commit-parser: true
  tag-manager:
    enabled: true
    prefix: "{module_path}/v"
```

For a workspace with a root module and an `adapters/redis` submodule, this produces:

| Module                    | Version | Tag                     |
| ------------------------- | ------- | ----------------------- |
| Root (`.version`)         | 1.0.0   | `v1.0.0`                |
| `adapters/redis/.version` | 0.1.0   | `adapters/redis/v0.1.0` |

The root module's `{module_path}` resolves to empty, and the leading `/` is trimmed automatically, producing `v1.0.0` (not `/v1.0.0`).

::: warning
Using `{module_path}` in `prefix` without a `workspace` section triggers a config validation warning. The variable resolves to empty outside workspace mode.
:::

### Explicit Module Definition

```yaml
# .sley.yaml (root)
workspace:
  versioning: independent
  discovery:
    enabled: false

  modules:
    - name: api
      path: ./services/api/.version
      enabled: true

    - name: auth
      path: ./services/auth/.version
      enabled: true

    - name: legacy
      path: ./legacy/.version
      enabled: false # Skip this module
```

### Mixed: Discovery + Explicit Modules

Explicit module entries override discovered ones.

```yaml
# .sley.yaml (root)
workspace:
  versioning: independent
  discovery:
    enabled: true
    exclude:
      - "testdata"

  modules:
    - name: api
      path: ./services/api/.version
      enabled: true

plugins:
  commit-parser: true
  tag-manager:
    enabled: true
    prefix: "{module_path}/v"
```

## Per-Module Configuration

A module can have its own `.sley.yaml` that overrides root plugin settings. The merge rules:

| What                                                             | Behavior                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------- |
| **Plugin pointer fields** (tag-manager, version-validator, etc.) | Module non-nil value wins; otherwise root applies             |
| **Extensions and pre-release-hooks**                             | Additive merge, deduplicated by name; module wins on conflict |
| **commit-parser**                                                | Root wins (workspace-level setting)                           |
| **path, workspace**                                              | Root values only - not overridden by module config            |

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

## What's Next?

- [Versioning Models](/guide/monorepo/versioning-models) - Understand when to use each model
- [Workflows](/guide/monorepo/workflows) - Command examples for each model
- [Workspace Configuration Reference](/reference/sley-yaml#workspace-configuration) - Complete field reference
