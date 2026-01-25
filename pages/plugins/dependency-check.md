---
title: "Dependency Check Plugin"
description: "Sync versions across package.json, Cargo.toml, and other files. Validate version consistency with automatic synchronization support"
head:
  - - meta
    - name: keywords
      content: sley, dependency check, version sync, cross-file sync, package.json, Cargo.toml, version consistency, automation
---

# {{ $frontmatter.title }}

The dependency check plugin validates and synchronizes version numbers across multiple files in your repository. This ensures consistency between your `.version` file and other version declarations in package manifests, build files, and source code.

<PluginMeta :enabled="false" type="sync" />

## Features

- Validates version consistency across multiple file formats
- Automatically syncs versions during bumps (optional)
- Supports JSON, YAML, TOML, raw text, and regex patterns
- Handles nested fields with dot notation
- Normalizes version formats (e.g., `1.2.3` matches `v1.2.3`)

## Configuration

Enable and configure in `.sley.yaml`:

::: tip Complete Example
View the [dependency-check.yaml example](https://github.com/indaco/sley/blob/main/docs/plugins/examples/dependency-check.yaml) for all available options.
:::

```yaml
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
      - path: Chart.yaml
        field: version
        format: yaml
```

### Configuration Options

| Option      | Type  | Default | Description                            |
| ----------- | ----- | ------- | -------------------------------------- |
| `enabled`   | bool  | false   | Enable/disable the plugin              |
| `auto-sync` | bool  | false   | Automatically sync versions after bump |
| `files`     | array | []      | List of files to check/sync            |

### File Configuration

| Field     | Type   | Required | Description                                           |
| --------- | ------ | -------- | ----------------------------------------------------- |
| `path`    | string | yes      | File path relative to repository root                 |
| `format`  | string | yes      | File format: `json`, `yaml`, `toml`, `raw`, `regex`   |
| `field`   | string | no       | Dot-notation path to version field (JSON/YAML/TOML)   |
| `pattern` | string | no       | Regex pattern with capturing group (for regex format) |

## Supported Formats

| Format  | Field Required | Pattern Required | Example Use Case                   |
| ------- | -------------- | ---------------- | ---------------------------------- |
| `json`  | yes            | no               | `package.json`, `composer.json`    |
| `yaml`  | yes            | no               | `Chart.yaml`, `pubspec.yaml`       |
| `toml`  | yes            | no               | `Cargo.toml`, `pyproject.toml`     |
| `raw`   | no             | no               | `VERSION` file (entire content)    |
| `regex` | no             | yes              | Source code constants, build files |

### Format Examples

```yaml
files:
  # JSON with nested field
  - path: package.json
    field: version
    format: json

  # YAML
  - path: Chart.yaml
    field: version
    format: yaml

  # TOML with nested section
  - path: pyproject.toml
    field: tool.poetry.version
    format: toml

  # Raw file (entire content is version)
  - path: VERSION
    format: raw

  # Regex pattern (must have one capturing group)
  - path: src/version.go
    format: regex
    pattern: 'const Version = "(.*?)"'
```

## Behavior

### Validation (Before Bump)

The plugin validates that all configured files can be updated. If inconsistencies or errors are detected, the bump is aborted.

### Auto-Sync (After Bump)

With `auto-sync: true`, files are automatically updated after the `.version` file is bumped:

```bash
sley bump patch
# Version bumped from 1.2.3 to 1.2.4
# Synced version to 3 dependency file(s)
```

## Version Normalization

The plugin normalizes version strings for comparison:

- `1.2.3` matches `v1.2.3`
- `2.0.0-alpha` matches `v2.0.0-alpha`

## Integration with Other Plugins

```yaml
plugins:
  dependency-check:
    enabled: true
    auto-sync: true
    files:
      - path: package.json
        field: version
        format: json
  tag-manager:
    enabled: true
    prefix: "v"
```

Flow: dependency-check validates -> version updated -> files synced -> tag created

## Error Handling

| Error Type       | Behavior                                       |
| ---------------- | ---------------------------------------------- |
| File not found   | Bump aborted with error                        |
| Invalid format   | Bump aborted with parse error                  |
| Pattern mismatch | Bump aborted (regex must have capturing group) |

## Common errors

### `Error: version mismatch in package.json: expected 1.2.3, found 1.2.2`

**Cause:** Version in dependency file doesn't match the `.version` file when `auto-sync: false`.
**Solution:** Enable auto-sync or manually update the file.

```bash
# Option 1: Enable auto-sync
# In .sley.yaml:
plugins:
  dependency-check:
    auto-sync: true

# Option 2: Manually update package.json
# Update "version": "1.2.3" in package.json
```

### `Error: file not found: package.json`

**Cause:** Configured dependency file doesn't exist in the repository.
**Solution:** Verify the file path or remove it from configuration.

```yaml
# Check path is relative to repository root
plugins:
  dependency-check:
    files:
      - path: package.json # Must exist at root
      - path: services/api/package.json # Or subdirectory
```

### `Error: regex pattern must have exactly one capturing group`

**Cause:** Regex pattern for version matching has zero or multiple capturing groups.
**Solution:** Ensure pattern has exactly one group using `(...)`.

```yaml
# Incorrect patterns:
pattern: 'const Version = ".*?"'      # No capturing group
pattern: 'const (.*?) = "(.*?)"'      # Two capturing groups

# Correct pattern:
files:
  - path: src/version.go
    format: regex
    pattern: 'const Version = "(.*?)"'  # One capturing group
```

For more troubleshooting help, see the [Troubleshooting Guide](/guide/troubleshooting/).

## Best Practices

1. **Start with validation only** - Set `auto-sync: false` initially
2. **Test regex patterns** - Validate patterns before adding
3. **Commit atomically** - Commit all changed files together
4. **CI validation** - Add `sley show` to CI to catch inconsistencies

## Troubleshooting

| Issue              | Solution                                              |
| ------------------ | ----------------------------------------------------- |
| Plugin not running | Verify `enabled: true` in configuration               |
| Files not syncing  | Check `auto-sync: true` is set                        |
| Regex not matching | Ensure pattern has exactly one capturing group `(.*)` |

## Limitations

- Regex patterns must have exactly one capturing group
- File modifications use basic formatting (JSON: 2-space indent)
- Binary files are not supported

## See Also

- [Version Validator](/plugins/version-validator) - Enforce version policies
- [Tag Manager](/plugins/tag-manager) - Sync git tags with versions
- [Monorepo Support](/guide/monorepo) - Sync versions across multiple modules
- [CI/CD Integration](/guide/ci-cd) - Automate version syncing in pipelines
- [.sley.yaml Reference](/reference/sley-yaml) - File configuration options
- [Troubleshooting](/guide/troubleshooting/) - Common sync issues
