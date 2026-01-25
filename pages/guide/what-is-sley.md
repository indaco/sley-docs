---
title: "What is sley?"
description: "Language-agnostic semantic versioning tool with a simple .version file. Learn why sley was created and how it solves version management challenges"
head:
  - - meta
    - name: keywords
      content: sley, semantic versioning, version management, .version file, language-agnostic, monorepo, SemVer, version control
---

# {{ $frontmatter.title }}

A command-line tool for managing [SemVer 2.0.0](https://semver.org/) versions using a simple `.version` file. Works with any language or stack, integrates with CI/CD pipelines, and extends via built-in plugins for git tagging, changelog generation, and version validation.

> _sley - named for the weaving tool that arranges threads in precise order._

## Features

- Lightweight `.version` file - SemVer 2.0.0 compliant
- `init`, `bump`, `set`, `show`, `validate` - intuitive version control
- Pre-release support with auto-increment (`alpha`, `beta.1`, `rc.2`, `--inc`)
- Built-in plugins - git tagging, changelog generation, version policy enforcement, commit parsing
- Extension system - hook external scripts into the version lifecycle
- Monorepo/multi-module support - manage multiple `.version` files at once
- Works standalone or in CI - `--strict` for strict mode
- Configurable via flags, env vars, or `.sley.yaml`

## Why .version?

`sley` was born from patterns that kept repeating across projects:

**It started with Go**: Using `//go:embed .version` for version info - no build flags, no magic. This became the default approach for every Go project.

**Then frontend projects**: The same pattern worked for SvelteKit, and other frontend stacks with a Vite plugin to read from `.version`. One file, same workflow, any stack.

**Then multi-stack projects**: With a SvelteKit frontend, Go gateway, and Python/Rust services in one repo, the need became clear: version each component individually, but also bump them all at once when needed.

`sley` solves all of these. The plugin system (audit-log, version-validator, release-gate) came later to support organizational requirements like audit trails and policy enforcement.

### What it is

- A **single source of truth** for your project version
- **Language-agnostic** - works with Go, Python, Node, Rust, or any stack
- **CI/CD friendly** - inject into Docker labels, GitHub Actions, release scripts
- **Human-readable** - just a plain text file containing `1.2.3`
- **Predictable** - no magic, no hidden state, version is what you set

### What it is NOT

- **Not a replacement for git tags** - use the `tag-manager` plugin to sync both
- **Not a package manager** - it doesn't publish or distribute anything
- **Not a standalone changelog tool** - changelog generation is available via the built-in `changelog-generator` plugin
- **Not a build system** - it just manages the version string

The `.version` file complements your existing tools. Pair it with `git tag` for releases, inject it into binaries at build time, or sync it across `package.json`, `Cargo.toml`, and other files using the [`dependency-check` plugin](/plugins/dependency-check).

## What's Next?

Choose your path based on your needs:

**Getting started?**

- [Installation](/guide/installation) - All installation methods
- [Usage Guide](/guide/usage) - Learn all commands and features
- [Quick Start](/guide/quick-start) - Get up and running fast

**Setting up automation?**

- [CI/CD Integration](/guide/ci-cd) - Automate version bumps
- [Plugin System](/plugins/) - Extend sley with built-in plugins
- [Tag Manager](/plugins/tag-manager) - Automatic git tags

**Advanced features?**

- [Pre-release Versions](/guide/pre-release) - Alpha, beta, RC workflows
- [Monorepo Support](/guide/monorepo) - Multi-module version management
