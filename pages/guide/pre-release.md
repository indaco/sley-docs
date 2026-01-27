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

For command details, see [Usage](/guide/usage#increment-pre-release-bump-pre).

## Set Pre-release Label

Use `sley pre` to set or replace a pre-release label:

```bash
# .version = 0.2.1
sley pre alpha
# => 0.2.1-alpha

# If a pre-release is already present, it's replaced
# .version = 0.2.2-beta.3
sley pre alpha
# => 0.2.2-alpha
```

Use `--inc` to auto-increment the numeric suffix:

```bash
# .version = 1.2.3
sley pre alpha --inc
# => 1.2.3-alpha.1

# .version = 1.2.3-alpha.1
sley pre alpha --inc
# => 1.2.3-alpha.2
```

### Dependency Sync with Pre Command

When the `dependency-check` plugin is configured with `auto-sync: true`, the standalone `pre` command automatically syncs the pre-release version to all configured files. This is useful in coordinated versioning scenarios where you want to set a pre-release label across all modules:

```bash
# With dependency-check configured with auto-sync: true
$ sley pre beta

Sync dependencies
  ✓ api (services/api/.version): 1.3.0-beta
  ✓ web (services/web/.version): 1.3.0-beta
  ✓ package.json (package.json): 1.3.0-beta

Success: Pre-release set to 1.3.0-beta and synced to 3 file(s)
```

This ensures all dependency files remain synchronized when using the `pre` command, just as they do with `bump` commands.

## Typical Workflow

A common workflow for preparing a release:

```bash
# Start development on a new minor version
sley bump minor --pre alpha.1
# => 1.3.0-alpha.1

# Continue development iterations
sley bump pre
# => 1.3.0-alpha.2

# Move to beta
sley bump pre --label beta
# => 1.3.0-beta.1

# Release candidate
sley bump pre --label rc
# => 1.3.0-rc.1

# Final release
sley bump release
# => 1.3.0
```

## Pre-release Tagging

By default, the `tag-manager` plugin does not create tags for pre-release versions. To enable pre-release tagging:

```yaml
# .sley.yaml
plugins:
  tag-manager:
    enabled: true
    tag-prereleases: true
```

See [Tag Manager](/plugins/tag-manager) for more details.

## Multi-Module Projects

Pre-release versioning works seamlessly with multi-module projects and workspaces.

### Independent Versioning (Workspace)

Bump pre-release versions for specific modules or all modules:

```bash
# Bump pre-release for a specific module
$ sley bump pre --module web
Bump pre
  ✓ web (apps/web/.version): 0.5.0-beta.1 -> 0.5.0-beta.2

Success: 1 module updated

# Bump pre-release for all modules
$ sley bump pre --all
Bump pre
  ✓ root (.version): 1.0.0-alpha -> 1.0.0-alpha.1
  ✓ web (apps/web/.version): 1.0.0-alpha -> 1.0.0-alpha.1
  ✓ core (packages/core/.version): 1.0.0-alpha -> 1.0.0-alpha.1

Success: 3 modules updated
```

### Coordinated Versioning

When using coordinated versioning with dependency-check, bumping the root pre-release version automatically syncs to all modules. Both the `bump pre` and standalone `pre` commands support automatic syncing:

```bash
# Bump root pre-release - syncs automatically to all configured modules
$ sley bump pre

Sync dependencies
  ✓ api (services/api/.version): 1.3.0-beta.2
  ✓ web (services/web/.version): 1.3.0-beta.2

Success: Version bumped to 1.3.0-beta.2 and synced to 2 file(s)

# Set pre-release label - also syncs automatically
$ sley pre rc

Sync dependencies
  ✓ api (services/api/.version): 1.3.0-rc
  ✓ web (services/web/.version): 1.3.0-rc

Success: Pre-release set to 1.3.0-rc and synced to 2 file(s)
```

See [Monorepo Support](/guide/monorepo) for more details on versioning models.

## Pre-release Validation

Use the `version-validator` plugin to enforce pre-release label formats:

```yaml
# .sley.yaml
plugins:
  version-validator:
    enabled: true
    rules:
      - type: "pre-release-format"
        pattern: "^(alpha|beta|rc)(\\.[0-9]+)?$"
```

This ensures only `alpha`, `beta`, and `rc` labels (with optional numeric suffixes) are allowed.

See [Version Validator](/plugins/version-validator) for more rules.

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
