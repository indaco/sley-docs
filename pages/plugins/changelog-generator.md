---
title: "Changelog Generator Plugin"
description: "Generate changelogs from conventional commits with support for Keep a Changelog, GitHub formats, commit grouping, and contributor tracking"
head:
  - - meta
    - name: keywords
      content: sley, changelog, changelog generator, conventional commits, Keep a Changelog, release notes, automation, git history
---

# {{ $frontmatter.title }}

The changelog generator plugin automatically generates changelog entries from conventional commits after version bumps. It supports multiple git hosting providers (GitHub, GitLab, Codeberg, Bitbucket, etc.) and can output to versioned files, a unified CHANGELOG.md, or both.

<PluginMeta :enabled="false" type="generator" />

## Features

- Automatic changelog generation from conventional commits
- Multiple changelog formats: `grouped` (default), `Keep a Changelog`, `GitHub`, or `minimal`
- Multiple output modes: versioned files, unified CHANGELOG.md, or both
- Commit grouping by type (feat, fix, docs, etc.) with customizable labels
- Full Changelog compare links between versions
- Commit and PR/MR links
- New Contributors section (first-time contributors detection)
- Contributors section
- Configurable exclude patterns for filtering commits
- Optional icons/emojis per commit group (grouped format only)

## Why Another Changelog Generator?

Excellent standalone tools like [changie](https://changie.dev/) and [git-cliff](https://git-cliff.org/) already exist. The changelog-generator plugin exists because sley aims to be a **unified versioning tool** - one tool that handles `.version` files across any language or stack, with changelog generation as part of that workflow.

- **One tool, one workflow**: `sley bump patch` handles version update, changelog, and tag in sequence
- **Shared configuration**: Everything lives in `.sley.yaml`
- **Plugin coordination**: Works with `commit-parser` and `tag-manager` in a defined execution order

For teams using versioned output mode, the generated `.changes/vX.Y.Z.md` files remain compatible with changie's merge workflow.

This plugin isn't trying to match the flexibility of dedicated changelog tools - it's providing a good-enough solution for projects that want everything in one place.

## How It Works

1. After a successful version bump, retrieves commits since the previous version
2. Parses commits using conventional commit format
3. Groups commits by type using configurable patterns
4. Generates markdown content with links to commits, PRs, and version comparisons
5. Writes to versioned file (`.changes/vX.Y.Z.md`), unified CHANGELOG.md, or both

## Quick Start

**1. Enable the plugin in `.sley.yaml`:**

```yaml
plugins:
  changelog-generator:
    enabled: true
```

**2. Bump your version:**

```bash
sley bump patch
```

**3. Find your generated changelog:**

The plugin creates `.changes/v1.2.4.md` (or appends to `CHANGELOG.md` if configured with `mode: "unified"`).

## Configuration

::: tip Complete Example
View the [changelog-generator.yaml example](https://github.com/indaco/sley/blob/main/docs/plugins/examples/changelog-generator.yaml) for all available options.
:::

```yaml
plugins:
  changelog-generator:
    enabled: true
    mode: "versioned"
    format: "grouped"
    repository:
      auto-detect: true
    contributors:
      enabled: true
```

### Configuration Options

| Option                     | Type   | Default          | Description                                                            |
| -------------------------- | ------ | ---------------- | ---------------------------------------------------------------------- |
| `enabled`                  | bool   | false            | Enable/disable the plugin                                              |
| `mode`                     | string | `"versioned"`    | Output mode: versioned, unified, or both                               |
| `format`                   | string | `"grouped"`      | Changelog format: "grouped", "keepachangelog", "github", or "minimal"  |
| `changes-dir`              | string | `".changes"`     | Directory for versioned changelog files                                |
| `changelog-path`           | string | `"CHANGELOG.md"` | Path to unified changelog file                                         |
| `merge-after`              | string | `"manual"`       | When to merge versioned files: "manual", "immediate", or "prompt"      |
| `header-template`          | string | (built-in)       | Path to custom header template                                         |
| `repository`               | object | auto-detect      | Git repository configuration for links                                 |
| `groups`                   | array  | (defaults)       | Full custom commit grouping rules                                      |
| `use-default-icons`        | bool   | false            | Enable predefined icons for all groups                                 |
| `group-icons`              | map    | (none)           | Add icons to default groups by label                                   |
| `breaking-changes-icon`    | string | `⚠️`             | Icon for Breaking Changes section (requires `use-default-icons: true`) |
| `exclude-patterns`         | array  | (defaults)       | Regex patterns for commits to exclude                                  |
| `include-non-conventional` | bool   | false            | Include non-conventional commits in "Other Changes"                    |
| `contributors`             | object | enabled          | Contributors section configuration                                     |

### Output Modes

- **versioned** (default): Creates `.changes/v{version}.md` files for each version
- **unified**: Appends to a single CHANGELOG.md file (newest first)
- **both**: Writes to both versioned files and unified changelog

#### Merge After Behavior (Versioned Mode Only)

The `merge-after` option **only applies when `mode: "versioned"`**. It controls when versioned changelog files are merged into a unified `CHANGELOG.md`:

- **manual** (default): No automatic merge. Use the `sley changelog merge` command when ready to consolidate
- **immediate**: Automatically merge into `CHANGELOG.md` right after generating the versioned file (similar to `mode: "both"`, but keeps versioned file as the source of truth)
- **prompt**: Ask for confirmation after changelog generation (automatically skips in CI/non-interactive environments)

```yaml
plugins:
  changelog-generator:
    enabled: true
    mode: "versioned"
    merge-after: "manual" # Choose: "manual", "immediate", or "prompt"
```

::: info
This option is ignored when `mode` is `"unified"` (already writes directly to CHANGELOG.md) or `"both"` (already writes to both). Using `merge-after: "immediate"` effectively gives you the same output as `mode: "both"`, while maintaining the versioned file workflow.
:::

#### Choosing the Right merge-after Option

| Option      | Best For                            | Behavior                                                                  |
| ----------- | ----------------------------------- | ------------------------------------------------------------------------- |
| `manual`    | Teams with PR-based review          | Generate `.changes/vX.Y.Z.md` only; run `sley changelog merge` when ready |
| `immediate` | Solo developers, automated releases | Auto-merge to CHANGELOG.md after each version bump                        |
| `prompt`    | Interactive local development       | Ask before merging (auto-skips in CI)                                     |

**Decision Guide:**

```text
Do you review changelogs in PRs?
├─ Yes → use "manual" (merge after PR approval)
└─ No → Do you want a unified CHANGELOG.md?
         ├─ Yes → use "immediate" or mode: "unified"
         └─ No → use "manual" (keep only versioned files)
```

**Common Configurations:**

```yaml
# PR-based workflow: review changelog in PR, merge later
plugins:
  changelog-generator:
    mode: "versioned"
    merge-after: "manual"

# Automated releases: always update CHANGELOG.md
plugins:
  changelog-generator:
    mode: "versioned"
    merge-after: "immediate"

# Or simply:
plugins:
  changelog-generator:
    mode: "unified"  # Writes directly to CHANGELOG.md
```

### Format Options

#### Format: `grouped` (Default)

Groups commits by configured labels with optional icons.

#### Format: `keepachangelog`

Follows the [Keep a Changelog](https://keepachangelog.com) specification.

| Conventional Commit Type               | Keep a Changelog Section |
| -------------------------------------- | ------------------------ |
| `feat`                                 | Added                    |
| `fix`                                  | Fixed                    |
| `refactor`, `perf`, `style`            | Changed                  |
| `revert`                               | Removed                  |
| `docs`, `test`, `chore`, `ci`, `build` | (skipped)                |
| Any type with `!` or `BREAKING CHANGE` | Breaking Changes         |

#### Format: `github`

Follows the GitHub release style with "What's Changed" section, inline contributor attribution (`by @username`), and PR references (`in #123`). Breaking changes appear in a separate section at the top.

**Example output structure:**

- Version header with date
- Breaking Changes section (with ⚠️)
- "What's Changed" section with scoped entries
- Contributor attribution (`by @username in #PR`)
- Full Changelog compare link

#### Format: `minimal`

A condensed format with abbreviated type prefixes (`[Feat]`, `[Fix]`, etc.) and no links, dates, or attribution. Useful for release notes or CI outputs.

**Example output:**

```text
## v1.2.0

- [Feat] Add new caching layer
- [Fix] Memory leak in parser
- [Breaking] Remove deprecated API
```

### Repository Configuration

```yaml
repository:
  auto-detect: true # recommended
  # Or specify manually:
  # provider: "gitlab"
  # host: "gitlab.mycompany.com"
  # owner: "team"
  # repo: "project"
```

### Provider-Specific URLs

The plugin generates correct URLs for each provider:

| Provider              | Compare URL Pattern                 | PR/MR Term |
| --------------------- | ----------------------------------- | ---------- |
| GitHub/Gitea/Codeberg | `/compare/v1.0.0...v1.1.0`          | PR         |
| GitLab                | `/-/compare/v1.0.0...v1.1.0`        | MR         |
| Bitbucket             | `/branches/compare/v1.1.0%0Dv1.0.0` | PR         |
| SourceHut             | `/log/v1.0.0..v1.1.0`               | -          |

### Icons Configuration

**Option 1: Default Icons**

```yaml
use-default-icons: true
```

**Option 2: Add Icons to Defaults**

```yaml
group-icons:
  Enhancements: "🚀"
  Fixes: "🩹"
```

**Option 3: Full Custom Groups**

```yaml
groups:
  - pattern: "^feat"
    label: "New Features"
    icon: "🚀"
  - pattern: "^fix"
    label: "Bug Fixes"
    icon: "🐛"
```

### Exclude Patterns

```yaml
exclude-patterns:
  - "^Merge"
  - "^WIP"
  - "^fixup!"
  - "^squash!"
```

### Non-Conventional Commits

By default, non-conventional commits are skipped with a warning. Set `include-non-conventional: true` to include them in an "Other Changes" section:

```yaml
plugins:
  changelog-generator:
    enabled: true
    include-non-conventional: true
```

### Custom Header Template

For unified changelogs, specify a custom header file:

```yaml
plugins:
  changelog-generator:
    enabled: true
    mode: "unified"
    header-template: ".changes/header.md"
```

The template supports placeholders: `{version}`, `{date}`, `{tag}`.

### Contributors Configuration

Lists unique contributors per version and detects first-time contributors.

| Option                    | Type   | Default | Description                                                                |
| ------------------------- | ------ | ------- | -------------------------------------------------------------------------- |
| `enabled`                 | bool   | true    | Enable/disable contributors section                                        |
| `format`                  | string | (link)  | Go template for contributor formatting                                     |
| `icon`                    | string | `❤️`    | Icon before "Contributors" header (requires `use-default-icons: true`)     |
| `show-new-contributors`   | bool   | true    | Enable "New Contributors" section                                          |
| `new-contributors-format` | string | (auto)  | Go template for new contributor entries                                    |
| `new-contributors-icon`   | string | `🎉`    | Icon before "New Contributors" header (requires `use-default-icons: true`) |

Template variables: `.Name`, `.Username`, `.Email`, `.Host`. New contributors also have `.PRNumber` and `.CommitHash`.

## Working with Changelogs

### Merging Versioned Files

```bash
sley changelog merge
sley changelog merge --changes-dir .changes --output CHANGELOG.md
sley changelog merge --header-template .changes/header.md
```

### PR Links in Changelog

The changelog is generated from **commit messages**. For PR numbers to appear in the changelog, they must be present in the commit message itself (format: `#123` or `(#123)`).

**Option 1: Use Squash and Merge (Recommended)**

GitHub's squash merge automatically appends `(#123)` to the commit message, which the parser will detect.

**Option 2: Include PR Numbers Manually**

Add the PR number to your commit messages using the format `type(scope): description (#PR)`.

**Option 3: Rebase and Merge**

Include the PR number in your original commit messages before merging.

### Changie Integration

For teams preferring [changie](https://changie.dev/), sley's versioned output is compatible with changie's merge workflow:

1. Configure sley with `mode: "versioned"`
2. Bump version with sley (generates `.changes/vX.Y.Z.md`)
3. Merge changelog with `changie merge`

Use sley's built-in merge for minimal tooling; use changie for advanced templating and team collaboration.

## Integration with Other Plugins

```yaml
plugins:
  commit-parser: true
  changelog-generator:
    enabled: true
  tag-manager:
    enabled: true
    prefix: "v"
    push: true
```

Flow: Version updated -> Changelog generated -> Tag created and pushed.

## Best Practices

1. **Use versioned mode for larger projects** - Individual files are easier to review in PRs
2. **Enable auto-detect** - Let the plugin determine repository info from git remote
3. **Customize groups for your workflow** - Match commit types to meaningful categories
4. **Exclude noise commits** - Filter merge commits and WIP entries
5. **Combine with tag-manager** - Create a complete release workflow
6. **Use squash merge for PR links** - Automatically includes PR numbers in changelog entries

## Troubleshooting

| Issue                   | Solution                                                      |
| ----------------------- | ------------------------------------------------------------- |
| Changelog not generated | Verify `enabled: true` and commits exist since last version   |
| Links not working       | Check `repository.auto-detect: true` and `git remote -v`      |
| Wrong grouping          | Verify conventional commit format: `type(scope): description` |
| Contributors missing    | Ensure `contributors.enabled: true`                           |

For detailed error messages and solutions, see the [Troubleshooting Guide](/guide/troubleshooting/plugins).

## See Also

- [Commit Parser](/plugins/commit-parser) - Parse conventional commits for version bumps
- [Changelog Parser](/plugins/changelog-parser) - Infer bump type from CHANGELOG.md
- [Tag Manager](/plugins/tag-manager) - Create git tags after changelog generation
- [CI/CD Integration](/guide/ci-cd) - Automate changelog generation in pipelines
- [CLI Reference](/reference/cli#changelog) - Changelog management commands
- [Troubleshooting](/guide/troubleshooting/) - Common changelog issues
