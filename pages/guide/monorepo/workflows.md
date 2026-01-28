---
title: "Monorepo Workflows"
description: "Practical examples and workflows for managing versions in monorepos with real-world scenarios"
head:
  - - meta
    - name: keywords
      content: sley, monorepo workflows, version management, practical examples, command usage, multi-module
---

# {{ $frontmatter.title }}

Practical examples and real-world workflows for each versioning model.

## Command Examples by Versioning Model

Understanding how `show`, `set`, and `doctor` commands work across different versioning models:

### Single-Root Commands

In single-root projects, commands operate on the single `.version` file:

```bash
# Show current version
$ sley show
1.0.0

# Set version manually
$ sley set 2.0.0

# Validate version file and configuration
$ sley doctor
Configuration Validation:
  ✓ [PASS] YAML Syntax
  ✓ [PASS] Plugin Configuration

Version File Validation:
  ✓ [PASS] .version exists and is valid (2.0.0)
```

### Coordinated Versioning Commands

In coordinated versioning, use `--all` to view all synced modules (all have the same version):

```bash
# Show all synced modules
$ sley show --all
Version Summary
  ✓ coordinated-versioning (.version): 2.0.0
  ✓ api (services/api/.version): 2.0.0
  ✓ web (services/web/.version): 2.0.0

# Set all modules to new version
$ sley set 2.1.0 --all
Set version to 2.1.0
  ✓ coordinated-versioning (.version): 2.0.0 -> 2.1.0
  ✓ api (services/api/.version): 2.0.0 -> 2.1.0
  ✓ web (services/web/.version): 2.0.0 -> 2.1.0

# Validate all modules
$ sley doctor --all
Configuration Validation:
  ✓ [PASS] YAML Syntax
  ✓ [PASS] Plugin Configuration

Validation Summary
  ✓ coordinated-versioning (.version): 2.1.0
  ✓ api (services/api/.version): 2.1.0
  ✓ web (services/web/.version): 2.1.0
```

### Independent Versioning Commands

In independent versioning, each module has its own version:

```bash
# Show all module versions
$ sley show --all
  ✓ root (.version): 1.0.0
  ✓ web (apps/web/.version): 0.5.0-beta.1
  ✓ core (packages/core/.version): 3.2.1
  ✓ utils (packages/utils/.version): 2.0.0

# Show specific module version
$ sley show --module core
3.2.1

# Set specific module version
$ sley set 4.0.0 --module core
  ✓ core (packages/core/.version): 3.2.1 -> 4.0.0

# Set all modules to same version (rare use case)
$ sley set 1.0.0 --all
  ✓ root (.version): 1.0.0 -> 1.0.0
  ✓ web (apps/web/.version): 0.5.0-beta.1 -> 1.0.0
  ✓ core (packages/core/.version): 4.0.0 -> 1.0.0
  ✓ utils (packages/utils/.version): 2.0.0 -> 1.0.0

# Validate all modules
$ sley doctor --all
Configuration Validation:
  ✓ [PASS] YAML Syntax
  ✓ [PASS] Plugin Configuration

Validation Summary
  ✓ root (.version): 1.0.0
  ✓ web (apps/web/.version): 1.0.0
  ✓ core (packages/core/.version): 1.0.0
  ✓ utils (packages/utils/.version): 1.0.0

# Validate specific module
$ sley doctor --module web
Configuration Validation:
  ✓ [PASS] YAML Syntax
  ✓ [PASS] Plugin Configuration

Version File Validation:
  ✓ web (apps/web/.version): 1.0.0
```

## Practical Examples

### Example 1: Go Backend + SvelteKit Frontend

**Project Structure:**

```text
my-app/
├── .version              # 1.0.0
├── backend/
│   ├── .version          # Need for //go:embed
│   └── main.go
└── frontend/
    ├── .version          # Need for Vite plugin
    ├── package.json
    └── vite.config.js
```

**Best choice:** Coordinated versioning

**Why:** You want one version for the entire app, but need separate `.version` files for technical reasons (Go embed, Vite plugin).

**Configuration:**

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

**Usage:**

```bash
# Bump root version - automatically syncs to all configured files
$ sley bump minor

Sync dependencies
  ✓ backend (.version): 1.1.0
  ✓ frontend (.version): 1.1.0
  ✓ frontend/package.json: 1.1.0

Success: Version bumped to 1.1.0 and synced to 3 file(s)
```

### Example 2: Microservices with Independent Releases

**Project Structure:**

```text
services/
├── api/
│   ├── .version          # 2.1.0
│   └── Cargo.toml
├── auth/
│   ├── .version          # 1.5.3
│   └── package.json
└── notifications/
    ├── .version          # 3.0.0
    └── pyproject.toml
```

**Best choice:** Independent versioning (workspace)

**Why:** Each service releases independently with its own version.

**Configuration:**

```yaml
# .sley.yaml (root)
workspace:
  discovery:
    enabled: true
    recursive: true
```

**Usage:**

```bash
# Bump all services at once
$ sley bump patch --all

Bump patch
  ✓ api (services/api/.version): 2.1.0 -> 2.1.1
  ✓ auth (services/auth/.version): 1.5.3 -> 1.5.4
  ✓ notifications (services/notifications/.version): 3.0.0 -> 3.0.1

Success: 3 modules updated

# Bump specific service
$ sley bump minor --module auth

Bump minor
  ✓ auth (services/auth/.version): 1.5.4 -> 1.6.0

Success: 1 module updated
```

### Example 3: Library with Multiple Build Targets

**Project Structure:**

```text
my-lib/
├── .version              # 1.2.3
├── package.json
├── Cargo.toml
├── Chart.yaml
└── VERSION
```

**Best choice:** Single-root

**Why:** One library, one version, multiple manifest files.

**Configuration:**

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
      - path: VERSION
        format: raw
```

**Usage:**

```bash
# Bump version - syncs to all manifest files
$ sley bump patch

Sync dependencies
  ✓ package.json: 1.2.4
  ✓ Cargo.toml: 1.2.4
  ✓ Chart.yaml: 1.2.4
  ✓ VERSION: 1.2.4

Success: Version bumped to 1.2.4 and synced to 4 file(s)
```

## Multi-Module Workflows

### Workflow 1: Release All Modules Together

For coordinated versioning:

```bash
# 1. Bump root version
$ sley bump minor

Sync dependencies
  ✓ api (services/api/.version): 2.0.0
  ✓ web (services/web/.version): 2.0.0

Success: Version bumped to 2.0.0 and synced to 2 file(s)

# 2. Create git tag
$ sley tag create --push

# 3. Commit changes
$ git add .version services/*/. version
$ git commit -m "chore: release v2.0.0"
$ git push
```

### Workflow 2: Release Specific Modules

For independent versioning:

```bash
# 1. Bump specific module
$ sley bump patch --module api

Bump patch
  ✓ api (services/api/.version): 2.1.0 -> 2.1.1

Success: 1 module updated

# 2. Create module-specific tag (if tag-manager supports it)
$ sley tag create --module api --push

# 3. Commit changes
$ git add services/api/.version
$ git commit -m "chore(api): release v2.1.1"
$ git push
```

### Workflow 3: Batch Update Pre-releases

```bash
# Set all modules to beta pre-release
$ sley bump pre --all --label beta

Bump pre
  ✓ api (services/api/.version): 2.1.0 -> 2.1.0-beta.1
  ✓ web (services/web/.version): 1.5.0 -> 1.5.0-beta.1
  ✓ core (packages/core/.version): 3.2.0 -> 3.2.0-beta.1

Success: 3 modules updated

# Iterate on beta releases
$ sley bump pre --all

Bump pre
  ✓ api (services/api/.version): 2.1.0-beta.1 -> 2.1.0-beta.2
  ✓ web (services/web/.version): 1.5.0-beta.1 -> 1.5.0-beta.2
  ✓ core (packages/core/.version): 3.2.0-beta.1 -> 3.2.0-beta.2

Success: 3 modules updated

# Release all to stable
$ sley bump release --all

Bump release
  ✓ api (services/api/.version): 2.1.0-beta.2 -> 2.1.0
  ✓ web (services/web/.version): 1.5.0-beta.2 -> 1.5.0
  ✓ core (packages/core/.version): 3.2.0-beta.2 -> 3.2.0

Success: 3 modules updated
```

### Workflow 4: Interactive Module Selection

```bash
# Without --all or --module, get interactive prompt
$ sley bump patch

Found 3 modules with .version files:
  - api (2.1.0)
  - web (1.5.0)
  - core (3.2.0)

? How would you like to proceed?
  > Apply to all modules
    Select specific modules...
    Cancel

# Select specific modules interactively
? Select modules to bump:
  [x] api (2.1.0)
  [ ] web (1.5.0)
  [x] core (3.2.0)

Bump patch
  ✓ api (services/api/.version): 2.1.0 -> 2.1.1
  ✓ core (packages/core/.version): 3.2.0 -> 3.2.1

Success: 2 modules updated
```

## CI/CD Integration

For monorepos, use `--all`, `--module`, or `--modules` flags to specify which modules to operate on.

### GitHub Actions: Bump All Modules

```yaml
name: Bump All Modules
on:
  workflow_dispatch:
    inputs:
      bump_type:
        description: "Bump type"
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  bump:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Install sley
        run: |
          curl -L https://github.com/indaco/sley/releases/latest/download/sley-linux-amd64 -o sley
          chmod +x sley
          sudo mv sley /usr/local/bin/

      - name: Bump all modules
        run: sley bump ${{ inputs.bump_type }} --all

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "chore: bump all modules to ${{ inputs.bump_type }}"
          git push
```

### GitHub Actions: Bump Specific Module

```yaml
name: Bump Specific Module
on:
  workflow_dispatch:
    inputs:
      module:
        description: "Module name"
        required: true
        type: string
      bump_type:
        description: "Bump type"
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  bump:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Install sley
        run: |
          curl -L https://github.com/indaco/sley/releases/latest/download/sley-linux-amd64 -o sley
          chmod +x sley
          sudo mv sley /usr/local/bin/

      - name: Bump module
        run: sley bump ${{ inputs.bump_type }} --module ${{ inputs.module }}

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "chore(${{ inputs.module }}): bump to ${{ inputs.bump_type }}"
          git push
```

## Advanced Scenarios

### Scenario 1: Partial Module Bumps

Bump only modules that match a pattern:

```bash
# Bump all services but not packages
$ sley bump patch --pattern "services/*"

# Bump all frontend apps
$ sley bump minor --pattern "apps/*"
```

### Scenario 2: Parallel Execution

For large monorepos with many independent modules:

```bash
# Run bumps in parallel
$ sley bump patch --all --parallel

Bump patch (parallel)
  ✓ api (services/api/.version): 2.1.0 -> 2.1.1
  ✓ auth (services/auth/.version): 1.5.3 -> 1.5.4
  ✓ notifications (services/notifications/.version): 3.0.0 -> 3.0.1
  ✓ web (apps/web/.version): 1.2.0 -> 1.2.1

Success: 4 modules updated in 1.2s (parallel)
```

### Scenario 3: Continue on Error

Don't stop if one module fails:

```bash
$ sley bump patch --all --continue-on-error

Bump patch
  ✓ api (services/api/.version): 2.1.0 -> 2.1.1
  ✗ auth (services/auth/.version): invalid version format
  ✓ notifications (services/notifications/.version): 3.0.0 -> 3.0.1

Warning: 1 module failed, 2 succeeded
```

### Scenario 4: Dry Run

Preview what would happen without making changes:

```bash
$ sley bump patch --all --dry-run

Dry run: Would bump patch for:
  - api (services/api/.version): 2.1.0 -> 2.1.1
  - auth (services/auth/.version): 1.5.3 -> 1.5.4
  - notifications (services/notifications/.version): 3.0.0 -> 3.0.1

No changes made (dry run)
```

## What's Next?

- [Monorepo Support](/guide/monorepo/) - Overview and getting started
- [Versioning Models](/guide/monorepo/versioning-models) - Understand the three models
- [Configuration](/guide/monorepo/configuration) - Complete configuration examples
- [CI/CD Integration](/guide/ci-cd) - Automate multi-module version bumps
