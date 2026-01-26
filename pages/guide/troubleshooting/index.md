---
title: "Troubleshooting Guide"
description: "Solutions for common sley issues including version file errors, plugin problems, CI/CD failures, and configuration troubleshooting"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, errors, debugging, common issues, solutions, FAQ
---

# {{ $frontmatter.title }}

This guide provides solutions to common issues you may encounter when using sley. If you don't find your issue here, please check the [GitHub Issues](https://github.com/indaco/sley/issues) or open a new one.

## Quick Diagnostics

### Using the `doctor` command

Validate your `.version` file and configuration:

```bash
sley doctor
# Or use the alias
sley validate
```

This checks:

- Whether `.version` file exists and is readable
- Whether the version format is valid (semantic versioning)
- Basic configuration validation

### Enable debug mode

For detailed troubleshooting output, use the verbose flag with any command:

```bash
# Most commands support verbose output
sley bump patch --verbose
sley show --all --verbose
sley discover --format json
```

You can also check your configuration:

```bash
# Verify sley.yaml is being read correctly
cat .sley.yaml

# Check current version
sley show

# Discover modules and version sources (monorepo)
sley discover
```

## Browse by Category

Find solutions based on the type of issue you're experiencing:

| Category                                | Common Issues                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| [.version File Issues](./version-file)  | File not found, invalid format, permission denied, empty file                     |
| [Plugin Errors](./plugins)              | Plugin not found, release gate validation, changelog generation, dependency check |
| [Git & Tag Issues](./git-and-tags)      | Tag already exists, not a git repository, push failures, GPG signing              |
| [CI/CD Issues](./ci-cd)                 | Interactive prompts, permission denied, detached HEAD, changes not committed      |
| [Monorepo Issues](./monorepo)           | No modules found, module not detected, interactive mode, parallel execution       |
| [Configuration Issues](./configuration) | Invalid YAML, configuration not being applied                                     |
| [Advanced Topics](./advanced)           | Debugging workflows, version rollback, performance optimization, migration        |

## Getting Help

If you can't resolve your issue:

1. Check the [GitHub Issues](https://github.com/indaco/sley/issues) for similar problems
2. Enable verbose output and include it in your bug report
3. Provide your `.sley.yaml` configuration
4. Include sley version: `sley --version`
5. Describe your environment (OS, CI/CD platform, git version)

**Create a bug report**:

```bash
# Gather diagnostic information
sley --version
sley doctor
sley discover
git --version
cat .sley.yaml
env | grep SLEY

# Include this information when opening an issue
```

## See Also

- [CLI Reference](/reference/cli) - Complete command reference
- [Configuration](/config/) - Configuration options and precedence
- [CI/CD Integration](/guide/ci-cd) - CI/CD-specific solutions
- [Monorepo Support](/guide/monorepo) - Multi-module troubleshooting
- [Plugin System](/plugins/) - Plugin-specific documentation
