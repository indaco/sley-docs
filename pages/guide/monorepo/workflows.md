---
title: "Monorepo Workflows"
description: "Command workflows for managing versions in monorepos"
head:
  - - meta
    - name: keywords
      content: sley, monorepo workflows, version management, multi-module, command usage
---

# {{ $frontmatter.title }}

Practical command workflows for each versioning model.

## Initialize a Workspace

Detects monorepo markers (go.work, pnpm-workspace.yaml, package.json workspaces, Cargo.toml workspace), creates `.sley.yaml` with `{module_path}/v` prefix, and `.version` files per module.

```bash
sley init --yes --workspace
```

Generated configuration:

```yaml
# .sley.yaml
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

Generated files:

```text
adapters/redis/.version   # discovered submodule
```

::: tip
The root `.version` file is not created automatically in workspace mode. Create it manually or run `sley init` (without `--workspace`) first.
:::

## Show All Module Versions

```bash
sley show --all
#   ✓ root (.version): 1.0.0
#   ✓ adapters/redis (adapters/redis/.version): 0.3.2
```

## Bump All Modules

Runs the full plugin pipeline per module - the same steps as a single-module bump:

1. **Pre-bump**: extension hooks and validations (release gate, version policy, dependency consistency, tag availability) run for all modules first. If any module fails, no versions are written.
2. **Bump**: version files are updated (supports `--parallel`).
3. **Post-bump**: changelog generation, dependency sync, audit log, extension hooks, commit, and tag creation run sequentially per module.

```bash
sley bump patch --all
#   ✓ root (.version): 1.0.0 -> 1.0.1
#   ✓ adapters/redis (adapters/redis/.version): 0.3.2 -> 0.3.3
```

## Tag All Modules

Reads each module's version, resolves its tag prefix, and creates a Git tag. Existing tags are skipped (info message, not fatal). Reports a summary if any module fails.

```bash
sley tag create --all
#   ✓ root: v1.0.1
#   ✓ adapters/redis: adapters/redis/v0.3.3
```

## Bump Then Tag

```bash
sley bump patch --all
sley tag create --all
```

## Bump a Specific Module

Runs the full pipeline (pre-bump validation, version write, changelog, tags, audit log, dep-check, extension hooks) for the named module.

```bash
sley bump minor --module auth
#   ✓ auth (services/auth/.version): 1.5.3 -> 1.6.0
```

## Coordinated Release

For single-root or coordinated versioning. Bump root once; `dependency-check` syncs all configured files.

```bash
sley bump minor
# Sync dependencies
#   ✓ backend/.version: 1.1.0
#   ✓ frontend/.version: 1.1.0
#   ✓ frontend/package.json: 1.1.0
# Success: Version bumped to 1.1.0 and synced to 3 file(s)

sley tag create --push
```

## Batch Pre-release

```bash
# Set all modules to beta
sley bump pre --all --label beta
#   ✓ api: 2.1.0 -> 2.1.0-beta.1
#   ✓ auth: 1.5.3 -> 1.5.3-beta.1

# Release to stable
sley bump release --all
#   ✓ api: 2.1.0-beta.1 -> 2.1.0
#   ✓ auth: 1.5.3-beta.1 -> 1.5.3
```

## Interactive Module Selection

Without `--all` or `--module`, you get an interactive prompt:

```bash
sley bump patch
# Found 3 modules with .version files:
#   - api (2.1.0)
#   - web (1.5.0)
#   - core (3.2.0)
#
# ? How would you like to proceed?
#   > Apply to all modules
#     Select specific modules...
#     Cancel
```

## Command Examples by Versioning Model

### Coordinated Versioning

```bash
# Show all synced modules (same version)
sley show --all

# Set all modules to new version
sley set 2.1.0 --all

# Validate all modules
sley doctor --all
```

### Independent Versioning

```bash
# Show all module versions (different versions)
sley show --all

# Show specific module
sley show --module core

# Set specific module version
sley set 4.0.0 --module core
```

## CI/CD Example (GitHub Actions)

```yaml
name: Release
on:
  workflow_dispatch:
    inputs:
      bump_type:
        description: "Bump type"
        required: true
        type: choice
        options: [patch, minor, major]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install sley
        run: |
          curl -L https://github.com/indaco/sley/releases/latest/download/sley-linux-amd64 -o sley
          chmod +x sley && sudo mv sley /usr/local/bin/

      - name: Bump and tag
        run: |
          sley bump ${{ inputs.bump_type }} --all
          sley tag create --all --push

      - name: Commit
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "chore: bump all modules (${{ inputs.bump_type }})"
          git push
```

## Advanced Scenarios

### Partial Module Bumps

Bump only modules that match a pattern:

```bash
# Bump all services but not packages
sley bump patch --pattern "services/*"

# Bump all frontend apps
sley bump minor --pattern "apps/*"
```

### Parallel Execution

For large monorepos, `--parallel` speeds up the version-file writes. Pre-bump validations and post-bump actions (changelog, tags, audit log, extension hooks) always run sequentially per module.

```bash
sley bump patch --all --parallel
```

### Continue on Error

Don't stop if one module fails:

```bash
sley bump patch --all --continue-on-error
#   ✓ api (services/api/.version): 2.1.0 -> 2.1.1
#   ✗ auth (services/auth/.version): invalid version format
#   ✓ notifications (services/notifications/.version): 3.0.0 -> 3.0.1
# Warning: 1 module failed, 2 succeeded
```

### Dry Run Testing

Test version changes safely before committing:

```bash
git checkout -b test-bump
sley bump patch --all
# Review changes
git diff
# Revert if needed
git checkout main
git branch -D test-bump
```

## Practical Examples

### Go Backend + SvelteKit Frontend (Coordinated)

One version for the entire app, but `.version` files needed for Go embed and Vite:

```yaml
# .sley.yaml
path: .version
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: backend/.version
        format: raw
      - path: frontend/.version
        format: raw
      - path: frontend/package.json
        field: version
        format: json
```

```bash
sley bump minor
# Syncs to backend/.version, frontend/.version, frontend/package.json
```

### Microservices (Independent)

Each service releases independently:

```yaml
# .sley.yaml
workspace:
  versioning: independent
  discovery:
    enabled: true
plugins:
  tag-manager:
    enabled: true
    prefix: "{module_path}/v"
```

```bash
sley bump patch --module api
sley tag create --module api --push
```

## What's Next?

- [Configuration](/guide/monorepo/configuration) - Complete configuration examples
- [Versioning Models](/guide/monorepo/versioning-models) - Understand the three models
- [CLI Reference](/reference/cli#bump) - All flags and options
