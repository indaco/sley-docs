---
title: "Troubleshooting: Configuration Issues"
description: "Solutions for configuration errors including invalid YAML syntax and configuration not being applied"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, configuration, YAML, errors, sley.yaml
---

# {{ $frontmatter.title }}

This page covers common issues related to sley configuration.

## `Error: .sley.yaml: invalid configuration`

**Cause**: YAML syntax error or invalid configuration values.

**Solutions**:

```bash
# Validate YAML syntax
# Use a YAML linter or:
cat .sley.yaml

# Common YAML mistakes:
# - Incorrect indentation (use spaces, not tabs)
# - Missing colons
# - Unquoted special characters

# Example of correct format:
plugins:
  tag-manager:
    enabled: true
    prefix: "v"
  commit-parser: true
```

### Common YAML Syntax Errors

**Tabs instead of spaces**:

```yaml
# Wrong - uses tabs
plugins:
	tag-manager: true

# Correct - uses spaces (2 or 4)
plugins:
  tag-manager: true
```

**Missing colon**:

```yaml
# Wrong
plugins
  tag-manager: true

# Correct
plugins:
  tag-manager: true
```

**Unquoted special characters**:

```yaml
# Wrong - @ needs quotes
contributors:
  format: @{username}

# Correct
contributors:
  format: "@{username}"
```

## `Error: Configuration not being applied`

**Cause**: Configuration precedence issue or file location problem.

**Configuration Precedence** (highest to lowest):

1. Command-line flags
2. Environment variables
3. `.sley.yaml` configuration file
4. Default values

**Solutions**:

```bash
# Check if .sley.yaml is in the project root
ls -la .sley.yaml

# Verify SLEY_PATH is not overriding
env | grep SLEY

# Check for command-line flags overriding
# Instead of:
sley bump patch --path custom/.version
# Configure in .sley.yaml:
path: custom/.version
```

### Debugging Configuration

```bash
# Check what configuration sley is using
sley doctor

# Verify file is readable
cat .sley.yaml

# Check for hidden characters or encoding issues
file .sley.yaml
# Should show: ASCII text or UTF-8 Unicode text

# Validate YAML online or with a tool
# Example with Python:
python -c "import yaml; yaml.safe_load(open('.sley.yaml'))"
```

## See Also

- [Troubleshooting Hub](./) - All troubleshooting categories
- [Configuration Reference](/config/) - Configuration options
- [.sley.yaml Reference](/reference/sley-yaml) - Complete YAML reference
- [Environment Variables](/config/env-vars) - Environment configuration
