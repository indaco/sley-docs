---
title: "Versioning Models"
description: "sley's three versioning models: single-root, coordinated versioning, and independent versioning"
head:
  - - meta
    - name: keywords
      content: sley, versioning models, single-root, coordinated versioning, independent versioning, workspace, monorepo
---

# {{ $frontmatter.title }}

`sley` supports three versioning models. The key distinction is sync direction: which file is the source of truth, and which files are targets.

## Model 1: Single-Root

One `.version` file; all manifest files sync to it.

```text
my-project/
├── .version           # Source of truth (1.2.3)
├── package.json       # Syncs TO .version
├── Cargo.toml         # Syncs TO .version
└── Chart.yaml         # Syncs TO .version
```

```text
package.json ──┐
Cargo.toml   ──┼──▶ .version (SOURCE)
Chart.yaml   ──┘
```

Use the `dependency-check` plugin to keep manifests in sync. A version bump updates all configured files in one operation.

**Use case:** A single application or library with multiple manifest files.

See [Single-Root Configuration](/guide/monorepo/configuration#single-root-configuration).

## Model 2: Coordinated Versioning

Multiple `.version` files exist for technical reasons (Go embed, Vite plugins), but all stay at the same version. Root `.version` is the source; all others are targets.

```text
my-project/
├── .version           # Source of truth (1.2.3)
├── services/
│   ├── api/
│   │   ├── .version   # Syncs TO root .version
│   │   └── main.go    # Embeds api/.version
│   └── web/
│       ├── .version   # Syncs TO root .version
│       └── vite.config.js
└── packages/
    └── shared/
        ├── .version   # Syncs TO root .version
        └── package.json
```

```text
                     ┌──▶ api/.version (TARGET)
                     │
.version (SOURCE) ───┼──▶ web/.version (TARGET)
                     │
                     └──▶ shared/.version (TARGET)
```

Bumping root `.version` propagates to all configured files via `dependency-check`.

**Use case:** Multi-module projects that always release together.

See [Coordinated Versioning Configuration](/guide/monorepo/configuration#coordinated-versioning-configuration).

## Model 3: Independent Versioning (Workspace)

Each module has its own `.version` as an independent source of truth. Modules release at their own cadence.

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

```text
api/.version (SOURCE)    ◀── api/Cargo.toml
auth/.version (SOURCE)   ◀── auth/package.json
shared/.version (SOURCE) ◀── shared/package.json
```

### The `workspace.versioning` Field

Set `workspace.versioning` in `.sley.yaml` to control how `sley discover` reports version differences across modules:

- **`independent`**: Mismatch warnings are suppressed - expected when modules version independently
- **`coordinated`** (default): Mismatch warnings are shown - useful for enforcing version alignment

```yaml
workspace:
  versioning: independent
```

**Use case:** Microservices or multi-package monorepos with independent release cycles.

See [Independent Versioning Configuration](/guide/monorepo/configuration#independent-versioning-configuration-workspace).

::: warning Important Distinction
In **coordinated versioning**, submodule `.version` files are sync targets. In **independent versioning**, each `.version` file is a source of truth. The sync direction is opposite.
:::

## Migrating Between Models

You can switch versioning models at any time by updating `.sley.yaml`.

### From Single-Root to Coordinated Versioning

1. Create `.version` files in submodules where needed
2. Copy the version from root `.version` to all submodule `.version` files
3. Add submodule `.version` files to `dependency-check`:

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

### From Coordinated to Independent Versioning

1. Remove submodule `.version` files from `dependency-check`
2. Add `workspace` configuration:

```yaml
workspace:
  versioning: independent
  discovery:
    enabled: true
```

3. Create module-specific `.sley.yaml` files if needed
4. Update submodule versions independently using `sley bump --module <name>`

### From Independent to Coordinated Versioning

1. Set all submodule `.version` files to the same version
2. Remove `workspace` configuration
3. Add all submodule `.version` files to root `dependency-check`

## What's Next?

- [Configuration](/guide/monorepo/configuration) - Complete configuration for each model
- [Workflows](/guide/monorepo/workflows) - Command workflows for each model
- [Dependency Check Plugin](/plugins/dependency-check) - Sync versions across files
