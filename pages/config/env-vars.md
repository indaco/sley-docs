---
title: "Environment Variables"
description: "Configure sley using environment variables for CI/CD pipelines and automation"
head:
  - - meta
    - name: keywords
      content: sley, environment variables, env vars, SLEY_PATH, CI mode, configuration, automation, CI/CD
---

# {{ $frontmatter.title }}

Environment variables override `.sley.yaml` settings but are overridden by command-line flags.

## Available Variables

| Variable     | Default    | Description                                | Example          |
| ------------ | ---------- | ------------------------------------------ | ---------------- |
| `SLEY_PATH`  | `.version` | Path to the `.version` file                | `./src/.version` |
| `SLEY_THEME` | `sley`     | TUI theme for interactive prompts          | `catppuccin`     |
| `NO_COLOR`   | -          | Set to any value to disable colored output | `1`              |

## SLEY_PATH

Specify a custom path to the `.version` file:

```bash
export SLEY_PATH=./my-folder/.version
sley show
```

Equivalent to `--path ./my-folder/.version`.

::: warning Security
The path must not contain `..`. sley rejects paths with path traversal sequences.
:::

## SLEY_THEME

Set the TUI theme for interactive prompts:

```bash
export SLEY_THEME=catppuccin
sley bump
```

Equivalent to `--theme catppuccin`. This variable is ignored when `--theme` is explicitly passed on the command line.

**Available themes**: `sley` (default), `base`, `base16`, `catppuccin`, `charm`, `dracula`

## NO_COLOR

Disable colored output:

```bash
NO_COLOR=1 sley show
```

Equivalent to `--no-color`. Any non-empty value disables color.

## CI Detection

sley automatically enables non-interactive mode when it detects any of these environment variables:

- `GITHUB_ACTIONS=true`
- `GITLAB_CI=true`
- `CIRCLECI=true`
- `TRAVIS=true`
- `JENKINS_URL` (any value)
- `CI=true`

In CI mode, interactive prompts are disabled and multi-module operations default to `--all`.

You can trigger CI mode explicitly:

```bash
CI=true sley bump patch
```

## Usage Examples

### CI/CD Pipeline

```yaml
# GitHub Actions
- name: Bump version
  run: sley bump patch --strict

# GitLab CI
version:bump:
  script:
    - export SLEY_PATH=./src/.version
    - sley bump patch
```

### Local Development

```bash
# Set default path and theme for the session
export SLEY_PATH=./packages/core/.version
export SLEY_THEME=dracula
sley show

# Or use direnv
echo 'export SLEY_PATH=./packages/core/.version' >> .envrc
echo 'export SLEY_THEME=catppuccin' >> .envrc
direnv allow
```

### Scripting

```bash
#!/bin/bash
export NO_COLOR=1
export SLEY_PATH="./app/.version"

CURRENT=$(sley show)
echo "Current version: $CURRENT"

sley bump patch
echo "New version: $(sley show)"
```

## See Also

- [Configuration](/config/) - Configuration methods and precedence
- [.sley.yaml Reference](/reference/sley-yaml) - Configuration file reference
- [CLI Reference](/reference/cli) - Command-line flags
- [CI/CD Integration](/guide/ci-cd) - Environment variable usage in pipelines
