---
title: "Usage Guide"
description: "Complete guide to using sley commands - init, bump, set, show, validate, and manage versions with pre-release support and git tag management"
head:
  - - meta
    - name: keywords
      content: sley, usage, commands, bump version, semantic versioning, git tags, pre-release, version management, CLI
---

# {{ $frontmatter.title }}

## Initialize project

### Interactive mode

Run `sley init` without flags to launch the interactive TUI where you can select which plugins to enable:

```bash
sley init
```

![Interactive plugin selection](/screenshots/sley_init_tui.png)

Use the keyboard to navigate and select plugins:

- **Space** / **x**: Toggle selection
- **Arrow keys**: Navigate up/down
- **/**: Filter plugins
- **Enter**: Confirm selection
- **a**: Select all
- **n**: Select none
- **Esc**: Cancel

### Non-interactive mode

For CI/CD pipelines or scripted setups, use the `--yes` flag to skip prompts:

```bash
# Use sensible defaults (commit-parser, tag-manager)
sley init --yes
# => Created .version with version 0.1.0
# => Created .sley.yaml with default plugins (commit-parser, tag-manager)

# Use a pre-configured template
sley init --template automation

# Enable specific plugins
sley init --enable commit-parser,tag-manager,changelog-generator

# Initialize as monorepo with workspace configuration
sley init --workspace --yes

# Force overwrite existing configuration
sley init --yes --force
```

### Migrate from existing version

If your project already has a version defined in `package.json`, `Cargo.toml`, or similar files, use `--migrate` to detect and import it:

```bash
sley init --migrate
```

![Version migration dialog](/screenshots/sley_init_migrate.png)

The migration feature will scan for version sources and prompt you to confirm before creating the `.version` file.

```bash
# Skip confirmation prompt
sley init --migrate --yes
```

### Available flags

| Flag           | Description                                               |
| -------------- | --------------------------------------------------------- |
| `--yes`, `-y`  | Use defaults without prompts (commit-parser, tag-manager) |
| `--template`   | Use a pre-configured template                             |
| `--enable`     | Comma-separated list of plugins to enable                 |
| `--workspace`  | Initialize as monorepo with workspace configuration       |
| `--migrate`    | Detect version from existing files (package.json, etc.)   |
| `--force`      | Overwrite existing .sley.yaml                             |
| `--path`, `-p` | Custom path for .version file                             |

### Available templates

| Template     | Plugins Enabled                                             |
| ------------ | ----------------------------------------------------------- |
| `basic`      | commit-parser                                               |
| `git`        | commit-parser, tag-manager                                  |
| `automation` | commit-parser, tag-manager, changelog-generator             |
| `strict`     | commit-parser, tag-manager, version-validator, release-gate |
| `full`       | All plugins enabled                                         |

## Display current version

```bash
# .version = 1.2.3
sley show
# => 1.2.3
```

```bash
# Fail if .version is missing (strict mode)
sley show --strict
# => Error: version file not found at .version
```

## Set version manually

```bash
sley set 2.1.0
# => .version is now 2.1.0
```

You can also set a pre-release version:

```bash
sley set 2.1.0 --pre beta.1
# => .version is now 2.1.0-beta.1
```

You can also attach build metadata:

```bash
sley set 1.0.0 --meta ci.001
# => .version is now 1.0.0+ci.001
```

Or combine both:

```bash
sley set 1.0.0 --pre alpha --meta build.42
# => .version is now 1.0.0-alpha+build.42
```

## Bump version

```bash
sley show
# => 1.2.3

sley bump patch
# => 1.2.4

sley bump minor
# => 1.3.0

sley bump major
# => 2.0.0

# .version = 1.3.0-alpha.1+build.123
sley bump release
# => 1.3.0
```

## Increment Pre-release (`bump pre`)

Increment only the pre-release portion without bumping the version number:

```bash
# .version = 1.0.0-rc.1
sley bump pre
# => 1.0.0-rc.2

# .version = 1.0.0-rc1
sley bump pre
# => 1.0.0-rc2

# Switch to a different pre-release label
# .version = 1.0.0-alpha.3
sley bump pre --label beta
# => 1.0.0-beta.1
```

You can also pass `--pre` and/or `--meta` flags to any bump:

```bash
sley bump patch --pre beta.1
# => 1.2.4-beta.1

sley bump minor --meta ci.123
# => 1.3.0+ci.123

sley bump major --pre rc.1 --meta build.7
# => 2.0.0-rc.1+build.7

# Skip pre-release hooks and extensions during bump
sley bump patch --skip-hooks
# => 1.2.4 (no hooks executed)
```

::: tip
By default, any existing build metadata (the part after `+`) is **cleared** when bumping the version.
:::

To **preserve** existing metadata, pass the `--preserve-meta` flag:

```bash
# .version = 1.2.3+build.789
sley bump patch --preserve-meta
# => 1.2.4+build.789

# .version = 1.2.3+build.789
sley bump patch --meta new.build
# => 1.2.4+new.build (overrides existing metadata)
```

## Smart bump logic (`bump auto`)

Automatically determine the next version:

```bash
# .version = 1.2.3-alpha.1
sley bump auto
# => 1.2.3

# .version = 1.2.3
sley bump auto
# => 1.2.4
```

Override bump with `--label`:

```bash
sley bump auto --label minor
# => 1.3.0

sley bump auto --label major --meta ci.9
# => 2.0.0+ci.9

sley bump auto --label patch --preserve-meta
# => bumps patch and keeps build metadata
```

Valid `--label` values: `patch`, `minor`, `major`.

## Validate .version file

Check whether the `.version` file exists and contains a valid semantic version:

```bash
# .version = 1.2.3
sley validate
# => Valid version file at ./<path>/.version
```

If the file is missing or contains an invalid value, an error is returned:

```bash
# .version = invalid-content
sley validate
# => Error: invalid version format: ...
```

## Manage Git tags

```bash
sley tag create             # Create tag for current version
sley tag create --push      # Create and push
sley tag list               # List version tags
```

See [Tag Manager](/plugins/tag-manager) for automatic tagging, GPG signing, and configuration options.

## Manage changelogs

```bash
sley changelog merge        # Merge versioned changelogs into CHANGELOG.md
```

See [Changelog Generator](/plugins/changelog-generator) for automatic changelog generation from commits.

## Rolling back a version change

If you need to undo a version bump:

```bash
# Manual method - set back to previous version
sley set 1.2.3

# Git method (if changes were committed)
git revert HEAD
# Or reset if not pushed yet
git reset --hard HEAD^

# If using tag-manager plugin, also delete the tag
git tag -d v1.2.4
# If tag was pushed to remote
git push origin :refs/tags/v1.2.4
```

::: warning
Automated rollback is not built into sley. Always track version changes in git for easy reversion.
:::

## What's Next?

Choose your path based on your needs:

**Ready to automate?**

- [CI/CD Integration](/guide/ci-cd) - Automate version bumps in pipelines
- [Plugin System](/plugins/) - Enable git tagging, changelogs, and more
- [Tag Manager](/plugins/tag-manager) - Automatic git tags and releases

**Working with pre-releases?**

- [Pre-release Versions](/guide/pre-release) - Alpha, beta, RC workflows
- [Changelog Generator](/plugins/changelog-generator) - Generate changelogs from commits

**Managing multiple modules?**

- [Monorepo Support](/guide/monorepo) - Multi-module version management
- [Workspace Configuration](/reference/sley-yaml#workspace-configuration) - Configure module discovery

**Need more details?**

- [CLI Reference](/reference/cli) - Complete command and flag reference
- [Troubleshooting](/guide/troubleshooting/) - Common issues and solutions
