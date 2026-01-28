---
title: "CI/CD Integration"
description: "Integrate sley version management into GitHub Actions, GitLab CI, and other CI/CD pipelines with automated version bumping and tagging"
head:
  - - meta
    - name: keywords
      content: sley, CI/CD, GitHub Actions, GitLab CI, automation, continuous integration, version bumping, git tags, workflow
---

# {{ $frontmatter.title }}

`sley` works seamlessly in CI/CD environments with automatic detection of CI platforms, non-interactive mode, and strict validation.

## Quick Setup

Get started with this minimal GitHub Actions workflow:

```yaml
name: Version Bump
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

      - name: Bump version
        run: sley bump ${{ inputs.bump_type }} --strict

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .version
          git commit -m "chore: bump version to $(sley show)"
          git push
```

## Key Concepts

### CI Environment Detection

`sley` automatically detects when running in CI/CD environments (GitHub Actions, GitLab CI, CircleCI, Travis CI, Jenkins, etc.) and:

- **Disables interactive prompts** - No hanging on user input
- **Uses non-interactive mode** - Commands proceed without confirmation
- **Adjusts output formatting** - Machine-readable output for logs

### Strict Mode

Use `--strict` flag to fail if the `.version` file is missing:

```bash
sley bump patch --strict
# Error: .version file not found (if missing)
```

This prevents auto-initialization behavior and ensures explicit version management in CI/CD pipelines.

### Non-Interactive Mode

For scripts and CI/CD, explicitly disable interactive prompts:

```bash
# Explicit flag
sley bump patch --non-interactive

# Via environment variable
CI=true sley bump patch
```

## Installation Methods

### Prebuilt Binary (Recommended for CI/CD)

```bash
# Linux AMD64
curl -L https://github.com/indaco/sley/releases/latest/download/sley-linux-amd64 -o sley
chmod +x sley
sudo mv sley /usr/local/bin/

# Linux ARM64
curl -L https://github.com/indaco/sley/releases/latest/download/sley-linux-arm64 -o sley
chmod +x sley
sudo mv sley /usr/local/bin/

# macOS AMD64
curl -L https://github.com/indaco/sley/releases/latest/download/sley-darwin-amd64 -o sley
chmod +x sley
sudo mv sley /usr/local/bin/

# macOS ARM64 (Apple Silicon)
curl -L https://github.com/indaco/sley/releases/latest/download/sley-darwin-arm64 -o sley
chmod +x sley
sudo mv sley /usr/local/bin/
```

### Go Install

```bash
go install github.com/indaco/sley/cmd/sley@latest
```

## GitHub Actions

### Version Bump Workflow

Manual trigger with selectable bump type:

```yaml
name: Version Bump
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

      - name: Bump version
        run: sley bump ${{ inputs.bump_type }} --strict

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .version
          git commit -m "chore: bump version to $(sley show)"
          git push

      - name: Create and push tag
        run: sley tag create --push
```

### Auto-Bump on Merge

Automatically bump version when changes are merged to main:

```yaml
name: Auto Version Bump
on:
  push:
    branches: [main]

jobs:
  bump:
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, 'chore: bump version')"
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Install sley
        run: |
          curl -L https://github.com/indaco/sley/releases/latest/download/sley-linux-amd64 -o sley
          chmod +x sley
          sudo mv sley /usr/local/bin/

      - name: Auto-bump version
        run: sley bump auto --strict

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "chore: bump version to $(sley show)" || exit 0
          git push
```

## GitLab CI

```yaml
version:bump:
  stage: deploy
  image: golang:1.25
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
  script:
    - go install github.com/indaco/sley/cmd/sley@latest
    - sley bump patch --strict
    - git config user.name "GitLab CI"
    - git config user.email "ci@gitlab.com"
    - git add .version
    - git commit -m "chore: bump version to $(sley show)"
    - git push https://oauth2:${CI_JOB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git HEAD:${CI_COMMIT_BRANCH}
    - sley tag create --push
```

## Docker Integration

Inject version into Docker image builds:

```dockerfile
FROM alpine:latest
ARG VERSION
LABEL version="${VERSION}"
COPY . /app
```

```bash
# Build with version from sley
docker build --build-arg VERSION=$(sley show) -t myapp:$(sley show) .
```

## Monorepo CI/CD

For monorepos, use `--all`, `--module`, or `--modules` flags to specify which modules to operate on:

```yaml
name: Bump All Modules
on:
  workflow_dispatch:

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
        run: sley bump patch --all

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "chore: bump all modules"
          git push
```

See [Monorepo Support](/guide/monorepo/) for discovery, configuration, and detailed examples.

## Common Errors

Quick reference for CI/CD-specific issues. For comprehensive troubleshooting with additional solutions and edge cases, see the [Troubleshooting Guide](/guide/troubleshooting/ci-cd).

### `Error: permission denied: .version`

**Cause:** CI/CD runner doesn't have write permissions to the `.version` file.

**Solution:**

```yaml
# GitHub Actions - ensure full checkout with permissions
- uses: actions/checkout@v6
  with:
    fetch-depth: 0
    persist-credentials: true
```

**Additional checks:**

```bash
# Verify file permissions in CI
ls -la .version

# Ensure .version is not tracked in .gitignore
cat .gitignore | grep -v "^#" | grep ".version"
```

[See all solutions →](/guide/troubleshooting/ci-cd#error-permission-denied-in-cicd)

### `Error: fatal: You are in 'detached HEAD' state`

**Cause:** CI/CD pipeline checked out a specific commit instead of a branch.

**Solution:**

```yaml
# GitHub Actions - checkout the actual branch
- uses: actions/checkout@v6
  with:
    ref: ${{ github.head_ref }}  # For PRs
    # OR
    ref: ${{ github.ref }}         # For branch pushes
```

**For GitLab CI:**

```yaml
before_script:
  - git checkout ${CI_COMMIT_REF_NAME}
```

[See all solutions →](/guide/troubleshooting/ci-cd#error-detached-head-state-in-cicd)

### `Error: interactive prompt requested in non-interactive environment`

**Cause:** Command requires user input but CI/CD environment doesn't support interactive prompts.

**Solution:**

```bash
# Use explicit non-interactive flags
sley bump patch --all              # Multi-module: operate on all
sley bump auto --yes               # Skip confirmation prompts
CI=true sley bump patch            # Force non-interactive mode
```

**For multi-module projects:**

```bash
# Always use explicit flags in CI/CD
sley bump patch --all                # Bump all modules
sley bump patch --module api         # Bump specific module
sley bump patch --modules api,web    # Bump multiple modules
```

[See all solutions →](/guide/troubleshooting/ci-cd#error-unexpected-interactive-prompts-in-cicd)

### `Error: git command failed`

**Cause:** Git configuration missing or insufficient permissions.

**Solution:**

```yaml
# Configure git identity
- name: Configure git
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"

# Verify git is available
- name: Check git
  run: |
    which git
    git --version
```

### `Error: no changes to commit`

**Cause:** Version file hasn't changed (possibly already at target version).

**Solution:**

```bash
# Use || exit 0 to continue on no changes
git commit -m "chore: bump version" || exit 0

# Or check if changes exist before committing
if git diff --quiet .version; then
  echo "No version changes"
else
  git commit -m "chore: bump version"
fi
```

---

For comprehensive CI/CD troubleshooting including CircleCI, advanced scenarios, and platform-specific issues, see the [CI/CD Issues](/guide/troubleshooting/ci-cd) section in the Troubleshooting Guide.

## What's Next?

Choose your path based on your needs:

**Enhancing your CI/CD workflow?**

- [Tag Manager](/plugins/tag-manager) - Automate git tag creation and push
- [Changelog Generator](/plugins/changelog-generator) - Generate changelogs in pipelines
- [Release Gate](/plugins/release-gate) - Enforce quality gates before releases

**Working with monorepos?**

- [Monorepo Support](/guide/monorepo/) - Multi-module version management
- [Workspace Configuration](/reference/sley-yaml#workspace-configuration) - Configure module discovery

**Docker integration?**

- [Docker Tag Sync Extension](/extensions/docker-tag-sync) - Tag Docker images with versions
- [Extensions](/extensions/) - Create custom automation hooks

**Need help?**

- [Environment Variables](/config/env-vars) - CI environment configuration
- [Troubleshooting](/guide/troubleshooting/) - Common CI/CD issues
