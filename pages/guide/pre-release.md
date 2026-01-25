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
sley pre --label alpha
# => 0.2.2-alpha

# If a pre-release is already present, it's replaced
# .version = 0.2.2-beta.3
sley pre --label alpha
# => 0.2.2-alpha
```

Use `--inc` to auto-increment the numeric suffix:

```bash
# .version = 1.2.3
sley pre --label alpha --inc
# => 1.2.3-alpha.1

# .version = 1.2.3-alpha.1
sley pre --label alpha --inc
# => 1.2.3-alpha.2
```

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
