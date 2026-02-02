---
title: "Troubleshooting: Advanced Topics"
description: "Advanced troubleshooting including debugging workflows, version rollback, performance optimization, and migration issues"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, debugging, rollback, performance, migration, advanced
---

# {{ $frontmatter.title }}

This page covers advanced troubleshooting topics including debugging, rollback, performance, and migration.

## Debugging Workflows

### Dry-run Testing

While sley doesn't have a built-in `--dry-run` flag, you can test safely:

```bash
# Option 1: Use git to revert changes
git status  # Check current state
sley bump patch
git diff .version  # See what changed
git restore .version  # Undo if needed

# Option 2: Work in a test branch
git checkout -b test-version-bump
sley bump patch
# Review changes
git checkout main
git branch -D test-version-bump

# Option 3: Use separate version file for testing
sley set 1.0.0 --path /tmp/.version
sley bump patch --path /tmp/.version
cat /tmp/.version
```

### Verify Plugin Execution

```bash
# Check which plugins are enabled
cat .sley.yaml

# Test with skip-hooks to isolate issues
sley bump patch --skip-hooks

# Enable verbose output for plugins
sley bump patch --verbose
```

## Version Rollback

If you need to undo a version bump:

```bash
# Method 1: Manual rollback
sley set 1.2.3  # Set back to previous version

# Method 2: Git revert (if changes were committed)
git log --oneline -5  # Find the commit
git revert <commit-hash>

# Method 3: Git reset (if not pushed yet)
git reset --hard HEAD^

# Method 4: If tag was created
git tag -d v1.2.4          # Delete local tag
git push origin :refs/tags/v1.2.4  # Delete remote tag
```

::: warning
Always use version control (git) to track version changes. This makes rollback simple and safe.
:::

## Performance Issues

### Slow Module Discovery

**Cause**: Deep directory structures or large excluded directories.

**Solutions**:

```yaml
# Reduce max depth in .sley.yaml
workspace:
  discovery:
    module_max_depth: 5 # Default is 10
    manifest_max_depth: 2 # Default is 3

    # Add more exclusions
    exclude:
      - "**/node_modules"
      - "**/vendor"
      - "**/.cache"
      - "**/build"
```

### Slow Changelog Generation

**Cause**: Large git history or many commits.

**Solutions**:

```yaml
# Limit commit range or use shallow clones in CI/CD
# GitHub Actions:
- uses: actions/checkout@v6
  with:
    fetch-depth: 50  # Last 50 commits only

# Or exclude more commit types
plugins:
  changelog-generator:
    exclude-patterns:
      - "^chore"
      - "^docs"
      - "^test"
```

## Migration Issues

### `Error: no version source detected during migration`

**Cause**: Using `sley init --migrate` but no supported version files found.

**Supported version sources**:

- `package.json` (JavaScript/Node.js)
- `Cargo.toml` (Rust)
- `pyproject.toml` (Python)
- `setup.py` (Python)
- `VERSION` file
- Git tags

**Solutions**:

```bash
# Check for version sources
cat package.json | grep version
git tag -l

# If no version source exists, use init without --migrate
sley init
sley set 0.0.0
```

### `Error: multiple version sources detected`

**Cause**: Ambiguous migration with multiple version files.

**Solutions**:

```bash
# sley will prompt you to choose
sley init --migrate
# Select from the list

# Or specify the version manually
sley init
sley set 1.2.3
```

### Migrating from Other Tools

**From standard-version or semantic-release**:

```bash
# Get current version from package.json
VERSION=$(node -p "require('./package.json').version")

# Initialize sley with that version
sley init
sley set $VERSION

# Configure plugins to match previous behavior
# Edit .sley.yaml as needed
```

**From manual version management**:

```bash
# Find latest git tag
git describe --tags --abbrev=0

# Initialize with that version
sley init
sley set 1.2.3
```

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [Configuration Reference](/config/) - Configuration options
- [CI/CD Integration](/guide/ci-cd) - CI/CD workflows
- [Quick Start](/guide/quick-start) - Getting started guide
