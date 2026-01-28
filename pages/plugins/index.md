---
title: "Plugin System"
description: "Built-in plugins for git tagging, changelog generation, version validation, and commit parsing. Extend sley functionality with native performance"
head:
  - - meta
    - name: keywords
      content: sley, plugins, extensions, git tags, changelog, version validation, commit parser, automation, plugin system
---

# {{ $frontmatter.title }}

## Overview

Plugins are **built-in** features that extend sley's core functionality. Unlike extensions (which are external scripts), plugins are compiled into the binary and provide deep integration with version bump logic.

## Available Plugins

| Plugin                                       | Description                                            | Default                                  |
| -------------------------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| [commit-parser](./commit-parser)             | Analyzes conventional commits to determine bump type   | <Badge type="tip" text="Enabled" />      |
| [tag-manager](./tag-manager)                 | Automatically creates git tags synchronized with bumps | <Badge type="warning" text="Disabled" /> |
| [version-validator](./version-validator)     | Enforces versioning policies and constraints           | <Badge type="warning" text="Disabled" /> |
| [dependency-check](./dependency-check)       | Validates and syncs versions across multiple files     | <Badge type="warning" text="Disabled" /> |
| [changelog-parser](./changelog-parser)       | Infers bump type from CHANGELOG.md entries             | <Badge type="warning" text="Disabled" /> |
| [changelog-generator](./changelog-generator) | Generates changelog from conventional commits          | <Badge type="warning" text="Disabled" /> |
| [release-gate](./release-gate)               | Pre-bump validation (clean worktree, branch, WIP)      | <Badge type="warning" text="Disabled" /> |
| [audit-log](./audit-log)                     | Records version changes with metadata to a log file    | <Badge type="warning" text="Disabled" /> |

::: info
The "Default" column shows which plugins are active when running sley without a `.sley.yaml` configuration file. When using `sley init --yes`, a recommended starting configuration is created with both `commit-parser` and `tag-manager` enabled.
:::

## Quick Start

Enable plugins in your `.sley.yaml`:

```yaml
plugins:
  # Analyze commits for automatic bump type detection
  commit-parser: true

  # Automatically create git tags after bumps
  tag-manager:
    enabled: true
    prefix: "v"
    annotate: true
    push: false

  # Enforce versioning policies
  version-validator:
    enabled: true
    rules:
      - type: "major-version-max"
        value: 10
      - type: "branch-constraint"
        branch: "release/*"
        allowed: ["patch"]

  # Sync versions across multiple files
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: "package.json"
        field: "version"
        format: "json"
```

## Execution Order

During a version bump, extensions and plugins execute in a specific order:

<ExecutionFlow
  command="sley bump patch"
  :phases="[
    {
      title: 'Pre-bump Extensions',
      type: 'extension',
      badge: 'Can abort',
      badgeType: 'warning',
      steps: [
        { name: 'Extensions (pre-bump)', description: 'Custom scripts run first, can modify .version file. Aborts on failure.' }
      ]
    },
    {
      title: 'Pre-bump Validation',
      type: 'validation',
      badge: 'Can abort',
      badgeType: 'warning',
      steps: [
        { name: 'release-gate', description: 'Validates pre-conditions (clean worktree, branch, WIP)' },
        { name: 'version-validator', description: 'Validates version policy' },
        { name: 'dependency-check', description: 'Validates file consistency' },
        { name: 'tag-manager', description: 'Validates tag does not exist' }
      ]
    },
    {
      title: 'Version Bump',
      type: 'action',
      steps: [
        { name: 'Version file updated', description: '.version file is written with new version' }
      ]
    },
    {
      title: 'Post-bump Actions',
      type: 'post',
      badge: 'Non-blocking',
      badgeType: 'info',
      steps: [
        { name: 'dependency-check', description: 'Syncs version to configured files' },
        { name: 'changelog-generator', description: 'Creates changelog entry' },
        { name: 'audit-log', description: 'Records version change to log file' },
        { name: 'tag-manager', description: 'Creates git tag' }
      ]
    },
    {
      title: 'Post-bump Extensions',
      type: 'extension',
      badge: 'Non-blocking',
      badgeType: 'info',
      steps: [
        { name: 'Extensions (post-bump)', description: 'Custom scripts for notifications, deployments, etc.' }
      ]
    }
  ]"
/>

::: tip Extensions Run First
Pre-bump extensions execute **before** plugin validations. This allows extensions to set up state (e.g., fetch a version from an external source and update `.version`) before plugins validate consistency. After pre-bump extensions complete, sley re-reads the `.version` file to pick up any changes.
:::

::: info Command Coverage
The execution flow above shows the complete `bump` command flow. Not all commands trigger all plugins. Simpler commands like `pre` and `set` only trigger the `dependency-check` plugin for syncing versions across files.
:::

## Plugin Command Coverage

Different sley commands trigger different subsets of plugins:

| Plugin              | Commands That Trigger It |
| ------------------- | ------------------------ |
| dependency-check    | `bump *`, `pre`, `set`   |
| release-gate        | `bump *` only            |
| version-validator   | `bump *` only            |
| tag-manager         | `bump *` only            |
| changelog-generator | `bump *` only            |
| audit-log           | `bump *` only            |
| commit-parser       | `bump auto` only         |
| changelog-parser    | `bump auto` only         |

**Command notes:**

- `bump *` includes all bump variants: `bump major`, `bump minor`, `bump patch`, `bump auto`
- `pre` command triggers only `dependency-check` for syncing pre-release versions
- `set` command triggers only `dependency-check` for syncing explicitly set versions

## When to Use Plugins vs Extensions

### Use Plugins When

- **Performance matters**: Plugins execute in <1ms with native Go performance
- **Feature is widely applicable**: Common versioning needs across many projects
- **Deep integration needed**: Requires tight coupling with bump logic or validation
- **Built-in reliability required**: No external dependencies or installation steps
- **Examples**: Git tagging, conventional commit parsing, version validation, file syncing

### Use Extensions When

- **Custom to your workflow**: Organization-specific automation or processes
- **Requires external tools**: Need to call AWS CLI, curl, custom scripts, etc.
- **Prototyping new features**: Testing ideas before proposing as built-in plugins
- **Language-specific needs**: Python/Node.js/Ruby tooling integration
- **Examples**: Custom notification systems, deployment triggers, proprietary tool integration

## Plugin vs Extension Comparison

| Feature           | Plugins                              | Extensions                      |
| ----------------- | ------------------------------------ | ------------------------------- |
| **Compilation**   | Built-in, compiled with CLI          | External scripts                |
| **Performance**   | Native Go, <1ms                      | Shell/Python/Node, ~50-100ms    |
| **Installation**  | None required                        | `sley extension install`        |
| **Configuration** | `.sley.yaml` plugins section         | `.sley.yaml` extensions section |
| **Use Case**      | Core version logic, validation, sync | Hook-based automation           |

::: tip
Most users will only need plugins. Extensions are for advanced customization and organization-specific workflows.
:::

## Common Workflow Patterns

### Auto-Bump + Changelog

```bash
sley bump auto
# commit-parser analyzes commits -> determines bump type
# changelog-generator creates versioned changelog entry
```

### Auto-Bump + Tag + Push

```bash
sley bump auto
# commit-parser analyzes commits -> bump type
# tag-manager validates tag doesn't exist
# Version updated -> tag created and pushed
```

### Full CI/CD Pipeline

```bash
sley bump auto
# Pre-bump: version-validator, dependency-check, tag-manager validation
# Bump: commit-parser determines type, version updated
# Post-bump: files synced, changelog generated, tag created
```

## See Also

- [Extension System](/extensions/) - Create custom automation hooks
- [.sley.yaml Reference](/reference/sley-yaml) - Complete plugin configuration reference
- [CI/CD Integration](/guide/ci-cd) - Automate plugins in pipelines
- [Usage Guide](/guide/usage) - Learn how plugins integrate with commands
- [Configuration](/config/) - Configuration methods and precedence
- [Troubleshooting](/guide/troubleshooting/) - Common plugin issues
