---
title: "Environment Variables"
description: "Configure sley using environment variables like SLEY_PATH, CI mode detection, and NO_COLOR for CI/CD pipelines and automation"
head:
  - - meta
    - name: keywords
      content: sley, environment variables, env vars, SLEY_PATH, CI mode, configuration, automation, CI/CD
---

# {{ $frontmatter.title }}

sley supports configuration through environment variables. Environment variables take precedence over `.sley.yaml` but are overridden by command-line flags.

## Available Variables

| Variable    | Description                                 | Default    |
| ----------- | ------------------------------------------- | ---------- |
| `SLEY_PATH` | Path to the .version file                   | `.version` |
| `CI`        | Enables CI mode (disables interactive mode) | -          |
| `NO_COLOR`  | Disables colored output                     | -          |

## SLEY_PATH

Specify a custom path to the `.version` file:

```bash
export SLEY_PATH=./my-folder/.version
sley show
# => Reads from ./my-folder/.version
```

This is equivalent to using the `--path` flag:

```bash
sley show --path ./my-folder/.version
```

## CI Mode

When running in CI/CD environments, sley automatically detects common CI environment variables and enables non-interactive mode.

Detected CI environments:

- **GitHub Actions**: `GITHUB_ACTIONS=true`
- **GitLab CI**: `GITLAB_CI=true`
- **CircleCI**: `CIRCLECI=true`
- **Travis CI**: `TRAVIS=true`
- **Jenkins**: `JENKINS_URL` is set
- **Generic**: `CI=true`

You can also explicitly enable CI mode:

```bash
CI=true sley bump patch
```

In CI mode:

- Interactive prompts are disabled
- Multi-module operations default to `--all`
- Output is optimized for logs

## NO_COLOR

Disable colored output:

```bash
NO_COLOR=1 sley show
```

This is equivalent to using the `--no-color` flag:

```bash
sley show --no-color
```

::: tip Precedence
Environment variables override `.sley.yaml` settings but are overridden by command-line flags. See [Configuration](/config/) for the full precedence order.
:::

## Usage Examples

### CI/CD Pipeline

```bash
# GitHub Actions
- name: Bump version
  env:
    CI: true
  run: sley bump patch --strict

# GitLab CI
version:bump:
  script:
    - export SLEY_PATH=./src/.version
    - sley bump patch
```

### Local Development

```bash
# Set default path for session
export SLEY_PATH=./packages/core/.version
sley show
sley bump patch

# Or use .env file with direnv
echo 'export SLEY_PATH=./packages/core/.version' >> .envrc
direnv allow
```

### Scripting

```bash
#!/bin/bash
# Version bump script

# Disable colors for log parsing
export NO_COLOR=1

# Use specific version file
export SLEY_PATH="./app/.version"

# Get current version
CURRENT=$(sley show)
echo "Current version: $CURRENT"

# Bump version
sley bump patch
NEW=$(sley show)
echo "New version: $NEW"
```

## See Also

- [Configuration](/config/) - Configuration methods and precedence
- [.sley.yaml Reference](/reference/sley-yaml) - Configuration file reference
- [CLI Reference](/reference/cli) - Command-line flags
- [CI/CD Integration](/guide/ci-cd) - Environment variable usage in pipelines
- [Monorepo Support](/guide/monorepo) - SLEY_PATH with multi-module projects
- [Troubleshooting](/guide/troubleshooting/) - Common environment variable issues
