---
title: "CI/CD Integration"
description: "Integrate sley version management into GitHub Actions, GitLab CI, and other CI/CD pipelines with automated version bumping and tagging"
head:
  - - meta
    - name: keywords
      content: sley, CI/CD, GitHub Actions, GitLab CI, automation, continuous integration, version bumping, git tags, workflow
---

# {{ $frontmatter.title }}

`sley` works seamlessly in CI/CD environments with the `--strict` flag for strict mode and auto-detection of CI environments.

## GitHub Actions

### Version Bump Workflow

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

### Auto-bump on Merge

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

## Docker Integration <Badge type="info" text="Tip" />

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

## Strict Mode

Use `--strict` flag in CI/CD to fail if the `.version` file is missing:

```bash
sley bump patch --strict
# => Error: .version file not found (if missing)
```

This prevents auto-initialization behavior and ensures explicit version management.

## Environment Detection

`sley` auto-detects CI environments (GitHub Actions, GitLab CI, CircleCI, etc.) and automatically:

- Disables interactive prompts
- Uses non-interactive mode for multi-module operations
- Adjusts output formatting

## Non-interactive Mode

For scripts and CI/CD, use `--non-interactive` or set `CI=true`:

```bash
# Explicit flag
sley bump patch --non-interactive

# Or via environment
CI=true sley bump patch
```

## Common errors

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

[See all solutions →](/guide/troubleshooting/ci-cd#error-permission-denied-in-cicd)

### `Error: fatal: You are in 'detached HEAD' state`

**Cause:** CI/CD pipeline checked out a specific commit instead of a branch.

**Solution:**

```yaml
# Checkout the actual branch
- uses: actions/checkout@v6
  with:
    ref: ${{ github.head_ref }} # For PRs
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

[See all solutions →](/guide/troubleshooting/ci-cd#error-unexpected-interactive-prompts-in-cicd)

---

For comprehensive CI/CD troubleshooting including GitLab CI, CircleCI, and advanced scenarios, see the [CI/CD Issues](/guide/troubleshooting/ci-cd) section in the Troubleshooting Guide.

## Monorepo CI/CD

For monorepos, use `--all`, `--module`, or `--modules` flags to specify which modules to operate on.

See [Monorepo Support](/guide/monorepo) for discovery, configuration, and detailed examples.

## What's Next?

Choose your path based on your needs:

**Enhancing your CI/CD workflow?**

- [Tag Manager](/plugins/tag-manager) - Automate git tag creation and push
- [Changelog Generator](/plugins/changelog-generator) - Generate changelogs in pipelines
- [Release Gate](/plugins/release-gate) - Enforce quality gates before releases

**Working with monorepos?**

- [Monorepo Support](/guide/monorepo) - Multi-module version management
- [Workspace Configuration](/reference/sley-yaml#workspace-configuration) - Configure module discovery

**Docker integration?**

- [Docker Tag Sync Extension](/extensions/docker-tag-sync) - Tag Docker images with versions
- [Extensions](/extensions/) - Create custom automation hooks

**Need help?**

- [Environment Variables](/config/env-vars) - CI environment configuration
- [Troubleshooting](/guide/troubleshooting/) - Common CI/CD issues
