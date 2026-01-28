---
title: "Quick Start"
description: "Get up and running with sley version management in under a minute with this quick start guide and installation instructions"
head:
  - - meta
    - name: keywords
      content: sley, quick start, getting started, version management, semantic versioning, installation, tutorial
---

# {{ $frontmatter.title }}

Get up and running with sley in under a minute.

## Install

```bash
brew install indaco/tap/sley
```

::: details Other installation methods
See [Installation](/guide/installation) for all installation options (go install, asdf, prebuilt binaries, build from source).
:::

## Try It

### Project Setup

```bash
# Quick setup - automatically detect and configure your project
sley discover
# Output:
#   Scanning for version sources...
#   Found: package.json (1.2.3)
#   Creating .version and .sley.yaml...
#   ✓ Initialized

# Or initialize manually
sley init                  # Interactive: select plugins
sley init --migrate        # Import version from existing package.json/Cargo.toml
```

### Version Operations

```bash
# Display current version
sley show
# Output: 1.2.3

# Bump versions
sley bump patch            # 1.2.3 -> 1.2.4
sley bump minor            # 1.2.4 -> 1.3.0
sley bump auto             # Smart bump: strips pre-release or bumps patch

# Set version manually
sley set 2.0.0 --pre beta  # 1.3.0 -> 2.0.0-beta
```

### Pre-release Versions

```bash
# Increment pre-release counter
sley bump pre              # 2.0.0-beta -> 2.0.0-beta.1
sley bump pre              # 2.0.0-beta.1 -> 2.0.0-beta.2

# Switch pre-release label
sley bump pre --label rc   # 2.0.0-beta.2 -> 2.0.0-rc.1

# Release to stable
sley bump release          # 2.0.0-rc.1 -> 2.0.0
```

### Git Integration

```bash
# Create and push git tag
sley tag create --push
# Output:
#   Created tag v2.0.0
#   Pushed to origin

# Merge versioned changelogs
sley changelog merge
# Output:
#   Merged 3 changelog(s) into CHANGELOG.md
```

### Validation

```bash
# Validate setup and configuration
sley doctor
# Output:
#   Configuration Validation:
#     ✓ [PASS] YAML Syntax
#     ✓ [PASS] Plugin Configuration
#
#   Version File Validation:
#     ✓ [PASS] .version exists and is valid (2.0.0)
```

::: tip
sley works out-of-the-box with sensible defaults. Create a `.sley.yaml` only when you need to customize behavior.
:::

## What's Next?

**Learn all commands:**

- [Usage](/guide/usage) - Detailed guide for all commands
- [Tutorial](/guide/tutorial) - Step-by-step walkthrough from init to tag

**Work with pre-releases:**

- [Pre-release Versions](/guide/pre-release) - Alpha, beta, and RC workflows
- [Changelog Generator](/plugins/changelog-generator) - Generate changelogs from commits

**Automate your workflow:**

- [CI/CD Integration](/guide/ci-cd) - Automated versioning in pipelines
- [Plugin System](/plugins/) - Extend sley with plugins

**Manage multiple modules:**

- [Monorepo Support](/guide/monorepo/) - Multi-module version management
- [Versioning Models](/guide/monorepo/versioning-models) - Choose the right model
