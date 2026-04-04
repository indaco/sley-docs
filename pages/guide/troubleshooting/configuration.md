---
title: "Troubleshooting: Configuration Issues"
description: "Solutions for configuration errors including invalid YAML, workspace.versioning, and {module_path} misconfiguration"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, configuration, YAML, errors, sley.yaml, workspace, module_path
---

# {{ $frontmatter.title }}

This page covers common issues related to sley configuration.

## Config warning: `{module_path} used but no workspace detected`

**Cause**: The `tag-manager.prefix` contains `{module_path}` but workspace discovery is not enabled.

**Fix**: Add a `workspace` section to `.sley.yaml`:

```yaml
workspace:
  discovery:
    enabled: true

plugins:
  tag-manager:
    enabled: true
    prefix: "{module_path}/v"
```

## `versioning: invalid value` error

**Cause**: The `workspace.versioning` field has an unrecognized value.

**Fix**: Use one of the valid values or omit the field entirely:

- `independent` - each module versions separately
- `coordinated` - all modules share one version (default if omitted)

```yaml
workspace:
  versioning: independent
```

## `Error: .sley.yaml: invalid configuration`

**Cause**: YAML syntax error or invalid configuration values.

**Fix**: Common YAML mistakes:

**Tabs instead of spaces:**

```yaml
# Wrong - uses tabs
plugins:
	tag-manager: true

# Correct - uses spaces
plugins:
  tag-manager: true
```

**Missing colon:**

```yaml
# Wrong
plugins
  tag-manager: true

# Correct
plugins:
  tag-manager: true
```

**Unquoted special characters:**

```yaml
# Wrong
contributors:
  format: @{username}

# Correct
contributors:
  format: "@{username}"
```

## Configuration not being applied

**Cause**: Configuration precedence issue or file location problem.

**Fix**: Check these in order:

1. Verify `.sley.yaml` is in the project root: `ls -la .sley.yaml`
2. Check if `SLEY_PATH` env var is overriding: `env | grep SLEY`
3. Check if CLI flags are overriding config file settings
4. Validate the file is readable: `sley doctor`

**Precedence** (highest to lowest): CLI flags > env vars > `.sley.yaml` > defaults.

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [Configuration Reference](/config/) - Configuration options
- [.sley.yaml Reference](/reference/sley-yaml) - Complete YAML reference
- [Environment Variables](/config/env-vars) - Environment configuration
