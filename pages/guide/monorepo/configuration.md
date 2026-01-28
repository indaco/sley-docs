---
title: "Monorepo Configuration"
description: "Complete configuration examples for single-root, coordinated versioning, and independent versioning models"
head:
  - - meta
    - name: keywords
      content: sley, configuration, monorepo, sley.yaml, dependency-check, workspace, coordinated versioning
---

# {{ $frontmatter.title }}

Complete configuration examples for each versioning model, from basic setups to advanced scenarios.

## Single-Root Configuration

For projects with one `.version` file and multiple manifest files:

### Basic Configuration

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
      - path: Cargo.toml
        field: package.version
        format: toml
```

### Multi-Language Project

```yaml
# .sley.yaml
path: .version

plugins:
  commit-parser: true
  tag-manager:
    enabled: true

  dependency-check:
    enabled: true
    auto-sync: true
    files:
      # JavaScript/TypeScript
      - path: package.json
        field: version
        format: json

      # Rust
      - path: Cargo.toml
        field: package.version
        format: toml

      # Kubernetes/Helm
      - path: Chart.yaml
        field: version
        format: yaml

      # Python
      - path: pyproject.toml
        field: project.version
        format: toml

      # Plain text version file
      - path: VERSION
        format: raw
```

## Coordinated Versioning Configuration

For projects with multiple `.version` files that all sync to root:

### Basic Coordinated Setup

```yaml
# .sley.yaml (root)
path: .version

plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      # Sync manifest files to root
      - path: package.json
        field: version
        format: json

      # Sync submodule .version files to root
      - path: services/api/.version
        format: raw
      - path: services/web/.version
        format: raw
      - path: packages/shared/.version
        format: raw
```

### Full-Stack Application

```yaml
# .sley.yaml (root)
path: .version

plugins:
  commit-parser: true
  tag-manager:
    enabled: true
    tag-prereleases: true

  changelog-generator:
    enabled: true
    mode: versioned

  dependency-check:
    enabled: true
    auto-sync: true
    files:
      # Root manifest
      - path: package.json
        field: version
        format: json

      # Backend .version (for Go embed)
      - path: backend/.version
        format: raw

      # Backend manifest
      - path: backend/go.mod
        field: module
        format: regex
        pattern: 'module github.com/myorg/myapp/backend v(\d+\.\d+\.\d+(?:-[\w.]+)?(?:\+[\w.]+)?)'

      # Frontend .version (for Vite plugin)
      - path: frontend/.version
        format: raw

      # Frontend manifest
      - path: frontend/package.json
        field: version
        format: json
```

### Microservices with Shared Libraries

```yaml
# .sley.yaml (root)
path: .version

plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      # Service .version files
      - path: services/api/.version
        format: raw
      - path: services/auth/.version
        format: raw
      - path: services/notifications/.version
        format: raw

      # Service manifests
      - path: services/api/package.json
        field: version
        format: json
      - path: services/auth/Cargo.toml
        field: package.version
        format: toml
      - path: services/notifications/pyproject.toml
        field: project.version
        format: toml

      # Shared library .version files
      - path: packages/shared-types/.version
        format: raw
      - path: packages/shared-utils/.version
        format: raw

      # Shared library manifests
      - path: packages/shared-types/package.json
        field: version
        format: json
      - path: packages/shared-utils/package.json
        field: version
        format: json
```

## Independent Versioning Configuration (Workspace)

For projects where each module has its own independent version:

### Basic Workspace Setup

```yaml
# .sley.yaml (root)
workspace:
  discovery:
    enabled: true
    recursive: true
    module_max_depth: 10
    manifest_max_depth: 3
    exclude:
      - "testdata"
      - "examples"
      - "node_modules"
```

### Explicit Module Definition

```yaml
# .sley.yaml (root)
workspace:
  discovery:
    enabled: false  # Disable auto-discovery

  modules:
    - name: api
      path: ./services/api/.version
      enabled: true

    - name: auth
      path: ./services/auth/.version
      enabled: true

    - name: web
      path: ./apps/web/.version
      enabled: true

    - name: legacy
      path: ./legacy/.version
      enabled: false  # Skip this module
```

### Workspace with Auto-Discovery and Exclusions

```yaml
# .sley.yaml (root)
workspace:
  discovery:
    enabled: true
    recursive: true
    module_max_depth: 10
    manifest_max_depth: 3

    # Exclude patterns
    exclude:
      - "testdata"
      - "examples"
      - "fixtures"
      - "**/test-data"
      - "node_modules"
      - "vendor"
      - ".cache"
      - "dist"
      - "build"

plugins:
  commit-parser: true
  tag-manager:
    enabled: true
```

### Module-Specific Configuration

Each module can have its own `.sley.yaml` that overrides workspace defaults:

```yaml
# services/api/.sley.yaml
path: .version

plugins:
  # Disable commit parser for this module
  commit-parser: false

  # Enable dependency-check for this module's manifests
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
      - path: package-lock.json
        field: version
        format: json
```

```yaml
# services/auth/.sley.yaml
path: .version

plugins:
  commit-parser: true

  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: Cargo.toml
        field: package.version
        format: toml
      - path: Cargo.lock
        field: version
        format: toml
```

### Workspace with Mixed Configurations

```yaml
# .sley.yaml (root)
workspace:
  discovery:
    enabled: true
    recursive: true
    exclude:
      - "testdata"
      - "examples"

  # Explicit definitions override discovery
  modules:
    - name: api
      path: ./services/api/.version
      enabled: true

    - name: web
      path: ./apps/web/.version
      enabled: true

# Global plugins apply to all modules unless overridden
plugins:
  commit-parser: true
  tag-manager:
    enabled: true
    tag-prereleases: true

  changelog-generator:
    enabled: true
    mode: versioned
```

## Advanced Patterns

### Conditional Syncing Based on Environment

```yaml
# .sley.yaml
path: .version

plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      # Development and production manifests
      - path: package.json
        field: version
        format: json

      # Docker Compose for development
      - path: docker-compose.yml
        field: services.app.image
        format: regex
        pattern: 'myapp:v?(\d+\.\d+\.\d+(?:-[\w.]+)?)'

      # Kubernetes manifests for production
      - path: k8s/deployment.yaml
        field: spec.template.spec.containers[0].image
        format: regex
        pattern: 'myapp:v?(\d+\.\d+\.\d+(?:-[\w.]+)?)'
```

### Nested Module Hierarchy

```yaml
# .sley.yaml (root)
workspace:
  discovery:
    enabled: true
    recursive: true
    module_max_depth: 15  # Allow deep nesting
    manifest_max_depth: 3
    exclude:
      - "testdata"
      - "examples"

  # Explicit modules for complex hierarchies
  modules:
    # Top-level services
    - name: api-gateway
      path: ./services/gateway/.version
      enabled: true

    # Nested backend services
    - name: api-users
      path: ./services/backend/users/.version
      enabled: true

    - name: api-orders
      path: ./services/backend/orders/.version
      enabled: true

    # Frontend apps
    - name: web-admin
      path: ./apps/admin/.version
      enabled: true

    - name: web-customer
      path: ./apps/customer/.version
      enabled: true

    # Shared packages
    - name: pkg-core
      path: ./packages/core/.version
      enabled: true
```

## Configuration Tips

### Choosing Between Auto-Discovery and Explicit Modules

**Use auto-discovery when:**
- Your modules follow a consistent directory structure
- You add/remove modules frequently
- You want minimal configuration maintenance

**Use explicit modules when:**
- You have modules in non-standard locations
- You need to disable specific modules
- You want complete control over which modules are managed

### Sync Direction Best Practices

1. **Single-Root**: All files sync TO `.version`
2. **Coordinated Versioning**: All files sync TO root `.version`
3. **Independent Versioning**: Each module's manifests sync TO that module's `.version`

### Performance Considerations

```yaml
# For large monorepos, tune discovery depth
workspace:
  discovery:
    enabled: true
    module_max_depth: 8    # Reduce if .version files are shallow
    manifest_max_depth: 2  # Reduce if manifests are close to modules

    # Use specific exclusions to skip large directories
    exclude:
      - "node_modules"
      - "vendor"
      - ".git"
      - "dist"
      - "build"
      - "coverage"
      - ".next"
      - ".nuxt"
```

## What's Next?

- [Workflows](/guide/monorepo/workflows) - Practical examples and command usage
- [Versioning Models](/guide/monorepo/versioning-models) - Understand the three models
- [Dependency Check Plugin](/plugins/dependency-check) - Detailed sync configuration
- [Workspace Configuration Reference](/reference/sley-yaml#workspace-configuration) - Complete reference
