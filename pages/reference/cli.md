---
title: "CLI Reference"
description: "Complete command-line reference for all sley commands, options, and flags including init, bump, set, show, validate, tag, and changelog"
head:
  - - meta
    - name: keywords
      content: sley, CLI, command-line, reference, commands, options, flags, documentation, API reference
---

# {{ $frontmatter.title }}

Complete reference for all sley commands and options.

::: tip
For configuration file options, see [Configuration](/config/). For environment variables, see [Environment Variables](/config/env-vars).
:::

## Usage

```bash
sley [global options] [command [command options]]
```

## Global Options

| Option                       | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| `--path`, `-p` `<string>`    | Path to .version file (default: `.version`)                    |
| `--strict`, `--no-auto-init` | Fail if .version file is missing (disable auto-initialization) |
| `--no-color`                 | Disable colored output                                         |
| `--help`, `-h`               | Show help                                                      |
| `--version`, `-v`            | Print the version                                              |

## Commands

### `init`

Initialize `.version` file and `.sley.yaml` configuration.

```bash
sley init [options]
```

| Option        | Description                                               |
| ------------- | --------------------------------------------------------- |
| `--yes`, `-y` | Use defaults without prompts (commit-parser, tag-manager) |
| `--template`  | Use a pre-configured template                             |
| `--enable`    | Comma-separated list of plugins to enable                 |
| `--workspace` | Initialize as monorepo with workspace configuration       |
| `--migrate`   | Detect version from existing files (package.json, etc.)   |
| `--force`     | Overwrite existing .sley.yaml                             |

### `show`

Display the current version.

```bash
sley show [options]
```

| Option           | Description                              |
| ---------------- | ---------------------------------------- |
| `--strict`       | Fail if .version file is missing         |
| `--all`, `-a`    | Show versions for all discovered modules |
| `--module`, `-m` | Show version for specific module by name |
| `--format`       | Output format: text, json, table         |

### `set`

Set the version manually.

```bash
sley set <version> [options]
```

| Option   | Description                          |
| -------- | ------------------------------------ |
| `--pre`  | Set pre-release label (e.g., beta.1) |
| `--meta` | Set build metadata (e.g., ci.001)    |

### `bump`

Bump semantic version.

```bash
sley bump <patch|minor|major|pre|auto|release> [options]
```

| Option                | Description                                   |
| --------------------- | --------------------------------------------- |
| `--pre`               | Set pre-release label after bump              |
| `--meta`              | Set build metadata after bump                 |
| `--preserve-meta`     | Keep existing build metadata                  |
| `--label`             | Override bump type (for `auto` subcommand)    |
| `--skip-hooks`        | Skip pre-release hooks and extensions         |
| `--all`, `-a`         | Operate on all discovered modules             |
| `--module`, `-m`      | Operate on specific module by name            |
| `--modules`           | Operate on multiple modules (comma-separated) |
| `--pattern`           | Operate on modules matching glob pattern      |
| `--yes`, `-y`         | Auto-select all modules without prompting     |
| `--non-interactive`   | Disable interactive prompts                   |
| `--parallel`          | Execute operations in parallel                |
| `--fail-fast`         | Stop on first error (default)                 |
| `--continue-on-error` | Continue even if some modules fail            |
| `--quiet`, `-q`       | Suppress per-module output                    |

### `pre`

Set pre-release label.

```bash
sley pre <label>
```

### `validate` / `doctor`

Validate `.version` file(s) and configuration.

```bash
sley validate
sley doctor
```

### `tag`

Manage git tags for versions.

```bash
sley tag <subcommand> [options]
```

| Subcommand          | Description                    |
| ------------------- | ------------------------------ |
| `create`            | Create tag for current version |
| `create --push`     | Create and push tag            |
| `list`              | List version tags              |
| `push [tag-name]`   | Push tag to remote             |
| `delete <tag-name>` | Delete a tag                   |

### `changelog`

Manage changelog files.

```bash
sley changelog <subcommand> [options]
```

| Subcommand | Description                     |
| ---------- | ------------------------------- |
| `merge`    | Merge versioned changelog files |

| Option              | Description                 |
| ------------------- | --------------------------- |
| `--changes-dir`     | Path to changes directory   |
| `--output`          | Output file path            |
| `--header-template` | Custom header template file |

### `extension`

Manage extensions for sley.

```bash
sley extension <subcommand>
```

### `modules` / `mods`

Manage and discover modules in workspace.

```bash
sley modules <subcommand> [options]
sley mods <subcommand> [options]
```

| Subcommand | Description                 |
| ---------- | --------------------------- |
| `list`     | List all discovered modules |
| `discover` | Test discovery settings     |

| Option      | Description                      |
| ----------- | -------------------------------- |
| `--verbose` | Show detailed output             |
| `--format`  | Output format: text, json, table |

### `help`

Shows a list of commands or help for one command.

```bash
sley help [command]
sley -h
```

## See Also

- [Usage Guide](/guide/usage) - Detailed command examples and workflows
- [.sley.yaml Reference](/reference/sley-yaml) - Configuration file options
- [Environment Variables](/config/env-vars) - Configure via environment
- [Plugin System](/plugins/) - Plugin configuration and usage
- [Monorepo Support](/guide/monorepo) - Multi-module command flags
- [Troubleshooting](/guide/troubleshooting/) - Common command issues
