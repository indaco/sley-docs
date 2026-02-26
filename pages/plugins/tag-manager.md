---
title: "Tag Manager Plugin"
description: "Automatically create and manage git tags synchronized with version bumps. Supports annotated tags, GPG signing, and push automation"
head:
  - - meta
    - name: keywords
      content: sley, tag manager, git tags, version tags, GPG signing, annotated tags, automation, tag creation
---

# {{ $frontmatter.title }}

The tag manager plugin provides git tag management for your version workflow. It supports both manual tagging via `sley tag` commands and automatic tagging during version bumps.

<PluginMeta :enabled="false" type="automation">
While disabled by default, tag-manager is included in the recommended configuration created by <code>sley init --yes</code>.
</PluginMeta>

::: warning Required for `sley tag` commands
All `sley tag` subcommands (`create`, `list`, `push`, `delete`) require `enabled: true`. Without it, commands will fail with an error.
:::

## Features

- Manual tag management via `sley tag` commands
- Automatic git tag creation after version bumps (with `auto-create: true`)
- Pre-bump validation to ensure tag doesn't already exist (with `auto-create: true`)
- Configurable tag prefix (`v`, `release-`, or custom)
- Support for annotated and lightweight tags
- GPG signing support for signed tags
- Custom message templates with placeholders
- Optional automatic push to remote repository

## How It Works

The plugin operates in two modes depending on the `auto-create` setting:

### Manual mode (`auto-create: false`, default)

With just `enabled: true`, you get access to the `sley tag` commands for manual tag management. Version bumps are not affected — no tag validation or creation happens during `sley bump`.

### Automatic mode (`auto-create: true`)

With both `enabled: true` and `auto-create: true`, the plugin integrates with the bump workflow:

1. **Before bump**: validates that the target tag doesn't already exist (fail-fast)
2. **After bump**: runs post-bump actions (changelog, dependency sync, etc.)
3. **Commit**: stages and commits all bump-modified files using the `commit-message-template`
4. **Tag**: creates a git tag pointing to the release commit
5. Optionally pushes the tag to the remote repository

::: info
In automatic mode, sley commits all bump-modified files before creating the tag, ensuring the tag points to the correct release commit.
:::

## Configuration

Enable and configure in `.sley.yaml`:

::: tip Complete Example
View the [tag-manager.yaml example](https://github.com/indaco/sley/blob/main/docs/plugins/examples/tag-manager.yaml) for all available options.
:::

```yaml
plugins:
  tag-manager:
    enabled: true

    # Tag settings
    prefix: "v"
    annotate: true
    # Set to true to also tag pre-releases
    tag-prereleases: false

    # Automatic tagging during bump
    auto-create: true
    push: false
    # Commit message before tagging
    commit-message-template: "chore(release): {tag}"

    # Tag message
    message-template: "Release {version}"

    # GPG signing (optional)
    sign: false
    # Optional GPG key ID (uses git default if empty)
    signing-key: ""
```

### Configuration Options

| Option                    | Type   | Default                   | Description                                                               |
| ------------------------- | ------ | ------------------------- | ------------------------------------------------------------------------- |
| `enabled`                 | bool   | false                     | Enable the plugin (required for `sley tag` commands)                      |
| `prefix`                  | string | `"v"`                     | Prefix for tag names                                                      |
| `annotate`                | bool   | true                      | Create annotated tags (vs lightweight)                                    |
| `tag-prereleases`         | bool   | false                     | Create tags for pre-release versions                                      |
| `auto-create`             | bool   | false                     | Automatically validate and create tags during bumps                       |
| `push`                    | bool   | false                     | Push tags to remote after creation                                        |
| `commit-message-template` | string | `"chore(release): {tag}"` | Template for the commit message created before tagging (auto-create only) |
| `message-template`        | string | `"Release {version}"`     | Template for tag message with placeholders                                |
| `sign`                    | bool   | false                     | Create GPG-signed tags (implies annotated)                                |
| `signing-key`             | string | `""`                      | GPG key ID for signing (uses git default if empty)                        |

### Pre-release Tagging Behavior

The `tag-prereleases` option controls whether git tags are created for pre-release versions (e.g., `1.0.0-alpha.1`, `2.0.0-rc.1`):

- **`false` (default)**: Tags are only created for stable releases
- **`true`**: Tags are created for all versions, including pre-releases

### GPG Signing

The `sign` option enables GPG-signed tags using `git tag -s`.

```yaml
plugins:
  tag-manager:
    enabled: true
    sign: true # Enable GPG signing
    signing-key: "ABC123DEF456" # Optional: specific key ID
```

### Message Templates

Available placeholders:

| Placeholder    | Description                              | Example          |
| -------------- | ---------------------------------------- | ---------------- |
| `{version}`    | Full version string                      | `1.2.3-alpha.1`  |
| `{tag}`        | Full tag name with prefix                | `v1.2.3-alpha.1` |
| `{prefix}`     | Tag prefix                               | `v`              |
| `{date}`       | Current date (YYYY-MM-DD)                | `2024-06-15`     |
| `{major}`      | Major version number                     | `1`              |
| `{minor}`      | Minor version number                     | `2`              |
| `{patch}`      | Patch version number                     | `3`              |
| `{prerelease}` | Pre-release identifier (empty if stable) | `alpha.1`        |
| `{build}`      | Build metadata (empty if none)           | `build.123`      |

### Commit Message Template

When `auto-create: true`, sley commits all bump-modified files before creating the tag. The `commit-message-template` option controls the commit message for that commit. It supports the same placeholders as `message-template`.

```yaml
plugins:
  tag-manager:
    enabled: true
    auto-create: true
    commit-message-template: "release: {version} [{date}]"
```

## Tag Formats

| Version       | Prefix     | Tag Name         |
| ------------- | ---------- | ---------------- |
| 1.2.3         | `v`        | `v1.2.3`         |
| 1.2.3         | `release-` | `release-1.2.3`  |
| 1.2.3         | (empty)    | `1.2.3`          |
| 1.0.0-alpha.1 | `v`        | `v1.0.0-alpha.1` |

## Usage

### Manual Tagging with `sley tag`

With `enabled: true` (the default mode), use `sley tag` commands to manage tags independently from bumps:

```bash
# Create a tag for the current version
sley tag create

# Create and push in one step
sley tag create --push

# Create with custom message
sley tag create --message "Release v1.2.3 with new features"

# List existing version tags
sley tag list
sley tag list --limit 10

# Push a tag to remote
sley tag push              # Push tag for current version
sley tag push v1.2.3       # Push specific tag

# Delete a tag
sley tag delete v1.2.3
sley tag delete v1.2.3 --remote  # Also delete from remote
```

### Typical Manual Workflow

```bash
# 1. Bump version
sley bump minor
# => 1.3.0 (no tag created with auto-create: false)

# 2. Merge changelog (if using changelog-generator plugin)
sley changelog merge

# 3. Commit all changes
git add .
git commit -m "chore: release v1.3.0"

# 4. Create and push tag (points to the release commit)
sley tag create --push
```

### Automatic Tagging

With `auto-create: true`, the plugin integrates directly into the bump workflow:

```bash
sley bump patch
# => 1.2.4 (tag: v1.2.4)

# With push: true
sley bump minor
# => 1.3.0 (tag: v1.3.0, pushed)
```

### Tag Validation (Fail-Fast)

When `auto-create: true`, the plugin validates tag availability **before** bumping:

```bash
# If v1.3.0 already exists:
sley bump minor
# Error: tag v1.3.0 already exists
# Version file remains unchanged
```

::: info
Tag validation only applies to automatic mode. In manual mode, `sley tag create` validates at the time you run it.
:::

## Integration with Other Plugins

```yaml
plugins:
  commit-parser: true
  tag-manager:
    enabled: true
    auto-create: true
    prefix: "v"
    push: true
```

Flow (with `auto-create: true`): commit-parser analyzes -> tag-manager validates -> version updated -> changes committed -> tag created and pushed

## Best Practices

1. **Use annotated or signed tags** - Better metadata for releases
2. **Consistent prefix** - Choose one and stick with it (`v` is most common)
3. **CI/CD push** - Enable `push: true` only in CI/CD pipelines
4. **Local development** - Keep `push: false` for local work
5. **Clean tag list** - Keep `tag-prereleases: false` for stable releases only

## Common errors

### `Error: tag-manager plugin is not enabled`

**Cause:** Running `sley tag` commands without enabling the plugin in your configuration.
**Solution:** Enable the tag-manager plugin in `.sley.yaml`:

```yaml
plugins:
  tag-manager:
    enabled: true
```

### `Error: tag v1.2.3 already exists`

**Cause:** The target tag already exists in the repository.
**Solution:** Delete the existing tag or use a different version.

```bash
# Delete local tag
git tag -d v1.2.3

# Delete remote tag
git push origin :refs/tags/v1.2.3

# Then retry the bump
sley bump patch
```

### `Error: failed to create tag: not a git repository`

**Cause:** Running sley outside a git repository.
**Solution:** Initialize git with `git init` or navigate to a git repository.

```bash
git init
git add .version
git commit -m "Initial commit"
sley bump patch
```

### `Error: gpg: signing failed: No secret key`

**Cause:** GPG signing enabled but no key configured.
**Solution:** Configure GPG key with `git config user.signingkey YOUR_KEY_ID` or disable signing.

```bash
# Option 1: Configure GPG key
git config user.signingkey YOUR_KEY_ID

# Option 2: Disable signing temporarily
# In .sley.yaml:
plugins:
  tag-manager:
    sign: false
```

For more troubleshooting help, see the [Troubleshooting Guide](/guide/troubleshooting/).

## Troubleshooting

| Issue                         | Solution                                                  |
| ----------------------------- | --------------------------------------------------------- |
| `sley tag` commands fail      | Verify `enabled: true` in your `.sley.yaml`               |
| Tags not auto-created on bump | Verify both `enabled: true` and `auto-create: true`       |
| Tags not pushing              | Check `push: true` and remote configuration               |
| Wrong tag format              | Verify `prefix` configuration                             |
| Signing failed                | Check GPG key is configured: `git config user.signingkey` |

## See Also

- [Commit Parser](/plugins/commit-parser) - Auto-determine bump type from commits
- [Changelog Generator](/plugins/changelog-generator) - Generate changelogs before tagging
- [Pre-release Versions](/guide/pre-release) - Configure pre-release tagging
- [CI/CD Integration](/guide/ci-cd) - Automate tagging in pipelines
- [CLI Reference](/reference/cli#tag) - Manual tag management commands
- [Troubleshooting](/guide/troubleshooting/) - Common git tag issues
