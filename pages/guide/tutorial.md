---
title: "From Init to Tag"
description: "Step-by-step tutorial to set up version management with sley, from initialization to version bumps, git tags, and changelog generation"
head:
  - - meta
    - name: keywords
      content: sley, tutorial, getting started, beginner, version management, semantic versioning, walkthrough
---

# {{ $frontmatter.title }}

This tutorial walks you through setting up sley in a new project, making your first version bump, creating git tags, and generating a changelog. By the end, you'll have a complete versioning workflow.

**Prerequisites:**

- sley installed ([Installation Guide](/guide/installation))
- Git installed and configured
- A project directory (can be empty or existing)

**Time:** ~10 minutes

## Core Steps

These steps establish the essential versioning workflow.

### Step 1: Initialize Your Project

Start by creating or navigating to your project directory:

```bash
mkdir my-project
cd my-project
git init
```

Now initialize sley:

```bash
sley init
```

You'll see an interactive TUI to select plugins and configure your project:

![sley init TUI](/screenshots/sley_init_tui.png)

Select the plugins you want (you can always change this later). sley creates two files:

- **`.version`** - Contains your version number (e.g., `0.1.0`)
- **`.sley.yaml`** - Configuration file for plugins

```bash
cat .version
# Output: 0.1.0

cat .sley.yaml
# Output:
# plugins:
#   commit-parser: true
#   tag-manager:
#     enabled: true
```

::: tip Migrating an Existing Project?
If your project already has a version in `package.json`, `Cargo.toml`, or another file:

```bash
sley init --migrate
```

sley will detect and import the existing version:

![sley init --migrate](/screenshots/sley_init_migrate.png)
:::

**Success criteria:**
- ✓ `.version` file created with initial version
- ✓ `.sley.yaml` configuration file created
- ✓ Files committed to git (optional but recommended)

### Step 2: Make Your First Commit

Let's create some content and commit it:

```bash
echo "# My Project" > README.md
git add .
git commit -m "feat: initial project setup"
```

Notice we used a **conventional commit** format (`feat:` prefix). This tells sley that this commit adds a new feature.

**Success criteria:**
- ✓ Initial files committed to git
- ✓ Commit message follows conventional format

### Step 3: Understand Version Bump Types

Before bumping, understand what each bump type does:

| Command           | Example       | When to Use                         |
| ----------------- | ------------- | ----------------------------------- |
| `sley bump patch` | 0.2.0 → 0.2.1 | Bug fixes, small changes            |
| `sley bump minor` | 0.2.0 → 0.3.0 | New features (backwards compatible) |
| `sley bump major` | 0.2.0 → 1.0.0 | Breaking changes                    |
| `sley bump auto`  | Automatic     | Let commit history decide           |

### Step 4: Bump Your Version

Now bump the version. Since we added a feature, let's bump the minor version:

```bash
sley bump minor
```

Output:

```text
Bumped version from 0.1.0 to 0.2.0
```

Check the result:

```bash
sley show
# Output: 0.2.0
```

**Success criteria:**
- ✓ Version bumped to 0.2.0
- ✓ `.version` file updated
- ✓ `sley show` displays new version

### Step 5: Create a Git Tag

If you enabled `tag-manager`, create and push a git tag:

```bash
sley tag create
```

Output:

```text
Created tag v0.2.0
```

Verify the tag:

```bash
git tag -l
# Output: v0.2.0
```

To create and push in one command:

```bash
sley tag create --push
```

**Success criteria:**
- ✓ Git tag created for version
- ✓ Tag visible in `git tag -l`
- ✓ Tag pushed to remote (if using `--push`)

### Step 6: Commit Your Version Changes

After bumping, commit your changes:

```bash
git add .version
git commit -m "chore: release v0.2.0"
git push && git push --tags
```

**Success criteria:**
- ✓ Version changes committed
- ✓ Changes pushed to remote
- ✓ Tags synced with remote

## Optional Enhancements

These steps add changelog generation and automated workflows.

### Step 7: Add Changelog Generation (Optional)

Let's enable changelog generation. Edit `.sley.yaml`:

```yaml
plugins:
  commit-parser: true
  tag-manager:
    enabled: true
  changelog-generator:
    enabled: true
    mode: "versioned" # Creates .changes/vX.Y.Z.md files
```

Make another commit and bump:

```bash
echo "console.log('hello');" > index.js
git add index.js
git commit -m "feat: add main entry point"

sley bump minor
```

sley now generates a changelog file:

```bash
cat .changes/v0.3.0.md
```

```markdown
## v0.3.0 - 2024-01-15

### Enhancements

- **feat:** add main entry point
```

**Success criteria:**
- ✓ Changelog file generated in `.changes/`
- ✓ Changelog includes recent commits
- ✓ Changelog formatted correctly

#### Merge Changelogs

When you're ready to consolidate all versioned changelogs:

```bash
sley changelog merge
```

This creates or updates `CHANGELOG.md` with all versions.

**Success criteria:**
- ✓ `CHANGELOG.md` created or updated
- ✓ All version changelogs merged
- ✓ Changelogs ordered by version

### Step 8: Automate with `bump auto` (Optional)

Instead of manually choosing `patch`, `minor`, or `major`, let sley decide based on your commits:

```bash
git commit -m "fix: correct typo in README"
sley bump auto
```

Output:

```text
Inferred bump type: patch
Bumped version from 0.3.0 to 0.3.1
```

The `commit-parser` plugin analyzes commits since the last tag:

- `feat:` → minor bump
- `fix:` → patch bump
- `feat!:` or `BREAKING CHANGE:` → major bump

**Success criteria:**
- ✓ Correct bump type inferred from commits
- ✓ Version bumped automatically
- ✓ No manual intervention needed

## Simplified Workflow

Here's the typical sley workflow once configured:

```bash
# 1. Make changes and commit with conventional format
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"

# 2. Bump version (auto-detects from commits)
sley bump auto

# 3. Create and push tag
sley tag create --push

# 4. Commit and push changes
git add .version .changes/
git commit -m "chore: release $(sley show)"
git push
```

**For manual version control:**

```bash
# Choose bump type explicitly
sley bump patch   # or minor, or major

# Rest is the same
sley tag create --push
git add .version
git commit -m "chore: release $(sley show)"
git push
```

## What's Next?

You now have a working sley setup. Explore further:

**Enhance your workflow:**

- [Usage Guide](/guide/usage) - All commands and options
- [Pre-release Versions](/guide/pre-release) - Alpha, beta, RC workflows
- [CI/CD Integration](/guide/ci-cd) - Automate in GitHub Actions, GitLab CI

**Configure plugins:**

- [Plugin System](/plugins/) - Configure plugins for your workflow
- [Dependency Check](/plugins/dependency-check) - Sync versions across files
- [Tag Manager](/plugins/tag-manager) - Advanced git tagging options

**Manage multiple modules:**

- [Monorepo Support](/guide/monorepo/) - Multi-module version management
- [Workspace Configuration](/reference/sley-yaml#workspace-configuration) - Configure module discovery

## Troubleshooting

| Issue                    | Solution                                                |
| ------------------------ | ------------------------------------------------------- |
| "version file not found" | Run `sley init` to create `.version`                    |
| "invalid version format" | Ensure `.version` contains only `X.Y.Z` (no `v` prefix) |
| "tag already exists"     | Bump to a new version or delete the existing tag        |
| Commands not working     | Run `sley doctor` to validate your setup                |

See the [Troubleshooting Guide](/guide/troubleshooting/) for more help.
