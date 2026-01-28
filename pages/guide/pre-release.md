---
title: "Pre-release Versions"
description: "Manage alpha, beta, and RC pre-release versions with sley following SemVer 2.0.0 specification for development and release workflows"
head:
  - - meta
    - name: keywords
      content: sley, pre-release, alpha, beta, rc, release candidate, semantic versioning, SemVer, version workflow
---

# {{ $frontmatter.title }}

sley provides full support for pre-release versions following the SemVer 2.0.0 specification.

## What Are Pre-releases?

Pre-release versions signal that software is not ready for production. They follow the SemVer 2.0.0 format: `MAJOR.MINOR.PATCH-PRERELEASE`, where the pre-release identifier comes after a hyphen.

**Common pre-release labels**:

- **alpha** - Early development, unstable, frequent breaking changes
- **beta** - Feature-complete, stabilizing, testing phase
- **rc** (release candidate) - Final testing before production release

**Example progression**: `1.3.0-alpha.1` → `1.3.0-alpha.2` → `1.3.0-beta.1` → `1.3.0-rc.1` → `1.3.0`

**Key benefits**:

- Publish work-in-progress versions to package registries
- Allow early testing without committing to API stability
- Signal production-readiness status to users and automated tools
- Enable parallel development of stable and upcoming releases

## Quick Start

The fastest way to start using pre-releases:

```bash
# Start a new pre-release cycle
sley bump minor --pre alpha.1    # 1.2.3 → 1.3.0-alpha.1

# Increment during development
sley bump pre                     # 1.3.0-alpha.1 → 1.3.0-alpha.2

# Move to beta stage
sley bump pre --label beta        # 1.3.0-alpha.2 → 1.3.0-beta.1

# Release to production
sley bump release                 # 1.3.0-beta.1 → 1.3.0
```

This is the recommended workflow for most projects. Continue reading to understand command differences and choose the right workflow for your needs.

## Command Overview

sley offers two distinct commands for working with pre-release versions. Understanding their differences is crucial for choosing the right workflow.

### Commands Compared

| Aspect                            | `sley pre`                                          | `sley bump pre`                                     |
| --------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| **Purpose**                       | Set or replace pre-release label                    | Increment pre-release iteration                     |
| **Starting from stable**          | Bumps patch first: `1.2.3` → `1.2.4-alpha`          | Requires `--label`: `1.2.3` → `1.2.3-alpha.1`       |
| **Requires existing pre-release** | No - works on any version                           | Yes - fails without pre-release identifier          |
| **Replacing label**               | No counter reset: `1.2.3-alpha.1` → `1.2.3-beta`    | Resets counter: `1.2.3-alpha.3` → `1.2.3-beta.1`    |
| **Incrementing counter**          | Use `--inc` flag: `1.2.3-alpha.1` → `1.2.3-alpha.2` | Default behavior: `1.2.3-alpha.1` → `1.2.3-alpha.2` |
| **Best for**                      | Ad-hoc label management, explicit control           | Iterative development, consistent workflow          |

### When to Use Each Command

**Use `sley bump pre` (⭐ Recommended)** when:

- You want a consistent `bump` command family throughout your workflow
- You're doing iterative development with frequent increments
- You prefer automatic counter resets when switching stages
- You like the semantic clarity of "bump" operations

**Use `sley pre`** when:

- You need explicit control over when patch versions change
- You want to replace labels without incrementing counters
- You're performing ad-hoc pre-release management outside a workflow
- You need to add pre-release labels to existing versions

::: warning Gotcha: Starting from Stable Versions
The commands behave differently when starting from a stable version:

- `sley pre --label alpha` bumps patch: `1.2.3` → `1.2.4-alpha`
- `sley bump pre --label alpha` does NOT bump patch: `1.2.3` → `1.2.3-alpha.1`

Choose based on whether you want the upcoming patch or the current base version.
:::

### Command Details

#### `sley pre` - Set or Replace Label

**Without `--inc` flag**:

```bash
# Adding label to stable version bumps patch first
# Current: 0.2.1
sley pre --label alpha
# Result: 0.2.2-alpha (patch incremented, then label added)

# Replacing existing pre-release does NOT bump patch
# Current: 0.2.2-beta.3
sley pre --label alpha
# Result: 0.2.2-alpha (label replaced, counter removed)
```

**With `--inc` flag**:

```bash
# Starting from stable version
# Current: 1.2.3
sley pre --label alpha --inc
# Result: 1.2.3-alpha.1 (no patch bump, numeric suffix added)

# Incrementing existing pre-release
# Current: 1.2.3-alpha.1
sley pre --label alpha --inc
# Result: 1.2.3-alpha.2 (counter incremented)

# Switching labels resets counter
# Current: 1.2.3-alpha.5
sley pre --label beta --inc
# Result: 1.2.3-beta.1 (new label, counter starts at 1)
```

#### `sley bump pre` - Increment Pre-release

**Default behavior** (requires existing pre-release):

```bash
# Current: 1.3.0-alpha.1
sley bump pre
# Result: 1.3.0-alpha.2

# Current: 1.2.3 (stable version)
sley bump pre
# Error: version must have a pre-release identifier
```

**With `--label` flag**:

```bash
# Switch stage and reset counter
# Current: 1.3.0-alpha.3
sley bump pre --label beta
# Result: 1.3.0-beta.1

# Start pre-release from stable version
# Current: 1.2.3
sley bump pre --label alpha
# Result: 1.2.3-alpha.1
```

::: tip Starting Pre-releases
To start a pre-release cycle, use `sley bump [major|minor|patch] --pre <label>` or `sley bump pre --label <label>`. The former bumps the version first, the latter uses the current base.
:::

## Choosing Your Workflow

**Decision framework**:

1. **Are you working on a feature branch with frequent iterations?**
   - Use Workflow 1 (`sley bump pre`) - consistent, predictable, recommended

2. **Do you need to retrofit pre-release labels to existing versions?**
   - Use Workflow 2 (`sley pre`) - explicit control over version bumping

3. **Do you want the cleanest command history?**
   - Use Workflow 1 - all operations use the `bump` command family

4. **Do you need to switch labels without resetting counters?**
   - Use Workflow 2 - `sley pre --label <new>` replaces without counter changes

**Most teams should start with Workflow 1** and only adopt Workflow 2 when specific requirements demand it.

## Complete Workflows

### Workflow 1: Using `sley bump` Commands (Recommended)

This approach keeps you within the `bump` command family and provides consistent behavior:

```bash
# Starting from: 1.2.3

# Start development on a new minor version with pre-release
sley bump minor --pre alpha.1
# Result: 1.3.0-alpha.1

# Continue iterative development
sley bump pre
# Result: 1.3.0-alpha.2

sley bump pre
# Result: 1.3.0-alpha.3

# Move to beta stage (automatically resets counter)
sley bump pre --label beta
# Result: 1.3.0-beta.1

# Beta iterations
sley bump pre
# Result: 1.3.0-beta.2

# Release candidate
sley bump pre --label rc
# Result: 1.3.0-rc.1

# Final release (removes pre-release identifier)
sley bump release
# Result: 1.3.0
```

**Outcome**: You get `1.3.0` as your stable release with a clean progression through testing stages.

### Workflow 2: Using `sley pre` for Label Management

This approach uses the standalone `pre` command for more explicit label control:

```bash
# Starting from: 1.2.3

# Add alpha label (bumps patch first)
sley pre --label alpha
# Result: 1.2.4-alpha

# Increment iterations
sley pre --label alpha --inc
# Result: 1.2.4-alpha.1

sley pre --label alpha --inc
# Result: 1.2.4-alpha.2

# Switch to beta (replaces label, removes counter)
sley pre --label beta
# Result: 1.2.4-beta

# Add counter back
sley pre --label beta --inc
# Result: 1.2.4-beta.1

# Switch to rc
sley pre --label rc
# Result: 1.2.4-rc

# Add counter for iterations
sley pre --label rc --inc
# Result: 1.2.4-rc.1

# Final release
sley bump release
# Result: 1.2.4
```

**Outcome**: You get `1.2.4` as your stable release. Note the patch was bumped at the start, unlike Workflow 1.

::: tip Mixing Workflows
You can mix both commands in the same project. For example, use `sley pre` to add initial labels and `sley bump pre` for iterative development. Just be mindful of the different patch-bumping behaviors.
:::

## Integration & Advanced

### Dependency Synchronization

When the `dependency-check` plugin is configured with `auto-sync: true`, both `sley bump pre` and `sley pre` automatically sync versions across all configured files. This is essential for coordinated versioning in monorepos:

```bash
# With dependency-check configured with auto-sync: true

# Bump pre-release - syncs automatically
$ sley bump pre

Sync dependencies
  ✓ api (services/api/.version): 1.3.0-beta.2
  ✓ web (services/web/.version): 1.3.0-beta.2

Success: Version bumped to 1.3.0-beta.2 and synced to 2 file(s)

# Set label - also syncs automatically
$ sley pre --label rc

Sync dependencies
  ✓ api (services/api/.version): 1.3.0-rc
  ✓ web (services/web/.version): 1.3.0-rc
  ✓ package.json (package.json): 1.3.0-rc

Success: Pre-release set to 1.3.0-rc and synced to 3 file(s)
```

See [Dependency Check Plugin](/plugins/dependency-check) for configuration details

### Multi-Module Projects

Pre-release versioning works seamlessly with multi-module projects and workspaces.

#### Independent Versioning (Workspace)

Bump pre-release versions for specific modules or all modules:

```bash
# Bump pre-release for a specific module
$ sley bump pre --module web
Bump pre
  ✓ web (apps/web/.version): 0.5.0-beta.1 → 0.5.0-beta.2

Success: 1 module updated

# Bump pre-release for all modules
$ sley bump pre --all
Bump pre
  ✓ root (.version): 1.0.0-alpha → 1.0.0-alpha.1
  ✓ web (apps/web/.version): 1.0.0-alpha → 1.0.0-alpha.1
  ✓ core (packages/core/.version): 1.0.0-alpha → 1.0.0-alpha.1

Success: 3 modules updated
```

See [Monorepo Support](/guide/monorepo/) for detailed information on versioning models.

### Pre-release Tagging

By default, the `tag-manager` plugin does not create tags for pre-release versions. To enable pre-release tagging:

```yaml
# .sley.yaml
plugins:
  tag-manager:
    enabled: true
    tag-prereleases: true
```

This allows you to tag and publish pre-release versions to Git, making them discoverable for testing and distribution.

See [Tag Manager](/plugins/tag-manager) for more configuration options.

### Pre-release Validation

Enforce pre-release label formats using the `version-validator` plugin:

```yaml
# .sley.yaml
plugins:
  version-validator:
    enabled: true
    rules:
      - type: "pre-release-format"
        pattern: "^(alpha|beta|rc)(\\.[0-9]+)?$"
```

This configuration ensures only `alpha`, `beta`, and `rc` labels (with optional numeric suffixes) are allowed, preventing typos and maintaining consistency.

See [Version Validator](/plugins/version-validator) for additional validation rules.

## What's Next?

Choose your path based on your needs:

**Setting up pre-release workflows?**

- [Tag Manager](/plugins/tag-manager) - Configure pre-release tagging
- [Version Validator](/plugins/version-validator) - Enforce pre-release label formats
- [CI/CD Integration](/guide/ci-cd) - Automate pre-release version bumps

**Managing changelogs?**

- [Changelog Generator](/plugins/changelog-generator) - Generate changelogs for pre-releases
- [Usage Guide](/guide/usage#increment-pre-release-bump-pre) - Detailed pre-release command examples

**Need more details?**

- [CLI Reference](/reference/cli) - Complete command reference
- [Troubleshooting](/guide/troubleshooting/) - Common issues and solutions
