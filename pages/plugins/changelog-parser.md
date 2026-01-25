---
title: "Changelog Parser Plugin"
description: "Infer version bump types from CHANGELOG.md entries. Supports Keep a Changelog, grouped, GitHub, and minimal formats for release planning"
head:
  - - meta
    - name: keywords
      content: sley, changelog parser, CHANGELOG.md, Keep a Changelog, bump type inference, release planning, version automation
---

# {{ $frontmatter.title }}

The changelog parser plugin parses CHANGELOG.md files to automatically infer version bump types and validate changelog completeness. It supports multiple changelog formats for symmetry with the changelog-generator plugin.

<PluginMeta :enabled="false" type="analyzer" />

## When to Use This Plugin

Choose **changelog-parser** when:

| Scenario                       | Why changelog-parser fits                                                     |
| ------------------------------ | ----------------------------------------------------------------------------- |
| **Release planning workflows** | You want to manually curate what goes in each release by editing CHANGELOG.md |
| **Manual version control**     | You prefer explicit control over when features are released                   |
| **Non-conventional commits**   | Your team doesn't follow conventional commit format                           |
| **Pre-release review**         | You want to review and edit changelog entries before bumping                  |

Choose **commit-parser** instead when:

| Scenario                  | Why commit-parser fits                                |
| ------------------------- | ----------------------------------------------------- |
| **Fully automated CI/CD** | You want hands-off version bumps based on commits     |
| **Conventional commits**  | Your team already uses `feat:`, `fix:`, etc. prefixes |
| **Frequent releases**     | You release often and want minimal manual steps       |

### Using Both Plugins Together

You can enable both plugins and control priority:

```yaml
plugins:
  changelog-parser:
    enabled: true
    priority: "changelog" # Changelog takes precedence
  commit-parser: true # Falls back to commits if no changelog entries
```

- **priority: "changelog"**: Reads CHANGELOG.md first; uses commits as fallback
- **priority: "commits"**: Uses commit history first; ignores changelog for bump inference

## Features

- **Multiple formats**: Supports `keepachangelog`, `grouped`, `github`, `minimal`, and `auto` detection
- Parses `## [Unreleased]` section to detect change types
- Infers bump type based on changelog subsections
- Validates that changelog has entries before allowing release
- Supports configurable priority over commit-based inference
- Works alongside the commit parser as fallback or primary parser
- Custom section mapping for grouped format

## Bump Type Inference Rules

| Changelog Section | Bump Type | Rationale                      |
| ----------------- | --------- | ------------------------------ |
| Removed           | major     | Breaking change (removal)      |
| Changed           | major     | Breaking change (modification) |
| Added             | minor     | New feature                    |
| Fixed             | patch     | Bug fix                        |
| Security          | patch     | Security fix                   |
| Deprecated        | patch     | Deprecation notice             |

Priority: major (Removed/Changed) > minor (Added) > patch (Fixed/Security/Deprecated)

## Configuration

Enable and configure in `.sley.yaml`:

::: tip Complete Example
View the [changelog-parser.yaml example](https://github.com/indaco/sley/blob/main/docs/plugins/examples/changelog-parser.yaml) for all available options.
:::

```yaml
plugins:
  changelog-parser:
    enabled: true
    path: "CHANGELOG.md"
    format: "auto" # keepachangelog, grouped, github, minimal, auto
    require-unreleased-section: true
    infer-bump-type: true
    priority: "changelog" # or "commits"
```

### Configuration Options

| Option                       | Type   | Default          | Description                                                      |
| ---------------------------- | ------ | ---------------- | ---------------------------------------------------------------- |
| `enabled`                    | bool   | false            | Enable/disable the plugin                                        |
| `path`                       | string | `CHANGELOG.md`   | Path to the changelog file                                       |
| `format`                     | string | `keepachangelog` | Changelog format: keepachangelog, grouped, github, minimal, auto |
| `require-unreleased-section` | bool   | true             | Enforce presence of Unreleased section                           |
| `infer-bump-type`            | bool   | true             | Enable automatic bump type inference                             |
| `priority`                   | string | `changelog`      | Which parser takes precedence: "changelog" or "commits"          |
| `grouped-section-map`        | map    | (defaults)       | Custom section name to category mapping (grouped format only)    |

## Usage with `bump auto`

```bash
# Edit your CHANGELOG.md
cat CHANGELOG.md
# ## [Unreleased]
# ### Added
# - New feature X
# ### Fixed
# - Bug fix Y

# Run bump auto - detects "minor" from "Added" section
sley bump auto
# Inferred from changelog: minor
# Bumped version from 1.2.3 to 1.3.0
```

## Supported Formats

### Keep a Changelog Format (default)

The standard [Keep a Changelog](https://keepachangelog.com) format:

```markdown
# Changelog

## [Unreleased]

### Added

- New feature description

### Changed

- Modified behavior description

### Fixed

- Bug fix description

## [1.2.3] - 2024-01-15

### Added

- Previous feature
```

**Supported Subsection Headers:**

- `### Added` - New features (minor)
- `### Changed` - Changes in existing functionality (major)
- `### Deprecated` - Soon-to-be removed features (patch)
- `### Removed` - Removed features (major)
- `### Fixed` - Bug fixes (patch)
- `### Security` - Security fixes (patch)

### Grouped Format

```markdown
## v1.2.0 - 2024-01-15

### Features

- **scope:** New feature description

### Bug Fixes

- Fixed something
```

**Custom Section Mapping:**

```yaml
plugins:
  changelog-parser:
    enabled: true
    format: grouped
    grouped-section-map:
      "New Features": "Added"
      "Bug Fixes": "Fixed"
      "Breaking": "Removed"
```

### GitHub Format

```markdown
## v1.2.0 - 2024-01-15

### Breaking Changes

- Something breaking by @user in #123

### What's Changed

- **scope:** description by @user in #123
```

### Minimal Format

```markdown
## v1.2.0

- [Feat] New feature description
- [Fix] Bug fix description
- [Breaking] Breaking change
```

### Auto-Detection

Use `format: auto` to let the parser detect the format automatically.

## Integration with Commit Parser

When both plugins are enabled:

- **priority: "changelog"**: Changelog parser runs first, commit parser is fallback
- **priority: "commits"**: Commit parser runs first, changelog parser is ignored

```yaml
plugins:
  changelog-parser:
    enabled: true
    priority: "changelog"
  commit-parser: true
```

## Comparison with Commit Parser

| Feature            | Changelog Parser                        | Commit Parser        |
| ------------------ | --------------------------------------- | -------------------- |
| Input source       | CHANGELOG.md                            | Git commit messages  |
| Format requirement | Multiple (keepachangelog, grouped, etc) | Conventional Commits |
| Manual control     | High                                    | Low                  |
| Automation level   | Semi-automatic                          | Fully automatic      |
| Best for           | Release planning                        | CI/CD workflows      |

## Troubleshooting

| Issue                     | Solution                                                      |
| ------------------------- | ------------------------------------------------------------- |
| Plugin not inferring type | Check `enabled: true`, `infer-bump-type: true`, `priority`    |
| Validation errors         | Verify `## [Unreleased]` exists with `###` subsections        |
| Priority conflicts        | Ensure plugin is in `.sley.yaml` and check `priority` setting |
| Wrong format detected     | Set explicit `format` instead of `auto`                       |

## See Also

- [Commit Parser](/plugins/commit-parser) - Auto-determine bump type from commits
- [Changelog Generator](/plugins/changelog-generator) - Generate changelogs from commits
- [Tag Manager](/plugins/tag-manager) - Create git tags after version bumps
- [Usage Guide](/guide/usage#smart-bump-logic-bump-auto) - Using bump auto command
- [.sley.yaml Reference](/reference/sley-yaml) - Plugin configuration
- [Troubleshooting](/guide/troubleshooting/) - Common changelog parsing issues
