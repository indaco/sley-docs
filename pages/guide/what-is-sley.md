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

## Features by Category

### Core Version Management

- **Lightweight `.version` file** - Single source of truth, SemVer 2.0.0 compliant
- **Intuitive commands** - `init`, `bump`, `set`, `show`, `validate` for complete version control
- **Pre-release support** - Auto-increment for alpha, beta, rc with `bump pre` command
- **Build metadata** - Attach and preserve metadata (`+build.123`)
- **Smart bumping** - `bump auto` analyzes commits to determine version increment

### Automation & Integration

- **Built-in plugins** - Git tagging, changelog generation, version validation, commit parsing
- **Extension system** - Hook external scripts into version lifecycle events
- **CI/CD ready** - Auto-detects CI environments, strict mode, non-interactive operation
- **Multiple output formats** - Text, JSON, table for scripts and pipelines
- **Configurable** - Via flags, environment variables, or `.sley.yaml`

### Multi-Module Support

- **Monorepo/workspace support** - Manage multiple `.version` files simultaneously
- **Three versioning models** - Single-root, coordinated versioning, independent versioning
- **Interactive selection** - Choose which modules to operate on
- **Parallel execution** - Bump multiple modules concurrently
- **Module discovery** - Auto-detect modules with `.version` files

### File Synchronization

- **Manifest syncing** - Keep package.json, Cargo.toml, etc. in sync with `.version`
- **Cross-file coordination** - Sync multiple `.version` files in coordinated mode
- **Auto-sync on bump** - Automatic propagation with `dependency-check` plugin
- **Format support** - JSON, YAML, TOML, raw text, regex patterns

## Why .version?

`sley` was born from patterns that kept repeating across projects:

**It started with Go**: Using `//go:embed .version` for version info - no build flags, no magic. This became the default approach for every Go project.

**Then frontend projects**: The same pattern worked for SvelteKit and other frontend stacks with a Vite plugin to read from `.version`. One file, same workflow, any stack.

**Then multi-stack projects**: With a SvelteKit frontend, Go gateway, and Python/Rust services in one repo, the need became clear: version each component individually, but also bump them all at once when needed.

`sley` solves all of these. The plugin system (audit-log, version-validator, release-gate) came later to support organizational requirements like audit trails and policy enforcement.

## What It Is

- A **single source of truth** for your project version
- **Language-agnostic** - works with Go, Python, Node, Rust, or any stack
- **CI/CD friendly** - inject into Docker labels, GitHub Actions, release scripts
- **Human-readable** - just a plain text file containing `1.2.3`
- **Predictable** - no magic, no hidden state, version is what you set

## What It Is NOT

- **Not a replacement for git tags** - use the `tag-manager` plugin to sync both
- **Not a package manager** - it doesn't publish or distribute anything
- **Not a standalone changelog tool** - changelog generation is available via the built-in `changelog-generator` plugin
- **Not a build system** - it just manages the version string

The `.version` file complements your existing tools. Pair it with `git tag` for releases, inject it into binaries at build time, or sync it across `package.json`, `Cargo.toml`, and other manifest files using the [`dependency-check` plugin](/plugins/dependency-check).

## Common Use Cases

### Use Case 1: Single-Language Project

**Scenario:** Node.js application with package.json

**Setup:**

```bash
sley init
```

**Configuration:**

```yaml
# .sley.yaml
path: .version
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
```

**Benefit:** `.version` as single source, package.json syncs automatically.

### Use Case 2: Multi-Language Monorepo

**Scenario:** Go backend, SvelteKit frontend, shared library

**Setup:**

```bash
sley discover  # Auto-detect structure
```

**Result:** Coordinated versioning with one version for all components.

**Benefit:** Bump once, all components stay synchronized.

### Use Case 3: Microservices Architecture

**Scenario:** Independent services with different release cycles

**Setup:**

```bash
sley init --workspace
```

**Configuration:**

```yaml
# .sley.yaml
workspace:
  discovery:
    enabled: true
    recursive: true
```

**Benefit:** Version each service independently, bump all or selectively.

### Use Case 4: CI/CD Automation

**Scenario:** Automate version bumps in GitHub Actions

**Setup:**

```yaml
# .github/workflows/version-bump.yml
- name: Bump version
  run: sley bump auto --strict
```

**Benefit:** Automatic versioning based on conventional commits, no manual intervention.

### Use Case 5: Docker Image Versioning

**Scenario:** Tag Docker images with version from `.version`

**Setup:**

```bash
docker build --build-arg VERSION=$(sley show) -t myapp:$(sley show) .
```

**Benefit:** Consistent versioning across code and Docker images.

## Versioning Model Selection

::: tip Choosing Your Versioning Model
`sley` supports three versioning models:

- **Single-root**: One `.version` file, sync manifest files with `dependency-check`
- **Coordinated versioning**: Multiple `.version` files that all sync to root (one version everywhere)
- **Independent versioning**: Multiple `.version` files with independent versions (workspace mode)

Run `sley discover` to detect your project structure and choose the right model. See [Understanding Versioning Models](/guide/monorepo/versioning-models) for detailed guidance.
:::

## What's Next?

Choose your path based on your needs:

**Getting started?**

- [Installation](/guide/installation) - All installation methods
- [Quick Start](/guide/quick-start) - Get up and running fast
- [Usage Guide](/guide/usage) - Learn all commands and features

**Setting up automation?**

- [CI/CD Integration](/guide/ci-cd) - Automate version bumps
- [Plugin System](/plugins/) - Extend sley with built-in plugins
- [Tag Manager](/plugins/tag-manager) - Automatic git tags

**Advanced features?**

- [Pre-release Versions](/guide/pre-release) - Alpha, beta, RC workflows
- [Monorepo Support](/guide/monorepo/) - Multi-module version management
- [Dependency Check](/plugins/dependency-check) - Sync versions across files
