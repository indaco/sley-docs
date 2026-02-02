---
title: "Configuration"
description: "Configure sley via command-line flags, environment variables, or .sley.yaml file. Learn about configuration precedence and auto-initialization"
head:
  - - meta
    - name: keywords
      content: sley, configuration, config, .sley.yaml, environment variables, CLI flags, setup, precedence
---

# {{ $frontmatter.title }}

sley can be configured through multiple methods, with the following precedence order:

1. **Command-line flags** (highest priority)
2. **Environment variables**
3. **`.sley.yaml` configuration file**
4. **Default values** (lowest priority)

## Quick Start

Most users don't need a configuration file to get started. sley works out-of-the-box with sensible defaults.

```bash
# Initialize with defaults (creates .sley.yaml)
sley init --yes

# Or just start using sley - it auto-initializes
sley bump patch
```

## Auto-initialization

If the `.version` file does not exist when running the CLI:

1. It tries to read the latest Git tag via `git describe --tags`
2. If the tag is a valid semantic version, it is used
3. Otherwise, the file is initialized to `0.0.0`

This ensures your project always has a starting point.

**To disable auto-initialization**, use the `--strict` flag:

```bash
sley bump patch --strict
# => Error: .version file not found
```

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
- [Usage Guide](/guide/usage) - Initialize and configure your project
- [Troubleshooting](/guide/troubleshooting/) - Common configuration issues
