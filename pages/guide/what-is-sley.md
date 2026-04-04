---
title: "What is sley?"
description: "A language-agnostic SemVer 2.0.0 CLI that manages versions through a plain-text .version file, with built-in plugins for git tagging, changelog generation, and release validation."
head:
  - - meta
    - name: keywords
      content: sley, semantic versioning, version management, .version file, language-agnostic, monorepo, SemVer, version control
---

# {{ $frontmatter.title }}

`sley` is a CLI for managing [SemVer 2.0.0](https://semver.org/) versions using a plain-text `.version` file. It provides 10 commands (`init`, `discover`, `show`, `set`, `bump`, `pre`, `doctor`, `tag`, `changelog`, `extension`) and 8 built-in plugins for git tagging, changelog generation, commit parsing, version validation, dependency checking, release gating, and audit logging. Because it has no language-specific runtime dependencies, it works with any stack.

> _sley - named for the weaving tool that arranges threads in precise order._

## Key Concepts

**The `.version` file** is a plain-text file containing a single SemVer string (`1.2.3`). It is the single source of truth for your project version. You read it at build time, inject it into binaries, or use it as input to other tools - sley just keeps it accurate.

**Plugins** extend the version lifecycle. Eight are built in, configured in `.sley.yaml`:

- `commit-parser` - analyzes conventional commits to determine the next bump
- `tag-manager` - creates and pushes git tags after version changes
- `changelog-generator` - generates changelogs from git commits
- `changelog-parser` - infers bump type from changelog entries
- `version-validator` - enforces versioning policies and constraints
- `release-gate` - pre-bump validation (clean worktree, branch checks)
- `dependency-check` - syncs version to manifest files (package.json, Cargo.toml, etc.)
- `audit-log` - records version history with timestamps and metadata

**Configuration** is resolved in priority order: CLI flags > environment variables > `.sley.yaml` > built-in defaults.

**Workspace support** lets you manage multiple `.version` files in one repository. There are three versioning models:

- **Single-root** - one `.version` file; manifest files (`package.json`, `Cargo.toml`, etc.) sync to it via the `dependency-check` plugin.
- **Coordinated** - multiple `.version` files that all track the same version, bumped together.
- **Independent** - multiple `.version` files with their own versions, bumped selectively or in batch.

Run `sley discover` to detect which model fits your project structure.

## When to Use sley / When Not To

**Use sley when:**

- You want a single, stack-agnostic file that every tool in your pipeline can read without a language runtime.
- You need to keep manifest files (`package.json`, `Cargo.toml`, `pyproject.toml`) in sync with one authoritative version.
- You want commit-driven automatic version bumps (`bump auto`) in CI without custom scripting.
- You manage a monorepo with components that need independent or coordinated versioning.

**Do not expect sley to:**

- Replace git tags - use the `tag-manager` plugin to keep them in sync, but sley does not own your tag history.
- Publish or distribute packages - it manages the version string only.
- Replace a dedicated changelog tool if you need heavy customization - the `changelog-generator` plugin covers standard conventional-commit workflows.

::: tip Choosing a versioning model
If you are unsure which model fits your project, run `sley discover` and review the output. See [Understanding Versioning Models](/guide/monorepo/versioning-models) for a full comparison.
:::

## What's Next?

**Getting started:**

- [Installation](/guide/installation)
- [Quick Start](/guide/quick-start)
- [Usage Guide](/guide/usage)

**Going further:**

- [Plugin System](/plugins/)
- [Monorepo Support](/guide/monorepo/)
- [CI/CD Integration](/guide/ci-cd)
