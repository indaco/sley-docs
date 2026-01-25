---
title: "Troubleshooting: CI/CD Issues"
description: "Solutions for CI/CD pipeline errors including interactive prompts, permission denied, detached HEAD, and uncommitted changes"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, CI/CD, GitHub Actions, GitLab CI, errors, automation
---

# {{ $frontmatter.title }}

This page covers common issues when running sley in CI/CD environments.

::: tip
For CI/CD workflow setup and examples, see the [CI/CD Integration Guide](/guide/ci-cd).
:::

## `Error: Unexpected interactive prompts in CI/CD` {#error-unexpected-interactive-prompts-in-cicd}

**Cause**: CI environment not detected, or interactive mode not explicitly disabled.

**Solutions**:

```bash
# Option 1: Set CI environment variable
CI=true sley bump patch

# Option 2: Use explicit flags
sley bump patch --non-interactive
sley bump patch --all  # For monorepo, operate on all modules

# Option 3: Use --yes flag
sley bump patch --yes
```

**See also**: [CI/CD Integration Guide](/guide/ci-cd) for workflow examples.

## `Error: permission denied in CI/CD` {#error-permission-denied-in-cicd}

**Cause**: CI user doesn't have write access to files or git.

**Solutions for GitHub Actions**:

```yaml
- uses: actions/checkout@v6
  with:
    fetch-depth: 0 # Important: fetch full history
    token: ${{ secrets.GITHUB_TOKEN }} # Use token with write access

- name: Configure git
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"

- name: Bump version
  run: sley bump patch --strict
```

**See also**: [CI/CD Integration Guide](/guide/ci-cd) for workflow examples.

## `Error: detached HEAD state in CI/CD` {#error-detached-head-state-in-cicd}

**Cause**: CI checkout is in detached HEAD state (common in pull request builds).

**Solutions**:

```yaml
# GitHub Actions
- uses: actions/checkout@v6
  with:
    ref: ${{ github.head_ref }} # Checkout the actual branch

# Or skip version bumping in PR builds
- name: Bump version
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  run: sley bump patch
```

**See also**: [CI/CD Integration Guide](/guide/ci-cd) for workflow examples.

## `Error: Version bump works but changes aren't committed`

**Cause**: Workflow doesn't commit and push changes.

**Solutions**:

```yaml
# Complete CI/CD workflow example
- name: Bump version
  run: sley bump patch

- name: Commit changes
  run: |
    git add .version
    # If using dependency-check or changelog-generator:
    git add package.json CHANGELOG.md .changes/
    git commit -m "chore: bump version to $(sley show)" || exit 0
    git push
```

**See also**: [CI/CD Integration Guide](/guide/ci-cd) for workflow examples.

## `Error: shallow clone insufficient for changelog generation`

**Cause**: CI checkout used shallow clone (`fetch-depth: 1`), which prevents accessing full git history.

**Solutions**:

```yaml
# GitHub Actions - fetch full history
- uses: actions/checkout@v6
  with:
    fetch-depth: 0 # Fetch entire history

# Or fetch specific depth for performance
- uses: actions/checkout@v6
  with:
    fetch-depth: 50 # Last 50 commits
```

## `Error: concurrent workflow runs cause conflicts`

**Cause**: Multiple workflow runs trying to bump versions simultaneously.

**Solutions**:

```yaml
# GitHub Actions - use concurrency control
concurrency:
  group: version-bump-${{ github.ref }}
  cancel-in-progress: false # Don't cancel, wait for previous run

# Or use manual triggers only
on:
  workflow_dispatch:
    inputs:
      bump_type:
        description: "Version bump type"
        required: true
        type: choice
        options:
          - patch
          - minor
          - major
```

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [CI/CD Integration Guide](/guide/ci-cd) - Complete CI/CD setup
- [Monorepo Issues](./monorepo) - Multi-module CI/CD issues
