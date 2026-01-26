---
title: "Quick Start"
description: "Get up and running with sley version management in under a minute with this quick start guide and installation instructions"
head:
  - - meta
    - name: keywords
      content: sley, quick start, getting started, version management, semantic versioning, installation, tutorial
---

# {{ $frontmatter.title }}

Get up and running with sley in under a minute.

## Install

```bash
brew install indaco/tap/sley
```

::: details Other installation methods
See [Installation](/guide/installation) for all installation options (go install, asdf, prebuilt binaries, build from source).
:::

## Try It

```bash
# Quick setup - automatically detect and configure your project
sley discover              # scan project, auto-initialize .sley.yaml, enable plugins

# Or initialize manually
sley init                  # interactive: select plugins, creates .version and .sley.yaml
sley init --migrate        # or pull version from existing package.json/Cargo.toml

sley show                  # prints current version

sley bump patch            # 1.2.3 -> 1.2.4
sley bump minor            # 1.2.4 -> 1.3.0
sley bump auto             # smart bump: strips pre-release or bumps patch
sley set 2.0.0 --pre beta  # set version with pre-release
sley bump pre              # 2.0.0-beta -> 2.0.0-beta.1
sley bump pre --label rc   # switch to 2.0.0-rc.1

sley tag create --push     # create and push git tag
sley changelog merge       # merge versioned changelogs into CHANGELOG.md

sley doctor                # validate setup and configuration
```

::: tip
sley works out-of-the-box with sensible defaults. Create a `.sley.yaml` only when you need to customize behavior.
:::

## What's Next?

- [Usage](/guide/usage) — Detailed guide for all commands
- [Pre-release Versions](/guide/pre-release) — Alpha, beta, and RC workflows
- [CI/CD Integration](/guide/ci-cd) — Automated versioning in pipelines
- [Plugin System](/plugins/) — Extend sley with plugins
