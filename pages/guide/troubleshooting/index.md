---
title: "Troubleshooting Guide"
description: "Solutions for common sley issues including version file errors, plugin problems, CI/CD failures, and configuration troubleshooting"
head:
  - - meta
    - name: keywords
      content: sley, troubleshooting, errors, debugging, common issues, solutions, FAQ
---

# {{ $frontmatter.title }}

Solutions to common issues. If you don't find your issue here, check [GitHub Issues](https://github.com/indaco/sley/issues) or open a new one.

## Quick Diagnostics

```bash
# Validate version file and configuration
sley doctor

# Discover modules and version sources
sley discover

# Check sley version
sley --version
```

## Browse by Category

| Category                                | Common Issues                                                                                |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| [.version File Issues](./version-file)  | File not found, invalid format, permission denied, empty file                                |
| [Plugin Errors](./plugins)              | Plugin not found, release gate validation, changelog generation, dependency check            |
| [Git & Tag Issues](./git-and-tags)      | Tag already exists, tag create --all failures, push failures, GPG signing, partial failures  |
| [CI/CD Issues](./ci-cd)                 | Interactive prompts, permission denied, detached HEAD, changes not committed                 |
| [Monorepo Issues](./monorepo)           | No modules found, wrong tag prefix, tag create --all bugs, mismatch warnings, workspace init |
| [Configuration Issues](./configuration) | Invalid YAML, {module_path} without workspace, invalid versioning value                      |
| [Advanced Topics](./advanced)           | Debugging workflows, version rollback, performance optimization, migration                   |

## Getting Help

If you can't resolve your issue:

1. Check [GitHub Issues](https://github.com/indaco/sley/issues) for similar problems
2. Gather diagnostic info:

```bash
sley --version
sley doctor
sley discover
git --version
cat .sley.yaml
env | grep SLEY
```

3. Open a new issue with the output above

## See Also

- [CLI Reference](/reference/cli) - Complete command reference
- [Configuration](/config/) - Configuration options and precedence
- [CI/CD Integration](/guide/ci-cd) - CI/CD-specific solutions
- [Monorepo Support](/guide/monorepo/) - Multi-module troubleshooting
- [Plugin System](/plugins/) - Plugin-specific documentation
