---
title: "Quick Start"
description: "Get up and running with sley version management in under 5 minutes"
head:
  - - meta
    - name: keywords
      content: sley, quick start, getting started, version management, semantic versioning, installation
---

# {{ $frontmatter.title }}

## Install

```bash
brew install indaco/tap/sley
```

::: details Other installation methods
See [Installation](/guide/installation) for go install, asdf, prebuilt binaries, and build from source.
:::

## Single-Module Track

### 1. Initialize

```bash
sley init --yes
# Created .version with version 0.0.0
# Created .sley.yaml with default plugins (commit-parser, tag-manager)
```

### 2. Bump version

```bash
sley bump patch            # 0.0.0 -> 0.0.1
sley bump minor            # 0.0.1 -> 0.1.0
```

### 3. Create your first tag

```bash
sley tag create --push
# Created tag v0.1.0
# Pushed to origin
```

::: tip
Use `sley init --migrate` if your project already has a version in `package.json`, `Cargo.toml`, or similar. sley detects and imports it.
:::

## Monorepo Track

For projects with `go.work`, `pnpm-workspace.yaml`, `package.json` workspaces, or `Cargo.toml` workspace.

### 1. Initialize workspace

```bash
sley init --workspace --yes
# Detected monorepo: go.work
# Created .sley.yaml (versioning: independent, prefix: {module_path}/v)
# Created adapters/redis/.version (0.0.0)
# Created cmd/cli/.version (0.0.0)
```

### 2. Bump a module

```bash
sley bump patch --module cli
#   ✓ cli (cmd/cli/.version): 0.0.0 -> 0.0.1
```

### 3. Tag all modules

```bash
sley tag create --all --push
#   ✓ root: v0.0.0
#   ✓ adapters/redis: adapters/redis/v0.0.0
#   ✓ cmd/cli: cmd/cli/v0.0.1
```

## More Commands

```bash
sley show                  # Display current version
sley bump auto             # Smart bump from commit messages
sley bump pre --label beta # Pre-release: 1.0.0-beta
sley bump release          # Promote pre-release to stable
sley doctor                # Validate setup and configuration
sley discover              # Scan for version sources
```

## What's Next?

- [Usage Guide](/guide/usage) - All commands and flags
- [Monorepo Support](/guide/monorepo/) - Versioning models and workspace config
- [Pre-release Versions](/guide/pre-release) - Alpha, beta, RC workflows
- [CI/CD Integration](/guide/ci-cd) - Automate versioning in pipelines
