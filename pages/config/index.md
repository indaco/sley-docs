---
title: "Configuration"
description: "Configure sley via command-line flags, environment variables, or .sley.yaml file"
head:
  - - meta
    - name: keywords
      content: sley, configuration, config, .sley.yaml, environment variables, CLI flags, setup, precedence
---

# {{ $frontmatter.title }}

sley resolves configuration in this order (highest priority first):

1. **Command-line flags**
2. **Environment variables**
3. **`.sley.yaml` configuration file**
4. **Default values**

## Quick Start

No configuration file is required. sley works out-of-the-box with sensible defaults.

```bash
# Initialize with defaults (creates .sley.yaml)
sley init --yes

# Or just start using sley - it auto-initializes
sley bump patch
```

## Auto-initialization

When the `.version` file does not exist, sley:

1. Reads the latest Git tag via `git describe --tags`
2. Uses it if it is a valid semantic version
3. Otherwise initializes to `0.0.0`

Use `--strict` to disable this:

```bash
sley bump patch --strict
# => Error: .version file not found
```

## Minimal .sley.yaml

```yaml
path: .version
theme: sley

plugins:
  commit-parser: true
  tag-manager:
    enabled: true
    prefix: "v"
```

## Monorepo Setup

For monorepos, add a `workspace` section to the root `.sley.yaml`. Optionally add a `.sley.yaml` in each module directory to override plugin settings.

**Root `.sley.yaml`:**

```yaml
path: .version

workspace:
  versioning: independent # or "coordinated" (default)
  discovery:
    enabled: true

plugins:
  tag-manager:
    enabled: true
    prefix: "{module_path}/v"
```

**Per-module `.sley.yaml` (optional override):**

```yaml
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
```

### Versioning Modes

| Mode                    | Behavior                                                                    |
| ----------------------- | --------------------------------------------------------------------------- |
| `coordinated` (default) | `sley discover` warns on version mismatches between modules                 |
| `independent`           | Mismatch warnings suppressed - expected for independently versioned modules |

### Config Merge Rules

When a module has its own `.sley.yaml`, sley merges it with the root config:

| Field                                     | Merge behavior                               |
| ----------------------------------------- | -------------------------------------------- |
| Plugin pointer fields (tag-manager, etc.) | Module non-nil value wins                    |
| `commit-parser`                           | Root wins (workspace-level setting)          |
| `extensions`, `pre-release-hooks`         | Additive; module entry wins on name conflict |
| `path`, `theme`, `workspace`              | Root only - module values ignored            |

## Configuration Methods

| Method                | Use Case                                                     | Documentation                     |
| --------------------- | ------------------------------------------------------------ | --------------------------------- |
| `.sley.yaml`          | Project-level configuration, plugin settings, monorepo setup | [Reference](/reference/sley-yaml) |
| Environment variables | CI/CD pipelines, session-level overrides                     | [Reference](./env-vars)           |
| Command-line flags    | One-off overrides, scripting                                 | [CLI Reference](/reference/cli)   |

## See Also

- [.sley.yaml Reference](/reference/sley-yaml) - Complete configuration file reference
- [Environment Variables](./env-vars) - Available environment variables and CI detection
- [CLI Reference](/reference/cli) - Command-line flags and options
- [Plugin System](/plugins/) - Plugin configuration and execution order
- [Monorepo Support](/guide/monorepo/) - Multi-module workspace setup
- [Troubleshooting](/guide/troubleshooting/) - Common configuration issues
