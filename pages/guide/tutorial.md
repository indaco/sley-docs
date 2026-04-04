---
title: "From Init to Tag"
description: "Step-by-step tutorial to set up version management with sley, from initialization to version bumps, git tags, and changelog generation"
head:
  - - meta
    - name: keywords
      content: sley, tutorial, getting started, beginner, version management, semantic versioning, walkthrough
---

# {{ $frontmatter.title }}

This tutorial walks you through setting up sley in a new project, from initialization to your first version bump, git tag, and changelog. Follow the steps top to bottom.

**Prerequisites:**

- sley installed ([Installation Guide](/guide/installation))
- Git installed and configured
- A project directory (can be empty or existing)

**Time:** ~10 minutes

## Step 1: Initialize Your Project

Create a project directory and initialize sley:

```bash
mkdir my-project && cd my-project
git init
sley init
```

An interactive TUI appears so you can select plugins:

![sley init TUI](/screenshots/sley_init_tui.png)

sley creates two files:

- **`.version`** - contains your version number (default `0.0.0`)
- **`.sley.yaml`** - plugin configuration

::: tip Non-interactive setup
`sley init --yes` skips the TUI and enables `commit-parser` and `tag-manager` with defaults.
:::

::: tip Migrating an existing project?
If your project already has a version in `package.json`, `Cargo.toml`, or a similar file, run `sley init --migrate` to detect and import it:

![sley init --migrate](/screenshots/sley_init_migrate.png)
:::

## Step 2: Make Your First Commit

Add some content and commit using [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
echo "# My Project" > README.md
git add .
git commit -m "feat: initial project setup"
```

The `feat:` prefix tells sley this commit introduces a new feature, which matters when using `sley bump auto`.

## Step 3: Bump the Version

Bump the minor version to reflect the new feature:

```bash
sley bump minor
# Bumped version from 0.0.0 to 0.1.0

sley show
# 0.1.0
```

::: tip Bump types
| Command | Result | When to use |
|---|---|---|
| `sley bump patch` | `0.1.0 → 0.1.1` | Bug fixes |
| `sley bump minor` | `0.1.0 → 0.2.0` | New features (backwards compatible) |
| `sley bump major` | `0.1.0 → 1.0.0` | Breaking changes |
| `sley bump auto` | Inferred | Let commit history decide |

`sley bump auto` requires `commit-parser` to be enabled. It maps `fix:` → patch, `feat:` → minor, `feat!:` / `BREAKING CHANGE:` → major.
:::

::: tip Auto-commit and tag on bump
If `tag-manager` has `auto-create: true` in `.sley.yaml`, `sley bump` automatically commits `.version` and creates the git tag. No manual `git commit` needed.
:::

## Step 4: Create a Git Tag

If `tag-manager` is enabled and `auto-create` is not set, create the tag manually:

```bash
sley tag create
# Created tag v0.1.0
```

To create and push in one command:

```bash
sley tag create --push
```

## Step 5: Generate and Merge the Changelog

Enable `changelog-generator` in `.sley.yaml`:

```yaml
plugins:
  commit-parser: true
  tag-manager:
    enabled: true
  changelog-generator:
    enabled: true
    mode: "versioned"
```

On the next bump, sley writes a versioned changelog to `.changes/`:

```bash
sley bump minor
# Bumped version from 0.1.0 to 0.2.0
# .changes/v0.2.0.md generated
```

When you are ready to consolidate all versioned changelogs into `CHANGELOG.md`:

```bash
sley changelog merge
```

## Simplified Workflow

Once configured, the typical day-to-day workflow is:

```bash
# Commit work using conventional format
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"

# Bump version (auto-infers from commits)
sley bump auto

# Create and push tag
sley tag create --push

# Commit and push version file
git add .version .changes/
git commit -m "chore: release $(sley show)"
git push
```

## What's Next?

- [Usage Guide](/guide/usage) - all commands and options
- [Pre-release Versions](/guide/pre-release) - alpha, beta, RC workflows
- [CI/CD Integration](/guide/ci-cd) - automate in GitHub Actions, GitLab CI
- [Plugin System](/plugins/) - configure plugins for your workflow
- [Monorepo Support](/guide/monorepo/) - multi-module version management

## Troubleshooting

| Issue                    | Solution                                                |
| ------------------------ | ------------------------------------------------------- |
| "version file not found" | Run `sley init` to create `.version`                    |
| "invalid version format" | Ensure `.version` contains only `X.Y.Z` (no `v` prefix) |
| "tag already exists"     | Bump to a new version or delete the existing tag        |
| Commands not working     | Run `sley doctor` to validate your setup                |

See the [Troubleshooting Guide](/guide/troubleshooting/) for more help.
