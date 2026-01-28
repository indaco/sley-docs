---
title: "Versioning Models"
description: "Deep dive into sley's three versioning models: single-root, coordinated versioning, and independent versioning with visual examples"
head:
  - - meta
    - name: keywords
      content: sley, versioning models, single-root, coordinated versioning, independent versioning, workspace, monorepo
---

# {{ $frontmatter.title }}

`sley` supports three distinct versioning models, each designed for different project structures. Understanding the differences is crucial for choosing the right approach.

## Model 1: Single-Root

A project with ONE `.version` file that serves as the single source of truth:

```text
my-project/
├── .version           # Source of truth (1.2.3)
├── package.json       # Syncs TO .version
├── Cargo.toml         # Syncs TO .version
└── Chart.yaml         # Syncs TO .version
```

### How it works

- The `.version` file is the authoritative source
- Manifest files (package.json, Cargo.toml, etc.) are sync targets
- Use the `dependency-check` plugin to keep manifests synchronized with `.version`
- When you bump `.version` to 1.2.4, all manifest files update automatically

### Use case

A single application or library (Node.js app, Rust crate, Go module, etc.)

### Configuration

See [Single-Root Configuration](/guide/monorepo/configuration#single-root-configuration) for complete examples.

## Model 2: Coordinated Versioning

Multiple `.version` files exist for technical reasons (Go embed, Vite plugins), but you want ONE version everywhere:

```text
my-project/
├── .version           # Source of truth (1.2.3)
├── package.json       # Syncs TO root .version
├── services/
│   ├── api/
│   │   ├── .version   # Syncs TO root .version
│   │   └── main.go    # Embeds api/.version (for Go)
│   └── web/
│       ├── .version   # Syncs TO root .version
│       └── vite.config.js  # Reads web/.version
└── packages/
    └── shared/
        ├── .version   # Syncs TO root .version
        └── package.json  # Syncs TO root .version
```

### How it works

- Root `.version` is the single source of truth
- Submodule `.version` files sync TO root `.version` via `dependency-check`
- Manifest files also sync TO root `.version`
- Bumping root `.version` propagates to all files
- All components always have the same version

### Use case

Multi-module projects where all components release together with the same version number, but technical constraints require multiple `.version` files (e.g., Go embed, Vite plugins)

### Why you need this

Some tools require version information in specific locations:
- **Go `//go:embed`**: Requires `.version` file in the same directory
- **Vite plugins**: Often read from local `.version` for build-time injection
- **Docker builds**: May need version files in specific service directories

Coordinated versioning lets you maintain these technical requirements while keeping one canonical version.

### Configuration

See [Coordinated Versioning Configuration](/guide/monorepo/configuration#coordinated-versioning-configuration) for complete examples.

### Workflow

Once configured, coordinated versioning is completely automatic. Simply bump the root version without any flags - the dependency-check plugin handles syncing automatically. All configured files (both `.version` files and manifest files) update in one operation.

For detailed workflow examples, see [Workflows: Release All Modules Together](/guide/monorepo/workflows#workflow-1-release-all-modules-together).

## Model 3: Independent Versioning (Workspace)

A project with MULTIPLE `.version` files, each versioned independently:

```text
my-monorepo/
├── services/
│   ├── api/
│   │   ├── .version       # Independent source (2.1.0)
│   │   └── Cargo.toml     # Syncs TO api/.version
│   └── auth/
│       ├── .version       # Independent source (1.5.3)
│       └── package.json   # Syncs TO auth/.version
└── packages/
    └── shared/
        ├── .version       # Independent source (3.0.1)
        └── package.json   # Syncs TO shared/.version
```

### How it works

- Each module has its own `.version` file as its independent source of truth
- Each module can have its own manifest files that sync to ITS `.version`
- Use `workspace` configuration to manage multiple modules
- Each module can have its own `dependency-check` configuration
- Modules are versioned and released independently

### Use case

Microservices architecture, multi-package monorepo with independent release cycles

### Configuration

Independent versioning uses workspace configuration with auto-discovery or explicit module definitions. Module-specific `.sley.yaml` files can override workspace settings for per-module customization.

See [Independent Versioning Configuration](/guide/monorepo/configuration#independent-versioning-configuration-workspace) for complete examples.

## Key Distinctions

Understanding sync direction is critical:

### Single-Root

```text
package.json ──┐
Cargo.toml   ──┼──▶ .version (SOURCE)
Chart.yaml   ──┘
```

All manifest files sync TO the single `.version` file.

### Coordinated Versioning

```text
                     ┌──▶ api/.version (TARGET)
                     │
.version (SOURCE) ───┼──▶ web/.version (TARGET)
                     │
                     └──▶ shared/.version (TARGET)
```

Root `.version` is source, submodule `.version` files are targets.

### Independent Versioning

```text
api/.version (SOURCE) ◀── api/package.json
web/.version (SOURCE) ◀── web/package.json
shared/.version (SOURCE) ◀── shared/package.json
```

Each `.version` file is an independent source, manifests sync TO their respective `.version`.

::: warning Important Distinction
In **coordinated versioning**, submodule `.version` files ARE sync targets (this is the exception). In **independent versioning**, each `.version` file is a source of truth.
:::

## Detection and Mode Selection

```text
1. --path flag provided       -> Single-root mode (explicit path)
2. SLEY_PATH env set          -> Single-root mode (env path)
3. .version in current dir    -> Single-root mode (current dir)
4. Multiple .version found    -> Prompt for versioning model:
                                 - Coordinated versioning
                                 - Independent versioning (workspace)
                                 - Single root (ignore submodules)
5. No .version file found     -> Error
```

When multiple `.version` files are detected, `sley discover` prompts you to choose your versioning strategy. Your choice determines the configuration that gets generated in `.sley.yaml`.

## Migrating Between Models

You can switch versioning models at any time by updating your `.sley.yaml` configuration.

### From Single-Root to Coordinated Versioning

1. Create `.version` files in submodules where needed
2. Copy the version from root `.version` to all submodule `.version` files
3. Update `.sley.yaml` to add submodule `.version` files to `dependency-check`:

```yaml
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      # Add submodule .version files
      - path: services/api/.version
        format: raw
      - path: services/web/.version
        format: raw
```

### From Coordinated to Independent Versioning

1. Remove submodule `.version` files from `dependency-check` configuration
2. Add `workspace` configuration:

```yaml
workspace:
  discovery:
    enabled: true
    recursive: true
```

3. Create module-specific `.sley.yaml` files if needed
4. Update submodule versions independently using `sley bump --module <name>`

### From Independent to Coordinated Versioning

1. Decide which version will be the canonical version (usually the highest)
2. Update all submodule `.version` files to match
3. Remove `workspace` configuration
4. Add all submodule `.version` files to root `dependency-check`:

```yaml
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: services/api/.version
        format: raw
      - path: services/web/.version
        format: raw
```

## What's Next?

- [Configuration](/guide/monorepo/configuration) - Complete configuration examples for each model
- [Workflows](/guide/monorepo/workflows) - Practical examples and command workflows
- [Monorepo Support](/guide/monorepo/) - Overview and quick start
- [Dependency Check](/plugins/dependency-check) - Sync versions across modules
