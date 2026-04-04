---
title: "Troubleshooting: Monorepo Issues"
description: "Solutions for monorepo and multi-module errors including no modules found, module not detected, tag creation, and workspace configuration issues"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, monorepo, multi-module, errors, module discovery, tag create --all, workspace
---

# {{ $frontmatter.title }}

This page covers common issues when working with monorepos and multi-module projects.

## `tag create --all` creates `v0.1.0` instead of `adapters/redis/v0.1.0`

**Cause**: The `tag-manager` prefix is missing the `{module_path}` placeholder.

**Fix**: Set `prefix: '{module_path}/v'` in your tag-manager config:

```yaml
plugins:
  tag-manager:
    enabled: true
    prefix: "{module_path}/v"
```

## `tag create --all` only tagged the first module

**Cause**: Historical bug where only the first module was processed. Fixed in current release.

**Fix**: Upgrade to the latest version of sley.

## `sley discover` shows version mismatch warnings unexpectedly

**Cause**: `workspace.versioning` is not set, so sley applies coordinated versioning semantics by default.

**Fix**: Add `versioning: independent` to your workspace config:

```yaml
workspace:
  versioning: independent
```

Valid values: `independent`, `coordinated`, or omit the field entirely.

## `init --workspace` did not create `.version` files in submodules

**Cause**: Old version behavior. Current releases create `.version` files per discovered module, set `prefix: '{module_path}/v'`, and set `versioning: independent`.

**Fix**: Upgrade and re-run:

```bash
sley init --yes --workspace
```

## `{module_path}` produces `/v0.1.0` for the root module (leading slash)

**Cause**: For the root module, `{module_path}` resolves to an empty string. Sley automatically trims the resulting leading `/`.

**Fix**: If you see a leading slash, upgrade to the latest version.

## `Error: no modules found`

**Cause**: No `.version` files exist in subdirectories, or discovery is misconfigured.

**Fix**:

```bash
# Run discovery to see what sley detects
sley discover

# Initialize modules
cd packages/api && sley init
cd packages/web && sley init
```

Check discovery config in `.sley.yaml`:

```yaml
workspace:
  discovery:
    enabled: true
    recursive: true
    module_max_depth: 10
    manifest_max_depth: 3
```

## `Error: module not detected`

**Cause**: Module is excluded by `.sleyignore` or default exclusion patterns.

**Fix**: Check `.sleyignore` for the module path. Default excluded patterns include `node_modules`, `.git`, `vendor`, `tmp`, `build`, `dist`, `.cache`, `__pycache__`. To explicitly include an otherwise excluded path:

```
!packages/legacy/
```

## `Error: interactive mode not working in monorepo`

**Cause**: Running in a CI/CD environment or non-interactive terminal.

**Fix**: Use explicit flags:

```bash
sley bump patch --all                    # All modules
sley bump patch --module api             # Specific module
sley bump patch --modules api,web        # Multiple modules
sley bump patch --pattern "services/*"   # Pattern match
```

## `Error: module versions out of sync`

**Cause**: Modules have drifted to inconsistent versions.

**Fix**:

```bash
# Check current versions
sley show --all

# Synchronize all modules to the same version
sley set 1.0.0 --all

# Or bump all together
sley bump patch --all
```

Note: behavior depends on your versioning model. With `versioning: independent`, each module manages its own `.version` file.

## `sley bump --all` does not create tags or changelogs

**Cause**: Older versions only updated `.version` files when `--all` was used. Pre-bump validations, post-bump actions (changelog, tags, audit log, dep-sync), and extension hooks were all skipped.

**Fix**: Upgrade to the latest version of sley. The full plugin pipeline (pre-bump validation, version write, post-bump actions, extension hooks, commit, tag) now runs per module.

## `sley bump --module <name>` skips changelog and tags

**Cause**: Same as above - older versions skipped post-bump actions for targeted module bumps.

**Fix**: Upgrade to the latest version of sley.

## All modules write changelog to the same file

**Cause**: Older versions did not scope changelog output per module; all submodule entries were written to the root `.changes/` directory or root `CHANGELOG.md` without namespacing.

**Fix**: Upgrade to the latest version of sley. Versioned mode now writes to `.changes/{module_path}/vX.Y.Z.md` for submodules; unified mode uses `## <module_name>` section headers.

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [Monorepo Support](/guide/monorepo/) - Monorepo configuration guide
- [CI/CD Issues](./ci-cd) - CI/CD-specific issues
