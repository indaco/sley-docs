---
title: "Troubleshooting: Plugin Errors"
description: "Solutions for sley plugin errors including plugin not found, release gate validation, changelog generation, and dependency check issues"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, plugins, errors, release gate, changelog generator, dependency check
---

# {{ $frontmatter.title }}

This page covers common issues related to sley plugins.

## `Error: plugin not found: [plugin-name]`

**Cause**: Referencing a plugin that doesn't exist or has a typo in `.sley.yaml`.

**Solutions**:

```bash
# Check available plugins
sley help

# Valid plugin names:
# - commit-parser
# - tag-manager
# - version-validator
# - dependency-check
# - changelog-parser
# - changelog-generator
# - release-gate
# - audit-log
```

Fix your `.sley.yaml`:

```yaml
plugins:
  # Wrong
  tag-manager-plugin: true

  # Correct
  tag-manager:
    enabled: true
```

## `Error: release gate validation failed: working tree is not clean`

**Cause**: The `release-gate` plugin is enabled and you have uncommitted changes.

**Solutions**:

```bash
# Option 1: Commit your changes
git add .
git commit -m "chore: prepare for release"

# Option 2: Stash changes temporarily
git stash
sley bump patch
git stash pop

# Option 3: Disable release-gate temporarily
sley bump patch --skip-hooks

# Option 4: Disable in configuration
# Edit .sley.yaml:
plugins:
  release-gate:
    enabled: false
```

## `Error: release gate validation failed: not on allowed branch`

**Cause**: The `release-gate` plugin has branch constraints and you're on a restricted branch.

**Solutions**:

```bash
# Check your current branch
git branch --show-current

# Option 1: Switch to an allowed branch
git checkout main

# Option 2: Configure allowed branches in .sley.yaml:
plugins:
  release-gate:
    enabled: true
    branch-allow-list:
      - main
      - release/*
      - hotfix/*
```

## `Error: changelog-generator: no commits found since last version`

**Cause**: No commits exist between the current version and the previous tag.

**Solutions**:

This is actually a warning, not an error. The plugin will create an empty changelog entry.

```bash
# Check git history
git log --oneline

# If you have commits but no previous tag:
# This happens on first run - the changelog will include all commits
sley bump patch

# If you genuinely have no commits:
# Make changes first, then bump
git add .
git commit -m "feat: add new feature"
sley bump minor
```

## `Error: changelog-generator: failed to detect repository`

**Cause**: Git repository has no remote configured for link generation.

**Solutions**:

```bash
# Option 1: Add a git remote
git remote add origin https://github.com/user/repo.git

# Option 2: Manually configure repository in .sley.yaml
```

```yaml
plugins:
  changelog-generator:
    repository:
      auto-detect: false
      provider: "github"
      owner: "user"
      repo: "repo"
```

## `Error: changelog-generator: failed to parse changelog template`

**Cause**: Custom header template file contains invalid syntax.

**Solutions**:

```bash
# Verify the template file exists
ls -l .changes/header.md

# Check template syntax - valid placeholders are:
# {version}, {date}, {tag}
```

## `Error: dependency-check: version mismatch in package.json`

**Cause**: The `dependency-check` plugin found inconsistent versions across files.

**Solutions**:

```bash
# Option 1: Enable auto-sync to fix automatically
# Edit .sley.yaml:
plugins:
  dependency-check:
    enabled: true
    auto-sync: true

# Option 2: Manually sync the version
# Update package.json version to match .version
sley show  # Get current version
# Edit package.json manually

# Option 3: Disable the plugin
plugins:
  dependency-check:
    enabled: false
```

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [Plugin System](/plugins/) - Plugin documentation
- [Release Gate](/plugins/release-gate) - Release gate configuration
- [Changelog Generator](/plugins/changelog-generator) - Changelog generation
